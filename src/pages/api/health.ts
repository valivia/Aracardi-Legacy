import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<{ balls: "deez nuts" }>
) {
  return res.status(200).json({ balls: "deez nuts" }); // same
}
