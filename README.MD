## GENERAL SETUP

1. You'll need to have jdk installed on your machine. Navigate to http://www.oracle.com/technetwork/java/javase/downloads/index.html and select appropriate version of jdk
2. Check if java is installed by executing "java -version" in command line
3. You'll need Node.js v6.4.0
4. Install Protractor globally:
   "npm install -g protractor"
5. In project directory, update third party modules:
   "npm install"
   "webdriver-manager update"


### INTERNET EXPLORER

1. Open Internet Options in IE
2. Select Security tab
3. Make sure that protected mode is enabled for all zones and Local intranet section security level is set to medium-low.4
4. Execute in command line "webdriver-manager --ie update"


### SAFARI

1. Connect to vm
2. Open terminal and execute "webdriver-manager start"
3. On your main machine start protractor by executing "protractor protractor.conf.js -b safari"


## RUNNING TESTS

### TO RUN THE TEST
protractor protractor.conf.js -w upwork -b <browser> --params.key <key> --specs testCases/startPage/test.js
