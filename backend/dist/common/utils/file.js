"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidImageFile = isValidImageFile;
function isValidImageFile(mimetype) {
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
//# sourceMappingURL=file.js.map