/* eslint-disable */

/* Original code: */
/* https://github.com/adrianlee44/ical2json */

const NEW_LINE = /\r\n|\n|\r/;

export default function convert(source) {
  let currentKey = '',
    currentValue = '',
    objectNames = [],
    output = {},
    parentObj = {},
    lines = source.split(NEW_LINE),
    splitAt;

  let currentObj = output;
  let parents = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (line.charAt(0) === ' ') {
      currentObj[currentKey] += line.substr(1);
    } else {
      splitAt = line.indexOf(':');

      if (splitAt < 0) {
        continue;
      }

      currentKey = line.substr(0, splitAt);
      currentValue = line.substr(splitAt + 1);

      switch (currentKey) {
        case 'BEGIN':
          parents.push(parentObj);
          parentObj = currentObj;
          if (parentObj[currentValue] == null) {
            parentObj[currentValue] = [];
          }
          // Create a new object, store the reference for future uses
          currentObj = {};
          parentObj[currentValue].push(currentObj);
          break;
        case 'END':
          currentObj = parentObj;
          parentObj = parents.pop();
          break;
        default:
          if (currentObj[currentKey]) {
            if (!Array.isArray(currentObj[currentKey])) {
              currentObj[currentKey] = [currentObj[currentKey]];
            }
            currentObj[currentKey].push(currentValue);
          } else {
            currentObj[currentKey] = currentValue;
          }
      }
    }
  }
  return output;
}

/**
 * Take JSON, revert back to ical
 * @param {Object} object
 * @return {String}
 */
function revert(object) {
  let lines = [];

  for (let key in object) {
    let value = object[key];
    if (Array.isArray(value)) {
      value.forEach(item => {
        lines.push(`BEGIN:${key}`);
        lines.push(revert(item));
        lines.push(`END:${key}`);
      });
    } else {
      let fullLine = `${key}:${value}`;
      do {
        // According to ical spec, lines of text should be no longer
        // than 75 octets
        lines.push(fullLine.substr(0, 75));
        fullLine = ' ' + fullLine.substr(75);
      } while (fullLine.length > 1);
    }
  }

  return lines.join('\n');
}
