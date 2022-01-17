/*window.fbAsyncInit = function() {
  FB.init({
    appId      : '1398750203707545',
    xfbml      : true,
    version    : 'v2.2'
  });
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));  
*/
;(function () {
  'use strict';

  /**
   * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
   *
   * @codingstandard ftlabs-jsv2
   * @copyright The Financial Times Limited [All Rights Reserved]
   * @license MIT License (see LICENSE.txt)
   */

  /*jslint browser:true, node:true*/
  /*global define, Event, Node*/


  /**
   * Instantiate fast-clicking listeners on the specified layer.
   *
   * @constructor
   * @param {Element} layer The layer to listen on
   * @param {Object} [options={}] The options to override the defaults
   */
  function FastClick(layer, options) {
    var oldOnClick;

    options = options || {};

    /**
     * Whether a click is currently being tracked.
     *
     * @type boolean
     */
    this.trackingClick = false;


    /**
     * Timestamp for when click tracking started.
     *
     * @type number
     */
    this.trackingClickStart = 0;


    /**
     * The element being tracked for a click.
     *
     * @type EventTarget
     */
    this.targetElement = null;


    /**
     * X-coordinate of touch start event.
     *
     * @type number
     */
    this.touchStartX = 0;


    /**
     * Y-coordinate of touch start event.
     *
     * @type number
     */
    this.touchStartY = 0;


    /**
     * ID of the last touch, retrieved from Touch.identifier.
     *
     * @type number
     */
    this.lastTouchIdentifier = 0;


    /**
     * Touchmove boundary, beyond which a click will be cancelled.
     *
     * @type number
     */
    this.touchBoundary = options.touchBoundary || 10;


    /**
     * The FastClick layer.
     *
     * @type Element
     */
    this.layer = layer;

    /**
     * The minimum time between tap(touchstart and touchend) events
     *
     * @type number
     */
    this.tapDelay = options.tapDelay || 200;

    /**
     * The maximum time for a tap
     *
     * @type number
     */
    this.tapTimeout = options.tapTimeout || 700;

    if (FastClick.notNeeded(layer)) {
      return;
    }

    // Some old versions of Android don't have Function.prototype.bind
    function bind(method, context) {
      return function() { return method.apply(context, arguments); };
    }


    var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
    var context = this;
    for (var i = 0, l = methods.length; i < l; i++) {
      context[methods[i]] = bind(context[methods[i]], context);
    }

    // Set up event handlers as required
    if (deviceIsAndroid) {
      layer.addEventListener('mouseover', this.onMouse, true);
      layer.addEventListener('mousedown', this.onMouse, true);
      layer.addEventListener('mouseup', this.onMouse, true);
    }

    layer.addEventListener('click', this.onClick, true);
    layer.addEventListener('touchstart', this.onTouchStart, false);
    layer.addEventListener('touchmove', this.onTouchMove, false);
    layer.addEventListener('touchend', this.onTouchEnd, false);
    layer.addEventListener('touchcancel', this.onTouchCancel, false);

    // Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
    // which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
    // layer when they are cancelled.
    if (!Event.prototype.stopImmediatePropagation) {
      layer.removeEventListener = function(type, callback, capture) {
        var rmv = Node.prototype.removeEventListener;
        if (type === 'click') {
          rmv.call(layer, type, callback.hijacked || callback, capture);
        } else {
          rmv.call(layer, type, callback, capture);
        }
      };

      layer.addEventListener = function(type, callback, capture) {
        var adv = Node.prototype.addEventListener;
        if (type === 'click') {
          adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
            if (!event.propagationStopped) {
              callback(event);
            }
          }), capture);
        } else {
          adv.call(layer, type, callback, capture);
        }
      };
    }

    // If a handler is already declared in the element's onclick attribute, it will be fired before
    // FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
    // adding it as listener.
    if (typeof layer.onclick === 'function') {

      // Android browser on at least 3.2 requires a new reference to the function in layer.onclick
      // - the old one won't work if passed to addEventListener directly.
      oldOnClick = layer.onclick;
      layer.addEventListener('click', function(event) {
        oldOnClick(event);
      }, false);
      layer.onclick = null;
    }
  }

  /**
  * Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
  *
  * @type boolean
  */
  var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

  /**
   * Android requires exceptions.
   *
   * @type boolean
   */
  var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


  /**
   * iOS requires exceptions.
   *
   * @type boolean
   */
  var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


  /**
   * iOS 4 requires an exception for select elements.
   *
   * @type boolean
   */
  var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


  /**
   * iOS 6.0-7.* requires the target element to be manually derived
   *
   * @type boolean
   */
  var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

  /**
   * BlackBerry requires exceptions.
   *
   * @type boolean
   */
  var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

  /**
   * Determine whether a given element requires a native click.
   *
   * @param {EventTarget|Element} target Target DOM element
   * @returns {boolean} Returns true if the element needs a native click
   */
  FastClick.prototype.needsClick = function(target) {
    switch (target.nodeName.toLowerCase()) {

    // Don't send a synthetic click to disabled inputs (issue #62)
    case 'button':
    case 'select':
    case 'textarea':
      if (target.disabled) {
        return true;
      }

      break;
    case 'input':

      // File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
      if ((deviceIsIOS && target.type === 'file') || target.disabled) {
        return true;
      }

      break;
    case 'label':
    case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
    case 'video':
      return true;
    }

    return (/\bneedsclick\b/).test(target.className);
  };


  /**
   * Determine whether a given element requires a call to focus to simulate click into element.
   *
   * @param {EventTarget|Element} target Target DOM element
   * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
   */
  FastClick.prototype.needsFocus = function(target) {
    switch (target.nodeName.toLowerCase()) {
    case 'textarea':
      return true;
    case 'select':
      return !deviceIsAndroid;
    case 'input':
      switch (target.type) {
      case 'button':
      case 'checkbox':
      case 'file':
      case 'image':
      case 'radio':
      case 'submit':
        return false;
      }

      // No point in attempting to focus disabled inputs
      return !target.disabled && !target.readOnly;
    default:
      return (/\bneedsfocus\b/).test(target.className);
    }
  };


  /**
   * Send a click event to the specified element.
   *
   * @param {EventTarget|Element} targetElement
   * @param {Event} event
   */
  FastClick.prototype.sendClick = function(targetElement, event) {
    var clickEvent, touch;

    // On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
    if (document.activeElement && document.activeElement !== targetElement) {
      document.activeElement.blur();
    }

    touch = event.changedTouches[0];

    // Synthesise a click event, with an extra attribute so it can be tracked
    clickEvent = document.createEvent('MouseEvents');
    clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
    clickEvent.forwardedTouchEvent = true;
    targetElement.dispatchEvent(clickEvent);
  };

  FastClick.prototype.determineEventType = function(targetElement) {

    //Issue #159: Android Chrome Select Box does not open with a synthetic click event
    if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
      return 'mousedown';
    }

    return 'click';
  };


  /**
   * @param {EventTarget|Element} targetElement
   */
  FastClick.prototype.focus = function(targetElement) {
    var length;

    // Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
    if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
      length = targetElement.value.length;
      targetElement.setSelectionRange(length, length);
    } else {
      targetElement.focus();
    }
  };


  /**
   * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
   *
   * @param {EventTarget|Element} targetElement
   */
  FastClick.prototype.updateScrollParent = function(targetElement) {
    var scrollParent, parentElement;

    scrollParent = targetElement.fastClickScrollParent;

    // Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
    // target element was moved to another parent.
    if (!scrollParent || !scrollParent.contains(targetElement)) {
      parentElement = targetElement;
      do {
        if (parentElement.scrollHeight > parentElement.offsetHeight) {
          scrollParent = parentElement;
          targetElement.fastClickScrollParent = parentElement;
          break;
        }

        parentElement = parentElement.parentElement;
      } while (parentElement);
    }

    // Always update the scroll top tracker if possible.
    if (scrollParent) {
      scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
    }
  };


  /**
   * @param {EventTarget} targetElement
   * @returns {Element|EventTarget}
   */
  FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {

    // On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
    if (eventTarget.nodeType === Node.TEXT_NODE) {
      return eventTarget.parentNode;
    }

    return eventTarget;
  };


  /**
   * On touch start, record the position and scroll offset.
   *
   * @param {Event} event
   * @returns {boolean}
   */
  FastClick.prototype.onTouchStart = function(event) {
    var targetElement, touch, selection;

    // Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
    if (event.targetTouches.length > 1) {
      return true;
    }

    targetElement = this.getTargetElementFromEventTarget(event.target);
    touch = event.targetTouches[0];

    if (deviceIsIOS) {

      // Only trusted events will deselect text on iOS (issue #49)
      selection = window.getSelection();
      if (selection.rangeCount && !selection.isCollapsed) {
        return true;
      }

      if (!deviceIsIOS4) {

        // Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
        // when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
        // with the same identifier as the touch event that previously triggered the click that triggered the alert.
        // Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
        // immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
        // Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
        // which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
        // random integers, it's safe to to continue if the identifier is 0 here.
        if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
          event.preventDefault();
          return false;
        }

        this.lastTouchIdentifier = touch.identifier;

        // If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
        // 1) the user does a fling scroll on the scrollable layer
        // 2) the user stops the fling scroll with another tap
        // then the event.target of the last 'touchend' event will be the element that was under the user's finger
        // when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
        // is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
        this.updateScrollParent(targetElement);
      }
    }

    this.trackingClick = true;
    this.trackingClickStart = event.timeStamp;
    this.targetElement = targetElement;

    this.touchStartX = touch.pageX;
    this.touchStartY = touch.pageY;

    // Prevent phantom clicks on fast double-tap (issue #36)
    if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
      event.preventDefault();
    }

    return true;
  };


  /**
   * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
   *
   * @param {Event} event
   * @returns {boolean}
   */
  FastClick.prototype.touchHasMoved = function(event) {
    var touch = event.changedTouches[0], boundary = this.touchBoundary;

    if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
      return true;
    }

    return false;
  };


  /**
   * Update the last position.
   *
   * @param {Event} event
   * @returns {boolean}
   */
  FastClick.prototype.onTouchMove = function(event) {
    if (!this.trackingClick) {
      return true;
    }

    // If the touch has moved, cancel the click tracking
    if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
      this.trackingClick = false;
      this.targetElement = null;
    }

    return true;
  };


  /**
   * Attempt to find the labelled control for the given label element.
   *
   * @param {EventTarget|HTMLLabelElement} labelElement
   * @returns {Element|null}
   */
  FastClick.prototype.findControl = function(labelElement) {

    // Fast path for newer browsers supporting the HTML5 control attribute
    if (labelElement.control !== undefined) {
      return labelElement.control;
    }

    // All browsers under test that support touch events also support the HTML5 htmlFor attribute
    if (labelElement.htmlFor) {
      return document.getElementById(labelElement.htmlFor);
    }

    // If no for attribute exists, attempt to retrieve the first labellable descendant element
    // the list of which is defined here: https://www.w3.org/TR/html5/forms.html#category-label
    return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
  };


  /**
   * On touch end, determine whether to send a click event at once.
   *
   * @param {Event} event
   * @returns {boolean}
   */
  FastClick.prototype.onTouchEnd = function(event) {
    var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

    if (!this.trackingClick) {
      return true;
    }

    // Prevent phantom clicks on fast double-tap (issue #36)
    if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
      this.cancelNextClick = true;
      return true;
    }

    if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
      return true;
    }

    // Reset to prevent wrong click cancel on input (issue #156).
    this.cancelNextClick = false;

    this.lastClickTime = event.timeStamp;

    trackingClickStart = this.trackingClickStart;
    this.trackingClick = false;
    this.trackingClickStart = 0;

    // On some iOS devices, the targetElement supplied with the event is invalid if the layer
    // is performing a transition or scroll, and has to be re-detected manually. Note that
    // for this to function correctly, it must be called *after* the event target is checked!
    // See issue #57; also filed as rdar://13048589 .
    if (deviceIsIOSWithBadTarget) {
      touch = event.changedTouches[0];

      // In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
      targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
      targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
    }

    targetTagName = targetElement.tagName.toLowerCase();
    if (targetTagName === 'label') {
      forElement = this.findControl(targetElement);
      if (forElement) {
        this.focus(targetElement);
        if (deviceIsAndroid) {
          return false;
        }

        targetElement = forElement;
      }
    } else if (this.needsFocus(targetElement)) {

      // Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
      // Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
      if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
        this.targetElement = null;
        return false;
      }

      this.focus(targetElement);
      this.sendClick(targetElement, event);

      // Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
      // Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
      if (!deviceIsIOS || targetTagName !== 'select') {
        this.targetElement = null;
        event.preventDefault();
      }

      return false;
    }

    if (deviceIsIOS && !deviceIsIOS4) {

      // Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
      // and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
      scrollParent = targetElement.fastClickScrollParent;
      if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
        return true;
      }
    }

    // Prevent the actual click from going though - unless the target node is marked as requiring
    // real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
    if (!this.needsClick(targetElement)) {
      event.preventDefault();
      this.sendClick(targetElement, event);
    }

    return false;
  };


  /**
   * On touch cancel, stop tracking the click.
   *
   * @returns {void}
   */
  FastClick.prototype.onTouchCancel = function() {
    this.trackingClick = false;
    this.targetElement = null;
  };


  /**
   * Determine mouse events which should be permitted.
   *
   * @param {Event} event
   * @returns {boolean}
   */
  FastClick.prototype.onMouse = function(event) {

    // If a target element was never set (because a touch event was never fired) allow the event
    if (!this.targetElement) {
      return true;
    }

    if (event.forwardedTouchEvent) {
      return true;
    }

    // Programmatically generated events targeting a specific element should be permitted
    if (!event.cancelable) {
      return true;
    }

    // Derive and check the target element to see whether the mouse event needs to be permitted;
    // unless explicitly enabled, prevent non-touch click events from triggering actions,
    // to prevent ghost/doubleclicks.
    if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

      // Prevent any user-added listeners declared on FastClick element from being fired.
      if (event.stopImmediatePropagation) {
        event.stopImmediatePropagation();
      } else {

        // Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
        event.propagationStopped = true;
      }

      // Cancel the event
      event.stopPropagation();
      event.preventDefault();

      return false;
    }

    // If the mouse event is permitted, return true for the action to go through.
    return true;
  };


  /**
   * On actual clicks, determine whether this is a touch-generated click, a click action occurring
   * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
   * an actual click which should be permitted.
   *
   * @param {Event} event
   * @returns {boolean}
   */
  FastClick.prototype.onClick = function(event) {
    var permitted;

    // It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
    if (this.trackingClick) {
      this.targetElement = null;
      this.trackingClick = false;
      return true;
    }

    // Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
    if (event.target.type === 'submit' && event.detail === 0) {
      return true;
    }

    permitted = this.onMouse(event);

    // Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
    if (!permitted) {
      this.targetElement = null;
    }

    // If clicks are permitted, return true for the action to go through.
    return permitted;
  };


  /**
   * Remove all FastClick's event listeners.
   *
   * @returns {void}
   */
  FastClick.prototype.destroy = function() {
    var layer = this.layer;

    if (deviceIsAndroid) {
      layer.removeEventListener('mouseover', this.onMouse, true);
      layer.removeEventListener('mousedown', this.onMouse, true);
      layer.removeEventListener('mouseup', this.onMouse, true);
    }

    layer.removeEventListener('click', this.onClick, true);
    layer.removeEventListener('touchstart', this.onTouchStart, false);
    layer.removeEventListener('touchmove', this.onTouchMove, false);
    layer.removeEventListener('touchend', this.onTouchEnd, false);
    layer.removeEventListener('touchcancel', this.onTouchCancel, false);
  };


  /**
   * Check whether FastClick is needed.
   *
   * @param {Element} layer The layer to listen on
   */
  FastClick.notNeeded = function(layer) {
    var metaViewport;
    var chromeVersion;
    var blackberryVersion;
    var firefoxVersion;

    // Devices that don't support touch don't need FastClick
    if (typeof window.ontouchstart === 'undefined') {
      return true;
    }

    // Chrome version - zero for other browsers
    chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

    if (chromeVersion) {

      if (deviceIsAndroid) {
        metaViewport = document.querySelector('meta[name=viewport]');

        if (metaViewport) {
          // Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
          if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
            return true;
          }
          // Chrome 32 and above with width=device-width or less don't need FastClick
          if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
            return true;
          }
        }

      // Chrome desktop doesn't need FastClick (issue #15)
      } else {
        return true;
      }
    }

    if (deviceIsBlackBerry10) {
      blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

      // BlackBerry 10.3+ does not require Fastclick library.
      // https://github.com/ftlabs/fastclick/issues/251
      if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
        metaViewport = document.querySelector('meta[name=viewport]');

        if (metaViewport) {
          // user-scalable=no eliminates click delay.
          if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
            return true;
          }
          // width=device-width (or less than device-width) eliminates click delay.
          if (document.documentElement.scrollWidth <= window.outerWidth) {
            return true;
          }
        }
      }
    }

    // IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
    if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
      return true;
    }

    // Firefox version - zero for other browsers
    firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

    if (firefoxVersion >= 27) {
      // Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

      metaViewport = document.querySelector('meta[name=viewport]');
      if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
        return true;
      }
    }

    // IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
    // https://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
    if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
      return true;
    }

    return false;
  };


  /**
   * Factory method for creating a FastClick object
   *
   * @param {Element} layer The layer to listen on
   * @param {Object} [options={}] The options to override the defaults
   */
  FastClick.attach = function(layer, options) {
    return new FastClick(layer, options);
  };


  if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

    // AMD. Register as an anonymous module.
    define(function() {
      return FastClick;
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = FastClick.attach;
    module.exports.FastClick = FastClick;
  } else {
    window.FastClick = FastClick;
  }
}());
(function(a){var l,n,p,q,r,s,t,b="Close",c="BeforeAppend",d="MarkupParse",e="Open",f="Change",g="mfp",h="."+g,i="mfp-ready",j="mfp-removing",k="mfp-prevent-close",m=function(){},o=a(window),u=function(a,b){l.ev.on(g+a+h,b)},v=function(b,c,d,e){var f=document.createElement("div");return f.className="mfp-"+b,d&&(f.innerHTML=d),e?c&&c.appendChild(f):(f=a(f),c&&f.appendTo(c)),f},w=function(b,c){l.ev.triggerHandler(g+b,c),l.st.callbacks&&(b=b.charAt(0).toLowerCase()+b.slice(1),l.st.callbacks[b]&&l.st.callbacks[b].apply(l,a.isArray(c)?c:[c]))},x=function(){(l.st.focus?l.content.find(l.st.focus).eq(0):l.wrap).focus()},y=function(b){return b===t&&l.currTemplate.closeBtn||(l.currTemplate.closeBtn=a(l.st.closeMarkup.replace("%title%",l.st.tClose)),t=b),l.currTemplate.closeBtn};m.prototype={constructor:m,init:function(){var b=navigator.appVersion;l.isIE7=-1!==b.indexOf("MSIE 7."),l.isAndroid=/android/gi.test(b),l.isIOS=/iphone|ipad|ipod/gi.test(b),l.probablyMobile=l.isAndroid||l.isIOS||/(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent),p=a(document.body),q=a(document),l.popupsCache={}},open:function(b){if(!l.isOpen){var c;if(l.types=[],s="",l.ev=b.el||q,b.isObj)l.index=b.index||0;else{l.index=0;var g,f=b.items;for(c=0;f.length>c;c++)if(g=f[c],g.parsed&&(g=g.el[0]),g===b.el[0]){l.index=c;break}}b.key?(l.popupsCache[b.key]||(l.popupsCache[b.key]={}),l.currTemplate=l.popupsCache[b.key]):l.currTemplate={},l.st=a.extend(!0,{},a.magnificPopup.defaults,b),l.fixedContentPos="auto"===l.st.fixedContentPos?!l.probablyMobile:l.st.fixedContentPos,l.items=b.items.length?b.items:[b.items],l.bgOverlay||(l.bgOverlay=v("bg").on("click"+h,function(){l.close()}),l.wrap=v("wrap").attr("tabindex",-1).on("click"+h,function(b){var c=b.target;a(c).hasClass(k)||(l.st.closeOnContentClick?l.close():(!l.content||a(c).hasClass("mfp-close")||l.preloader&&b.target===l.preloader[0]||c!==l.content[0]&&!a.contains(l.content[0],c))&&l.close())}),l.container=v("container",l.wrap)),l.contentContainer=v("content"),l.st.preloader&&(l.preloader=v("preloader",l.container,l.st.tLoading));var j=a.magnificPopup.modules;for(c=0;j.length>c;c++){var m=j[c];m=m.charAt(0).toUpperCase()+m.slice(1),l["init"+m].call(l)}w("BeforeOpen"),l.st.closeBtnInside?(u(d,function(a,b,c,d){c.close_replaceWith=y(d.type)}),s+=" mfp-close-btn-in"):l.wrap.append(y()),l.st.alignTop&&(s+=" mfp-align-top"),l.fixedContentPos?l.wrap.css({overflow:l.st.overflowY,overflowX:"hidden",overflowY:l.st.overflowY}):l.wrap.css({top:o.scrollTop(),position:"absolute"}),(l.st.fixedBgPos===!1||"auto"===l.st.fixedBgPos&&!l.fixedContentPos)&&l.bgOverlay.css({height:q.height(),position:"absolute"}),q.on("keyup"+h,function(a){27===a.keyCode&&l.close()}),o.on("resize"+h,function(){l.updateSize()}),l.st.closeOnContentClick||(s+=" mfp-auto-cursor"),s&&l.wrap.addClass(s);var n=l.wH=o.height(),r={};if(l.fixedContentPos&&"scroll"!==l.st.overflowY){var t=l._getScrollbarSize();t&&(r.paddingRight=t)}l.fixedContentPos&&(l.isIE7?a("body, html").css("overflow","hidden"):r.overflow="hidden");var z=l.st.mainClass;l.isIE7&&(z+=" mfp-ie7"),z&&l._addClassToMFP(z),l.updateItemHTML(),w("BuildControls"),p.css(r),l.bgOverlay.add(l.wrap).prependTo(document.body),l._lastFocusedEl=document.activeElement,setTimeout(function(){l.content?(l._addClassToMFP(i),x()):l.bgOverlay.addClass(i),q.on("focusin"+h,function(b){return b.target===l.wrap[0]||a.contains(l.wrap[0],b.target)?void 0:(x(),!1)})},16),l.isOpen=!0,l.updateSize(n),w(e)}},close:function(){l.isOpen&&(l.isOpen=!1,l.st.removalDelay?(l._addClassToMFP(j),setTimeout(function(){l._close()},l.st.removalDelay)):l._close())},_close:function(){w(b);var c=j+" "+i+" ";if(l.bgOverlay.detach(),l.wrap.detach(),l.container.empty(),l.st.mainClass&&(c+=l.st.mainClass+" "),l._removeClassFromMFP(c),l.fixedContentPos){var d={paddingRight:0};l.isIE7?a("body, html").css("overflow","auto"):d.overflow="visible",p.css(d)}q.off("keyup"+h+" focusin"+h),l.ev.off(h),l.wrap.attr("class","mfp-wrap").removeAttr("style"),l.bgOverlay.attr("class","mfp-bg"),l.container.attr("class","mfp-container"),l.st.closeBtnInside&&l.currTemplate[l.currItem.type]!==!0||l.currTemplate.closeBtn&&l.currTemplate.closeBtn.detach(),l._lastFocusedEl&&a(l._lastFocusedEl).focus(),l.content=null,l.currTemplate=null,l.prevHeight=0},updateSize:function(a){if(l.isIOS){var b=document.documentElement.clientWidth/window.innerWidth,c=window.innerHeight*b;l.wrap.css("height",c),l.wH=c}else l.wH=a||o.height();w("Resize")},updateItemHTML:function(){var b=l.items[l.index];l.contentContainer.detach(),l.content&&l.content.detach(),b.parsed||(b=l.parseEl(l.index)),l.currItem=b;var c=b.type;if(!l.currTemplate[c]){var d=l.st[c]?l.st[c].markup:!1;w("FirstMarkupParse",d),l.currTemplate[c]=d?a(d):!0}r&&r!==b.type&&l.container.removeClass("mfp-"+r+"-holder");var e=l["get"+c.charAt(0).toUpperCase()+c.slice(1)](b,l.currTemplate[c]);l.appendContent(e,c),b.preloaded=!0,w(f,b),r=b.type,l.container.prepend(l.contentContainer)},appendContent:function(a,b){l.content=a,a?l.st.closeBtnInside&&l.currTemplate[b]===!0?l.content.find(".mfp-close").length||l.content.append(y()):l.content=a:l.content="",w(c),l.container.addClass("mfp-"+b+"-holder"),l.contentContainer.append(l.content)},parseEl:function(b){var c=l.items[b],d=c.type;if(c=c.tagName?{el:a(c)}:{data:c,src:c.src},c.el){for(var e=l.types,f=0;e.length>f;f++)if(c.el.hasClass("mfp-"+e[f])){d=e[f];break}c.src=c.el.attr("data-mfp-src"),c.src||(c.src=c.el.attr("href"))}return c.type=d||l.st.type,c.index=b,c.parsed=!0,l.items[b]=c,w("ElementParse",c),l.items[b]},addGroup:function(b,c){var d=function(d){var e=void 0!==c.midClick?c.midClick:a.magnificPopup.defaults.midClick;if(e||2!==d.which){var f=void 0!==c.disableOn?c.disableOn:a.magnificPopup.defaults.disableOn;if(f)if(a.isFunction(f)){if(!f.call(l))return!0}else if(f>a(window).width())return!0;d.preventDefault(),c.el=a(this),c.mainEl=b,c.delegate&&(c.items=b.find(c.delegate)),l.open(c)}};c||(c={});var e="click.magnificPopup";c.items?(c.isObj=!0,b.off(e).on(e,d)):(c.isObj=!1,c.delegate?b.off(e).on(e,c.delegate,d):(c.items=b,b.off(e).on(e,d)))},updateStatus:function(a,b){if(l.preloader){n!==a&&l.container.removeClass("mfp-s-"+n),b||"loading"!==a||(b=l.st.tLoading);var c={status:a,text:b};w("UpdateStatus",c),a=c.status,b=c.text,l.preloader.html(b),l.preloader.find("a").click(function(a){a.stopImmediatePropagation()}),l.container.addClass("mfp-s-"+a),n=a}},_addClassToMFP:function(a){l.bgOverlay.addClass(a),l.wrap.addClass(a)},_removeClassFromMFP:function(a){this.bgOverlay.removeClass(a),l.wrap.removeClass(a)},_hasScrollBar:function(a){return document.body.clientHeight>(a||o.height())?!0:!1},_parseMarkup:function(b,c,e){var f;e.data&&(c=a.extend(e.data,c)),w(d,[b,c,e]),a.each(c,function(a,c){if(void 0===c||c===!1)return!0;if(f=a.split("_"),f.length>1){var d=b.find(h+"-"+f[0]);if(d.length>0){var e=f[1];"replaceWith"===e?d[0]!==c[0]&&d.replaceWith(c):"img"===e?d.is("img")?d.attr("src",c):d.replaceWith('<img src="'+c+'" class="'+d.attr("class")+'" />'):d.attr(f[1],c)}}else b.find(h+"-"+a).html(c)})},_getScrollbarSize:function(){if(void 0===l.scrollbarSize){var a=document.createElement("div");a.id="mfp-sbm",a.style.cssText="width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;",document.body.appendChild(a),l.scrollbarSize=a.offsetWidth-a.clientWidth,document.body.removeChild(a)}return l.scrollbarSize}},a.magnificPopup={instance:null,proto:m.prototype,modules:[],open:function(b,c){return a.magnificPopup.instance||(l=new m,l.init(),a.magnificPopup.instance=l),b||(b={}),b.isObj=!0,b.index=void 0===c?0:c,this.instance.open(b)},close:function(){return a.magnificPopup.instance.close()},registerModule:function(b,c){c.options&&(a.magnificPopup.defaults[b]=c.options),a.extend(this.proto,c.proto),this.modules.push(b)},defaults:{disableOn:0,key:null,midClick:!1,mainClass:"",preloader:!0,focus:"",closeOnContentClick:!1,closeBtnInside:!0,alignTop:!1,removalDelay:0,fixedContentPos:"auto",fixedBgPos:"auto",overflowY:"auto",closeMarkup:'<button title="%title%" type="button" class="mfp-close">&times;</button>',tClose:"Close (Esc)",tLoading:"Loading..."}},a.fn.magnificPopup=function(b){return a.magnificPopup.instance||(l=new m,l.init(),a.magnificPopup.instance=l),l.addGroup(a(this),b),a(this)};var A,z="inline";a.magnificPopup.registerModule(z,{options:{hiddenClass:g+"-hide",markup:"",tNotFound:"Content not found"},proto:{initInline:function(){l.types.push(z),A=!1,u(b+"."+z,function(){var a=l.currItem;if(a.type===z){if(A)for(var b=0;l.items.length>b;b++)a=l.items[b],a&&a.inlinePlaceholder&&a.inlinePlaceholder.after(a.inlineElement.addClass(l.st.inline.hiddenClass)).detach();a.inlinePlaceholder=a.inlineElement=null}})},getInline:function(b,c){if(l.updateStatus("ready"),b.src){var d=l.st.inline;return"string"!=typeof b.src&&(b.isElement=!0),b.isElement||b.inlinePlaceholder||(b.inlinePlaceholder=v(d.hiddenClass)),b.isElement?b.inlineElement=b.src:b.inlineElement||(b.inlineElement=a(b.src),b.inlineElement.length||(l.updateStatus("error",d.tNotFound),b.inlineElement=a("<div>"))),b.inlinePlaceholder&&(A=!0),b.inlineElement.after(b.inlinePlaceholder).detach().removeClass(d.hiddenClass),b.inlineElement}return l._parseMarkup(c,{},b),c}}});var C,B="ajax",D=function(){C&&p.removeClass(C)};a.magnificPopup.registerModule(B,{options:{settings:null,cursor:"mfp-ajax-cur",tError:'<a href="%url%">The content</a> could not be loaded.'},proto:{initAjax:function(){l.types.push(B),C=l.st.ajax.cursor,u(b+"."+B,function(){D(),l.req&&l.req.abort()})},getAjax:function(b){C&&p.addClass(C),l.updateStatus("loading");var c=a.extend({url:b.src,success:function(c,d,e){w("ParseAjax",e),l.appendContent(a(e.responseText),B),b.finished=!0,D(),x(),setTimeout(function(){l.wrap.addClass(i)},16),l.updateStatus("ready")},error:function(){D(),b.finished=b.loadError=!0,l.updateStatus("error",l.st.ajax.tError.replace("%url%",b.src))}},l.st.ajax.settings);return l.req=a.ajax(c),""}}});var E,F=function(b){if(b.data&&void 0!==b.data.title)return b.data.title;var c=l.st.image.titleSrc;if(c){if(a.isFunction(c))return c.call(l,b);if(b.el)return b.el.attr(c)||""}return""};a.magnificPopup.registerModule("image",{options:{markup:'<div class="mfp-figure"><div class="mfp-close"></div><div class="mfp-img"></div><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></div>',cursor:"mfp-zoom-out-cur",titleSrc:"title",verticalFit:!0,tError:'<a href="%url%">The image</a> could not be loaded.'},proto:{initImage:function(){var a=l.st.image,c=".image";l.types.push("image"),u(e+c,function(){"image"===l.currItem.type&&a.cursor&&p.addClass(a.cursor)}),u(b+c,function(){a.cursor&&p.removeClass(a.cursor),o.off("resize"+h)}),u("Resize"+c,function(){l.resizeImage()})},resizeImage:function(){var a=l.currItem;a.img&&l.st.image.verticalFit&&a.img.css("max-height",l.wH+"px")},_onImageHasSize:function(a){a.img&&(a.hasSize=!0,E&&clearInterval(E),a.isCheckingImgSize=!1,w("ImageHasSize",a),a.imgHidden&&(l.content&&l.content.removeClass("mfp-loading"),a.imgHidden=!1))},findImageSize:function(a){var b=0,c=a.img[0],d=function(e){E&&clearInterval(E),E=setInterval(function(){return c.naturalWidth>0?(l._onImageHasSize(a),void 0):(b>200&&clearInterval(E),b++,3===b?d(10):40===b?d(50):100===b&&d(500),void 0)},e)};d(1)},getImage:function(b,c){var d=0,e=function(){b&&(b.img[0].complete?(b.img.off(".mfploader"),b===l.currItem&&(l._onImageHasSize(b),l.updateStatus("ready")),b.hasSize=!0,b.loaded=!0):(d++,200>d?setTimeout(e,100):f()))},f=function(){b&&(b.img.off(".mfploader"),b===l.currItem&&(l._onImageHasSize(b),l.updateStatus("error",g.tError.replace("%url%",b.src))),b.hasSize=!0,b.loaded=!0,b.loadError=!0)},g=l.st.image,h=c.find(".mfp-img");if(h.length){var i=new Image;i.className="mfp-img",b.img=a(i).on("load.mfploader",e).on("error.mfploader",f),i.src=b.src,h.is("img")&&(b.img=b.img.clone())}return l._parseMarkup(c,{title:F(b),img_replaceWith:b.img},b),l.resizeImage(),b.hasSize?(E&&clearInterval(E),b.loadError?(c.addClass("mfp-loading"),l.updateStatus("error",g.tError.replace("%url%",b.src))):(c.removeClass("mfp-loading"),l.updateStatus("ready")),c):(l.updateStatus("loading"),b.loading=!0,b.hasSize||(b.imgHidden=!0,c.addClass("mfp-loading"),l.findImageSize(b)),c)}}});var G="iframe",H=function(a){if(l.isIE7&&l.currItem&&l.currItem.type===G){var b=l.content.find("iframe");b.length&&b.css("display",a?"block":"none")}};a.magnificPopup.registerModule(G,{options:{markup:'<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe></div>',srcAction:"iframe_src",patterns:{youtube:{index:"youtube.com",id:"v=",src:"//www.youtube.com/embed/%id%?autoplay=1"},vimeo:{index:"vimeo.com/",id:"/",src:"//player.vimeo.com/video/%id%?autoplay=1"},gmaps:{index:"//maps.google.",src:"%id%&output=embed"}}},proto:{initIframe:function(){l.types.push(G),H(!0),u(b+"."+G,function(){H()})},getIframe:function(b,c){var d=b.src,e=l.st.iframe;a.each(e.patterns,function(){return d.indexOf(this.index)>-1?(this.id&&(d="string"==typeof this.id?d.substr(d.lastIndexOf(this.id)+this.id.length,d.length):this.id.call(this,d)),d=this.src.replace("%id%",d),!1):void 0});var f={};return e.srcAction&&(f[e.srcAction]=d),l._parseMarkup(c,f,b),l.updateStatus("ready"),c}}});var I=function(a){var b=l.items.length;return a>b-1?a-b:0>a?b+a:a},J=function(a,b,c){return a.replace("%curr%",b+1).replace("%total%",c)};a.magnificPopup.registerModule("gallery",{options:{enabled:!1,arrowMarkup:'<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',preload:[0,2],navigateByImgClick:!0,arrows:!0,tPrev:"Previous (Left arrow key)",tNext:"Next (Right arrow key)",tCounter:"%curr% of %total%"},proto:{initGallery:function(){var c=l.st.gallery,g=".mfp-gallery",h=Boolean(a.fn.mfpFastClick);return l.direction=!0,c&&c.enabled?(s+=" mfp-gallery",u(e+g,function(){c.navigateByImgClick&&l.wrap.on("click"+g,".mfp-img",function(){return l.next(),!1}),q.on("keydown"+g,function(a){37===a.keyCode?l.prev():39===a.keyCode&&l.next()})}),u("UpdateStatus"+g,function(a,b){b.text&&(b.text=J(b.text,l.currItem.index,l.items.length))}),u(d+g,function(a,b,d,e){var f=l.items.length;d.counter=f?J(c.tCounter,e.index,f):""}),u("BuildControls"+g,function(){if(c.arrows&&!l.arrowLeft){var b=c.arrowMarkup,d=l.arrowLeft=a(b.replace("%title%",c.tPrev).replace("%dir%","left")).addClass(k),e=l.arrowRight=a(b.replace("%title%",c.tNext).replace("%dir%","right")).addClass(k),f=h?"mfpFastClick":"click";d[f](function(){l.prev()}),e[f](function(){l.next()}),l.isIE7&&(v("b",d[0],!1,!0),v("a",d[0],!1,!0),v("b",e[0],!1,!0),v("a",e[0],!1,!0)),l.container.append(d.add(e))}}),u(f+g,function(){l._preloadTimeout&&clearTimeout(l._preloadTimeout),l._preloadTimeout=setTimeout(function(){l.preloadNearbyImages(),l._preloadTimeout=null},16)}),u(b+g,function(){q.off(g),l.wrap.off("click"+g),h&&l.arrowLeft.add(l.arrowRight).destroyMfpFastClick(),l.arrowRight=l.arrowLeft=null}),void 0):!1},next:function(){l.direction=!0,l.index=I(l.index+1),l.updateItemHTML()},prev:function(){l.direction=!1,l.index=I(l.index-1),l.updateItemHTML()},goTo:function(a){l.direction=a>=l.index,l.index=a,l.updateItemHTML()},preloadNearbyImages:function(){var d,a=l.st.gallery.preload,b=Math.min(a[0],l.items.length),c=Math.min(a[1],l.items.length);for(d=1;(l.direction?c:b)>=d;d++)l._preloadItem(l.index+d);for(d=1;(l.direction?b:c)>=d;d++)l._preloadItem(l.index-d)},_preloadItem:function(b){if(b=I(b),!l.items[b].preloaded){var c=l.items[b];c.parsed||(c=l.parseEl(b)),w("LazyLoad",c),"image"===c.type&&(c.img=a('<img class="mfp-img" />').on("load.mfploader",function(){c.hasSize=!0}).on("error.mfploader",function(){c.hasSize=!0,c.loadError=!0}).attr("src",c.src)),c.preloaded=!0}}}});var K="retina";a.magnificPopup.registerModule(K,{options:{replaceSrc:function(a){return a.src.replace(/\.\w+$/,function(a){return"@2x"+a})},ratio:1},proto:{initRetina:function(){if(window.devicePixelRatio>1){var a=l.st.retina,b=a.ratio;b=isNaN(b)?b():b,b>1&&(u("ImageHasSize."+K,function(a,c){c.img.css({"max-width":c.img[0].naturalWidth/b,width:"100%"})}),u("ElementParse."+K,function(c,d){d.src=a.replaceSrc(d,b)}))}}}})})(window.jQuery||window.Zepto);
var mobile = false;
var downloadLink = '';



