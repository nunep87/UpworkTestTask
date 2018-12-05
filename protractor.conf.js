'use strict';
const path = require('path'),
    URL = require('./constants/url.json'),
    BROWSERS = require('./constants/browsers.json'),
    seleniumServerJar = require('selenium-server-standalone-jar'),

    argv = require('yargs')
        .options({
            'w': {
                alias: 'web-app',
                describe: 'Web Application',
                default: 'upwork',
                choices: ['upwork', 'other']
            },
            'b': {
                alias: 'browser',
                describe: 'Browser',
                default: BROWSERS.CHROME,
                choices: [BROWSERS.CHROME, BROWSERS.FIREFOX, BROWSERS.IE, BROWSERS.SAFARI, BROWSERS.ALL]
            },
            't': {
                alias: 'tests-path',
                describe: 'Specs path'
            }
        })
        .help('h').argv;

exports.config = {
    // The address of a running selenium server.
    seleniumAddress: (function () {
        return argv.b === BROWSERS.SAFARI ? URL.SELENIUM_SERVER_URL_SAFARI : URL.SELENIUM_SERVER_URL;
    })(),

    seleniumServerJar: seleniumServerJar.path,

    // ---- Timeouts ----
    // https://github.com/angular/protractor/blob/master/docs/timeouts.md
    /* Waiting for Angular
    Before performing any action, Protractor waits until there are no pending asynchronous tasks in your Angular application.
    This means that all timeouts and http requests are finished. If application continuously polls $timeout or $http,
    Protractor will wait indefinitely and time out.
    Default timeout: 11 seconds
    */
    allScriptsTimeout: 30000,
    /* Waiting for Page to Load
    When navigating to a new page using browser.get, Protractor waits for the page to be loaded and the new URL to appear before continuing.
    Default timeout: 10 seconds
    */
    getPageTimeout: 15000,
    /* Jasmine Spec Timeout
     If a spec (an 'it' block) takes longer than the Jasmine timeout for any reason, it will fail.
     Default timeout: 30 seconds
    */
    jasmineNodeOpts: {
        defaultTimeoutInterval: 40000,
        showColors: true // Use colors in the command line report.
    },
    // ---- End Timeouts ----

    directConnect: (function () {
        return (argv.b !== BROWSERS.IE) && (argv.b !== BROWSERS.SAFARI);
    })(),

    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        browserName: argv.b
    },

    multiCapabilities : (function () {
        let browsers = [];

        if (argv.b === BROWSERS.ALL) {
            browsers = [
                { browserName: BROWSERS.CHROME },
                { browserName: BROWSERS.FIREFOX }
            ];
        }

        return browsers;
    })(),

    framework: 'jasmine2',

    // Spec patterns are relative to the configuration file location passed
    // to protractor (in this example conf.js).
    // They may include glob patterns.
    specs: (function () {
        return argv.t ? path.join(argv.t, '/**/*.js') : 'testCases/**/*.js';
    })(),

    onPrepare: function () {
        global.objectsPath = path.join(process.cwd(), 'objects');
        global.helpersPath = path.join(process.cwd(), 'helpers');
        global.constantsPath = path.join(process.cwd(), 'constants');
        global.testCasesPath = path.join(process.cwd(), 'testCases');

        let configPath = path.join(process.cwd(), 'config');
        global.web_config = require(path.join(configPath, argv.w));
        global.environment = argv.w;
    }
};
