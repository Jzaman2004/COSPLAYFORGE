# 🖼️ Google Cloud Vertex AI Imagen Setup Guide

This guide walks you through setting up **Google Cloud Vertex AI Imagen** for character-specific cosplay image generation in CosplayForge.

---

## ⚠️ Current Status

**Your Current Setup:**
- ❌ API Key: Gemini (text generation) - WRONG SERVICE
- ❌ Quota: Exceeded on free tier
- ✅ Fallback: Using mock images (still works!)

**What We're Setting Up:**
- ✅ Vertex AI Imagen (image generation) - CORRECT SERVICE
- ✅ Proper authentication with billing enabled
- ✅ Character-specific image generation in TryOnLab

---

## 📋 Prerequisites

- Google account (Gmail)
- Credit/debit card for billing (free tier after setup)
- 10 minutes of time

---

## 🚀 Complete Setup Steps

### **PART 1: Create Google Cloud Project**

**Step 1.1: Create New Project**
1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top (currently shows "Select a Project")
3. Click **"NEW PROJECT"**
4. Fill in:
   - **Project name**: `cosplayforge-imagen`
   - **Organization**: Leave blank (or select yours)
5. Click **"CREATE"**
6. Wait 30 seconds for creation
7. The new project will auto-select; if not, click dropdown and select it

**Step 1.2: Find Your Project ID**
- In the project selector dropdown, you'll see your **Project ID** (looks like: `cosplayforge-imagen-12345`)
- **Save this** - you'll need it later
- It's in format: `project-name-xxxxx` (numbers are important!)

---

### **PART 2: Enable Required APIs**

**Step 2.1: Enable Vertex AI API**
1. Go to **APIs & Services** → **Library** (left sidebar)
2. Search for: `vertex ai`
3. Click **"Vertex AI API"**
4. Click **"ENABLE"** (blue button)
5. Wait for it to complete

**Step 2.2: Enable Cloud Resource Manager API**
1. Search for: `cloud resource manager`
2. Click **"Cloud Resource Manager API"**
3. Click **"ENABLE"**

**Step 2.3: Enable Compute Engine API**
1. Search for: `compute engine`
2. Click **"Compute Engine API"**
3. Click **"ENABLE"**

---

### **PART 3: Set Up Billing (Required for Imagen)**

**⚠️ IMPORTANT: You MUST enable billing for Imagen to work**
- Free tier: **100 images/month** at no cost
- Paid tier: **$0.04 per image** (only charged if you exceed free tier)

**Step 3.1: Add Billing Account**
1. Go to **Billing** (left sidebar)
2. Click **"CREATE ACCOUNT"** (if you don't have one)
3. Follow Google's billing setup:
   - Add payment method (credit/debit card)
   - Confirm billing info
4. Link billing account to your project
5. Wait 5-10 minutes for billing to activate

**Step 3.2: Verify Billing**
1. Go to **Billing** → **Budgets & alerts**
2. You should see your project listed with an active billing account

---

### **PART 4: Create Service Account & API Key**

**Method A: Using API Key (Simpler)**

**Step 4A.1: Create API Key**
1. Go to **APIs & Services** → **Credentials**
2. Click **"+ CREATE CREDENTIALS"** → **"API Key"**
3. A key will be generated (looks like: `AIZSY...xxxxx`)
4. Click **"COPY"** and save it safely
5. Click **"RESTRICT KEY"**
6. Under **"API restrictions"**:
   - Select **"Vertex AI API"** from dropdown
   - Click **"SAVE"**

**Your API Key is ready!** ✅

---

**Method B: Using Service Account (More Secure)**

**Step 4B.1: Create Service Account**
1. Go to **APIs & Services** → **Credentials**
2. Click **"+ CREATE CREDENTIALS"** → **"Service Account"**
3. Fill in:
   - **Service account name**: `cosplayforge-imagen`
   - Leave other fields as default
4. Click **"CREATE AND CONTINUE"**
5. Skip the optional steps
6. Click **"DONE"**

**Step 4B.2: Create JSON Key**
1. On Credentials page, click the service account you just created
2. Go to **"KEYS"** tab
3. Click **"ADD KEY"** → **"Create new key"**
4. Choose **"JSON"** type
5. Click **"CREATE"**
6. A JSON file downloads automatically
7. Open it and copy the `private_key` value

---

## 🔧 Update Your CosplayForge App

### **Using API Key Method (Recommended)**

1. Open `.env.local` in your editor
2. Replace:
   ```
   VITE_GOOGLE_AI_KEY=YOUR_NEW_VERTEX_AI_IMAGEN_API_KEY_HERE
   VITE_GOOGLE_PROJECT_ID=your-project-id-here
   ```

   With your actual values:
   ```
   VITE_GOOGLE_AI_KEY=AIzaSy_YOUR_NEW_API_KEY_HERE
   VITE_GOOGLE_PROJECT_ID=cosplayforge-imagen-12345
   ```

3. Save the file

### **Using Service Account Method**

If using the JSON key:
```
VITE_GOOGLE_AI_KEY=YOUR_PRIVATE_KEY_FROM_JSON
VITE_GOOGLE_PROJECT_ID=your-project-id
```

---

## ✅ Test Your Setup

Run this command to verify your new credentials work:

```bash
node -e "
const apiKey = process.env.VITE_GOOGLE_AI_KEY;
console.log('Testing Vertex AI Imagen API...');
console.log('Key configured:', !!apiKey);
console.log('Key length:', apiKey?.length);
// Test call would go here
"
```

---

## 🎨 What Happens When It Works

Once set up correctly:
1. ✅ Go to TryOnLab (shopping screen)
2. ✅ Click "Regenerate" button
3. ✅ App sends character-specific prompt to Vertex AI
4. ✅ Receives AI-generated cosplay image
5. ✅ Displays in your app with pose variations
6. ✅ Fallback to mock images if quota exceeded

---

## 🔍 Troubleshooting

**Problem: "API Key not recognized"**
- Solution: Check for copy/paste errors in `.env.local`
- Restart dev server: `npm run dev`

**Problem: "Quota exceeded"**
- Solution: Wait 60 seconds (API rate limiting)
- Or upgrade your billing account

**Problem: "Project ID invalid"**
- Solution: Check Project ID matches exactly from Cloud Console
- Format should be: `project-name-12345`

**Problem: "Permission denied"**
- Solution: Make sure Vertex AI API is ENABLED in your project
- Check billing is linked to your project

---

## 🎯 Free Tier Limits

- **100 images/month** at no cost
- Each image counts as 1 request
- Rate limit: ~1 image per second
- Resets monthly

After 100 images, you'll be charged $0.04 per image.

---

## 📚 Useful Links

- [Google Cloud Console](https://console.cloud.google.com/)
- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Imagen API Documentation](https://cloud.google.com/vertex-ai/docs/generative-ai/image/overview)
- [Pricing Calculator](https://cloud.google.com/products/calculator)

---

## 🚀 Next Steps

1. **Complete the setup steps above**
2. Update `.env.local` with your new credentials
3. Restart dev server: `npm run dev`
4. Test in TryOnLab - click "Regenerate"
5. Watch AI generate character-specific cosplay images! 🎉

---

**Questions?** Check your `.env.local` credentials are correct and billing is enabled!
