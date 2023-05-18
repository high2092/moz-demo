import { NextApiRequest, NextApiResponse } from 'next';

export default async function validateVideoId(req: NextApiRequest, res: NextApiResponse) {
  const { videoId } = req.query;
  const response = await fetch(`https://img.youtube.com/vi/${videoId}/0.jpg`, {
    method: 'GET',
  });

  const imageBuffer = await response.arrayBuffer();

  return res.json({
    valid: response.ok,
    base64Image: Buffer.from(imageBuffer).toString('base64'),
  });
}
