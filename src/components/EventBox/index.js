import React from 'react'
import moment from 'moment'

moment.locale('ru')

const today = moment().format('YYYYMMDD')

const TheEvent = ({ d, year }) => {
  const date = moment(d.date, 'YYYYMMDD')
  return (
    <section className="details" data-year={year}>
      <h3>{d.name}</h3>
      <address>{d.place}</address>
      <time>
        {date.format('l')} (
        {date.format('YYYYMMDD') != today ? date.fromNow() : 'сегодня'})
      </time>
      <a target="_blank" rel="noopener noreferrer" href={d.link}>
        {d.link}
      </a>
    </section>
  )
}

export default TheEvent
