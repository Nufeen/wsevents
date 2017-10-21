import React from 'react';
import autobind from 'react-autobind';
import moment from 'moment';

class Schedule extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = { hovered: false };
  }

  componentDidMount() {
    document.addEventListener('keydown', e => {
      if (e.keyCode == 40 || e.keyCode == 9 || e.keyCode == 32) {
        this.next();
      } else if (e.keyCode == 38 || e.keyCode == 8) {
        this.prev();
      }
    });
  }

  next() {
    const { chosen, data } = this.props;
    const max = data.length - 1;
    const next = chosen < max ? chosen + 1 : max;
    const year = moment(data[next]['date']).format('Y');
    this.props.choose(next, +year);
  }

  prev() {
    const { chosen, data } = this.props;
    const prev = chosen > 0 ? chosen - 1 : 0;
    const year = moment(data[prev]['date']).format('Y');
    this.props.choose(prev, +year);
  }

  handleClick(id) {
    this.props.choose(id);
  }

  renderTooltip(ev) {
    this.setState({ hovered: ev });
  }

  render() {
    const { current, chosen, city, data, year } = this.props;

    if (data == null) {
      return null;
    }

    return (
      <section className="schedule">
        <button
          className="schedule__prev"
          onClick={this.prev}
          disabled={chosen == 0}
        />
        {dataByMonths(data, year).map((month, i) => (
          <div
            style={{ 'z-index': `${20 - i}` }}
            className="month"
            key={i}
            data-id={i}
          >
            <span
              className="month__caption"
              dangerouslySetInnerHTML={{ __html: monthCaption(i + 1) }}
            />
            {month.map(ev => (
              <div
                key={ev.id}
                className="event"
                data-chosen={ev.id == chosen}
                data-past={ev.id < current}
                data-city={ev.place.includes(city)}
                data-tooltip={tooltip(ev)}
                data-date={date(ev)}
                onClick={() => this.handleClick(ev.id)}
                onMouseOver={() => this.renderTooltip(ev)}
              />
            ))}
          </div>
        ))}
        <button
          className="schedule__next"
          disabled={chosen == data.length - 1}
          onClick={this.next}
        />
      </section>
    );
  }
}

function date(ev) {
  return moment(ev.date).format('DD/MM');
}

function tooltip(ev) {
  return ev.name;
}

function monthCaption(n) {
  const m = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const num = n > 9 ? n : `0${n}`;
  return `<span>${m[n - 1]}</span>${num}`;
}

function dataByMonths(d, year) {
  const a12 = Array.from(Array(12).keys());
  return a12.map((month, i) =>
    d.filter(x => {
      const m = moment(x.date).format('M');
      const y = moment(x.date).format('Y');
      return m == i + 1 && y == year;
    })
  );
}

export default Schedule;
