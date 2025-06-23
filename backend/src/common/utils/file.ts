export function isValidImageFile(mimetype: string): boolean {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/bmp',
  ];

  return allowedMimeTypes.includes(mimetype);
}
