import React from 'react';

const YearSelector = ({ year, prev, next }) => [
  <button key="e1" className="year__prev" onClick={prev} />,
  <div key="e2" className="year__value">
    {year}
  </div>,
  <button key="e3" className="year__next" onClick={next} />,
];

export default YearSelector;
