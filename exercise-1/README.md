# Exercise 1

In this exercise, you'll practice working with CSS properties and layouts. 

To complete the exercise, you will need to add rules to the included `css/style.css` file in order to style the included `index.html` so that it has a stylish navigation bar:

![Example of completed exercise](img/sample.gif)


Instructions for achieving this appearance are detailed below. Note that you will need to edit both the CSS _and_ the HTML.

1. The first thing you should do is set your page's [`box-sizing`](https://info343.github.io/css-layouts.html#box-sizing) to be `border-box`. This will help with calculating measurements of the rest of the changes.

2. You'll want to add some space around the content in your `<main>` element. To do this, you'll want to:

    - Set the margin left and right to "auto"
    - Set the `width` to **80%**.
    - To make sure the content sits below the fixed navbar, give the `main` element a top margin of **5em**.

3. Add rules to give the page's content appropriate colors, fonts, and sizes:

    - The body text should be colored `#535353`, while the headers (`h1` and `h2`) should use [UW puple](https://www.washington.edu/brand/graphic-elements/primary-color-palette/).
    - You'll want to set the **font family** for your _headers_ and _body_ based on the UW fonts that are listed [here](https://www.washington.edu/brand/graphic-elements/font-download/). Find the names of the fonts you want to include, and then use the `@import` method to link the appropriate fonts from Google fonts. for "Primary Headlines" and the "Body". You should access these fonts via a `<link>` to the [Google Fonts](https://fonts.google.com/) collection (be sure and get the correct **font-weight** for headers!).
    - Additionally, make the top-level header have a `font-size` of 2.5x the _root element's size_.

4. The navigation bar should be `fixed` to the top-left of the screen, and span `100%` of the page. 

    - The navbar should also have a background color of UW Purple.
    - Add `.75rem` of space between the navbar and its content (on _all sides_, so the links aren't flush with the window)

5. Now that you've colored the navbar, style the links so they show up. The links in the navbar should be colored `white` and _not_ be [underlined](https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration).

6. Change the display of each list item so they are `inline`
 
    - Also add `1rem` of space between each item in the list. The list container (i.e., `ul`) should have `0` extra spacing (margin _or_ padding), except for `.5rem` of padding at the top. 

7. The "search box" and its button should `float` to the right of the page. (Notice that there is a `<div>` that groups these items together for styling!)

    - You'll need to make the the list of links an `inline-block` element so that the search bar and links appear on the same line.

    - The input box should have a `font-size` of `1rem` and `.5rem` of space between the text and (all of) the box edges.

8. The search button should show a magnifying glass icon instead of the word "Search". You should replace the text with a [Font Awesome icon](http://fontawesome.io/icon/search/).
    - First, you'll need to include the font-awesome library via CDN in your `index.html` file
    - Then, add the icon in the appropriate location that you want to display it
    - The icon should have a font-size of `1.5rem` and `.3rem` of padding. You should also [flip the fa icon](http://fontawesome.io/examples/#rotated-flipped) so it faces the right way.
        To make the button and the text input line up, you can make the text input [`bottom` aligned](https://developer.mozilla.org/en-US/docs/Web/CSS/vertical-align).
    - Remember that purely-visual elements also need to be perceivable to screen readers! Give the button an `aria-label` attribute so that it will be properly read.
    - 

9. Add an effect to the links so that when the user hovers over them (or otherwise gives them `focus` or makes them `active`), they change color to `#b7a57a` and gain a thick (`.6rem`) underline of the same color in the form of a bottom border.

    - You'll need to add some space (`.65rem`) between the link text and its border to make the underline line up with the bottom of the nav bar. Note that measure is browser-dependent.

10. No navbar is complete without a logo, so add the iSchool logo (`img/ischool-symbol-white.png`) inside of your `ul` in your navigation bar. But since adding this as an `<img>` tag will make things difficult to style, you should instead include the logo as part of a _background image_.

    - First, add a `<span>` (an empty inline element) directly before the word "Informatics". This `<span>` will have no content except the background image it displays. You can even give it an `aria-hidden` to ensure it isn't accidentally read by a screen reader!

        - You'll need to give it a CSS class of `logo` to style (and test) it.

    - Give the span `1em` of padding on either side of its "content" to give it some width.

		- You should use the shorthand padding syntax that allows you to use a single `padding` declaration that sets `1em` of padding on either side, and `0` padding on the top/bottom.
		
    - Finally, give the span a background-image of `img/ischool-symbol-white.png`. Be sure and specify the `position` of the image (it should be left-aligned), the `size` of the background (it should be _contained_ in the element), and whether it should repeat (it should not).



## Testing
This exercise includes a set of unit tests to help check your work. You can run the test suite using

```bash
# Run from the *parent* directory
jest exercise-1.spec.js
```

Note that not all aspects of the exercise are necessarily included in unit tests.
