/**
 * Llama Service - Generate detailed image descriptions
 */

const API_KEY = import.meta.env.VITE_DEDALUS_API_KEY
const API_URL = import.meta.env.VITE_DEDALUS_API_URL
const TEXT_MODEL = 'llama-3.3-70b-versatile' // Groq's fastest model

export async function generateCharacterProfile(characterName) {
  console.log('=== GENERATING CHARACTER PROFILE ===')
  console.log('Character Name:', characterName)
  console.log('API_URL:', API_URL)
  console.log('API_KEY exists:', !!API_KEY)
  
  if (!API_KEY || !API_URL) {
    console.error('❌ Missing API credentials')
    return `${characterName} - API credentials not configured. Please check your environment variables.`
  }

  try {
    const systemPrompt = `You are an expert anime, manga, video game, and pop culture character analyst specializing in costume design. 

When given a character name, use your knowledge base to provide a detailed costume description for cosplay purposes.

IMPORTANT: Research and describe ${characterName} based on their canonical appearance from their source material.`

    const userPrompt = `Describe ${characterName}'s costume and appearance in 3-4 detailed sentences for cosplay creation.

Include in your description:
1. What anime/game/series they are from
2. EXACT colors of their outfit (e.g., "midnight black", "bright orange", "emerald green")
3. SPECIFIC clothing items (e.g., "long-sleeved jacket", "pleated skirt", "combat boots")
4. KEY accessories (e.g., "metal headband", "fingerless gloves", "blindfold")
5. DISTINCTIVE features (e.g., "spiky blonde hair", "red cape", "twin tails")

Example format:
"[Character] from [Series] wears a [specific description]. The outfit consists of [exact colors and items]. Key accessories include [specific items], and [distinctive features]."

DO NOT use vague phrases like:
- "iconic design"
- "recognizable costume"
- "signature look"
- "distinctive style"

Instead, name the ACTUAL costume pieces, colors, and accessories.`

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
        temperature: 0.7,
        max_tokens: 350,
        top_p: 0.9
      })
    })

    console.log('API Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API Error:', response.status, errorText)
      throw new Error(`API returned ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log('✅ Profile generated successfully')
    const content = data.choices[0].message.content
    console.log('Generated profile:', content)
    
    return content
  } catch (error) {
    console.error('❌ Character profile generation error:', error)
    console.error('Error details:', error.message)
    
    // Return a more helpful error message
    return `${characterName} - Error generating description. This could be due to API issues. The character name was detected from your image filename. Please ensure your environment variables are configured correctly.`
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
    const systemPrompt = `You are an expert cosplay designer specializing in costume breakdown and material sourcing. Generate build tiers ONLY for ${characterName}.

**CONTEXT & ANALYSIS:**
${context ? `IMPORTANT - Use this detailed analysis of the character's costume:\n"${context}"\n\nExtract specific details: colors, materials, textures, accessories, and unique features from this description.` : `Research ${characterName}'s standard appearance from their source material (anime/game/series). Identify their iconic costume elements.`}

**STEP 1: ANALYZE ${characterName.toUpperCase()}'S COSTUME COMPONENTS**
Before generating tiers, identify 6-8 key costume components specific to ${characterName}:
- EXACT colors of outfit pieces (e.g., "midnight black robe", "bright orange jacket", "metallic gold armor")
- SPECIFIC accessories with details (e.g., "black blindfold over eyes", "orange headband with metal plate", "red cape with white star")
- DISTINCTIVE features (e.g., "spiky blonde hair", "mechanical arm", "twin tailed turquoise wig")
- KEY clothing items (e.g., "long black robe", "orange track jacket", "white pants", "combat boots")
- PROPS or WEAPONS (e.g., "wooden sword", "shield", "staff")
- UNIQUE characteristics (e.g., "cat ears", "wings", "tattoos")

**STEP 2: GENERATE REALISTIC, CHARACTER-SPECIFIC TIERS**

For EACH tier, create 7 items that directly correspond to ${characterName}'s costume components.

**STRICT RULES:**
1. Every item MUST mention ${characterName} OR specific costume details
2. Include EXACT colors from the character (e.g., "midnight black", "vibrant orange", "electric blue")
3. Be SPECIFIC about what part of the costume each item creates
4. NO GENERIC ITEMS without character context

**FORBIDDEN GENERIC PHRASES:**
- "Basic fabric" → Say "Black cotton fabric for [character]'s robe"
- "EVA foam" → Say "Foam sheets for [character]'s armor pieces" 
- "Craft supplies" → Say "Paint for [character]'s orange details"
- "Accessories" → Say exactly which: "headband", "belt", "necklace"
- "Sewing machine" → NEVER list tools, only costume pieces
- "Generic wig" → Say "[Color] wig in [character]'s [style]"

**REQUIRED FORMAT:**

**DIY BUILD** (7 items) - Household items transformed into ${characterName}'s costume:
- Each item = one costume component (shirt → robe, bedsheet → cape, etc.)
- DESCRIBE the transformation: "black hoodie cut and sewn into [character]'s robe"
- REFERENCE character details: "white pillowcase for [character]'s collar"
- Include character-specific colors and modifications
- Example: "Yellow trash bag cut into bodysuit shape with duct tape seams for Saitama's suit"
- NO tools or generic supplies - only transformed costume pieces

**BUDGET BUILD** (7 items) - Ready-made items with prices ($12-$50 each):
- Each item = specific costume piece you can buy
- FORMAT: "[Specific product description for character] ($XX)"
- Examples: "Black kimono-style robe for Gojo ($38)", "Orange ninja headband with metal plate for Naruto ($14)"
- Include ALL major costume components (clothing, wig, accessories, props)
- Prices realistic for online costume retailers
- NO generic items - every item tied to ${characterName}

**PREMIUM BUILD** (7 items) - Professional quality with prices ($60-$280 each):
- Each item = custom/high-end version of costume component  
- FORMAT: "[Detailed professional description for character] ($XXX)"
- Examples: "Custom-tailored black Gojo robe with white collar detail ($180)", "Professional silicone muscle suit for Saitama ($195)"
- Include material upgrades: "heat-resistant wig", "real leather", "3D printed"
- Higher accuracy and durability than budget
- NO generic items - every item references ${characterName}'s design

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

    const userPrompt = `Generate realistic, character-specific cosplay build tiers for: **${characterName}**

${context ? `\nUSE THIS CONTEXT: \"${context}\"\n` : ''}

**YOUR TASK:**
1. Identify ${characterName}'s 6-8 key costume components from the context (or your knowledge)
2. For EACH of the 3 tiers (DIY, BUDGET, PREMIUM), create 7 items
3. EVERY item must be a specific costume piece for ${characterName}
4. Include exact colors, styles, and details from ${characterName}'s design

**QUALITY CHECKS:**
✅ GOOD: "Black kimono-style robe with white collar for Gojo ($38)"
✅ GOOD: "Yellow trash bag cut into bodysuit with black marker details for Saitama"
✅ GOOD: "Teal twin-tail wig styled for Hatsune Miku ($35)"
❌ BAD: "Basic fabric from thrift stores" (too generic)
❌ BAD: "EVA foam" (doesn't mention character)
❌ BAD: "Sewing machine" (tool, not costume piece)

**FORMAT:**
Return ONLY valid JSON (no markdown, no explanations):
{
  "diy": ["item 1 for ${characterName}", "item 2 for ${characterName}", ... 7 items],
  "budget": ["item 1 for ${characterName} ($XX)", "item 2 for ${characterName} ($XX)", ... 7 items],
  "premium": ["item 1 for ${characterName} ($XXX)", "item 2 for ${characterName} ($XXX)", ... 7 items]
}`

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
        temperature: 0.8,
        max_tokens: 3500,
        top_p: 0.9
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
  console.warn(`Using fallback tiers for ${characterName} - API generation failed`)
  
  // Basic character-aware fallback
  return {
    diy: [
      `Thrift store clothing modified for ${characterName}'s base outfit`,
      `Cardboard and craft foam for ${characterName}'s props/accessories`,
      `Fabric paint for ${characterName}'s specific colors and patterns`,
      `Wig styled from budget store with styling products`,
      `Old belts and accessories repurposed for character details`,
      `Printed reference images for accuracy`,
      `Hot glue and basic sewing supplies for assembly`
    ],
    budget: [
      `${characterName} costume set from online retailers ($40-60)`,
      `Matching wig in character style ($25-35)`,
      `Character-specific accessories bundle ($15-25)`,
      `Fabric for custom modifications ($20-30)`,
      `Cosplay-grade makeup and face paint ($15-20)`,
      `Props from costume suppliers ($20-40)`,
      `Shoes/boots modified to match ($30-50)`
    ],
    premium: [
      `Custom-tailored ${characterName} costume with accurate fabrics ($180-250)`,
      `Professional heat-resistant wig styled by expert ($120-180)`,
      `Commissioned props with accurate details ($80-150)`,
      `Premium fabric upgrades and embellishments ($60-100)`,
      `Professional makeup and contact lenses ($50-80)`,
      `Custom accessories crafted by prop makers ($70-120)`,
      `Designer boots/shoes matching character ($90-140)`
    ]
  }
}

