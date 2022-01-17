<div class="row">

  <div class="section" id="stars">
    <div class="content">
      <h2>The contestants</h2>
       <p><?php 
        if ($num_left > 0) {
          echo 'Unlock all the YouTube Stars to start the race... <br><strong>' . $num_unlocked . ' unlocked. ' . $num_left . ' left</strong>';
        } else {
          echo '<strong>All YouTube Stars unlocked!</strong> Who will you skate for?';
        }
      ?></p>
    </div>
    <ul>
    <?php 
      
      foreach ($stats['stars'] as $key => $value) {
        
        array_push($imgURLs, $asset_url . 'stars/' . strtolower(str_replace(' ', '-', $value['name'])) .'.png');
        
        if ($value['unlocked'] == true) {
          $list .= '<li class="revealed"><a href="' .
                $value['link']
                . '" title="View ' . 
                $value['name']
                . ' on YouTube"><h3>' .
                $key . '</h3><div class="inner"><img src="' .
                $asset_url . 'stars/' . strtolower(str_replace(' ', '-', $value['name']))
                .'.png" alt=""></div><p>' .
                $value['bio']
                . '</p></a><a href="' .
                $value['link']
                . '" class="button"><img src="' . $asset_url . 'icon-youtube.png"><span>My Channel</span></a>'
                . '<a href="https://play.halfbrick.com?g=star-starskater-' . strtolower(str_replace(' ', '', $value['name'])) . '" class="button green" style="">Play</a>';
        } else {
          $list .= '<li><div class="inner"><img src="' . $asset_url . 'stars/' .  $count . '.png" title="Revealed when unlocked in the game"></div><p>Find in-game to unlock this <span>YouTube star for the race.</span></p>';
        }
        
        $list .= '</li>';
        $count++;
      }
      
      echo $list;

    ?>
  </ul>



  <div class="clear"></div>
  </div>
</div> <!-- End Stars -->