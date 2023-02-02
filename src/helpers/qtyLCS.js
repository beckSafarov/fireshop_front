// qts = {123214:2, 3432432:4, ...};

export const getQts = () => JSON.parse(localStorage.getItem('qts')) || {};

const setQts = (qts) => localStorage.setItem('qts', JSON.stringify(qts));

export const isEmpty = () => getQts() === {};

export const add = ({ _id, qty }) => {
  let qts = getQts();
  qts[_id] = Number(qty);
  setQts(qts);
};

export const remove = (_id) => {
  let qts = getQts();
  qts[_id] = undefined;
  setQts(qts);
};

export const flush = () => setQts({});
