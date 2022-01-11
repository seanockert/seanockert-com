(function(a){var l,n,p,q,r,s,t,b="Close",c="BeforeAppend",d="MarkupParse",e="Open",f="Change",g="mfp",h="."+g,i="mfp-ready",j="mfp-removing",k="mfp-prevent-close",m=function(){},o=a(window),u=function(a,b){l.ev.on(g+a+h,b)},v=function(b,c,d,e){var f=document.createElement("div");return f.className="mfp-"+b,d&&(f.innerHTML=d),e?c&&c.appendChild(f):(f=a(f),c&&f.appendTo(c)),f},w=function(b,c){l.ev.triggerHandler(g+b,c),l.st.callbacks&&(b=b.charAt(0).toLowerCase()+b.slice(1),l.st.callbacks[b]&&l.st.callbacks[b].apply(l,a.isArray(c)?c:[c]))},x=function(){(l.st.focus?l.content.find(l.st.focus).eq(0):l.wrap).focus()},y=function(b){return b===t&&l.currTemplate.closeBtn||(l.currTemplate.closeBtn=a(l.st.closeMarkup.replace("%title%",l.st.tClose)),t=b),l.currTemplate.closeBtn};m.prototype={constructor:m,init:function(){var b=navigator.appVersion;l.isIE7=-1!==b.indexOf("MSIE 7."),l.isAndroid=/android/gi.test(b),l.isIOS=/iphone|ipad|ipod/gi.test(b),l.probablyMobile=l.isAndroid||l.isIOS||/(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent),p=a(document.body),q=a(document),l.popupsCache={}},open:function(b){if(!l.isOpen){var c;if(l.types=[],s="",l.ev=b.el||q,b.isObj)l.index=b.index||0;else{l.index=0;var g,f=b.items;for(c=0;f.length>c;c++)if(g=f[c],g.parsed&&(g=g.el[0]),g===b.el[0]){l.index=c;break}}b.key?(l.popupsCache[b.key]||(l.popupsCache[b.key]={}),l.currTemplate=l.popupsCache[b.key]):l.currTemplate={},l.st=a.extend(!0,{},a.magnificPopup.defaults,b),l.fixedContentPos="auto"===l.st.fixedContentPos?!l.probablyMobile:l.st.fixedContentPos,l.items=b.items.length?b.items:[b.items],l.bgOverlay||(l.bgOverlay=v("bg").on("click"+h,function(){l.close()}),l.wrap=v("wrap").attr("tabindex",-1).on("click"+h,function(b){var c=b.target;a(c).hasClass(k)||(l.st.closeOnContentClick?l.close():(!l.content||a(c).hasClass("mfp-close")||l.preloader&&b.target===l.preloader[0]||c!==l.content[0]&&!a.contains(l.content[0],c))&&l.close())}),l.container=v("container",l.wrap)),l.contentContainer=v("content"),l.st.preloader&&(l.preloader=v("preloader",l.container,l.st.tLoading));var j=a.magnificPopup.modules;for(c=0;j.length>c;c++){var m=j[c];m=m.charAt(0).toUpperCase()+m.slice(1),l["init"+m].call(l)}w("BeforeOpen"),l.st.closeBtnInside?(u(d,function(a,b,c,d){c.close_replaceWith=y(d.type)}),s+=" mfp-close-btn-in"):l.wrap.append(y()),l.st.alignTop&&(s+=" mfp-align-top"),l.fixedContentPos?l.wrap.css({overflow:l.st.overflowY,overflowX:"hidden",overflowY:l.st.overflowY}):l.wrap.css({top:o.scrollTop(),position:"absolute"}),(l.st.fixedBgPos===!1||"auto"===l.st.fixedBgPos&&!l.fixedContentPos)&&l.bgOverlay.css({height:q.height(),position:"absolute"}),q.on("keyup"+h,function(a){27===a.keyCode&&l.close()}),o.on("resize"+h,function(){l.updateSize()}),l.st.closeOnContentClick||(s+=" mfp-auto-cursor"),s&&l.wrap.addClass(s);var n=l.wH=o.height(),r={};if(l.fixedContentPos&&"scroll"!==l.st.overflowY){var t=l._getScrollbarSize();t&&(r.paddingRight=t)}l.fixedContentPos&&(l.isIE7?a("body, html").css("overflow","hidden"):r.overflow="hidden");var z=l.st.mainClass;l.isIE7&&(z+=" mfp-ie7"),z&&l._addClassToMFP(z),l.updateItemHTML(),w("BuildControls"),p.css(r),l.bgOverlay.add(l.wrap).prependTo(document.body),l._lastFocusedEl=document.activeElement,setTimeout(function(){l.content?(l._addClassToMFP(i),x()):l.bgOverlay.addClass(i),q.on("focusin"+h,function(b){return b.target===l.wrap[0]||a.contains(l.wrap[0],b.target)?void 0:(x(),!1)})},16),l.isOpen=!0,l.updateSize(n),w(e)}},close:function(){l.isOpen&&(l.isOpen=!1,l.st.removalDelay?(l._addClassToMFP(j),setTimeout(function(){l._close()},l.st.removalDelay)):l._close())},_close:function(){w(b);var c=j+" "+i+" ";if(l.bgOverlay.detach(),l.wrap.detach(),l.container.empty(),l.st.mainClass&&(c+=l.st.mainClass+" "),l._removeClassFromMFP(c),l.fixedContentPos){var d={paddingRight:0};l.isIE7?a("body, html").css("overflow","auto"):d.overflow="visible",p.css(d)}q.off("keyup"+h+" focusin"+h),l.ev.off(h),l.wrap.attr("class","mfp-wrap").removeAttr("style"),l.bgOverlay.attr("class","mfp-bg"),l.container.attr("class","mfp-container"),l.st.closeBtnInside&&l.currTemplate[l.currItem.type]!==!0||l.currTemplate.closeBtn&&l.currTemplate.closeBtn.detach(),l._lastFocusedEl&&a(l._lastFocusedEl).focus(),l.content=null,l.currTemplate=null,l.prevHeight=0},updateSize:function(a){if(l.isIOS){var b=document.documentElement.clientWidth/window.innerWidth,c=window.innerHeight*b;l.wrap.css("height",c),l.wH=c}else l.wH=a||o.height();w("Resize")},updateItemHTML:function(){var b=l.items[l.index];l.contentContainer.detach(),l.content&&l.content.detach(),b.parsed||(b=l.parseEl(l.index)),l.currItem=b;var c=b.type;if(!l.currTemplate[c]){var d=l.st[c]?l.st[c].markup:!1;w("FirstMarkupParse",d),l.currTemplate[c]=d?a(d):!0}r&&r!==b.type&&l.container.removeClass("mfp-"+r+"-holder");var e=l["get"+c.charAt(0).toUpperCase()+c.slice(1)](b,l.currTemplate[c]);l.appendContent(e,c),b.preloaded=!0,w(f,b),r=b.type,l.container.prepend(l.contentContainer)},appendContent:function(a,b){l.content=a,a?l.st.closeBtnInside&&l.currTemplate[b]===!0?l.content.find(".mfp-close").length||l.content.append(y()):l.content=a:l.content="",w(c),l.container.addClass("mfp-"+b+"-holder"),l.contentContainer.append(l.content)},parseEl:function(b){var c=l.items[b],d=c.type;if(c=c.tagName?{el:a(c)}:{data:c,src:c.src},c.el){for(var e=l.types,f=0;e.length>f;f++)if(c.el.hasClass("mfp-"+e[f])){d=e[f];break}c.src=c.el.attr("data-mfp-src"),c.src||(c.src=c.el.attr("href"))}return c.type=d||l.st.type,c.index=b,c.parsed=!0,l.items[b]=c,w("ElementParse",c),l.items[b]},addGroup:function(b,c){var d=function(d){var e=void 0!==c.midClick?c.midClick:a.magnificPopup.defaults.midClick;if(e||2!==d.which){var f=void 0!==c.disableOn?c.disableOn:a.magnificPopup.defaults.disableOn;if(f)if(a.isFunction(f)){if(!f.call(l))return!0}else if(f>a(window).width())return!0;d.preventDefault(),c.el=a(this),c.mainEl=b,c.delegate&&(c.items=b.find(c.delegate)),l.open(c)}};c||(c={});var e="click.magnificPopup";c.items?(c.isObj=!0,b.off(e).on(e,d)):(c.isObj=!1,c.delegate?b.off(e).on(e,c.delegate,d):(c.items=b,b.off(e).on(e,d)))},updateStatus:function(a,b){if(l.preloader){n!==a&&l.container.removeClass("mfp-s-"+n),b||"loading"!==a||(b=l.st.tLoading);var c={status:a,text:b};w("UpdateStatus",c),a=c.status,b=c.text,l.preloader.html(b),l.preloader.find("a").click(function(a){a.stopImmediatePropagation()}),l.container.addClass("mfp-s-"+a),n=a}},_addClassToMFP:function(a){l.bgOverlay.addClass(a),l.wrap.addClass(a)},_removeClassFromMFP:function(a){this.bgOverlay.removeClass(a),l.wrap.removeClass(a)},_hasScrollBar:function(a){return document.body.clientHeight>(a||o.height())?!0:!1},_parseMarkup:function(b,c,e){var f;e.data&&(c=a.extend(e.data,c)),w(d,[b,c,e]),a.each(c,function(a,c){if(void 0===c||c===!1)return!0;if(f=a.split("_"),f.length>1){var d=b.find(h+"-"+f[0]);if(d.length>0){var e=f[1];"replaceWith"===e?d[0]!==c[0]&&d.replaceWith(c):"img"===e?d.is("img")?d.attr("src",c):d.replaceWith('<img src="'+c+'" class="'+d.attr("class")+'" />'):d.attr(f[1],c)}}else b.find(h+"-"+a).html(c)})},_getScrollbarSize:function(){if(void 0===l.scrollbarSize){var a=document.createElement("div");a.id="mfp-sbm",a.style.cssText="width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;",document.body.appendChild(a),l.scrollbarSize=a.offsetWidth-a.clientWidth,document.body.removeChild(a)}return l.scrollbarSize}},a.magnificPopup={instance:null,proto:m.prototype,modules:[],open:function(b,c){return a.magnificPopup.instance||(l=new m,l.init(),a.magnificPopup.instance=l),b||(b={}),b.isObj=!0,b.index=void 0===c?0:c,this.instance.open(b)},close:function(){return a.magnificPopup.instance.close()},registerModule:function(b,c){c.options&&(a.magnificPopup.defaults[b]=c.options),a.extend(this.proto,c.proto),this.modules.push(b)},defaults:{disableOn:0,key:null,midClick:!1,mainClass:"",preloader:!0,focus:"",closeOnContentClick:!1,closeBtnInside:!0,alignTop:!1,removalDelay:0,fixedContentPos:"auto",fixedBgPos:"auto",overflowY:"auto",closeMarkup:'<button title="%title%" type="button" class="mfp-close">&times;&nbsp;</button>',tClose:"Close (Esc)",tLoading:"Loading..."}},a.fn.magnificPopup=function(b){return a.magnificPopup.instance||(l=new m,l.init(),a.magnificPopup.instance=l),l.addGroup(a(this),b),a(this)};var A,z="inline";a.magnificPopup.registerModule(z,{options:{hiddenClass:g+"-hide",markup:"",tNotFound:"Content not found"},proto:{initInline:function(){l.types.push(z),A=!1,u(b+"."+z,function(){var a=l.currItem;if(a.type===z){if(A)for(var b=0;l.items.length>b;b++)a=l.items[b],a&&a.inlinePlaceholder&&a.inlinePlaceholder.after(a.inlineElement.addClass(l.st.inline.hiddenClass)).detach();a.inlinePlaceholder=a.inlineElement=null}})},getInline:function(b,c){if(l.updateStatus("ready"),b.src){var d=l.st.inline;return"string"!=typeof b.src&&(b.isElement=!0),b.isElement||b.inlinePlaceholder||(b.inlinePlaceholder=v(d.hiddenClass)),b.isElement?b.inlineElement=b.src:b.inlineElement||(b.inlineElement=a(b.src),b.inlineElement.length||(l.updateStatus("error",d.tNotFound),b.inlineElement=a("<div>"))),b.inlinePlaceholder&&(A=!0),b.inlineElement.after(b.inlinePlaceholder).detach().removeClass(d.hiddenClass),b.inlineElement}return l._parseMarkup(c,{},b),c}}});var C,B="ajax",D=function(){C&&p.removeClass(C)};a.magnificPopup.registerModule(B,{options:{settings:null,cursor:"mfp-ajax-cur",tError:'<a href="%url%">The content</a> could not be loaded.'},proto:{initAjax:function(){l.types.push(B),C=l.st.ajax.cursor,u(b+"."+B,function(){D(),l.req&&l.req.abort()})},getAjax:function(b){C&&p.addClass(C),l.updateStatus("loading");var c=a.extend({url:b.src,success:function(c,d,e){w("ParseAjax",e),l.appendContent(a(e.responseText),B),b.finished=!0,D(),x(),setTimeout(function(){l.wrap.addClass(i)},16),l.updateStatus("ready")},error:function(){D(),b.finished=b.loadError=!0,l.updateStatus("error",l.st.ajax.tError.replace("%url%",b.src))}},l.st.ajax.settings);return l.req=a.ajax(c),""}}});var E,F=function(b){if(b.data&&void 0!==b.data.title)return b.data.title;var c=l.st.image.titleSrc;if(c){if(a.isFunction(c))return c.call(l,b);if(b.el)return b.el.attr(c)||""}return""};a.magnificPopup.registerModule("image",{options:{markup:'<div class="mfp-figure"><div class="mfp-close"></div><div class="mfp-img"></div><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></div>',cursor:"mfp-zoom-out-cur",titleSrc:"title",verticalFit:!0,tError:'<a href="%url%">The image</a> could not be loaded.'},proto:{initImage:function(){var a=l.st.image,c=".image";l.types.push("image"),u(e+c,function(){"image"===l.currItem.type&&a.cursor&&p.addClass(a.cursor)}),u(b+c,function(){a.cursor&&p.removeClass(a.cursor),o.off("resize"+h)}),u("Resize"+c,function(){l.resizeImage()})},resizeImage:function(){var a=l.currItem;a.img&&l.st.image.verticalFit&&a.img.css("max-height",l.wH+"px")},_onImageHasSize:function(a){a.img&&(a.hasSize=!0,E&&clearInterval(E),a.isCheckingImgSize=!1,w("ImageHasSize",a),a.imgHidden&&(l.content&&l.content.removeClass("mfp-loading"),a.imgHidden=!1))},findImageSize:function(a){var b=0,c=a.img[0],d=function(e){E&&clearInterval(E),E=setInterval(function(){return c.naturalWidth>0?(l._onImageHasSize(a),void 0):(b>200&&clearInterval(E),b++,3===b?d(10):40===b?d(50):100===b&&d(500),void 0)},e)};d(1)},getImage:function(b,c){var d=0,e=function(){b&&(b.img[0].complete?(b.img.off(".mfploader"),b===l.currItem&&(l._onImageHasSize(b),l.updateStatus("ready")),b.hasSize=!0,b.loaded=!0):(d++,200>d?setTimeout(e,100):f()))},f=function(){b&&(b.img.off(".mfploader"),b===l.currItem&&(l._onImageHasSize(b),l.updateStatus("error",g.tError.replace("%url%",b.src))),b.hasSize=!0,b.loaded=!0,b.loadError=!0)},g=l.st.image,h=c.find(".mfp-img");if(h.length){var i=new Image;i.className="mfp-img",b.img=a(i).on("load.mfploader",e).on("error.mfploader",f),i.src=b.src,h.is("img")&&(b.img=b.img.clone())}return l._parseMarkup(c,{title:F(b),img_replaceWith:b.img},b),l.resizeImage(),b.hasSize?(E&&clearInterval(E),b.loadError?(c.addClass("mfp-loading"),l.updateStatus("error",g.tError.replace("%url%",b.src))):(c.removeClass("mfp-loading"),l.updateStatus("ready")),c):(l.updateStatus("loading"),b.loading=!0,b.hasSize||(b.imgHidden=!0,c.addClass("mfp-loading"),l.findImageSize(b)),c)}}});var G="iframe",H=function(a){if(l.isIE7&&l.currItem&&l.currItem.type===G){var b=l.content.find("iframe");b.length&&b.css("display",a?"block":"none")}};a.magnificPopup.registerModule(G,{options:{markup:'<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe></div>',srcAction:"iframe_src",patterns:{youtube:{index:"youtube.com",id:"v=",src:"//www.youtube.com/embed/%id%?autoplay=1"},vimeo:{index:"vimeo.com/",id:"/",src:"//player.vimeo.com/video/%id%?autoplay=1"},gmaps:{index:"//maps.google.",src:"%id%&output=embed"}}},proto:{initIframe:function(){l.types.push(G),H(!0),u(b+"."+G,function(){H()})},getIframe:function(b,c){var d=b.src,e=l.st.iframe;a.each(e.patterns,function(){return d.indexOf(this.index)>-1?(this.id&&(d="string"==typeof this.id?d.substr(d.lastIndexOf(this.id)+this.id.length,d.length):this.id.call(this,d)),d=this.src.replace("%id%",d),!1):void 0});var f={};return e.srcAction&&(f[e.srcAction]=d),l._parseMarkup(c,f,b),l.updateStatus("ready"),c}}});var I=function(a){var b=l.items.length;return a>b-1?a-b:0>a?b+a:a},J=function(a,b,c){return a.replace("%curr%",b+1).replace("%total%",c)};a.magnificPopup.registerModule("gallery",{options:{enabled:!1,arrowMarkup:'<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',preload:[0,2],navigateByImgClick:!0,arrows:!0,tPrev:"Previous (Left arrow key)",tNext:"Next (Right arrow key)",tCounter:"%curr% of %total%"},proto:{initGallery:function(){var c=l.st.gallery,g=".mfp-gallery",h=Boolean(a.fn.mfpFastClick);return l.direction=!0,c&&c.enabled?(s+=" mfp-gallery",u(e+g,function(){c.navigateByImgClick&&l.wrap.on("click"+g,".mfp-img",function(){return l.next(),!1}),q.on("keydown"+g,function(a){37===a.keyCode?l.prev():39===a.keyCode&&l.next()})}),u("UpdateStatus"+g,function(a,b){b.text&&(b.text=J(b.text,l.currItem.index,l.items.length))}),u(d+g,function(a,b,d,e){var f=l.items.length;d.counter=f?J(c.tCounter,e.index,f):""}),u("BuildControls"+g,function(){if(c.arrows&&!l.arrowLeft){var b=c.arrowMarkup,d=l.arrowLeft=a(b.replace("%title%",c.tPrev).replace("%dir%","left")).addClass(k),e=l.arrowRight=a(b.replace("%title%",c.tNext).replace("%dir%","right")).addClass(k),f=h?"mfpFastClick":"click";d[f](function(){l.prev()}),e[f](function(){l.next()}),l.isIE7&&(v("b",d[0],!1,!0),v("a",d[0],!1,!0),v("b",e[0],!1,!0),v("a",e[0],!1,!0)),l.container.append(d.add(e))}}),u(f+g,function(){l._preloadTimeout&&clearTimeout(l._preloadTimeout),l._preloadTimeout=setTimeout(function(){l.preloadNearbyImages(),l._preloadTimeout=null},16)}),u(b+g,function(){q.off(g),l.wrap.off("click"+g),h&&l.arrowLeft.add(l.arrowRight).destroyMfpFastClick(),l.arrowRight=l.arrowLeft=null}),void 0):!1},next:function(){l.direction=!0,l.index=I(l.index+1),l.updateItemHTML()},prev:function(){l.direction=!1,l.index=I(l.index-1),l.updateItemHTML()},goTo:function(a){l.direction=a>=l.index,l.index=a,l.updateItemHTML()},preloadNearbyImages:function(){var d,a=l.st.gallery.preload,b=Math.min(a[0],l.items.length),c=Math.min(a[1],l.items.length);for(d=1;(l.direction?c:b)>=d;d++)l._preloadItem(l.index+d);for(d=1;(l.direction?b:c)>=d;d++)l._preloadItem(l.index-d)},_preloadItem:function(b){if(b=I(b),!l.items[b].preloaded){var c=l.items[b];c.parsed||(c=l.parseEl(b)),w("LazyLoad",c),"image"===c.type&&(c.img=a('<img class="mfp-img" />').on("load.mfploader",function(){c.hasSize=!0}).on("error.mfploader",function(){c.hasSize=!0,c.loadError=!0}).attr("src",c.src)),c.preloaded=!0}}}});var K="retina";a.magnificPopup.registerModule(K,{options:{replaceSrc:function(a){return a.src.replace(/\.\w+$/,function(a){return"@2x"+a})},ratio:1},proto:{initRetina:function(){if(window.devicePixelRatio>1){var a=l.st.retina,b=a.ratio;b=isNaN(b)?b():b,b>1&&(u("ImageHasSize."+K,function(a,c){c.img.css({"max-width":c.img[0].naturalWidth/b,width:"100%"})}),u("ElementParse."+K,function(c,d){d.src=a.replaceSrc(d,b)}))}}}})})(window.jQuery||window.Zepto);
/**
 * jQuery-Plugin "preloadCssImages"
 * by Scott Jehl, scott@filamentgroup.com
 * http://www.filamentgroup.com
 * reference article: http://www.filamentgroup.com/lab/update_automatically_preload_images_from_css_with_jquery/
 * demo page: http://www.filamentgroup.com/examples/preloadImages/index_v2.php
 * 
 * Copyright (c) 2008 Filament Group, Inc
 * Dual licensed under the MIT (filamentgroup.com/examples/mit-license.txt) and GPL (filamentgroup.com/examples/gpl-license.txt) licenses.
 */

