LSST.extend('LSST.UI');

LSST.UI.Terminal = function(options) {
  this.html = jQuery(
  "\
  <div id='cmd_container'> \
    <div id='cmd'></div> \
  </div> \
  ");
  
  jQuery("body").append(this.html);

  // Draggable settings
	options.draggable = {
		disabled : true
	};

  // Resizable settings
	options.resizable = {
		handles : 'n, w, nw'
	}
	
	// Toolbar settings
	var settingsData = {
		title : 'Terminal Settings',
		form : [
			jQuery('<span>').text('Anchor to bottom right'),
			jQuery('<input>').attr('id', "ts_" + options.name + "_anchor").attr('type', 'checkbox').css('margin-right', '5px').click(LSST.UI.Terminal.prototype._settingsAnchor.bind(this, 'bottom-right')),
			jQuery('<br>'),
			jQuery('<span>').attr('id', "ts_" + options.name + "_draggableText").text('Draggable').css('text-decoration', 'line-through').css('margin-right', '5px'),
			jQuery('<input>').attr('id', "ts_" + options.name + "_draggable").attr('type', 'checkbox').prop('disabled', true).click(LSST.UI.Terminal.prototype._settingsDrag.bind(this)),
			jQuery('<br>'),
			jQuery('<span>').text('Always on top'),
			jQuery('<input>').attr('id', "ts_" + options.name + "_onTop").attr('type', 'checkbox').click(LSST.UI.Terminal.prototype._settingsAlwaysOnTop.bind(this)),
			jQuery('<br>'),
			
			jQuery('<span>').text('Font Size: '),
			jQuery('<span>').attr('id', "ts_" + options.name + "_fontSize"),
			jQuery('<span>').text('% '),
			jQuery('<button>').attr('type', 'button').text('-').click(LSST.UI.Terminal.prototype._settingsChangeFontSize.bind(this, false)),
			jQuery('<button>').attr('type', 'button').text('+').click(LSST.UI.Terminal.prototype._settingsChangeFontSize.bind(this, true)),
		],
		onCreate : LSST.UI.Terminal.prototype._settingsOnCreate.bind(this)
	}
	
	var toolbarDesc = [
		new LSST_TB.ToolbarElement("settings", settingsData),
		new LSST_TB.ToolbarElement("mini",
			{
			  onClick : cmds.minimize_terminal,
			}),
	];
	var toolbarOptions = {
	  bShowOnHover : true,
		placement : 'top',
		float : 'right',
		marginSide : 10,
		settings : {
			bDraggable : true,
		},
	};
	options.toolbar = {
		desc : toolbarDesc,
		options : toolbarOptions
	};
	
	this._term = this.html.children("#cmd");
	this._term.lsst_term( options.terminalOptions );

	// Init from UIElement
	LSST.UI.UIElement.prototype._init.call(this, options);
	
	// Restore settings
	if (options.settings) {
	  if (options.settings.anchor != undefined)
	    this.anchor(options.settings.anchor);
	  else
	    this.anchor("bottom-right");
	  
	  if (options.settings.draggable != undefined)
	    this.draggable(options.settings.draggable);
	  else
	    this.draggable(false);
	  
	  if (options.settings.alwaysOnTop != undefined)
	    this.alwaysOnTop(options.settings.alwaysOnTop);
	  else
	    this.alwaysOnTop(true);
	    
	  if (options.settings.fontSize != undefined)
	    this.setFontSize(options.settings.fontSize);
	  else
	    this.setFontSize(150);
	}
	else {
    this.anchor("bottom-right");
    this.draggable(false);
    this.alwaysOnTop(true);
    this.setFontSize(150);
	}
	
	this.focusOnClick(false);
}

// Inherit from LSST.UI.UIElement
LSST.inherits(LSST.UI.Terminal, LSST.UI.UIElement);



LSST.UI.Terminal.prototype.lsst_term = function(request, params) {
  return this._term.lsst_term(request, params);
}


LSST.UI.Terminal.prototype._settingsOnCreate = function() {
  // Set the font size
	var fontSizeInput = jQuery("#ts_" + this.name + "_fontSize");
	var baseFontSize = parseFloat(jQuery('body').css('font-size'));
	var cmdFontSize = parseFloat(this._term.css('font-size'));
	var fontSize = cmdFontSize / baseFontSize * 100;
	fontSizeInput.text(fontSize);
	
	if (this._anchor != "none") {
	  jQuery("#ts_" + this.name + "_anchor").prop("checked", true);
	  jQuery("#ts_" + this.name + "_draggableText").css('text-decoration', 'line-through');
    jQuery("#ts_" + this.name + "_draggable").prop('disabled', true);
	}
	else {
	  jQuery("#ts_" + this.name + "_draggableText").css('text-decoration', 'none');
    jQuery("#ts_" + this.name + "_draggable").prop('disabled', false);
	}
	
	if (this._bDraggable)
	  jQuery("#ts_" + this.name + "_draggable").prop("checked", true);
	  
	if (this._bOnTop)
	  jQuery("#ts_" + this.name + "_onTop").prop("checked", true);
}

