
export function getImageUrl(imagePath) {
  if (!imagePath) {
    return 'https://via.placeholder.com/400x300?text=No+Image';
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
  
  if (STORAGE_URL) {
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${STORAGE_URL}/${cleanPath}`;
  }
  
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${API_BASE_URL}${cleanPath}`;
}
