function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const years = [
    1990, 1998, 1996, 2003, 2007, 2018
];

const nextYear = () => {
    if (getRandomInt(1,4)===2) {
        return years[getRandomInt(0,5)];
    }
    return getRandomInt(400,1980);
}

module.exports = nextYear;