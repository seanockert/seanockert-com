(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var Parallax = (function(){

	var elems = new Array();

	var ids = [
		{id: 'container', offset: 0},
		{id: 'logo', offset: 10},
		{id: 'fruit', offset: 15},
		{id: 'streamers', offset: 25}
	];

	for (var i=0;i<ids.length;i++) {
		var elem = document.getElementById(ids[i].id);
		elems.push(elem);
	}

	orientation = 0,
	perspective = {
		cx: 50, // current x
		cy: 50, // current y
		tx: 50, // target x
		ty: 50  // target y
	};

	function initialize() {

		addEventListener( 'orientationchange', onOrientationChange, false );
		addEventListener( 'devicemotion', onMotionChange, false );
		addEventListener( 'mousemove', onMouseMove, false);

		updateOrientation();
		//update();
		requestAnimationFrame(update);
	}

	function onMouseMove( event ) {
		perspective.tx = Math.round( ( event.clientX / window.innerWidth ) * 100 );
		perspective.ty = Math.round( ( event.clientY / window.innerHeight ) * 100 );
	}

	function onOrientationChange( event ) {
		updateOrientation();
		event.preventDefault();
	}

	function onMotionChange( event ) {
		var beta = orientation === 1 ? -event.accelerationIncludingGravity.z : -event.accelerationIncludingGravity.z;
		var gamma = orientation === 1 ? -event.accelerationIncludingGravity.y : -event.accelerationIncludingGravity.x;

		perspective.tx = ( ( gamma / 3.5 ) + 0.5 ) * 100;
		perspective.ty = ( ( beta / 5 ) - 0.5 ) * 100;

		event.preventDefault();
	}

	function updateOrientation() {
		// Check if we're in portrait or landscape mode as we'll need
		// to use different values from the accelerometer
		if( window.orientation == 90 || window.orientation == -90 ) {
			orientation = 1;
		} else {
			orientation = 0;
		}
	}

	function update() {

		if (parallaxVisible) {
			// Interpolate towards the target perspective
			perspective.cx += ( perspective.tx - perspective.cx ) * 0.1;
			perspective.cy += ( perspective.ty - perspective.cy ) * 0.05;

			// Apply the current perspective
      container.style.webkitPerspectiveOrigin = perspective.cx + '% ' + perspective.cy + '%';
			container.style.mozPerspectiveOrigin = perspective.cx + '% ' + perspective.cy + '%';
			container.style.perspectiveOrigin = perspective.cx + '% ' + perspective.cy + '%';

			// Used to control z-indices of our elements, first item == bottom
			for( var i = 0, len = elems.length; i < len; i ++ ) {
				elems[i].style.zIndex = i;
			}
			/*
			tiltx = perspective.cx/10;
			tilty = perspective.cx/10;
			degree = perspective.cx/100;
			$('#streamers').css('-webkit-transform','rotate3d(' + tiltx + ', ' + tilty + ', 0, ' + degree + 'deg)');
			$('#logo').css('-webkit-transform','rotate3d(' + tiltx/5 + ', ' + tilty/5 + ', 0, ' + degree/5 + 'deg)');
			*/
		}
	
		// Recursively call update
		requestAnimationFrame(update);
	}

	initialize();

})();
