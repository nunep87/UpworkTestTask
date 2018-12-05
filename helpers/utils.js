'use strict';

let _generateRandomNum = (num) => {
    return Math.floor(Math.random() * num);
};

module.exports = {
    generateRandomNum: _generateRandomNum
}