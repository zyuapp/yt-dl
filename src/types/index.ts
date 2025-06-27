export interface VideoInfo {
  title: string;
  duration: number;
  author: string;
  videoId: string;
  formats: VideoFormat[];
}

export interface VideoFormat {
  quality: string;
  qualityLabel: string;
  container: string;
  hasAudio: boolean;
  hasVideo: boolean;
  url: string;
  contentLength?: string;
}

export interface DownloadOptions {
  quality?: string;
  format?: 'mp4' | 'mp3' | 'webm';
  outputDir?: string;
  outputFilename?: string;
}

export interface DownloadProgress {
  percent: number;
  downloaded: number;
  total: number;
  speed: number;
  eta: number;
}