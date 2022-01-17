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
  'https://appstore.com/fruitninjaacademy', 
  'https://play.google.com/store/apps/details?id=com.halfbrick.mathmaster'
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

