'use strict';

function setting(value, name) {
  if (!Number.isInteger(value) || value < 0 || value > 25) {
    throw new RangeError(`${name} must be an integer from 0 to 25`);
  }
}

function settings(values, length, name) {
  if (!Array.isArray(values) || values.length !== length) {
    throw new TypeError(`${name} must contain exactly ${length} settings`);
  }
  // Index explicitly so sparse arrays cannot bypass validation.
  for (let i = 0; i < length; i++) setting(values[i], `${name}[${i}]`);
}

function character(value) {
  if (typeof value !== 'string' || value.length !== 1 || !/^[A-Z]$/.test(value)) {
    throw new TypeError('character must be a single uppercase letter A-Z');
  }
}

module.exports = { setting, settings, character };
