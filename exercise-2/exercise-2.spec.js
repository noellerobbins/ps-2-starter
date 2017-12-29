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

describe('Source code is valid', () => {
    test('HTML validates without errors', async() => {
        const lintOpts = {
            'attr-bans': ['align', 'background', 'bgcolor', 'border', 'frameborder', 'marginwidth', 'marginheight', 'scrolling', 'style', 'width', 'height'], //adding height, allow longdesc
            'tag-bans': ['style', 'b'], //<i> allowed for font-awesome
            'doctype-first': true,
            'doctype-html5': true,
            'html-req-lang': true,
            'line-end-style': false, //either way
            'indent-style': "nonmixed", //can mix/match
            'indent-width': 4, //don't need to beautify            
            'id-class-style': false, //I like dashes in id names
            'img-req-alt': false, //for this test; captured later!
        }

        let htmlValidityObj = await htmllint(html, lintOpts);
        expect(htmlValidityObj).htmlLintResultsContainsNoErrors();
    })

    test('CSS validates without errors', async() => {
        let cssValidityObj = await stylelint.lint({
            files: __dirname + 'css/style.css'
        });
        expect(cssValidityObj).cssLintResultsContainsNoErrors();
    })
});

describe('Testing exercise implementation', () => {
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
	test('1a. Create a parent div with class "container"', () => {
		let container = $('.container');
		expect(container.css('display')).toEqual('flex');
	})
	test('1b. Sections have appropriate flex behavior', () => {
		let section1 = $('section:first-of-type');
		expect(section1.css('flex-basis')).toEqual('240px');
		let section2 = $('section:nth-of-type(2)');
		expect(section2.css('flex-grow')).toEqual('1');		
		expect(section2.css('background-color')).toEqual('#eee')
		let section3 = $('section:nth-of-type(3)');
		expect(section3.css('flex-basis')).toEqual("180px")
		expect(section3.css('flex-shrink')).toEqual("0")	
		let sections = $("section")
		expect(sections.css('padding')).toEqual("1em")	
	})
	
	test('2. Second section has a flexbox container that contains cards', () => {
		let container = $('section:nth-of-type(2) > div')
		expect(container.css('display')).toEqual('flex')
		expect(container.css('flex-wrap')).toEqual('wrap')
		let cards = $('.card-item')
		cards.each((index, card) => {
			expect($(card).css("flex")).toEqual('0 0 250px')
			expect($(card).css("background-color")).toEqual('white')
			expect($(card).css("margin")).toEqual('.5rem')
		})
	})
	
	test('3. Style the cards', () => {

		let cardContent = $('.card-content')
		cardContent.each((index, content) => {
			expect($(content).css("padding")).toEqual(".5rem 1rem")
		})

		let cards = $('.card-item')		
		
		cards.each((index, card) => {
			expect($(card).css("border-radius")).toEqual('6px')
			expect($(card).css("box-shadow")).toEqual('0 1px 3px rgba(0,0,0,0.16), 0 1px 3px rgba(0,0,0,0.23)')
		})
		
		let imgs = $('.card-item img') 
		imgs.each((index, img) => {
			expect($(img).css('border-radius')).toEqual("6px 6px 0 0")
		})
	})
	
	test('4. Make the `body` into a flexbox', () => {
		let body = $("body")
		let html = $('html')
		let main = $('main')
		expect(body.css('display')).toEqual('flex')
		expect(body.css('flex-direction')).toEqual('column')		
		expect(main.css('flex-grow')).toEqual("1")
		expect(body.css('height')).toEqual("100%")
		expect(html.css('height')).toEqual("100%")
		
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