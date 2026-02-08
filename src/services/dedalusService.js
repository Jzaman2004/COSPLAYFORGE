/**
 * Dedalus Labs API Service
 * Handles LLM calls for character analysis and generation
 */

const API_KEY = import.meta.env.VITE_DEDALUS_API_KEY
const API_URL = import.meta.env.VITE_DEDALUS_API_URL

if (!API_KEY) {
  console.warn('⚠️ VITE_DEDALUS_API_KEY not set in .env.local')
}

/**
 * Call Dedalus Labs chat completion API
 * @param {string} userMessage - User message to send
 * @param {string} systemPrompt - Optional system prompt
 * @returns {Promise<string>} - LLM response
 */
export async function callDedalusLLM(userMessage, systemPrompt = null) {
  try {
    const messages = []
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt })
    }
    
    messages.push({ role: 'user', content: userMessage })

    const response = await fetch(`${API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'openai/gpt-5',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Dedalus API error: ${error.message || response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('Dedalus LLM error:', error)
    throw error
  }
}

/**
 * Analyze character from image description
 * @param {string} imageDescription - Description of the uploaded image
 * @returns {Promise<Object>} - Character analysis with name, costume, difficulty, parts
 */
export async function analyzeCharacterImage(imageDescription) {
  const systemPrompt = `You are an expert cosplay analyst. Analyze image descriptions and provide JSON:
{
  "characterName": "Character name or descriptive title",
  "source": "anime/game/movie/or reference type",
  "costumeDescription": "Detailed costume breakdown",
  "estimatedDifficulty": "Beginner/Intermediate/Expert",
  "estimatedDays": 5,
  "estimatedCost": "$80-150",
  "topMaterials": ["fabric type", "thread", "accessories"],
  "topComponents": [{"name": "Main Outfit", "difficulty": "Medium", "estimatedCost": "$70-100"}],
  "relatedCharacters": []
}
Return ONLY valid JSON no markdown.`

  const userPrompt = `Analyze this character: ${imageDescription}`

  try {
    const response = await callDedalusLLM(userPrompt, systemPrompt)
    
    // Clean response
    let cleaned = response.trim()
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/```json\n?/, '').replace(/```\n?$/, '')
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/```\n?/, '').replace(/```\n?$/, '')
    }
    
    const parsed = JSON.parse(cleaned)
    // Ensure all required fields
    return {
      characterName: parsed.characterName || 'Cosplay Outfit',
      source: parsed.source || 'Reference Image',
      costumeDescription: parsed.costumeDescription || imageDescription,
      estimatedDifficulty: parsed.estimatedDifficulty || 'Intermediate',
      estimatedDays: parsed.estimatedDays || 5,
      estimatedCost: parsed.estimatedCost || '$80-150',
      topMaterials: parsed.topMaterials || ['spandex', 'fleece', 'wire'],
      topComponents: parsed.topComponents || [{name: 'Main Outfit', difficulty: 'Medium', estimatedCost: '$70-100'}],
      relatedCharacters: parsed.relatedCharacters || []
    }
  } catch (error) {
    console.error('Character analysis error:', error)
    // Smart fallback - generate from description
    return {
      characterName: 'Anime Character',
      source: 'Reference Image',
      costumeDescription: imageDescription || 'Character costume',
      estimatedDifficulty: 'Intermediate',
      estimatedDays: 5,
      estimatedCost: '$80-150',
      topMaterials: ['spandex', 'fleece', 'wire', 'foam'],
      topComponents: [
        { name: 'Main Outfit', difficulty: 'Medium', estimatedCost: '$70-100' },
        { name: 'Accessories', difficulty: 'Low', estimatedCost: '$20-40' }
      ],
      relatedCharacters: []
    }
  }
}

/**
 * Generate costume blueprint from character
 * @param {string} characterName - Character name
 * @param {string} costumePart - Specific costume part to detail
 * @returns {Promise<string>} - Detailed blueprint
 */
export async function generateBlueprintDetails(characterName, costumePart) {
  const prompt = `Generate a detailed cosplay blueprint for the ${costumePart} part of ${characterName}'s costume. Include:
1. Materials needed
2. Dimensions/measurements
3. Construction steps
4. Tools required
5. Estimated time
Keep it concise and practical.`

  try {
    return await callDedalusLLM(prompt)
  } catch (error) {
    console.error('Blueprint generation error:', error)
    return 'Blueprint generation failed. Please try again.'
  }
}

/**
 * Generate outfit recommendations
 * @param {string} characterName - Base character
 * @returns {Promise<Array>} - Array of outfit ideas
 */
export async function generateOutfitIdeas(characterName) {
  const prompt = `Generate 3 creative outfit variation ideas for ${characterName} as a JSON array:
[
  {
    "name": "outfit name",
    "description": "brief description",
    "vibe": "style vibe"
  }
]
Return ONLY valid JSON.`

  try {
    const response = await callDedalusLLM(prompt)
    let cleaned = response.trim()
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/```json\n?/, '').replace(/```\n?$/, '')
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/```\n?/, '').replace(/```\n?$/, '')
    }
    return JSON.parse(cleaned)
  } catch (error) {
    console.error('Outfit ideas error:', error)
    return [
      { name: 'Classic', description: 'Original costume', vibe: 'Faithful' },
      { name: 'Casual', description: 'Everyday version', vibe: 'Relaxed' },
      { name: 'Modern', description: 'Contemporary remix', vibe: 'Trendy' }
    ]
  }
}
