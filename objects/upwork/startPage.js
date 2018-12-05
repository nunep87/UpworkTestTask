'use strict';

const path = require('path'),
    EC = protractor.ExpectedConditions,
    pageObjs = require(path.join(global.objectsPath, 'upwork', 'startPage.json'));

const Q = require('q');

const waitTime = 5000;

/**
 * Typing in the "Find Freelancers" field
 * @param keyword - serched key
 * @return promise
 */
let _typeInSearchBox = (keyword) => {
    let def = Q.defer();

    browser.wait(EC.visibilityOf($(pageObjs.description)), waitTime, 'wait for page element visibility')
        .then(() => $$(pageObjs.txtFindFreelancers).get(2))
        .then((element) => element.sendKeys(keyword))
        .then(() => def.resolve())
        .catch((err) => def.reject(err));

    return def.promise;
};

/**
 * Clicks on the Search button
 * @return promise
 */
let _clickOnSearchButton = () => {
    let def = Q.defer();

    $$(pageObjs.btnSearch)
        .then((element) => element[1].click())
        .then(() => def.resolve())
        .catch((err) => def.reject(err));

    return def.promise;
};

module.exports = {
    ClickOnSearchButton: _clickOnSearchButton,
    TypeInSearchBox: _typeInSearchBox
};
