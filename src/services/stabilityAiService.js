// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎨 STABILITY AI - CHARACTER-SPECIFIC COSPLAY IMAGE GENERATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Free Tier: 100 images/month with DreamStudio API key
// Get your key: https://platform.stability.ai/account/keys

const API_KEY = import.meta.env.VITE_STABILITY_API_KEY
const API_URL = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image'

// Character-specific mock images (fallback)
const CHARACTER_MOCK_IMAGES = {
  gojo: {
    male: 'https://images.unsplash.com/photo-1599986678514-d7cfa2f8c4b5?w=512&h=512&fit=crop',
    female: 'https://images.unsplash.com/photo-1595662066891-08d4d94b0fb0?w=512&h=512&fit=crop'
  },
  saitama: {
    male: 'https://images.unsplash.com/photo-1566211074306-88a0e40e4697?w=512&h=512&fit=crop',
    female: 'https://images.unsplash.com/photo-1508831281289-bccf5b36f58c?w=512&h=512&fit=crop'
  },
  miku: {
    male: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=512&h=512&fit=crop',
    female: 'https://images.unsplash.com/photo-1540528591063-b29b51fc061b?w=512&h=512&fit=crop'
  },
  luffy: {
    male: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=512&h=512&fit=crop',
    female: 'https://images.unsplash.com/photo-1583391733351-78be7f375c17?w=512&h=512&fit=crop'
  },
  naruto: {
    male: 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=512&h=512&fit=crop',
    female: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=512&h=512&fit=crop'
  },
  mikasa: {
    male: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=512&h=512&fit=crop',
    female: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=512&h=512&fit=crop'
  }
}

