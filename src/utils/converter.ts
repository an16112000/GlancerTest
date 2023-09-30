export const convertEnumToArray = (Enum: Record<string, never>) => {
  return Object.keys(Enum).filter((option) => isNaN(Number(option)));
};

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
