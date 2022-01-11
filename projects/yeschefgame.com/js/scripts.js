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
        modal: true
    });      
    
    // Modal for showing video
    $('.video-modal').magnificPopup({
        type:'iframe',
        disableOn:568
    }); 
    
    $('.image-modal').magnificPopup({
        type: 'image',
        closeOnContentClick: true,
        image: {
            verticalFit: true
        }
    });    
    
    // Close modal
    $(document).on('click', '.popup-modal-close', function (e) {
        e.preventDefault();
        $.magnificPopup.close();
    });    
        
    //detectDevice();   
    
    // Record click event in Google Analytics
    /*$('#game-button').on('click', function (e) {
        if (downloadLink != '' && device != 'pc') {
            var store = 'App Store Head';
            if (device == 'android') { store = 'Google Play Store Head' }
            if (device == 'amazon') { store = 'Amazon App Store Head' }
                
            ga('send', 'event', 'Yes Chef', store, downloadLink, {'hitCallback': function () { document.location = url; }}); 
            return false;            
        }

    });  */
    
    Socialite.load();        
    
});

// Enable fastclick plugin to remove click delay on mobiles - more responsive feel
if (navigator.appName != 'Microsoft Internet Explorer') {
    window.addEventListener('load', function() {
        new FastClick(document.body);
    }, false);
}


// Detects the device the visitor is using
function detectDevice() {
    // Default to iOS       
    if (/Android|webOS|iPhone|iPad|iPod|Blackberry/i.test(navigator.userAgent)) {
        if ((/iPhone|iPod|iPad/).test(navigator.userAgent)) {
            device = 'ios'; 
            downloadLink = 'https://itunes.apple.com/au/app/yes-chef!/id798733298?mt=8';
        }          
        if ((/iPad/).test(navigator.userAgent)) {
            // Alternate link for ipad?
        }                      
        if ((/Android/).test(navigator.userAgent)) {
            downloadLink = 'https://itunes.apple.com/au/app/yes-chef!/id798733298?mt=8';
            device = 'android';
        }  
        if (/\bSilk\b/.test(navigator.userAgent)) { // Amazon
            downloadLink = 'https://itunes.apple.com/au/app/yes-chef!/id798733298?mt=8';
            device = 'amazon';
        }  
        
        $('#game-button, #launch-link').attr('href', downloadLink);              
    }
    
    $('html').addClass(device);  
      
}