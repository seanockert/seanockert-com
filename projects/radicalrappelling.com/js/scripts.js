var docWidth = $(document).width(); 
var docHeight = $(document).height(); 
var winHeight = $(window).height();
var s;

var device = 'pc';

document.documentElement.className = 'js'; // Replace no-js

$(document).ready(function($) {

  $('#remix').css({'height': winHeight+1 + 'px'});
  
  if (!isMobile.any) {

    s = skrollr.init({ 
      smoothScrolling: true, 
      forceHeight: false 
    });
    
    // For smooth scrolling anchor links
    skrollr.menu.init(s, {
        animate: true,
        easing: 'sqrt',
        scale: 2,
        updateUrl: true 
    });       
    $('html').addClass('canAnim');
  } else {
    $('html').addClass('mobile');
  }

  $(window).resize(function() {
    checkSize(); 
  });
  
  // Modal for showing screenshots
  $('.snap').magnificPopup({
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
  Socialite.load();   

});


// Eliminate the 300ms tap delay
if (window.addEventListener) {
    window.addEventListener('load', function() {
        FastClick.attach(document.body);
    }, false);
};


function checkSize() {
  // Set a flag for mobile or desktop size
  $('#remix').css({'height': winHeight+1 + 'px'});
  
  docWidth = $(window).width();   
  winHeight = $(window).height();
  
  
  docHeight = $(window).height();
  if (isMobile.any) {
    //skrollr.init().destroy();
    //$('.rapper').css({'min-height': winHeight+1 + 'px'});
  } else {
    $('.rapper').css({'min-height': 'auto'});
  }

   s.refresh();
  
};


var $sections = [$('#rappellers'), $('#race'), $('#reel'), $('#remix')];
var sectionCount = $sections.length;

$(window).scroll(function () {
    var scrollTop = $(this).scrollTop();

    //if (scrollTop > $sections[sectionCount-1].offset().top - 200) {
      //$('html').addClass('remix');    
    //}  else {
      //$('html').removeClass('remix'); 
    //}          
      
    for (i = 0; i < sectionCount; i++) { 
      if (scrollTop > $sections[i].offset().top - winHeight/2) {
        $sections[i].addClass('anim');    
      } 
    }

});   

// Detects the device the visitor is using
function detectDevice() {
  var storeLinks = [
    'https://itunes.apple.com/au/app/radical-rappelling/id882398562?mt=8', 
    'https://play.google.com/store/apps/details?id=com.halfbrick.R5'
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
    $('#app-icon, #button-download').attr('href',storeLinks[0]);    
  } else if (device == 'android') {
    $('#app-icon, #button-download').attr('href',storeLinks[1]);    
  } else {
    $('#button-download').attr('href','#remix');   
  }

};

/*!
 * Socialite v2.0
 * http://socialitejs.com
 * Copyright (c) 2011 David Bushell
 * Dual-licensed under the BSD or MIT licenses: http://socialitejs.com/license.txt
 */
window.Socialite=(function(f,g,d){var e=0,a=[],i={},h={},b=/^($|loaded|complete)/,j=f.encodeURIComponent;var c={settings:{},trim:function(k){return k.trim?k.trim():k.replace(/^\s+|\s+$/g,"")},hasClass:function(k,l){return(" "+k.className+" ").indexOf(" "+l+" ")!==-1},addClass:function(k,l){if(!c.hasClass(k,l)){k.className=(k.className==="")?l:k.className+" "+l}},removeClass:function(k,l){k.className=c.trim(" "+k.className+" ".replace(" "+l+" "," "))},extendObject:function(o,n,k){for(var m in n){var l=o[m]!==d;if(l&&typeof n[m]==="object"){c.extendObject(o[m],n[m],k)}else{if(k||!l){o[m]=n[m]}}}},getElements:function(l,p){var k=0,o=[],n=!!l.getElementsByClassName,m=n?l.getElementsByClassName(p):l.getElementsByTagName("*");for(;k<m.length;k++){if(n||c.hasClass(m[k],p)){o.push(m[k])}}return o},getDataAttributes:function(l,s,k){var o=0,q="",n={},p=l.attributes;for(;o<p.length;o++){var r=p[o].name,m=p[o].value;if(m.length&&r.indexOf("data-")===0){if(s){r=r.substring(5)}if(k){n[r]=m}else{q+=j(r)+"="+j(m)+"&"}}}return k?n:q},copyDataAttributes:function(p,o,n,m){var k=c.getDataAttributes(p,n,true);for(var l in k){o.setAttribute(m?l.replace(/-/g,"_"):l,k[l])}},createIframe:function(m,k){var l=g.createElement("iframe");l.style.cssText="overflow: hidden; border: none;";c.extendObject(l,{src:m,allowtransparency:"true",frameborder:"0",scrolling:"no"},true);if(k){l.onload=l.onreadystatechange=function(){if(b.test(l.readyState||"")){l.onload=l.onreadystatechange=null;c.activateInstance(k)}}}return l},networkReady:function(k){return i[k]?i[k].loaded:d},appendNetwork:function(k){if(!k||k.appended){return}if(typeof k.append==="function"&&k.append(k)===false){k.appended=k.loaded=true;c.activateAll(k);return}if(k.script){k.el=g.createElement("script");c.extendObject(k.el,k.script,true);k.el.async=true;k.el.onload=k.el.onreadystatechange=function(){if(b.test(k.el.readyState||"")){k.el.onload=k.el.onreadystatechange=null;k.loaded=true;if(typeof k.onload==="function"&&k.onload(k)===false){return}c.activateAll(k)}};g.body.appendChild(k.el)}k.appended=true},removeNetwork:function(k){if(!c.networkReady(k.name)){return false}if(k.el.parentNode){k.el.parentNode.removeChild(k.el)}return !(k.appended=k.loaded=false)},reloadNetwork:function(k){var l=i[k];if(l&&c.removeNetwork(l)){c.appendNetwork(l)}},createInstance:function(l,n){var m=true,k={el:l,uid:e++,widget:n};a.push(k);if(n.process!==d){m=(typeof n.process==="function")?n.process(k):false}if(m){c.processInstance(k)}k.el.setAttribute("data-socialite",k.uid);k.el.className="socialite "+n.name+" socialite-instance";return k},processInstance:function(k){var m=k.el;k.el=g.createElement("div");k.el.className=m.className;c.copyDataAttributes(m,k.el);if(m.nodeName.toLowerCase()==="a"&&!m.getAttribute("data-default-href")){k.el.setAttribute("data-default-href",m.getAttribute("href"))}var l=m.parentNode;l.insertBefore(k.el,m);l.removeChild(m)},activateInstance:function(k){if(k&&!k.loaded){k.loaded=true;if(typeof k.widget.activate==="function"){k.widget.activate(k)}c.addClass(k.el,"socialite-loaded");return k.onload?k.onload(k.el):null}},activateAll:function(m){if(typeof m==="string"){m=i[m]}for(var l=0;l<a.length;l++){var k=a[l];if(k.init&&k.widget.network===m){c.activateInstance(k)}}},load:function(m,n,s,p,l){m=(m&&typeof m==="object"&&m.nodeType===1)?m:g;if(!n||typeof n!=="object"){c.load(m,c.getElements(m,"socialite"),s,p,l);return}var q;if(/Array/.test(Object.prototype.toString.call(n))){for(q=0;q<n.length;q++){c.load(m,n[q],s,p,l)}return}if(n.nodeType!==1){return}if(!s||!h[s]){s=null;var o=n.className.split(" ");for(q=0;q<o.length;q++){if(h[o[q]]){s=o[q];break}}if(!s){return}}var u,r=h[s],k=parseInt(n.getAttribute("data-socialite"),10);if(!isNaN(k)){for(q=0;q<a.length;q++){if(a[q].uid===k){u=a[q];break}}}else{u=c.createInstance(n,r)}if(l||!u){return}if(!u.init){u.init=true;u.onload=(typeof p==="function")?p:null;r.init(u)}if(!r.network.appended){c.appendNetwork(r.network)}else{if(c.networkReady(r.network.name)){c.activateInstance(u)}}},activate:function(l,k,m){f.Socialite.load(null,l,k,m)},process:function(l,m,k){f.Socialite.load(l,m,k,null,true)},network:function(l,k){i[l]={name:l,el:null,appended:false,loaded:false,widgets:{}};if(k){c.extendObject(i[l],k)}},widget:function(m,k,l){l.name=m+"-"+k;if(!i[m]||h[l.name]){return}l.network=i[m];i[m].widgets[k]=h[l.name]=l},setup:function(k){c.extendObject(c.settings,k,true)}};return c})(window,window.document);(function(g,h,d,c){d.setup({facebook:{lang:"en_GB",appId:null},twitter:{lang:"en"},googleplus:{lang:"en-GB"}});d.network("facebook",{script:{src:"//connect.facebook.net/{{language}}/all.js",id:"facebook-jssdk"},append:function(o){var n=h.createElement("div"),m=d.settings.facebook,l={onlike:"edge.create",onunlike:"edge.remove",onsend:"message.send"};n.id="fb-root";h.body.appendChild(n);o.script.src=o.script.src.replace("{{language}}",m.lang);g.fbAsyncInit=function(){g.FB.init({appId:m.appId,xfbml:true});for(var p in l){if(typeof m[p]==="function"){g.FB.Event.subscribe(l[p],m[p])}}}}});var j=function(l){var m=h.createElement("div");m.className=l.widget.fbtype;d.copyDataAttributes(l.el,m);l.el.appendChild(m);if(g.FB&&g.FB.XFBML){g.FB.XFBML.parse(l.el)}};d.widget("facebook","like",{init:j,fbtype:"fb-like"});d.widget("facebook","share",{init:j,fbtype:"fb-share-button"});d.network("twitter",{script:{src:"//platform.twitter.com/widgets.js",id:"twitter-wjs",charset:"utf-8"},append:function(){var n=(typeof g.twttr!=="object"),m=d.settings.twitter,l=["click","tweet","retweet","favorite","follow"];if(n){g.twttr=(t={_e:[],ready:function(o){t._e.push(o)}})}g.twttr.ready(function(o){for(var p=0;p<l.length;p++){var q=l[p];if(typeof m["on"+q]==="function"){o.events.bind(q,m["on"+q])}}d.activateAll("twitter")});return n}});var f=function(l){var m=h.createElement("a");m.className=l.widget.name+"-button";d.copyDataAttributes(l.el,m);m.setAttribute("href",l.el.getAttribute("data-default-href"));m.setAttribute("data-lang",l.el.getAttribute("data-lang")||d.settings.twitter.lang);l.el.appendChild(m)};var a=function(l){if(g.twttr&&typeof g.twttr.widgets==="object"&&typeof g.twttr.widgets.load==="function"){g.twttr.widgets.load()}};d.widget("twitter","share",{init:f,activate:a});d.widget("twitter","follow",{init:f,activate:a});d.widget("twitter","hashtag",{init:f,activate:a});d.widget("twitter","mention",{init:f,activate:a});d.widget("twitter","embed",{process:function(l){l.innerEl=l.el;if(!l.innerEl.getAttribute("data-lang")){l.innerEl.setAttribute("data-lang",d.settings.twitter.lang)}l.el=h.createElement("div");l.el.className=l.innerEl.className;l.innerEl.className="";l.innerEl.parentNode.insertBefore(l.el,l.innerEl);l.el.appendChild(l.innerEl)},init:function(l){l.innerEl.className="twitter-tweet"},activate:a});d.network("googleplus",{script:{src:"//apis.google.com/js/plusone.js"},append:function(l){if(g.gapi){return false}g.___gcfg={lang:d.settings.googleplus.lang,parsetags:"explicit"}}});var e=function(l){var m=h.createElement("div");m.className="g-"+l.widget.gtype;d.copyDataAttributes(l.el,m);l.el.appendChild(m);l.gplusEl=m};var k=function(l,m){return(typeof m!=="function")?null:function(n){m(l.el,n)}};var b=function(l){var p=l.widget.gtype;if(g.gapi&&g.gapi[p]){var o=d.settings.googleplus,q=d.getDataAttributes(l.el,true,true),n=["onstartinteraction","onendinteraction","callback"];for(var m=0;m<n.length;m++){q[n[m]]=k(l,o[n[m]])}g.gapi[p].render(l.gplusEl,q)}};d.widget("googleplus","one",{init:e,activate:b,gtype:"plusone"});d.widget("googleplus","share",{init:e,activate:b,gtype:"plus"});d.widget("googleplus","badge",{init:e,activate:b,gtype:"plus"});d.network("linkedin",{script:{src:"//platform.linkedin.com/in.js"}});var i=function(l){var m=h.createElement("script");m.type="IN/"+l.widget.intype;d.copyDataAttributes(l.el,m);l.el.appendChild(m);if(typeof g.IN==="object"&&typeof g.IN.parse==="function"){g.IN.parse(l.el);d.activateInstance(l)}};d.widget("linkedin","share",{init:i,intype:"Share"});d.widget("linkedin","recommend",{init:i,intype:"RecommendProduct"});d.widget("linkedin","follow",{init:i,intype:"FollowCompany"})})(window,window.document,window.Socialite);(function(){var c=window._socialite;if(/Array/.test(Object.prototype.toString.call(c))){for(var b=0,a=c.length;b<a;b++){if(typeof c[b]==="function"){c[b]()}}}})();
