    Cufon.replace('h2, h3');


	$(document).ready(function() {
	
		$("a.lightbox").fancybox({
			'transitionIn'		: 'elastic',
			'transitionOut'		: 'elastic'	
							
			});
				
		});


	$(document).ready(function(){
	
		$("img.a").hover(
		function() {
		$(this).stop().animate({"opacity": "0"}, 700 );
		},
		function() {
		$(this).stop().animate({"opacity": "1"}, 900 );
		
		});
	 
	});

$(document).ready(function() {
    $('#background_monster').cycle({
		fx: 'fade',
		random: 1, 
		timeout: 6000,
		speed: 200,
		cleartypeNoBg:  true
	});
});
