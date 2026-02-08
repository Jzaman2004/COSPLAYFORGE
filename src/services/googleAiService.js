// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎨 GOOGLE AI STUDIO - CHARACTER-SPECIFIC IMAGE GENERATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const API_KEY = import.meta.env.VITE_GOOGLE_AI_KEY

// Character-specific mock images (fallback)
const CHARACTER_MOCK_IMAGES = {
  gojo: {
    male: 'https://images.unsplash.com/photo-1599986678514-d7cfa2f8c4b5?w=400&h=400&fit=crop',
    female: 'https://images.unsplash.com/photo-1595662066891-08d4d94b0fb0?w=400&h=400&fit=crop'
  },
  saitama: {
    male: 'https://images.unsplash.com/photo-1566211074306-88a0e40e4697?w=400&h=400&fit=crop',
    female: 'https://images.unsplash.com/photo-1508831281289-bccf5b36f58c?w=400&h=400&fit=crop'
  },
  miku: {
    male: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=400&h=400&fit=crop',
    female: 'https://images.unsplash.com/photo-1540528591063-b29b51fc061b?w=400&h=400&fit=crop'
  },
  luffy: {
    male: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=400&fit=crop',
    female: 'https://images.unsplash.com/photo-1583391733351-78be7f375c17?w=400&h=400&fit=crop'
  },
  naruto: {
    male: 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=400&h=400&fit=crop',
    female: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=400&fit=crop'
  }
}

