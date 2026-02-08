# Step 3: Demo Assets Guide 🎬

## Quick Setup Instructions

This guide helps you create real demo assets for CosplayForge. All assets are optional for demo purposes - placeholders are already in place.

---

## 1. 📹 Computer Use Demo Video (15 seconds)

### What it shows:
- Screen recording of "searching YouTube for cosplay tutorials"
- Caption: "Safety Kit Agent • Searching tutorials..."

### How to create:
1. Open YouTube.com in your browser
2. Use screen recording tool (Mac: ⌘Shift5 | Windows: Win+Shift+S | Linux: gnome-screenshot -a)
3. Record yourself:
   - Typing "Master Chief helmet tutorial foam"
   - Clicking first result
   - Letting it play 5 seconds
4. Edit in:
   - **Free Option**: CapCut (capcut.com) - add text overlay
   - **Premium**: Adobe Premiere, DaVinci Resolve
5. Export as MP4 (H.264 codec)
6. Save to: `public/demoVideos/youtube-search.mp4`

### File specs:
- **Format**: MP4 (H.264)
- **Duration**: 10-15 seconds
- **Resolution**: 1920x1080 (1080p)
- **Size**: <10MB

---

## 2. 🎨 Nano Banana Try-On Images

### What it shows:
- 3D mannequin with costume overlays
- Different angles per character

### How to create:
1. **Go to**: https://www.nanobananax.com/ (or similar)
2. **Upload**:
   - Base mannequin image
   - Costume texture overlay
3. **Generate** 3 angles:
   - Front view
   - Side view  
   - Back view
4. **Save to**:
   - `public/nanoBanana/mannequin-base.png`
   - `public/nanoBanana/spiderman-suit-overlay.png`
   - `public/nanoBanana/masterchief-armor-overlay.png`
   - etc.

### Alternative (Free):
- Use Photoshop/GIMP + free PSD mannequin templates
- Or: Procreate Dreams on iPad
- Or: Commission on Fiverr ($20-50)

### File specs:
- **Format**: PNG (transparent background)
- **Resolution**: 1024x1280 minimum
- **Size**: <5MB each
- **Need**: 6-9 images total (3 characters × 3 angles)

---

## 3. 🎙️ ElevenLabs Voice Clips

### What it shows:
- AI-cloned character voices giving cosplay tips
- Example: "Your helmet is 2° off. Adjust the crown."

### How to create:
1. **Sign up free**: https://elevenlabs.io/
2. **Free tier**: 10k characters/month
3. **Steps**:
   - Go to "Voice Library"
   - Select a professional voice (or upload sample if cloning)
   - Write script: `"Your helmet alignment is 2° off. Adjust the seams carefully."` 
   - Click "Generate"
   - Download MP3
4. **Create 3 clips**:
   - Master Chief (professional tone)
   - Saitama (calm monotone)
   - Asuka (confident/cool tone)
5. **Save to**: `public/voiceClips/masterchief-tip.mp3`

### Alternative (Free):
- Google Text-to-Speech (free, less natural)
- Natural Reader (free tier)
- Responsively read your script into phone mic, then clean up audio in Audacity

### File specs:
- **Format**: MP3 (128 kbps)
- **Duration**: 3-5 seconds each
- **Size**: <500KB each

---

## 4. 🎭 Solana NFT Mockup

### What it shows:
- Cosplay image as "verified NFT certificate"
- Shows blockchain badge/texture

### How to create:
1. **Go to**: https://www.canva.com (free account)
2. **Search**: "NFT Certificate" template
3. **Customize**:
   - Add cosplay photo
   - Replace text: YourTeamName
   - Add "Verified Build"
   - Colors: Purple/Cyan theme
4. **Download** as PNG
5. **Save to**: `public/mocks/nft-preview.png`

### Alternative:
- Photoshop template
- Figma NFT template
- Commission on Fiverr ($10-20)

### File specs:
- **Format**: PNG
- **Resolution**: 1080x1080 (square for NFT)
- **Size**: <2MB

---

## 5. 📐 Figma Blueprint Screenshot

### What it shows:
- Design document with layers
- Shows "professional design system"

### How to create:
1. **Go to**: https://figma.com (free account)
2. **Create new file**
3. **Add Layers** (in Layers panel):
   - Helmet_Base
   - Paint_Mask
   - Ventilation_Ports
   - Cape_Pattern
   - Seam_Lines
   - Material_Annotations
4. **Design quick mockup**:
   - Add cosplay images
   - Add text annotations
   - Use purple/cyan colors
5. **Screenshot** (Cmd/Ctrl+Shift+4)
6. **Save to**: `public/mocks/figma-blueprint.png`

### Alternative:
- Use free Figma design
- Screenshot Miro board
- DIY in Photoshop

### File specs:
- **Format**: PNG
- **Resolution**: 1920x1080 minimum
- **Size**: <3MB

---

## 6. 🎬 Bonus: Animated Solana Mint GIF (Optional)

### Create Solana minting animation:
1. **Tool**: https://www.animaker.com/ (free)
2. **Create**: 3-second animation showing:
   - Wallet connection
   - Transaction processing
   - "Minted!" confirmation
3. **Export** as GIF
4. **Save to**: `public/animations/solana-mint.gif`

---

## Logos & Branding

Copy these as SVG or PNG:
- Vultr logo → `public/logos/vultr-badge.svg`
- Solana logo → `public/logos/solana.svg`
- Figma logo → `public/logos/figma.svg`

Free sources:
- LogoPedia
- Icons8
- Flaticon
- Company official pages

---

## 📋 Checklist

- [ ] YouTube search demo video
- [ ] 3x try-on base images (mannequins)
- [ ] 9x overlay images (3 characters × 3 angles)
- [ ] 3x ElevenLabs voice clips
- [ ] Solana NFT mockup image
- [ ] Figma blueprint screenshot
- [ ] (Optional) Solana mint animation GIF

---

## Timeline Estimate

| Task | Time | Tools |
|------|------|-------|
| Video recording + edit | 10 min | CapCut |
| Nano Banana generation | 10 min | nanobananax.com |
| ElevenLabs voices | 5 min | elevenlabs.io |
| NFT mockup | 5 min | Canva |
| Figma blueprint | 5 min | Figma |
| **Total** | **~35 min** | Free tools |

---

## Placeholder System

If you don't create real assets yet, **the app still works** with:
- Placeholder SVG images
- Silent video player UI
- Placeholder audio player
- Mock data displays

This lets you demo the UX while creating real assets in parallel.

---

## Need Help?

Already made some assets? Just drop them in the correct folders:
- `/public/demoVideos/` for videos
- `/public/nanoBanana/` for try-on images
- `/public/voiceClips/` for audio
- `/public/mocks/` for mockup images
- `/public/animations/` for GIFs

The app will auto-load them! 🚀
