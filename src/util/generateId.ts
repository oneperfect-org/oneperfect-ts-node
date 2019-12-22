const random = () =>
  Math.random()
    .toString(36)
    .substr(2, 8);

export const generateId = () => `${Date.now()}:${random()}${random()}`;
