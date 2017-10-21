function humanize(event, i) {
  return {
    id: i,
    name: event['SUMMARY'].replace(/\\/g, ''),
    place: event['LOCATION'].replace(/\\/g, ''),
    date: event['DTSTART;VALUE=DATE'] || event['DTSTART'],
    link: event['DESCRIPTION'],
  };
}

export default function adapter(d) {
  const events = d['VCALENDAR'][0]['VEVENT'];
  return events.map(humanize);
}
