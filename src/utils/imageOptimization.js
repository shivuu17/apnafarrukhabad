export function optimizeCloudinaryImageUrl(src, { width, height, crop = 'fill', quality = 'auto', format = 'auto' } = {}) {
  if (typeof src !== 'string' || !src.includes('res.cloudinary.com') || !src.includes('/upload/')) {
    return src
  }

  const transforms = [format ? `f_${format}` : null, quality ? `q_${quality}` : null, width ? `w_${Math.round(width)}` : null, height ? `h_${Math.round(height)}` : null, crop ? `c_${crop}` : null]
    .filter(Boolean)
    .join(',')

  return src.replace('/upload/', `/upload/${transforms}/`)
}