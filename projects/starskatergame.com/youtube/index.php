<?php
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past

require_once('stats.php');
?>

<!DOCTYPE html>
<!--[if IE 8]><html class="no-js lt-ie9" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>YouTube Star Skater Skate-Off!</title>
  <meta name="title" content="YouTube Stars in Star Skater" /> 
  <meta name="description" content="Don't just cross the road, own it in this new skating game from Halfbrick" /> 
  <meta name="keywords" content="Star Sk8r, star skater, mobile, game, halfbrick, jetpack joyride, fruit ninja, skating, sk8" /> 
  <link rel="icon" type="image/png" href="images/favicon.png">

  <!--[if lt IE 9]>
    <script src="//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.6.2/html5shiv.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/respond.js/1.1.0/respond.min.js"></script>
  <![endif]--> 
  
  <meta content="Star Skater" property="og:title" />
  <meta content="Don't just cross the road, own it in Star Skater!" property="og:description" />
  <meta content="https://starskatergame.com/images/share_img.jpg" property="og:image" />
  <meta content="600" property="og:image:width" />
  <meta content="315" property="og:image:height" />
  <meta content="https://starskatergame.com" property="og:url" />
  <link rel="stylesheet" href="../css/youtube.css?v=2" type="text/css" />
  
  <meta content="Star Skater" property="twitter:title" />
  <meta content="Don't just cross the road, own it in Star Skater! https://starsk8r.com #starsk8r via @halfbrick" property="twitter:description" />  
  <meta content="https://starskatergame.com/images/share_img.jpg" property="twitter:image:src" />
  <meta content="600" property="twitter:image:width" />
  <meta content="315" property="twitter:image:height" />  
    
  <script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-36155512-27', 'auto'); // UA-36155512-27
    ga('send', 'pageview');
    var obLink = function(sku, store, url) {
      ga('send', 'event', sku, store, url, {'hitCallback': function () { document.location = url; }}); 
      return false;
    }
    
    document.documentElement.className = 'js';
    detectDevice();
    var device = 'pc';
    function detectDevice() { if (/Android|iPhone|iPad|iPod|Silk|Kindle|KFTT|KFOT|BlackBerry|BB|PlayBook/i.test(navigator.userAgent)) { if ((/iPhone|iPod|iPad/).test(navigator.userAgent)) { device = 'ios'; } if ((/Android/).test(navigator.userAgent)) { device = 'android'; } if (/Silk|Kindle|KFTT|KFOT|BlackBerry|BB|PlayBook/i.test(navigator.userAgent)) { device = 'amazon'; } } document.documentElement.className += ' ' + device; }
  </script>  

</head>

<?php 
  $num_unlocked = 0;
  $num_left = count($stats['stars']);
  foreach ($stats['stars'] as $key => $value) {
    if ($value['unlocked'] == true) {
      $num_unlocked++;
      $num_left--;
    }
  }

  $asset_url = 'images/youtube/';
  $list = '';
  $count = 0;
  $imgURLs = array();

  $leaderboardUnlocked = $stats['leaderboard'];
?>

