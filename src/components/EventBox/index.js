import React from 'react';
import moment from 'moment';

moment.locale('ru');

const TheEvent = ({ d }) => (
  <section className="details">
    <h3>{d.name}</h3>
    <address>{d.place}</address>
    <time>
      {moment(d.date, 'YYYYMMDD').format('l')} ({moment(d.date, 'YYYYMMDD').fromNow()})
    </time>
    <a href={d.link}>{d.link}</a>
  </section>
);

export default TheEvent;
