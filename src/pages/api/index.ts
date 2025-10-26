import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json({
    status: 'ok',
    message: 'ANDENUTRI API está funcionando!',
    version: '1.0.0',
    deploy: 'vercel-nextjs'
  });
}

