# Rates UI

## Description

This Angular app displays currency trade data for the current day, based off querying an API.

The API is expected to run on `http://localhost:3000` and uses the `/rates/today` endpoint to retrieve todays' daily currency rates (for this demo time is stuck at the 5th of May 2018).

The requirements are based on https://github.com/DigitalContentDeveloper/challenge1

## Installation
This app is designed to be run with Node.js version `10.16.0` or later.

Run `npm install` to install all required dependencies.

## How to run

Run `ng serve` for a dev server. Navigate to `http://localhost:4200`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).  You must be running the API for this to pass.

## TODO
* Externalise config of API URLs (in RatesService)
* Consider moving profit calculation logic to backend
* Proxy API through same domain/url/port and disable CORS in API
