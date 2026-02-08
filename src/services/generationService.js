/**
 * Image Generation Service
 * Generates realistic cosplay try-on previews using AI image models
 */

const HF_API_KEY = import.meta.env.VITE_HF_API_KEY
const HF_API_URL = 'https://api-inference.huggingface.co/models'

/**
 * Generate try-on image using text-to-image
 * @param {string} characterName - Name of the character
 * @param {string} description - Detailed costume description
 * @param {string} style - Style modifier (e.g., "realistic", "anime", "digital art")
 * @returns {Promise<Blob>} - Generated image blob
 */
export async function generateTryOnImage(characterName, description, style = 'realistic photorealistic') {
  try {
    if (!HF_API_KEY) {
      console.warn('⚠️ Using mock image generation. Set VITE_HF_API_KEY for real images.')
      return getMockImageBlob()
    }

    const prompt = `${characterName} wearing ${description}. ${style} cosplay, high quality, detailed, cinematic lighting, professional photography, full body shot, standing pose, vibrant colors, intricate details, 8k quality`

    // Use Stable Diffusion v2.1
    const response = await fetch(
      `${HF_API_URL}/stabilityai/stable-diffusion-2-1`,
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`
        },
        method: 'POST',
        body: JSON.stringify({ inputs: prompt })
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.warn(`Image generation error: ${response.status}. Using mock.`)
      return getMockImageBlob()
    }

    return await response.blob()
  } catch (error) {
    console.error('Image generation error:', error)
    return getMockImageBlob()
  }
}

/**
 * Generate multiple outfit variations
 * @param {string} characterName - Character name
 * @param {Array<string>} outfitDescriptions - Array of outfit descriptions
 * @returns {Promise<Array>} - Array of generated image URLs/blobs
 */
export async function generateOutfitVariations(characterName, outfitDescriptions) {
  try {
    const images = await Promise.all(
      outfitDescriptions.map(desc => 
        generateTryOnImage(characterName, desc, 'cinematic 3d render')
      )
    )

    return images.map((blob, idx) => ({
      id: idx,
      blob: blob,
      url: URL.createObjectURL(blob),
      description: outfitDescriptions[idx],
      generated: new Date().toISOString()
    }))
  } catch (error) {
    console.error('Outfit variation generation error:', error)
    return []
  }
}

/**
 * Apply style transfer to existing image
 * Transforms cosplay photo with different artistic style
 * @param {Blob} imageBlob - Original image
 * @param {string} style - Target style (e.g., "oil painting", "anime", "cyberpunk")
 * @returns {Promise<Blob>} - Stylized image
 */
export async function applySyleTransfer(imageBlob, style = 'anime') {
  try {
    if (!HF_API_KEY) {
      return getMockImageBlob()
    }

    const reader = new FileReader()
    return new Promise((resolve) => {
      reader.onload = async () => {
        try {
          const response = await fetch(
            `${HF_API_URL}/google/universal-sentence-encoder`,
            {
              headers: {
                Authorization: `Bearer ${HF_API_KEY}`,
                'Content-Type': 'application/octet-stream'
              },
              method: 'POST',
              body: imageBlob
            }
          )

          if (!response.ok) {
            resolve(getMockImageBlob())
            return
          }

          const blob = await response.blob()
          resolve(blob)
        } catch (error) {
          console.error('Style transfer error:', error)
          resolve(getMockImageBlob())
        }
      }
      reader.readAsArrayBuffer(imageBlob)
    })
  } catch (error) {
    console.error('Style transfer error:', error)
    return getMockImageBlob()
  }
}

/**
 * Enhance image quality
 * @param {Blob} imageBlob - Image to enhance
 * @param {string} enhancement - Type: "upscale", "denoise", "colorize"
 * @returns {Promise<Blob>} - Enhanced image
 */
export async function enhanceImage(imageBlob, enhancement = 'upscale') {
  try {
    if (!HF_API_KEY) {
      return getMockImageBlob()
    }

    // Use real-ESRGAN for upscaling
    const response = await fetch(
      `${HF_API_URL}/philz1337/upscayl-maximum`,
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/octet-stream'
        },
        method: 'POST',
        body: imageBlob
      }
    )

    if (!response.ok) {
      return getMockImageBlob()
    }

    return await response.blob()
  } catch (error) {
    console.error('Image enhancement error:', error)
    return getMockImageBlob()
  }
}

/**
 * Generate comparison/before-after image
 * @param {Blob} originalBlob - Original photo
 * @param {Blob} generatedBlob - Generated try-on
 * @returns {Promise<Blob>} - Side-by-side comparison
 */
export async function generateComparison(originalBlob, generatedBlob) {
  try {
    // Create canvas for side-by-side comparison
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    const originalImg = await blobToImage(originalBlob)
    const generatedImg = await blobToImage(generatedBlob)

    // Set canvas dimensions
    canvas.width = originalImg.width + generatedImg.width + 20
    canvas.height = Math.max(originalImg.height, generatedImg.height)

    // Draw original
    ctx.drawImage(originalImg, 0, 0)
    
    // Add label
    ctx.fillStyle = 'white'
    ctx.font = 'bold 16px Arial'
    ctx.fillText('Original', 10, 25)

    // Draw generated
    ctx.drawImage(generatedImg, originalImg.width + 20, 0)
    
    // Add label
    ctx.fillStyle = 'white'
    ctx.fillText('Try-On', originalImg.width + 30, 25)

    return new Promise(resolve => {
      canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.95)
    })
  } catch (error) {
    console.error('Comparison generation error:', error)
    return getMockImageBlob()
  }
}

/**
 * Helper: Convert blob to image element
 */
function blobToImage(blob) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.src = url
  })
}

/**
 * Mock image blob for testing (1x1 pixel placeholder)
 */
function getMockImageBlob() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 768
  
  const ctx = canvas.getContext('2d')
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, 512, 768)
  gradient.addColorStop(0, '#667eea')
  gradient.addColorStop(1, '#764ba2')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 512, 768)

  // Add text
  ctx.fillStyle = 'white'
  ctx.font = 'bold 24px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('Generated Cosplay Try-On', 256, 300)
  ctx.font = '16px Arial'
  ctx.fillText('Set VITE_HF_API_KEY for real generation', 256, 350)

  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.95)
  })
}

/**
 * Generate grid of multiple try-on options
 * @param {string} characterName - Character name
 * @param {Array<Object>} outfits - Array of {name, description} objects
 * @returns {Promise<Blob>} - Grid image with all variations
 */
export async function generateOutfitGrid(characterName, outfits) {
  try {
    const images = await Promise.all(
      outfits.map(outfit => 
        generateTryOnImage(characterName, outfit.description)
      )
    )

    // Create grid canvas
    const cols = Math.ceil(Math.sqrt(images.length))
    const rows = Math.ceil(images.length / cols)
    const imgWidth = 256
    const imgHeight = 384

    const canvas = document.createElement('canvas')
    canvas.width = cols * imgWidth
    canvas.height = rows * imgHeight

    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw each image
    for (let i = 0; i < images.length; i++) {
      const row = Math.floor(i / cols)
      const col = i % cols
      const x = col * imgWidth
      const y = row * imgHeight

      const img = await blobToImage(images[i])
      ctx.drawImage(img, x, y, imgWidth, imgHeight)

      // Add outfit name
      ctx.fillStyle = 'white'
      ctx.font = 'bold 12px Arial'
      ctx.fillText(outfits[i].name, x + 10, y + 25)
    }

    return new Promise(resolve => {
      canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.9)
    })
  } catch (error) {
    console.error('Outfit grid generation error:', error)
    return getMockImageBlob()
  }
}
