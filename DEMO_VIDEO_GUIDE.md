# Demo Video Recording Guide

## 🎯 What They're Asking For

**Request:** Record a demo video showing:
1. **Language Translation** - How users can select their language and see the entire interface in that language
2. **Use Case Example** - A practical workflow example (like integrating with an app from the connectors catalog)
3. **Real Demonstration** - Show it working in real-time

**Reference:** https://www.activepieces.com/pieces (Connectors catalog)

## 📹 Demo Video Script & Steps

### Video Duration: 5-7 minutes

### Part 1: Introduction (30 seconds)
**What to say:**
- "This is a demo of self-hosted Activepieces with full native language support"
- "I'll show you how users can select their language and create workflows in their native language"

**What to show:**
- Browser window with Activepieces dashboard
- URL: http://localhost:8080

---

### Part 2: Language Selection (1-2 minutes)
**What to say:**
- "First, let me show you the language selection feature"
- "Users can choose from 11 supported languages"

**What to show:**
1. **Login to dashboard** (if not logged in)
2. **Click profile icon** (top-right corner)
3. **Go to Settings/Preferences**
4. **Find Language/Locale option**
5. **Show language dropdown** with options:
   - Arabic (ar)
   - German (de)
   - English (en)
   - Spanish (es)
   - French (fr)
   - Japanese (ja)
   - Dutch (nl)
   - Portuguese (pt)
   - Russian (ru)
   - Chinese Simplified (zh)
   - Chinese Traditional (zh-TW)

6. **Select a language** (e.g., Arabic or Spanish)
7. **Show entire interface switching** - point out:
   - Menu items change
   - Buttons change
   - All text changes
   - No English text remains

**Key Points to Highlight:**
- ✅ Entire interface switches immediately
- ✅ All menus in selected language
- ✅ All buttons in selected language
- ✅ No English text visible

---

### Part 3: Use Case - Creating Workflow (3-4 minutes)
**What to say:**
- "Now let me show you a practical example"
- "I'll create a workflow that integrates with [app name]"
- "Everything will be in the selected language"

**What to show:**

#### Step 1: Navigate to Flow Builder
1. Click "New Flow" or "Create Flow" (in selected language)
2. Show the visual workflow builder

#### Step 2: Browse Connectors Catalog
1. Click on "Add Trigger" or "Add Step"
2. Show the connectors/pieces catalog
3. **Highlight that all piece names are in the selected language**
4. Browse through categories:
   - Communication (Email, Slack, etc.)
   - Data (Google Sheets, Airtable, etc.)
   - Automation (HTTP, Code, etc.)
   - Show 3-4 examples

#### Step 3: Create a Practical Workflow
**Suggested Use Case: Email to Google Sheets**

1. **Add Trigger:**
   - Search for "Email" or "Gmail"
   - Select "New Email" trigger
   - Show configuration in selected language
   - Configure (if needed)

2. **Add Action:**
   - Search for "Google Sheets"
   - Select "Add Row" action
   - Show configuration form in selected language
   - Point out all labels and fields are translated

3. **Configure Workflow:**
   - Show how to map data from email to Google Sheets
   - Show all text in selected language
   - Explain the workflow logic

4. **Save and Publish:**
   - Click "Save" (in selected language)
   - Click "Publish" (in selected language)
   - Show workflow is now active

#### Step 4: Show Workflow Running
1. Navigate to "Runs" or "Executions"
2. Show execution logs (if available)
3. Point out logs are in selected language

---

### Part 4: Summary (30 seconds)
**What to say:**
- "As you can see, Activepieces supports full native language translation"
- "Users can create workflows entirely in their language"
- "All 200+ integrations are localized"
- "Everything runs in Docker containers on the user's machine"

**What to show:**
- Quick overview of:
  - Language selection
  - Workflow builder
  - Connectors catalog
  - All in selected language

---

## 🎬 Recording Setup

### Tools Needed
1. **Screen Recording Software:**
   - Windows: Built-in Xbox Game Bar (Win+G) or OBS Studio
   - Mac: QuickTime Player or ScreenFlow
   - Linux: OBS Studio or SimpleScreenRecorder

2. **Microphone** (optional but recommended)

### Recording Settings
- **Resolution:** 1920x1080 (Full HD) or 1280x720 (HD)
- **Frame Rate:** 30 FPS
- **Audio:** Record system audio + microphone
- **Format:** MP4 (recommended)

