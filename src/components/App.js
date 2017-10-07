import React from 'react';
import autobind from 'react-autobind';
import moment from 'moment';

import GMap from './Map/map.js';
import Schedule from './Schedule';
import Cities from './Cities';
import TheEvent from './EventBox';
import YearSelector from './YearSelector';

import T from '../data/ru.json';

import gh from '../assets/gh.svg';
import tg from '../assets/tg.svg';

moment.locale('ru');

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

  choose(chosen, year = +this.state.year) {
    this.setState({ chosen, year });
  }

  componentDidMount() {
    const t = Date.now();
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
              {T.subhead}{' '}
              <a target="_blank" href={T.link}>
                events schedule
              </a>
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
          chosen={chosen}
          current={current}
          city={city}
          data={this.props.data}
          choose={this.choose}
        />
        <TheEvent d={d} />
        <Cities
          city={city}
          year={year}
          data={this.props.data}
          highlight={this.highlight}
        />
        <ErrMsg error={this.props.error} />
        <footer className="footer">
          <a target="_blank" href="https://github.com/Nufeen/wsevents">
            <div dangerouslySetInnerHTML={{ __html: gh }} />
          </a>
          <a target="_blank" href="https://telegram.me/Lyrical_Tokarev">
            <div dangerouslySetInnerHTML={{ __html: tg }} />
          </a>
        </footer>
        <GMap place={d.place} data={this.props.data} />
      </main>
    );
  }
}

const ErrMsg = ({ error }) => {
  return error ? (
    <div className="error">
      Failed to fetch original schedule. Showing backup data.
    </div>
  ) : null;
};

export default App;
