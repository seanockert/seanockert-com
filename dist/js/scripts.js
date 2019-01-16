(function(){'use strict';var f,g=[];function l(a){g.push(a);1==g.length&&f()}function m(){for(;g.length;)g[0](),g.shift()}f=function(){setTimeout(m)};function n(a){this.a=p;this.b=void 0;this.f=[];var b=this;try{a(function(a){q(b,a)},function(a){r(b,a)})}catch(c){r(b,c)}}var p=2;function t(a){return new n(function(b,c){c(a)})}function u(a){return new n(function(b){b(a)})}function q(a,b){if(a.a==p){if(b==a)throw new TypeError;var c=!1;try{var d=b&&b.then;if(null!=b&&"object"==typeof b&&"function"==typeof d){d.call(b,function(b){c||q(a,b);c=!0},function(b){c||r(a,b);c=!0});return}}catch(e){c||r(a,e);return}a.a=0;a.b=b;v(a)}}
function r(a,b){if(a.a==p){if(b==a)throw new TypeError;a.a=1;a.b=b;v(a)}}function v(a){l(function(){if(a.a!=p)for(;a.f.length;){var b=a.f.shift(),c=b[0],d=b[1],e=b[2],b=b[3];try{0==a.a?"function"==typeof c?e(c.call(void 0,a.b)):e(a.b):1==a.a&&("function"==typeof d?e(d.call(void 0,a.b)):b(a.b))}catch(h){b(h)}}})}n.prototype.g=function(a){return this.c(void 0,a)};n.prototype.c=function(a,b){var c=this;return new n(function(d,e){c.f.push([a,b,d,e]);v(c)})};
function w(a){return new n(function(b,c){function d(c){return function(d){h[c]=d;e+=1;e==a.length&&b(h)}}var e=0,h=[];0==a.length&&b(h);for(var k=0;k<a.length;k+=1)u(a[k]).c(d(k),c)})}function x(a){return new n(function(b,c){for(var d=0;d<a.length;d+=1)u(a[d]).c(b,c)})};window.Promise||(window.Promise=n,window.Promise.resolve=u,window.Promise.reject=t,window.Promise.race=x,window.Promise.all=w,window.Promise.prototype.then=n.prototype.c,window.Promise.prototype["catch"]=n.prototype.g);}());

(function(){function l(a,b){document.addEventListener?a.addEventListener("scroll",b,!1):a.attachEvent("scroll",b)}function m(a){document.body?a():document.addEventListener?document.addEventListener("DOMContentLoaded",function c(){document.removeEventListener("DOMContentLoaded",c);a()}):document.attachEvent("onreadystatechange",function k(){if("interactive"==document.readyState||"complete"==document.readyState)document.detachEvent("onreadystatechange",k),a()})};function q(a){this.a=document.createElement("div");this.a.setAttribute("aria-hidden","true");this.a.appendChild(document.createTextNode(a));this.b=document.createElement("span");this.c=document.createElement("span");this.h=document.createElement("span");this.f=document.createElement("span");this.g=-1;this.b.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";this.c.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";
this.f.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";this.h.style.cssText="display:inline-block;width:200%;height:200%;font-size:16px;max-width:none;";this.b.appendChild(this.h);this.c.appendChild(this.f);this.a.appendChild(this.b);this.a.appendChild(this.c)}
function w(a,b){a.a.style.cssText="max-width:none;min-width:20px;min-height:20px;display:inline-block;overflow:hidden;position:absolute;width:auto;margin:0;padding:0;top:-999px;left:-999px;white-space:nowrap;font:"+b+";"}function x(a){var b=a.a.offsetWidth,c=b+100;a.f.style.width=c+"px";a.c.scrollLeft=c;a.b.scrollLeft=a.b.scrollWidth+100;return a.g!==b?(a.g=b,!0):!1}function z(a,b){function c(){var a=k;x(a)&&null!==a.a.parentNode&&b(a.g)}var k=a;l(a.b,c);l(a.c,c);x(a)};function A(a,b){var c=b||{};this.family=a;this.style=c.style||"normal";this.weight=c.weight||"normal";this.stretch=c.stretch||"normal"}var B=null,C=null,D=null;function H(){if(null===C){var a=document.createElement("div");try{a.style.font="condensed 100px sans-serif"}catch(b){}C=""!==a.style.font}return C}function I(a,b){return[a.style,a.weight,H()?a.stretch:"","100px",b].join(" ")}
A.prototype.load=function(a,b){var c=this,k=a||"BESbswy",y=b||3E3,E=(new Date).getTime();return new Promise(function(a,b){null===D&&(D=!!document.fonts);if(D){var J=new Promise(function(a,b){function e(){(new Date).getTime()-E>=y?b():document.fonts.load(I(c,'"'+c.family+'"'),k).then(function(c){1<=c.length?a():setTimeout(e,25)},function(){b()})}e()}),K=new Promise(function(a,c){setTimeout(c,y)});Promise.race([K,J]).then(function(){a(c)},function(){b(c)})}else m(function(){function r(){var b;if(b=
-1!=f&&-1!=g||-1!=f&&-1!=h||-1!=g&&-1!=h)(b=f!=g&&f!=h&&g!=h)||(null===B&&(b=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent),B=!!b&&(536>parseInt(b[1],10)||536===parseInt(b[1],10)&&11>=parseInt(b[2],10))),b=B&&(f==t&&g==t&&h==t||f==u&&g==u&&h==u||f==v&&g==v&&h==v)),b=!b;b&&(null!==d.parentNode&&d.parentNode.removeChild(d),clearTimeout(G),a(c))}function F(){if((new Date).getTime()-E>=y)null!==d.parentNode&&d.parentNode.removeChild(d),b(c);else{var a=document.hidden;if(!0===a||
void 0===a)f=e.a.offsetWidth,g=n.a.offsetWidth,h=p.a.offsetWidth,r();G=setTimeout(F,50)}}var e=new q(k),n=new q(k),p=new q(k),f=-1,g=-1,h=-1,t=-1,u=-1,v=-1,d=document.createElement("div"),G=0;d.dir="ltr";w(e,I(c,"sans-serif"));w(n,I(c,"serif"));w(p,I(c,"monospace"));d.appendChild(e.a);d.appendChild(n.a);d.appendChild(p.a);document.body.appendChild(d);t=e.a.offsetWidth;u=n.a.offsetWidth;v=p.a.offsetWidth;F();z(e,function(a){f=a;r()});w(e,I(c,'"'+c.family+'",sans-serif'));z(n,function(a){g=a;r()});
w(n,I(c,'"'+c.family+'",serif'));z(p,function(a){h=a;r()});w(p,I(c,'"'+c.family+'",monospace'))})})};"undefined"!==typeof module?module.exports=A:(window.FontFaceObserver=A,window.FontFaceObserver.prototype.load=A.prototype.load);}());

