function isFunc(target) {
  return typeof target === 'function';
}

function error(message) {
  throw new Error(message);
}

export {
  isFunc,
  error
}
