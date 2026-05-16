// Client-side image compressor: resizes and iteratively reduces quality
export async function compressImage(file, { maxSize = 300 * 1024, maxWidth = 1600, maxHeight = 1600, mimeType = 'image/jpeg', qualityStep = 0.05, minQuality = 0.5 } = {}) {
  if (!file || typeof file.size !== 'number') throw new Error('Invalid file')
  if (file.size <= maxSize) return file

  const toBlob = (canvas, type, quality) => new Promise((resolve) => canvas.toBlob(resolve, type, quality))

  const createImage = () => new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => { URL.revokeObjectURL(url); resolve(img) }
    img.onerror = (e) => { URL.revokeObjectURL(url); reject(e) }
    img.src = url
  })

  let img
  try {
    img = await createImage()
  } catch (err) {
    throw new Error('Failed to read image for compression')
  }

  let { width, height } = img
  // scale down to max dimensions maintaining aspect
  const scaleToFit = Math.min(1, maxWidth / width, maxHeight / height)
  width = Math.round(width * scaleToFit)
  height = Math.round(height * scaleToFit)

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  // iterative downscale + quality reduction
  let currentWidth = width
  let currentHeight = height
  let attempt = 0
  while (true) {
    canvas.width = currentWidth
    canvas.height = currentHeight
    ctx.clearRect(0, 0, currentWidth, currentHeight)
    ctx.drawImage(img, 0, 0, currentWidth, currentHeight)

    // try quality ladder
    for (let q = 0.92; q >= minQuality; q -= qualityStep) {
      // prefer jpeg output for broadly compatible compression
      // keep original mime if it's already webp to try webp first
      const outType = mimeType || 'image/jpeg'
      // eslint-disable-next-line no-await-in-loop
      const blob = await toBlob(canvas, outType, q)
      if (!blob) continue
      if (blob.size <= maxSize) {
        return new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: outType })
      }
    }

    // if still too big, downscale dimensions and retry
    attempt += 1
    if (currentWidth <= 400 || currentHeight <= 400 || attempt > 6) break
    currentWidth = Math.max(400, Math.round(currentWidth * 0.85))
    currentHeight = Math.max(400, Math.round(currentHeight * 0.85))
  }

  // final fallback: return last generated blob with lowest quality
  const finalBlob = await toBlob(canvas, mimeType, minQuality)
  if (finalBlob) return new File([finalBlob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: mimeType })
  // if all fails, return original
  return file
}

export default { compressImage }
