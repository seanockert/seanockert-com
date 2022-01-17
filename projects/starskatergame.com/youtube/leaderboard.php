	<div id="skate-off" class="section">

      <div class="content row">  
        <div class="columns">  
          <h2>The Big Skate-Off</h2>

          <div class="content">
          <?php if ($leaderboardUnlocked == true) { ?>
          	<p>Pick your favorite YouTube star and help them win by collecting <strong>trophies</strong> in Star Skater. Check out the leaderboard below to see who's winning.</p>
          <?php } else { ?>
          	<p>Once you’ve unlocked them all, we’re going to have a skate off.</p>
          	<p>Pick your favorite YouTube star and help them win by collecting <strong>trophies</strong> in Star Skater.</p>
          	<p>A leaderboard will decide the ultimate Star Skater! The winning YouTube Star will pick a fan to be <strong>a playable character in Star Skater</strong>. Could it be you?</p>   
          <?php } ?>
            
          </div>

          <div class="">
          <img src="images/youtube/how-it-works.png">
          </div>

        </div>    
      </div> 

    </div>    
 
    <div id="leaderboard" class="section">
    <div class="row">
	    <?php
	      function sortByItems($a, $b) {
	          return $b['items'] - $a['items'];
	      }
	          
	      $leaderboard = $stats['stars'];
	      usort($leaderboard, 'sortByItems');   
	    ?>      

		<div class="content">  
			<div class="columns">  
			<?php if ($leaderboardUnlocked == true) { ?>
			  	<h2>Top Skaters</h2>
			<?php } else { ?>
				<h2>Support your team. Start collecting trophies!</h2>
			<?php } ?>
			  	<?php if ($leaderboardUnlocked == true) { ?>
				<p><img src="images/youtube/icon-timer.png" class="icon-timer"> Event ends in <span id="countdown"><span class="days"></span> days</span>. Leaderboard updated daily. </p>
			    <?php } ?>
			</div>
		</div>
		<div class="clear"></div>

		<?php if ($leaderboardUnlocked == true) { ?>

		<div class="columns large-4 large-push-8">

			<div id="first">
			<?php 
			if ($leaderboardUnlocked == true) {
			?>
			<?php
			$first = '<img src="' . $asset_url . 'stars/icon-' . strtolower(str_replace(' ', '-', $leaderboard[0]['name'])) .'.png' . '" class="star"><h5>Current Leader</h5><h4>' 
			         . $leaderboard[0]['name']
			         . '</h4><div class="stats">Trophies Collected: ' 
			         . number_format($leaderboard[0]['items'], 0 , '', ',')
			         . '</div>';
			echo $first;
			} else {
			echo '<img src="' . $asset_url . 'star.png' . '" class="star" style="height:120px;"><h5>Current Leader</h5><h4>Find all Stars first</h4>';
			}
			?>
			</div>

		</div>
	      
		<!-- Countdown timer -->
		<div class="columns large-8 large-pull-4"> 
		  <table>
		    <thead>
		      <tr>
		        <th class="rank">&nbsp;</th>
		        <th class="name">YouTube Star</th>
		        <th class="items">Trophies</th>
		        <th class="stacks">Stacks</th>
		      </tr>
		    </thead>
		    <tbody>
		      <?php
		      $rank = 1;
		      foreach ($leaderboard as $key => $value) {
		        $item = '<tr><td class="rank">'
		                . $rank
		                . '</td><td class="name">'
		                . '<img src="' . $asset_url . 'stars/icon-' . strtolower(str_replace(' ', '-', $value['name'])) .'.png">'
		                . $value['name'] . ' &nbsp;<a href="' . $value['link'] . '" class="button">Support Me!</a>'
		                . '</td><td class="items">'
		                . number_format($value['items'], 0 , '', ',')
		                . '</td></tr>';
		        echo $item;
		        $rank++;
		      
		      }
		      ?>
		    </tbody>
		  </table>
		</div>

		<?php } else { ?>
		<!--<div class="columns large-8 large-centered medium-8 medium-centered">
		  <div class="leaderboard-locked">
		  	<h5>Leaderboard</h5>
		  	<h4>Available when all YouTube Stars unlocked</h4>
		  </div>
		</div>-->
		<?php } ?>          

	      
	</div>
	<div class="clear"></div>

	</div> <!-- End leaderboard -->