LSST.UI.Terminal.prototype._settingsAnchor = function(spot) {
  var draggableText = jQuery("#ts_" + this.name + "_draggableText");
  var draggableButton = jQuery("#ts_" + this.name + "_draggable");
  
  var bAnchor = jQuery("#ts_" + this.name + "_anchor").prop("checked");
  if (!bAnchor) {
    spot = "none";
		draggableText.css('text-decoration', 'none');
    draggableButton.prop('disabled', false);
  }
  else {
		draggableText.css('text-decoration', 'line-through');
    draggableButton.prop('disabled', true);
  }
    
  var bDraggable = draggableButton.prop("checked");
    
  this.anchor(spot, bDraggable);
}

LSST.UI.Terminal.prototype._settingsDrag = function() {
  var bDraggable = jQuery("#ts_" + this.name + "_draggable").prop("checked");
  this.draggable(bDraggable);
}

LSST.UI.Terminal.prototype._settingsAlwaysOnTop = function() {
  var bOnTop = jQuery("#ts_" + this.name + "_onTop").prop("checked");
  this.alwaysOnTop(bOnTop);
}

LSST.UI.Terminal.prototype._settingsChangeFontSize = function(bPlusButton) {
  var fontSize = parseInt(jQuery("#ts_" + this.name + "_fontSize").text());
  var delta = bPlusButton ? 10 : -10;
	fontSize += delta;
	this.setFontSize(fontSize);
}

LSST.UI.Terminal.prototype.anchor = function(spot, bDraggable = false) {
  this._anchor = spot;
  
  if (spot == "none") {
    if (bDraggable)
      this.draggable(true);
    return;
  }
  
  if (spot == "bottom-right") {
		this.html.css('position', 'fixed');
		this.html.css('top', '');
		this.html.css('left', '');
		this.html.css('bottom', '5px');
		this.html.css('right', '5px');
  }
  
	this.draggable(false);
	this.html.resizable( "option", "handles", "n, w, nw" );
}

LSST.UI.Terminal.prototype.draggable = function(bDraggable) {
  this._bDraggable = bDraggable;
  
  if (bDraggable) {
    this.html.draggable('enable');
    jQuery("#ts_" + this.name + "_draggable").prop("checked", true);
  }
  else {
    this.html.draggable('disable');
    jQuery("#ts_" + this.name + "_draggable").prop("checked", false);
  }
}

LSST.UI.Terminal.prototype.alwaysOnTop = function(bOnTop = true) {
  this._bOnTop = bOnTop;

  if (bOnTop) {
		this.html.css('z-index', 999);
		this.focusOnClick(false);
    jQuery("#ts_" + this.name + "_onTop").prop("checked", true);
	}
	else {
		this.html.css('z-index', 1);
		this.focusOnClick(true);
    jQuery("#ts_" + this.name + "_onTop").prop("checked", false);
	}
}

LSST.UI.Terminal.prototype.setFontSize = function(fontSize) {	
	// Clamp to 100% and 170%
	var min = 100;
	var max = 170;
	this._fontSize = Math.min(Math.max(parseInt(fontSize), min), max);
	
  jQuery("#ts_" + this.name + "_fontSize").text(this._fontSize);
	
	this.lsst_term("setFontSize", this._fontSize);
}

LSST.UI.Terminal.prototype.save = function() {
  var settings = {
    anchor : this._anchor,
    draggable : this._bDraggable,
    alwaysOnTop : this._bOnTop,
    fontSize : this._fontSize
  }
  
  LSST.saveSettings(this.name, settings);
}

LSST.UI.Terminal.prototype.minimize = function() {
  this.lsst_term("minimize");

	var toolbar = this.html.children('.LSST_TB-toolbar');
	var mini = jQuery(toolbar.children()[1]);
	mini.attr('src', 'js/toolbar/images/maximize_40x40.png');
	mini.data('onClick', LSST.UI.Terminal.prototype.maximize.bind(this));
}

LSST.UI.Terminal.prototype.maximize = function() {
  this.lsst_term("maximize");

	var toolbar = this.html.children('.LSST_TB-toolbar');
	var max = jQuery(toolbar.children()[1]);
	max.attr('src', 'js/toolbar/images/minimize_40x40.png');
	max.data('onClick', LSST.UI.Terminal.prototype.minimize.bind(this));
}


















