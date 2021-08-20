export const getErrorCode = (err: Error): number => {
  switch (err.name) {
    case 'UnexpectedResource':
      return 400;
    case 'UnexpectedProperty':
      return 422;
    case 'UnsupportedProperty':
      return 422;
    default:
      return 500;
  }
};
