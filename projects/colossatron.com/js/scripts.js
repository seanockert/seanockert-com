var mobile = true;
var index = 1;
var docWidth = $(document).width();
var docHeight = $(document).height();
var windowHeight = $(window).height();
var minHeight = 768;

orientation = Math.abs(window.orientation) == 90 ? 'landscape' : 'portrait';


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
  }
});


$(document).ready(function ($) {

  $('html').removeClass('no-js').addClass('js');

  $(window).resize(function() {
    docWidth = $(document).width(); 
  	windowHeight = $(window).height();
   
    checkWidth();  
    reposition(); 
  });
  


  // Smooth scroll to top of page
  $('.totop').click(function(){
  	$("html, body").animate({ scrollTop: 0 }, 600, 'easeOutBounce');
  	return false;
  });

  // Start slide at 0 on load
  var beginSlide = 0;
  $('#slider').find("[data-slide='" + beginSlide + "']").addClass('active');
  
  // Swipe JS slider
  window.slider = new Swipe(document.getElementById('slider'), {
    continuous: false,
    startSlide : beginSlide,
    callback: function(index, elem) { 
    var currentSlide = this.slides[index];
    $('.swipe-wrap div, .swipe-nav a').removeClass('active');
    $('.swipe-nav a[data-slide="'+index+'"]').addClass('active');
    $(currentSlide).addClass('active');
    }
  });

  // Slider controls
  $('.swipe-nav a, .button-next').click(function (e) {
    e.preventDefault();
    if (!$(this).hasClass('active')) {     
      index = parseInt($(this).attr('data-slide'));     
      slider.slide(index);
      $('.video').each(function(){
        //$(this).stopVideo();
      });
      return false;
    }
  })   

  $('.swipe-wrap>div').click(function (e) {
    e.stopPropagation();
    if (!$(this).hasClass('active')) {
      e.preventDefault();
      index = parseInt($(this).attr('data-slide'));
      slider.slide(index);
    }
  }); 
  
  

  $(window).scroll(function () {
      var offsetUpdates = $(this).scrollTop() - $("#updates").offset().top;
      var offsetAbout = $(this).scrollTop() - $("#about").offset().top;
      var offsetFooter = $(this).scrollTop() - $("#footer").offset().top;

      if (!mobile) {
        if ($(this).scrollTop() > 150) {
            $('#hero .button-more').fadeOut(150);
        } else {
           $('#hero .button-more').fadeIn(150); 
        }          
        
        if (offsetUpdates > 350) {
            $('#updates .button-more').fadeOut(150);
        } else {
           $('#updates .button-more').fadeIn(150); 
        }          
        
        if (offsetFooter > -240) {
            $('#about .button-more').fadeOut(150);
        } else {
           $('#about .button-more').fadeIn(150); 
        }             
      }     
  });  


  $('.screenshots a').magnificPopup({
      type: 'image',
      disableOn:500,
      removalDelay: 500,
      callbacks: {
        beforeOpen: function() {
           this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
           this.st.mainClass = this.st.el.attr('data-effect');
        }
      },
      midClick: true,
      tLoading: 'Loading image #%curr%...',
      gallery: {
          enabled: true,
          navigateByImgClick: true,
          preload: [0,1]
      }
  });

    
  $('.icon-twitter, .icon-google').click(function() {
    window.open($(this).attr('href'), '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
    return false; 
  });  
  
  $('.icon-facebook').click(function() {
    window.open($(this).attr('href'), 'facebook-share-dialog','width=626,height=436');
    return false; 
  });
  
  // Smooth scroll to next section
  $('a.scroll').click(function(){
      var hash = $.attr(this, 'href');
      
      $('html, body').animate({
          scrollTop: $(hash).offset().top
      }, {
      duration: 500,
      easing: 'easeInOutQuart',
      complete: function() {
        window.location.hash = hash;
      }
      });
      return false;
  });    
      
  checkWidth();
  reposition(); 
	
});


// Toggle mobile variable 
var checkWidth = function() {
    if (docWidth > 767) {
        mobile = false;    
    } else {
        // Is mobile
        mobile = true;    
    }  	
}

var reposition = function() {
  // For repositioning the logo
  var logoOffset = 100; 
  if (mobile) {
    return;
  }
  var logoPos = windowHeight/2 - $('#logo').height()/2 - logoOffset; 
  $('#logo').css({'padding-top': logoPos});
}




// Avoid `console` errors in browsers that lack a console.
if (!(window.console && console.log)) {
    (function() {
        var noop = function() {};
        var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'markTimeline', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
        var length = methods.length;
        var console = window.console = {};
        while (length--) {
            console[methods[length]] = noop;
        }
    }());
}

/* Fix orientation change on iOS */
!function(a){function g(){f.content="width=device-width,minimum-scale="+e[0]+",maximum-scale="+e[1],a.removeEventListener(c,g,!0)}var b="addEventListener",c="gesturestart",d="querySelectorAll",e=[1,1],f=d in a?a[d]("meta[name=viewport]"):[];(f=f[f.length-1])&&b in a&&(g(),e=[.25,1.6],a[b](c,g,!0))}(document);

// FastClick: Eliminate the 300ms time delay on mobile browsers
var FastClick=(function(){var a='ontouchstart' in window;return function(e){if(!(e instanceof HTMLElement)){throw new TypeError("Layer must be instance of HTMLElement")}if(a){e.addEventListener("touchstart",g,true);e.addEventListener("touchmove",f,true);e.addEventListener("touchend",i,true);e.addEventListener("touchcancel",b,true)}e.addEventListener("click",h,true);if(e.onclick instanceof Function){e.addEventListener("click",e.onclick,false);e.onclick=""}var d={x:0,y:0,scroll:0},c=false;function g(j){c=true;d.x=j.targetTouches[0].clientX;d.y=j.targetTouches[0].clientY;d.scroll=window.pageYOffset;return true}function f(j){if(c){if(Math.abs(j.targetTouches[0].clientX-d.x)>10||Math.abs(j.targetTouches[0].clientY-d.y)>10){c=false}}return true}function i(l){var k,j;if(!c||Math.abs(window.pageYOffset-d.scroll)>5){return true}k=document.elementFromPoint(d.x,d.y);if(k.nodeType===Node.TEXT_NODE){k=k.parentNode}if(!(k.className.indexOf("clickevent")!==-1&&k.className.indexOf("touchandclickevent")===-1)){j=document.createEvent("MouseEvents");j.initMouseEvent("click",true,true,window,1,0,0,d.x,d.y,false,false,false,false,0,null);j.forwardedTouchEvent=true;k.dispatchEvent(j)}if(!(k instanceof HTMLSelectElement)&&k.className.indexOf("clickevent")===-1){l.preventDefault()}else{return false}}function b(j){c=false}function h(l){if(!window.event){return true}var m=true;var k;var j=window.event.forwardedTouchEvent;if(a){k=document.elementFromPoint(d.x,d.y);if(!k||(!j&&k.className.indexOf("clickevent")==-1)){m=false}}if(m){return true}l.stopPropagation();l.preventDefault();l.stopImmediatePropagation();return false}}})();

if (!$.browser.msie && mobile) {
    window.addEventListener('load', function() {
        new FastClick(document.body);
    }, false);
}

