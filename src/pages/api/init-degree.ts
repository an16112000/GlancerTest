import type { NextApiRequest, NextApiResponse } from "next";

export default async function initDegree(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(404).send({ message: "API NOT FOUND" });
  }

  try {
    await Promise.all(degreeList.map((name, index) => prisma?.degree.create({ data: { id: `D-${index + 1}`, name } })));

    return res.status(200).send({ message: "Init degree successfully" });
  } catch (error) {
    return res.status(400).send("Bad request");
  }
}

const degreeList = ["Cử nhân", "Kỹ sư", "Thạc sĩ", "Tiến sĩ"];
