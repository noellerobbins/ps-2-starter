# Exercise 3

In this exercise, you'll practice using **media queries** to create reponsive web pages. Note, the test suite parses your CSS files, so you'll have to use the specified classnames/property names (even though there are many possible implementations of the desired behavior). 


To complete the exercise, you will need to add rules to the included `css/style.css` file in order to style the `index.html` file so that it has has the following responsive appearance:

- On extra-small screens (less than `598px` in width):

    ![Example of completed exercise on extra-small screen](img/example-xs-preview.png)

- On small screens (more than `598px` in width):

    ![Example of completed exercise on small screen](img/example-sm-preview.png)

- On medium screens (more than `768px` in width):

    ![Example of completed exercise on medium screen](img/example-md-preview.png)

- On large screens (more than `992px` in width):

    ![Example of completed exercise on large screen](img/example-lg-preview.png)

Instructions for achieving this appearance are detailed below:

1. To make sure the responsive styling is specified by you and not the browser, add a [viewport meta tag](https://info343.github.io/responsive-css.html#specifying-viewport) to the HTML's `<head>` section.

    Note that this is the **only** change you should make to the `.html` file for this exercise.

2. Following a mobile-first approach, the "default" styling will be for extra-small screens.

    - The `body` should have `.5rem` of space _around_ its content. The background should be a nice blue (`#93b8d7`), and the text color should be `white`.

    - The all **links** inside of the `nav` element should be `white` and increased in size to `2.5rem`. Add `.5em` of margin-right to each one. (the space is measured in `em` so it wil adjust with the icon sizes!).

    - Additionally, the "social media" links should **not** be shown at this screen size. _Hint_: use the `display` property on the `social-links` element.
    
    - The page's `main` content should have it's text aligned to the _center_. It should use the included `Kaushan Script` font family, with a fallback to the generic `fantasy` family if that isn't available (on my computer, this default is [Papyrus](https://www.fastcodesign.com/3055865/meet-the-man-who-created-papyrus-the-worlds-other-most-hated-font). You're welcome.)
        
	- The main content should also have have a margin above it equal to `23` percent of the [viewport height](https://developer.mozilla.org/en-US/docs/Web/CSS/length#Viewport-percentage_lengths). This is an example of using CSS units to allow the the text to stay more or less vertically centered as the device size changes. Note that a Flexbox would be a more robust approach to centering content vertically.

	- The first line (top-level heading) should have a font-size of `4rem`, and the second line should have a font-size of `2rem`. The second line should have a `2em` margin above it.
    
    - The footer (an image credit) should **not** be displayed, since there is no image!

All of the following test should now pass:

> _2. The default mobile-first styles are properly applied_

3. Add a _media query_ so that the styling changes on devices with a screen width of **`598px` or greater**. You can test your changes by resizing the browser window or using the [device toolbar](https://developers.google.com/web/tools/chrome-devtools/device-mode/emulate-mobile-viewports) in the Chrome developer tools.

    - At this size, the "hamburger menu" icon should disappear, and the social media links should be shown instead. _Hint:_ again, use the `display` property (and set it to `block`)!

The following tests should now all pass:

> _3. Media queries for small sized screens (598px or greater)"_

4. Add another _media query_ so that the styling changes on devices with a screen width of **`768px` or greater**.

    - At this size, the body's background should change to an image (`splash-md.jpg` found in the `img/` folder). The image should be positioned in the `center` and `cover` the background.

    - Because there is now an image, you should also display the image credit (the footer) at this size.

    - The background image can make the text a little hard to read. Improve this by adding a [text-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/text-shadow) to your `main` element. The shadow should have `1px` offset in each direction, and be colored a very dark blue `#153c43`.

The following test should now pass:

> _4. Media queries for medium sized screens (768px or greater)_    

5. Add another _media query_ so that on large devices (screen width **`992px` or greater**), the styling changes yet again:

    - The background image should increase in resolution to support the larger area (use `splash-lg.jpg` in the `img/` folder).

    - On large desktops like this size, users generally have a mouse so don't need large icons to tap on. Change the navigation links to have a smaller font size of `1.5rem`

    - There is also more space, so you should increase the text size to `5rem` for the first level headers and `3rem` for the second level headers.

The following tests should now pass:

> _5. Media queries for large sized screens (992px or greater)_    

6. Finally, add one more _media query_ for extra-large devices (screen width **`1200px` or greater**).

    - For super-large screens, use a very high resolution background image (`splash-xl.jpg` in the `img/` folder).

The following test should now pass:

> _"6. Media queries for extra-large sized screens (1200px or greater)"_    

## Testing
This exercise includes a test suite to verify that the outputted web page looks as expected. Because the CSS parsing isn't exhaustive, make sure to carefully read the instructions, and examine error messages (there may be some issues with single v.s. double quotes, for example).


```bash
# Run from the *parent* directory
jest exercise-3.spec.js
```
