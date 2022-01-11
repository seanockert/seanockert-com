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
    
    $.get('https://api.everyplay.com/games/current/videos?client_id=c9122bdadf544047b632b2429119223634299086&offset=0&limit=3&order=-created_at', function( data ) {
        latestVideos = '';
        for (var i = 0; i < data.length; i++) {
            var video = data[i];
            latestVideos += '<div class="columns large-4 medium-4">';
            latestVideos += '<a href="https://everyplay.com/videos/' + video.id + '" title="Watch this video on Everyplay" class="video-everyplay box">';
            latestVideos += '<div class="img-frame"><img src="' + video.base_url + 'thumbnail.jpg"><b></b></div><div class="inner">';
            latestVideos += '<h5>' + video.title + '</h5><author>' + video.user.username + '</author>';
            latestVideos += '</div></a></div>';
        } 
      
        $('#everyplay-videos').html(latestVideos);
        
        // Load here because of dynamic content
        if ($('.video-everyplay')) {
            $('.video-everyplay').magnificPopup({
                type: 'iframe',
                disableOn:568,
                iframe: {
                patterns: {
                  everyplay: {
                    index: 'everyplay.com',         
                    id: function(url) {        
                        var m = url.match(/^.+everyplay.com\/videos\/([^_]+)[^#]*(([^_&]+))?/);
                        if (m !== null) {
                            if(m[2] !== undefined) {
                                return m[2];
                            }
                            return m[1];
                        }
                        return null;
                    },
                    src: ' https://everyplay.com/player?id=%id%'    
                  }
                }
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
        }
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
    
    // Randomise start slide on load
    //var beginSlide = Math.floor(Math.random() * 3);
    var beginSlide = 0;
    $('.swipe-nav li a[data-slide="'+beginSlide+'"]').addClass('active');
        
    // For hompage carousel
    var elem = document.getElementById('slider');
    if (elem) {
        window.slider = Swipe(elem, { // Init the slider
            startSlide: 0,
            auto: 10000,
            speed : 250,
            draggable: true,
            continuous: true,
            callback: function(index, elem) {
                $('.swipe-nav li a').removeClass('active');
                $('.swipe-nav li a[data-slide="'+index+'"]').addClass('active');    
            }
        }); 
    }       

    Socialite.load();        
    
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

$('.swipe-nav a').click(function (e) {
    e.preventDefault();
    if (!$(this).hasClass('active')) {
        index = parseInt($(this).attr('data-slide'));
        slider.slide(index);
    }
}); 