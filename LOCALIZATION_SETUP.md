# Activepieces Full Localization Setup Guide

## ✅ Current Status
Your Activepieces setup is **correct and running**! You can access the dashboard at http://localhost:8080

## 🌐 Setting Up Native Language Support

### 🔄 Runtime Auto-Translation for Unlocalized Text

If a piece of UI still renders in English, Activepieces now translates it on the fly to the language selected in the dashboard.

1. **Configure the API key** by adding the following to `.env` (or your secret store):

   ```env
   AP_GOOGLE_TRANSLATE_API_KEY=your-google-translate-key
   ```

2. **Restart the API container** so the new key is loaded.
3. Any time the UI detects English text, it calls the translation service and swaps the content in place.
4. To opt-out for a specific element (for brand names, code snippets, etc.), add `data-no-auto-translate` to the element in React.

> If the key is missing or the quota is exhausted, the UI will gracefully keep the original English text.

### Step 1: Enable Language Selection in Dashboard

1. **Login to Dashboard**: http://localhost:8080
2. **Go to Profile Settings**:
   - Click on your profile icon (top-right corner)
   - Select "Settings" or "Preferences"
   
3. **Select Your Language**:
   - Find "Language" or "Locale" option
   - Choose from available languages:
     - 🇸🇦 Arabic (ar) - العربية
     - 🇩🇪 German (de) - Deutsch
     - 🇬🇧 English (en)
     - 🇪🇸 Spanish (es) - Español
     - 🇫🇷 French (fr) - Français
     - 🇯🇵 Japanese (ja) - 日本語
     - 🇳🇱 Dutch (nl) - Nederlands
     - 🇵🇹 Portuguese (pt) - Português
     - 🇷🇺 Russian (ru) - Русский
     - 🇨🇳 Chinese Simplified (zh) - 简体中文
     - 🇹🇼 Chinese Traditional (zh-TW) - 繁體中文

4. **Verify Full Translation**:
   - After selecting language, the ENTIRE interface switches immediately
   - All menus, buttons, labels, and error messages are in your selected language
   - **No English text should remain**

### Step 2: Set Default Language (Optional - for all new users)

To set a default language for all users, add this to your `.env` file:

```env
AP_DEFAULT_LOCALE=ar
```

Replace `ar` with your desired language code (ar, de, en, es, fr, ja, nl, pt, ru, zh, zh-TW)

Then restart:
```bash
docker compose -p activepieces restart
```

## 📝 Creating Workflows in Your Native Language

1. **Create New Workflow**:
   - Click "New Flow" (or equivalent in your language)
   - All UI elements are in your selected language

2. **Add Steps**:
   - Browse 200+ integrations (all localized)
   - Piece names, descriptions, and configurations are in your language
   - Configure each step in your native language

3. **Test and Deploy**:
   - Test workflows in your language
   - Execution logs are in your language
   - Publish workflows within Activepieces

## 🐳 Deploying Workflows as Docker Containers

### Understanding Activepieces Architecture

Activepieces runs workflows **within the Activepieces container** itself. Workflows are not separate Docker containers - they execute inside the Activepieces engine.

### Option 1: Current Setup (Recommended)
Your workflows are already running in Docker! The entire Activepieces instance (including all workflows) runs as a Docker container using `docker-compose.yml`.

**To deploy workflows:**
1. Create workflows in the dashboard
2. They automatically run within the Activepieces container
3. No additional Docker setup needed

### Option 2: Export/Import Workflows

**Export Workflow:**
1. Open your workflow in the dashboard
2. Go to workflow settings/options
3. Export as JSON file
4. Save the JSON file

**Import Workflow:**
1. In another Activepieces instance
2. Use the import feature
3. Load the JSON file
4. Workflow is imported and ready to use

### Option 3: Custom Docker Container with Pre-loaded Workflows

If you want to create a Docker image with pre-configured workflows:

1. **Export your workflows** as JSON files
2. **Create a custom Dockerfile**:

```dockerfile
FROM ghcr.io/activepieces/activepieces:0.71.1

# Copy workflow JSON files
COPY workflows/*.json /app/workflows/

# Set up import script (if needed)
# Note: This requires custom scripting to import workflows on startup
```

3. **Build and deploy**:

```bash
docker build -t my-activepieces:custom .
docker run -d -p 8080:80 my-activepieces:custom
```

**Note:** Activepieces doesn't have built-in support for importing workflows via files on startup. You would need to either:
- Use the API to import workflows programmatically
- Use the web UI to import workflows manually
- Or create a custom initialization script

### Option 4: Deploy Entire Activepieces Instance

Your current setup is already a Docker deployment! To deploy to another machine:

```bash
# On your current machine - export the docker-compose.yml
docker compose -p activepieces config > docker-compose.production.yml

# Copy to target machine:
# - docker-compose.production.yml
# - .env file
# - cache directory (if needed)

# On target machine:
docker compose -f docker-compose.production.yml up -d
```

## 🎯 Recommended Deployment Architecture

For your use case, the **recommended approach** is:

1. **Keep current Docker Compose setup** (already working!)
2. **Create workflows** in the dashboard in your native language
3. **Workflows run automatically** within the Activepieces container
4. **Backup workflows** by exporting as JSON
5. **Deploy to other machines** by:
   - Copying docker-compose.yml
   - Copying .env file
   - Copying exported workflow JSON files
   - Importing workflows via web UI or API

## 📋 Quick Reference

### Language Codes
```
ar - Arabic
de - German
en - English
es - Spanish
fr - French
ja - Japanese
nl - Dutch
pt - Portuguese
ru - Russian
zh - Chinese Simplified
zh-TW - Chinese Traditional
```

### Docker Commands
```bash
# View logs
docker compose -p activepieces logs -f

# Restart (to apply language changes)
docker compose -p activepieces restart

# Stop
docker compose -p activepieces stop

# Start
docker compose -p activepieces start

# Backup database (includes workflows)
docker compose -p activepieces exec postgres pg_dump -U activepieces activepieces > backup.sql
```

## ✅ Verification Checklist

- [x] Activepieces is running (verified)
- [ ] Language selected in dashboard settings
- [ ] All UI elements in selected language
- [ ] Workflows created in native language
- [ ] Workflows running successfully
- [ ] Backup/export workflows as JSON

## 🆘 Troubleshooting

**Language not changing?**
- Clear browser cache
- Check browser language settings
- Verify language code in settings
- Restart containers: `docker compose -p activepieces restart`

**Workflows not running?**
- Check logs: `docker compose -p activepieces logs -f`
- Verify workflows are published (not just saved)
- Check trigger configurations

**Need help?**
- Documentation: https://www.activepieces.com/docs
- Discord: https://discord.gg/2jUXBKDdP8

---

**Your Activepieces instance is ready for full native language workflow creation! 🎉**

