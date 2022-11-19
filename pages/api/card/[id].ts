// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "@lib/prisma";
import { Card } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Card[] | { message: string }>
) {
  const { id } = req.query;
  if (typeof id !== "string") return res.status(404).json({ message: "Not found" });
  const cards = await prisma.card.findMany({ where: { addon_id: id } });
  if (cards.length === 0) return res.status(404).json({ message: "Not found" });

  return res.status(200).json(cards);
}
