window.onblur = function() { window.blurred = true; };
window.onfocus = function() { window.blurred = false; };

var mobile = false;
var device = 'pc';

$(document).ready(function() {

    $('html').removeClass('no-js').addClass('js');
    detectDevice();

    // Modal
    $('.video-link').magnificPopup({
        type:'iframe',
        disableOn:500,
        alignTop:false
    });       
    
    $('.iframe').magnificPopup({
        type:'iframe',
        disableOn:500,
        callbacks: {
        }        
    });    
    
    $('.popup-with-form').magnificPopup({
        type: 'inline',
        preloader: false,
        focus: '#comment',

        // When elemened is focused, some mobile browsers in some cases zoom in
        // It looks not nice, so we disable it:
        callbacks: {
            beforeOpen: function() {
                if($(window).width() < 700) {
                    this.st.focus = false;
                } else {
                    this.st.focus = '#comment';
                }
            }
        }
    });   
    
    $('.screenshots a').magnificPopup({
        type: 'image',
        disableOn:500,
        tLoading: 'Loading image #%curr%...',
        gallery: {
            enabled: true,
            navigateByImgClick: true,
            preload: [0,1]
        }
    });
    

    //setTimeout(function() {Socialite.load();},1000);

    var checkWidth = function() {
        if (docWidth < 768) {
            mobile = true;
        }
    }

    var docWidth = $(document).width(); 
    var docHeight = $(document).height(); 
    checkWidth(); 
    
    // Adjust block heights to fill page on resize
    $(window).resize(function() {
        docWidth = $(document).width(); 
    	docHeight = $(document).height();
         
        /*var winHeight = $(window).height();
        $('.main-content .block').css({'height': winHeight+1 + 'px'});
        if (winHeight > 1024) {
            $('#intro').css({'height': winHeight+1 + 'px'});        
        }*/
    
        checkWidth();         
        if (docWidth < 768  && mobile == false) {
             window.location.reload();
        }           
          
    });
    
    // Parallax some backgrounds on scroll and hide/show the Play Game button
    $(window).scroll(function () {
        if (!mobile && docWidth > 768) {
            var scrollTop = $(this).scrollTop();
            
            var bgStarsY   = (scrollTop - $("#new-characters").offset().top)/3;
            var bgFeatures = (scrollTop - $("#features").offset().top)/3;
            var bgCreators = (scrollTop - $("#creators").offset().top)/3;
            var bgDownload = (scrollTop - $("#download").offset().top)/3;

            if (scrollTop < $("#new-characters").offset().top + winHeight) {
                $("#new-characters").css({"background-position-y": "" + bgStarsY  + "px"});    
            }            
            
            if (scrollTop < ($("#features").offset().top + winHeight)) {
                $("#features").css({"background-position-y": "" + bgFeatures  + "px"});    
            }            
            
            if (scrollTop < ($("#creators").offset().top + winHeight)) {
                $("#creators").css({"background-position-y": "" + bgCreators  + "px"});    
            }
            
            if (scrollTop < ($("#download").offset().top + winHeight)) {
                $("#download").css({"background-position-y": "" + bgDownload  + "px"});                
            }

        }

    });    

    // Smooth scroll to top of page
    $('.totop').click(function(){
        $("html, body").animate({ scrollTop: 0 }, 600);
        return false;
    });    

    // Smooth scroll to next section
    $('a').click(function(){
        var hash = $.attr(this, 'href');
        
        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, {
        duration: 500,
        complete: function() {
          window.location.hash = hash;
        }
        });
        return false;
    });    
    
    // Adjust block heights to fill page
    
    /*
    var winHeight = $(window).height();
    $('.main-content .block').css({'height': winHeight+1 + 'px'});
    if (winHeight > 1024) {
        $('#intro').css({'height': winHeight+1 + 'px'});        
    }
    */

});


// Detects the device the visitor is using
function detectDevice() {
    // Default to iOS       
    if (/Android|iPhone|iPad|iPod|Silk|Kindle|KFTT|KFOT|BlackBerry|BB|PlayBook/i.test(navigator.userAgent)) {
        if ((/iPhone|iPod|iPad/).test(navigator.userAgent)) {
            device = 'ios'; 
            downloadLink = 'http://download.halfbrick.com/?id=bandstars';
        }                               
        if ((/Android/).test(navigator.userAgent)) {
            downloadLink = 'https://play.google.com/store/apps/details?id=com.halfbrick.bandstars';
            device = 'android';
        }  
        if (/Silk|Kindle|KFTT|KFOT/i.test(navigator.userAgent)) { // Amazon
            downloadLink = 'http://www.amazon.com/Halfbrick-Studios-Pty-Ltd-Stars/dp/B00MUDYPQK/';
            device = 'amazon';
        }          
        
        if (/BlackBerry|BB|PlayBook/i.test(navigator.userAgent)) { // Blackberry
            downloadLink = 'http://www.amazon.com/Halfbrick-Studios-Pty-Ltd-Stars/dp/B00MUDYPQK/';
            device = 'amazon';
        }  
        
        $('#download h2').text('Play Band Stars for Free!');
        $('#game-icon').attr('href', downloadLink);
        
    }
    
    $('html').addClass(device);  
      
}


// Enable fastclick plugin to remove click delay on mobiles - more responsive feel
if (navigator.appName != 'Microsoft Internet Explorer') {
    window.addEventListener('load', function() {
        new FastClick(document.body);
    }, false);
}

