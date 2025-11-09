# Self-Hosted Activepieces Setup Guide with Full Localization

This guide will help you set up a self-hosted Activepieces instance with complete native language support, allowing users to select their preferred language on first use and have the entire interface displayed in that language with no English text.

## Prerequisites

- Docker and Docker Compose installed on your machine
- Git installed
- At least 4GB of available RAM
- Port 8080 available (or modify the port in docker-compose.yml)

## Supported Languages

Activepieces supports the following languages:
- **ar** - Arabic (العربية)
- **de** - German (Deutsch)
- **en** - English
- **es** - Spanish (Español)
- **fr** - French (Français)
- **ja** - Japanese (日本語)
- **nl** - Dutch (Nederlands)
- **pt** - Portuguese (Português)
- **ru** - Russian (Русский)
- **zh** - Chinese Simplified (简体中文)
- **zh-TW** - Chinese Traditional (繁體中文)

## Step 1: Clone and Navigate to Repository

```bash
cd "D:\downloads\self hosted"
```

The repository should already be cloned. If not, clone it:
```bash
git clone https://github.com/activepieces/activepieces.git .
```

## Step 2: Configure Environment Variables

Create a `.env` file in the root directory. You can use the deploy script to generate one with secure random values:

**On Windows (PowerShell):**
```powershell
# Create .env from example if it exists, or create it manually
if (Test-Path .env.example) {
    Copy-Item .env.example .env
} else {
    # Create .env file with required variables
    @"
AP_API_KEY=your-api-key-here
AP_POSTGRES_DATABASE=activepieces
AP_POSTGRES_USERNAME=activepieces
AP_POSTGRES_PASSWORD=your-secure-password-here
AP_POSTGRES_HOST=postgres
AP_POSTGRES_PORT=5432
AP_REDIS_HOST=redis
AP_REDIS_PORT=6379
AP_JWT_SECRET=your-jwt-secret-here
ENCRYPTION_KEY=your-encryption-key-here
AP_FRONTEND_URL=http://localhost:8080
AP_API_URL=http://localhost:8080/api
"@ | Out-File -FilePath .env -Encoding utf8
}
```

**On Linux/Mac:**
```bash
bash tools/deploy.sh
```

Then edit the `.env` file to add any custom configuration you need.

## Step 3: Configure Language Settings

The language selection is handled automatically by Activepieces using browser language detection. However, you can:

1. **Set Default Language** (Optional): Users can select their language in the UI settings after first login.

2. **Ensure All Translations are Loaded**: The Docker image already includes all language files. No additional configuration is needed.

## Step 4: Start with Docker Compose

Start all services using Docker Compose:

```bash
docker compose -p activepieces up -d
```

This will:
- Start the Activepieces application
- Start PostgreSQL database
- Start Redis cache
- Set up persistent volumes for data

## Step 5: Access Activepieces

1. Open your web browser and navigate to: `http://localhost:8080`

2. **First-time setup:**
   - Create an admin account
   - The interface will automatically detect your browser language
   - If your browser language is not supported, it will default to English

3. **Change Language:**
   - Go to your profile/settings (usually in the top-right corner)
   - Select "Language" or "Locale" option
   - Choose your preferred language
   - The entire interface will immediately switch to your selected language with no English text remaining

## Step 6: Verify Full Localization

After selecting your language:
- All menu items should be in your selected language
- All buttons and labels should be in your selected language
- All workflow builder elements should be in your selected language
- Error messages should be in your selected language
- No English text should remain visible

## Creating and Deploying Workflows

### Creating Workflows

1. **Access the Flow Builder:**
   - Click "New Flow" or "Create Flow" in your selected language
   - Use the visual builder to create your workflow

2. **Add Steps:**
   - Choose from 200+ available pieces/integrations
   - All piece names and descriptions are localized
   - Configure each step in your selected language

3. **Test Your Workflow:**
   - Use the "Test" button to verify each step
   - Check the execution logs in your language

### Deploying Workflows

Workflows are automatically saved and deployed within your Activepieces instance. There's no need to export them as separate Docker containers - they run natively within Activepieces.

However, if you need to **export workflows** for backup or sharing:

1. **Export Workflow:**
   - Open your workflow
   - Use the export/share feature (usually in the workflow menu)
   - Export as JSON file

2. **Import Workflow:**
   - Use the import feature to load workflows from JSON files
   - This allows you to share workflows between instances

## Docker Container Management

### View Logs
```bash
docker compose -p activepieces logs -f
```

### Stop Services
```bash
docker compose -p activepieces stop
```

### Start Services
```bash
docker compose -p activepieces start
```

### Restart Services
```bash
docker compose -p activepieces restart
```

### Remove Everything (WARNING: Deletes Data)
```bash
docker compose -p activepieces down -v
```

### Update Activepieces
```bash
# Pull latest image
docker compose -p activepieces pull

# Restart with new image
docker compose -p activepieces up -d
```

## Data Persistence

Your data is stored in Docker volumes:
- **postgres_data**: Database data (workflows, connections, users)
- **redis_data**: Cache data
- **./cache**: Local cache directory

These volumes persist even if you stop the containers. To backup:
```bash
docker compose -p activepieces exec postgres pg_dump -U activepieces activepieces > backup.sql
```

## Troubleshooting

### Language Not Changing
- Clear browser cache and cookies
- Check browser language settings
- Verify the language is selected in user profile settings
- Check browser console for i18n errors

### Port Already in Use
Edit `docker-compose.yml` and change:
```yaml
ports:
  - '8080:80'  # Change 8080 to another port, e.g., '9090:80'
```

### Database Connection Issues
- Verify PostgreSQL is running: `docker compose -p activepieces ps`
- Check `.env` file has correct database credentials
- View PostgreSQL logs: `docker compose -p activepieces logs postgres`

### Missing Translations
If you find missing translations:
1. Check if the language is fully supported
2. Report missing translations to the Activepieces team
3. Contribute translations via Crowdin: https://crowdin.com/project/activepieces

## Adding New Languages

To add support for a new language:
1. Contact Activepieces support: support@activepieces.com
2. They will add the language to the Crowdin project
3. Contribute translations via Crowdin
4. Translations will be included in future releases

## Security Considerations

1. **Change Default Passwords**: Always use strong, randomly generated passwords in `.env`
2. **Use HTTPS**: For production, set up reverse proxy (nginx/traefik) with SSL
3. **Firewall**: Only expose necessary ports
4. **Regular Updates**: Keep Docker images updated for security patches

## Production Deployment

For production deployment:
1. Set `AP_FRONTEND_URL` and `AP_API_URL` to your domain
2. Configure reverse proxy with SSL/TLS
3. Set up regular backups
4. Monitor logs and performance
5. Consider using Docker Swarm or Kubernetes for high availability

## Additional Resources

- Official Documentation: https://www.activepieces.com/docs
- GitHub Repository: https://github.com/activepieces/activepieces
- Discord Community: https://discord.gg/2jUXBKDdP8
- Translation Contributions: https://crowdin.com/project/activepieces

## Summary

You now have a fully localized, self-hosted Activepieces instance where:
✅ Users can select their native language on first use  
✅ The entire interface displays in the selected language  
✅ No English text remains after language selection  
✅ Users can create and deploy workflows in their language  
✅ All 200+ pieces/integrations are localized  
✅ Workflows run natively within the Docker container  

Happy automating! 🚀

