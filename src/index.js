/* eslint-disable no-console */

import 'core-js/es6/promise';
import 'core-js/fn/string/includes';
import 'core-js/fn/array/from';
import 'core-js/fn/array/find';
import 'whatwg-fetch';

import './index.css';
import './index.html';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App.js';

import convert from './helpers/convert';
import adapter from './adapter/adapter';

const url =
  'https://raw.githubusercontent.com/web-standards-ru/calendar/master/dist/calendar.ics';

let errCode = 0;

function get(url) {
  return fetch(url).catch(() => {
    errCode = 1;
    return get('./src/data/backup.ics');
  });
}

get(url, errCode)
  .then(d => d.text())
  .then(d => convert(d))
  .then(d => adapter(d))
  .then(data => {
    ReactDOM.render(
      <App data={data} error={errCode} />,
      document.querySelector('.root')
    );
  })
  .catch(error => console.warn(error));

if (window.innerWidth < 600) {
  const metaTag = document.querySelectorAll('meta[name="viewport"]')[0];
  metaTag.content = 'width=600';
}
