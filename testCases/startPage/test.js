'use strict';

const path = require('path'),
    file_util = require(path.join(global.helpersPath, 'file_utils')),
    initTest = require(path.join(global.helpersPath, 'testInit')),
    startPage = require(path.join(global.objectsPath, 'upwork', 'startPage.js')),
    searchResult = require(path.join(global.objectsPath, 'upwork', 'searchResult.js'));

describe('Search Action Check', () => {
    let init = new initTest({
        specTimeout: 50000,
        url: global.web_config.applicationsURL.baseURL
    });

    let _err,
        dataArray,
        key;

    beforeAll((done) => {
        init.init()
			.then(() => key = browser.params.key)
			.then (() => {
				if(!key) _err = "Error: Key parameter is not specified";
            })
            .catch((err) => _err = err)
            .finally(done);
    });

    afterAll((done) => {
        init.cleanup()
            .catch((err) => expect(err).toBeFalsy())
            .finally(done);
    });

    it('should check pre-condition', () => {
        expect(_err).toBeFalsy();
    });

    it('should serach given key and print result', (done) => {
        if(_err) return done();

        console.log(`Type ${key} in the Find Freelancers box`);
        startPage.TypeInSearchBox(key)
            .then(() => console.log("Clicking on the button Search"))
            .then(() => startPage.ClickOnSearchButton())
            .then(() => searchResult.GetResults())
            .then((data) => dataArray = data)
            .then(() => console.log("Printing results"))
            .then(() => searchResult.SortResult(dataArray, key))
            .then((data) => searchResult.PrintSearchResult(data))
            .catch((err) => expect(err).toBeFalsy())
            .finally(done);
    });

    it('should click on random freelancer and check data', (done) => {
        if(_err) return done();

        let index;

        console.log(`Clicking on the random freelancer name`);
        searchResult.ClickOnRandomFreelancer()
            .then((i) => index = i)
            .then(() => console.log("Checking if correct data is displayed"))
            .then(() => searchResult.CompareData(dataArray[index]))
            .catch((err) => expect(err).toBeFalsy())
            .finally(done);
    });
});
