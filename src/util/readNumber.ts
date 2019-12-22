export const readNumber = (number: string) => {
  if (number[1] === 'x') {
    return parseInt(number.substr(2), parseInt(number[0]));
  }
  return parseFloat(number);
};
