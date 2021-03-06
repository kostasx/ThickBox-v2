/*
 * Thickbox v2 0.1.0 
 * Contributors: @kostasx
 * Based on Thickbox 3.1 by Cody Lindley (http://www.codylindley.com) Copyright (c) 2007 cody lindley
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
*/
"use strict";

var imgLoader, TB_WIDTH, TB_HEIGHT, ajaxContentW, ajaxContentH, urlNoQuery, tb_pathToImage;

var $body = jQuery(document.body);

if ( typeof tb_pathToImage !== 'string' ) {
	tb_pathToImage = thickboxL10n.loadingAnimation;
}

// On page load call tb_init
jQuery(function(){
	tb_init('a.thickbox, area.thickbox, input.thickbox');	// Pass where to apply thickbox
	imgLoader = new Image();								// Preload image
	imgLoader.src = tb_pathToImage;
});

/*
 * Add thickbox to href & area elements that have a class of .thickbox.
 * Remove the loading indicator when content in an iframe has loaded.
 */
function tb_init( domChunk ){
	jQuery( 'body' )
		.on( 'click', domChunk, tb_click )
		.on( 'thickbox:iframe:loaded', function() {
			jQuery( '#TB_window' ).removeClass( 'thickbox-loading' );
		});
}

function tb_click(){
	var t = this.title || this.name || null;
	var a = this.href || this.alt;
	var g = this.rel || false;
	tb_show(t,a,g);
	this.blur();
	return false;
}

