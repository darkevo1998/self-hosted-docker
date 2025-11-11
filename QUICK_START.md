# Quick Start Guide - Activepieces Self-Hosted with Localization

## 🚀 Quick Setup (5 minutes)

### Windows (PowerShell)

1. **Run the setup script:**
   ```powershell
   .\setup-windows.ps1
   ```

2. **Open in browser:**
   - Go to: http://localhost (or https://your-domain after TLS)
   - Create your admin account
   - Select your language in settings

### Linux/Mac

1. **Generate environment file:**
   ```bash
   bash tools/deploy.sh
   ```

2. **Start services (Activepieces + Nginx proxy):**
   ```bash
   docker compose -p activepieces up -d
   ```

3. **Access:**
   - Open: http://localhost (or your mapped domain)
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

## 🌐 Ship Behind Nginx (included)

The bundled `activepieces-nginx` service already listens on ports 80/443. Tweak it with the steps below:

1. **Update hostnames:** Edit `nginx/conf.d/activepieces.conf` and replace `_` in `server_name` with your domain(s) or IP (for example `automation.example.com`).
2. **Enable HTTPS:** Copy `fullchain.pem` and `privkey.pem` into `nginx/certs`, then uncomment the TLS block in the same config. Adjust `client_max_body_size` if you need larger uploads.
3. **Change exposed ports (optional):** Override the defaults in `.env` *before* starting Docker:
   ```env
   AP_NGINX_HTTP_PORT=8080
   AP_NGINX_HTTPS_PORT=8443
   ```
4. **Apply changes:** `docker compose -p activepieces up -d` (or `docker compose -p activepieces restart nginx` after config tweaks). Nginx proxies to the `activepieces` container on the internal Docker network.

## 📚 Full Documentation

See `SETUP_GUIDE.md` for detailed instructions.

## 🆘 Troubleshooting

**Language not changing?**
- Clear browser cache
- Check profile settings
- Verify language is fully supported

**Ports 80/443 unavailable?**
- Update `AP_NGINX_HTTP_PORT` / `AP_NGINX_HTTPS_PORT` in `.env`
- Restart with `docker compose -p activepieces up -d`

**Need help?**
- Discord: https://discord.gg/2jUXBKDdP8
- Docs: https://www.activepieces.com/docs

---

**Happy automating! 🎉**

