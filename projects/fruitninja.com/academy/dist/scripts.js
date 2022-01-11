var docWidth = $(document).width(); 
var docHeight = $(document).height(); 

var mobile = false;
var device = 'pc';

$(document).ready( function() {

  $('.mobile-modal').magnificPopup({
      type: 'inline',
      preloader: false,
      modal: true,
      disableOn: function() {
        if ( $(window).width() > 657) {
          return false;
        }
        return true;
      }
  });     
  
  // Modal for listing platforms and news
  $('.popup-modal').magnificPopup({
      type: 'inline',
      preloader: true,
      modal: true,
      callbacks: {
          open: function(){
              $(".container").addClass('blur');
              //$(this).find("img.hidden").reveal('fadeIn', 1000);
          },
          close: function(){
              $(".container").removeClass('blur');
          }
      }
  });
  
  $('.image-modal').magnificPopup({
    type: 'image',
    disableOn: 568,
    closeOnContentClick: true,
    mainClass: 'mfp-img-mobile',
    image: {
      verticalFit: true
    }
  }); 

  detectDevice();
  checkSize();
});

window.slider = Swipe(document.getElementById('swipe'), {
  startSlide: 0,
  continuous: true,
  // disableScroll: true,
  // stopPropagation: true,
  // callback: function(index, element) {},
  // transitionEnd: function(index, element) {}
});

// Eliminate the 300ms tap delay
if (window.addEventListener) {
    window.addEventListener('load', function() {
        FastClick.attach(document.body);
    }, false);
};


function checkSize() {
  // Set a flag for mobile or desktop size
};


// Detects the device the visitor is using
function detectDevice() {
  var storeLinks = [
  'http://appstore.com/fruitninjaacademy', 
  'http://play.google.com/store/apps/details?id=com.halfbrick.mathmaster'
]
  
  if (/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
    device = 'ios';
  }
  if (/Android/i.test(navigator.userAgent)) {
    device = 'android';
  }
  if (/Silk|Kindle|KFTT|KFOT/i.test(navigator.userAgent)) {
    device = 'kindle';
  }
  if (/BlackBerry|BB|PlayBook/i.test(navigator.userAgent)) {
    device = 'blackberry';
  }

  $('html').addClass(device);
  
  if (device == 'ios') {
    $('#app-icon').attr('href',storeLinks[0]);    
  } else if (device == 'android') {
    $('#app-icon').attr('href',storeLinks[1]);    
  }

};


(function($){
    $.fn.reveal = function(){
        var args = Array.prototype.slice.call(arguments);
        return this.each(function(){
            var img = $(this),
                src = img.data("src");
            src && img.attr("src", src).load(function(){
                img[args[0]||"show"].apply(img, args.splice(1));
            });
        });
    }
}(jQuery));


