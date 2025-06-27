# YT-DL

A modern CLI tool to download YouTube videos with a beautiful interface.

## Features

- 🎥 Download YouTube videos in various formats (MP4, MP3, WebM)
- 📊 Interactive mode with quality selection
- 📈 Real-time download progress with speed and ETA
- 🎨 Beautiful ASCII banner and colored output
- ⚡ Fast and efficient downloading
- 🔧 Configurable output directory

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd yt-dl

# Install dependencies
npm install

# Build the project
npm run build

# Link globally (optional)
npm link
```

## Usage

### Basic Usage

```bash
# Interactive mode (no arguments)
./yt-dl

# Download a video directly
./yt-dl https://www.youtube.com/watch?v=VIDEO_ID

# Or use node
node dist/index.js download https://www.youtube.com/watch?v=VIDEO_ID
```

### Interactive Mode

```bash
# Automatic interactive mode (no URL)
./yt-dl

# Explicit interactive mode
./yt-dl --interactive

# Or
node dist/index.js download --interactive
```

### Options

- `-q, --quality` - Video quality (1080p, 720p, 480p, 360p)
- `-f, --format` - Output format (mp4, mp3, webm)
- `-o, --output` - Output directory (default: current directory)
- `-i, --interactive` - Interactive mode

### Examples

```bash
# Download in 1080p quality
./yt-dl https://www.youtube.com/watch?v=VIDEO_ID --quality 1080p

# Download audio only (MP3)
./yt-dl https://www.youtube.com/watch?v=VIDEO_ID --format mp3

# Download to specific directory
./yt-dl https://www.youtube.com/watch?v=VIDEO_ID --output ~/Downloads

# Interactive mode (automatic)
./yt-dl
```

## Development

```bash
# Run in development mode
npm run dev

# Run linting
npm run lint

# Run type checking
npm run typecheck

# Build project
npm run build
```

## Requirements

- Node.js >= 18.0.0
- npm or yarn

## License

MIT