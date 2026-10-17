export const removeKeys = (obj: Record<string, any>, keysToRemove: string[]): Record<string, any> => {
  const newObj = { ...obj };

  keysToRemove.forEach((key) => {
    if (key in newObj) {
      delete newObj[key];
    }
  });

  return newObj;
};
