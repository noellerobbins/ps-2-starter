# Problem Set 2

In this problem set, you will design and build mobile-first web pages and practice using a CSS framework.

To complete this problem set, follow the instructions in the `README.md` file for each problem. Note, this problem set uses **screenshot matching** for testing -- see instructions below.

## Checking Your Work
This problem set comes with a suite of _unit tests_ that you can use to check your work and understanding. Tests are **not** guaranteed to be comprehensive.

In order to run these tests, you will need to have the [Jest](https://facebook.github.io/jest/) test runner installed **globally**. You will also need to install the test dependencies listed in the `package.json` file. You'll also need to install the `puppeteer` package that will enable the taking and matching of screenshots:

```bash
npm install -g puppeteer # install globally, once on your machine
npm link puppeteer # link to this folder
npm link jest # because it's installed globally
npm install # install local packages for unit testing
```

You can run these tests by using the `jest` command from the repo's root directory, specifying the problem to test as an argument:

```bash
# run tests for exercise-1
jest exercise-1

# run tests for all exercises
jest
```
