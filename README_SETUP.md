# Activepieces Self-Hosted Setup - Complete Guide

## Overview

This repository contains a complete setup for self-hosting Activepieces with **full native language support**. Users can select their preferred language on first use, and the entire interface will display in that language with no English text remaining.

## What's Included

✅ **Full Localization**: 11 languages supported (ar, de, en, es, fr, ja, nl, pt, ru, zh, zh-TW)  
✅ **Docker Setup**: Complete Docker Compose configuration  
✅ **Workflow Creation**: Users can create and deploy workflows in their native language  
✅ **200+ Localized Pieces**: All integrations are fully translated  
✅ **Easy Setup Scripts**: Automated setup for Windows  

## Quick Start

### Option 1: Windows (Easiest)

```powershell
.\setup-windows.ps1
```

Then open: http://localhost:8080

### Option 2: Manual Setup

1. **Generate environment file:**
   - Windows: Use `setup-windows.ps1`
   - Linux/Mac: `bash tools/deploy.sh`

2. **Start services:**
   ```bash
   docker compose -p activepieces up -d
   ```

3. **Access:**
   - Open http://localhost:8080
   - Create admin account
   - Select your language in settings

## Documentation Files

- **QUICK_START.md** - Quick reference guide (start here!)
- **SETUP_GUIDE.md** - Comprehensive setup instructions
- **setup-windows.ps1** - Automated Windows setup script

## Key Features

### Language Selection

1. **Automatic Detection**: Browser language is detected automatically
2. **Manual Selection**: Users can choose language in profile settings
3. **Full Translation**: Entire UI switches to selected language
4. **No English Fallback**: All text is translated, no English remains

### Workflow Creation

- Create workflows visually in your selected language
- All 200+ pieces/integrations are localized
- Test and deploy workflows natively
- Export/import workflows as JSON

### Docker Deployment

- **PostgreSQL**: Persistent database storage
- **Redis**: Caching and queue management
- **Activepieces**: Main application
- **Volumes**: Data persistence across restarts

## Supported Languages

| Code | Language | Native Name |
|------|----------|-------------|
| ar | Arabic | العربية |
| de | German | Deutsch |
| en | English | English |
| es | Spanish | Español |
| fr | French | Français |
| ja | Japanese | 日本語 |
| nl | Dutch | Nederlands |
| pt | Portuguese | Português |
| ru | Russian | Русский |
| zh | Chinese Simplified | 简体中文 |
| zh-TW | Chinese Traditional | 繁體中文 |

## Architecture

```
┌─────────────────────────────────────────┐
│         Activepieces Frontend           │
│     (11 Languages, Fully Localized)      │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Activepieces Backend            │
│     (API, Workflow Engine, Pieces)     │
└─────┬───────────────────────┬──────────┘
      │                       │
┌─────▼──────┐        ┌───────▼──────┐
│ PostgreSQL │        │    Redis     │
│  (Database)│        │   (Cache)    │
└────────────┘        └──────────────┘
```

## Docker Services

- **activepieces**: Main application (port 8080)
- **postgres**: PostgreSQL 14.4 database
- **redis**: Redis 7.0.7 cache

## Common Commands

```bash
# Start services
docker compose -p activepieces up -d

# View logs
docker compose -p activepieces logs -f

# Stop services
docker compose -p activepieces stop

# Restart services
docker compose -p activepieces restart

# Update to latest version
docker compose -p activepieces pull
docker compose -p activepieces up -d

# Remove everything (WARNING: deletes data)
docker compose -p activepieces down -v
```

## Configuration

Environment variables in `.env`:
- `AP_API_KEY`: API authentication key
- `AP_POSTGRES_*`: Database configuration
- `AP_REDIS_*`: Redis configuration
- `AP_JWT_SECRET`: JWT token secret
- `ENCRYPTION_KEY`: Data encryption key
- `AP_FRONTEND_URL`: Frontend URL
- `AP_API_URL`: API URL

## Troubleshooting

### Language Issues
- Clear browser cache
- Check profile language settings
- Verify language is supported

### Port Conflicts
Edit `docker-compose.yml` and change port mapping:
```yaml
ports:
  - '8080:80'  # Change to '9090:80' or another port
```

### Database Issues
- Check PostgreSQL is running: `docker compose -p activepieces ps`
- View logs: `docker compose -p activepieces logs postgres`
- Verify `.env` has correct credentials

## Production Deployment

For production:
1. Set proper `AP_FRONTEND_URL` and `AP_API_URL`
2. Configure reverse proxy (nginx/traefik) with SSL
3. Set up regular backups
4. Monitor logs and performance
5. Consider Docker Swarm/Kubernetes for HA

## Resources

- **Official Docs**: https://www.activepieces.com/docs
- **GitHub**: https://github.com/activepieces/activepieces
- **Discord**: https://discord.gg/2jUXBKDdP8
- **Translations**: https://crowdin.com/project/activepieces

## Contributing Translations

Want to improve translations?
1. Join Crowdin: https://crowdin.com/project/activepieces
2. Select your language
3. Translate strings
4. Translations sync automatically

## License

Activepieces Community Edition is MIT licensed.
Enterprise features require a commercial license.

---

**Enjoy your fully localized Activepieces instance! 🎉**

