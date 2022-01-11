window.onload = function() {
  window.slider = Swipe(document.getElementById('swipe'), {
    startSlide: 0,
    auto: 3000,
    continuous: true,
    // disableScroll: true,
    // stopPropagation: true,
    // callback: function(index, element) {},
    // transitionEnd: function(index, element) {}
  });
}
