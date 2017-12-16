const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio')
const stylelint = require('stylelint');
const md5 = require('md5');

const {toMatchImageSnapshot} = require('jest-image-snapshot');

//load the HTML file, since we're gonna need it.
const baseDir = 'file://' + __dirname + '/';
const html = fs.readFileSync(__dirname + '/index.html', 'utf-8');

describe('Source code is valid', () => {
    test('CSS validates without errors', async() => {
        let cssValidityObj = await stylelint.lint({
            files: 'exercise-1/css/style.css'
        });
        expect(cssValidityObj).cssLintResultsContainsNoErrors();
    })
});

describe('HTML supports responsive design', () => {

    let $; //cheerio instance;
    beforeAll(() => {
        $ = cheerio.load(html);
    })

    test('HTML includes viewport meta', () => {
        let meta = $('meta[name="viewport"]')
        expect(meta.length).toEqual(1); //has the tag

        //width=device-width, initial-scale=1, shrink-to-fit=no
        let contentAttr = meta
            .attr('content')
            .split(',')
            .sort();
        expect(contentAttr[0].trim()).toEqual("initial-scale=1");
        expect(contentAttr[1].trim()).toEqual("shrink-to-fit=no");
        expect(contentAttr[2].trim()).toEqual("width=device-width");
    })

    test('HTML is otherwise unchanged', () => {
        let body = $.html('body');
        let nospace = body.replace(/\s/g, ''); //strip all whitespace to account for
        expect(md5(nospace)).toEqual('0d395348ab89cda9cf71a507865b0188');
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
            width: 480,
            height: 800
        });

        //navigation
        let capture = await page.screenshot({
            clip: {
                x: 0,
                y: 0,
                width: 480,
                height: 125
            }
        });
        expect(capture).toMatchImageSnapshot({
            customDiffConfig: {
                threshold: 0.001 //very small threshold
            }
        });

        //content
        capture = await page.screenshot({
            clip: {
                x: 0,
                y: 200,
                width: 480,
                height: 300
            }
        });
        expect(capture).toMatchImageSnapshot({
            customDiffConfig: {
                threshold: 0.001 //very small threshold
            }
        });

        //footer (x: -150, y:-50)
        capture = await page.screenshot({
            clip: {
                x: 480 - 150,
                y: 800 - 50,
                width: 150,
                height: 50
            }
        });
        expect(capture).toMatchImageSnapshot({
            customDiffConfig: {
                threshold: 0.01 //very small threshold
            }
        });
    }, 10000)

    test('on small width screens', async() => {
        await page.setViewport({
            width: 600,
            height: 400
        });

        //navigation
        let capture = await page.screenshot({
            clip: {
                x: 0,
                y: 0,
                width: 250,
                height: 75
            }
        });
        expect(capture).toMatchImageSnapshot({
            customDiffConfig: {
                threshold: 0.001 //very small threshold
            }
        });
    }, 10000)

    test('on medium width screens', async() => {
        await page.setViewport({
            width: 800,
            height: 480
        });

        //navigation
        let capture = await page.screenshot({
            clip: {
                x: 0,
                y: 0,
                width: 300,
                height: 75
            }
        });
        expect(capture).toMatchImageSnapshot({
            customDiffConfig: {
                threshold: 0.001 //very small threshold
            }
        });

        //content
        capture = await page.screenshot({
            clip: {
                x: 100,
                y: 150,
                width: 600,
                height: 200
            }
        });
        expect(capture).toMatchImageSnapshot({
            customDiffConfig: {
                threshold: 0.001 //very small threshold
            }
        });

        //footer (x: -150, y:-50)
        capture = await page.screenshot({
            clip: {
                x: 800 - 150,
                y: 480 - 50,
                width: 150,
                height: 50
            }
        });
        expect(capture).toMatchImageSnapshot({
            customDiffConfig: {
                threshold: 0.1 //very small threshold
            }
        });
    }, 10000)

    test('on large width screens', async() => {
        await page.setViewport({
            width: 1000,
            height: 768
        });

        //navigation
        let capture = await page.screenshot({
            clip: {
                x: 0,
                y: 0,
                width: 150,
                height: 75
            }
        });
        expect(capture).toMatchImageSnapshot({
            customDiffConfig: {
                threshold: 0.001 //very small threshold
            }
        });

        //content
        capture = await page.screenshot({
            clip: {
                x: 125,
                y: 200,
                width: 800,
                height: 275
            }
        });
        expect(capture).toMatchImageSnapshot({
            customDiffConfig: {
                threshold: 0.001 //very small threshold
            }
        });

        //footer (x: -150, y:-50)
        capture = await page.screenshot({
            clip: {
                x: 1000 - 150,
                y: 768 - 50,
                width: 150,
                height: 50
            }
        });
        expect(capture).toMatchImageSnapshot({
            customDiffConfig: {
                threshold: 0.1 //very small threshold
            }
        });
    }, 10000)

    test('on very large width screens', async() => {
        await page.setViewport({
            width: 1100,
            height: 768
        });

        //navigation
        let capture = await page.screenshot({
            clip: {
                x: 0,
                y: 0,
                width: 150,
                height: 75
            }
        });
        expect(capture).toMatchImageSnapshot({
            customDiffConfig: {
                threshold: 0.001 //very small threshold
            }
        });

        //content
        capture = await page.screenshot({
            clip: {
                x: 125,
                y: 200,
                width: 800,
                height: 275
            }
        });
        expect(capture).toMatchImageSnapshot({
            customDiffConfig: {
                threshold: 0.001 //very small threshold
            }
        });

        //footer (x: -150, y:-50)
        capture = await page.screenshot({
            clip: {
                x: 1100 - 150,
                y: 768 - 50,
                width: 150,
                height: 50
            }
        });
        expect(capture).toMatchImageSnapshot({
            customDiffConfig: {
                threshold: 0.1 //very small threshold
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