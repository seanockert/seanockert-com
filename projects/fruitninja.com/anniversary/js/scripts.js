var docWidth = $(document).width(); 
var docHeight = $(document).height(); 
var winHeight = $(window).height();

var mobile = false;
var device = 'pc';
var parallaxVisible = true;
var $timeline_block = $('.cd-timeline-block');

$(document).ready( function() {

  //hide timeline blocks which are outside the viewport
  $timeline_block.each(function(){
    if($(this).offset().top > $(window).scrollTop()+$(window).height()*0.75) {
      $(this).find('.cd-timeline-img, .cd-timeline-content').addClass('is-hidden');
    }
  });  

  //on scolling, show/animate timeline blocks when enter the viewport
  $(window).on('scroll', function(){
    scrollEvents();
  });  
  
  $('body').on({
    'touchmove': function(e) { scrollEvents(); }
  }); 
  
  $('img').unveil(); 
  
  $('#flashgame').featherlight({
    iframe: 'original/index.html', 
    iframeWidth: 660,
    iframeHeight: 450
  });
  
  embedVideo();
  checkSize();
});

var $html = $('html,body');
// Smooth scroll anchor link
$('a[href*=#]:not([href=#])').click(function() {
  if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') 
    || location.hostname == this.hostname) {
    var target = $(this.hash);
    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
    
    if (target.length) {
      $html.animate({ scrollTop: target.offset().top }, 500);
      return false;
    }
  }
});

function scrollEvents() {
    var scrollTop = $(window).scrollTop();
    
    $timeline_block.each(function() {
      if($(this).offset().top <= (scrollTop + $(window).height()*0.75) && $(this).find('.cd-timeline-img').hasClass('is-hidden') ) {
        $(this).find('.cd-timeline-img, .cd-timeline-content').removeClass('is-hidden').addClass('bounce-in');  
      }
    });

    if ((scrollTop) > $('#games').offset().top) {
      parallaxVisible = false; 
    } else {
      parallaxVisible = true;
    }

    if (scrollTop > $('#history').offset().top-winHeight/2 && scrollTop < $('#you').offset().top-winHeight) {
      $('#history').addClass('active');
    } else {
      $('#history').removeClass('active');
    }
};

// Eliminate the 300ms tap delay
if (window.addEventListener) {
    window.addEventListener('load', function() {
        FastClick.attach(document.body);
    }, false);
};

function checkSize() {
  // Set a flag for mobile or desktop size
  var $header = $('.header');
  var winHeight = $(window).height();
  if ($header.height() > winHeight-70) {
    $header.addClass('has-arrow');
  } else {
    $header.removeClass('has-arrow');
  }
};

function embedVideo() {
  $('.video').each(function() {
    
    var $container = $(this).parent();
    var width = $container.width();
    var height = $container.width()/1.7777;

    // Overlay the Play icon to make it look like a video player
    $(this).append($('<div/>', {'class': 'play'}));
 
     // Based on the YouTube ID, we can easily find the thumbnail image
    $(this).append($('<img/>', {'src': 'http://i.ytimg.com/vi/' + this.id + '/hqdefault.jpg'}));
 
    $(document).delegate('#'+this.id, 'click', function() {
      // Create an iFrame with autoplay set to true
      var iframe_url = "https://www.youtube.com/embed/" + this.id + "?autoplay=1&autohide=1";
      if ($(this).data('params')) iframe_url+='&'+$(this).data('params');

      // The height and width of the iFrame should be the same as parent
      var iframe = $('<iframe/>', {'frameborder': '0', 'src': iframe_url, 'width': width, 'height': height })

      // Replace the YouTube thumbnail with YouTube HTML5 Player
      $(this).replaceWith(iframe);
    });
  });
}