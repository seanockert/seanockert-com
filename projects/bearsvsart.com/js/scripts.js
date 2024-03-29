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
  
  Socialite.load();  
  
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
        duration: 300
      }
  }); 
  /*
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
          var pinItURL = "https://pinterest.com/pin/create/button/";
          // Refer to https://developers.pinterest.com/pin_it/
          pinItURL += '?url=' + 'https://bearsvsart.com/';
          pinItURL += '&media=' + item.el.attr('href');
          pinItURL += '&description=' + caption + ' from Bears vs. Art';
          
          return caption + '&nbsp;&nbsp;<a class="pin-it" href="'+pinItURL+'" target="_blank"><img src="https://assets.pinterest.com/images/pidgets/pin_it_button.png" /></a>';
        }
      }
  });
*/
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

/*!
 * Socialite v2.0
 * https://socialitejs.com
 * Copyright (c) 2011 David Bushell
 * Dual-licensed under the BSD or MIT licenses: https://socialitejs.com/license.txt
 */
window.Socialite=(function(f,g,d){var e=0,a=[],i={},h={},b=/^($|loaded|complete)/,j=f.encodeURIComponent;var c={settings:{},trim:function(k){return k.trim?k.trim():k.replace(/^\s+|\s+$/g,"")},hasClass:function(k,l){return(" "+k.className+" ").indexOf(" "+l+" ")!==-1},addClass:function(k,l){if(!c.hasClass(k,l)){k.className=(k.className==="")?l:k.className+" "+l}},removeClass:function(k,l){k.className=c.trim(" "+k.className+" ".replace(" "+l+" "," "))},extendObject:function(o,n,k){for(var m in n){var l=o[m]!==d;if(l&&typeof n[m]==="object"){c.extendObject(o[m],n[m],k)}else{if(k||!l){o[m]=n[m]}}}},getElements:function(l,p){var k=0,o=[],n=!!l.getElementsByClassName,m=n?l.getElementsByClassName(p):l.getElementsByTagName("*");for(;k<m.length;k++){if(n||c.hasClass(m[k],p)){o.push(m[k])}}return o},getDataAttributes:function(l,s,k){var o=0,q="",n={},p=l.attributes;for(;o<p.length;o++){var r=p[o].name,m=p[o].value;if(m.length&&r.indexOf("data-")===0){if(s){r=r.substring(5)}if(k){n[r]=m}else{q+=j(r)+"="+j(m)+"&"}}}return k?n:q},copyDataAttributes:function(p,o,n,m){var k=c.getDataAttributes(p,n,true);for(var l in k){o.setAttribute(m?l.replace(/-/g,"_"):l,k[l])}},createIframe:function(m,k){var l=g.createElement("iframe");l.style.cssText="overflow: hidden; border: none;";c.extendObject(l,{src:m,allowtransparency:"true",frameborder:"0",scrolling:"no"},true);if(k){l.onload=l.onreadystatechange=function(){if(b.test(l.readyState||"")){l.onload=l.onreadystatechange=null;c.activateInstance(k)}}}return l},networkReady:function(k){return i[k]?i[k].loaded:d},appendNetwork:function(k){if(!k||k.appended){return}if(typeof k.append==="function"&&k.append(k)===false){k.appended=k.loaded=true;c.activateAll(k);return}if(k.script){k.el=g.createElement("script");c.extendObject(k.el,k.script,true);k.el.async=true;k.el.onload=k.el.onreadystatechange=function(){if(b.test(k.el.readyState||"")){k.el.onload=k.el.onreadystatechange=null;k.loaded=true;if(typeof k.onload==="function"&&k.onload(k)===false){return}c.activateAll(k)}};g.body.appendChild(k.el)}k.appended=true},removeNetwork:function(k){if(!c.networkReady(k.name)){return false}if(k.el.parentNode){k.el.parentNode.removeChild(k.el)}return !(k.appended=k.loaded=false)},reloadNetwork:function(k){var l=i[k];if(l&&c.removeNetwork(l)){c.appendNetwork(l)}},createInstance:function(l,n){var m=true,k={el:l,uid:e++,widget:n};a.push(k);if(n.process!==d){m=(typeof n.process==="function")?n.process(k):false}if(m){c.processInstance(k)}k.el.setAttribute("data-socialite",k.uid);k.el.className="socialite "+n.name+" socialite-instance";return k},processInstance:function(k){var m=k.el;k.el=g.createElement("div");k.el.className=m.className;c.copyDataAttributes(m,k.el);if(m.nodeName.toLowerCase()==="a"&&!m.getAttribute("data-default-href")){k.el.setAttribute("data-default-href",m.getAttribute("href"))}var l=m.parentNode;l.insertBefore(k.el,m);l.removeChild(m)},activateInstance:function(k){if(k&&!k.loaded){k.loaded=true;if(typeof k.widget.activate==="function"){k.widget.activate(k)}c.addClass(k.el,"socialite-loaded");return k.onload?k.onload(k.el):null}},activateAll:function(m){if(typeof m==="string"){m=i[m]}for(var l=0;l<a.length;l++){var k=a[l];if(k.init&&k.widget.network===m){c.activateInstance(k)}}},load:function(m,n,s,p,l){m=(m&&typeof m==="object"&&m.nodeType===1)?m:g;if(!n||typeof n!=="object"){c.load(m,c.getElements(m,"socialite"),s,p,l);return}var q;if(/Array/.test(Object.prototype.toString.call(n))){for(q=0;q<n.length;q++){c.load(m,n[q],s,p,l)}return}if(n.nodeType!==1){return}if(!s||!h[s]){s=null;var o=n.className.split(" ");for(q=0;q<o.length;q++){if(h[o[q]]){s=o[q];break}}if(!s){return}}var u,r=h[s],k=parseInt(n.getAttribute("data-socialite"),10);if(!isNaN(k)){for(q=0;q<a.length;q++){if(a[q].uid===k){u=a[q];break}}}else{u=c.createInstance(n,r)}if(l||!u){return}if(!u.init){u.init=true;u.onload=(typeof p==="function")?p:null;r.init(u)}if(!r.network.appended){c.appendNetwork(r.network)}else{if(c.networkReady(r.network.name)){c.activateInstance(u)}}},activate:function(l,k,m){f.Socialite.load(null,l,k,m)},process:function(l,m,k){f.Socialite.load(l,m,k,null,true)},network:function(l,k){i[l]={name:l,el:null,appended:false,loaded:false,widgets:{}};if(k){c.extendObject(i[l],k)}},widget:function(m,k,l){l.name=m+"-"+k;if(!i[m]||h[l.name]){return}l.network=i[m];i[m].widgets[k]=h[l.name]=l},setup:function(k){c.extendObject(c.settings,k,true)}};return c})(window,window.document);(function(g,h,d,c){d.setup({facebook:{lang:"en_GB",appId:null},twitter:{lang:"en"},googleplus:{lang:"en-GB"}});d.network("facebook",{script:{src:"//connect.facebook.net/{{language}}/all.js",id:"facebook-jssdk"},append:function(o){var n=h.createElement("div"),m=d.settings.facebook,l={onlike:"edge.create",onunlike:"edge.remove",onsend:"message.send"};n.id="fb-root";h.body.appendChild(n);o.script.src=o.script.src.replace("{{language}}",m.lang);g.fbAsyncInit=function(){g.FB.init({appId:m.appId,xfbml:true});for(var p in l){if(typeof m[p]==="function"){g.FB.Event.subscribe(l[p],m[p])}}}}});var j=function(l){var m=h.createElement("div");m.className=l.widget.fbtype;d.copyDataAttributes(l.el,m);l.el.appendChild(m);if(g.FB&&g.FB.XFBML){g.FB.XFBML.parse(l.el)}};d.widget("facebook","like",{init:j,fbtype:"fb-like"});d.widget("facebook","share",{init:j,fbtype:"fb-share-button"});d.network("twitter",{script:{src:"//platform.twitter.com/widgets.js",id:"twitter-wjs",charset:"utf-8"},append:function(){var n=(typeof g.twttr!=="object"),m=d.settings.twitter,l=["click","tweet","retweet","favorite","follow"];if(n){g.twttr=(t={_e:[],ready:function(o){t._e.push(o)}})}g.twttr.ready(function(o){for(var p=0;p<l.length;p++){var q=l[p];if(typeof m["on"+q]==="function"){o.events.bind(q,m["on"+q])}}d.activateAll("twitter")});return n}});var f=function(l){var m=h.createElement("a");m.className=l.widget.name+"-button";d.copyDataAttributes(l.el,m);m.setAttribute("href",l.el.getAttribute("data-default-href"));m.setAttribute("data-lang",l.el.getAttribute("data-lang")||d.settings.twitter.lang);l.el.appendChild(m)};var a=function(l){if(g.twttr&&typeof g.twttr.widgets==="object"&&typeof g.twttr.widgets.load==="function"){g.twttr.widgets.load()}};d.widget("twitter","share",{init:f,activate:a});d.widget("twitter","follow",{init:f,activate:a});d.widget("twitter","hashtag",{init:f,activate:a});d.widget("twitter","mention",{init:f,activate:a});d.widget("twitter","embed",{process:function(l){l.innerEl=l.el;if(!l.innerEl.getAttribute("data-lang")){l.innerEl.setAttribute("data-lang",d.settings.twitter.lang)}l.el=h.createElement("div");l.el.className=l.innerEl.className;l.innerEl.className="";l.innerEl.parentNode.insertBefore(l.el,l.innerEl);l.el.appendChild(l.innerEl)},init:function(l){l.innerEl.className="twitter-tweet"},activate:a});d.network("googleplus",{script:{src:"//apis.google.com/js/plusone.js"},append:function(l){if(g.gapi){return false}g.___gcfg={lang:d.settings.googleplus.lang,parsetags:"explicit"}}});var e=function(l){var m=h.createElement("div");m.className="g-"+l.widget.gtype;d.copyDataAttributes(l.el,m);l.el.appendChild(m);l.gplusEl=m};var k=function(l,m){return(typeof m!=="function")?null:function(n){m(l.el,n)}};var b=function(l){var p=l.widget.gtype;if(g.gapi&&g.gapi[p]){var o=d.settings.googleplus,q=d.getDataAttributes(l.el,true,true),n=["onstartinteraction","onendinteraction","callback"];for(var m=0;m<n.length;m++){q[n[m]]=k(l,o[n[m]])}g.gapi[p].render(l.gplusEl,q)}};d.widget("googleplus","one",{init:e,activate:b,gtype:"plusone"});d.widget("googleplus","share",{init:e,activate:b,gtype:"plus"});d.widget("googleplus","badge",{init:e,activate:b,gtype:"plus"});d.network("linkedin",{script:{src:"//platform.linkedin.com/in.js"}});var i=function(l){var m=h.createElement("script");m.type="IN/"+l.widget.intype;d.copyDataAttributes(l.el,m);l.el.appendChild(m);if(typeof g.IN==="object"&&typeof g.IN.parse==="function"){g.IN.parse(l.el);d.activateInstance(l)}};d.widget("linkedin","share",{init:i,intype:"Share"});d.widget("linkedin","recommend",{init:i,intype:"RecommendProduct"});d.widget("linkedin","follow",{init:i,intype:"FollowCompany"})})(window,window.document,window.Socialite);(function(){var c=window._socialite;if(/Array/.test(Object.prototype.toString.call(c))){for(var b=0,a=c.length;b<a;b++){if(typeof c[b]==="function"){c[b]()}}}})();