/**
 * Generate a detailed image prompt for cosplay visualization
 * @param {string} characterName - The character being cosplayed
 * @param {string} tier - The build tier (diy, budget, or premium)
 * @param {Array<string>} selectedItems - Array of selected cart items
 * @param {string} gender - Gender of the cosplayer (male or female)
 * @returns {Promise<string>} - Detailed image generation prompt
 */
export async function generateCosplayImagePrompt(characterName, tier, selectedItems, gender = 'male') {
  console.log('=== GENERATING COSPLAY IMAGE PROMPT ===')
  console.log('Character:', characterName)
  console.log('Tier:', tier)
  console.log('Gender:', gender)
  console.log('Selected items:', selectedItems.length)

  if (!API_KEY || !API_URL) {
    console.error('❌ Missing API credentials')
    throw new Error('API credentials not configured')
  }

  try {
    const systemPrompt = `You are an expert cosplay photographer and costume designer. Your task is to create detailed, professional image generation prompts for AI image generators (like DALL-E or Stable Diffusion).

CRITICAL RULES:
1. The cosplayer must be a REAL PERSON (not the fictional character)
2. They are WEARING a cosplay of the character
3. Describe a realistic person in costume, not the actual character
4. Focus on the costume details and how they look on a real person
5. Include photography terms for realism

Your prompts should create photorealistic images of cosplayers at conventions or photo shoots.`

    const itemsList = selectedItems.length > 0 ? selectedItems.join(', ') : 'various costume pieces'

    const userPrompt = `Create a detailed image generation prompt for a ${tier.toUpperCase()} tier cosplay of ${characterName}.

**Cosplayer Gender: ${gender.toUpperCase()}**

**Selected costume items:**
${itemsList}

**Requirements:**
1. Start with "Professional cosplay photography of a ${gender} cosplayer wearing..."
2. Describe what a REAL ${gender.toUpperCase()} COSPLAYER looks like wearing this ${characterName} costume
3. Mention the specific items from the list in the costume description
4. Include the ${tier} quality level (DIY = handmade/crafted, Budget = store-bought, Premium = professional/custom-made)
5. Add photography details: lighting, setting, camera angle
6. Describe realistic fabric textures, materials, and craftsmanship appropriate for a ${gender} cosplayer
7. Keep it under 400 words but highly detailed
8. DO NOT say "a person cosplaying as [character]" - instead describe the costume components on a real ${gender} person

**Example structure:**
"Professional cosplay photography of a ${gender} cosplayer wearing a [quality] handcrafted ${characterName} costume. The cosplayer wears [describe each costume piece from the list]. [Describe materials, colors, textures]. [Camera details: lighting, setting, angle]. High resolution, detailed cosplay craftsmanship, [photography style]."

Generate the image prompt now:`

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
        max_tokens: 500
      })
    })

    console.log('API Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Groq API Error:', response.status, errorText)
      throw new Error(`Prompt generation failed: ${response.status}`)
    }

    const data = await response.json()
    const prompt = data.choices[0].message.content.trim()
    
    console.log('✅ Image prompt generated successfully')
    console.log('Prompt preview:', prompt.substring(0, 150) + '...')
    
    return prompt
  } catch (error) {
    console.error('❌ Prompt generation error:', error)
    throw error
  }
}