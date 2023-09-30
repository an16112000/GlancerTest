import type { NextApiRequest, NextApiResponse } from "next";

export default async function initCategory(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(404).send({ message: "API NOT FOUND" });
  }

  try {
    await Promise.all(
      categoryList.map((name, index) => prisma?.category.create({ data: { id: `C-${index + 1}`, name } })),
    );

    return res.status(200).send({ message: "Init category successfully" });
  } catch (error) {
    return res.status(400).send("Bad request");
  }
}

const categoryList = [
  "Thiết kế",
  "Marketing",
  "Công nghệ thông tin",
  "Video - Âm thanh",
  "Viết - Dịch",
  "Dựng video",
  "Lối sống",
  "Kinh doanh",
];
