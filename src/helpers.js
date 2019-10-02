var GoogleSpreadsheet = require('google-spreadsheet');
// spreadsheet key is the long id in the sheets URL
var spreadsheetId = '1BvEKCilmWKKyds29uiJcWAq0l8BjLdS9kHkDZYVl3Ns';
var worksheetId = 2;
var creds = require('./data/aoblitz-dashboard.json');


const getSpreadsheet = (spreadsheetId, credentials) =>
  new Promise((resolve, reject) => {
    const doc = new GoogleSpreadsheet(spreadsheetId, null, {gzip:false});
    doc.useServiceAccountAuth(credentials, function(err) {
      if (err) reject(err);
      else resolve(doc);
    });
  });

const getRowsFromSpreadsheet = (spreadsheet, worksheet_id) =>
  new Promise((resolve, reject) =>
    spreadsheet.getRows(worksheet_id, (err, rows) => {
      if (err) reject(err);
      else {
        resolve(rows);
      }
    })
  );

function cleanRows(rows){
  return rows.map(row => ({
    rep: row.rep,
    points: +row.points,
    democallscheduled: +row.democallscheduled,
    discocallscheduled: +row.discocallscheduled,
    connectedwithsomeone: +row.connectedwithsomeone,
    getcorrectcontact: +row.getcorrectcontact,
    replytoanemail: +row.replytoanemail,
    unsubscribefromemail: +row.unsubscribefromemail,
    gethungupon: +row.gethungupon,
  }));
};

async function fetchSheetData(spreadsheetId, worksheetId, credentials){
  let spreadsheet = await getSpreadsheet(spreadsheetId, credentials);
  let rows = await getRowsFromSpreadsheet(spreadsheet, worksheetId);
  return cleanRows(rows);
};

export function getSheetData(){
  return fetchSheetData(spreadsheetId, worksheetId, creds);
}

export function getRandomData(){
  return [
      {rep: 'Allison', points:100*Math.random()},
      {rep: 'Chris B', points:100*Math.random()},
      {rep: 'Chris J', points:100*Math.random()},
      {rep: 'Joey', points:100*Math.random()},
      {rep: 'Matt', points:100*Math.random()},
      {rep: 'Wes', points:100*Math.random()},
      {rep: 'François', points:100*Math.random()}
  ]
}
