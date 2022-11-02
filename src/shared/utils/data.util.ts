export const str = (data: object, ...excludes) => {
  return JSON.stringify(
    data,
    (key: string, value: any) => {
      if (excludes.includes(key)) return undefined;
      return value;
    },
    2,
  );
};
