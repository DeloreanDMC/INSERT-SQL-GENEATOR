const nextYear = require('./nextYear.js');

function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const getDaysInMonth = function(month,year) {
    // Here January is 1 based
    //Day 0 is the last day in the previous month
   return new Date(year, month, 0).getDate();
  // Here January is 0 based
  // return new Date(year, month+1, 0).getDate();
  };
   
const genDate = (yearRange=null) => {
    let year;
    if (yearRange===null) {
        year = rand(400,1980);
    } else {
        year = rand(yearRange.min, yearRange.max);
    }
    const month = rand(1,12);
    const day = rand(1,getDaysInMonth(month, year)-5);
    return {DD:day,MM:month,YYYY:year};
}  

module.exports = genDate;