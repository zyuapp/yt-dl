import ytdl from '@distube/ytdl-core';
import { VideoInfo, VideoFormat } from '../types';

export async function getVideoInfo(url: string): Promise<VideoInfo> {
  const info = await ytdl.getInfo(url);
  
  const formats = info.formats
    .filter(format => format.hasVideo || format.hasAudio)
    .map(format => ({
      quality: String(format.quality || 'unknown'),
      qualityLabel: format.qualityLabel || String(format.quality) || 'unknown',
      container: format.container || 'unknown',
      hasAudio: format.hasAudio || false,
      hasVideo: format.hasVideo || false,
      url: format.url,
      contentLength: format.contentLength || undefined,
    }));

  return {
    title: info.videoDetails.title,
    duration: parseInt(info.videoDetails.lengthSeconds),
    author: info.videoDetails.author.name,
    videoId: info.videoDetails.videoId,
    formats,
  };
}

export function validateYoutubeUrl(url: string): boolean {
  return ytdl.validateURL(url);
}

export function getBestFormat(formats: VideoFormat[], preferredQuality?: string): VideoFormat | undefined {
  if (preferredQuality) {
    const preferred = formats.find(f => 
      f.qualityLabel.includes(preferredQuality) && f.hasVideo && f.hasAudio
    );
    if (preferred) return preferred;
  }
  
  return formats
    .filter(f => f.hasVideo && f.hasAudio)
    .sort((a, b) => {
      const aRes = parseInt(a.qualityLabel) || 0;
      const bRes = parseInt(b.qualityLabel) || 0;
      return bRes - aRes;
    })[0];
}

export function getAudioOnlyFormat(formats: VideoFormat[]): VideoFormat | undefined {
  return formats
    .filter(f => f.hasAudio && !f.hasVideo)
    .sort((a, b) => {
      const aRate = parseInt(a.quality.match(/\\d+/)?.[0] || '0');
      const bRate = parseInt(b.quality.match(/\\d+/)?.[0] || '0');
      return bRate - aRate;
    })[0];
}