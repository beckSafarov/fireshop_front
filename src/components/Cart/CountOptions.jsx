import React from 'react';

const CountOptions = ({ countInStock }) => {
  return (
    <>
      {[...Array(countInStock).keys()].map((x, index) => {
        while (index < 5) {
          return (
            <option key={x + 1} value={x + 1}>
              {x + 1}
            </option>
          );
        }
      })}
    </>
  );
};

export default CountOptions;
