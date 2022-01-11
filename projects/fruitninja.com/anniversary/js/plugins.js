/*
 * Fastclick
 */
!function(){"use strict";function a(c,d){function f(a,b){return function(){return a.apply(b,arguments)}}var e;if(d=d||{},this.trackingClick=!1,this.trackingClickStart=0,this.targetElement=null,this.touchStartX=0,this.touchStartY=0,this.lastTouchIdentifier=0,this.touchBoundary=d.touchBoundary||10,this.layer=c,this.tapDelay=d.tapDelay||200,!a.notNeeded(c)){for(var g=["onMouse","onClick","onTouchStart","onTouchMove","onTouchEnd","onTouchCancel"],h=this,i=0,j=g.length;j>i;i++)h[g[i]]=f(h[g[i]],h);b&&(c.addEventListener("mouseover",this.onMouse,!0),c.addEventListener("mousedown",this.onMouse,!0),c.addEventListener("mouseup",this.onMouse,!0)),c.addEventListener("click",this.onClick,!0),c.addEventListener("touchstart",this.onTouchStart,!1),c.addEventListener("touchmove",this.onTouchMove,!1),c.addEventListener("touchend",this.onTouchEnd,!1),c.addEventListener("touchcancel",this.onTouchCancel,!1),Event.prototype.stopImmediatePropagation||(c.removeEventListener=function(a,b,d){var e=Node.prototype.removeEventListener;"click"===a?e.call(c,a,b.hijacked||b,d):e.call(c,a,b,d)},c.addEventListener=function(a,b,d){var e=Node.prototype.addEventListener;"click"===a?e.call(c,a,b.hijacked||(b.hijacked=function(a){a.propagationStopped||b(a)}),d):e.call(c,a,b,d)}),"function"==typeof c.onclick&&(e=c.onclick,c.addEventListener("click",function(a){e(a)},!1),c.onclick=null)}}var b=navigator.userAgent.indexOf("Android")>0,c=/iP(ad|hone|od)/.test(navigator.userAgent),d=c&&/OS 4_\d(_\d)?/.test(navigator.userAgent),e=c&&/OS ([6-9]|\d{2})_\d/.test(navigator.userAgent),f=navigator.userAgent.indexOf("BB10")>0;a.prototype.needsClick=function(a){switch(a.nodeName.toLowerCase()){case"button":case"select":case"textarea":if(a.disabled)return!0;break;case"input":if(c&&"file"===a.type||a.disabled)return!0;break;case"label":case"iframe":case"video":return!0}return/\bneedsclick\b/.test(a.className)},a.prototype.needsFocus=function(a){switch(a.nodeName.toLowerCase()){case"textarea":return!0;case"select":return!b;case"input":switch(a.type){case"button":case"checkbox":case"file":case"image":case"radio":case"submit":return!1}return!a.disabled&&!a.readOnly;default:return/\bneedsfocus\b/.test(a.className)}},a.prototype.sendClick=function(a,b){var c,d;document.activeElement&&document.activeElement!==a&&document.activeElement.blur(),d=b.changedTouches[0],c=document.createEvent("MouseEvents"),c.initMouseEvent(this.determineEventType(a),!0,!0,window,1,d.screenX,d.screenY,d.clientX,d.clientY,!1,!1,!1,!1,0,null),c.forwardedTouchEvent=!0,a.dispatchEvent(c)},a.prototype.determineEventType=function(a){return b&&"select"===a.tagName.toLowerCase()?"mousedown":"click"},a.prototype.focus=function(a){var b;c&&a.setSelectionRange&&0!==a.type.indexOf("date")&&"time"!==a.type&&"month"!==a.type?(b=a.value.length,a.setSelectionRange(b,b)):a.focus()},a.prototype.updateScrollParent=function(a){var b,c;if(b=a.fastClickScrollParent,!b||!b.contains(a)){c=a;do{if(c.scrollHeight>c.offsetHeight){b=c,a.fastClickScrollParent=c;break}c=c.parentElement}while(c)}b&&(b.fastClickLastScrollTop=b.scrollTop)},a.prototype.getTargetElementFromEventTarget=function(a){return a.nodeType===Node.TEXT_NODE?a.parentNode:a},a.prototype.onTouchStart=function(a){var b,e,f;if(a.targetTouches.length>1)return!0;if(b=this.getTargetElementFromEventTarget(a.target),e=a.targetTouches[0],c){if(f=window.getSelection(),f.rangeCount&&!f.isCollapsed)return!0;if(!d){if(e.identifier&&e.identifier===this.lastTouchIdentifier)return a.preventDefault(),!1;this.lastTouchIdentifier=e.identifier,this.updateScrollParent(b)}}return this.trackingClick=!0,this.trackingClickStart=a.timeStamp,this.targetElement=b,this.touchStartX=e.pageX,this.touchStartY=e.pageY,a.timeStamp-this.lastClickTime<this.tapDelay&&a.preventDefault(),!0},a.prototype.touchHasMoved=function(a){var b=a.changedTouches[0],c=this.touchBoundary;return Math.abs(b.pageX-this.touchStartX)>c||Math.abs(b.pageY-this.touchStartY)>c?!0:!1},a.prototype.onTouchMove=function(a){return this.trackingClick?((this.targetElement!==this.getTargetElementFromEventTarget(a.target)||this.touchHasMoved(a))&&(this.trackingClick=!1,this.targetElement=null),!0):!0},a.prototype.findControl=function(a){return void 0!==a.control?a.control:a.htmlFor?document.getElementById(a.htmlFor):a.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")},a.prototype.onTouchEnd=function(a){var f,g,h,i,j,k=this.targetElement;if(!this.trackingClick)return!0;if(a.timeStamp-this.lastClickTime<this.tapDelay)return this.cancelNextClick=!0,!0;if(this.cancelNextClick=!1,this.lastClickTime=a.timeStamp,g=this.trackingClickStart,this.trackingClick=!1,this.trackingClickStart=0,e&&(j=a.changedTouches[0],k=document.elementFromPoint(j.pageX-window.pageXOffset,j.pageY-window.pageYOffset)||k,k.fastClickScrollParent=this.targetElement.fastClickScrollParent),h=k.tagName.toLowerCase(),"label"===h){if(f=this.findControl(k)){if(this.focus(k),b)return!1;k=f}}else if(this.needsFocus(k))return a.timeStamp-g>100||c&&window.top!==window&&"input"===h?(this.targetElement=null,!1):(this.focus(k),this.sendClick(k,a),c&&"select"===h||(this.targetElement=null,a.preventDefault()),!1);return c&&!d&&(i=k.fastClickScrollParent,i&&i.fastClickLastScrollTop!==i.scrollTop)?!0:(this.needsClick(k)||(a.preventDefault(),this.sendClick(k,a)),!1)},a.prototype.onTouchCancel=function(){this.trackingClick=!1,this.targetElement=null},a.prototype.onMouse=function(a){return this.targetElement?a.forwardedTouchEvent?!0:a.cancelable?!this.needsClick(this.targetElement)||this.cancelNextClick?(a.stopImmediatePropagation?a.stopImmediatePropagation():a.propagationStopped=!0,a.stopPropagation(),a.preventDefault(),!1):!0:!0:!0},a.prototype.onClick=function(a){var b;return this.trackingClick?(this.targetElement=null,this.trackingClick=!1,!0):"submit"===a.target.type&&0===a.detail?!0:(b=this.onMouse(a),b||(this.targetElement=null),b)},a.prototype.destroy=function(){var a=this.layer;b&&(a.removeEventListener("mouseover",this.onMouse,!0),a.removeEventListener("mousedown",this.onMouse,!0),a.removeEventListener("mouseup",this.onMouse,!0)),a.removeEventListener("click",this.onClick,!0),a.removeEventListener("touchstart",this.onTouchStart,!1),a.removeEventListener("touchmove",this.onTouchMove,!1),a.removeEventListener("touchend",this.onTouchEnd,!1),a.removeEventListener("touchcancel",this.onTouchCancel,!1)},a.notNeeded=function(a){var c,d,e;if("undefined"==typeof window.ontouchstart)return!0;if(d=+(/Chrome\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1]){if(!b)return!0;if(c=document.querySelector("meta[name=viewport]")){if(-1!==c.content.indexOf("user-scalable=no"))return!0;if(d>31&&document.documentElement.scrollWidth<=window.outerWidth)return!0}}if(f&&(e=navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/),e[1]>=10&&e[2]>=3&&(c=document.querySelector("meta[name=viewport]")))){if(-1!==c.content.indexOf("user-scalable=no"))return!0;if(document.documentElement.scrollWidth<=window.outerWidth)return!0}return"none"===a.style.msTouchAction?!0:!1},a.attach=function(b,c){return new a(b,c)},"function"==typeof define&&"object"==typeof define.amd&&define.amd?define(function(){return a}):"undefined"!=typeof module&&module.exports?(module.exports=a.attach,module.exports.FastClick=a):window.FastClick=a}();

/**
 * jQuery Unveil
 * http://luis-almeida.github.com/unveil
 * Licensed under the MIT license.
 * Copyright 2013 Luís Almeida
 */
!function(a){a.fn.unveil=function(b,c){function j(){var b=h.filter(function(){var b=a(this);if(!b.is(":hidden")){var c=d.scrollTop(),f=c+d.height(),g=b.offset().top,h=g+b.height();return h>=c-e&&f+e>=g}});i=b.trigger("unveil"),h=h.not(i)}var i,d=a(window),e=b||0,f=window.devicePixelRatio>1,g=f?"data-src-retina":"data-src",h=this;return this.one("unveil",function(){var a=this.getAttribute(g);a=a||this.getAttribute("data-src"),a&&(this.setAttribute("src",a),"function"==typeof c&&c.call(this))}),d.on("scroll.unveil resize.unveil lookup.unveil",j),j(),this}}(window.jQuery||window.Zepto);