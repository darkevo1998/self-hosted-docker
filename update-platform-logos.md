# Update Existing Platform Logos

If you have an **existing Activepieces installation** with platforms already in the database, you need to update the database to use the new amogam logos.

## Option 1: Using SQL Script (Recommended)

1. Connect to your PostgreSQL database:
   ```bash
   docker compose -p activepieces exec postgres psql -U activepieces -d activepieces
   ```

2. Run the SQL commands:
   ```sql
   UPDATE platform 
   SET "fullLogoUrl" = '/logo.png' 
   WHERE "fullLogoUrl" LIKE '%cdn.activepieces.com%' 
      OR "fullLogoUrl" LIKE '%activepieces.com/brand%';

   UPDATE platform 
   SET "logoIconUrl" = '/logo-icon.png' 
   WHERE "logoIconUrl" LIKE '%cdn.activepieces.com%' 
      OR "logoIconUrl" LIKE '%activepieces.com/brand%';

   UPDATE platform 
   SET "favIconUrl" = '/favicon.ico' 
   WHERE "favIconUrl" LIKE '%cdn.activepieces.com%' 
      OR "favIconUrl" LIKE '%activepieces.com/brand%';
   ```

3. Verify the changes:
   ```sql
   SELECT id, name, "fullLogoUrl", "logoIconUrl", "favIconUrl" FROM platform;
   ```

## Option 2: Using Docker Exec

Run the SQL script directly:

```bash
docker compose -p activepieces exec -T postgres psql -U activepieces -d activepieces < update-platform-logos.sql
```

## Option 3: Update via Admin UI

1. Access your Activepieces admin panel
2. Go to **Platform Settings** → **Appearance**
3. Manually update:
   - **Full Logo URL**: `/logo.png`
   - **Logo Icon URL**: `/logo-icon.png`
   - **Favicon URL**: `/favicon.ico`
4. Save the changes

## For New Installations

If this is a **fresh installation**, you don't need to do anything! The new logos will be used automatically because:
- New platforms use `defaultTheme` which now points to the new logos
- The logo files are already in the `public` folder and will be served correctly

## Verification

After updating, restart your containers:
```bash
docker compose -p activepieces restart
```

Then check the UI - you should see the amogam logo in:
- Sidebar header
- Browser favicon
- Login/signup pages
- Anywhere else logos are displayed


