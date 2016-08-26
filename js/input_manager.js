

// A command activated by a keypress.
// @param keyCode - The keycode for this KeyCommand (http://keycode.info/)
// @param cmd - The cmd function to be called when the key is activated
// @param elements - The HTML elements for the key press to be activated on
// @param modifers - An array containing the possible key modifiers ('shift', 'ctrl', 'alt')
LSST.KeyCommand = function(keyCode, cmd, elements = [document], modifiers = []) {
	
	var bEnabled = true;
	
	var onKeyDown = function(event) {
		// Are we enabled?
		// If not, don't do any key press processing
		if (!bEnabled)
			return;	

		var keyPress = event.keyCode || event.which;
		if (keyCode == keyPress) {
			// Check for modifiers
		
			// Call command
			cmd(event);
		}
	}
	
	for (var i = 0; i < elements.length; i++) {
		this.addElement(elements[i]);
	}
	
	
	// Changes the key code associated with this KeyCommand.
	// @param newKeyCode - The new key code
	// @param mods - The modifiers for the key press ('shift', 'ctrl', 'alt')
	this.changeKeyCode = function(newKeyCode, mods = null) {
		keyCode = newKeyCode;
		
		if (mods != null)
			modifiers = mods;
	}
	
	// Enables or disables this key command
	// @param bEnable - Should this key command be enabled?
	this.enable = function(bEnable) {
		bEnabled = bEnable;
	}
	
	// Adds an HTML element for this key command to be active on
	// @param element - The HTML element to add
	this.addElement = function(element) {
		jQuery(element).keydown(onKeyDown);
	}
	
	// Removes an HTML element for this key command to be active on
	// @param element - The HTML element to remove
	this.removeElement = function(element) {
		jQuery(element).off('keydown', onKeyDown);
	}
}

LSST.InputManager = function() {
	
	var keyCmds = {};
	
	// Adds an LSST.KeyCommand to the input manager
	// @param name - The identifier for this key command
	// @param keyCmd - An LSST.KeyCommand object
	this.add = function(name, keyCmd) {
		keyCmds[name] = keyCmd;
	}
	
	// Returns the LSST.KeyCommand with 'name'.
	// @param name - The name of the key command
	// @return The LSST.KeyCommand object
	this.getKeyCommand = function(name) {
		return keyCmds[name];
	}
	
	// Changes the key code value for a key command.
	// @param name - The key command to change
	// @param keyCode - The new key code
	// @param modifiers - The key press modifiers ('shift',  'ctrl', 'alt')
	// @return true if the key command 'name' exists and was changed, false otherwise
	this.changeKey = function(name, keyCode, modifiers = null) {
		if (name in keyCmds) {
			keyCmds[name].changeKeyCode(keyCode, modifiers);
			return true;
		}
		else
			return false;
	}
	
	// Enables or disables the key commands
	// @param bEnable - true if the key commands should be working, false otherwise
	this.enable = function(bEnable) {
		for (var k in keyCmds) {
			if (keyCmds.hasOwnProperty(k)) {
				keyCmds[k].enable(bEnable);
			}
		}	
	}
}

LSST.inputManager = null;

jQuery(document).ready(function() {

	LSST.inputManager = new LSST.InputManager();
	
	var averagePixelKC = new LSST.KeyCommand(
		65, // a
		function(event) {
			var viewerID = jQuery(event.currentTarget).attr('id');
			var viewer = LSST.state.viewers.get(viewerID);
			var c = viewer.getCursorCoords();
			
			cmds.average_pixel( { box_id : 'ffbox', viewer_id : viewerID, region : [ 'rect', c.x - 100, c.y - 100, c.x + 100, c.y + 100 ] } );
		},
		[]
	);
	
	var hotPixelKC = new LSST.KeyCommand(
		72, // h
		function(event) {
			var viewerID = jQuery(event.currentTarget).attr('id');
			var viewer = LSST.state.viewers.get(viewerID);
			var c = viewer.getCursorCoords();
			
			var region = [ 'rect', c.x - 500, c.y - 500, c.x + 500, c.y + 500 ];
			cmds.hot_pixel( { viewer_id : viewerID, threshold : 1.0, region : region } );
		},
		[]
	);
		
	LSST.inputManager.add('Average Pixel', averagePixelKC);
	LSST.inputManager.add('Hot Pixel', hotPixelKC);

});


var inputAddViewer = function(viewer) {
	var viewerDOM = jQuery(viewer.container);
	var v = viewerDOM.children('.viewer-view');
	
	LSST.inputManager.getKeyCommand('Average Pixel').addElement(v);
	LSST.inputManager.getKeyCommand('Hot Pixel').addElement(v);
}


























