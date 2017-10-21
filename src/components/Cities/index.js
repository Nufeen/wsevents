import React from 'react';
import moment from 'moment';

const Cities = ({ data, year, city, highlight }) => {
  const places = data
    .filter(x => moment(x.date).format('Y') == year)
    .map(x => x.place.split(',')[0])
    .sort((a, b) => (a > b ? 1 : -1));

  const uniq = [...new Set(places)];

  const count = uniq.reduce((acc, place) => {
    acc[place] = places.filter(x => x == place).length;
    return acc;
  }, {});

  return (
    <section className="cities">
      {uniq.map(place => (
        <div
          key={place}
          data-chosen={place == city}
          onClick={() => highlight(place)}
          className="cities__city"
        >
          #{place} <span className="cities__count">{count[place]}</span>
        </div>
      ))}
    </section>
  );
};

export default Cities;
