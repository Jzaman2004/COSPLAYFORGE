/**
 * Dedalus Image Service - Generate cosplay preview images
 */

const DEDALUS_API_KEY = import.meta.env.VITE_DEDALUS_TEST_KEY
const DEDALUS_API_URL = 'https://api.dedaluslabs.ai'

/**
 * Generate a cosplay preview image using Dedalus API
 * @param {string} prompt - Detailed image generation prompt
 * @returns {Promise<string>} - Base64 image data or URL
 */
export async function generateCosplayImage(prompt) {
  console.log('=== DEDALUS IMAGE GENERATION ===')
  console.log('Prompt length:', prompt.length, 'chars')
  console.log('Prompt preview:', prompt.substring(0, 200) + '...')
  console.log('API Key exists:', !!DEDALUS_API_KEY)
  console.log('API Key preview:', DEDALUS_API_KEY ? `${DEDALUS_API_KEY.substring(0, 20)}...` : 'MISSING')

  if (!DEDALUS_API_KEY) {
    console.error('❌ Missing Dedalus API key')
    throw new Error('Dedalus API key not configured')
  }

  try {
    const requestBody = {
      prompt: prompt,
      model: 'openai/dall-e-3', // Best quality per docs
      size: '1024x1024',
      quality: 'hd', // 'hd' or 'standard' for dall-e-3
      response_format: 'b64_json', // Get base64 for local saving
      n: 1 // dall-e-3 only supports n=1
    }

    console.log('Request body:', JSON.stringify(requestBody, null, 2))

    const response = await fetch(`${DEDALUS_API_URL}/v1/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEDALUS_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    })

    console.log('API Response status:', response.status)
    console.log('API Response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Dedalus API Error:', response.status)
      console.error('Error response:', errorText)
      throw new Error(`Image generation failed: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('✅ Image generated successfully')
    console.log('Response data keys:', Object.keys(data))
    console.log('Response data:', JSON.stringify(data, null, 2).substring(0, 500))
    
    // Return the base64 image data
    if (data.data && data.data[0]) {
      if (data.data[0].b64_json) {
        console.log('✅ Got b64_json, length:', data.data[0].b64_json.length)
        return data.data[0].b64_json
      } else if (data.data[0].url) {
        console.log('⚠️ Got URL instead of base64, fetching image...')
        // If we get a URL instead, fetch it and convert to base64
        const imageResponse = await fetch(data.data[0].url)
        const blob = await imageResponse.blob()
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            const base64 = reader.result.split(',')[1]
            console.log('✅ Converted URL to base64, length:', base64.length)
            resolve(base64)
          }
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
      }
    }
    
    throw new Error('No image data in response')
  } catch (error) {
    console.error('❌ Image generation error:', error)
    console.error('Error stack:', error.stack)
    throw error
  }
}

/**
 * Save base64 image data to local file
 * @param {string} base64Data - Base64 encoded image
 * @param {string} filename - Filename to save as (default: nfccosplay.png)
 */
export function saveImageLocally(base64Data, filename = 'nfccosplay.png') {
  try {
    // Create a link element
    const link = document.createElement('a')
    link.href = `data:image/png;base64,${base64Data}`
    link.download = filename
    
    // Trigger download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    console.log('✅ Image saved locally as:', filename)
  } catch (error) {
    console.error('❌ Error saving image:', error)
  }
}

/**
 * Convert base64 to data URL for display
 * @param {string} base64Data - Base64 encoded image
 * @returns {string} - Data URL
 */
export function base64ToDataUrl(base64Data) {
  return `data:image/png;base64,${base64Data}`
}

/**
 * Test function to verify Dedalus API is working
 * Call this from browser console: window.testDedalusImage()
 */
export async function testDedalusImageGeneration() {
  console.log('🧪 Testing Dedalus Image Generation API...')
  
  try {
    const testPrompt = "A simple red apple on a white background, professional photo"
    console.log('Test prompt:', testPrompt)
    
    const base64Image = await generateCosplayImage(testPrompt)
    console.log('✅ Test successful! Base64 length:', base64Image.length)
    
    // Display the image in a new window
    const imageUrl = base64ToDataUrl(base64Image)
    const win = window.open('', '_blank')
    win.document.write(`<img src="${imageUrl}" alt="Test Image" />`)
    
    return { success: true, base64Length: base64Image.length }
  } catch (error) {
    console.error('❌ Test failed:', error)
    return { success: false, error: error.message }
  }
}

// Expose test function to window for easy testing
if (typeof window !== 'undefined') {
  window.testDedalusImage = testDedalusImageGeneration
}