<body>
  <div id="container">
 
    <div id="head">
      <div class="inner">
        <a href="home" id="gohome" title="Visit the main Star Skater website"><img src="images/youtube/button-home.png"></a>
        <div id="social-bar">
            <a href="https://www.facebook.com/starskatergame"><img src="images/social-facebook.png" alt="Facebook"></a>
            <a href="https://twitter.com/halfbrick"><img src="images/social-twitter.png" alt="Twitter"></a>
        </div>

        <div class="row">

            <h2 id="logo"><a href="../"><img src="holding/logo-star-sk8r.png" alt="Star Skater"></a></h2>
            <div class="clear"></div>
            <h1 id="tagline">YouTube Star Skater <span>Skate-Off</span></h1>
            <div class="content">
              <h2>
              <?php if ($leaderboardUnlocked == true) { ?>
              Join your favorite YouTube Star's team to compete for prizes and glory!
              <?php } else { ?>
              Join your favorite YouTube Star's team to compete for prizes and glory!
              <?php } ?>
              </h2>
            
              <div class="hidden-small">
                <p>
                <?php if ($leaderboardUnlocked == true) { ?>
                  All YouTube Stars now unlocked. Collect trophies in Star Skater to lead them to victory.
                <?php } else { ?>
                  Unlock them in the Star Skater game, and <a href="https://twitter.com/intent/tweet?text=I%20found%20a%20new%20YouTube%20Star%20in%20Star%20Skater!%20It's...&hashtags=YouTubeSk8r&via=halfbrick">tweet it to #YouTubeSk8r</a> to prepare them for the Big Skate-off.
                <?php } ?>
                </p>
              </div>
              <a href="#competition" class="popup-modal button">How to Play &amp; Prizes</a>

                <div class="cta">
            <span>Play game <br>for free</span>
            <a href="https://app.appsflyer.com/id1040671838?pid=website&c=youtube-stars" class="badge link-apple" onclick="return obLink('Star Skater', 'App Store', 'https://app.appsflyer.com/id1040671838?pid=website&c=youtube-stars')" title="Download for iPhone and iPad"><img src="images/badge-apple.png" alt="App Store"></a> <a href="https://app.appsflyer.com/com.halfbrick.crazysk8r?pid=website&c=youtube-stars" class="badge link-google" onclick="return obLink('Star Skater', 'Google Play', 'https://app.appsflyer.com/com.halfbrick.crazysk8r?pid=website&c=youtube-stars')" title="Download for Android"><img src="images/badge-google.png" alt="Google PLay"></a>
            <a href="https://play.halfbrick.com/?g=star-skater&pid=website&c=youtube-stars" onclick="return obLink('Star Skater', 'Game Icon', 'https://play.halfbrick.com/?g=star-skater&pid=website&c=youtube-stars')"><img src="images/star-sk8r-icon.png" class="icon"></a>
                </div>

            </div>
        </div>
      </div>
    </div>

    <div class="clear"></div>

  <div id="bg-top">
  <?php if ($leaderboardUnlocked == true) {
    include('leaderboard.php');
  } else {
    include('stars.php'); 
  }  ?>
  </div> 

  <div id="bg-bottom">
    <?php if ($leaderboardUnlocked == true) {
      include('stars.php');
    } else {
      include('leaderboard.php'); 
    } ?>

     <div id="download" class="section">
      <div class="row">
        <div class="columns large-8 large-centered medium-8 medium-centered">
          <a href="https://play.halfbrick.com/?g=star-skater&pid=website&c=youtube-stars" onclick="return obLink('Star Skater', 'Game Icon', 'https://play.halfbrick.com/?g=star-skater&pid=website&c=youtube-stars')"><img src="images/star-sk8r-icon.png" class="icon"></a>
          <h3>Play Star Skater for Free!</h3>
          <div class="clear"></div>
          <p><a href="https://app.appsflyer.com/id1040671838?pid=website" class="badge link-apple" onclick="return obLink('Star Skater', 'App Store', 'https://app.appsflyer.com/id1040671838?pid=website&c=youtube-stars')" title="Download for iPhone and iPad"><img src="images/badge-apple.png" alt="App Store"></a> <a href="https://app.appsflyer.com/com.halfbrick.crazysk8r?pid=website&c=youtube-stars" class="badge link-google" onclick="return obLink('Star Skater', 'Google Play', 'https://app.appsflyer.com/com.halfbrick.crazysk8r?pid=website&c=youtube-stars')" title="Download for Android"><img src="images/badge-google.png" alt="Google PLay"></a></p>
           <a href="https://www.youtube.com/watch?v=b0PJ4yRAYEI" class="video-modal link">Watch the trailer</a>
        </div>
      </div>
      
    </div>  <!-- End Download -->

    <div class="content">
    <a href="terms.html" class="ajax-modal button">Competition Terms &amp; Conditions</a>
    </div>

    <div id="footer">
      <p>&copy; 2016 <a href="https://halfbrick.com">Halfbrick studios</a>. All rights reserved. 
      <br><a href="../press">Media Kit</a> | <a href="https://halfbrick.com/pp">Privacy Policy</a>  | <a href="https://halfbrick.com/tos">Terms of Use</a></p>      
    </div> 
      

  </div> <!-- End bg-bottom -->
</div> <!-- End container -->


<div id="competition" class="modal mfp-hide">
  

    <h4>How to Play</h4>
    <p><img src="images/youtube/icon-prize-machine.png" class="left"> 1. unlock your favorite YouTube Star from the Prize Machine in the game to join their team.</p>
    <p><img src="images/youtube/icon-trophy.png" class="left"> 2. find and collect YouTube trophies scattered in every level. The team that collects the most trophies wins!</p>
    <p><small>Trophies are collectable from 22<sup>nd</sup> July to 12<sup>th</sup> August.</small></p>

    <img src="images/youtube/how-it-works.png">
    
    <hr>

    <h4>Prizes</h4>
    <p>Every player who contributes at least 50 Trophies to the winning YouTube Star's team recieves:</p>
    <p class="pack"><strong>The Victory Pack</strong><br>
    A special version of the YouTube character wearing a Golden Victory crown, the Golden Trophy Deck, and 10 Magic Burritos.</p>

    <h4>You could star in the game!</h4>
    <p>One lucky player from the winning team will be chosen to have themselves put into the game as a playable skater.</p>

    <p><a href="https://play.halfbrick.com/?g=star-skater&pid=website&c=youtube-stars" onclick="return obLink('Star Skater', 'Game Icon', 'https://play.halfbrick.com/?g=star-skater&pid=website&c=youtube-stars')">Have fun and start collecting Skaters!</a></p>


</div>   

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
  <script src="../js/jquery.magnific-popup.min.js"></script>
  <script src="../js/fastclick.js"></script>
  <script src="../js/youtube.js"></script>
  <script>
    var deadline = new Date("<?php echo $stats['end'] ?>");
    initializeClock('countdown', deadline);
  </script>
  
  <!-- Facebook Pixel Code -->
  <script>
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', '154280974997879');
  fbq('track', "PageView");</script>
  <noscript><img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=154280974997879&ev=PageView&noscript=1"
  /></noscript>
  <!-- End Facebook Pixel Code -->

</body>
</html>
