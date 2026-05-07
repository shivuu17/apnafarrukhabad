// Lazy-read Cloudinary configuration at call time to avoid import-time failures
function readEnv() {
  const cloudName = String(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '').trim()
  const uploadPreset = String(import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '').trim()
  const uploadFolder = String(import.meta.env.VITE_CLOUDINARY_UPLOAD_FOLDER || 'apnafarrukhabad/news').trim()
  const apiKey = String(import.meta.env.VITE_CLOUDINARY_API_KEY || '').trim()
  return { cloudName, uploadPreset, uploadFolder, apiKey }
}

function assertCloudinaryConfig({ cloudName, uploadPreset } = {}) {
  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your environment.')
  }
}

export function getCloudinaryConfig() {
  const { cloudName, uploadPreset, uploadFolder, apiKey } = readEnv()
  return {
    cloudName,
    uploadPreset,
    folder: uploadFolder,
    apiKey: apiKey || undefined,
  }
}

export async function uploadImage(file, { folder, signal } = {}) {
  const { cloudName, uploadPreset, uploadFolder, apiKey } = readEnv()
  assertCloudinaryConfig({ cloudName, uploadPreset })

  const targetFolder = folder || uploadFolder

  if (!file || typeof file !== 'object' || !file.type) {
    throw new Error('Please choose a valid image file')
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('Cloudinary image uploads only accept image files')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  formData.append('folder', targetFolder)
  formData.append('resource_type', 'image')
  // If an API key is provided (public key only), include it. Signed uploads still require server-side signing.
  if (apiKey) {
    formData.append('api_key', apiKey)
  }

  let response
  try {
    response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
      signal,
    })
  } catch (err) {
    // network-level failures (CORS, blocked by client extensions, offline)
    throw new Error(err.message || 'Network error during image upload')
  }

  let payload
  try {
    payload = await response.json()
  } catch (err) {
    throw new Error('Invalid response from Cloudinary')
  }

  if (!response.ok) {
    // Log payload for easier debugging in dev console
    // eslint-disable-next-line no-console
    console.error('Cloudinary upload error response:', payload)

    const rawMessage = payload?.error?.message || `Cloudinary upload failed with status ${response.status}`
    const normalized = String(rawMessage).toLowerCase()

    if (normalized.includes('whitelisted for unsigned uploads')) {
      throw new Error(
        `Cloudinary preset '${uploadPreset}' is not unsigned. In Cloudinary: Settings > Upload > Upload presets > ${uploadPreset} > set Signing Mode to Unsigned.`
      )
    }

    if (normalized.includes('invalid upload preset')) {
      throw new Error(
        `Cloudinary upload preset '${uploadPreset}' is invalid or missing. Create/select a valid unsigned preset and set VITE_CLOUDINARY_UPLOAD_PRESET.`
      )
    }

    throw new Error(rawMessage)
  }

  return {
    secureUrl: payload.secure_url,
    publicId: payload.public_id,
    resourceType: payload.resource_type,
    width: payload.width,
    height: payload.height,
    format: payload.format,
    bytes: payload.bytes,
    originalFilename: payload.original_filename,
  }
}

export default { uploadImage, getCloudinaryConfig }