import { Command, Flags, Args } from '@oclif/core';
import * as fs from 'fs-extra';
import * as path from 'path';
import ytdl from '@distube/ytdl-core';
import ora from 'ora';
import chalk from 'chalk';
import * as cliProgress from 'cli-progress';
import figlet from 'figlet';
import inquirer from 'inquirer';
import { 
  validateYoutubeUrl, 
  getVideoInfo, 
  getBestFormat,
  getAudioOnlyFormat 
} from '../utils/youtube';
import { 
  formatBytes, 
  formatTime, 
  sanitizeFilename,
  formatError,
  formatSuccess,
  formatInfo
} from '../utils/formatter';
import { DownloadOptions, VideoFormat } from '../types';

export default class Download extends Command {
  static override id = 'download';
  static description = 'Download a YouTube video (interactive mode if no URL provided)';

  static examples = [
    '$ ytube-dl',
    '$ ytube-dl https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    '$ ytube-dl https://www.youtube.com/watch?v=dQw4w9WgXcQ --quality 1080p',
    '$ ytube-dl https://www.youtube.com/watch?v=dQw4w9WgXcQ --format mp3',
  ];

  static flags = {
    quality: Flags.string({
      char: 'q',
      description: 'video quality (e.g., 1080p, 720p, 480p)',
      options: ['1080p', '720p', '480p', '360p'],
    }),
    format: Flags.string({
      char: 'f',
      description: 'output format',
      options: ['mp4', 'mp3', 'webm'],
      default: 'mp4',
    }),
    output: Flags.string({
      char: 'o',
      description: 'output directory',
      default: process.cwd(),
    }),
    interactive: Flags.boolean({
      char: 'i',
      description: 'interactive mode',
      default: false,
    }),
  };

  static args = {
    url: Args.string({
      description: 'YouTube video URL',
      required: false,
    }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Download);
    
    console.log(chalk.cyan(figlet.textSync('YTUBE-DL', { font: 'Standard' })));
    console.log(chalk.gray('A modern CLI tool to download YouTube videos\n'));

    let url = args.url;
    let options: DownloadOptions = {
      quality: flags.quality,
      format: flags.format as 'mp4' | 'mp3' | 'webm',
      outputDir: flags.output,
    };

    // If no URL provided or interactive flag is set, go to interactive mode
    if (!url || flags.interactive) {
      const answers = await this.promptForOptions(url);
      url = answers.url || url;
      options = { ...options, ...answers };
    }

    // This should never happen now since interactive mode will always provide a URL
    if (!url) {
      this.error(formatError('No URL provided'));
      return;
    }

    if (!validateYoutubeUrl(url)) {
      this.error(formatError('Invalid YouTube URL'));
      return;
    }

    await this.downloadVideo(url, options);
  }

  private async promptForOptions(defaultUrl?: string): Promise<Partial<DownloadOptions> & { url?: string }> {
    const questions = [];

    if (!defaultUrl) {
      questions.push({
        type: 'input',
        name: 'url',
        message: 'YouTube video URL:',
        validate: (input: string) => {
          if (!validateYoutubeUrl(input)) {
            return 'Please enter a valid YouTube URL';
          }
          return true;
        },
      });
    }

    questions.push(
      {
        type: 'list',
        name: 'format',
        message: 'Select output format:',
        choices: [
          { name: 'MP4 (Video)', value: 'mp4' },
          { name: 'MP3 (Audio only)', value: 'mp3' },
          { name: 'WebM (Video)', value: 'webm' },
        ],
        default: 'mp4',
      },
      {
        type: 'list',
        name: 'quality',
        message: 'Select video quality:',
        choices: [
          { name: '1080p (Full HD)', value: '1080p' },
          { name: '720p (HD)', value: '720p' },
          { name: '480p (SD)', value: '480p' },
          { name: '360p', value: '360p' },
          { name: 'Best available', value: undefined },
        ],
        when: (answers: { format: string }) => answers.format !== 'mp3',
      },
      {
        type: 'input',
        name: 'outputDir',
        message: 'Output directory:',
        default: process.cwd(),
      }
    );

    return inquirer.prompt(questions) as Promise<Partial<DownloadOptions> & { url?: string }>;
  }

