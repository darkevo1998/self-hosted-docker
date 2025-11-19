-- SQL script to update existing platform logos to use the new amogam-logo.png
-- Run this script against your PostgreSQL database to update existing platforms

-- Update full logo URL
UPDATE platform 
SET "fullLogoUrl" = '/logo.png' 
WHERE "fullLogoUrl" LIKE '%cdn.activepieces.com%' 
   OR "fullLogoUrl" LIKE '%activepieces.com/brand%';

-- Update logo icon URL  
UPDATE platform 
SET "logoIconUrl" = '/logo-icon.png' 
WHERE "logoIconUrl" LIKE '%cdn.activepieces.com%' 
   OR "logoIconUrl" LIKE '%activepieces.com/brand%';

-- Update favicon URL
UPDATE platform 
SET "favIconUrl" = '/favicon.ico' 
WHERE "favIconUrl" LIKE '%cdn.activepieces.com%' 
   OR "favIconUrl" LIKE '%activepieces.com/brand%';

-- Verify the changes
SELECT id, name, "fullLogoUrl", "logoIconUrl", "favIconUrl" FROM platform;