/*window.onload = function() {
	if (localStorage.getItem('returnVisit')) {
		var intro = document.getElementById('i');
    if (intro) {
      intro.innerHTML = 'Hey, welcome back<span>.</span>'
    }
	} else {
		localStorage.setItem('returnVisit', 'true');	
	}
}*/

var isMobile = function() {
  if (window.innerWidth < 600 ||
      (navigator.userAgent.match(/Android/i) && window.innerWidth < 980) || 
      navigator.userAgent.match(/webOS/i) || 
      navigator.userAgent.match(/iPhone/i) || 
      navigator.userAgent.match(/BlackBerry/i) || 
      navigator.userAgent.match(/Windows Phone/i)
  ) {  
    return true;
  }
  return false;
} 

// Load fonts
(function(w){
  if (w.document.documentElement.className.indexOf('fonts-loaded') > -1){ return; }
  var bodyFont = new FontFaceObserver('Merriweather');
  var headerFont = new FontFaceObserver('Lato');
  Promise.all([bodyFont.load(), headerFont.load()]).then(function () {
    w.document.documentElement.className += ' fonts-loaded';
  });
}(this));
/*
if (!isMobile) {
  Barba.Pjax.start();
  Barba.Prefetch.init();

  Barba.Dispatcher.on('initStateChange', function() {
    var path = location.pathname;
    //console.log(path);
    if (path != '/') {
      ga('send', 'pageview', path);
      ga('send', 'event', 'pageview', path, '');
    }
  });


  var delay = 900;

  var SlideTransition = Barba.BaseTransition.extend({
    start: function() {
  	Promise.all([this.newContainerLoading, this.slideOut()]).then(this.slideIn.bind(this));
    },

    slideOut: function() {
    	var elem = this.oldContainer;
    	elem.classList.remove('transition-in');
  	elem.offsetWidth = elem.offsetWidth;
  	return elem.classList.add('transition-out');
      //.promise();
    },

    slideIn: function() {
      var _this = this;
      var elem = _this.newContainer;
      elem.classList.add('transition-in');
      elem.style.visibility = 'visible';
      //elem.style.opacity = 0;
      window.scrollTo(0, 0);

      if (window.innerWidth < 512) {
      	delay = 300;	
      } else {
      	delay = 900;
      }

      var waitTime = window.setTimeout(function() {
      	_this.oldContainer.style.visibility = 'hidden';
      	_this.done();
      	window.clearTimeout(waitTime);
      	elem.classList.remove('transition-in');
  		elem.offsetWidth = elem.offsetWidth;
      }, delay) 
    }
  });


  Barba.Pjax.getTransition = function() {
    return SlideTransition;
  };
}
*/
/*
* smoothScroll 0.2.2
* A teeny tiny smooth scroll script with ease-in-out effect and no jQuery
* (c) 2015 Alice Lieutier
* https://github.com/alicelieutier/smoothScroll
*/

!function(e,t){"use strict";"function"==typeof define&&define.amd?define(t):"object"==typeof exports&&"object"==typeof module?module.exports=t():e.smoothScroll=t()}(this,function(){"use strict";if("object"==typeof window&&void 0!==document.querySelectorAll&&void 0!==window.pageYOffset&&void 0!==history.pushState){var e=function(e){return"HTML"===e.nodeName?-window.pageYOffset:e.getBoundingClientRect().top+window.pageYOffset},t=function(e){return.5>e?4*e*e*e:(e-1)*(2*e-2)*(2*e-2)+1},n=function(e,n,o,i){return o>i?n:e+(n-e)*t(o/i)},o=function(t,o,i,r){o=o||500,r=r||window;var u=window.pageYOffset;if("number"==typeof t)var a=parseInt(t);else var a=e(t);var d=Date.now(),f=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||function(e){window.setTimeout(e,15)},s=function(){var e=Date.now()-d;r!==window?r.scrollTop=n(u,a,e,o):window.scroll(0,n(u,a,e,o)),e>o?"function"==typeof i&&i(t):f(s)};s()},i=function(e){e.preventDefault(),location.hash!==this.hash&&window.history.pushState(null,null,this.hash),o(document.getElementById(this.hash.substring(1)),500,function(e){location.replace("#"+e.id)})};return document.addEventListener("DOMContentLoaded",function(){for(var e,t=document.querySelectorAll('a[href^="#"]:not([href="#"])'),n=t.length;e=t[--n];)e.addEventListener("click",i,!1)}),o}});