var mobile = false;
var downloadLink = '';



$(document).ready(function() {
    
    
    $('html').addClass('canAnim');
    $('#episode-list img').unveil();
    
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
    
    $('.image-modal').magnificPopup({
        type: 'image',
        disableOn:568,
        closeOnContentClick: true,
        //gallery:{ enabled:true },
        image: {
            verticalFit: true
        },
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
    
    // For hompage carousel
    var elem = document.getElementById('slider'),
    swipeDiv = document.getElementById('slider-nav'),
    swipeNav;
    swipeNav = swipeDiv.getElementsByTagName('button');
    for (var i = 0, len = swipeNav.length; i < len; i++) {
        swipeNav[i].onclick = function() {
        slider.slide(this.getAttribute('data-slide'));
    };
    }
    window.slider = Swipe(elem, { // Init the slider
        startSlide: 0,
        auto: 10000,
        speed : 250,
        draggable: true,
        continuous: true,
        callback: function(index, elem) {
            $('.swipe-nav button').removeClass('active');
            $('.swipe-nav button[data-slide="'+index+'"]').addClass('active');
            
            $('#characters').removeClass();
            elem.offsetWidth = elem.offsetWidth;
            $('#characters').addClass('slide' + index);
        }
    });
             
    //Socialite.load();        
    
});

// Enable fastclick plugin to remove click delay on mobiles - more responsive feel
if (navigator.appName != 'Microsoft Internet Explorer') {
    window.addEventListener('load', function() {
        new FastClick(document.body);
    }, false);
}

$('a.arrow-right').click(function (e) {
    e.preventDefault();
    slider.next();
});

$('a.arrow-left').click(function (e) {
    e.preventDefault();
    slider.prev();
}); 
