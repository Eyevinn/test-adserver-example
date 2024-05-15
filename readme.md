This repository contains example on how to automate ad insertion integration tests with Test Adserver hosted by Open Source Cloud.

## Test Examples

Before the tests are executed a Test Adserver instance is launched in Open Source Cloud. This instance is shared for all the tests in the suite. Available test examples are:

The example player used in this test example is available in `player/index.html` and can be started by running `npm run player`. Uses Google IMA SDK for the ad insertion.

### `tests/adtracking.spec.ts`

This test verifies that a player implementation correctly insert ads and that the tracking pixels are fired as expected.

### `tests/adrequest.spec.ts`

This test verifies that the expected ad request parameters is correctly sent by a player implementation.

## Install
```
npm install
npm run test:install
```

## Run Tests

Then run the tests:

```
OSC_ACCESS_TOKEN=<osc-token> npm test
```
