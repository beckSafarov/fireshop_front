const ObjectsCompare = (obj1, obj2) => {
  let ch = false;
  Object.keys(obj1).forEach((i) => {
    if (typeof obj1[i] === 'object') {
      Object.keys(obj1[i]).forEach((j) => {
        ch = obj1[i][j] !== obj2[i][j] ? true : ch;
      });
    } else {
      ch = obj1[i] !== obj2[i] ? true : ch;
    }
  });
  return ch;
};

export default ObjectsCompare;