### Before Recording Checklist
- [ ] Activepieces is running (http://localhost:8080)
- [ ] Browser window is maximized
- [ ] Clear browser cache (for clean demo)
- [ ] Test language switching works
- [ ] Have a test workflow idea ready
- [ ] Close unnecessary applications
- [ ] Test screen recording software
- [ ] Check audio levels

---

## 📋 Step-by-Step Recording Instructions

### Step 1: Prepare Your Environment
```bash
# 1. Ensure Activepieces is running
docker compose -p activepieces ps

# 2. Open browser to http://localhost:8080
# 3. Login to dashboard
# 4. Clear browser cache (Ctrl+Shift+Delete)
```

### Step 2: Set Up Screen Recording
1. Open your screen recording software
2. Select area: Full screen or browser window
3. Test recording for 5 seconds
4. Check audio is working
5. Position browser window nicely

### Step 3: Record Part 1 - Introduction
- Start recording
- Show browser with Activepieces
- Give introduction
- Stop recording (or pause)

### Step 4: Record Part 2 - Language Selection
- Resume recording
- Follow language selection steps
- Show interface switching
- Highlight no English text
- Stop recording (or pause)

### Step 5: Record Part 3 - Workflow Creation
- Resume recording
- Create workflow following script
- Show connectors catalog
- Show all text in selected language
- Complete workflow setup
- Stop recording (or pause)

### Step 6: Record Part 4 - Summary
- Resume recording
- Give summary
- Show key features
- End recording

### Step 7: Edit Video (Optional)
- Trim unnecessary parts
- Add text overlays (optional)
- Add transitions (optional)
- Export final video

---

## 🎯 Suggested Use Cases for Demo

### Option 1: Email to Google Sheets
**Trigger:** New Email (Gmail)
**Action:** Add Row to Google Sheets
**Why:** Simple, visual, easy to understand

### Option 2: Schedule to HTTP Request
**Trigger:** Schedule (Every hour)
**Action:** HTTP Request (Call API)
**Why:** Shows automation, no external dependencies

### Option 3: Webhook to Database
**Trigger:** Webhook
**Action:** Save to Database
**Why:** Shows real-world integration

### Option 4: File Upload to Cloud Storage
**Trigger:** New File
**Action:** Upload to Google Drive/Dropbox
**Why:** Practical file automation

**Recommended:** Option 1 (Email to Google Sheets) - Most visual and easy to follow

---

## 📝 Detailed Script for Email to Google Sheets Demo

### Introduction (30 sec)
```
"Hi, I'm going to show you Activepieces with full native language support.
First, let me show you how users can select their language, then I'll
create a practical workflow example."
```

### Language Selection (1 min)
```
"Let me select Arabic as the language. I'll go to my profile settings...
[Click profile → Settings → Language]

Here you can see all available languages. Let me select Arabic...
[Select Arabic]

Notice how the entire interface switches immediately - all menus, buttons,
and text are now in Arabic. There's no English text remaining."
```

### Workflow Creation (3 min)
```
"Now let me create a practical workflow. I'll build an automation that
saves new emails to Google Sheets.

First, I'll add a trigger. Let me search for Gmail...
[Search for Gmail]

All the piece names and descriptions are in Arabic. Let me select
'New Email' trigger...
[Select trigger]

Now I'll add an action. Let me search for Google Sheets...
[Search for Google Sheets]

Again, everything is in Arabic. I'll select 'Add Row' action...
[Select action]

Now I'll configure it. Notice all the form fields and labels are in Arabic.
I'll map the email subject and body to the spreadsheet...
[Configure mapping]

Let me save and publish this workflow...
[Save and Publish]

Perfect! The workflow is now active and will automatically save new emails
to Google Sheets, all configured in Arabic."
```

### Summary (30 sec)
```
"As you can see, Activepieces provides complete native language support.
Users can select their language, and the entire interface - including all
200+ integrations - switches to that language. Workflows can be created
and managed entirely in the user's native language, with no English text
remaining. Everything runs in Docker containers on the user's machine."
```

---

## 🎥 Video Editing Tips

### If Editing:
1. **Add Title Card:**
   - "Activepieces - Native Language Support Demo"
   - Duration: 3-5 seconds

2. **Add Text Overlays:**
   - "Language Selection" (during Part 2)
   - "Creating Workflow" (during Part 3)
   - "All in [Language Name]" (throughout)

3. **Add Highlights:**
   - Circle/arrow pointing to language selector
   - Highlight translated text
   - Show before/after comparison (optional)

4. **Add Ending:**
   - "Thank you for watching"
   - Contact info or website (optional)

---

## 📤 Sharing the Video

### File Formats:
- **Recommended:** MP4 (H.264 codec)
- **Size:** Try to keep under 100MB if possible
- **Resolution:** 1920x1080 or 1280x720

### Sharing Options:
1. **Google Drive** - Upload and share link
2. **YouTube** - Upload as unlisted video
3. **Dropbox** - Upload and share link
4. **WeTransfer** - For large files
5. **Email** - If file is small enough

### What to Include:
- Video file
- Brief description of what's shown
- Language used in demo
- Use case demonstrated

---

## ✅ Final Checklist Before Recording

- [ ] Activepieces is running and accessible
- [ ] You're logged into dashboard
- [ ] Language selection works
- [ ] You have a test app/integration ready (Gmail, Google Sheets, etc.)
- [ ] Screen recording software is set up
- [ ] Audio is working
- [ ] Browser is clean and ready
- [ ] You've practiced the workflow once
- [ ] Script is ready (or you're comfortable improvising)

---

## 🚀 Quick Start (5-Minute Setup)

1. **Start Activepieces:**
   ```bash
   docker compose -p activepieces up -d
   ```

2. **Open Browser:**
   - Go to http://localhost:8080
   - Login

3. **Open Screen Recorder:**
   - Windows: Press Win+G (Xbox Game Bar)
   - Mac: Cmd+Shift+5 (Screen Recording)
   - Or use OBS Studio

4. **Start Recording:**
   - Follow the script above
   - Show language selection
   - Create a simple workflow
   - Keep it under 7 minutes

5. **Stop and Save:**
   - Save as MP4
   - Upload to Google Drive
   - Share the link

---

**Good luck with your demo video! 🎬**

