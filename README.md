# Rates API

## Description

This API integrates with the Angular frontend, which can be located in the sub-folder `/rates-ui`.

This API runs on `http://localhost:3000` and serves the endpoint `/rates/today` which represents a data model of currencies and their respective rates at different times of the day (for this demo time is stuck at the 5th of May 2018).

The requirements are based on https://github.com/DigitalContentDeveloper/challenge1

## Installation

This app is designed to be run with Node.js version `10.16.0` or later.

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
