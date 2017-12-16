// TODO: Can we make sure to import the system fonts? when running the
// test?e.g., https://www.npmjs.com/package/system-fonts
// https://github.com/GoogleChrome/puppeteer/issues/422

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio')
const htmllint = require('htmllint');

const {toMatchImageSnapshot} = require('jest-image-snapshot');

//load the HTML file, since we're gonna need it.
const baseDir = 'file://' + __dirname + '/';
const html = fs.readFileSync(__dirname + '/index.html', 'utf-8');

describe('Source code is valid', () => {
    test('HTML validates without errors', async() => {
        const lintOpts = {
            'attr-bans': [
                'align',
                'background',
                'bgcolor',
                'border',
                'frameborder',
                'marginwidth',
                'marginheight',
                'scrolling',
                'style',
                'width',
                'height'
            ], //adding height, allow longdesc
            'tag-bans': [
                'style', 'b'
            ], //<i> allowed for font-awesome
            'doctype-first': true,
            'doctype-html5': true,
            'html-req-lang': true,
            'line-end-style': false, //either way
            'indent-style': false, //can mix/match
            'indent-width': false, //don't need to beautify
            'class-style': 'none', //I like dashes in classnames
            'img-req-alt': false, //for this test; captured later!
        }

        let htmlValidityObj = await htmllint(html, lintOpts);
        expect(htmlValidityObj).htmlLintResultsContainsNoErrors();
    })
});

describe('Utilizes the Bootstrap CSS framework', () => {

    test('HTML links only the Bootstrap stylesheet', () => {
        const $ = cheerio.load(html);
        let links = $('link');
        expect(links.length).toBe(1); //only one CSS tag

        let href = links[0].attribs['href'];
        expect(href).toMatch(/bootstrap\.(min\.)?css$/)
    });
});

describe('Produces the expected visual output', () => {
    const puppeteer = require('puppeteer'); //use puppeteer for screencaptures
    let browser,
        page;

    beforeAll(async() => {
        //launch chrome headless, navigate to page
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.goto(baseDir + '/index.html'); //literally load the file
    });

    test('on extra-small width screens', async() => {
        await page.setViewport({
            width: 500,
            height: 1000
        });

        //whole page for basics
        let capture = await page.screenshot();
        expect(capture).toMatchImageSnapshot({
            customDiffConfig: {
                threshold: 0.001 //very small threshold
            }
        });
    }, 10000)

    test('on small width screens', async() => {
        await page.setViewport({
            width: 600,
            height: 800
        });

        //whole page to check header container
        let capture = await page.screenshot();
        expect(capture).toMatchImageSnapshot({
            customDiffConfig: {
                threshold: 0.001 //very small threshold
            }
        });
    }, 10000)

    test('on medium/large width screens', async() => {
        await page.setViewport({
            width: 800,
            height: 850
        });

        //cards only
        let capture = await page.screenshot({
            clip: {
                x: 0,
                y: 250,
                width: 800,
                height: 815 - 250
            }
        });
        expect(capture).toMatchImageSnapshot({
            customDiffConfig: {
                threshold: 0.001 //very small threshold
            }
        });
    }, 10000)

    test('on extra-large width screens', async() => {
        await page.setViewport({
            width: 1200,
            height: 650
        });

        //cards only
        let capture = await page.screenshot({
            clip: {
                x: 0,
                y: 250,
                width: 1200,
                height: 615 - 250
            }
        });
        expect(capture).toMatchImageSnapshot({
            customDiffConfig: {
                threshold: 0.001 //very small threshold
            }
        });
    }, 10000)

    afterAll(async() => {
        //close chrome headless
        browser.close();
    });
})

//Custom code validation matchers (for error output)
expect.extend({
    //image matching
    toMatchImageSnapshot,

    //using htmllint
    htmlLintResultsContainsNoErrors(validityObj) {
        const pass = validityObj.length === 0;
        if (pass) {
            return {
                pass: true,
                message: () => "expected html to contain validity errors"
            };
        } else {
            return {
                pass: false,
                message: () => (
                // loop through and build the result string these error messages could be more
                // detailed; maybe do manually later
                validityObj.reduce((out, msg) => {
                    return out + `Error: '${msg.rule}' at line ${msg.line}, column ${msg.column}.\n`
                }, ''))
            };
        }
    },

    //using stylelint errors
    cssLintResultsContainsNoErrors(validityObj) {
        const pass = validityObj.errored === false;
        if (pass) {
            return {
                pass: true,
                message: () => "expected CSS to contain validity errors"
            };
        } else {
            return {
                pass: false,
                message: () => (
                //loop through and build the result string
                JSON.parse(validityObj.output)[0].warnings.reduce((out, msg) => {
                    return out + `${msg.severity}: ${msg.text}\n       At line ${msg.line}, column ${msg.column}.\n`
                }, ''))
            };
        }
    }
});