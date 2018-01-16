const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio')
const htmllint = require('htmllint');
const stylelint = require('stylelint');
const inlineCss = require('inline-css'); //for css testing
const css = require('css');

//load the HTML file, since we're gonna need it.
const html = fs.readFileSync(__dirname + '/index.html', 'utf-8');

// load the css file to parse
const cssFile = fs.readFileSync(__dirname + '/css/style.css', 'utf-8');
let options = {}
let cssObj = css.parse(cssFile, options);


describe('Testing CSS', () => {
    let $; //cheerio instance

    // Inline the stylesheet
    beforeAll(() => {
        let options = {
            extraCss: cssFile,
            url: 'file://' + __dirname + '/'
        }
        return inlineCss(html, options)
            .then(function(htmlStyled) {
                $ = cheerio.load(htmlStyled);
            }).catch(function(err) {
            console.log(err)
        });
    })
    test('1. Box-sizing is set to border-box', () => {
        let body = $('body');
        expect(body.css('box-sizing')).toEqual('border-box');

    })

    test('2. Spacing set around main element', () => {
        let main = $('main');
        expect(main.css('width')).toEqual('80%');
        expect(main.css('margin-left')).toEqual('auto');
        expect(main.css('margin-right')).toEqual('auto');
        expect(main.css('margin-top')).toEqual('5em');

    })

    test('3. Set appropriate colors, fonts, and sizes:', () => {
        let body = $('body');
        let h1 = $("h1")
        expect(body.css('color')).toEqual('#535353');
        expect(h1.css('color')).toEqual('#4b2e83');
        expect(h1.css('font-size')).toEqual('2.5rem');
        expect(body.css('font-family')).toMatch('Open Sans');

    })

    test("4. Style nav bar", () => {
        let nav = $('nav')
        expect(nav.css('position')).toEqual('fixed')
        expect(nav.css('background-color')).toEqual('#4b2e83')
        expect(nav.css('padding')).toEqual('.75rem')
    })

    test("5. Style nav bar links", () => {
        let links = $('nav a')
        expect(links.css('color')).toEqual('white')
        expect(links.css('text-decoration')).toEqual('none')
    })

    test("6. Display list items", () => {
        let lis = $('nav li')
        expect(lis.css('display')).toEqual('inline')
        expect(lis.css('padding')).toEqual('1rem')
        let ul = $('nav ul')
        expect(ul.css('margin')).toEqual("0px")
        expect(ul.css('padding-top')).toEqual('.5rem')
    })

    test("7. Display search box", () => {
        let search = $('div.searchBox')
        expect(search.css('float')).toEqual('right')
        let searchInput = $('div.searchBox input')
        expect(searchInput.css('font-size')).toEqual('1rem')
        expect(searchInput.css('padding')).toEqual('.5rem')
    })

    test("8. Font awesome icon styles", () => {
        let fa = $('.fa')
        expect(fa.css('font-size')).toEqual("1.5rem")
        expect(fa.css('padding')).toEqual(".3rem")
        expect(fa.attr('aria-label')).toMatch("search")
    })

    test("9. Test hover effects", () => {
        let hoverRule = cssObj.stylesheet.rules.filter((d) => d.type === "rule" && d.selectors.join().indexOf("a:hover") !== -1);
        let focusRule = cssObj.stylesheet.rules.filter((d) => d.type === "rule" && d.selectors.join().indexOf("a:focus") !== -1);
        let colorRule = hoverRule[0].declarations.filter((d) => d.property === "color")[0]
        let borderRule = hoverRule[0].declarations.filter((d) => d.property === "border-bottom")[0]
        expect(hoverRule.length).toBeGreaterThan(0)
        expect(focusRule.length).toBeGreaterThan(0)
        expect(colorRule.value).toEqual('#b7a57a')
        expect(borderRule.value).toEqual('.6rem solid #b7a57a')
    })

    test("10. Add and style logo", () => {
        let img = $('.logo')
        expect(img.css('background-image')).toEqual("url('../img/ischool-symbol-white.png')")
        expect(img.css('padding')).toEqual('0 1em')
        expect(img.css('background-size')).toEqual('contain')
        expect(img.css('background-repeat')).toEqual('no-repeat')
        expect(img.css('background-position')).toEqual('left')

    })

})
describe('Source code is valid', () => {
    test('HTML validates without errors', async () => {
        const lintOpts = {
            'attr-bans': ['align', 'background', 'bgcolor', 'border', 'frameborder', 'marginwidth', 'marginheight', 'scrolling', 'style', 'width', 'height'], //adding height, allow longdesc
            'tag-bans': ['style', 'b'], //<i> allowed for font-awesome
            'doctype-first': true,
            'doctype-html5': true,
            'html-req-lang': true,
            'line-end-style': false, //either way
            'indent-style': 'nonmixed', // need to choose
            'indent-width': 4, //do need to beautify
            'class-style': 'none', //I like dashes in classnames
            'img-req-alt': false, //for this test; captured later!
        }

        let htmlValidityObj = await htmllint(html, lintOpts);
        expect(htmlValidityObj).htmlLintResultsContainsNoErrors();
    })

    test('CSS validates without errors', async () => {
        let cssValidityObj = await stylelint.lint({
            files: __dirname + 'css/style.css'
        });
        expect(cssValidityObj).cssLintResultsContainsNoErrors();
    })
});



//Custom code validation matchers (for error output)
expect.extend({
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
                //loop through and build the result string
                //these error messages could be more detailed; maybe do manually later
                validityObj.reduce((out, msg) => {
                    return out + `Error: '${msg.rule}' at line ${msg.line}, column ${msg.column}.\n`
                }, '')
                )
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
                }, '')
                )
            };
        }
    }
});