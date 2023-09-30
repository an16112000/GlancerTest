export const isBase64 = (data: string | null | undefined) => {
  if (!data || !data.trim()) return false;

  data = data.split(",")[1] || "";

  try {
    window.atob(data);
    return true;
  } catch (e) {
    return false;
  }
};
