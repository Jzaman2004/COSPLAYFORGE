# 🚀 Stability AI Setup Guide (5 Minutes)

## Why Stability AI?

✅ **100 FREE images/month** (best free tier available)  
✅ **No billing required** for free tier  
✅ **Easy setup** (just 3 steps)  
✅ **High quality** (Stable Diffusion XL model)  
✅ **Fast generation** (~3-5 seconds per image)

---

## Step 1: Create Account (2 minutes)

1. Go to: **https://platform.stability.ai**
2. Click **"Sign Up"** (top right corner)
3. Use Google/GitHub or email to sign up
4. No credit card needed for free tier! ✨

---

## Step 2: Get Your API Key (1 minute)

1. After signing in, go to: **https://platform.stability.ai/account/keys**
2. Click **"Create New Key"** button
3. Name it: `CosplayForge`
4. Click **Create**
5. **IMPORTANT**: Copy your API key immediately (you can't see it again!)
   - Format: `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## Step 3: Add Key to CosplayForge (30 seconds)

1. Open your `.env.local` file in the project root
2. Find this line:
   ```
   VITE_STABILITY_API_KEY=YOUR_STABILITY_API_KEY_HERE
   ```
3. Replace `YOUR_STABILITY_API_KEY_HERE` with your actual key:
   ```
   VITE_STABILITY_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
4. Save the file
5. Restart your dev server:
   ```bash
   npm run dev
   ```

---

## 🎉 Test It!

1. Go to the **TryOnLab** page (shopping screen)
2. Click **"Regenerate"** button
3. You should see:
   - Loading spinner
   - Console log: `[Stability AI] Generating image for...`
   - Real AI-generated cosplay image appears!

---

## 📊 Free Tier Limits

| Feature | Free Tier |
|---------|-----------|
| **Images/month** | 100 |
| **Quality** | High (SDXL 1.0) |
| **Speed** | 3-5 seconds |
| **Billing Required** | ❌ No |
| **Rate Limit** | ~1 image/second |

---

## 🐛 Troubleshooting

### "Failed to fetch" or API error
- **Check**: Is your API key copied correctly in `.env.local`?
- **Check**: Did you restart the dev server after adding the key?
- **Check**: Does your key start with `sk-`?

### Console shows "No API key - using mock"
- Your `.env.local` file isn't being read
- Make sure the file is in the project root (same folder as `package.json`)
- Make sure variable name is exactly: `VITE_STABILITY_API_KEY`

### "Quota exceeded" error
- You've used your 100 free images this month
- Quota resets on the 1st of each month
- App automatically falls back to mock images

### Images look wrong or distorted
- This is expected occasionally with AI generation
- Click "Regenerate" to try again
- Each generation uses a random seed for variety

---

## 🔐 Security Note

- ✅ `.env.local` is in `.gitignore` (your key is safe)
- ✅ Keys never get committed to git
- ✅ API key only works from your project

---

## 🆚 Why Not Google Imagen?

| Feature | Stability AI | Google Imagen |
|---------|--------------|---------------|
| Free images/month | 100 | 100 |
| Billing required | ❌ No | ✅ Yes |
| Setup time | 5 mins | 10+ mins |
| API complexity | Simple | Complex |
| Project ID needed | ❌ No | ✅ Yes |

**Winner**: Stability AI (easier + no billing) 🏆

---

## 📚 Useful Links

- **API Keys**: https://platform.stability.ai/account/keys
- **Documentation**: https://platform.stability.ai/docs/api-reference
- **Pricing**: https://platform.stability.ai/pricing
- **Status Page**: https://status.stability.ai

---

## ✨ What You Get

Once configured, CosplayForge will generate character-specific cosplay images:

- **Gojo**: Black robe, white collar, blindfold, white gloves
- **Saitama**: Yellow jumpsuit, white tank top, bald head
- **Miku**: Teal outfit, blue twin-tails, platform shoes
- **Luffy**: Straw hat, red vest, blue shorts
- **Naruto**: Orange jumpsuit, ninja headband
- **Mikasa**: Military jacket, red scarf

Each character has:
- ✅ Male and female variants
- ✅ 3 different prompt styles (base, variation, regenerate)
- ✅ White background for clean display
- ✅ Photorealistic quality

---

## 🎯 Next Steps After Setup

1. ✅ Test image generation in TryOnLab
2. ✅ Try both Male and Female models
3. ✅ Test Regenerate button (fresh composition)
4. ✅ Test Variations button (different poses)
5. ✅ Check console for API logs
6. ✅ Monitor your usage at: https://platform.stability.ai/account/credits

---

Need help? Check the console logs or ask GitHub Copilot! 🚀
