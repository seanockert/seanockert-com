var mobile = false;
var device = 'pc';
var downloadLink = '';

$(document).ready(function() {

    // Smooth scroll
    var $root = $('html, body');
    $('a.scroll').click(function() {
        var href = $.attr(this, 'href');
        $root.animate({
            scrollTop: $(href).offset().top
        }, 500, function () {
            window.location.hash = href;
        });
        return false;
    });
    
    
    // Modal for inline content
    $('.popup-modal').magnificPopup({
        type: 'inline',
        preloader: false,
        modal: true,
        callbacks: {
            open: function(){
                $("#container").addClass('blur');
            },
            close: function(){
                $("#container").removeClass('blur');
            }
        }
    });   

    // Modal for listing terms
    $('.ajax-modal').magnificPopup({
        type: 'ajax',
        preloader: false,
        modal: true,
        enableEscapeKey: true,
        callbacks: {
            open: function(){
                $(".container").addClass('blur');
                document.location.hash = 'terms';
                //$(window).on('resize', closePopup);
            },
            close: function(){
                $(".container").removeClass('blur');
                document.location.hash = '';
            }
        }
    });    
    
    // Modal for showing video
    $('.video-modal').magnificPopup({
        type:'iframe',
        disableOn:568,
        callbacks: {
            open: function(){
                $("#container").addClass('blur');
            },
            close: function(){
                $("#container").removeClass('blur');
            }
        }
    }); 


    // Close modal
    $(document).on('click', '.popup-modal-close', function (e) {
        e.preventDefault();
        $.magnificPopup.close();
    });         
    
});

// Enable fastclick plugin to remove click delay on mobiles - more responsive feel
if (navigator.appName != 'Microsoft Internet Explorer') {
    window.addEventListener('load', function() {
        new FastClick(document.body);
    }, false);
}

// For timer
function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    'total': t,
    'days': days,
    'hours': hours,
    //'minutes': minutes
  };
}

function initializeClock(id, endtime) {
  var clock = document.getElementById(id);
  var daysSpan = clock.querySelector('.days');
  var hoursSpan = clock.querySelector('.hours');
  //var minutesSpan = clock.querySelector('.minutes');

  function updateClock() {
    var t = getTimeRemaining(endtime);

    daysSpan.innerHTML = t.days;
    //hoursSpan.innerHTML = ('0' + t.hours).slice(-2);

    if (t.total <= 0) {
      clearInterval(timeinterval);
    }
  }

  updateClock();
  var timeinterval = setInterval(updateClock, 1000);
}
