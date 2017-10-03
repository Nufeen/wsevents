import React from 'react';
import autobind from 'react-autobind';
import moment from 'moment';

import GMap from './Map/map.js';
import Schedule from './Schedule';

import T from '../data/ru.json';

moment.locale('ru');

const YearSelector = ({ year, prev, next }) => [
  <button key="e1" className="year__prev" onClick={prev} />,
  <div key="e2" className="year__value">
    {year}
  </div>,
  <button key="e3" className="year__next" onClick={next} />,
];

class App extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      year: 2017,
      current: 0,
      chosen: 0,
      city: null,
    };
  }

  choose(chosen) {
    this.setState({ chosen });
  }

  componentDidMount() {
    let t = Date.now();
    const tt = moment(t).format('YYYYMMDD');
    const nextEvent = this.props.data.find(x => {
      return x.date >= tt;
    });
    if (nextEvent != null) {
      this.setState({
        current: nextEvent.id || 0,
        chosen: nextEvent.id || 0,
      });
    }
  }

  nextYear() {
    const { year } = this.state;
    const max = 2018;
    this.setState({ year: year < max ? year + 1 : max });
  }

  prevYear() {
    const { year } = this.state;
    this.setState({ year: year > 2016 ? year - 1 : 2016 });
  }

  highlight(city) {
    this.setState({ city });
  }

  clearSelection(e) {
    const cname = e.target.className;

    if (cname != 'event' && cname != 'cities__city') {
      this.highlight(null);
    }
  }

  render() {
    const { chosen, current, year, city } = this.state;
    const d = this.props.data.find(x => x.id == chosen) || {};

    return (
      <main onClick={this.clearSelection}>
        <div className="background" onClick={() => this.highlight(null)} />
        <header className="header">
          <section className="header__text">
            <h1>{T.header}</h1>
            <h2>
              {T.subhead} <a href={T.link}>events schedule</a>
            </h2>
          </section>
          <section className="year">
            <YearSelector
              year={this.state.year}
              next={this.nextYear}
              prev={this.prevYear}
            />
          </section>
        </header>
        <Schedule
          year={year}
          data={this.props.data}
          choose={this.choose}
          chosen={chosen}
          current={current}
          city={city}
        />
        <div className="tooltip" />
        <TheEvent d={d} />
        <Cities
          city={city}
          data={this.props.data}
          year={year}
          highlight={this.highlight}
        />
        <GMap place={d.place} data={this.props.data} />
        <footer className="footer" />
      </main>
    );
  }
}

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

export default App;
