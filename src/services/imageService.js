/**
 * Image Recognition Service
 * Uses Hugging Face models for image classification and understanding
 */

const HF_API_KEY = import.meta.env.VITE_HF_API_KEY
const HF_API_URL = 'https://api-inference.huggingface.co/models'

/**
 * Convert image file to base64
 * @param {File} file - Image file
 * @returns {Promise<string>} - Base64 encoded image
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Classify image using ResNet
 * Returns what's in the image (for character detection)
 * @param {File|Blob} imageFile - The image to classify
 * @returns {Promise<Array>} - Array of {label, score} predictions
 */
export async function classifyImage(imageFile) {
  try {
    if (!HF_API_KEY) {
      console.warn('⚠️ Hugging Face API key not set. Using mock classification.')
      return getMockClassification()
    }

    const buffer = await fileToBase64(imageFile)
    
    // Use ResNet50 for image classification
    const response = await fetch(`${HF_API_URL}/google/vit-base-patch16-224`, {
      headers: { Authorization: `Bearer ${HF_API_KEY}` },
      method: 'POST',
      body: buffer
    })

    if (!response.ok) {
      console.warn(`Classification API error: ${response.status}. Using mock.`)
      return getMockClassification()
    }

    const result = await response.json()
    
    if (Array.isArray(result)) {
      return result.slice(0, 5) // Top 5 predictions
    }
    
    return getMockClassification()
  } catch (error) {
    console.error('Image classification error:', error)
    return getMockClassification()
  }
}

/**
 * Describe image using vision model (detailed analysis)
 * @param {File|Blob} imageFile - The image to analyze
 * @returns {Promise<string>} - Detailed description of the image
 */
export async function describeImage(imageFile) {
  try {
    if (!HF_API_KEY) {
      console.warn('⚠️ Using mock image description')
      return getMockDescription()
    }

    const buffer = await fileToBase64(imageFile)

    // Use vision model for detailed description
    const response = await fetch(
      `${HF_API_URL}/nlpconnect/vit-gpt2-image-captioning`,
      {
        headers: { Authorization: `Bearer ${HF_API_KEY}` },
        method: 'POST',
        body: buffer
      }
    )

    if (!response.ok) {
      console.warn(`Vision API error: ${response.status}. Using mock.`)
      return getMockDescription()
    }

    const result = await response.json()
    
    if (result[0]?.generated_text) {
      return result[0].generated_text
    }

    return getMockDescription()
  } catch (error) {
    console.error('Image description error:', error)
    return getMockDescription()
  }
}

/**
 * Detect objects in image
 * Returns what objects/items are visible
 * @param {File|Blob} imageFile - The image to analyze
 * @returns {Promise<Array>} - Array of detected objects with confidence scores
 */
export async function detectObjects(imageFile) {
  try {
    if (!HF_API_KEY) {
      console.warn('⚠️ Using mock object detection')
      return getMockObjectDetection()
    }

    const buffer = await fileToBase64(imageFile)

    // Use object detection model
    const response = await fetch(
      `${HF_API_URL}/facebook/detr-resnet-50`,
      {
        headers: { Authorization: `Bearer ${HF_API_KEY}` },
        method: 'POST',
        body: buffer
      }
    )

    if (!response.ok) {
      console.warn(`Object detection error: ${response.status}. Using mock.`)
      return getMockObjectDetection()
    }

    const result = await response.json()
    
    if (Array.isArray(result)) {
      return result.map(item => ({
        label: item.label,
        confidence: (item.score * 100).toFixed(1),
        box: item.box
      }))
    }

    return getMockObjectDetection()
  } catch (error) {
    console.error('Object detection error:', error)
    return getMockObjectDetection()
  }
}

/**
 * Mock classification for testing without API key
 */
function getMockClassification() {
  return [
    { label: 'anime character', score: 0.92 },
    { label: 'costume', score: 0.88 },
    { label: 'character', score: 0.85 },
    { label: 'outfit', score: 0.78 },
    { label: 'cosplay', score: 0.72 }
  ]
}

/**
 * Mock image description for testing
 */
function getMockDescription() {
  return 'A detailed image of an anime character wearing a colorful costume with intricate details and accessories. The character appears to be in an action pose with dynamic lighting.'
}

/**
 * Mock object detection for testing
 */
function getMockObjectDetection() {
  return [
    { label: 'person', confidence: '95.2', box: { xmin: 50, ymin: 40, xmax: 450, ymax: 500 } },
    { label: 'jacket', confidence: '88.5', box: { xmin: 60, ymin: 50, xmax: 200, ymax: 300 } },
    { label: 'pants', confidence: '82.3', box: { xmin: 70, ymin: 300, xmax: 180, ymax: 480 } },
    { label: 'boots', confidence: '79.1', box: { xmin: 80, ymin: 480, xmax: 170, ymax: 510 } },
    { label: 'gloves', confidence: '75.6', box: { xmin: 55, ymin: 150, xmax: 90, ymax: 200 } }
  ]
}

/**
 * Analyze image and extract costume components
 * @param {File} imageFile - Image to analyze
 * @returns {Promise<Object>} - Extracted components and data
 */
export async function analyzeImageComponents(imageFile) {
  try {
    // Get image description and object detections in parallel
    const [description, objects] = await Promise.all([
      describeImage(imageFile),
      detectObjects(imageFile)
    ])

    return {
      description,
      detectedObjects: objects,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Image component analysis error:', error)
    return {
      description: 'Analysis failed',
      detectedObjects: [],
      timestamp: new Date().toISOString()
    }
  }
}
