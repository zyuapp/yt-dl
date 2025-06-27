# YTUBE-DL

A modern CLI tool to download YouTube videos with a beautiful interface.

## 🚀 Quick Start

```bash
# Just run this - no installation needed!
npx ytube-dl@latest
```

Then paste any YouTube URL and follow the interactive prompts! 

## Features

- 🎥 Download YouTube videos in various formats (MP4, MP3, WebM)
- 📊 Interactive mode with quality selection
- 📈 Real-time download progress with speed and ETA
- 🎨 Beautiful ASCII banner and colored output
- ⚡ Fast and efficient downloading
- 🔧 Configurable output directory

## Installation

### Option 1: Use with npx (No installation needed)
```bash
# Run directly with npx
npx ytube-dl

# Or use latest version explicitly
npx ytube-dl@latest
```

### Option 2: Install globally
```bash
# Install globally from npm
npm install -g ytube-dl

# Then use anywhere
ytube-dl
```

### Option 3: Development setup
```bash
# Clone the repository
git clone https://github.com/zyuapp/ytube-dl.git
cd ytube-dl

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
# Interactive mode (no arguments) - Recommended!
npx ytube-dl

# Download a video directly
npx ytube-dl https://www.youtube.com/watch?v=VIDEO_ID

# Use latest version
npx ytube-dl@latest

# If installed globally
ytube-dl https://www.youtube.com/watch?v=VIDEO_ID
```

### Interactive Mode

```bash
# Automatic interactive mode (no URL) - Just run without arguments
npx ytube-dl

# Explicit interactive mode
npx ytube-dl --interactive

# If installed globally
ytube-dl
ytube-dl --interactive
```

### Options

- `-q, --quality` - Video quality (1080p, 720p, 480p, 360p)
- `-f, --format` - Output format (mp4, mp3, webm)
- `-o, --output` - Output directory (default: current directory)
- `-i, --interactive` - Interactive mode

### Examples

```bash
# Download in 1080p quality
npx ytube-dl https://www.youtube.com/watch?v=VIDEO_ID --quality 1080p

# Download audio only (MP3)
npx ytube-dl https://www.youtube.com/watch?v=VIDEO_ID --format mp3

# Download to specific directory
npx ytube-dl https://www.youtube.com/watch?v=VIDEO_ID --output ~/Downloads

# Interactive mode (automatic) - Just run without arguments!
npx ytube-dl

# Always use latest version
npx ytube-dl@latest
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