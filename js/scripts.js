/*window.onload = function() {
	if (localStorage.getItem('returnVisit')) {
		var intro = document.getElementById('i');
    if (intro) {
      intro.innerHTML = 'Hey, welcome back<span>.</span>'
    }
	} else {
		localStorage.setItem('returnVisit', 'true');	
	}
}*/


// Load fonts
(function(w){
  if (w.document.documentElement.className.indexOf('fonts-loaded') > -1){ return; }
  var bodyFont = new FontFaceObserver('Merriweather');
  var headerFont = new FontFaceObserver('Lato');
  Promise.all([bodyFont.load(), headerFont.load()]).then(function () {
    console.log('Fonts loaded');
    w.document.documentElement.className += ' fonts-loaded';
  });
}(this));

Barba.Pjax.start();
Barba.Prefetch.init();

Barba.Dispatcher.on('initStateChange', function() {
  var path = location.pathname;
  //console.log(path);
  if (path != '/') {
    ga('send', 'pageview', path);
    ga('send', 'event', 'pageview', path, '');
  }
});

var delay = 900;

var SlideTransition = Barba.BaseTransition.extend({
  start: function() {
	Promise.all([this.newContainerLoading, this.slideOut()]).then(this.slideIn.bind(this));
  },

  slideOut: function() {
  	var elem = this.oldContainer;
  	elem.classList.remove('transition-in');
	elem.offsetWidth = elem.offsetWidth;
	return elem.classList.add('transition-out');
    //.promise();
  },

  slideIn: function() {
    var _this = this;
    var elem = _this.newContainer;
    elem.classList.add('transition-in');
    elem.style.visibility = 'visible';
    //elem.style.opacity = 0;
    window.scrollTo(0, 0);

    if (window.innerWidth < 512) {
    	delay = 300;	
    } else {
    	delay = 900;
    }

    var waitTime = window.setTimeout(function() {
    	_this.oldContainer.style.visibility = 'hidden';
    	_this.done();
    	window.clearTimeout(waitTime);
    	elem.classList.remove('transition-in');
		elem.offsetWidth = elem.offsetWidth;
    }, delay) 
  }
});


Barba.Pjax.getTransition = function() {
  return SlideTransition;
};


if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}
