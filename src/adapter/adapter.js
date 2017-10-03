function humanize(event, i) {
  return {
    id: i,
    name: event['SUMMARY'],
    place: event['LOCATION'].replace('\\', ''),
    date: event['DTSTART;VALUE=DATE'] || event['DTSTART'],
    link: event['DESCRIPTION'],
  };
}

export default function adapter(d) {
  const events = d['VCALENDAR'][0]['VEVENT'];
  return events.map(humanize);
}
