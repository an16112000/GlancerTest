export const formatName = (name: string | null | undefined) => {
  if (!name) return "";

  const arrayWordsInName = name.split(" ");
  const arrayFirstLetterOfWords = arrayWordsInName.map((word) => word.charAt(0));

  return arrayFirstLetterOfWords.join("");
};

export const formatPrice = (data: number | string | undefined, currency = "VND") => {
  let stringData = "";

  if (!data) stringData = "0";

  if (typeof data === "number") stringData = data.toString();

  stringData = stringData.replace(/ /g, "");

  const pattern = /(-?\d+)(\d{3})/;

  while (pattern.test(stringData)) stringData = stringData.replace(pattern, "$1,$2");

  stringData = stringData + " " + currency;

  return stringData;
};
