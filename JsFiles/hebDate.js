// import {HebrewCalendar, Location} from '@hebcal/core';
// import {eventsToClassicApi, eventsToCsv} from '@hebcal/rest-api';

const options = {
  year: 2020,
  month: 2,
  sedrot: true,
  candlelighting: true,
  location: Location.lookup('Hawaii'),
};
const events = HebrewCalendar.calendar(options);
const apiResult = eventsToClassicApi(events, options);

console.log(JSON.stringify(apiResult));

const csv = eventsToCsv(events, options);
console.log(JSON.stringify(csv));