$(document).ready(function() {
    
    
    $('html').addClass('canAnim');
    $('#episode-list img').unveil();
    
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
        modal: true,
        callbacks: {
            open: function(){
                $("#container").addClass('blur');
            },
            close: function(){
                $("#container").removeClass('blur');
            }
        }
    });      
    
    // Modal for showing video
    $('.video-modal').magnificPopup({
        type:'iframe',
        disableOn:568,
        callbacks: {
            open: function(){
                $("#container").addClass('blur');
            },
            close: function(){
                $("#container").removeClass('blur');
            }
        }
    }); 
    
    $('.image-modal').magnificPopup({
        type: 'image',
        disableOn:568,
        closeOnContentClick: true,
        //gallery:{ enabled:true },
        image: {
            verticalFit: true
        },
        callbacks: {
            open: function(){
                $("#container").addClass('blur');
            },
            close: function(){
                $("#container").removeClass('blur');
            }
        }
    });  


    // Close modal
    $(document).on('click', '.popup-modal-close', function (e) {
        e.preventDefault();
        $.magnificPopup.close();
    });    
    
    // For hompage carousel
    var elem = document.getElementById('slider'),
    swipeDiv = document.getElementById('slider-nav'),
    swipeNav;
    swipeNav = swipeDiv.getElementsByTagName('button');
    for (var i = 0, len = swipeNav.length; i < len; i++) {
        swipeNav[i].onclick = function() {
        slider.slide(this.getAttribute('data-slide'));
    };
    }
    window.slider = Swipe(elem, { // Init the slider
        startSlide: 0,
        auto: 10000,
        speed : 250,
        draggable: true,
        continuous: true,
        callback: function(index, elem) {
            $('.swipe-nav button').removeClass('active');
            $('.swipe-nav button[data-slide="'+index+'"]').addClass('active');
            
            $('#characters').removeClass();
            elem.offsetWidth = elem.offsetWidth;
            $('#characters').addClass('slide' + index);
        }
    });
             
    //Socialite.load();        
    
});

