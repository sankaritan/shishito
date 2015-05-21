# Shishito

Shishito is module for web application and browser extension integration testing with Selenium Webdriver & Python.
It runs tests using included libraries and generates nice test results output.

## Features

* runs python Selenium Webdriver tests via PyTest
* easy configuration for local and remote (BrowserStack, Appium, ..) test execution
* contains useful test libraries
* generates HTML test results report (with screenshots for failed tests)
* designed to be used as a module (by multiple projects if needed)

## Pre-requisities

Install Python moodules from requirements.txt

```pip install -r requirements.txt```

Webdriver drivers need to be setup (ChromeDriver, InternetExplorerDriver etc.)

## Quick Start

1. clone Shishito repository.
```git clone git@github.com:salsita/shishito.git```
1. add *shishito* directory into PYTHONPATH environment variable
1. clone sample test project repository https://github.com/salsita/shishito-sample-project
```git clone git@github.com:salsita/shishito-sample-project.git```
1. if you want to use BrowserStack for running your tests, replace "bs_username", "bs_password" values with your credentials in ***shishito-sample-project/config/server_config.properties***
 or pass it to runner python file as command line argument using flag --browserstack username:token
1. if you want to use Saucelabs for running your tests, add your credentials to saucelebas variable in ***shishito-sample-project/config/server_config.properties***
 or pass it to runner python file as command line argument using flag --saucelabs username:token
1. set your preferred browser settings in ***shishito-sample-project/config/web/(browserstack|local).properties*** or for mobile apps in ***shishito-sample-project/config/mobile/appium.properties***
1. run *google_test_runner.py* in sample project folder!

If you use local driver, you should now observe browser being started and tests running.
There are information about progress shown in console output.
Once testing is finished, HTML report can be found in:
```
shishito-sample-project/results folder # HTML report
shishito-sample-project/results_archive folder # zipped HTML report
```

## Continuous Integration

Using Shishito with Continuous Integration solution, such as Jenkins, is easy!
All you need to do is clone Shishito repo and add it into the PYTHONPATH.

Example script below (Jenkins "execute shell" build step):
```bash
#!/bin/bash
######################
# clone Shishito  #
######################

cd $WORKSPACE
git clone git@github.com:salsita/shishito.git

######################
# VARIABLES          #
######################

export PYTHONPATH=${PYTHONPATH}:/$WORKSPACE/shishito

######################
# SCRIPT             #
######################

python google_test_runner.py
```

## Command line options

```python
--platform web         # define platform on which run tests (currently supported: web, mobile, generic)
--environmnet local    # define environment in which run tests (currently supported: local, browserstack, appium)
--test_directory tests # define directory where to lookup for tests (project_root + test_directory)

# supported platform/environment combinations:
#   generic/local
#   web/local
#   web/browserstack
#   mobile/appium (can run on local/remote appium server or on saucelabs)

--smoke # runs only tests with fixture "@pytest.mark.smoke"

--browserstack testuser1:p84asd21d15asd454 # authenticate on BrowserStack using user "testuser1" and token "p84asd21d15asd454"
--saucelabs testuser1:p84asd21d15asd454 # authenticate on Saucelabs using user "testuser1" and token "p84asd21d15asd454"

```

If no arguments are specified, Shishito, by default, searches for settings combinations in (server|local).properties files and runs tests according to them.

## Configuration

***server_config.properties***

* default configuration file with test variables
* changes to variables should be maintained in VCS; so that configuration can be reused for automated test execution

```
# modules
test_platform=web
test_environment=local

# test dir
test_directory=tests

# General
base_url=http://www.google.com
environment_configuration=Chrome
```

* *test_platform* - on which platform run tests (web, mobile)
* *test_environment* - in which environment run tests (local, browserstack, appium)
* *test_directory* - in which directory lookup for tests
* *base_url* - url that will be loaded by default upon start of each test
* *environment_configuration* - which configuration use from <environment>.properties file (used when tests are run without runner)

***local_config.properties***

* if variable *local_execution=True*, script will look first search local config for test variables
* in case variables are not found, it will fall back to values in default *server_config.properties*
* changes to this file should **not** be maintained in VCS (they serve only for local test execution)

***\<platform\>/\<environment\>.properties***

* contains combinations, for which the tests should be executed
* e.g. browser and resolution for local web browser

***conftest.py***

* helper file that defines command line arguments, provides fixtures and other information for Shishito runner