// Character-specific prompt templates
const CHARACTER_PROMPTS = {
  gojo: {
    male: (items) => [
      "Full-body shot of a male wearing Gojo's iconic black robe with white collar, black blindfold (not sunglasses), white gloves, and black fingerless gloves underneath. Background is white. Photorealistic, high detail, professional cosplay quality. The robe has the distinctive Jujutsu Kaisen style with open sleeves.",
      "Variation: Full-body shot of a male wearing Gojo's black robe with white collar, black blindfold, white gloves. Slightly turned to the left, hand on hip. Professional cosplay quality.",
      "Regenerate: Full-body shot of male in Gojo's complete outfit - black robe, white collar, black blindfold, white gloves. Standing confidently with perfect posture. Photorealistic cosplay quality."
    ],
    female: (items) => [
      "Full-body shot of a female wearing Gojo's black robe adapted for female form with white collar, black blindfold, white gloves. Background is white. Photorealistic, high detail, professional cosplay quality.",
      "Variation: Female wearing Gojo's black robe, white collar, black blindfold, white gloves. Looking over shoulder. Professional cosplay quality.",
      "Regenerate: Full-body shot of female in Gojo's adapted outfit - black robe, white collar details, black blindfold, white gloves. Confident stance. Photorealistic quality."
    ]
  },
  saitama: {
    male: (items) => [
      "Full-body shot of a male wearing Saitama's iconic yellow spandex jumpsuit, white tank top, black gloves, and white sneakers. Background is white. Photorealistic, high detail, professional cosplay quality. The jumpsuit has the distinctive One Punch Man style with the Saitama logo on chest.",
      "Variation: Male wearing Saitama's yellow jumpsuit, white tank top, black gloves. Smiling with fist raised. Professional cosplay quality.",
      "Regenerate: Full-body shot of male in complete Saitama outfit - yellow spandex suit, white tank top, black gloves, white shoes. Standing with confident hero pose. Photorealistic quality."
    ],
    female: (items) => [
      "Full-body shot of a female wearing Saitama's yellow spandex jumpsuit adapted for female form, white tank top, black gloves, white sneakers. Background is white. Photorealistic, high detail, professional cosplay quality.",
      "Variation: Female wearing Saitama's yellow jumpsuit, white tank top, black gloves. Smiling confidently. Professional cosplay quality.",
      "Regenerate: Full-body shot of female in adapted Saitama outfit - yellow spandex suit, white tank top, black gloves, white shoes. Hero pose. Photorealistic quality."
    ]
  },
  miku: {
    male: (items) => [
      "Full-body shot of a male wearing Hatsune Miku's costume - teal color scheme with blue twin-tail wig, white skirt with cyan trim, black thigh-highs, black platform shoes, and cyan tie. Background is white. Photorealistic, high detail, professional cosplay quality. Distinctive Vocaloid style.",
      "Variation: Male wearing Miku's teal outfit, blue wig, white skirt, black thigh-highs. Posing with raised arms, celebrating. Professional cosplay quality.",
      "Regenerate: Full-body shot male in Miku costume - blue twin-tail wig, cyan and white outfit, black thigh-highs, platform shoes. Perfect Vocaloid styling. Photorealistic quality."
    ],
    female: (items) => [
      "Full-body shot of a female wearing Hatsune Miku's iconic costume - teal color scheme with blue twin-tail wig, white skirt with cyan trim, black thigh-highs, black platform shoes, and cyan bow. Background is white. Photorealistic, high detail, professional cosplay quality. Distinctive Vocaloid style with the blue bow.",
      "Variation: Female wearing Miku's teal outfit, blue wig, white skirt, black thigh-highs. Looking over shoulder with hands in pockets. Professional cosplay quality.",
      "Regenerate: Full-body shot female in Miku costume - blue twin-tail wig, cyan and white frilly outfit, black thigh-highs, platform shoes. Perfect Vocaloid character appearance. Photorealistic quality."
    ]
  },
  luffy: {
    male: (items) => [
      "Full-body shot of a male wearing Luffy's iconic straw hat, red vest open at chest, blue shorts, black shoes with white socks, and arm string bracelets. Background is white. Photorealistic, high detail, professional cosplay quality. Distinctive One Piece style.",
      "Variation: Male wearing Luffy's straw hat, red vest, blue shorts, black shoes. Striking a confident pose with fist in air. Professional cosplay quality.",
      "Regenerate: Full-body shot male in Luffy outfit - straw hat, red vest, blue shorts, black shoes, arm bands. Classic pirate captain stance. Photorealistic quality."
    ],
    female: (items) => [
      "Full-body shot of a female wearing Luffy's straw hat, red crop top/vest, blue shorts, black shoes, and arm bracelets. Background is white. Photorealistic, high detail, professional cosplay quality. One Piece cosplay style.",
      "Variation: Female wearing Luffy's straw hat, red vest, blue shorts, black shoes. Energetic jumping pose. Professional cosplay quality.",
      "Regenerate: Full-body shot female in Luffy outfit - straw hat, red vest top, blue shorts, black shoes, arm bands. Adventure ready stance. Photorealistic quality."
    ]
  },
  naruto: {
    male: (items) => [
      "Full-body shot of a male wearing Naruto's iconic orange and blue jumpsuit with white striped edges, tied headband with Leaf Village symbol, and black sandals. Background is white. Photorealistic, high detail, professional cosplay quality. Distinctive Naruto anime style.",
      "Variation: Male wearing Naruto's orange jumpsuit, headband, black sandals. Excited with hand gesture and smile. Professional cosplay quality.",
      "Regenerate: Full-body shot male in Naruto outfit - orange blue jumpsuit, Leaf Village headband, black sandals. Ready for ninja action stance. Photorealistic quality."
    ],
    female: (items) => [
      "Full-body shot of a female wearing Naruto's orange and blue jumpsuit adapted for female form with white striped edges, tied headband with Leaf Village symbol, and black sandals. Background is white. Photorealistic, high detail, professional cosplay quality.",
      "Variation: Female wearing Naruto's orange jumpsuit, headband, black sandals. Confident ninja pose with raised hand. Professional cosplay quality.",
      "Regenerate: Full-body shot female in adapted Naruto outfit - orange blue jumpsuit, Leaf Village headband, black sandals. Ninja ready stance. Photorealistic quality."
    ]
  }
}

