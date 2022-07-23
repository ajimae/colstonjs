import crypto from 'crypto';
const data = require('../dataStore/data.json')

export function find(id) {
  return data.find((v) => v.id == id);
}

export function findAll() {
  return data;
}

export function save(datum) {
  const id = crypto.
    randomBytes(32)
    .toString('base64')
    .replace(/[_+=\/]/gi, '');

  const _data = {
    id,
    ...datum,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  data.push(_data);
  return _data;
}

export function Delete(id) {
  const idx = data.findIndex(v => v.id == id);
  return data.splice(idx, 1);
}
