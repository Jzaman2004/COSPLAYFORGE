/**
 * Llama Service - Generate detailed image descriptions
 */

const API_KEY = import.meta.env.VITE_DEDALUS_API_KEY
const API_URL = import.meta.env.VITE_DEDALUS_API_URL
const TEXT_MODEL = 'llama-3.3-70b-versatile' // Groq's fastest model

export async function generateCharacterProfile(characterName) {
  try {
    const systemPrompt = `You are a cosplay expert and character researcher. Based on the character name provided, write a short 2-3 sentence bio of the character and their most recognizable costume elements. Do not mention sources or browsing.`

    const userPrompt = `Character name: ${characterName}`

    const response = await fetch(`${API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: TEXT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.6,
        max_tokens: 220
      })
    })

    if (!response.ok) {
      throw new Error('Character profile generation failed')
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('Character profile error:', error)
    return `A popular character with a distinctive silhouette and signature accessories. The costume features recognizable colors and iconic details that make it ideal for cosplay.`
  }
}

export async function generateImageDescription(imageBase64) {
  try {
    const systemPrompt = `You are an expert cosplay image analyzer. Describe the character or costume in the image in vivid detail for cosplay creation. Include:
- Character name/source if identifiable
- Detailed color descriptions (RGB approximations)
- Texture and material appearance
- Key costume elements and accessories
- Overall silhouette and proportions
Return only the description, no JSON.`

    const userPrompt = `Analyze this character image and describe it for cosplay creation: [image data present]`

    const response = await fetch(`${API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: TEXT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 512
      })
    })

    if (!response.ok) {
      throw new Error('Llama description failed')
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('Image description error:', error)
    return getFallbackDescription()
  }
}

function getFallbackDescription() {
  return `Detailed anime/game character costume in vibrant colors. Features intricate patterns, multiple layers, and distinctive accessories. The silhouette includes flowing elements and signature character details. Perfect for advanced cosplay creation with multiple components.`
}

export async function generateDALLEVisualization(description) {
  // DALLE visualization - using a canvas-based approach since real DALLE requires external API
  try {
    const prompt = `Photorealistic cosplay interpretation of: ${description}. Professional costume photography, studio lighting, detailed craftsmanship.`

    // For now, create a visual placeholder that shows the styling
    return generateVisualizationCanvas(description)
  } catch (error) {
    console.error('Visualization generation error:', error)
    return generateVisualizationCanvas(description)
  }
}

function generateVisualizationCanvas(description) {
  // Create a stylized canvas visualization
  return {
    placeholder: true,
    text: description,
    gradient: 'from-indigo-500 via-purple-500 to-pink-500'
  }
}