!function(){"use strict";function a(c,d){function f(a,b){return function(){return a.apply(b,arguments)}}var e;if(d=d||{},this.trackingClick=!1,this.trackingClickStart=0,this.targetElement=null,this.touchStartX=0,this.touchStartY=0,this.lastTouchIdentifier=0,this.touchBoundary=d.touchBoundary||10,this.layer=c,this.tapDelay=d.tapDelay||200,!a.notNeeded(c)){for(var g=["onMouse","onClick","onTouchStart","onTouchMove","onTouchEnd","onTouchCancel"],h=this,i=0,j=g.length;j>i;i++)h[g[i]]=f(h[g[i]],h);b&&(c.addEventListener("mouseover",this.onMouse,!0),c.addEventListener("mousedown",this.onMouse,!0),c.addEventListener("mouseup",this.onMouse,!0)),c.addEventListener("click",this.onClick,!0),c.addEventListener("touchstart",this.onTouchStart,!1),c.addEventListener("touchmove",this.onTouchMove,!1),c.addEventListener("touchend",this.onTouchEnd,!1),c.addEventListener("touchcancel",this.onTouchCancel,!1),Event.prototype.stopImmediatePropagation||(c.removeEventListener=function(a,b,d){var e=Node.prototype.removeEventListener;"click"===a?e.call(c,a,b.hijacked||b,d):e.call(c,a,b,d)},c.addEventListener=function(a,b,d){var e=Node.prototype.addEventListener;"click"===a?e.call(c,a,b.hijacked||(b.hijacked=function(a){a.propagationStopped||b(a)}),d):e.call(c,a,b,d)}),"function"==typeof c.onclick&&(e=c.onclick,c.addEventListener("click",function(a){e(a)},!1),c.onclick=null)}}var b=navigator.userAgent.indexOf("Android")>0,c=/iP(ad|hone|od)/.test(navigator.userAgent),d=c&&/OS 4_\d(_\d)?/.test(navigator.userAgent),e=c&&/OS ([6-9]|\d{2})_\d/.test(navigator.userAgent),f=navigator.userAgent.indexOf("BB10")>0;a.prototype.needsClick=function(a){switch(a.nodeName.toLowerCase()){case"button":case"select":case"textarea":if(a.disabled)return!0;break;case"input":if(c&&"file"===a.type||a.disabled)return!0;break;case"label":case"iframe":case"video":return!0}return/\bneedsclick\b/.test(a.className)},a.prototype.needsFocus=function(a){switch(a.nodeName.toLowerCase()){case"textarea":return!0;case"select":return!b;case"input":switch(a.type){case"button":case"checkbox":case"file":case"image":case"radio":case"submit":return!1}return!a.disabled&&!a.readOnly;default:return/\bneedsfocus\b/.test(a.className)}},a.prototype.sendClick=function(a,b){var c,d;document.activeElement&&document.activeElement!==a&&document.activeElement.blur(),d=b.changedTouches[0],c=document.createEvent("MouseEvents"),c.initMouseEvent(this.determineEventType(a),!0,!0,window,1,d.screenX,d.screenY,d.clientX,d.clientY,!1,!1,!1,!1,0,null),c.forwardedTouchEvent=!0,a.dispatchEvent(c)},a.prototype.determineEventType=function(a){return b&&"select"===a.tagName.toLowerCase()?"mousedown":"click"},a.prototype.focus=function(a){var b;c&&a.setSelectionRange&&0!==a.type.indexOf("date")&&"time"!==a.type&&"month"!==a.type?(b=a.value.length,a.setSelectionRange(b,b)):a.focus()},a.prototype.updateScrollParent=function(a){var b,c;if(b=a.fastClickScrollParent,!b||!b.contains(a)){c=a;do{if(c.scrollHeight>c.offsetHeight){b=c,a.fastClickScrollParent=c;break}c=c.parentElement}while(c)}b&&(b.fastClickLastScrollTop=b.scrollTop)},a.prototype.getTargetElementFromEventTarget=function(a){return a.nodeType===Node.TEXT_NODE?a.parentNode:a},a.prototype.onTouchStart=function(a){var b,e,f;if(a.targetTouches.length>1)return!0;if(b=this.getTargetElementFromEventTarget(a.target),e=a.targetTouches[0],c){if(f=window.getSelection(),f.rangeCount&&!f.isCollapsed)return!0;if(!d){if(e.identifier&&e.identifier===this.lastTouchIdentifier)return a.preventDefault(),!1;this.lastTouchIdentifier=e.identifier,this.updateScrollParent(b)}}return this.trackingClick=!0,this.trackingClickStart=a.timeStamp,this.targetElement=b,this.touchStartX=e.pageX,this.touchStartY=e.pageY,a.timeStamp-this.lastClickTime<this.tapDelay&&a.preventDefault(),!0},a.prototype.touchHasMoved=function(a){var b=a.changedTouches[0],c=this.touchBoundary;return Math.abs(b.pageX-this.touchStartX)>c||Math.abs(b.pageY-this.touchStartY)>c?!0:!1},a.prototype.onTouchMove=function(a){return this.trackingClick?((this.targetElement!==this.getTargetElementFromEventTarget(a.target)||this.touchHasMoved(a))&&(this.trackingClick=!1,this.targetElement=null),!0):!0},a.prototype.findControl=function(a){return void 0!==a.control?a.control:a.htmlFor?document.getElementById(a.htmlFor):a.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")},a.prototype.onTouchEnd=function(a){var f,g,h,i,j,k=this.targetElement;if(!this.trackingClick)return!0;if(a.timeStamp-this.lastClickTime<this.tapDelay)return this.cancelNextClick=!0,!0;if(this.cancelNextClick=!1,this.lastClickTime=a.timeStamp,g=this.trackingClickStart,this.trackingClick=!1,this.trackingClickStart=0,e&&(j=a.changedTouches[0],k=document.elementFromPoint(j.pageX-window.pageXOffset,j.pageY-window.pageYOffset)||k,k.fastClickScrollParent=this.targetElement.fastClickScrollParent),h=k.tagName.toLowerCase(),"label"===h){if(f=this.findControl(k)){if(this.focus(k),b)return!1;k=f}}else if(this.needsFocus(k))return a.timeStamp-g>100||c&&window.top!==window&&"input"===h?(this.targetElement=null,!1):(this.focus(k),this.sendClick(k,a),c&&"select"===h||(this.targetElement=null,a.preventDefault()),!1);return c&&!d&&(i=k.fastClickScrollParent,i&&i.fastClickLastScrollTop!==i.scrollTop)?!0:(this.needsClick(k)||(a.preventDefault(),this.sendClick(k,a)),!1)},a.prototype.onTouchCancel=function(){this.trackingClick=!1,this.targetElement=null},a.prototype.onMouse=function(a){return this.targetElement?a.forwardedTouchEvent?!0:a.cancelable?!this.needsClick(this.targetElement)||this.cancelNextClick?(a.stopImmediatePropagation?a.stopImmediatePropagation():a.propagationStopped=!0,a.stopPropagation(),a.preventDefault(),!1):!0:!0:!0},a.prototype.onClick=function(a){var b;return this.trackingClick?(this.targetElement=null,this.trackingClick=!1,!0):"submit"===a.target.type&&0===a.detail?!0:(b=this.onMouse(a),b||(this.targetElement=null),b)},a.prototype.destroy=function(){var a=this.layer;b&&(a.removeEventListener("mouseover",this.onMouse,!0),a.removeEventListener("mousedown",this.onMouse,!0),a.removeEventListener("mouseup",this.onMouse,!0)),a.removeEventListener("click",this.onClick,!0),a.removeEventListener("touchstart",this.onTouchStart,!1),a.removeEventListener("touchmove",this.onTouchMove,!1),a.removeEventListener("touchend",this.onTouchEnd,!1),a.removeEventListener("touchcancel",this.onTouchCancel,!1)},a.notNeeded=function(a){var c,d,e;if("undefined"==typeof window.ontouchstart)return!0;if(d=+(/Chrome\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1]){if(!b)return!0;if(c=document.querySelector("meta[name=viewport]")){if(-1!==c.content.indexOf("user-scalable=no"))return!0;if(d>31&&document.documentElement.scrollWidth<=window.outerWidth)return!0}}if(f&&(e=navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/),e[1]>=10&&e[2]>=3&&(c=document.querySelector("meta[name=viewport]")))){if(-1!==c.content.indexOf("user-scalable=no"))return!0;if(document.documentElement.scrollWidth<=window.outerWidth)return!0}return"none"===a.style.msTouchAction?!0:!1},a.attach=function(b,c){return new a(b,c)},"function"==typeof define&&"object"==typeof define.amd&&define.amd?define(function(){return a}):"undefined"!=typeof module&&module.exports?(module.exports=a.attach,module.exports.FastClick=a):window.FastClick=a}();
(function(a){var l,n,p,q,r,s,t,b="Close",c="BeforeAppend",d="MarkupParse",e="Open",f="Change",g="mfp",h="."+g,i="mfp-ready",j="mfp-removing",k="mfp-prevent-close",m=function(){},o=a(window),u=function(a,b){l.ev.on(g+a+h,b)},v=function(b,c,d,e){var f=document.createElement("div");return f.className="mfp-"+b,d&&(f.innerHTML=d),e?c&&c.appendChild(f):(f=a(f),c&&f.appendTo(c)),f},w=function(b,c){l.ev.triggerHandler(g+b,c),l.st.callbacks&&(b=b.charAt(0).toLowerCase()+b.slice(1),l.st.callbacks[b]&&l.st.callbacks[b].apply(l,a.isArray(c)?c:[c]))},x=function(){(l.st.focus?l.content.find(l.st.focus).eq(0):l.wrap).focus()},y=function(b){return b===t&&l.currTemplate.closeBtn||(l.currTemplate.closeBtn=a(l.st.closeMarkup.replace("%title%",l.st.tClose)),t=b),l.currTemplate.closeBtn};m.prototype={constructor:m,init:function(){var b=navigator.appVersion;l.isIE7=-1!==b.indexOf("MSIE 7."),l.isAndroid=/android/gi.test(b),l.isIOS=/iphone|ipad|ipod/gi.test(b),l.probablyMobile=l.isAndroid||l.isIOS||/(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent),p=a(document.body),q=a(document),l.popupsCache={}},open:function(b){if(!l.isOpen){var c;if(l.types=[],s="",l.ev=b.el||q,b.isObj)l.index=b.index||0;else{l.index=0;var g,f=b.items;for(c=0;f.length>c;c++)if(g=f[c],g.parsed&&(g=g.el[0]),g===b.el[0]){l.index=c;break}}b.key?(l.popupsCache[b.key]||(l.popupsCache[b.key]={}),l.currTemplate=l.popupsCache[b.key]):l.currTemplate={},l.st=a.extend(!0,{},a.magnificPopup.defaults,b),l.fixedContentPos="auto"===l.st.fixedContentPos?!l.probablyMobile:l.st.fixedContentPos,l.items=b.items.length?b.items:[b.items],l.bgOverlay||(l.bgOverlay=v("bg").on("click"+h,function(){l.close()}),l.wrap=v("wrap").attr("tabindex",-1).on("click"+h,function(b){var c=b.target;a(c).hasClass(k)||(l.st.closeOnContentClick?l.close():(!l.content||a(c).hasClass("mfp-close")||l.preloader&&b.target===l.preloader[0]||c!==l.content[0]&&!a.contains(l.content[0],c))&&l.close())}),l.container=v("container",l.wrap)),l.contentContainer=v("content"),l.st.preloader&&(l.preloader=v("preloader",l.container,l.st.tLoading));var j=a.magnificPopup.modules;for(c=0;j.length>c;c++){var m=j[c];m=m.charAt(0).toUpperCase()+m.slice(1),l["init"+m].call(l)}w("BeforeOpen"),l.st.closeBtnInside?(u(d,function(a,b,c,d){c.close_replaceWith=y(d.type)}),s+=" mfp-close-btn-in"):l.wrap.append(y()),l.st.alignTop&&(s+=" mfp-align-top"),l.fixedContentPos?l.wrap.css({overflow:l.st.overflowY,overflowX:"hidden",overflowY:l.st.overflowY}):l.wrap.css({top:o.scrollTop(),position:"absolute"}),(l.st.fixedBgPos===!1||"auto"===l.st.fixedBgPos&&!l.fixedContentPos)&&l.bgOverlay.css({height:q.height(),position:"absolute"}),q.on("keyup"+h,function(a){27===a.keyCode&&l.close()}),o.on("resize"+h,function(){l.updateSize()}),l.st.closeOnContentClick||(s+=" mfp-auto-cursor"),s&&l.wrap.addClass(s);var n=l.wH=o.height(),r={};if(l.fixedContentPos&&"scroll"!==l.st.overflowY){var t=l._getScrollbarSize();t&&(r.paddingRight=t)}l.fixedContentPos&&(l.isIE7?a("body, html").css("overflow","hidden"):r.overflow="hidden");var z=l.st.mainClass;l.isIE7&&(z+=" mfp-ie7"),z&&l._addClassToMFP(z),l.updateItemHTML(),w("BuildControls"),p.css(r),l.bgOverlay.add(l.wrap).prependTo(document.body),l._lastFocusedEl=document.activeElement,setTimeout(function(){l.content?(l._addClassToMFP(i),x()):l.bgOverlay.addClass(i),q.on("focusin"+h,function(b){return b.target===l.wrap[0]||a.contains(l.wrap[0],b.target)?void 0:(x(),!1)})},16),l.isOpen=!0,l.updateSize(n),w(e)}},close:function(){l.isOpen&&(l.isOpen=!1,l.st.removalDelay?(l._addClassToMFP(j),setTimeout(function(){l._close()},l.st.removalDelay)):l._close())},_close:function(){w(b);var c=j+" "+i+" ";if(l.bgOverlay.detach(),l.wrap.detach(),l.container.empty(),l.st.mainClass&&(c+=l.st.mainClass+" "),l._removeClassFromMFP(c),l.fixedContentPos){var d={paddingRight:0};l.isIE7?a("body, html").css("overflow","auto"):d.overflow="visible",p.css(d)}q.off("keyup"+h+" focusin"+h),l.ev.off(h),l.wrap.attr("class","mfp-wrap").removeAttr("style"),l.bgOverlay.attr("class","mfp-bg"),l.container.attr("class","mfp-container"),l.st.closeBtnInside&&l.currTemplate[l.currItem.type]!==!0||l.currTemplate.closeBtn&&l.currTemplate.closeBtn.detach(),l._lastFocusedEl&&a(l._lastFocusedEl).focus(),l.content=null,l.currTemplate=null,l.prevHeight=0},updateSize:function(a){if(l.isIOS){var b=document.documentElement.clientWidth/window.innerWidth,c=window.innerHeight*b;l.wrap.css("height",c),l.wH=c}else l.wH=a||o.height();w("Resize")},updateItemHTML:function(){var b=l.items[l.index];l.contentContainer.detach(),l.content&&l.content.detach(),b.parsed||(b=l.parseEl(l.index)),l.currItem=b;var c=b.type;if(!l.currTemplate[c]){var d=l.st[c]?l.st[c].markup:!1;w("FirstMarkupParse",d),l.currTemplate[c]=d?a(d):!0}r&&r!==b.type&&l.container.removeClass("mfp-"+r+"-holder");var e=l["get"+c.charAt(0).toUpperCase()+c.slice(1)](b,l.currTemplate[c]);l.appendContent(e,c),b.preloaded=!0,w(f,b),r=b.type,l.container.prepend(l.contentContainer)},appendContent:function(a,b){l.content=a,a?l.st.closeBtnInside&&l.currTemplate[b]===!0?l.content.find(".mfp-close").length||l.content.append(y()):l.content=a:l.content="",w(c),l.container.addClass("mfp-"+b+"-holder"),l.contentContainer.append(l.content)},parseEl:function(b){var c=l.items[b],d=c.type;if(c=c.tagName?{el:a(c)}:{data:c,src:c.src},c.el){for(var e=l.types,f=0;e.length>f;f++)if(c.el.hasClass("mfp-"+e[f])){d=e[f];break}c.src=c.el.attr("data-mfp-src"),c.src||(c.src=c.el.attr("href"))}return c.type=d||l.st.type,c.index=b,c.parsed=!0,l.items[b]=c,w("ElementParse",c),l.items[b]},addGroup:function(b,c){var d=function(d){var e=void 0!==c.midClick?c.midClick:a.magnificPopup.defaults.midClick;if(e||2!==d.which){var f=void 0!==c.disableOn?c.disableOn:a.magnificPopup.defaults.disableOn;if(f)if(a.isFunction(f)){if(!f.call(l))return!0}else if(f>a(window).width())return!0;d.preventDefault(),c.el=a(this),c.mainEl=b,c.delegate&&(c.items=b.find(c.delegate)),l.open(c)}};c||(c={});var e="click.magnificPopup";c.items?(c.isObj=!0,b.off(e).on(e,d)):(c.isObj=!1,c.delegate?b.off(e).on(e,c.delegate,d):(c.items=b,b.off(e).on(e,d)))},updateStatus:function(a,b){if(l.preloader){n!==a&&l.container.removeClass("mfp-s-"+n),b||"loading"!==a||(b=l.st.tLoading);var c={status:a,text:b};w("UpdateStatus",c),a=c.status,b=c.text,l.preloader.html(b),l.preloader.find("a").click(function(a){a.stopImmediatePropagation()}),l.container.addClass("mfp-s-"+a),n=a}},_addClassToMFP:function(a){l.bgOverlay.addClass(a),l.wrap.addClass(a)},_removeClassFromMFP:function(a){this.bgOverlay.removeClass(a),l.wrap.removeClass(a)},_hasScrollBar:function(a){return document.body.clientHeight>(a||o.height())?!0:!1},_parseMarkup:function(b,c,e){var f;e.data&&(c=a.extend(e.data,c)),w(d,[b,c,e]),a.each(c,function(a,c){if(void 0===c||c===!1)return!0;if(f=a.split("_"),f.length>1){var d=b.find(h+"-"+f[0]);if(d.length>0){var e=f[1];"replaceWith"===e?d[0]!==c[0]&&d.replaceWith(c):"img"===e?d.is("img")?d.attr("src",c):d.replaceWith('<img src="'+c+'" class="'+d.attr("class")+'" />'):d.attr(f[1],c)}}else b.find(h+"-"+a).html(c)})},_getScrollbarSize:function(){if(void 0===l.scrollbarSize){var a=document.createElement("div");a.id="mfp-sbm",a.style.cssText="width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;",document.body.appendChild(a),l.scrollbarSize=a.offsetWidth-a.clientWidth,document.body.removeChild(a)}return l.scrollbarSize}},a.magnificPopup={instance:null,proto:m.prototype,modules:[],open:function(b,c){return a.magnificPopup.instance||(l=new m,l.init(),a.magnificPopup.instance=l),b||(b={}),b.isObj=!0,b.index=void 0===c?0:c,this.instance.open(b)},close:function(){return a.magnificPopup.instance.close()},registerModule:function(b,c){c.options&&(a.magnificPopup.defaults[b]=c.options),a.extend(this.proto,c.proto),this.modules.push(b)},defaults:{disableOn:0,key:null,midClick:!1,mainClass:"",preloader:!0,focus:"",closeOnContentClick:!1,closeBtnInside:!0,alignTop:!1,removalDelay:0,fixedContentPos:"auto",fixedBgPos:"auto",overflowY:"auto",closeMarkup:'<button title="%title%" type="button" class="mfp-close">&times;</button>',tClose:"Close (Esc)",tLoading:"Loading..."}},a.fn.magnificPopup=function(b){return a.magnificPopup.instance||(l=new m,l.init(),a.magnificPopup.instance=l),l.addGroup(a(this),b),a(this)};var A,z="inline";a.magnificPopup.registerModule(z,{options:{hiddenClass:g+"-hide",markup:"",tNotFound:"Content not found"},proto:{initInline:function(){l.types.push(z),A=!1,u(b+"."+z,function(){var a=l.currItem;if(a.type===z){if(A)for(var b=0;l.items.length>b;b++)a=l.items[b],a&&a.inlinePlaceholder&&a.inlinePlaceholder.after(a.inlineElement.addClass(l.st.inline.hiddenClass)).detach();a.inlinePlaceholder=a.inlineElement=null}})},getInline:function(b,c){if(l.updateStatus("ready"),b.src){var d=l.st.inline;return"string"!=typeof b.src&&(b.isElement=!0),b.isElement||b.inlinePlaceholder||(b.inlinePlaceholder=v(d.hiddenClass)),b.isElement?b.inlineElement=b.src:b.inlineElement||(b.inlineElement=a(b.src),b.inlineElement.length||(l.updateStatus("error",d.tNotFound),b.inlineElement=a("<div>"))),b.inlinePlaceholder&&(A=!0),b.inlineElement.after(b.inlinePlaceholder).detach().removeClass(d.hiddenClass),b.inlineElement}return l._parseMarkup(c,{},b),c}}});var C,B="ajax",D=function(){C&&p.removeClass(C)};a.magnificPopup.registerModule(B,{options:{settings:null,cursor:"mfp-ajax-cur",tError:'<a href="%url%">The content</a> could not be loaded.'},proto:{initAjax:function(){l.types.push(B),C=l.st.ajax.cursor,u(b+"."+B,function(){D(),l.req&&l.req.abort()})},getAjax:function(b){C&&p.addClass(C),l.updateStatus("loading");var c=a.extend({url:b.src,success:function(c,d,e){w("ParseAjax",e),l.appendContent(a(e.responseText),B),b.finished=!0,D(),x(),setTimeout(function(){l.wrap.addClass(i)},16),l.updateStatus("ready")},error:function(){D(),b.finished=b.loadError=!0,l.updateStatus("error",l.st.ajax.tError.replace("%url%",b.src))}},l.st.ajax.settings);return l.req=a.ajax(c),""}}});var E,F=function(b){if(b.data&&void 0!==b.data.title)return b.data.title;var c=l.st.image.titleSrc;if(c){if(a.isFunction(c))return c.call(l,b);if(b.el)return b.el.attr(c)||""}return""};a.magnificPopup.registerModule("image",{options:{markup:'<div class="mfp-figure"><div class="mfp-close"></div><div class="mfp-img"></div><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></div>',cursor:"mfp-zoom-out-cur",titleSrc:"title",verticalFit:!0,tError:'<a href="%url%">The image</a> could not be loaded.'},proto:{initImage:function(){var a=l.st.image,c=".image";l.types.push("image"),u(e+c,function(){"image"===l.currItem.type&&a.cursor&&p.addClass(a.cursor)}),u(b+c,function(){a.cursor&&p.removeClass(a.cursor),o.off("resize"+h)}),u("Resize"+c,function(){l.resizeImage()})},resizeImage:function(){var a=l.currItem;a.img&&l.st.image.verticalFit&&a.img.css("max-height",l.wH+"px")},_onImageHasSize:function(a){a.img&&(a.hasSize=!0,E&&clearInterval(E),a.isCheckingImgSize=!1,w("ImageHasSize",a),a.imgHidden&&(l.content&&l.content.removeClass("mfp-loading"),a.imgHidden=!1))},findImageSize:function(a){var b=0,c=a.img[0],d=function(e){E&&clearInterval(E),E=setInterval(function(){return c.naturalWidth>0?(l._onImageHasSize(a),void 0):(b>200&&clearInterval(E),b++,3===b?d(10):40===b?d(50):100===b&&d(500),void 0)},e)};d(1)},getImage:function(b,c){var d=0,e=function(){b&&(b.img[0].complete?(b.img.off(".mfploader"),b===l.currItem&&(l._onImageHasSize(b),l.updateStatus("ready")),b.hasSize=!0,b.loaded=!0):(d++,200>d?setTimeout(e,100):f()))},f=function(){b&&(b.img.off(".mfploader"),b===l.currItem&&(l._onImageHasSize(b),l.updateStatus("error",g.tError.replace("%url%",b.src))),b.hasSize=!0,b.loaded=!0,b.loadError=!0)},g=l.st.image,h=c.find(".mfp-img");if(h.length){var i=new Image;i.className="mfp-img",b.img=a(i).on("load.mfploader",e).on("error.mfploader",f),i.src=b.src,h.is("img")&&(b.img=b.img.clone())}return l._parseMarkup(c,{title:F(b),img_replaceWith:b.img},b),l.resizeImage(),b.hasSize?(E&&clearInterval(E),b.loadError?(c.addClass("mfp-loading"),l.updateStatus("error",g.tError.replace("%url%",b.src))):(c.removeClass("mfp-loading"),l.updateStatus("ready")),c):(l.updateStatus("loading"),b.loading=!0,b.hasSize||(b.imgHidden=!0,c.addClass("mfp-loading"),l.findImageSize(b)),c)}}});var G="iframe",H=function(a){if(l.isIE7&&l.currItem&&l.currItem.type===G){var b=l.content.find("iframe");b.length&&b.css("display",a?"block":"none")}};a.magnificPopup.registerModule(G,{options:{markup:'<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe></div>',srcAction:"iframe_src",patterns:{youtube:{index:"youtube.com",id:"v=",src:"//www.youtube.com/embed/%id%?autoplay=1"},vimeo:{index:"vimeo.com/",id:"/",src:"//player.vimeo.com/video/%id%?autoplay=1"},gmaps:{index:"//maps.google.",src:"%id%&output=embed"}}},proto:{initIframe:function(){l.types.push(G),H(!0),u(b+"."+G,function(){H()})},getIframe:function(b,c){var d=b.src,e=l.st.iframe;a.each(e.patterns,function(){return d.indexOf(this.index)>-1?(this.id&&(d="string"==typeof this.id?d.substr(d.lastIndexOf(this.id)+this.id.length,d.length):this.id.call(this,d)),d=this.src.replace("%id%",d),!1):void 0});var f={};return e.srcAction&&(f[e.srcAction]=d),l._parseMarkup(c,f,b),l.updateStatus("ready"),c}}});var I=function(a){var b=l.items.length;return a>b-1?a-b:0>a?b+a:a},J=function(a,b,c){return a.replace("%curr%",b+1).replace("%total%",c)};a.magnificPopup.registerModule("gallery",{options:{enabled:!1,arrowMarkup:'<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',preload:[0,2],navigateByImgClick:!0,arrows:!0,tPrev:"Previous (Left arrow key)",tNext:"Next (Right arrow key)",tCounter:"%curr% of %total%"},proto:{initGallery:function(){var c=l.st.gallery,g=".mfp-gallery",h=Boolean(a.fn.mfpFastClick);return l.direction=!0,c&&c.enabled?(s+=" mfp-gallery",u(e+g,function(){c.navigateByImgClick&&l.wrap.on("click"+g,".mfp-img",function(){return l.next(),!1}),q.on("keydown"+g,function(a){37===a.keyCode?l.prev():39===a.keyCode&&l.next()})}),u("UpdateStatus"+g,function(a,b){b.text&&(b.text=J(b.text,l.currItem.index,l.items.length))}),u(d+g,function(a,b,d,e){var f=l.items.length;d.counter=f?J(c.tCounter,e.index,f):""}),u("BuildControls"+g,function(){if(c.arrows&&!l.arrowLeft){var b=c.arrowMarkup,d=l.arrowLeft=a(b.replace("%title%",c.tPrev).replace("%dir%","left")).addClass(k),e=l.arrowRight=a(b.replace("%title%",c.tNext).replace("%dir%","right")).addClass(k),f=h?"mfpFastClick":"click";d[f](function(){l.prev()}),e[f](function(){l.next()}),l.isIE7&&(v("b",d[0],!1,!0),v("a",d[0],!1,!0),v("b",e[0],!1,!0),v("a",e[0],!1,!0)),l.container.append(d.add(e))}}),u(f+g,function(){l._preloadTimeout&&clearTimeout(l._preloadTimeout),l._preloadTimeout=setTimeout(function(){l.preloadNearbyImages(),l._preloadTimeout=null},16)}),u(b+g,function(){q.off(g),l.wrap.off("click"+g),h&&l.arrowLeft.add(l.arrowRight).destroyMfpFastClick(),l.arrowRight=l.arrowLeft=null}),void 0):!1},next:function(){l.direction=!0,l.index=I(l.index+1),l.updateItemHTML()},prev:function(){l.direction=!1,l.index=I(l.index-1),l.updateItemHTML()},goTo:function(a){l.direction=a>=l.index,l.index=a,l.updateItemHTML()},preloadNearbyImages:function(){var d,a=l.st.gallery.preload,b=Math.min(a[0],l.items.length),c=Math.min(a[1],l.items.length);for(d=1;(l.direction?c:b)>=d;d++)l._preloadItem(l.index+d);for(d=1;(l.direction?b:c)>=d;d++)l._preloadItem(l.index-d)},_preloadItem:function(b){if(b=I(b),!l.items[b].preloaded){var c=l.items[b];c.parsed||(c=l.parseEl(b)),w("LazyLoad",c),"image"===c.type&&(c.img=a('<img class="mfp-img" />').on("load.mfploader",function(){c.hasSize=!0}).on("error.mfploader",function(){c.hasSize=!0,c.loadError=!0}).attr("src",c.src)),c.preloaded=!0}}}});var K="retina";a.magnificPopup.registerModule(K,{options:{replaceSrc:function(a){return a.src.replace(/\.\w+$/,function(a){return"@2x"+a})},ratio:1},proto:{initRetina:function(){if(window.devicePixelRatio>1){var a=l.st.retina,b=a.ratio;b=isNaN(b)?b():b,b>1&&(u("ImageHasSize."+K,function(a,c){c.img.css({"max-width":c.img[0].naturalWidth/b,width:"100%"})}),u("ElementParse."+K,function(c,d){d.src=a.replaceSrc(d,b)}))}}}})})(window.jQuery||window.Zepto);
/*
 * Swipe 2.0
 *
 * Brad Birdsall
 * Copyright 2013, MIT License
 *
*/

function Swipe(a,b){"use strict";function m(){g=f.children,j=g.length,g.length<2&&(b.continuous=!1),e.transitions&&b.continuous&&g.length<3&&(f.appendChild(g[0].cloneNode(!0)),f.appendChild(f.children[1].cloneNode(!0)),g=f.children),h=new Array(g.length),i=a.getBoundingClientRect().width||a.offsetWidth,f.style.width=g.length*i+"px";for(var c=g.length;c--;){var d=g[c];d.style.width=i+"px",d.setAttribute("data-index",c),e.transitions&&(d.style.left=c*-i+"px",r(c,k>c?-i:c>k?i:0,0))}b.continuous&&e.transitions&&(r(p(k-1),-i,0),r(p(k+1),i,0)),e.transitions||(f.style.left=k*-i+"px"),a.style.visibility="visible"}function n(){b.continuous?q(k-1):k&&q(k-1)}function o(){b.continuous?q(k+1):k<g.length-1&&q(k+1)}function p(a){return(g.length+a%g.length)%g.length}function q(a,c){if(k!=a){if(e.transitions){var f=Math.abs(k-a)/(k-a);if(b.continuous){var j=f;f=-h[p(a)]/i,f!==j&&(a=-f*g.length+a)}for(var m=Math.abs(k-a)-1;m--;)r(p((a>k?a:k)-m-1),i*f,0);a=p(a),r(k,i*f,c||l),r(a,0,c||l),b.continuous&&r(p(a-f),-(i*f),0)}else a=p(a),t(k*-i,a*-i,c||l);k=a,d(b.callback&&b.callback(k,g[k]))}}function r(a,b,c){s(a,b,c),h[a]=b}function s(a,b,c){var d=g[a],e=d&&d.style;e&&(e.webkitTransitionDuration=e.MozTransitionDuration=e.msTransitionDuration=e.OTransitionDuration=e.transitionDuration=c+"ms",e.webkitTransform="translate("+b+"px,0)"+"translateZ(0)",e.msTransform=e.MozTransform=e.OTransform="translateX("+b+"px)")}function t(a,c,d){if(!d)return f.style.left=c+"px",void 0;var e=+new Date,h=setInterval(function(){var i=+new Date-e;return i>d?(f.style.left=c+"px",u&&w(),b.transitionEnd&&b.transitionEnd.call(event,k,g[k]),clearInterval(h),void 0):(f.style.left=(c-a)*(Math.floor(100*(i/d))/100)+a+"px",void 0)},4)}function w(){v=setTimeout(o,u)}function x(){u=0,clearTimeout(v)}var c=function(){},d=function(a){setTimeout(a||c,0)},e={addEventListener:!!window.addEventListener,touch:"ontouchstart"in window||window.DocumentTouch&&document instanceof DocumentTouch,transitions:function(a){var b=["transitionProperty","WebkitTransition","MozTransition","OTransition","msTransition"];for(var c in b)if(void 0!==a.style[b[c]])return!0;return!1}(document.createElement("swipe"))};if(a){var g,h,i,j,f=a.children[0];b=b||{};var k=parseInt(b.startSlide,10)||0,l=b.speed||300;b.continuous=void 0!==b.continuous?b.continuous:!0;var v,A,u=b.auto||0,y={},z={},B={handleEvent:function(a){switch(a.type){case"touchstart":this.start(a);break;case"touchmove":this.move(a);break;case"touchend":d(this.end(a));break;case"webkitTransitionEnd":case"msTransitionEnd":case"oTransitionEnd":case"otransitionend":case"transitionend":d(this.transitionEnd(a));break;case"resize":d(m)}b.stopPropagation&&a.stopPropagation()},start:function(a){var b=a.touches[0];y={x:b.pageX,y:b.pageY,time:+new Date},A=void 0,z={},f.addEventListener("touchmove",this,!1),f.addEventListener("touchend",this,!1)},move:function(a){if(!(a.touches.length>1||a.scale&&1!==a.scale)){b.disableScroll&&a.preventDefault();var c=a.touches[0];z={x:c.pageX-y.x,y:c.pageY-y.y},"undefined"==typeof A&&(A=!!(A||Math.abs(z.x)<Math.abs(z.y))),A||(a.preventDefault(),x(),b.continuous?(s(p(k-1),z.x+h[p(k-1)],0),s(k,z.x+h[k],0),s(p(k+1),z.x+h[p(k+1)],0)):(z.x=z.x/(!k&&z.x>0||k==g.length-1&&z.x<0?Math.abs(z.x)/i+1:1),s(k-1,z.x+h[k-1],0),s(k,z.x+h[k],0),s(k+1,z.x+h[k+1],0)))}},end:function(){var c=+new Date-y.time,d=Number(c)<250&&Math.abs(z.x)>20||Math.abs(z.x)>i/2,e=!k&&z.x>0||k==g.length-1&&z.x<0;b.continuous&&(e=!1);var j=z.x<0;A||(d&&!e?(j?(b.continuous?(r(p(k-1),-i,0),r(p(k+2),i,0)):r(k-1,-i,0),r(k,h[k]-i,l),r(p(k+1),h[p(k+1)]-i,l),k=p(k+1)):(b.continuous?(r(p(k+1),i,0),r(p(k-2),-i,0)):r(k+1,i,0),r(k,h[k]+i,l),r(p(k-1),h[p(k-1)]+i,l),k=p(k-1)),b.callback&&b.callback(k,g[k])):b.continuous?(r(p(k-1),-i,l),r(k,0,l),r(p(k+1),i,l)):(r(k-1,-i,l),r(k,0,l),r(k+1,i,l))),f.removeEventListener("touchmove",B,!1),f.removeEventListener("touchend",B,!1)},transitionEnd:function(a){parseInt(a.target.getAttribute("data-index"),10)==k&&(u&&w(),b.transitionEnd&&b.transitionEnd.call(a,k,g[k]))}};return m(),u&&w(),e.addEventListener?(e.touch&&f.addEventListener("touchstart",B,!1),e.transitions&&(f.addEventListener("webkitTransitionEnd",B,!1),f.addEventListener("msTransitionEnd",B,!1),f.addEventListener("oTransitionEnd",B,!1),f.addEventListener("otransitionend",B,!1),f.addEventListener("transitionend",B,!1)),window.addEventListener("resize",B,!1)):window.onresize=function(){m()},{setup:function(){m()},slide:function(a,b){x(),q(a,b)},prev:function(){x(),n()},next:function(){x(),o()},stop:function(){x()},getPos:function(){return k},getNumSlides:function(){return j},kill:function(){x(),f.style.width="",f.style.left="";for(var a=g.length;a--;){var b=g[a];b.style.width="",b.style.left="",e.transitions&&s(a,0,0)}e.addEventListener?(f.removeEventListener("touchstart",B,!1),f.removeEventListener("webkitTransitionEnd",B,!1),f.removeEventListener("msTransitionEnd",B,!1),f.removeEventListener("oTransitionEnd",B,!1),f.removeEventListener("otransitionend",B,!1),f.removeEventListener("transitionend",B,!1),window.removeEventListener("resize",B,!1)):window.onresize=null}}}}(window.jQuery||window.Zepto)&&function(a){a.fn.Swipe=function(b){return this.each(function(){a(this).data("Swipe",new Swipe(a(this)[0],b))})}}(window.jQuery||window.Zepto);
