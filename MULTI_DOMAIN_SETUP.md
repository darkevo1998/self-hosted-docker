# Multi-Domain Setup with Language-Specific Google Translate Widget

This setup configures Activepieces to serve multiple domains with different default languages and automatically injects the Google Translate widget for non-English domains.

## Configured Domains

1. **తెలుగు.net** (Telugu) - Default language: Telugu (te)
2. **हिंदी.net** (Hindi) - Default language: Hindi (hi)
3. **தமிழ்மொழி.com** (Tamil) - Default language: Tamil (ta)
4. **talktocomputer.com** (English) - Default language: English (en) - No translation widget

## Features

- **Domain-based language detection**: Each domain automatically sets the default language via the `X-Default-Language` header
- **Google Translate widget**: Automatically injected for Telugu, Hindi, and Tamil domains
- **Language options**: Each widget allows translation between Telugu, Hindi, Tamil, and English
- **Fixed positioning**: The translation widget appears in the top-right corner with a clean design

## How It Works

1. **Nginx Configuration**: The `nginx/conf.d/activepieces.conf` file contains separate server blocks for each domain
2. **Language Header**: Each domain sets the `X-Default-Language` header that can be used by the application
3. **Widget Injection**: Nginx's `sub_filter` module injects the Google Translate widget code into the HTML `<head>` section before serving the page
4. **Gzip Disabled**: Gzip compression is disabled for HTML responses to allow `sub_filter` to work properly

## DNS Configuration

To use these domains, you need to:

1. **Point DNS records** to your server's IP address:
   - A record for `తెలుగు.net` → Your server IP
   - A record for `हिंदी.net` → Your server IP
   - A record for `தமிழ்மொழி.com` → Your server IP
   - A record for `talktocomputer.com` → Your server IP

2. **Optional: Add www subdomains**:
   - A record for `www.తెలుగు.net` → Your server IP
   - A record for `www.हिंदी.net` → Your server IP
   - A record for `www.தமிழ்மொழி.com` → Your server IP
   - A record for `www.talktocomputer.com` → Your server IP

## HTTPS Setup (Optional)

To enable HTTPS for each domain:

1. **Obtain SSL certificates** for each domain (using Let's Encrypt, Cloudflare, or your preferred CA)
2. **Place certificates** in `nginx/certs/`:
   - `telugu-fullchain.pem` and `telugu-privkey.pem`
   - `hindi-fullchain.pem` and `hindi-privkey.pem`
   - `tamil-fullchain.pem` and `tamil-privkey.pem`
   - `english-fullchain.pem` and `english-privkey.pem`
3. **Uncomment HTTPS lines** in `nginx/conf.d/activepieces.conf` for each server block
4. **Restart nginx**: `docker compose -p activepieces restart nginx`

## Testing

After deploying:

1. **Test each domain**:
   - Visit `http://తెలుగు.net` - Should show Telugu interface with translation widget
   - Visit `http://हिंदी.net` - Should show Hindi interface with translation widget
   - Visit `http://தமிழ்மொழி.com` - Should show Tamil interface with translation widget
   - Visit `http://talktocomputer.com` - Should show English interface without translation widget

2. **Verify translation widget**:
   - The widget should appear in the top-right corner for non-English domains
   - Clicking the widget should allow switching between Telugu, Hindi, Tamil, and English

## Troubleshooting

### Widget not appearing
- Check browser console for JavaScript errors
- Verify that `sub_filter` module is enabled in nginx (it's enabled by default in nginx:alpine)
- Check nginx logs: `docker compose -p activepieces logs nginx`

### Domain not resolving
- Verify DNS records are correctly configured
- Check that your server's firewall allows port 80 (and 443 for HTTPS)
- Test with `curl -H "Host: your-domain.com" http://your-server-ip`

### Language not detected
- The `X-Default-Language` header is set, but the application needs to read it
- Check if Activepieces has configuration to use this header for default language

## Customization

To modify the translation widget appearance or behavior, edit the `sub_filter` lines in `nginx/conf.d/activepieces.conf`. The widget uses Google Translate's standard API.

To change widget position, modify the `style` attribute in the injected HTML.