// Character-specific prompt templates (optimized for Stable Diffusion)
const CHARACTER_PROMPTS = {
  gojo: {
    male: [
      "full body portrait, male wearing Gojo Satoru black robe with white collar, black blindfold covering eyes, white gloves, standing pose, white background, photorealistic, high detail, professional cosplay photography, studio lighting",
      "full body portrait, male in Gojo's black robe, white collar detail, black blindfold, white gloves, confident pose with hand on hip, white background, photorealistic cosplay",
      "full body shot, male cosplayer as Gojo Satoru, black kimono robe, white collar, blindfold, gloves, perfect posture, white backdrop, professional photography"
    ],
    female: [
      "full body portrait, female wearing Gojo-inspired black robe with white collar, black blindfold, white gloves, elegant pose, white background, photorealistic, professional cosplay",
      "full body shot, female in black robe inspired by Gojo, white collar, blindfold, gloves, looking over shoulder, white background, high quality cosplay photography",
      "full body portrait, female cosplayer, black robe with white details, blindfold, confident stance, white backdrop, photorealistic"
    ]
  },
  saitama: {
    male: [
      "full body portrait, male wearing yellow spandex jumpsuit, white tank top, black gloves, bald head, white background, photorealistic, professional cosplay photography",
      "full body shot, male in yellow bodysuit, white shirt, black gloves, hero pose with fist raised, white background, detailed cosplay photography",
      "full body portrait, male cosplayer as Saitama, yellow suit, white tank top, black gloves, standing confidently, white backdrop, high detail"
    ],
    female: [
      "full body portrait, female wearing yellow spandex suit, white tank top, black gloves, athletic pose, white background, photorealistic cosplay",
      "full body shot, female in yellow jumpsuit, white shirt, black gloves, confident smile, white background, professional photography",
      "full body portrait, female cosplayer, yellow bodysuit, white top, black gloves, hero stance, white backdrop"
    ]
  },
  miku: {
    male: [
      "full body portrait, male wearing teal and white outfit, blue twin-tail wig, white skirt, black thigh-highs, platform shoes, white background, photorealistic cosplay",
      "full body shot, male in Hatsune Miku costume, blue wig, cyan outfit, white skirt, celebrating pose, white background, detailed photography",
      "full body portrait, male cosplayer as Miku, teal color scheme, blue twin-tails, outfit with white skirt, white backdrop"
    ],
    female: [
      "full body portrait, female wearing Hatsune Miku costume, blue twin-tail wig, cyan and white outfit, black thigh-highs, platform shoes, white background, photorealistic, professional cosplay photography",
      "full body shot, female as Miku, blue wig, teal outfit, white skirt, black stockings, playful pose, white background, high detail cosplay",
      "full body portrait, female cosplayer, Miku costume, blue twin-tails, cyan outfit, platform shoes, white backdrop, professional photography"
    ]
  },
  luffy: {
    male: [
      "full body portrait, male wearing straw hat, red vest, blue shorts, black shoes, arm bracelets, white background, photorealistic, One Piece cosplay",
      "full body shot, male in straw hat, red vest open, blue shorts, confident pose with fist up, white background, detailed cosplay photography",
      "full body portrait, male cosplayer as Luffy, straw hat, red vest, blue shorts, pirate stance, white backdrop"
    ],
    female: [
      "full body portrait, female wearing straw hat, red crop vest, blue shorts, black shoes, arm bracelets, white background, photorealistic cosplay",
      "full body shot, female in straw hat, red vest, blue shorts, energetic jumping pose, white background, professional photography",
      "full body portrait, female cosplayer, straw hat, red top, blue shorts, adventure ready pose, white backdrop"
    ]
  },
  naruto: {
    male: [
      "full body portrait, male wearing orange and blue jumpsuit, headband with metal plate, black sandals, white background, photorealistic, Naruto cosplay photography",
      "full body shot, male in orange jumpsuit, ninja headband, sandals, hand gesture pose, white background, detailed cosplay",
      "full body portrait, male cosplayer as Naruto, orange outfit, headband, ninja stance, white backdrop, professional photography"
    ],
    female: [
      "full body portrait, female wearing orange and blue jumpsuit, ninja headband with metal plate, black sandals, white background, photorealistic cosplay",
      "full body shot, female in orange jumpsuit, headband, sandals, confident ninja pose, white background, high detail",
      "full body portrait, female cosplayer, orange outfit, headband, ninja ready stance, white backdrop"
    ]
  },
  mikasa: {
    male: [
      "full body portrait, male wearing brown jacket, white pants, red scarf, military uniform, standing pose, white background, photorealistic, Attack on Titan cosplay",
      "full body shot, male in Survey Corps uniform, brown jacket, red scarf, confident stance, white background, detailed photography",
      "full body portrait, male cosplayer, military jacket, red scarf, white pants, soldier pose, white backdrop"
    ],
    female: [
      "full body portrait, female wearing brown jacket, white pants, red scarf, military uniform, standing pose, white background, photorealistic cosplay photography",
      "full body shot, female in Survey Corps uniform, brown jacket, iconic red scarf, determined pose, white background, professional photography",
      "full body portrait, female cosplayer as Mikasa, military outfit, red scarf, white backdrop, high detail"
    ]
  }
}

// Generate character-specific prompt
export const generateCharacterSpecificPrompt = (character, gender = 'male', promptIndex = 0) => {
  const characterLower = character?.toLowerCase() || 'gojo'
  const characterPrompts = CHARACTER_PROMPTS[characterLower]

  if (!characterPrompts) {
    console.log(`Character "${character}" not in presets, generating dynamic prompt`)
    // Dynamic generation fallbacks
    const dynamicPrompts = [
      `full body portrait, ${gender} cosplayer wearing detailed ${character} costume, standing pose, white background, photorealistic, high detail, professional cosplay photography, studio lighting, 8k resolution`,
      `full body shot, ${gender} as ${character}, screen accurate costume, confident pose, white background, detailed cosplay photography, soft shadows`,
      `full body portrait, ${gender} cosplayer in ${character} outfit, intricate details, perfect lighting, white backdrop, professional photography, masterpiece`
    ]
    return dynamicPrompts[promptIndex % 3]
  }

  const genderPromptsArray = characterPrompts[gender.toLowerCase()] || characterPrompts.male
  return genderPromptsArray[promptIndex % 3]
}

