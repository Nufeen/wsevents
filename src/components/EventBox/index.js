import React from 'react';
import moment from 'moment';

moment.locale('ru');

const today = moment().format('YYYYMMDD');

const TheEvent = ({ d }) => {
  const date = moment(d.date, 'YYYYMMDD');
  return (
    <section className="details">
      <h3>{d.name}</h3>
      <address>{d.place}</address>
      <time>
        {date.format('l')} ({date.format('YYYYMMDD') != today
          ? date.fromNow()
          : 'сегодня'})
      </time>
      <a target="_blank" href={d.link}>
        {d.link}
      </a>
    </section>
  );
};

export default TheEvent;
