# Yazhi Deployment Guide

## Overview

The Yazhi marketing site is a fully static Next.js build that can be deployed to any static hosting service or traditional web server.

**Build Type**: Fully static prerendered (next export)  
**Framework**: Next.js 16 (App Router)  
**Size**: ~440 KB total (~130 KB gzipped)  
**Browser Support**: Chrome 90+, Firefox 88+, Safari 15+, Edge 90+

---

## Building Locally

### Quick Build
```bash
# Install dependencies
npm install

# Build production version
npm run build

# Output: .next/ directory with prerendered pages and static assets
```

### Using the Deployment Script
```bash
# Create deployment package with all assets
bash ./scripts/deploy.sh [target-directory]

# Example:
bash ./scripts/deploy.sh ./my-deployment

# Output: my-deployment/ with:
#   - static/        (CSS, JS, images)
#   - public/        (fonts, audio placeholder)
#   - docs/          (documentation)
#   - index.html     (reference page)
#   - DEPLOYMENT-INFO.md
```

---

## Local Testing

### Using Python HTTP Server
```bash
cd .deployments/yazhi-build-*
python3 -m http.server 8000
# Visit: http://localhost:8000
```

### Using Node.js http-server
```bash
npm install -g http-server
cd .deployments/yazhi-build-*
http-server -p 8000 -c-1
# Visit: http://localhost:8000
```

### Using npm's built-in server
```bash
# From project root
npm start
# Default port: 3000
```

---

## Deployment Targets

### Vercel (Recommended for Next.js)

1. **Connect Repository**
   - Log in to vercel.com
   - Import repository: yazhi-lem/yazhi-dev
   - Select framework: Next.js
   - Leave settings at defaults

2. **Deploy**
   - Vercel auto-detects Next.js
   - Builds and deploys automatically
   - Sets up production environment

3. **Preview Branches**
   - Automatic preview for pull requests
   - Each branch gets unique URL

**Benefits**:
- Automatic CI/CD
- Preview deployments
- Edge caching
- Built for Next.js

### Netlify

1. **Connect Repository**
   ```bash
   # Install netlify CLI
   npm install -g netlify-cli
   
   # Link to Netlify
   netlify connect
   ```

2. **Configure Build**
   - Build command: `npm run build`
   - Publish directory: `.next/static`
   - Environment: Next.js with Static Export

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### Traditional Web Server (Apache, Nginx)

1. **Build Locally**
   ```bash
   npm run build
   ```

2. **Copy to Server**
   ```bash
   # SSH into server
   scp -r .next/static/* user@server:/var/www/yazhi/
   scp -r public/* user@server:/var/www/yazhi/public/
   ```

3. **Server Configuration**

   **Nginx**:
   ```nginx
   server {
       listen 80;
       server_name yazhi.example.com;

       root /var/www/yazhi;
       
       # Serve static files
       location /static/ {
           try_files $uri =404;
           expires 30d;
           add_header Cache-Control "public, immutable";
       }
       
       # Serve public assets
       location /public/ {
           try_files $uri =404;
           expires 7d;
       }
       
       # Fallback to index for SPA
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

   **Apache**:
   ```apache
   <VirtualHost *:80>
       ServerName yazhi.example.com
       DocumentRoot /var/www/yazhi

       <Directory /var/www/yazhi>
           Options -MultiViews
           RewriteEngine On
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^ index.html [QSA,L]
       </Directory>

       # Cache static files
       <FilesMatch "\.(js|css|woff2)$">
           Header set Cache-Control "public, max-age=2592000, immutable"
       </FilesMatch>
   </VirtualHost>
   ```

### AWS S3 + CloudFront

1. **Build**
   ```bash
   npm run build
   ```

2. **Upload to S3**
   ```bash
   aws s3 sync .next/static s3://yazhi-bucket/static/ --cache-control "max-age=31536000"
   aws s3 sync public s3://yazhi-bucket/ --cache-control "max-age=3600"
   ```

3. **CloudFront Distribution**
   - Origin: S3 bucket
   - Default root object: index.html
   - Error pages: map 404 to index.html (for SPA routing)

---

## CI/CD Integration

### GitHub Actions

The repository includes `.github/workflows/build-and-deploy.yml`:

**Automated Steps**:
1. ✅ Install dependencies
2. ✅ Type check (TypeScript)
3. ✅ Build production
4. ✅ Upload artifacts
5. ✅ Performance audit
6. ✅ Deploy to staging (on main branch)

**Trigger Events**:
- Push to `main` or feature branch
- Pull requests (build + audit)

**Artifacts**:
- Available for 7 days
- Includes build output + documentation

**Usage**:
1. Push to repository
2. GitHub Actions automatically builds
3. Download artifacts from "Actions" tab
4. Deploy to your hosting service

### Other CI/CD Services

**GitLab CI**:
```yaml
build:
  image: node:22
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - .next/
      - public/
```

**CircleCI**:
```yaml
jobs:
  build:
    docker:
      - image: node:22
    steps:
      - checkout
      - run: npm ci
      - run: npm run build
      - store_artifacts:
          path: .next