// Called when the user clicks on a thickbox link
function tb_show(caption, url, imageGroup) {	

	var $closeBtn;
	var baseURL;

	try {
		if ( document.getElementById("TB_overlay") === null ){
			$body
			 .append("<div id='TB_overlay'></div><div id='TB_window' class='thickbox-loading'></div>")
			 .addClass( 'modal-open' );
			jQuery("#TB_overlay").click( tb_remove );
		}

		if ( tb_detectMacXFF() ){

			jQuery("#TB_overlay").addClass("TB_overlayMacFFBGHack");	// Use png overlay so hide flash

		} else {

			jQuery("#TB_overlay").addClass("TB_overlayBG");			// Use background and opacity

		}

		if ( caption === null ){ caption = ""; }
		$body.append("<div id='TB_load'><img src='" + imgLoader.src + "' width='208' /></div>");	// Add loader to the page
		jQuery('#TB_load').show();	// Show loader

	   if ( url.indexOf("?") !==- 1 ){ // ff there is a query string involved

			baseURL = url.substr(0, url.indexOf("?"));

	   } else {

	   		baseURL = url;

	   }

	   var urlString = /\.jpg$|\.jpeg$|\.png$|\.gif$|\.bmp$/;
	   var urlType = baseURL.toLowerCase().match(urlString);

		if ( urlType ){
		// Code to show images

			TB_PrevCaption = "";
			TB_PrevURL     = "";
			TB_PrevHTML    = "";
			TB_NextCaption = "";
			TB_NextURL     = "";
			TB_NextHTML    = "";
			TB_imageCount  = "";
			TB_FoundURL    = false;

			if ( imageGroup ){

				TB_TempArray = jQuery("a[rel="+imageGroup+"]").get();
				for ( TB_Counter = 0; ((TB_Counter < TB_TempArray.length) && (TB_NextHTML === "")); TB_Counter++) {
					var urlTypeTemp = TB_TempArray[TB_Counter].href.toLowerCase().match(urlString);
						if (!(TB_TempArray[TB_Counter].href == url)) {
							if (TB_FoundURL) {
								TB_NextCaption = TB_TempArray[TB_Counter].title;
								TB_NextURL = TB_TempArray[TB_Counter].href;
								TB_NextHTML = "<span id='TB_next'>&nbsp;&nbsp;<a href='#'>"+thickboxL10n.next+"</a></span>";
							} else {
								TB_PrevCaption = TB_TempArray[TB_Counter].title;
								TB_PrevURL = TB_TempArray[TB_Counter].href;
								TB_PrevHTML = "<span id='TB_prev'>&nbsp;&nbsp;<a href='#'>"+thickboxL10n.prev+"</a></span>";
							}
						} else {
							TB_FoundURL = true;
							TB_imageCount = thickboxL10n.image + ' ' + (TB_Counter + 1) + ' ' + thickboxL10n.of + ' ' + (TB_TempArray.length);
						}
				}

			}

			imgPreloader = new Image();
			imgPreloader.onload = function(){
			imgPreloader.onload = null;

			// Resizing large images - original by Christian Montoya edited by me.
			var pagesize = tb_getPageSize();
			var x = pagesize[0] - 150;
			var y = pagesize[1] - 150;
			var imageWidth = imgPreloader.width;
			var imageHeight = imgPreloader.height;
			if (imageWidth > x) {
				imageHeight = imageHeight * (x / imageWidth);
				imageWidth = x;
				if (imageHeight > y) {
					imageWidth = imageWidth * (y / imageHeight);
					imageHeight = y;
				}
			} else if (imageHeight > y) {
				imageWidth = imageWidth * (y / imageHeight);
				imageHeight = y;
				if (imageWidth > x) {
					imageHeight = imageHeight * (x / imageWidth);
					imageWidth = x;
				}
			}
			// End Resizing

			TB_WIDTH = imageWidth + 30;
			TB_HEIGHT = imageHeight + 60;
			jQuery("#TB_window").append("<a href='' id='TB_ImageOff'><span class='screen-reader-text'>"+thickboxL10n.close+"</span><img id='TB_Image' src='"+url+"' width='"+imageWidth+"' height='"+imageHeight+"' alt='"+caption+"'/></a>" + "<div id='TB_caption'>"+caption+"<div id='TB_secondLine'>" + TB_imageCount + TB_PrevHTML + TB_NextHTML + "</div></div><div id='TB_closeWindow'><button type='button' id='TB_closeWindowButton'><span class='screen-reader-text'>"+thickboxL10n.close+"</span><span class='tb-close-icon'></span></button></div>");

			jQuery("#TB_closeWindowButton").click(tb_remove);

			if (!(TB_PrevHTML === "")) {
				function goPrev(){
					if(jQuery(document).unbind("click",goPrev)){jQuery(document).unbind("click",goPrev);}
					jQuery("#TB_window").remove();
					$body.append("<div id='TB_window'></div>");
					tb_show(TB_PrevCaption, TB_PrevURL, imageGroup);
					return false;
				}
				jQuery("#TB_prev").click(goPrev);
			}

			if (!(TB_NextHTML === "")) {
				function goNext(){
					jQuery("#TB_window").remove();
					$body.append("<div id='TB_window'></div>");
					tb_show(TB_NextCaption, TB_NextURL, imageGroup);
					return false;
				}
				jQuery("#TB_next").click(goNext);

			}

			jQuery(document).bind('keydown.thickbox', function(e){

				if ( e.which == 27 ){ // Close
					tb_remove();

				} else if ( e.which == 190 ){ // Display previous image
					if(!(TB_NextHTML == "")){
						jQuery(document).unbind('thickbox');
						goNext();
					}
				} else if ( e.which == 188 ){ // Display next image
					if(!(TB_PrevHTML == "")){
						jQuery(document).unbind('thickbox');
						goPrev();
					}
				}
				return false;
			});

			tb_position();
			jQuery("#TB_load").remove();
			jQuery("#TB_ImageOff").click(tb_remove);
			jQuery("#TB_window").css({ 'visibility' : 'visible' }); // For Safari using CSS instead of show
			};

			imgPreloader.src = url;

		} else { // Code to show html

			var queryString = url.replace(/^[^\?]+\??/,'');
			var params = tb_parseQuery( queryString );

			TB_WIDTH = (params['width']*1) + 30 || 630; 	// Defaults to 630 if no parameters were added to URL
			TB_HEIGHT = (params['height']*1) + 40 || 440; 	// Defaults to 440 if no parameters were added to URL
			ajaxContentW = TB_WIDTH - 30;
			ajaxContentH = TB_HEIGHT - 45;

			if ( -1  !== url.indexOf('TB_iframe') ){ // Either iframe or ajax window

					urlNoQuery = url.split('TB_');
					jQuery("#TB_iframeContent").remove();
					if ( params['modal'] != "true" ){ // iframe no modal

						jQuery("#TB_window").append("<div id='TB_title'><div id='TB_ajaxWindowTitle'>"+caption+"</div><div id='TB_closeAjaxWindow'><button type='button' id='TB_closeWindowButton'><span class='screen-reader-text'>"+thickboxL10n.close+"</span><span class='tb-close-icon'></span></button></div></div><iframe frameborder='0' hspace='0' allowtransparency='true' src='"+urlNoQuery[0]+"' id='TB_iframeContent' name='TB_iframeContent"+Math.round(Math.random()*1000)+"' onload='tb_showIframe()' style='width:"+(ajaxContentW + 29)+"px;height:"+(ajaxContentH + 17)+"px;' >"+thickboxL10n.noiframes+"</iframe>");

					} else { // iframe modal

						jQuery("#TB_overlay").unbind();
						jQuery("#TB_window").append("<iframe frameborder='0' hspace='0' allowtransparency='true' src='"+urlNoQuery[0]+"' id='TB_iframeContent' name='TB_iframeContent"+Math.round(Math.random()*1000)+"' onload='tb_showIframe()' style='width:"+(ajaxContentW + 29)+"px;height:"+(ajaxContentH + 17)+"px;'>"+thickboxL10n.noiframes+"</iframe>");
					}

			} else { // Not an iframe, ajax

					if ( jQuery("#TB_window").css("visibility") !== "visible" ){

						if ( params['modal'] != "true" ){ // ajax no modal

						jQuery("#TB_window").append("<div id='TB_title'><div id='TB_ajaxWindowTitle'>"+caption+"</div><div id='TB_closeAjaxWindow'><button type='button' id='TB_closeWindowButton'><span class='screen-reader-text'>"+thickboxL10n.close+"</span><span class='tb-close-icon'></span></button></div></div><div id='TB_ajaxContent' style='width:"+ajaxContentW+"px;height:"+ajaxContentH+"px'></div>");

						} else { // ajax modal

							jQuery("#TB_overlay").unbind();
							jQuery("#TB_window").append("<div id='TB_ajaxContent' class='TB_modal' style='width:"+ajaxContentW+"px;height:"+ajaxContentH+"px;'></div>");

						}

					} else { // This means the window is already up, we are just loading new content via ajax

						var $TB_ajaxContent = jQuery("#TB_ajaxContent")[0];
						$TB_ajaxContent.style.width = ajaxContentW + "px";
						$TB_ajaxContent.style.height = ajaxContentH + "px";
						$TB_ajaxContent.scrollTop = 0;
						jQuery("#TB_ajaxWindowTitle").html(caption);

					}
			}

			var $TB_closeWindowButton = jQuery("#TB_closeWindowButton");

			// INLINE CONTENT
			if ( -1 !== url.indexOf('TB_inline') ){

				var $TB_ajaxContent = jQuery("#TB_ajaxContent");
				var $inlineId       = jQuery('#' + params['inlineId']); 

				$TB_closeWindowButton.click(tb_remove.bind($TB_closeWindowButton, $inlineId));

				$TB_ajaxContent.append($inlineId.children());
				// Move elements back when you're finished:
				jQuery("#TB_window").bind('tb_unload', function(){ $inlineId.append( $TB_ajaxContent.children() ); });
				tb_position();
				jQuery("#TB_load").remove();
				jQuery("#TB_window").css({ 'visibility': 'visible' });

			// IFRAME CONTENT
			} else if ( -1 !== url.indexOf('TB_iframe') ) {

				$TB_closeWindowButton.click(tb_remove);
				tb_position();
				jQuery("#TB_load").remove();
				jQuery("#TB_window").css({ 'visibility': 'visible' });

			// AJAX CONTENT
			} else {

				$TB_closeWindowButton.click(tb_remove);
				var load_url = url;
				load_url += -1 === url.indexOf('?') ? '?' : '&';
				jQuery("#TB_ajaxContent").load(load_url += "random=" + (new Date().getTime()),function(){
				// To do a post change this load method
					tb_position();
					jQuery("#TB_load").remove();
					tb_init("#TB_ajaxContent a.thickbox");
					jQuery("#TB_window").css({ 'visibility' : 'visible' });
				});
			}

		}

		if ( !params['modal'] ){

			jQuery(document).bind('keydown.thickbox', function(e){
				if ( e.which == 27 ){ // close
					tb_remove();
					return false;
				}
			});

		}

		$closeBtn = jQuery( '#TB_closeWindowButton' );

		// * If the native Close button icon is visible, move focus on the button
		// * (e.g. in the Network Admin Themes screen).
		// * In other admin screens is hidden and replaced by a different icon.
		if ( $closeBtn.find( '.tb-close-icon' ).is( ':visible' ) ) {
			$closeBtn.focus();
		}

	} catch(e) {

		console.log(e);

	}

}

