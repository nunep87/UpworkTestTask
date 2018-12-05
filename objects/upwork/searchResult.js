'use strict';

const path = require('path'),
    EC = protractor.ExpectedConditions,
    utils = require(path.join(global.helpersPath, 'utils')),
    pageObjs = require(path.join(global.objectsPath, 'upwork', 'searchResult.json'));

const Q = require('q');

const waitTime = 5000;

/**
 * Parsing Search result first page and storing data
 * @return promise containing parsed data object
 */
let  _getResults = () => {
    let def = Q.defer();

    let dataObj = [],
        names,
        titles,
        descriptions;

    browser.wait(EC.visibilityOf($(pageObjs.pageTitle)), waitTime, 'wait for search result page')
        .then(() => $$(pageObjs.name).getText())
        .then((data) => names = data)
        .then(() => $$(pageObjs.title).getText())
        .then((data) => titles = data)
        .then(() => $$(pageObjs.description).getText())
        .then((data) => descriptions =data)
        .then(() => {
            if(names.length === titles.length && names.length === descriptions.length){
                for(let i = 0; i < names.length; i++) {
                    let el = {};
                    el.name = names[i];
                    el.title = titles[i];
                    el.description = descriptions[i];
                    dataObj.push(el);
                }
            } else def.reject("ERR: Data parsing issue");
        })
        .then(() => def.resolve(dataObj))
        .catch((err) => def.reject(err));

    return def.promise;
};

/**
 * Sorting Search result by given keyword
 * @param key - keyword
 * @param data - array of the parsed data
 * @return promise containing sorted data
 */
let _sortResult = (data, key) => {
    let def = Q.defer();

    let obj = {
        match: [],
        notmatch: []
    };

    for(let i = 0; i < data.length; i++) {
        let el = data[i]
        if(el.name.toUpperCase().indexOf(key.toUpperCase()) !== -1 ||
            el.title.toUpperCase().indexOf(key.toUpperCase()) !== -1 ||
            el.description.toUpperCase().indexOf(key.toUpperCase()) !== -1) {
            obj.match.push(el);
        } else obj.notmatch.push(el);
        if(i === data.length - 1) {
            def.resolve(obj);
        }
    }

    return def.promise;
};

/**
 * Printing sorted data
 * @param data - array of the sorted data
 * @return
 */
let _printSearchResult = (data) => {
    console.log("Below is the list of freelancers with keword...\n");
    for(let i = 0; i < data.match.length; i++) {
        let el = data.match[i];
        console.log(el.name, el.title, el.description, "\n");
    }
    console.log("\nBelow is the list of freelancers without keword...\n");
    for(let i = 0; i < data.notmatch.length; i++) {
        let el = data.notmatch[i];
        console.log(el.name, el.title, el.description, "\n");
    }
};

/**
 * Clicking on the Random freelancer
 * @return promise containing index of the freelancer
 */
let _clickOnRandomFreelancer = () => {
    let def = Q.defer();
    let names,
        random;

    $$(pageObjs.name)
        .then((data) => names = data)
        .then(() => {
            random = utils.generateRandomNum(names.length - 1);
            return names[random].click();
        })
        .then(() => browser.wait(EC.visibilityOf($(pageObjs.modalName)), waitTime, 'wait for detailed page is opened'))
        .then(() => def.resolve(random))
        .catch((err) => def.reject(err));

    return def.promise;
};

/**
 * Comparing data with the real data
 * @param data - golden data
 * @return promise
 */
let _compareData = (data) => {
    let def = Q.defer();

    expect($(pageObjs.modalName).getText()).toBe(data.name, 'check names are the same');
    expect($(pageObjs.modalTitle).getText()).toBe(data.title, 'check titles are the same');

    $(pageObjs.modalDesc).getText()
        .then((text) => expect(text.replace(/\n/g, ' ').replace(/  /g, ' ')).toContain(data.description.replace("...", "").trim(), 'check descs are the same'))
        .then(() => def.resolve())
        .catch((err) => def.reject(err));

    return def.promise;
};

module.exports = {
    GetResults: _getResults,
    SortResult: _sortResult,
    PrintSearchResult: _printSearchResult,
    ClickOnRandomFreelancer: _clickOnRandomFreelancer,
    CompareData: _compareData
};