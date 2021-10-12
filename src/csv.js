const fs = require('fs');
const csv = require('fast-csv');

const format = require('@fast-csv/format');

const cwd = process.cwd();

async function writeToCsv(items) {
  const rows = items.map(item => {
    return [item.name];
  });

  return new Promise((resolve, reject) => {
    const stream = format.writeToPath(`${cwd}/file.csv`, rows);

    stream.on('error', err => reject(err));
    stream.on('finish', () => resolve(true));
  });
}

async function readFromCsv() {
  return new Promise((resolve) => {
    const files = [];

    fs.createReadStream(`${cwd}/file.csv`)
      .pipe(csv.parse())
      .transform((row, next) => {
        return next(null, {
          name: row[0]
        });
      })
      .on('data', row => {
        files.push(row);
      })
      .on('end', () => {
        resolve(files);
      });
  });
}

async function writeToCsvAvoid(files) {
  return new Promise((resolve, reject) => {
    const stream = format.writeToPath(`${cwd}/files-to-avoid.csv`, files, { writeHeaders: false });

    stream.on('error', err => reject(err));
    stream.on('finish', () => resolve(true));
  });
}

async function readFromCsvAvoid() {
  return new Promise((resolve) => {
    const files = [];

    fs.createReadStream(`${cwd}/files-to-avoid.csv`)
      .pipe(csv.parse())
      .transform((row, next) => {
        return next(null, {
          path: row[0]
        });
      })
      .on('data', row => {
        files.push(row);
      })
      .on('end', () => {
        resolve(files);
      });
  });
}

module.exports = {
  writeToCsv,
  readFromCsv,
  writeToCsvAvoid,
  readFromCsvAvoid
};
