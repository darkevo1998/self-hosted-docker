# Quick Start Guide - Activepieces Self-Hosted with Localization

## 🚀 Quick Setup (5 minutes)

### Windows (PowerShell)

1. **Run the setup script:**
   ```powershell
   .\setup-windows.ps1
   ```

2. **Open in browser:**
   - Navigate to: http://localhost:8080
   - Create your admin account
   - Select your language in settings

### Linux/Mac

1. **Generate environment file:**
   ```bash
   bash tools/deploy.sh
   ```

2. **Start services:**
   ```bash
   docker compose -p activepieces up -d
   ```

3. **Access:**
   - Open: http://localhost:8080
   - Create admin account
   - Change language in settings

## 🌐 Changing Language

1. Click on your profile (top-right)
2. Go to Settings/Preferences
3. Select "Language" or "Locale"
4. Choose your preferred language
5. The entire interface switches immediately - **no English text remains**

## ✅ Supported Languages

- 🇸🇦 Arabic (ar)
- 🇩🇪 German (de)
- 🇬🇧 English (en)
- 🇪🇸 Spanish (es)
- 🇫🇷 French (fr)
- 🇯🇵 Japanese (ja)
- 🇳🇱 Dutch (nl)
- 🇵🇹 Portuguese (pt)
- 🇷🇺 Russian (ru)
- 🇨🇳 Chinese Simplified (zh)
- 🇹🇼 Chinese Traditional (zh-TW)

## 📝 Creating Workflows

1. Click "New Flow" (or equivalent in your language)
2. Add triggers and actions
3. Configure steps in your language
4. Test and publish

**All 200+ integrations are fully localized!**

## 🐳 Docker Commands

```bash
# View logs
docker compose -p activepieces logs -f

# Stop
docker compose -p activepieces stop

# Start
docker compose -p activepieces start

# Restart
docker compose -p activepieces restart

# Update
docker compose -p activepieces pull
docker compose -p activepieces up -d
```

## 📚 Full Documentation

See `SETUP_GUIDE.md` for detailed instructions.

## 🆘 Troubleshooting

**Language not changing?**
- Clear browser cache
- Check profile settings
- Verify language is fully supported

**Port 8080 in use?**
- Edit `docker-compose.yml`
- Change `8080:80` to another port (e.g., `9090:80`)

**Need help?**
- Discord: https://discord.gg/2jUXBKDdP8
- Docs: https://www.activepieces.com/docs

---

**Happy automating! 🎉**

