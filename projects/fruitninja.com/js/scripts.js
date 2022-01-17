var mobile = false;
var docWidth = $(document).width(); 
var docHeight = $(document).height(); 
var downloadLink = '';
var device = '';
var game = '';
var updatedDate = $('#read-news').data('updated');
var readNews = false;

$(document).ready(function() {
    // Slide to start on based on page hash
    var firstSlide = 0;
    
    /*var hash = document.location.hash;
    if (hash) {
        switch(hash) {
            case '#news':
            default:
                break ;
        }            
    }*/

    detectDevice();

    // Modal for Ghostbusters promo
    $('.promo-modal').magnificPopup({
        type: 'inline',
        mainClass: 'mfp-pop',
        preloader: false, 
        showCloseBtn: false,
        alignTop: true,
        callbacks: {
            open: function(){
                $(".container").addClass('blur');
                $('.mfp-content').addClass('height');
                $(window).bind('statechange', closePopup)
                $(window).on('resize', closePopup);
            },
            close: function(){
                $(".container").removeClass('blur');
                magnificPopup = null;
            }
        }   
    }); 


    // Modal for listing platforms and news
    $('.popup-modal').magnificPopup({
        type: 'inline',
        preloader: false,
        modal: true,
        enableEscapeKey: true,
        callbacks: {
            open: function(){
                $(".container").addClass('blur');
                $(window).bind('statechange', closePopup)
            },
            close: function(){
                $(".container").removeClass('blur');
                magnificPopup = null;
            }
        }
    }); 
      
    // Modal for listing platforms and news
    $('.ajax-modal').magnificPopup({
        type: 'ajax',
        preloader: false,
        modal: true,
        enableEscapeKey: true,
        callbacks: {
            open: function(){
                $(".container").addClass('blur');
                document.location.hash = 'news';
            },
            close: function(){
                $(".container").removeClass('blur');
                document.location.hash = '';
            }
        }
    });   
   
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

    // Modal for showing video
    $('.video-modal').magnificPopup({
        type: 'iframe',
        disableOn: 568
    }); 


    $('.mobile-modal').click(function() {
        game = $(this).attr('id'); 
    });    
    
    $('#read-news').click(function() {
        $.cookie('fruitninja', updatedDate);
        $(this).find('sup').addClass('hidden'); 
    });


 	$(window).on('hashchange',function() { 
        if(location.href.indexOf('#news') < 0) {
            $.magnificPopup.close();
        }
    }); 

    $(document).on('click', '.popup-modal-close', function (e) {
        e.preventDefault();
        $.magnificPopup.close();
    }); 
    
    checkWidth();

    // Adjust block heights to fill page on resize
    $(window).resize(function() {
        docWidth = $(document).width(); 
        docHeight = $(document).height(); 
        checkWidth();                   
    });

    checkUnreadNews();   
    
    //checkGhostbustersNotice(); // Popup Ghostbusters modal on load

});

// Eliminate the 300ms tap delay
if (window.addEventListener) {
    window.addEventListener('load', function() {
        FastClick.attach(document.body);
    }, false);
};

 
function closePopup() {
if ($.magnificPopup != null)
    $.magnificPopup.close();
}   
    
function checkWidth() {
    if (docWidth < 657) {
        mobile = true;
    }
}

// Compare last updated date to date stored in cookie to see if there's any unread news
function checkUnreadNews() {
    var lastClickedDate = $.cookie('fruitninja'); 
    if (lastClickedDate) {
        if (lastClickedDate < updatedDate) {
            $('#read-news').find('sup').removeClass('hidden');
            readNews = false;          
        } else {
            $('#read-news').find('sup').addClass('hidden'); 
            readNews = true;              
        }        
    }
}

function checkGhostbustersNotice() {
    var seenNoticeFlag = $.cookie('fruitninja_ghostbusters'); 
    if (!seenNoticeFlag) {
	    if ($('#modal-ghostbusters').length) {
            $.cookie('fruitninja_ghostbusters', 'true');  

		    setTimeout(function() {
			$.magnificPopup.open({
			    items: {
			        src: '#modal-ghostbusters' 
			    },
                type: 'inline',
                showCloseBtn: false,
                alignTop: true,
			    fixedContentPos: true,
                callbacks: {
                    open: function(){
                        $(".container").addClass('blur');
                        $('.mfp-content').addClass('height');
                        $(window).bind('statechange', closePopup);
                    },
                    close: function(){
                        $(".container").removeClass('blur');
                        magnificPopup = null;
                    }
                }
			 });
			}, 300);      
	    }           
    }        
}

     
// Detects the device the visitor is using
function detectDevice() {
    var store = 'Unknown';
    
    // Default to iOS       
    if (/Android|Windows Phone|IEMobile|webOS|iPhone|iPad|iPod|Blackberry/i.test(navigator.userAgent)) {
        if ((/iPhone|iPod|iPad/).test(navigator.userAgent)) {
            downloadLink = 'https://app.appsflyer.com/id403858572?pid=website&c=gb2016';            
            device = 'ios'; 
            store = 'Apple App Store';
        }                              
        if ((/Android/).test(navigator.userAgent)) {
            downloadLink = 'https://app.appsflyer.com/com.halfbrick.fruitninjafree?pid=website&c=gb2016';
            device = 'android';
            store = 'Google Play Store';
        }          
        if ((/Windows Phone|IEMobile/).test(navigator.userAgent)) {
            downloadLink = 'https://www.windowsphone.com/en-us/store/app/fruit-ninja/49c69a08-60fe-df11-9264-00237de2db9e';
            device = 'windows';
            store = 'Windows Phone';
        }  
        if (/\bSilk\b/.test(navigator.userAgent)) { // Amazon
            downloadLink = 'https://www.amazon.com/gp/mas/dl/android?p=com.halfbrick.fruitninjafree';
            device = 'amazon';
            store = 'Amazon App Store';
        } 
        
        $('#hero .popup-modal, #panels .popup-modal')
        .removeClass('popup-modal')
        .addClass('direct-link').attr('href', downloadLink)
        .click(function() {
          ga('send', 'event', 'Fruit Ninja Free', store, downloadLink, {'hitCallback': function () { document.location = downloadLink; }}); 
          return false;
          
        });       
    }  
}