// Enable fastclick plugin to remove click delay on mobiles - more responsive feel
if (navigator.appName != 'Microsoft Internet Explorer') {
    window.addEventListener('load', function() {
        new FastClick(document.body);
    }, false);
}

$('a.arrow-right').click(function (e) {
    e.preventDefault();
    slider.next();
});

$('a.arrow-left').click(function (e) {
    e.preventDefault();
    slider.prev();
}); 

/*!
* Swipe 2.0.6
* (c) 2015 Brad Birdsall & Felix Liu
* https://github.com/lyfeyaj/swipe
*/

!function(a,b){"function"==typeof define&&define.amd?define([],function(){return a.Swipe=b()}):"object"==typeof exports?module.exports=b():a.Swipe=b()}(this,function(){function Swipe(c,d){"use strict";function e(){u=y.children,x=u.length,u.length<2&&(d.continuous=!1),t.transitions&&d.continuous&&u.length<3&&(y.appendChild(u[0].cloneNode(!0)),y.appendChild(y.children[1].cloneNode(!0)),u=y.children),v=new Array(u.length),w=c.getBoundingClientRect().width||c.offsetWidth,y.style.width=u.length*w*2+"px";for(var a=u.length;a--;){var b=u[a];b.style.width=w+"px",b.setAttribute("data-index",a),t.transitions&&(b.style.left=a*-w+"px",k(a,z>a?-w:a>z?w:0,0))}d.continuous&&t.transitions&&(k(h(z-1),-w,0),k(h(z+1),w,0)),t.transitions||(y.style.left=z*-w+"px"),c.style.visibility="visible"}function f(){d.continuous?j(z-1):z&&j(z-1)}function g(){d.continuous?j(z+1):z<u.length-1&&j(z+1)}function h(a){return(u.length+a%u.length)%u.length}function i(){var a=z;return a>=x&&(a-=x),a}function j(a,b){if(z!==a){if(t.transitions){var c=Math.abs(z-a)/(z-a);if(d.continuous){var e=c;c=-v[h(a)]/w,c!==e&&(a=-c*u.length+a)}for(var f=Math.abs(z-a)-1;f--;)k(h((a>z?a:z)-f-1),w*c,0);a=h(a),k(z,w*c,b||A),k(a,0,b||A),d.continuous&&k(h(a-c),-(w*c),0)}else a=h(a),m(z*-w,a*-w,b||A);z=a,s(d.callback&&d.callback(i(),u[z]))}}function k(a,b,c){l(a,b,c),v[a]=b}function l(a,b,c){var d=u[a],e=d&&d.style;e&&(e.webkitTransitionDuration=e.MozTransitionDuration=e.msTransitionDuration=e.OTransitionDuration=e.transitionDuration=c+"ms",e.webkitTransform="translate("+b+"px,0)translateZ(0)",e.msTransform=e.MozTransform=e.OTransform="translateX("+b+"px)")}function m(a,b,c){if(!c)return void(y.style.left=b+"px");var e=+new Date,f=setInterval(function(){var g=+new Date-e;return g>c?(y.style.left=b+"px",D&&n(),d.transitionEnd&&d.transitionEnd.call(event,i(),u[z]),void clearInterval(f)):void(y.style.left=(b-a)*(Math.floor(g/c*100)/100)+a+"px")},4)}function n(){B=setTimeout(g,D)}function o(){D=0,clearTimeout(B)}function p(){o(),D=d.auto||0,n()}function q(a){return/^mouse/.test(a.type)}var r=function(){},s=function(a){setTimeout(a||r,0)},t={addEventListener:!!a.addEventListener,touch:"ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch,transitions:function(a){var b=["transitionProperty","WebkitTransition","MozTransition","OTransition","msTransition"];for(var c in b)if(void 0!==a.style[b[c]])return!0;return!1}(b.createElement("swipe"))};if(c){var u,v,w,x,y=c.children[0];d=d||{};var z=parseInt(d.startSlide,10)||0,A=d.speed||300;d.continuous=void 0!==d.continuous?d.continuous:!0,d.autoRestart=void 0!==d.autoRestart?d.autoRestart:!1;var B,C,D=d.auto||0,E={},F={},G={handleEvent:function(a){switch(a.type){case"mousedown":case"touchstart":this.start(a);break;case"mousemove":case"touchmove":this.move(a);break;case"mouseup":case"mouseleave":case"touchend":s(this.end(a));break;case"webkitTransitionEnd":case"msTransitionEnd":case"oTransitionEnd":case"otransitionend":case"transitionend":s(this.transitionEnd(a));break;case"resize":s(e)}d.stopPropagation&&a.stopPropagation()},start:function(a){var b;q(a)?(b=a,a.preventDefault()):b=a.touches[0],E={x:b.pageX,y:b.pageY,time:+new Date},C=void 0,F={},q(a)?(y.addEventListener("mousemove",this,!1),y.addEventListener("mouseup",this,!1),y.addEventListener("mouseleave",this,!1)):(y.addEventListener("touchmove",this,!1),y.addEventListener("touchend",this,!1))},move:function(a){var b;if(q(a))b=a;else{if(a.touches.length>1||a.scale&&1!==a.scale)return;d.disableScroll&&a.preventDefault(),b=a.touches[0]}F={x:b.pageX-E.x,y:b.pageY-E.y},"undefined"==typeof C&&(C=!!(C||Math.abs(F.x)<Math.abs(F.y))),C||(a.preventDefault(),o(),d.continuous?(l(h(z-1),F.x+v[h(z-1)],0),l(z,F.x+v[z],0),l(h(z+1),F.x+v[h(z+1)],0)):(F.x=F.x/(!z&&F.x>0||z===u.length-1&&F.x<0?Math.abs(F.x)/w+1:1),l(z-1,F.x+v[z-1],0),l(z,F.x+v[z],0),l(z+1,F.x+v[z+1],0)))},end:function(a){var b=+new Date-E.time,c=Number(b)<250&&Math.abs(F.x)>20||Math.abs(F.x)>w/2,e=!z&&F.x>0||z===u.length-1&&F.x<0;d.continuous&&(e=!1);var f=F.x<0;C||(c&&!e?(f?(d.continuous?(k(h(z-1),-w,0),k(h(z+2),w,0)):k(z-1,-w,0),k(z,v[z]-w,A),k(h(z+1),v[h(z+1)]-w,A),z=h(z+1)):(d.continuous?(k(h(z+1),w,0),k(h(z-2),-w,0)):k(z+1,w,0),k(z,v[z]+w,A),k(h(z-1),v[h(z-1)]+w,A),z=h(z-1)),d.callback&&d.callback(i(),u[z])):d.continuous?(k(h(z-1),-w,A),k(z,0,A),k(h(z+1),w,A)):(k(z-1,-w,A),k(z,0,A),k(z+1,w,A))),q(a)?(y.removeEventListener("mousemove",G,!1),y.removeEventListener("mouseup",G,!1),y.removeEventListener("mouseleave",G,!1)):(y.removeEventListener("touchmove",G,!1),y.removeEventListener("touchend",G,!1))},transitionEnd:function(a){parseInt(a.target.getAttribute("data-index"),10)===z&&((D||d.autoRestart)&&p(),d.transitionEnd&&d.transitionEnd.call(a,i(),u[z]))}};return e(),D&&n(),t.addEventListener?(t.touch&&y.addEventListener("touchstart",G,!1),d.draggable&&y.addEventListener("mousedown",G,!1),t.transitions&&(y.addEventListener("webkitTransitionEnd",G,!1),y.addEventListener("msTransitionEnd",G,!1),y.addEventListener("oTransitionEnd",G,!1),y.addEventListener("otransitionend",G,!1),y.addEventListener("transitionend",G,!1)),a.addEventListener("resize",G,!1)):a.onresize=function(){e()},{setup:function(){e()},slide:function(a,b){o(),j(a,b)},prev:function(){o(),f()},next:function(){o(),g()},restart:function(){p()},stop:function(){o()},getPos:function(){return i()},getNumSlides:function(){return x},kill:function(){o(),y.style.width="",y.style.left="";for(var b=u.length;b--;){var c=u[b];c.style.width="",c.style.left="",t.transitions&&l(b,0,0)}t.addEventListener?(y.removeEventListener("touchstart",G,!1),y.removeEventListener("mousedown",G,!1),y.removeEventListener("webkitTransitionEnd",G,!1),y.removeEventListener("msTransitionEnd",G,!1),y.removeEventListener("oTransitionEnd",G,!1),y.removeEventListener("otransitionend",G,!1),y.removeEventListener("transitionend",G,!1),a.removeEventListener("resize",G,!1)):a.onresize=null}}}}var a=this,b=a.document;return(a.jQuery||a.Zepto)&&!function(a){a.fn.Swipe=function(b){return this.each(function(){a(this).data("Swipe",new Swipe(a(this)[0],b))})}}(a.jQuery||a.Zepto),Swipe});
/**
 * jQuery Unveil
 * https://luis-almeida.github.com/unveil
 * Licensed under the MIT license.
 * Copyright 2013 Luís Almeida
 */
!function(a){a.fn.unveil=function(b,c){function j(){var b=h.filter(function(){var b=a(this);if(!b.is(":hidden")){var c=d.scrollTop(),f=c+d.height(),g=b.offset().top,h=g+b.height();return h>=c-e&&f+e>=g}});i=b.trigger("unveil"),h=h.not(i)}var i,d=a(window),e=b||0,f=window.devicePixelRatio>1,g=f?"data-src-retina":"data-src",h=this;return this.one("unveil",function(){var a=this.getAttribute(g);a=a||this.getAttribute("data-src"),a&&(this.setAttribute("src",a),"function"==typeof c&&c.call(this))}),d.on("scroll.unveil resize.unveil lookup.unveil",j),j(),this}}(window.jQuery||window.Zepto);