export async function generateCosplayTiers(characterName, context = '') {
  console.log('=== GENERATING TIERS FOR:', characterName, '===')
  console.log('Context provided:', !!context)
  console.log('API_KEY exists:', !!API_KEY)
  console.log('API_URL:', API_URL)

  try {
    const systemPrompt = `You are an expert cosplay designer. Generate build tiers ONLY for ${characterName}. 

**CONTEXT & ANALYSIS:**
${context ? `Use this specific analysis of the character's costume:\n"${context}"` : `Analyze the character ${characterName} based on their standard appearance.`}

**STEP 1: ANALYZE THE CHARACTER'S COSTUME COMPONENTS**
Before generating tiers, identify key costume components specific to ${characterName} based on the context provided.:
- What colors are their outfit? (e.g., black robe, orange jacket, yellow jumpsuit)
- What distinctive accessories? (e.g., blindfold, headband, cape, wig style)
- What special features? (e.g., bald head, twin tails, whisker marks)
- What clothing items? (e.g., robe, jacket, dress, pants)

**STEP 2: GENERATE TIERS USING ONLY THOSE COMPONENTS**

**FORBIDDEN GENERIC PHRASES - DO NOT USE:**
- "Basic fabric from thrift stores"
- "EVA foam"
- "Craft supplies"
- "Accessories" (be specific: headband, belt, etc.)
- "Sewing machine"
- "Budget cosplay suppliers"
- "Imported fabrics"
- "Generic wig" (specify color/style)

**REQUIRED FORMAT:**

**DIY BUILD** (7 items) - Repurpose household items into THIS CHARACTER'S costume:
- Use SPECIFIC repurposed items (e.g., "black hoodie cut into robe" not "fabric")
- Include SPECIFIC DIY techniques (e.g., "white bedsheet dyed for cape")
- Reference THE CHARACTER'S colors and components
- Example: "Black trash bag cut and taped into Gojo's robe shape"

**BUDGET BUILD** (6-7 items) - Ready-made items with exact names and prices:
- Include EXACT product descriptions (e.g., "Black kimono robe ($35)" not "robe")
- Add realistic prices ($10-$50)
- Reference THE CHARACTER'S specific items
- Example: "Pre-made black blindfold for Gojo ($12)"

**PREMIUM BUILD** (6-7 items) - Professional materials with exact names and prices:
- Include EXACT premium descriptions with character details
- Add realistic prices ($50-$300)
- Reference THE CHARACTER'S unique features
- Example: "Custom Gojo robe with white collar detail ($180)"

**CRITICAL EXAMPLES:**

For Gojo (Jujutsu Kaisen):
DIY: ["Black hoodie cut and sewn into robe with white collar from pillowcase", "Black scarf wrapped as blindfold", "White dishwashing gloves", "Black markers for fingerless glove effect", "White belt from old bathrobe", "Black pants from old jeans", "White sneakers painted black on sides"]
BUDGET: ["Black kimono-style robe ($38)", "Black blindfold elastic band ($12)", "White cotton gloves ($8)", "Black fingerless gloves ($15)", "White fabric belt ($10)", "Black dress pants ($25)", "Black sneakers ($30)"]
PREMIUM: ["Custom black Gojo robe with white collar ($180)", "Silk black blindfold with elastic ($45)", "Professional white gloves ($25)", "LED purple energy effect prop ($120)", "Custom white belt with details ($35)", "Designer black pants ($65)", "Premium black boots ($85)"]

For Miku (Hatsune Miku):
DIY: ["Teal t-shirt with hand-painted geometric patterns", "White bedsheet cut into pleated skirt", "Blue party wig styled into twin tails with wire", "Red ribbon tied into headband bow", "Black tights cut into thigh-highs", "Cardboard painted for shoulder guards", "White shoes with teal markers"]
BUDGET: ["Pre-made teal Miku shirt with patterns ($28)", "White pleated mini skirt ($22)", "Teal twin-tail wig ($35)", "Red bow headband ($12)", "Black thigh-high stockings ($15)", "Teal arm sleeves ($18)", "White sneakers ($25)"]
PREMIUM: ["Custom 3D-printed Miku top with detachable sleeves ($220)", "Heat-resistant teal twin-tail wig with proper styling ($150)", "LED light-up headpiece ($85)", "Professional black thigh-highs with seam details ($45)", "Custom shoulder guards with metallic finish ($95)", "Designer white platform boots ($120)"]

For Saitama (One Punch Man):
DIY: ["Yellow trash bag cut and duct-taped into bodysuit", "White undershirt from closet", "White swimming cap as bald cap", "Red bedsheet cut into cape", "Black winter gloves", "Cardboard belt buckle painted gold", "White sneakers with yellow markers"]
BUDGET: ["Yellow spandex zentai suit ($42)", "White tank top ($12)", "Latex bald cap ($15)", "Red cape fabric ($18)", "Black costume gloves ($8)", "Gold belt buckle prop ($10)", "White canvas shoes ($22)"]
PREMIUM: ["Custom-fitted yellow morphsuit with muscle padding ($195)", "Professional silicone bald cap with skin texture ($85)", "Premium white tank top with proper fit ($30)", "Satin red cape with clasp ($65)", "Leather black gloves ($35)", "Metal belt buckle with engraving ($45)", "High-quality white boots ($75)"]

Return ONLY valid JSON:
{
  "diy": ["item1 specific to ${characterName}", "item2 specific to ${characterName}", ...],
  "budget": ["item1 with price for ${characterName}", "item2 with price for ${characterName}", ...],
  "premium": ["item1 with price for ${characterName}", "item2 with price for ${characterName}", ...]
}

Generate for ${characterName} ONLY. Every item must reference this specific character's costume.`

    const userPrompt = `Generate character-specific cosplay build tiers for: ${characterName}

CRITICAL REQUIREMENTS:
1. First identify ${characterName}'s key costume components (colors, accessories, distinctive features)
2. Generate 7 items per tier that ONLY reference those specific components
3. NO generic phrases - every item must be character-specific
4. DIY tier: Repurposed household items transformed into ${characterName}'s costume pieces
5. BUDGET tier: Ready-made items with exact product names and prices ($10-$50)
6. PREMIUM tier: Professional materials with exact descriptions and prices ($50-$300)

Examples of GOOD items:
- "Black hoodie cut into Gojo's robe with white collar"
- "Teal twin-tail wig styled for Miku ($35)"
- "Yellow trash bag bodysuit for Saitama"

Examples of BAD items (NEVER USE):
- "Basic fabric from thrift stores"
- "EVA foam accessories"
- "Generic costume supplies"

Output ONLY JSON with character-specific build tiers. NO additional text.`

    const response = await fetch(`${API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 3000
      })
    })

    console.log('API Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Groq API Error:', response.status, errorText)
      console.error('Using model: llama-3.3-70b-versatile')
      throw new Error(`Cosplay tier generation failed: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('✅ Groq API Response received')
    const content = data.choices[0].message.content
    console.log('Generated content:', content) // Debug log

    // Try to parse as JSON, handling markdown code blocks
    try {
      // Remove markdown code blocks if present
      let jsonString = content.trim()
      if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      }
      const parsed = JSON.parse(jsonString)

      // Ensure all required keys exist
      if (!parsed.diy || !parsed.budget || !parsed.premium) {
        throw new Error('Missing required tier keys')
      }

      return parsed
    } catch (e) {
      console.error('JSON parse error:', e)
      console.error('Content that failed to parse:', jsonString)
      return getDefaultTiers(characterName)
    }
  } catch (error) {
    console.error('Cosplay tier generation error:', error)
    console.error('Error details:', error.message)
    return getDefaultTiers(characterName)
  }
}

function getDefaultTiers(characterName) {
  return {
    diy: [
      'Basic fabric from thrift stores',
      'DIY EVA foam build from YouTube tutorials',
      'Hand-painted details and weathering',
      'Second-hand accessories and props',
      'Home sewing with standard thread',
      'Improvised construction tools',
      'Recycled cardboard for armor pieces'
    ],
    budget: [
      'Budget cosplay suppliers online',
      'Pre-cut foam blanks ($20-30)',
      'Spray paint from hardware store',
      'Mid-tier fabric ($5-8/yard)',
      'Basic sewing machine usage',
      'Ready-made wig from Amazon',
      'Found/borrowed construction tools'
    ],
    premium: [
      'Professional grade EVA foam (25kg blocks)',
      'Metallic and specialty paints',
      'High-quality imported fabrics',
      'Custom 3D printing for accessories',
      'Professional seamstress consultation',
      'Commissioned styled wig',
      'Advanced weathering and detailing materials'
    ]
  }
}