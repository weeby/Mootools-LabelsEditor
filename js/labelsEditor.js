/**
 * Labels editor class
 * @author Krzysztof Wilczek
 * @since 05.12.2011
 * 
 * Options:
 * 		Boolean	resizable	- Make box resizable
 */
var LabelsEditor = new Class({
	
	_element: null, // Reference to DOM element
	_input: null, // Textarea DOM field
	_menu: null, // DOM menu element with cancel and accept buttons
	_wrapper: null, // DOM wrapper element
	
	Implements: [Options, Events],
	
	options: {
		id: null,
		label: null,
		new_lines: false,
		max_chars: null,
		
		css: {
			input_width: null,
			input_height: null,
			wrapper: 'labels_editor',
			input: 'labels_editor_input',
			menu: 'labels_editor_menu',
			button_accept: 'labels_editor_accept',
			button_cancel: 'labels_editor_cancel'
		}
	},
		
	/**
	 * Object initilization, create new editor and bind i to selected text 
	 */
	initialize: function(element, options)
	{
		if (!element)
		{
			return false;
		}
		this._element = element;
		
		this.setOptions(options);
		
		this.options.label = this._element.get('html');
		this.render(); 
		this.fireEvent('create', this);
	},
		
	/**
	 * Click on the label element to start editor work
	 * @param Object event
	 */
	elementClick: function(event)
	{
		event.stop();
		this.show();
		this._input.focus();
	},
	
	/**
	 * Cancel label edition
	 * @param Object event
	 */
	cancelClick: function(event)
	{
		this.hide();
	},
	
	/**
	 * Acceptation of modyfied text 
	 * @param Object event
	 */
	acceptClick: function(event)
	{
		this.options.label = this._input.value;
		this._element.set('html', this.options.label);
		this.hide();
		this.fireEvent('onAccept', this);
	},
	
	/**
	 * Controls textarea value
	 * @param Object event 
	 */
	inputKeyUp: function(event)
	{
		if (!this.options.new_lines )
		{
			event.target.value = event.target.value.replace(new RegExp( "\\n", "g" ), '');
		}
	},
	
	inputKetDown: function(event)
	{
		if (!this.options.new_lines && event.code == 13)
		{
			event.stop();
		}
	},
	
	/**
	 * Render labels editor view
	 */
	render: function() 
	{
		// Create editor wrapper
		this._wrapper = new Element('div', {'class': this.options.css.wrapper});
		this._wrapper.inject(this._element, 'before');
		this._wrapper.grab(this._element);
		
		this._input = new Element('textarea', {'class': this.options.css.input});
		this._wrapper.grab(this._input);
		
		// Max chars limitation
		if (this.options.max_chars)
		{
			this._input.set('maxlength', this.options.max_chars);
		}
		// Add input width style
		if (this.options.css.input_width)
		{	
			this._input.setStyle('width', this.options.css.input_width);
		}
		else
		{
			this._input.setStyle('width', this._element.getStyle('width'));
		}
		// Add input height style
		if (this.options.css.input_height || this.options.new_lines)
		{
			this._input.setStyle('height', this.options.css.input_height);
		}
		else
		{
			this._input.setStyle('height', this._element.getStyle('height'));
		}
		
		// Render editor menu
		this._menu = new Element('div', {'class': this.options.css.menu});
		this._wrapper.grab(this._menu);
		var button_accept = new Element('div', {'class': this.options.css.button_accept});
		button_accept.addEvent('click', this.acceptClick.bind(this));
		this._menu.grab(button_accept);
		var button_cancel = new Element('div', {'class': this.options.css.button_cancel});
		button_cancel.addEvent('click', this.cancelClick.bind(this));
		this._menu.grab(button_cancel);
		
		// Bind events to element and input field
		this._element.addEvent('click', this.elementClick.bind(this));
		this._input.addEvent('keyup', this.inputKeyUp.bind(this));
		this._input.addEvent('keydown', this.inputKetDown.bind(this));
		
	},
	
	/**
	 * Show editor controls
	 */
	show: function() 
	{
		this._input.value = null;
		this._input.value = this.options.label;
		
		var input_styles = this._element.getStyles(['color', 'font-size', 'font-weight', 'font-family', 'margin', 'float', 'position', 'left', 'top', 'right', 'bottom', 'padding']);
		this._input.setStyles(input_styles);

		this._input.setStyle('display', 'block');
		this._element.setStyle('display', 'none');
		this._menu.setStyle('display', 'block');
		
	},
	
	/**
	 * Hide editor controls
	 */
	hide: function()
	{
		this._input.setStyle('display', 'none');
		this._element.setStyle('display', 'block');
		this._menu.setStyle('display', 'none');
		
	}
	
});
	

/**
 * Standard Mootools Element extension 
 * add new method called: edit (create new LabelsEditor)
 * @param Object options 
 * @return LabelsEditor
 */
Element.implement('edit', function(){
	
	var options = arguments[0];	
	
	var labels_editor = this.retrieve('LabelsEditor');
	if (!labels_editor)
	{
		labels_editor = new LabelsEditor(this, options);
		this.store('LabelsEditor', labels_editor);
	}
	return labels_editor;

});