;jQuery.preloadCssImages = function (settings) {
	settings = jQuery.extend({
		statusDiv: '#percentage',
		errorDelay: 999, // handles 404-Errors in IE
		simultaneousCacheLoading: 2
	}, settings);
	var allImgs = [],
		loaded = 0,
		imgUrls = [],
		thisSheetRules,	
		errorTimer;
		
	var $statusDiv = jQuery(settings.statusDiv);
	var percent = 1;
	var msg = 'Loading...';
	
	function onImgComplete(){
		clearTimeout(errorTimer);
		var len = imgUrls.length;
		if (imgUrls && len && imgUrls[loaded]) {
			loaded++;
			
			if (imgUrls[loaded]) {
				
				if (loaded > 1 && loaded < 5) {
					msg = 'Sharpening Claws...';
					
				} else if (loaded >= 5) {
					msg = 'Installing Art...';
				} else {
					msg = 'Loading...';
				}
				percent = (loaded / len * 100).toFixed(0);
			} else {
				percent = 100
			}
			
			$statusDiv.text(msg + percent);
			
			loadImgs();
		}
	}
	
	function loadImgs(){
		//only load 1 image at the same time / most browsers can only handle 2 http requests, 1 should remain for user-interaction (Ajax, other images, normal page requests...)
		// otherwise set simultaneousCacheLoading to a higher number for simultaneous downloads
		if(imgUrls && imgUrls.length && imgUrls[loaded]){
			var img = new Image(); //new img obj
			img.src = imgUrls[loaded];	//set src either absolute or rel to css dir
			if(!img.complete){
				jQuery(img).bind('error load onreadystatechange', onImgComplete);
			} else {
				onImgComplete();
			}
			errorTimer = setTimeout(onImgComplete, settings.errorDelay); // handles 404-Errors in IE
		}
	}
	
	function parseCSS(sheets, urls) {
		var w3cImport = false,
			imported = [],
			importedSrc = [],
			baseURL;
		var sheetIndex = sheets.length;
		while(sheetIndex--){//loop through each stylesheet
			
			var cssPile = '';//create large string of all css rules in sheet
			
			if(urls && urls[sheetIndex]){
				baseURL = urls[sheetIndex];
			} else {
				var csshref = (sheets[sheetIndex].href) ? sheets[sheetIndex].href : 'window.location.href';
				var baseURLarr = csshref.split('/');//split href at / to make array
				baseURLarr.pop();//remove file path from baseURL array
				baseURL = baseURLarr.join('/');//create base url for the images in this sheet (css file's dir)
				//baseURL = 'localhost/bearsvsart/v2/css/'
				if (baseURL) {
					baseURL += '/'; //tack on a / if needed
				}
			}
			
			if(sheets[sheetIndex].cssRules || sheets[sheetIndex].rules){
				thisSheetRules = (sheets[sheetIndex].cssRules) ? //->>> http://www.quirksmode.org/dom/w3c_css.html
					sheets[sheetIndex].cssRules : //w3
					sheets[sheetIndex].rules; //ie 
				var ruleIndex = thisSheetRules.length;
				while(ruleIndex--){
					if(thisSheetRules[ruleIndex].style && thisSheetRules[ruleIndex].style.cssText){
						var text = thisSheetRules[ruleIndex].style.cssText;
						if(text.toLowerCase().indexOf('url') != -1){ // only add rules to the string if you can assume, to find an image, speed improvement
							cssPile += text; // thisSheetRules[ruleIndex].style.cssText instead of thisSheetRules[ruleIndex].cssText is a huge speed improvement
						}
					} else if(thisSheetRules[ruleIndex].styleSheet) {
						imported.push(thisSheetRules[ruleIndex].styleSheet);
						w3cImport = true;
					}
					
				}
			}
			//parse cssPile for image urls
			var tmpImage = cssPile.match(/[^\("]+\.(gif|jpg|jpeg|png)/g);//reg ex to get a string of between a "(" and a ".filename" / '"' for opera-bugfix
			if(tmpImage){
				var i = tmpImage.length;
				while(i--){ // handle baseUrl here for multiple stylesheets in different folders bug
					var imgSrc = (tmpImage[i].charAt(0) == '/' || tmpImage[i].match('://')) ? // protocol-bug fixed
						tmpImage[i] : 
						baseURL + tmpImage[i];
					
					if(jQuery.inArray(imgSrc, imgUrls) == -1){
						imgUrls.push(imgSrc);
					}
				}
			}
			
			if(!w3cImport && sheets[sheetIndex].imports && sheets[sheetIndex].imports.length) {
				for(var iImport = 0, importLen = sheets[sheetIndex].imports.length; iImport < importLen; iImport++){
					var iHref = sheets[sheetIndex].imports[iImport].href;
					iHref = iHref.split('/');
					iHref.pop();
					iHref = iHref.join('/');
					if (iHref) {
						iHref += '/'; //tack on a / if needed
					}
					var iSrc = (iHref.charAt(0) == '/' || iHref.match('://')) ? // protocol-bug fixed
						iHref : 
						baseURL + iHref;
					
					importedSrc.push(iSrc);
					imported.push(sheets[sheetIndex].imports[iImport]);
				}
				
				
			}
		}//loop
		if(imported.length){
			parseCSS(imported, importedSrc);
			return false;
		}
		var downloads = settings.simultaneousCacheLoading;
		while( downloads--){
			setTimeout(loadImgs, downloads);
		}
	}
	parseCSS(document.styleSheets);
	return imgUrls;
};
/*
 * Swipe 2.0
 *
 * Brad Birdsall
 * Copyright 2012, Licensed GPL & MIT
 *
*/

window.Swipe=function(element,options){var _this=this;if(!element)return;this.container=element;this.element=this.container.children[0];this.browser={touch:(function(){return('ontouchstart'in window)||window.DocumentTouch&&document instanceof DocumentTouch;})(),transitions:(function(){var temp=document.createElement('swipe'),props=['perspectiveProperty','WebkitPerspective','MozPerspective','OPerspective','msPerspective'];for(var i in props){if(temp.style[props[i]]!==undefined)return true;}
return false;})()};options=options||{};this.index=options.startSlide||0;this.speed=options.speed||300;this.callback=options.callback||function(){};this.transitionEnd=options.transitionEnd||function(){};this.delay=options.auto||0;this.cont=(options.continuous!=undefined)?!!options.continuous:true;this.disableScroll=!!options.disableScroll;this.index=parseInt(this.index,10);this.setup();this.begin();if(this.element.addEventListener){if(!!this.browser.touch){this.element.addEventListener('touchstart',this,false);this.element.addEventListener('touchmove',this,false);this.element.addEventListener('touchend',this,false);}
if(!!this.browser.transitions){this.element.addEventListener('webkitTransitionEnd',this,false);this.element.addEventListener('msTransitionEnd',this,false);this.element.addEventListener('oTransitionEnd',this,false);this.element.addEventListener('transitionend',this,false);}
window.addEventListener('resize',this,false);}
else{window.onresize=function(){_this.setup();};}};Swipe.prototype={setup:function(){this.slides=this.element.children;this.length=this.slides.length;this.cache=new Array(this.length);if(this.length<2)return;this.width=this.container.getBoundingClientRect().width||this.container.offsetWidth;if(!this.width)return;var refArray=[[],[],[]];this.element.style.width=(this.slides.length*this.width)+'px';for(var index=this.length-1;index>-1;index--){var elem=this.slides[index];elem.style.width=this.width+'px';elem.setAttribute('data-index',index);if(this.browser.transitions){elem.style.left=(index*-this.width)+'px';}
refArray[this.index>index?0:(this.index<index?2:1)].push(index);}
if(this.browser.transitions){this._stack(refArray[0],-1);this._stack(refArray[1],0);this._stack(refArray[2],1);}
this.container.style.visibility='visible';},kill:function(){this.delay=0;clearTimeout(this.interval);var slideArray=[];for(var i=this.slides.length-1;i>=0;i--){this.slides[i].style.width='';slideArray.push(i);}
this._stack(slideArray,0);var elem=this.element;elem.className=elem.className.replace('swipe-active','');if(this.element.removeEventListener){if(!!this.browser.touch){this.element.removeEventListener('touchstart',this,false);this.element.removeEventListener('touchmove',this,false);this.element.removeEventListener('touchend',this,false);}
if(!!this.browser.transitions){this.element.removeEventListener('webkitTransitionEnd',this,false);this.element.removeEventListener('msTransitionEnd',this,false);this.element.removeEventListener('oTransitionEnd',this,false);this.element.removeEventListener('transitionend',this,false);}
window.removeEventListener('resize',this.resize,false);}
else{window.onresize=null;}},getPos:function(){return this.index;},prev:function(delay){this.delay=delay||0;clearTimeout(this.interval);if(this.index)this.slide(this.index-1,this.speed);else if(this.cont)this.slide(this.length-1,this.speed);},next:function(delay){this.delay=delay||0;clearTimeout(this.interval);if(this.index<this.length-1)this.slide(this.index+1,this.speed);else if(this.cont)this.slide(0,this.speed);},begin:function(){var _this=this;this.interval=(this.delay)?setTimeout(function(){_this.next(_this.delay);},this.delay):0;},handleEvent:function(e){switch(e.type){case'touchstart':this.onTouchStart(e);break;case'touchmove':this.onTouchMove(e);break;case'touchend':this.onTouchEnd(e);break;case'webkitTransitionEnd':case'msTransitionEnd':case'oTransitionEnd':case'transitionend':this.onTransitionEnd(e);break;case'resize':this.setup();break;}
e.stopPropagation();},onTouchStart:function(e){var _this=this;_this.start={pageX:e.touches[0].pageX,pageY:e.touches[0].pageY,time:Number(new Date())};_this.isScrolling=undefined;_this.deltaX=0;},onTouchMove:function(e){var _this=this;if(e.touches.length>1||e.scale&&e.scale!==1)return;_this.deltaX=e.touches[0].pageX-_this.start.pageX;if(typeof _this.isScrolling=='undefined'){_this.isScrolling=!!(_this.isScrolling||Math.abs(_this.deltaX)<Math.abs(e.touches[0].pageY-_this.start.pageY));}
if(!_this.isScrolling){e.preventDefault();_this.delay=0;clearTimeout(_this.interval);_this.deltaX=_this.deltaX/((!_this.index&&_this.deltaX>0||_this.index==_this.length-1&&_this.deltaX<0)?(Math.abs(_this.deltaX)/_this.width+1):1);_this._move([_this.index-1,_this.index,_this.index+1],_this.deltaX);}else if(_this.disableScroll){e.preventDefault();}},onTouchEnd:function(e){var _this=this;var isValidSlide=Number(new Date())-_this.start.time<250&&Math.abs(_this.deltaX)>20||Math.abs(_this.deltaX)>_this.width/2,isPastBounds=!_this.index&&_this.deltaX>0||_this.index==_this.length-1&&_this.deltaX<0,direction=_this.deltaX<0;if(!_this.isScrolling){if(isValidSlide&&!isPastBounds){if(direction){_this._stack([_this.index-1],-1);_this._slide([_this.index,_this.index+1],-_this.width,_this.speed);_this.index+=1;}else{_this._stack([_this.index+1],1);_this._slide([_this.index-1,_this.index],_this.width,_this.speed);_this.index+=-1;}
_this.callback(_this.index,_this.slides[_this.index]);}else{_this._slide([_this.index-1,_this.index,_this.index+1],0,_this.speed);}}},onTransitionEnd:function(e){if(this._getElemIndex(e.target)==this.index){if(this.delay)this.begin();this.transitionEnd(this.index,this.slides[this.index]);}},slide:function(to,speed){var from=this.index;if(from==to)return;if(this.browser.transitions){var toStack=Math.abs(from-to)-1,direction=Math.abs(from-to)/(from-to),inBetween=[];while(toStack--)inBetween.push((to>from?to:from)-toStack-1);this._stack(inBetween,direction);this._slide([from,to],this.width*direction,this.speed);}
else{this._animate(from*-this.width,to*-this.width,this.speed)}
this.index=to;this.callback(this.index,this.slides[this.index]);},_slide:function(nums,dist,speed){var _slides=this.slides,l=nums.length;while(l--){this._translate(_slides[nums[l]],dist+this.cache[nums[l]],speed?speed:0);this.cache[nums[l]]+=dist;}},_stack:function(nums,pos){var _slides=this.slides,l=nums.length,dist=this.width*pos;while(l--){this._translate(_slides[nums[l]],dist,0);this.cache[nums[l]]=dist;}},_move:function(nums,dist){var _slides=this.slides,l=nums.length;while(l--)this._translate(_slides[nums[l]],dist+this.cache[nums[l]],0);},_translate:function(elem,xval,speed){if(!elem)return;var style=elem.style;style.webkitTransitionDuration=style.MozTransitionDuration=style.msTransitionDuration=style.OTransitionDuration=style.transitionDuration=speed+'ms';style.webkitTransform='translate3d('+xval+'px,0,0)';style.msTransform=style.MozTransform=style.OTransform='translateX('+xval+'px)';},_animate:function(from,to,speed){var elem=this.element;if(!speed){elem.style.left=to+'px';return;}
var _this=this,start=new Date(),timer=setInterval(function(){var timeElap=new Date()-start;if(timeElap>speed){elem.style.left=to+'px';if(_this._getElemIndex(elem)==_this.index){if(_this.delay)_this.begin();_this.transitionEnd(_this.index,_this.slides[_this.index]);}
clearInterval(timer);return;}
elem.style.left=(((to-from)*(Math.floor((timeElap/speed)*100)/100))+from)+'px';},4);},_getElemIndex:function(elem){return parseInt(elem.getAttribute('data-index'),10);}};if(window.jQuery||window.Zepto){(function($){$.fn.Swipe=function(params){return this.each(function(){var _this=$(this);_this.data('Swipe',new Swipe(_this[0],params));});}})(window.jQuery||window.Zepto)}
var docWidth = $(window).width();
var docHeight = $(window).height();
var foregroundOffset = ($('#foreground').width() - $('#scene').width())/2;

var mobile = false;

jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
  def: 'easeOutQuad',
  swing: function (x, t, b, c, d) {
    //alert(jQuery.easing.default);
    return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
  },
  easeInOutQuart: function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
    return -c/2 * ((t-=2)*t*t*t - 2) + b;
  },

});


$(window).load(function () { 
    $('#overlay').hide();
    $('#container').show();
    $('#header').addClass('init');
    animate(); 	
});


$(document).ready(function() {
  $('html').removeClass('no-js').addClass('js');
  
  // Get Country code from IP address
  $.get("http://ipinfo.io", function(response) {
  
      /*if (response.country == 'AU' || response.country == 'NZ'  || response.country == 'CA') {
        $('body').addClass('softlaunch-both ' + response.country);
      }*/
      if (response.country == 'AU' || response.country == 'NZ'  || response.country == 'CA' || response.country == 'UK' || response.country == 'GB' || response.country == 'SG') {
        $('body').addClass('softlaunch-android ' + response.country);
      } 
       
  }, "jsonp");  
    
  $('#container').hide();
  var loadedImgs = $.preloadCssImages();

  initPopups();

  $(window).resize(function() {
    docWidth = $(window).width(); 
    docHeight = $(window).height();
    
    if (docWidth < 626) {
      $('#header').css({ 'height' : docHeight+4})
      $('#scene').css({ 'height' : docHeight-46})
    } else if (docWidth < 1010) {
      $('#header').css({ 'height' : '486px'})
      $('#scene').css({ 'height' : '358px'}) 
    } else {
      $('#header').css({ 'height' : '777px'})
      $('#scene').css({ 'height' : '573px'}) 
    }           
  });
  
  $(window).resize();

  // Smooth scroll to next section
  $('a.scroll').click(function(){
      var hash = $.attr(this, 'href');
      
      $('html, body').animate({
          scrollTop: $(hash).offset().top
      }, {
      duration: 500,
      easing: 'easeInOutQuart',
      complete: function() {
        //window.location.hash = hash;
      }
      });
      return false;
  });  
  
});



function initPopups() {
  /* Popups */
  $('#play a').magnificPopup({
      type:'iframe',
      disableOn:500,
      alignTop: false,
      mainClass: 'mfp-no-margins mfp-with-zoom',
      image: {
        verticalFit: true
      },
      zoom: {
        enabled: true,
        duration: 300 // don't foget to change the duration also in CSS
      }
  }); 

  $('#art a').magnificPopup({
      type: 'image',
      tLoading: 'Loading image #%curr%...',
      tPrev: 'Previous Painting (Left arrow key)',
      tNext: 'Next Painting (Right arrow key)',
      removalDelay: 300,
      mainClass: 'mfp-fade',
      gallery: {
          enabled: true,
          navigateByImgClick: true,
          preload: [0,1]
      },
      image: {
        verticalFit: true,
        titleSrc: function(item) {
          var caption = item.el.attr('title');        
          var pinItURL = "http://pinterest.com/pin/create/button/";
          // Refer to http://developers.pinterest.com/pin_it/
          pinItURL += '?url=' + 'http://bearsvsart.com/';
          pinItURL += '&media=' + item.el.attr('href');
          pinItURL += '&description=' + caption + ' from Bears vs. Art';
          
          return caption + '&nbsp;&nbsp;<a class="pin-it" href="'+pinItURL+'" target="_blank"><img src="http://assets.pinterest.com/images/pidgets/pin_it_button.png" /></a>';
        }
      }
  });
}


// Trigger CSS animations by appending 'animate' class to header
function animate() {
	$('#header').addClass('init');
  
	window.setTimeout( function(){ 
    $('#header').addClass('animate')
  }, 700);
  
	window.setTimeout( function(){ 
    $('#header').removeClass(); 
    //$('#header').mousemove(rotateScene);
    //if (window.addEventListener) { window.addEventListener('deviceorientation', orientationChange, false); }
  }, 3200);
}




function animateByClass(el) {  
  newone = el.clone(true);        
  el.before(newone);   
  $("." + el.attr("class") + ":last").remove();  
}

(function loopShake() {
    var randShake = Math.round(Math.random() * 4000) + 2500;
    setTimeout(function() {animateByClass($('#bva')); loopShake(); }, randShake);
}());

(function loopShine() {
    var randShine = Math.round(Math.random() * 2000) + 4000;
    setTimeout(function() {animateByClass($('#shine')); loopShine(); }, randShine);
}());

    
function orientationChange(e){
  var orient = window.orientation;
  var tiltLR = -e.gamma/40;
  var tiltFB = -e.beta/40;

  if (!orient || orient === 0) { // normal portrait orientation
    dx = tiltLR;
    dy = tiltFB;
  } else if (orient === -90) { // landscape, rotated clockwise
    dx = -tiltFB;
    dy = tiltLR;
  } else if (orient === 90) { // landscape, rotated counterclockwise
    dx = tiltFB;
    dy = -tiltLR;
  } else if (orient === 180) { // portrait, upside down
    dx = -tiltLR;
    dy = -tiltFB;
  }

    tilt = new Object();
  tilt.pageX = ( docWidth / 2 ) * dx;
  tilt.pageY = ( docHeight / 2 ) * dy;

    rotateScene(tilt);
}

// Do some parallax when mouse moves - needs acceleration 
function rotateScene(e) {
	//return;
	var x = (e.pageX || (e.clientX + document.documentElement.scrollLeft)) / docWidth;
	var y = (e.pageY || (e.clientY + document.documentElement.scrollTop)) / docHeight;

	$('#trees').css({'-webkit-transform': 'translate3d(' + x*4 + 'px,' + y + 'px,0)'});
	$('#gallery').css({'-webkit-transform': 'translate3d(' + x*10 + 'px,' + y + 'px,0)'});
	$('#shadow').css({'-webkit-transform': 'translate3d(' + x*10 + 'px,' + y + 'px,0)'});
  $('#bear').css({'-webkit-transform': 'translate3d(' + x*30 + 'px,' + y + 'px,0)'});
  $('#people').css({'-webkit-transform': 'translate3d(' + x*5 + 'px,' + y + 'px,0)'});
	//$('#foreground').css({'background-position' : -foregroundOffset - x*5 + 'px, 0'});
}	




// Randomise start slide on load
//var beginSlide = Math.floor(Math.random() * 3);
var beginSlide = 0;

// Swipe JS slider
window.slider = new Swipe(document.getElementById('slider'), {
  continuous: true,
  auto: 8000,
  speed : 200,
  startSlide : beginSlide,
  callback: function(index, elem) { 
    var currentSlide = this.slides[index];
    $('.swipe-wrap div').removeClass('active');
    $(currentSlide).addClass('active');
  }
});

// Click on the slide to advance
$('.swipe-wrap>div, .arrow-next').click(function (e) {
    e.preventDefault();
    slider.next();
}) 