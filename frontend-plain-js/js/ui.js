LSST.extend('LSST.UI');
LSST.extend('LSST.UI.state');

LSST.UI.state.topElement = null;

// The base class of all UI elements
LSST.UI.UIElement = function(options) {
	// The HTML container for this element
	this.html = options.html;
	
	this._init(options);
}

LSST.UI.UIElement.prototype = {
	_init : function(options) {
		this.name = options.name || '';
		
		this.html.click(LSST.UI.UIElement.prototype.setFocus.bind(this, true));
		this._bFocusOnClick = true;
		
		// Draggable settings
		if (options.draggable) {
			var d = options.draggable;
			var all = {
				distance : 10,
				drag : LSST.UI.UIElement.prototype.setFocus.bind(this, true)
			}
			jQuery.extend(d, all);
			this.html.draggable(d);
		}
		
		if (options.resizable) {
			// Resizable settings
			this.html.resizable(options.resizable);
		}
		
		if (options.toolbar) {
			this.html.lsst_toolbar(options.toolbar.desc, options.toolbar.options);
		}
	},
	
	// Gets the name of this element
	// @return The name of this element
	getName : function() { return this.name; },
	
	// Sets or unsets the focus for this UI element
	// @param bFocus - Should the element be in focus?
	setFocus : function(bFocus) {
	  if (!this._bFocusOnClick)
	    return;
	
		if (bFocus) {
			if (LSST.UI.state.topElement)
				LSST.UI.state.topElement.setFocus(false);
				
			this.html.css('z-index', 1);
			LSST.UI.state.topElement = this;
		}
		else {
			this.html.css('z-index', 0);
		}
	},
	
	focusOnClick : function(bFocusOnClick) {
	  this._bFocusOnClick = bFocusOnClick;
	},
	
	// Called when this UI element should save itself, for instance when the user exits the page.
	save : function() {
	
	}
};

LSST.UI.UIElementList = function() {
	var elements = {};

	this.add = function(id, obj) {
		elements[id.toLowerCase()] = obj;
	}

	this.remove = function(id) {
		delete elements[id.toLowerCase()];
	}

	this.get = function(id) {
	  if (id != undefined)
		  return elements[id.toLowerCase()];
	  else {
	    for (var e in elements)
	      if (elements.hasOwnProperty(e))
	        return e;
	  }
	}

	this.exists = function(id) {
		return (id.toLowerCase() in elements);
	}
	
	this.size = function() {
	  return Object.keys(elements).length;
	}
	
	this.foreach = function(f) {
	    for (var e in elements) {
            if (elements.hasOwnProperty(e)) {
                f(elements[e]);
            }
        }
	}
}


var currTopElement = null;
var onChangeFocus = function() {
	if (currTopElement)
		currTopElement.css('z-index', 0);

	var dom = jQuery(this);
	dom.css('z-index', 3);

	currTopElement = dom;
}
