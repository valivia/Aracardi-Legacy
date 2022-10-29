// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from '@lib/prisma';
import { Card } from '@structs/card';
import { rename } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next'
import addons from "../../../data/addons.json";

type Data = {
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    res.status(200).json({ name: 'John Doe' })
}
