/**
 * Utility functions for image handling
 */

export type ImageOrientation = 'horizontal' | 'portrait' | 'square' | 'default';

/**
 * Determines the orientation of an image based on its dimensions
 * @param width - Image width
 * @param height - Image height
 * @returns Image orientation type
 */
export function getImageOrientation(width: number, height: number): ImageOrientation {
  if (!width || !height) return 'default';
  
  const aspectRatio = width / height;
  
  // Define thresholds for different orientations
  const horizontalThreshold = 1.3; // width > height * 1.3
  const portraitThreshold = 0.77;  // height > width * 1.3 (1/1.3 ≈ 0.77)
  
  if (aspectRatio > horizontalThreshold) {
    return 'horizontal';
  } else if (aspectRatio < portraitThreshold) {
    return 'portrait';
  } else {
    return 'square';
  }
}

/**
 * Gets the appropriate CSS class for an image based on its orientation
 * @param orientation - Image orientation
 * @returns CSS class name
 */
export function getImageSizeClass(orientation: ImageOrientation): string {
  switch (orientation) {
    case 'horizontal':
      return 'post-image-horizontal';
    case 'portrait':
      return 'post-image-portrait';
    case 'square':
      return 'post-image-square';
    default:
      return 'post-image-default';
  }
}

/**
 * Loads an image and determines its orientation
 * @param imageUrl - URL of the image
 * @returns Promise that resolves to the image orientation
 */
export function detectImageOrientation(imageUrl: string): Promise<ImageOrientation> {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      const orientation = getImageOrientation(img.naturalWidth, img.naturalHeight);
      resolve(orientation);
    };
    
    img.onerror = () => {
      resolve('default');
    };
    
    img.src = imageUrl;
  });
}
