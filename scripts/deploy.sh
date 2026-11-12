#!/bin/bash
# Yazhi Site Deployment Script
# Builds the site and prepares it for deployment
# Usage: ./scripts/deploy.sh [target-dir]

set -e

# Configuration
PROJECT_NAME="yazhi-dev"
BUILD_TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
TARGET_DIR="${1:-./.deployments/yazhi-build-$BUILD_TIMESTAMP}"
PUBLIC_PORT="${PUBLIC_PORT:-3000}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Yazhi Site Deployment${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Step 1: Verify environment
echo -e "${YELLOW}[1/5]${NC} Verifying environment..."
if ! command -v node &> /dev/null; then
  echo -e "${RED}✗ Node.js not found${NC}"
  exit 1
fi
if ! command -v npm &> /dev/null; then
  echo -e "${RED}✗ npm not found${NC}"
  exit 1
fi
echo -e "${GREEN}✓${NC} Node.js $(node --version) and npm $(npm --version)"
echo ""

# Step 2: Install dependencies
echo -e "${YELLOW}[2/5]${NC} Installing dependencies..."
npm ci --prefer-offline --no-audit > /dev/null 2>&1 || npm install --legacy-peer-deps > /dev/null 2>&1
echo -e "${GREEN}✓${NC} Dependencies installed"
echo ""

# Step 3: Build production
echo -e "${YELLOW}[3/5]${NC} Building production version..."
# A failing build must stop the script (set -e). Previously this line ended in
# `|| true`, so a red build still produced a package and still "succeeded".
if ! npm run build; then
  echo -e "${RED}✗ Production build failed — nothing packaged${NC}"
  exit 1
fi
if [ ! -f .next/BUILD_ID ]; then
  echo -e "${RED}✗ Build produced no .next/BUILD_ID — nothing packaged${NC}"
  exit 1
fi
echo -e "${GREEN}✓${NC} Production build complete"
echo ""

# Step 4: Prepare deployment package
# Build into a fresh directory so a package can never mix two builds' chunks.
echo -e "${YELLOW}[4/5]${NC} Preparing deployment package..."
if [ -d "$TARGET_DIR" ] && [ -n "$(ls -A "$TARGET_DIR" 2>/dev/null)" ]; then
  echo -e "${RED}✗ $TARGET_DIR already exists and is not empty — remove it or pick another target${NC}"
  exit 1
fi
mkdir -p "$TARGET_DIR"/{static,public,docs}

# Copy build artifacts
cp -r .next/static/* "$TARGET_DIR/static/" 2>/dev/null || true
cp -r public/* "$TARGET_DIR/public/" 2>/dev/null || true
cp -r docs/* "$TARGET_DIR/docs/" 2>/dev/null || true
cp package.json "$TARGET_DIR/"

# Create deployment manifest
cat > "$TARGET_DIR/DEPLOYMENT-INFO.md" << DEPLOY_EOF
# Yazhi Site Build - Deployment Info

**Build Timestamp**: $BUILD_TIMESTAMP
**Project**: $PROJECT_NAME
**Commit**: $(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
**Branch**: $(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
**Build Directory**: $TARGET_DIR

## Contents

- \`static/\` — the hashed client assets from .next/static (serve them at /_next/static/)
- \`public/\` — Public assets (fonts, images, audio placeholder)
- \`docs/\` — Documentation (architecture, design, audio setup)
- \`DEPLOYMENT-INFO.md\` — This file

## This package is not a site you can open in a file server

It is a record of the build, for release notes and troubleshooting. Next.js
serves these assets from \`/_next/static/\` and needs the Node server for
\`/profile/[id]\` and the \`/api/*\` route handlers, so serving these folders with
\`python3 -m http.server\` does not produce yazhi.dev.

## How to run the app

\`\`\`bash
npm ci
npm run build
npm start          # http://localhost:3000
\`\`\`

Paths are served by the Next.js server, with no file-server rewrite needed.

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 15+
- Edge 90+
- Mobile: iOS 15+, Android 8+

## What this package is
This package is NOT a standalone static site. Next.js writes hashed assets to
`.next/static/` but serves them from `/_next/static/`, and every page
(`/`, `/about`, `/repos`, …) lives in the dynamic `/profile/[id]` and the 7
`/api/*` route handlers too — those need a Node server (`npm start`), not a
plain file server. Serve the whole app instead:

\`\`\`bash
npm run build && npm start   # from the project root
\`\`\`

Use this package only as a record of the build (commit, timestamp, assets).

## Audio Integration
To add Tamil yazh & pann music:
1. Obtain/create audio file (3-5 min, instrumental MP3)
2. Optimize: \`ffmpeg -i input.wav -b:a 192k -ar 44100 output.mp3\`
3. Place at: \`public/audio/yazhi-ambient.mp3\`
4. See \`docs/SITE.md\` §4 for integration details

## Documentation
- **SITE.md** — 3D world, design tokens, audio, build

## Troubleshooting

### Server won't start
\`\`\`bash
# Check if port 8000 is in use
lsof -i :8000
# Use different port
python3 -m http.server 9000
\`\`\`

### Assets not loading
- Verify \`static/\` and \`public/\` directories exist
- Check file permissions: \`chmod -R 755 ./static ./public\`
- Inspect browser console for 404 errors

### Build cache issues
- Delete \`.next/\` directory: \`rm -rf .next\`
- Reinstall: \`npm ci\`
- Rebuild: \`npm run build\`

## Support
For issues or questions, see: https://github.com/yazhi-lem/yazhi-dev

---
Generated: $(date)
DEPLOY_EOF

echo -e "${GREEN}✓${NC} Deployment package created"
echo ""

# Step 5: Display summary
echo -e "${YELLOW}[5/5]${NC} Deployment Summary"
echo ""
echo -e "${GREEN}✓ Build recorded${NC}"
echo ""
echo "📦 Build package:"
echo "   Location: $TARGET_DIR"
echo "   Size: $(du -sh "$TARGET_DIR" | cut -f1)"
echo ""
echo "📁 Contents:"
du -sh "$TARGET_DIR"/* | sed 's/^/   /'
echo ""
echo "🚀 To run the site (this package is not a static site):"
echo "   npm start          # from the project root, http://localhost:3000"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Build package ready${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
