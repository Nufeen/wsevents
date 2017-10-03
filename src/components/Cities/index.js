import React from 'react';
import moment from 'moment';

const Cities = ({ data, year, city, highlight }) => {
  let places = data
    .filter(x => moment(x.date).format('Y') == year)
    .map(x => x.place.split(',')[0])
    .sort((a, b) => (a > b ? 1 : -1));

  let uniq = [...new Set(places)];

  return (
    <section className="cities">
      {uniq.map(place => (
        <div
          key={place}
          data-chosen={place == city}
          onClick={() => highlight(place)}
          className="cities__city"
        >
          #{place}
        </div>
      ))}
    </section>
  );
};

export default Cities;