  private async downloadVideo(url: string, options: DownloadOptions): Promise<void> {
    const spinner = ora('Fetching video information...').start();

    try {
      const videoInfo = await getVideoInfo(url);
      spinner.succeed(`Found: ${chalk.bold(videoInfo.title)}`);
      
      console.log(formatInfo(`Author: ${videoInfo.author}`));
      console.log(formatInfo(`Duration: ${formatTime(videoInfo.duration)}`));

      const outputDir = options.outputDir || process.cwd();
      await fs.ensureDir(outputDir);

      const filename = sanitizeFilename(videoInfo.title) + '.' + options.format;
      const outputPath = path.join(outputDir, filename);

      let format;
      if (options.format === 'mp3') {
        format = getAudioOnlyFormat(videoInfo.formats);
        if (!format) {
          throw new Error('No audio-only format found');
        }
      } else {
        format = getBestFormat(videoInfo.formats, options.quality);
        if (!format) {
          throw new Error('No suitable format found');
        }
      }

      console.log(formatInfo(`Quality: ${format.qualityLabel}`));
      console.log(formatInfo(`Output: ${outputPath}\n`));

      await this.performDownload(url, outputPath, format, options);

    } catch (error) {
      spinner.fail();
      this.error(formatError(error instanceof Error ? error.message : 'Download failed'));
    }
  }

  private async performDownload(url: string, outputPath: string, format: VideoFormat, options: DownloadOptions): Promise<void> {
    let stream;
    if (options.format === 'mp3') {
      // For audio-only, get the best audio stream
      stream = ytdl(url, { 
        quality: 'highestaudio',
        filter: 'audioonly'
      });
    } else {
      // For video, get streams with both video and audio
      stream = ytdl(url, { 
        quality: 'highest',
        filter: format => format.hasAudio && format.hasVideo
      });
    }
    const writeStream = fs.createWriteStream(outputPath);

    const startTime = Date.now();
    let downloaded = 0;
    let total = 0;
    let lastUpdate = Date.now();

    const progressSpinner = ora('Starting download...').start();

    stream.on('response', (response) => {
      total = parseInt(response.headers['content-length'] || '0');
      if (total > 0) {
        progressSpinner.text = `Downloading... 0% (0/${formatBytes(total)}) - 0 MB/s`;
      } else {
        progressSpinner.text = 'Downloading... (size unknown)';
      }
    });

    stream.on('data', (chunk) => {
      downloaded += chunk.length;
      const now = Date.now();
      
      // Update progress every 250ms to avoid too frequent updates
      if (now - lastUpdate > 250) {
        const elapsedTime = (now - startTime) / 1000;
        const speed = downloaded / elapsedTime;
        
        if (total > 0) {
          const percentage = Math.round((downloaded / total) * 100);
          const eta = (total - downloaded) / speed;
          progressSpinner.text = `Downloading... ${percentage}% (${formatBytes(downloaded)}/${formatBytes(total)}) - ${formatBytes(speed)}/s - ETA: ${formatTime(eta)}`;
        } else {
          progressSpinner.text = `Downloading... ${formatBytes(downloaded)} - ${formatBytes(speed)}/s`;
        }
        lastUpdate = now;
      }
    });

    stream.pipe(writeStream);

    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => {
        progressSpinner.succeed(`Downloaded successfully to ${outputPath}`);
        resolve();
      });

      writeStream.on('error', (error) => {
        progressSpinner.fail('Download failed');
        reject(error);
      });

      stream.on('error', (error) => {
        progressSpinner.fail('Download failed');
        reject(error);
      });
    });
  }
}