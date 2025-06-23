"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToImgBB = uploadToImgBB;
const axios_1 = require("axios");
async function uploadToImgBB(buffer) {
    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey)
        throw new Error('Missing IMGBB_API_KEY in env');
    const base64Image = buffer.toString('base64');
    const body = new URLSearchParams();
    body.append('key', apiKey);
    body.append('image', base64Image);
    const response = await axios_1.default.post('https://api.imgbb.com/1/upload', body);
    return response.data.data.url;
}
//# sourceMappingURL=uploadImage.js.map