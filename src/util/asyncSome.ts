export const asyncSome = async <T>(array: T[], callback: (item: T) => any) => {
  for (let i = 0; i < array.length; i++) {
    const result = await callback(array[i]);
    if (result) {
      return result;
    }
  }
};
