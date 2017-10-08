# ThickBox-v2
Modern rewrite of the ThickBox 3.1 JS library by Cody Lindley
[Original Code](http://codylindley.com/thickbox/) 

# Changes
* Development in `'use strict'` environment;
* Wrapping library in an IIFE
* Updating `tb_parseQuery` function (Bugs: )
* Using $ alias for jQuery
* Enclosing leaked global variables into function scope
* Replacing abstract comparisons (e.g., !=) with strict comparisons (!==)
* Replacing `$(document).ready` with `$(function)` alias
* Prettier comments
* Removing polyfills for older than IE7 browsers
* Adding minified version
* Chaining jQuery methods on the same selector object
* Moving variables declaration at the beginning of functions
* Caching jQuery selectors (e.g., `$("body")`)
* Adding proper spaces and indentation for a more readable code
* Yoda conditions
* Testing using Mocha and Chai
* Removing unnecessary conditional: 			
	`if ( urlType == '.jpg' || urlType == '.jpeg' || urlType == '.png' || urlType == '.gif' || urlType == '.bmp' ){`
	-->
	`if ( urlType )`


# TODO
* Add More Tests
* Address request: "For example, I'm trying to use it for a plugin of mine and I'm wanting to tie into the "onClose" event for ThickBox which isn't too easily done." (https://core.trac.wordpress.org/ticket/10955)