// Generate character-specific prompt based on inputs
export const generateCharacterSpecificPrompt = (character, gender = 'male', itemIndex = 0) => {
  const characterLower = character?.toLowerCase() || 'gojo'
  const characterPrompts = CHARACTER_PROMPTS[characterLower]
  
  if (!characterPrompts) {
    console.warn(`Character "${character}" not found, defaulting to Gojo`)
    return CHARACTER_PROMPTS.gojo[gender.toLowerCase()][itemIndex % 3]
  }
  
  const genderPromptsArray = characterPrompts[gender.toLowerCase()] || characterPrompts.male
  return genderPromptsArray[itemIndex % 3]
}

// Main image generation function
export const generateCharacterImage = async (character, gender = 'male', cartItems = []) => {
  const characterLower = character?.toLowerCase() || 'gojo'
  
  try {
    const prompt = generateCharacterSpecificPrompt(character, gender, 0)
    
    console.log(`[Google AI] Generating image for ${character} (${gender})`)
    console.log(`[Google AI] Prompt: ${prompt.substring(0, 100)}...`)
    console.log(`[Google AI] API Key configured: ${!!API_KEY}`)

    // If no API key, use mock
    if (!API_KEY) {
      console.warn('[Google AI] No API key - using mock image')
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

    // Try to call actual API - with proper Vertex AI format
    const projectId = 'cosplayforge-ai' // Placeholder for demo
    const location = 'us-central1'
    
    const response = await fetch(
      `https://${location}-aiplatform.googleapis.com/v1beta/projects/${projectId}/locations/${location}/models/imagegeneration:predict`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          instances: [{
            prompt: prompt,
            sampleImageSize: 400
          }],
          parameters: {
            sampleCount: 1
          }
        })
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.warn('[Google AI] API call failed, using mock:', errorData)
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
    
    if (!data.predictions || data.predictions.length === 0) {
      throw new Error('No images generated')
    }

    return {
      imageUrl: data.predictions[0].bytesBase64Encoded ? `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}` : data.predictions[0],
      prompt: prompt,
      character: character,
      gender: gender,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('[Google AI] Generation error:', error.message)
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
    
    console.log(`[Google AI] Generating variation for ${character}`)

    if (!API_KEY) {
      console.warn('[Google AI] No API key - using mock variation')
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

    // Try API call
    const projectId = 'cosplayforge-ai'
    const location = 'us-central1'
    
    const response = await fetch(
      `https://${location}-aiplatform.googleapis.com/v1beta/projects/${projectId}/locations/${location}/models/imagegeneration:predict`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          instances: [{
            prompt: prompt,
            sampleImageSize: 400
          }],
          parameters: {
            sampleCount: 1
          }
        })
      }
    )

    if (!response.ok) {
      console.warn('[Google AI] Variation API call failed, using mock')
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
    
    if (!data.predictions || data.predictions.length === 0) {
      throw new Error('No variation generated')
    }

    return {
      imageUrl: data.predictions[0].bytesBase64Encoded ? `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}` : data.predictions[0],
      prompt: prompt,
      character: character,
      type: 'variation',
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('[Google AI] Variation generation failed:', error.message)
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
    
    console.log(`[Google AI] Regenerating fresh image for ${character}`)

    if (!API_KEY) {
      console.warn('[Google AI] No API key - using mock regenerated image')
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

    // Try API call
    const projectId = 'cosplayforge-ai'
    const location = 'us-central1'
    
    const response = await fetch(
      `https://${location}-aiplatform.googleapis.com/v1beta/projects/${projectId}/locations/${location}/models/imagegeneration:predict`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          instances: [{
            prompt: prompt,
            sampleImageSize: 400
          }],
          parameters: {
            sampleCount: 1
          }
        })
      }
    )

    if (!response.ok) {
      console.warn('[Google AI] Regenerate API call failed, using mock')
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
    
    if (!data.predictions || data.predictions.length === 0) {
      throw new Error('No regenerated image created')
    }

    return {
      imageUrl: data.predictions[0].bytesBase64Encoded ? `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}` : data.predictions[0],
      prompt: prompt,
      character: character,
      type: 'regenerate',
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('[Google AI] Regeneration failed:', error.message)
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