```

---

## Environment Variables

**None required**. The site is fully self-contained with no external dependencies.

Optional configuration:
```bash
# Public domain for asset references
NEXT_PUBLIC_SITE_URL=https://yazhi.example.com

# Analytics (if adding tracking)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## Audio File Integration

To add Tamil music to the deployment:

1. **Prepare Audio File**
   ```bash
   # Convert to optimized MP3
   ffmpeg -i input.wav -b:a 192k -ar 44100 output.mp3
   
   # File should be 3-5 MB (3-5 minutes)
   ```

2. **Add to Public Directory**
   ```bash
   cp output.mp3 public/audio/yazhi-ambient.mp3
   ```

3. **Deploy**
   - Audio automatically included in build
   - Served from `/audio/yazhi-ambient.mp3`
   - See `docs/AUDIO-SETUP.md` for integration details

---

## Caching Strategy

### Recommended Cache Headers

```
Static Assets (.js, .css, .woff2):
  Cache-Control: public, max-age=31536000, immutable

Public Assets (images, fonts):
  Cache-Control: public, max-age=2592000

HTML Pages:
  Cache-Control: public, max-age=3600, must-revalidate
```

### CDN Configuration

**CloudFlare** (recommended):
- Automatic compression
- Global CDN
- DDoS protection
- Free HTTPS

**Bunny CDN**:
- Affordable
- High performance
- Good for Asia-Pacific

**KeyCDN**:
- API-driven
- Flexible
- Pay-per-use

---

## Performance Monitoring

### Lighthouse Audit
```bash
# Run Lighthouse CLI
npm install -g lighthouse
lighthouse https://yazhi.example.com --view

# Check scores:
# - Performance: 80+
# - Accessibility: 90+
# - Best Practices: 85+
# - SEO: 85+
```

### Web Vitals Monitoring
Add monitoring to track:
- **Largest Contentful Paint** (LCP): < 2.5s
- **First Input Delay** (FID): < 100ms
- **Cumulative Layout Shift** (CLS): < 0.1

```bash
# Via Google Analytics or similar
```

---

## Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf .next node_modules

# Reinstall
npm ci

# Rebuild
npm run build
```

### Assets Not Loading
- Check paths: `/static/`, `/public/`
- Verify file permissions: `chmod 755`
- Check web server configuration
- Inspect browser console for 404 errors

### Fonts Not Rendering
- Verify woff2 files in `public/fonts/`
- Check CORS headers for font delivery
- Ensure MIME type: `font/woff2`

### Audio Not Playing
- Verify MP3 file at `/audio/yazhi-ambient.mp3`
- Check browser console for errors
- Test browser autoplay policy
- Ensure audio file is valid MP3

### Performance Issues
- Enable gzip compression on server
- Use CDN for static assets
- Set appropriate cache headers
- Monitor Core Web Vitals

---

## Rollback Procedure

### Rollback to Previous Deployment
```bash
# Keep builds with timestamps
.deployments/
  ├── yazhi-build-20260708_180000/
  ├── yazhi-build-20260708_120000/
  └── yazhi-build-20260707_160000/

# Switch symlink to previous build
ln -sfn yazhi-build-20260708_120000 /var/www/yazhi
```

### Version Control
- Tag each release in git
- Keep commit history
- Document changes in CHANGELOG.md

---

## Security Checklist

- [ ] HTTPS enabled (redirect HTTP to HTTPS)
- [ ] Security headers configured:
  - Content-Security-Policy
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: SAMEORIGIN
  - X-XSS-Protection: 1; mode=block
- [ ] CORS configured appropriately
- [ ] Dependencies up-to-date (npm audit)
- [ ] No secrets in build output
- [ ] WAF/DDoS protection enabled (if using)

### Nginx Security Headers
```nginx
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self'" always;
```

---

## Monitoring & Uptime

### Status Monitoring
- Use UptimeRobot, Pingdom, or similar
- Monitor: https://yazhi.example.com/
- Alert on downtime

### Log Monitoring
- Track 4xx/5xx errors
- Monitor page load times
- Alert on performance degradation

### Analytics
- Add Google Analytics for user flow
- Track Core Web Vitals
- Monitor bounce rate, conversions

---

## Documentation for Deployment Team

When handing off deployment:

1. **Provide**:
   - Deployment package (.next, public, docs)
   - Environment variables (if any)
   - Deployment script (`scripts/deploy.sh`)
   - This guide

2. **Configure**:
   - Domain DNS
   - SSL certificate
   - Web server
   - CDN (optional)

3. **Test**:
   - All routes respond correctly
   - Audio loads without errors
   - Responsive on mobile
   - Accessibility compliant (Lighthouse 90+)

4. **Monitor**:
   - Set up alerting
   - Track performance metrics
   - Log errors
   - Plan maintenance windows

---

## Support

**Repository**: https://github.com/yazhi-lem/yazhi-dev  
**Issues**: GitHub Issues  
**Documentation**: See `/docs/` directory

---

**Last Updated**: 2026-07-08  
**Version**: 1.0  
**Status**: Production-Ready
