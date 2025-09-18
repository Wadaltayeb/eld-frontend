const fs = require('fs');
const csv = require('csv-parser');

const results = [];

fs.createReadStream('WorldCities.csv')
  .pipe(csv())
  .on('data', (data) => {
    results.push({
      name: data.city,
      country: data.country,
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lng),
    });
  })
  .on('end', () => {
    fs.writeFileSync('cities.json', JSON.stringify(results, null, 2));
    console.log('✅ cities.json created!');
  });