// Main image generation function
export const generateCharacterImage = async (character, gender = 'male', cartItems = []) => {
  const characterLower = character?.toLowerCase() || 'gojo'

  try {
    const prompt = generateCharacterSpecificPrompt(character, gender, 0)

    console.log(`[Stability AI] Generating image for ${character} (${gender})`)
    console.log(`[Stability AI] Prompt: ${prompt.substring(0, 100)}...`)
    console.log(`[Stability AI] API Key configured: ${!!API_KEY}`)

    // If no API key, use mock
    if (!API_KEY) {
      console.warn('[Stability AI] No API key - using mock image')
      const mockUrl = CHARACTER_MOCK_IMAGES[characterLower]?.[gender.toLowerCase()] || CHARACTER_MOCK_IMAGES.gojo.male
      return {
        imageUrl: mockUrl,
        prompt: prompt,
        character: character,
        gender: gender,
        timestamp: new Date().toISOString(),
        mock: true
      }
    }

    // Call Stability AI API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: prompt,
            weight: 1
          },
          {
            text: "blurry, low quality, distorted, deformed, ugly, bad anatomy, duplicate, watermark",
            weight: -1
          }
        ],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        samples: 1,
        steps: 30
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.warn('[Stability AI] API call failed:', errorData)
      const mockUrl = CHARACTER_MOCK_IMAGES[characterLower]?.[gender.toLowerCase()] || CHARACTER_MOCK_IMAGES.gojo.male
      return {
        imageUrl: mockUrl,
        prompt: prompt,
        character: character,
        gender: gender,
        timestamp: new Date().toISOString(),
        mock: true,
        apiError: errorData
      }
    }

    const data = await response.json()

    if (!data.artifacts || data.artifacts.length === 0) {
      throw new Error('No images generated')
    }

    // Stability AI returns base64 encoded images
    const base64Image = data.artifacts[0].base64
    const imageUrl = `data:image/png;base64,${base64Image}`

    return {
      imageUrl: imageUrl,
      prompt: prompt,
      character: character,
      gender: gender,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('[Stability AI] Generation error:', error.message)
    // Always fallback to mock on any error
    const mockUrl = CHARACTER_MOCK_IMAGES[characterLower]?.[gender.toLowerCase()] || CHARACTER_MOCK_IMAGES.gojo.male
    return {
      imageUrl: mockUrl,
      prompt: generateCharacterSpecificPrompt(character, gender, 0),
      character: character,
      gender: gender,
      timestamp: new Date().toISOString(),
      mock: true,
      error: error.message
    }
  }
}

