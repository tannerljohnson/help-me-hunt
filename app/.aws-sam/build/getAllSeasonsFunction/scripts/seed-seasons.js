const fs = require("fs");
const fetch = require('node-fetch');

const csvToJS = filePath => {
  const csv = fs.readFileSync(filePath);
  const array = csv.toString().split("\r");
  const headers = array.shift().split(",");
  let result = [];

  array.forEach(row => {
    let obj = {};
    const items = row.trim().split(',');
    for (let i = 0; i < headers.length; i++) {
      const columnName = headers[i];
      let value = items[i];
      if (value === 'TRUE') {
        value = true;
      } else if (value === 'FALSE') {
        value = false;
      }
      obj[columnName] = value;
    }

    result.push(obj);
  });

  return result;
};

const data = csvToJS('/Users/tanner.johnson/workspace/help-me-hunt/app/scripts/idaho_seasons.csv');

const putSeason = async season => {
  const url = 'https://cqiqnxsapf.execute-api.us-west-2.amazonaws.com/Prod/seasons';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(season),
  });

  return response.json();
};

const putAll = seasons => {
  seasons.forEach(season => {
    putSeason(season).then(resp => {
      console.log(resp);
    });
  });
};

putAll(data);