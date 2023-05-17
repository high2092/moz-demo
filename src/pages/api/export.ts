import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import zlib from 'zlib';

export default function _export(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  const payload = req.body;

  const result = encrypt(compress(JSON.stringify(payload)));
  res.status(200).json({ result });
}

function encrypt(text: string) {
  const secret = Buffer.from(process.env.SECRET, 'hex');
  const cipher = crypto.createCipheriv('aes-256-ecb', secret, '');
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function compress(plain: string) {
  const compressedBytes = zlib.deflateSync(plain);
  return encodeURIComponent(Buffer.from(compressedBytes).toString('base64'));
}
