const moment = require("moment");
const sortByTime = (day1, day2) => {
  const today = day2 && day2 != "today" ? moment(day2) : moment();
  const someday = moment(day1);
  const diff = someday.diff(today, "minutes");
  //   console.log(diff);
  return diff;
};

const getDateTimestamp = (day1) => {
  const someday = moment(day1);
  return someday;
};

module.exports = { sortByTime, getDateTimestamp };