// Generate variation with subtle changes
export const generateCharacterVariation = async (character, gender = 'male') => {
  const characterLower = character?.toLowerCase() || 'gojo'

  try {
    const prompt = generateCharacterSpecificPrompt(character, gender, 1)

    console.log(`[Stability AI] Generating variation for ${character}`)

    if (!API_KEY) {
      console.warn('[Stability AI] No API key - using mock variation')
      const mockUrl = CHARACTER_MOCK_IMAGES[characterLower]?.[gender.toLowerCase()] || CHARACTER_MOCK_IMAGES.gojo.male
      return {
        imageUrl: mockUrl,
        prompt: prompt,
        character: character,
        type: 'variation',
        timestamp: new Date().toISOString(),
        mock: true
      }
    }

    // Call Stability AI API with variation prompt
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: prompt,
            weight: 1
          },
          {
            text: "blurry, low quality, distorted, deformed, ugly, bad anatomy, duplicate, watermark",
            weight: -1
          }
        ],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        samples: 1,
        steps: 30,
        seed: Math.floor(Math.random() * 1000000) // Random seed for variation
      })
    })

    if (!response.ok) {
      console.warn('[Stability AI] Variation API call failed, using mock')
      const mockUrl = CHARACTER_MOCK_IMAGES[characterLower]?.[gender.toLowerCase()] || CHARACTER_MOCK_IMAGES.gojo.male
      return {
        imageUrl: mockUrl,
        prompt: prompt,
        character: character,
        type: 'variation',
        timestamp: new Date().toISOString(),
        mock: true
      }
    }

    const data = await response.json()

    if (!data.artifacts || data.artifacts.length === 0) {
      throw new Error('No variation generated')
    }

    const base64Image = data.artifacts[0].base64
    const imageUrl = `data:image/png;base64,${base64Image}`

    return {
      imageUrl: imageUrl,
      prompt: prompt,
      character: character,
      type: 'variation',
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('[Stability AI] Variation generation failed:', error.message)
    const mockUrl = CHARACTER_MOCK_IMAGES[characterLower]?.[gender.toLowerCase()] || CHARACTER_MOCK_IMAGES.gojo.male
    return {
      imageUrl: mockUrl,
      prompt: generateCharacterSpecificPrompt(character, gender, 1),
      character: character,
      type: 'variation',
      timestamp: new Date().toISOString(),
      mock: true
    }
  }
}

// Regenerate with completely fresh prompt
export const regenerateCharacterImage = async (character, gender = 'male') => {
  const characterLower = character?.toLowerCase() || 'gojo'

  try {
    const prompt = generateCharacterSpecificPrompt(character, gender, 2)

    console.log(`[Stability AI] Regenerating fresh image for ${character}`)

    if (!API_KEY) {
      console.warn('[Stability AI] No API key - using mock regenerated image')
      const mockUrl = CHARACTER_MOCK_IMAGES[characterLower]?.[gender.toLowerCase()] || CHARACTER_MOCK_IMAGES.gojo.male
      return {
        imageUrl: mockUrl,
        prompt: prompt,
        character: character,
        type: 'regenerate',
        timestamp: new Date().toISOString(),
        mock: true
      }
    }

    // Call Stability AI API with regenerate prompt
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: prompt,
            weight: 1
          },
          {
            text: "blurry, low quality, distorted, deformed, ugly, bad anatomy, duplicate, watermark",
            weight: -1
          }
        ],
        cfg_scale: 7.5,
        height: 1024,
        width: 1024,
        samples: 1,
        steps: 35,
        seed: Math.floor(Math.random() * 1000000) // Random seed for fresh generation
      })
    })

    if (!response.ok) {
      console.warn('[Stability AI] Regenerate API call failed, using mock')
      const mockUrl = CHARACTER_MOCK_IMAGES[characterLower]?.[gender.toLowerCase()] || CHARACTER_MOCK_IMAGES.gojo.male
      return {
        imageUrl: mockUrl,
        prompt: prompt,
        character: character,
        type: 'regenerate',
        timestamp: new Date().toISOString(),
        mock: true
      }
    }

    const data = await response.json()

    if (!data.artifacts || data.artifacts.length === 0) {
      throw new Error('No regenerated image created')
    }

    const base64Image = data.artifacts[0].base64
    const imageUrl = `data:image/png;base64,${base64Image}`

    return {
      imageUrl: imageUrl,
      prompt: prompt,
      character: character,
      type: 'regenerate',
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('[Stability AI] Regeneration failed:', error.message)
    const mockUrl = CHARACTER_MOCK_IMAGES[characterLower]?.[gender.toLowerCase()] || CHARACTER_MOCK_IMAGES.gojo.male
    return {
      imageUrl: mockUrl,
      prompt: generateCharacterSpecificPrompt(character, gender, 2),
      character: character,
      type: 'regenerate',
      timestamp: new Date().toISOString(),
      mock: true
    }
  }
}

export default {
  generateCharacterImage,
  generateCharacterVariation,
  regenerateCharacterImage,
  generateCharacterSpecificPrompt
}
