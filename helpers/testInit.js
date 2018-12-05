'use strict';

const Q = require('q'),
    path = require('path')

/**
 * Initialization and clean up of upwork
 * @constructor
 * @param {object} config - config to initialize
 * @param {number} [config.specTimeout] - timeout for specs
 * @param {boolean} [config.ignoreSynchronization] - set ignore synchronization for protractor
 */
function InitTest(config) {
    let originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;

    /**
     * Opens browser and navigates to given url
     * @returns {Promise<T>} - promise
     */
    this.init = function () {
        let def = Q.defer();

        if (typeof (config) !== 'object') {
            def.reject('Invalid config');
            return def.promise;
        }

        if (config.specTimeout) {
            if (typeof(config.specTimeout) !== 'number') {
                def.reject('Invalid timeout value');
                return def.promise;
            }
            jasmine.DEFAULT_TIMEOUT_INTERVAL = config.specTimeout;
        }

        if (config.ignoreSynchronization) {
            if (typeof(config.ignoreSynchronization) != 'boolean') {
                def.reject('Invalid ignoreSynchronization value');
                return def.promise;
            }
            browser.ignoreSynchronization = config.ignoreSynchronization;
            browser.driver.ignoreDriverSynchronization = config.ignoreSynchronization;
        }

        if (config.url) {
            if(typeof(config.url) != 'string') {
                def.reject('Invalid URL value');
                return def.promise;
            } else {
                browser.get(config.url)
                    .then(() => browser.waitForAngular())
                    .then(() => def.resolve())
                    .catch((err) => def.reject(err));
            }
        } else {
            def.reject('No start URL is specified');
            return def.promise;
        }

        return def.promise;
    };

    /**
     * Cleanup
     * @param {boolean} [deleteCookies=true] - delete cookies
     * @returns {Promise<T>}
     */
    this.cleanup = function (deleteCookies = true) {
        let def = Q.defer();

        if (deleteCookies) {
            browser.manage().deleteAllCookies()
                .then(() => def.resolve())
                .catch((err) => def.reject(err));
        } else def.resolve();

        // set timeout back to it's original value
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;

        // set synchronization to false
        browser.ignoreSynchronization = false;
        browser.driver.ignoreSynchronization = false;

        return def.promise;
    };
}

module.exports = InitTest;
