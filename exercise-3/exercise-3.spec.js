const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio')
const htmllint = require('htmllint');
const stylelint = require('stylelint');
const inlineCss = require('inline-css'); //for css testing
const css = require('css');
const md5 = require('md5');

//load the HTML file, since we're gonna need it.
const html = fs.readFileSync(__dirname + '/index.html', 'utf-8');

// load the css file to parse
const cssFile = fs.readFileSync(__dirname + '/css/style.css', 'utf-8');
let options = {}
let cssObj = css.parse(cssFile, options);
describe('Source code is valid', () => {
    test('CSS validates without errors', async() => {
        let cssValidityObj = await stylelint.lint({
            files: __dirname + 'css/style.css'
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


describe('2. The default mobile-first styles are properly applied', () => {
	// Inline the stylesheet
    beforeAll( () => {
        let options = {
        	extraCss:cssFile, 
        	url:'file://'+__dirname + '/'
        }
        return inlineCss(html, options)
        		.then(function(htmlStyled) { 
    	    	$ = cheerio.load(htmlStyled);        	
        	}).catch(function(err) {
	        	console.log(err)
        });
    })

	test("Body has proper styles", () => {
		let body = $('body');
		expect(body.css('background-color')).toEqual('#93b8d7')
		expect(body.css('margin')).toEqual('.5rem')
		expect(body.css('color')).toEqual('white')
	})
	
	test("Nav links have proper styles", () => {
		let navLinks = $('nav a');
		navLinks.each((index, link) => {
			expect($(link).css('color')).toEqual('white')
			expect($(link).css('font-size')).toEqual('2.5rem')
			expect($(link).css('margin-right')).toEqual('.5em')
		})
	})
	
	test("Social links are hidden", () => {
		let socialLinks = $('#social-links')
		expect(socialLinks.css('display')).toEqual('none')
	})
	
	test("Main content is properly styled", () => {
		let main = $('main')
		expect(main.css('text-align')).toEqual('center')
		expect(main.css('font-family')).toEqual("'Kaushan Script', fantasy")
		expect(main.css('margin-top')).toEqual("23vh")
	})
	
	test("Footer is hidden", () => {
		let footer = $('footer')
		expect(footer.css('display')).toEqual('none')
	})
})

describe("3. Media queries for small sized screens (598px or greater)", () => {
	let mediaRules = cssObj.stylesheet.rules.filter((d) => d.type === 'media' && d.media.indexOf("(min-width: 586px)") !== -1)[0].rules
	test('Media rules are present', () => {
		expect(mediaRules.length).toEqual(2)
	})
	
	let hamburgerRules = mediaRules.filter((d) => d.selectors.indexOf('#hamburger-menu') !== -1)[0];
	let socialRules = mediaRules.filter((d) => d.selectors.indexOf('#social-links') !== -1)[0];

	test('Hamburger menu is set to display none', () => {
		expect(hamburgerRules.declarations[0].property).toEqual("display")
		expect(hamburgerRules.declarations[0].value).toEqual("none")
	})

	test('Social media display is set to block', () => {
		expect(socialRules.declarations[0].property).toEqual("display")
		expect(socialRules.declarations[0].value).toEqual("block")
	})

})


describe("4. Media queries for medium sized screens (768px or greater)", () => {
	let mediaRules = cssObj.stylesheet.rules.filter((d) => d.type === 'media' && d.media.indexOf("(min-width: 768px)") !== -1)[0].rules
	test('Media rules are present', () => {
		expect(mediaRules.length).toEqual(3)
	})
	let bodyRules = mediaRules.filter((d) => d.selectors.indexOf('body') !== -1)[0];
	test('Body background image is set', () => {
		let backgroundImageRule = bodyRules.declarations.filter((d) => d.property ==='background-image')[0]
		expect(backgroundImageRule.property).toEqual('background-image')
		expect(backgroundImageRule.value).toEqual("url('../img/splash-md.jpg')")
		
		let backgroundCoverRule = bodyRules.declarations.filter((d) => d.property ==='background-size')[0]
		expect(backgroundCoverRule.property).toEqual('background-size')
		expect(backgroundCoverRule.value).toEqual("cover")
		
		let backgroundPositionRule = bodyRules.declarations.filter((d) => d.property ==='background-position')[0]
		expect(backgroundPositionRule.property).toEqual('background-position')
		expect(backgroundPositionRule.value).toEqual("center")
	 })
	
	test('Footer is displayed (block)', () => {
		let footerRules = mediaRules.filter((d) => d.selectors.indexOf('footer') !== -1)[0];
	 	expect(footerRules.declarations[0].value).toEqual('block')
	 })
	 
	test('Text shadow is added to `main` element', () => {
		let mainRules = mediaRules.filter((d) => d.selectors.indexOf('main') !== -1)[0];
	 	expect(mainRules.declarations[0].value).toEqual('1px 1px #153C43')
	 })
})

describe("5. Media queries for large sized screens (992px or greater)", () => {
	let mediaRules = cssObj.stylesheet.rules.filter((d) => d.type === 'media' && d.media.indexOf("(min-width: 992px)") !== -1)[0].rules
	test('Media rules are present', () => {
		expect(mediaRules.length).toEqual(4)
	})

	// Background image
	test('Background image is updated', () => {
		let bodyRules = mediaRules.filter((d) => d.selectors.indexOf('body') !== -1)[0];
		let backgroundImageRule = bodyRules.declarations.filter((d) => d.property ==='background-image')[0]
		expect(backgroundImageRule.property).toEqual('background-image')
		expect(backgroundImageRule.value).toEqual("url('../img/splash-lg.jpg')")	
	})

	
	// h1 elements
	test('Top level header is updated', () => {
		let headerRule = mediaRules.filter((d) => d.selectors.indexOf('h1') !== -1)[0]
		expect(headerRule.declarations[0].property).toEqual('font-size')
		expect(headerRule.declarations[0].value).toEqual('5rem')	
	})
	
	// h2 elements
	test('Second level header is updated', () => {
		let secondHeaderRule = mediaRules.filter((d) => d.selectors.indexOf('h2') !== -1)[0]
		expect(secondHeaderRule.declarations[0].property).toEqual('font-size')
		expect(secondHeaderRule.declarations[0].value).toEqual('3rem')	
	})
		
	// nav links
	test('Nav links sizes are updated', () => {	
		let navRule = mediaRules.filter((d) => d.selectors.indexOf('nav a') !== -1)[0]
		expect(navRule.declarations[0].property).toEqual('font-size')
		expect(navRule.declarations[0].value).toEqual('1.5rem')	
	})
})

describe("6. Media queries for extra-large sized screens (1200px or greater)", () => {
	let mediaRules = cssObj.stylesheet.rules.filter((d) => d.type === 'media' && d.media.indexOf("(min-width: 1200px)") !== -1)[0].rules	
	// Background image
	test('Background image is updated', () => {
		let bodyRules = mediaRules.filter((d) => d.selectors.indexOf('body') !== -1)[0];
		let backgroundImageRule = bodyRules.declarations.filter((d) => d.property ==='background-image')[0]
		expect(backgroundImageRule.property).toEqual('background-image')
		expect(backgroundImageRule.value).toEqual("url('../img/splash-xl.jpg')")	
	})
})


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