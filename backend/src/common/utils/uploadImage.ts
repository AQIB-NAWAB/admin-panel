import axios from 'axios';

interface ImgBBResponse {
  data: {
    data: {
      url_viewer: string;
    };
  };
}

export async function uploadToImgBB(buffer: Buffer): Promise<string> {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) throw new Error('Missing IMGBB_API_KEY in env');

  const base64Image = buffer.toString('base64');
  const body = new URLSearchParams();
  body.append('key', apiKey);
  body.append('image', base64Image);
  const response: ImgBBResponse = await axios.post(
    'https://api.imgbb.com/1/upload',
    body,
  );

  return response.data.data.url_viewer;
}