//*** HELPER FUNCTIONS ***//

function tb_showIframe(){
	jQuery("#TB_load").remove();
	jQuery("#TB_window").css({'visibility':'visible'}).trigger( 'thickbox:iframe:loaded' );
}

function tb_remove(el) {

 	jQuery("#TB_imageOff").unbind("click");
	jQuery("#TB_closeWindowButton").unbind("click");
	jQuery( '#TB_window' ).fadeOut( 'fast', function() {
		jQuery( '#TB_window, #TB_overlay, #TB_HideSelect' ).trigger( 'tb_unload' ).unbind().remove();
		$body.trigger( 'thickbox:removed' );
	});
	$body.removeClass( 'modal-open' );
	jQuery("#TB_load").remove();
	jQuery(document).unbind('.thickbox');
	if ( el ){ jQuery(el).trigger('close'); }
	return false;
}

function tb_position() {

	jQuery("#TB_window")
	 .css({ 
		marginLeft : '-' + parseInt((TB_WIDTH / 2),10) + 'px',
		marginTop  : '-' + parseInt((TB_HEIGHT / 2),10) + 'px',
		width      : TB_WIDTH + 'px'
	 });

}

function tb_parseQuery( query ){

  query = query
    .split( "?" )
    .filter(function(u){ return ~u.indexOf('='); })
    .join('')
    .split(/#?TB_inline(?:=true)?&?/)
    .filter(function(u){ return Boolean(u); })
    .join("&"); 

	var Params = query.split("&").reduce(function(acc,prev){

		var keyValue = prev.split("="); 
		var key = unescape(keyValue[0]);
		var value = unescape(keyValue[1]).replace(/\+/g, ' ');
		acc[key] = value;
		return acc;

	},{});

	return Params;

}

function tb_getPageSize(){

	var de = document.documentElement;
	var w = window.innerWidth || self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
	var h = window.innerHeight || self.innerHeight || (de&&de.clientHeight) || document.body.clientHeight;
	var arrayPageSize = [w,h];
	return arrayPageSize;

}

function tb_detectMacXFF() {

  var userAgent = navigator.userAgent.toLowerCase();
  if ( -1 !== userAgent.indexOf('mac') && -1 !== userAgent.indexOf('firefox')) {
    return true;
  }

}