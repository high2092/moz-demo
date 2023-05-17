import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import zlib from 'zlib';

export default function _import(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  const { cipher } = req.body;

  if (typeof cipher !== 'string') {
    res.status(400).end();
    return;
  }

  try {
    const result = JSON.parse(decompress(decrypt(cipher)));
    res.status(200).json({ result });
  } catch {
    res.status(400).end();
    return;
  }
}

function decrypt(encrypted: string) {
  const secret = Buffer.from(process.env.SECRET, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-ecb', secret, '');
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function decompress(encoded: string) {
  const compressedBuffer = Buffer.from(decodeURIComponent(encoded), 'base64');
  const decipher = zlib.inflateSync(compressedBuffer).toString('utf-8');
  return decipher;
}
