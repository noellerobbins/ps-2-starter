
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio')
const htmllint = require('htmllint');

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
            'indent-style': 'nonmixed', //can mix/match
            'indent-width': 4, 
            'class-style': 'none', //I like dashes in classnames
            'img-req-alt': false, //for this test; captured later!
        }

        let htmlValidityObj = await htmllint(html, lintOpts);
        expect(htmlValidityObj).htmlLintResultsContainsNoErrors();
    })
});

describe('1. Utilizes the Bootstrap CSS framework and includes Viewport', () => {
	let $; //cheerio instance
    beforeAll(() => {
        $ = cheerio.load(html);
    })
    
    test('HTML links only the Bootstrap stylesheet', () => {
        const $ = cheerio.load(html);
        let links = $('link');
        expect(links.length).toBe(1); //only one CSS tag

        let href = links[0].attribs['href'];
        expect(href).toMatch(/bootstrap\.(min\.)?css$/)
    });
    
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

});

describe('2. The `header` and `main` elements have a div with class container that wraps their content', () => {
	let $; //cheerio instance
    beforeAll(() => {
        $ = cheerio.load(html);
    })
    test('Main element has container div', () => {
    	let wrapper = $('main div:first-of-type')
		expect(wrapper.attr("class")).toEqual("container")
    })
    
    test('Header element has container div', () => {
    	let wrapper = $('header div:first-of-type')
		expect(wrapper.attr("class")).toEqual("container")
    })
	
})

describe('3. Stylize header as a jumbotron', () => {
	let $; //cheerio instance
    beforeAll(() => {
        $ = cheerio.load(html);
    });
	test('The `header` element is a jumbotron', () => {
		let header = $("header");
		expect(header.attr('class').indexOf('jumbotron')).not.toEqual(-1)
	})
	test('The `header` element is a _fluid_ jumbotron', () => {
		let header = $("header");
		expect(header.attr('class').indexOf('jumbotron-fluid')).not.toEqual(-1)
	})
	test('Subtitle stands out as a "lead"', () => {
		let subtitle = $("header p");
		expect(subtitle.attr('class').indexOf('lead')).not.toEqual(-1)
	})
	test('Header should be colored with a "dark" background and "white" text.', () => {
		let header = $("header");
		expect(header.attr('class').indexOf('bg-dark')).not.toEqual(-1)
		expect(header.attr('class').indexOf('text-white')).not.toEqual(-1)
	})
})

describe('4. Card are styled as "card" components', () => {
	let $; //cheerio instance
    beforeAll(() => {
        $ = cheerio.load(html);
    });
    
	test('Four cards are present', () => {
		let cards = $('main div.card')
		expect(cards.length).toEqual(4)
	})
	
	test('Cards contain .card-body elements for padding', () => {
		let cardBodies = $('main div.card > div.card-body')
		expect(cardBodies.length).toEqual(4)
	})
	
	test('.card-title and .card-text classes are applied', () => {
		let cardTitles = $('main div.card h2.card-title')
		expect(cardTitles.length).toEqual(4)
		let cardText = $('main div.card p.card-text')
		expect(cardText	.length).toEqual(4)		
	})
	
	test('Links are styles as dark colored buttons', () => {
		let cardLinks = $('main div.card a')
		expect(cardLinks.attr('class').indexOf('btn btn-dark')).not.toEqual(-1)
	})
	
	test('Utility class is used to add spacing below images', () => {
		let cardImgs = $('main div.card img.pb-3')
		expect(cardImgs.length).toEqual(4)
	})
	
	test('Utility class is used to add spacing below card elements', () => {
		let cards = $('main div.card.mb-4')
		expect(cards.length).toEqual(4)
	})
})

describe('5. Cards are organized into proper grids (2 X 2, 4 X 1)', () => {
	let $; //cheerio instance
    beforeAll(() => {
        $ = cheerio.load(html);
    });
    
    test('All cards are wrapped in a `row` element', () => {
    	let row = $("main div > div:first-of-type")
    	expect(row.attr('class')).toEqual('row')
    })
    
    test('On medium+ screens, cards take up 1/2 the screen', () => {
    	let cards = $("main div div.card")
    	cards.each((index, card) => {
    		expect($(card).parent().attr('class').indexOf('col-md-6')).not.toEqual(-1)
    	})
    })
    
    test('On xl+ screens, cards take up 1/4 the screen', () => {
    	let cards = $("main div div.card")
    	cards.each((index, card) => {
    		expect($(card).parent().attr('class').indexOf('col-xl-3')).not.toEqual(-1)
    	})
    })
    
    test('Add utility class to make cards display flex', () => {
    	let cards = $("main div div.card")
    	cards.each((index, card) => {
    		expect($(card).parent().attr('class').indexOf('d-flex')).not.toEqual(-1)
    	})
    })
})

describe('6. Image icon should sit to the left side of the text', () => {
	let $; //cheerio instance
    beforeAll(() => {
        $ = cheerio.load(html);
    });

	test('Added a wrapper with class `row` _inside_ the card-body', () => {
		let rows = $('main div.card div.card-body > div.row')
		expect(rows.length).toEqual(4)
	})
	
	test('Added a column wrapper with desired class around the `img` element', () => {
		let imgs = $('img')
		imgs.each((index, img) => {
			expect($(img).parent().attr('class')).toEqual('col-sm-auto')
		})
	})

	test('Added a column wrapper with desired class around the other card content', () => {
		let headers = $('div.card h2')
		headers.each((index, header) => {
			expect($(header).parent().attr('class')).toEqual('col-sm')
		})
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