/**
 * jQuery Sortable Table Plugin
 * ============================
 *
 * Allows the user to sort an HTML `<table>` based on the text inside
 * the cell corresponding to the column header that is clicked.
 *
 * Cross-platform Compatibility
 * ----------------------------
 * 
 * * Firefox 3+
 * * Webkit (Google Chrome, Apple's Safari)
 * * Internet Explorer 7+
 * * Opera
 * 
 * Requirements
 * ------------
 * 
 * * jQuery 1.7.0+
 * * underscore.js
 * 
 * Feature Overview
 * ----------------
 * * Can handle up to 3 levels of nested data
 * * Supports sorting by numeric and string values
 * * Can exclude sets of rows from the set of sortable rows
 *
 * Usage
 * =====
 *
 * Create a regular `<table>` widget in HTML. Override any CSS styles needed for
 * your theme. If your table is showing grouped data, each group level requires
 * a `data-level` attribute on the `<tr>` row. The `data-level` attribute must be
 * an integer between 1 and 3 (inclusive). This will assume that your table,
 * by default, is showing your grouped data in the correct order.
 *
 * Requires that your header row uses `<th>` tags rather than `<td>` tags.
 *
 * Simply call .sortableTable() on your jQuery extended `<table>` element,
 * and you'll be able to sort on each column by clicking on the `<th>` header
 * cell for a given column.
 * 
 * ####Required options:
 * * image\_base				location of directory where images are located
 *
 * You can re-initialize the table's sort, say because the table was updated with
 * new rows, by calling .sortableTable() on your jQuery extended `<table>` element
 * with the method name 'reinit' as the first argument, rather than a set of options.
 *
 * @changelog	1.0.3 - Set click events to use 'sortableTable' namespace; added 'default_sort_order' option.
 * @changelog	1.0.2 - Added 'rows_to_anchor' option. Can be a selector string, set of elements, function, or jQuery object (see jQuery.not())
 * @changelog	1.0.1 - Added 'sort-type' recognition for 'numeric' and 'string' values
 * 
 * @example     See example.html	
 * @class		SortableTable
 * @name		SortableTable
 * @version		1.0.3
 * @author		Derek Rosenzweig <derek.rosenzweig@gmail.com, drosenzweig@riccagroup.com>
 */
(function($) {
	
	/**
     * Constructor.
     *
     * @access		public
     * @memberOf	SortableTable
     * @since		1.0
     * @updated		1.0.3
     *
     * @param		options_or_method	mixed				An object containing various options, or a string containing a method name.
     * 															Valid method names: 'reinit'
     *
     * @returns		this				jQuery				The jQuery element being extended gets returned for chaining purposes
     */
	$.fn.sortableTable = function(options_or_method) {
		//--------------------------------------------------------------------------
		//
		//  Variables and get/set functions
		//
		//--------------------------------------------------------------------------
		
		/**
		 * Default options for the widget. Overwrite by including individual
		 * options in the 'options' map object when extending the sortableTable.
		 *
		 * @access		public
		 * @type		Object
		 * @memberOf	SortableTable
		 * @since		1.0
		 * @updated		1.0.3
		 */
		var default_options = {
			image_base : null,						// Location of directory where images are located. Required. Default null.
			theme : 'default',						// The theme directory where images are stored. Optiona. Default 'default'.
			allow_col_resize : false,				// Flag indicating whether to allow columns to resize when adding the sort direction indicator. Optional. Default false.
			rows_to_anchor : null,					// Can be a selector string, set of elements, function, or jQuery object (see http://api.jquery.com/not/ for valid options). Optional. Default null.
			default_sort_order : 'ASC'				// The starting sort order when the user clicks on a header cell. Optional. Default 'ASC'.
		};
		
		/**
		 * The actual final set of extended options.
		 *
		 * @access		public
		 * @type		Object
		 * @memberOf	SortableTable
		 * @since		1.0
		 */
		var options = {};
		
		/**
		 * The <table> element which will be given sortable functionality.
		 *
		 * @access		public
		 * @type		jQuery - HTMLElement <table>
		 * @memberOf	SortableTable
		 * @since		1.0
		 * @default		this
		 */
		var sortable_table = this;
		
		/**
		 * The <tr> element containing the header <th> cells that get clicked and
		 * trigger the sort functionality.
		 *
		 * @access		public
		 * @type		jQuery - HTMLElement <tr>
		 * @memberOf	SortableTable
		 * @since		1.0
		 * @default		sortable_table.find('tr:first-child')
		 */
		var header_row = sortable_table.find('tr:first-child');
		
		/**
		 * A regular expression that removes letters and dashes (only if the dash
		 * is the only text).
		 *
		 * @access		public
		 * @type		RegExp
		 * @memberOf	SortableTable
		 * @since		1.0
		 * @default		new RegExp('([a-zA-Z,]|((\b)-(\b)))', 'g')
		 */
		var numeric_regex = new RegExp('([a-zA-Z,]|((\b)-(\b)))', 'g');
		
		/**
		 * The index of the column header cell that was clicked to sort the table.
		 *
		 * @access		public
		 * @type		integer
		 * @memberOf	SortableTable
		 * @since		1.0.1
		 * @default		null
		 */
		var col_index_clicked = null;
		
		/**
		 * The type of sort expected. Valid values:
		 *
		 * 	numeric
		 * 	string
		 *
		 * @access		public
		 * @type		string
		 * @memberOf	SortableTable
		 * @since		1.0.1
		 * @default		null
		 */
		var sort_type = null;
		
		/**
		 * A set of valid sort directions.
		 *
		 * @access		public
		 * @type		array
		 * @memberOf	SortableTable
		 * @since		1.0.3
		 * @default		new Array('ASC', 'DESC')
		 */
		var valid_sort_directions = new Array('ASC', 'DESC');
		
		//--------------------------------------------------------------------------
		//
		//  Methods
		//
		//--------------------------------------------------------------------------
		
		/**
		 * Initializes the sortable table. Adds the 'sort-direction-container' <div>
		 * elements to each sortable column header cell, then assigns parent rows
		 * to each level 2 and 3 row, and lastly, sets the 'sort_value' data property
		 * for each table cell (in case the contents of the cell change for some reason).
		 *
		 * If the required options are not present, throws an exception.
		 *
		 * @access		public
		 * @memberOf	SortableTable
		 * @since		1.0
		 * @updated		1.0.3
		 * @throws		SortableTable exception
		 */
		this.initSortableTable = function() {
			// First check for required options.
			if (options.image_base == null) {
				throw 'SortableTable widget: no image base specified.';
				return;
			}
			
			if ($.inArray(options.default_sort_order, valid_sort_directions) == -1) {
				throw 'SortableTable widget: invalid default_sort_order option specified.';
				return;
			}
			
			sortable_table.addClass('sortable-table');
			
			var row_height = header_row.find('th:first-child').height();
			
			// Add the sort direction container and image to each header cell
			header_row.find('th').each(function(index, table_header_cell) {
				var thc = $(table_header_cell);
				if (thc.find('div.sort-direction-container').length == 0) {
					var new_img = $("<img />").attr({src:options.image_base+"/"+options.theme+"/Transparent.gif", width:'7', height:'4'});
					var new_div = $("<div></div>").addClass('sort-direction-container').css({height:row_height+"px"});
					if (! options.allow_col_resize) { new_div.css({marginRight:"-7px"}); }
					else { new_div.addClass('allow-col-resize'); }
					new_div.append(new_img);
					thc.append(new_div);
				}
			});
			
			// assign parents to their children for level 2 and 3 rows...
			var level_3_rows = sortable_table.find('tr[data-level=3]');
			if (level_3_rows.length > 0) {
				level_3_rows.each(function(row_index, table_row) {
					var tr = $(table_row);
					var parent_row = tr.prevAll('tr[data-level=2]').eq(0);
					tr.data('parent_row', parent_row);
				});
			}
			var level_2_rows = sortable_table.find('tr[data-level=2]');
			if (level_2_rows.length > 0) {
				level_2_rows.each(function(row_index, table_row) {
					var tr = $(table_row);
					var parent_row = tr.prevAll('tr[data-level=1]').eq(0);
					tr.data('parent_row', parent_row);
				});
			}
			
			// Set the sort_value data for each cell based on the cell value
			var other_rows = sortable_table.find('tr').not(':first-child');
			if (options.rows_to_anchor != null) {
				var other_rows_copy = other_rows.not(options.rows_to_anchor);
				if (other_rows_copy.length == 0) {
					// Either the value of options.rows_to_anchor was not a valid param for $.not(),
					// or it excluded all the remaining sortable rows, so there's nothing to sort anymore.
					throw "SortableTable widget: 'rows_to_anchor' option excluded all possible rows to sort";
				}
				else {
					other_rows = other_rows_copy;
				}
			}
			other_rows.each(function(row_index, table_row) {
				var tr = $(table_row);
				tr.find('td').each(function(col_index, table_cell) {
					var tc = $(table_cell);
					var sort_value = tc.text();
					if (tc.attr('data-sort-property') != null &&
						tr.attr(tc.attr('data-sort-property')) != null) {
						sort_value = tr.attr(tc.attr('data-sort-property'));
					}
					tc.data('sort_value', sort_value);
				});
			});
			
			// Add the current options as data on the <table> element
			sortable_table.data('sortable-table-options', options);
			
			// Add the event handler(s).
			sortable_table.on('click.sortableTable', 'tr th', this.sortTableByColumn);
		}
		
		/**
		 * Resets the table back to its original status. Should be called before
		 * reinitializing the table's sort functionality.
		 *
		 * @access		public
		 * @memberOf	SortableTable
		 * @since		1.0.3
		 */
		this.destroy = function() {
			// Remove the event handler(s).
			sortable_table.off('click.sortableTable');
			
			// Remove the options
			sortable_table.removeData('sortable-table-options');
			
			var other_rows = sortable_table.find('tr').not(':first-child');
			other_rows.removeData('parent_row');
			other_rows.find('td').removeData('sort_value');
			
			header_row.find('th').removeAttr('data-sort-direction');
			header_row.find('th div.sort-direction-container').remove();
			
			sortable_table.removeClass('sortable-table');
		}
		
		/**
		 * When the user clicks on a header cell of a table, this sorts the entire table
		 * based on the data attributes' values assigned to each row.
		 *
		 * @access		public
		 * @memberOf	SortableTable
		 * @since		1.0
		 * @updated		1.0.3
		 *
		 * @param		event					Event		jQuery 'click.sortableTable' event triggered when the user clicks on a table header cell
		 */
		this.sortTableByColumn = function(event) {
			if (event.type == 'click') {
				var clicked_table_header = $(this);
				var cur_sort_direction = clicked_table_header.attr('data-sort-direction');
				var cur_sort_type = clicked_table_header.attr('data-sort-type');
				sortable_table.col_index_clicked = clicked_table_header.index();
				sortable_table.sort_type = (cur_sort_type != null ? cur_sort_type : null);
				
				// Clear the sort direction of any other columns
				clicked_table_header.siblings().removeAttr('data-sort-direction');
				clicked_table_header.siblings().find('img').css({backgroundImage:''});
				
				// Determine the new sort direction for the current column, including the new background image...
				var new_sort_direction = options.default_sort_order;
				var new_background_image_url = '';
				if (cur_sort_direction != null) {
					if (cur_sort_direction == 'ASC') {
						new_sort_direction = 'DESC';
					}
					else if (cur_sort_direction == 'DESC') {
						new_sort_direction = 'ASC';
					}
				}
				if (new_sort_direction == 'DESC') {
					new_background_image_url = 'url("'+options.image_base+'/'+options.theme+'/arrow-down.png")';
				}
				else {
					new_background_image_url = 'url("'+options.image_base+'/'+options.theme+'/arrow-up.png")';
				}
				// ...and set them.
				clicked_table_header
					.attr('data-sort-direction', new_sort_direction)
					.find('img')
					.css({backgroundImage:new_background_image_url});
				
				// Now actually sort each level's data (ALWAYS in ascending order here) based on the column clicked...
				var l1_rows = sortable_table.find('tr[data-level=1]');
				if (l1_rows.length == 0) {
					l1_rows = sortable_table.find('tr').not(':first-child');
				}
				var l2_rows = sortable_table.find('tr[data-level=2]');
				var l3_rows = sortable_table.find('tr[data-level=3]');
				if (options.rows_to_anchor != null) {
					var l1_rows_copy = l1_rows.not(options.rows_to_anchor);
					if (l1_rows.length == 0) {
						// Either the value of options.rows_to_anchor was not a valid param for $.not(),
						// or it excluded all the remaining sortable rows, so there's nothing to sort anymore.
						throw "SortableTable widget: 'rows_to_anchor' option excluded all possible rows to sort";
					}
					else {
						l1_rows = l1_rows_copy;
					}
					l2_rows = l2_rows.not(options.rows_to_anchor);
					l3_rows = l3_rows.not(options.rows_to_anchor);
				}
				var level_1_rows_to_sort = _.sortBy(l1_rows, sortable_table.sortFunction);
				var level_2_rows_to_sort = _.sortBy(l2_rows, sortable_table.sortFunction);
				var level_3_rows_to_sort = _.sortBy(l3_rows, sortable_table.sortFunction);
				
				// ...OK, by now the data in each row has been sorted based on the column clicked, so
				// now we have to actually move each row in the table to where it belongs so the
				// user sees the table sorted.
				if (new_sort_direction == 'ASC') {
					// Show in ascending order (add each set of level rows in backwards order)
					if (level_1_rows_to_sort.length > 0) {
						for (var i = level_1_rows_to_sort.length-1; i >= 0; i--) {
							var level_1_row = level_1_rows_to_sort[i];
							header_row.after(level_1_row);
						}
					}
					if (level_2_rows_to_sort.length > 0) {
						for (var j = level_2_rows_to_sort.length-1; j >= 0; j--) {
							var level_2_row = $(level_2_rows_to_sort[j]);
							var parent_row = $(level_2_row.data('parent_row'));
							parent_row.after(level_2_row)
						}
					}
					if (level_3_rows_to_sort.length > 0) {
						for (var k = level_3_rows_to_sort.length-1; k >= 0; k--) {
							var level_3_row = $(level_3_rows_to_sort[k]);
							var parent_row = $(level_3_row.data('parent_row'));
							parent_row.after(level_3_row);
						};
					}
				}
				else {
					// Show in descending order (add each set of level rows in regular order)
					if (level_1_rows_to_sort.length > 0) {
						$.each(level_1_rows_to_sort, function(row_index, l1_row) {
							var level_1_row = $(l1_row);
							header_row.after(level_1_row);
						});
					}
					if (level_2_rows_to_sort.length > 0) {
						$.each(level_2_rows_to_sort, function(row_index, l2_row) {
							var level_2_row = $(l2_row);
							var parent_row = $(level_2_row.data('parent_row'));
							parent_row.after(level_2_row)
						});
					}
					if (level_3_rows_to_sort.length > 0) {
						$.each(level_3_rows_to_sort, function(row_index, l3_row) {
							var level_3_row = $(l3_row);
							var parent_row = $(level_3_row.data('parent_row'));
							parent_row.after(level_3_row);
						});
					}
				}
			}
		}
		
		/**
		 * Determines what to return for the sort value based on which header
		 * cell was clicked, how many cells are in the current row, and the
		 * type of sort expected. If no sort type is expected, it does the
		 * best it can with each row's cell text.
		 *
		 * If the current row of the sort is missing a column due to merged cells
		 * (using colspan), it attempts to sort using previous cells' sort values.
		 *
		 * @access		public
		 * @memberOf	SortableTable
		 * @since		1.0.1
		 *
		 * @param		row				HTMLElement				A <tr> row to be sorted
		 *
		 * @return		tbr				mixed					An integer or a string containing the text/value to sort on
		 */
		this.sortFunction = function(row) {
			var tbr = null;
			var cur_index = sortable_table.col_index_clicked;
			var sort_type = sortable_table.sort_type;
			var cur_cell = $(row).find('td').eq(cur_index);
			while (cur_cell.length == 0 && cur_index >= 0) {
				cur_index--;
				cur_cell = $(row).find('td').eq(cur_index);
				var header_cell = $(row).closest('table').find('tr').eq(0).find('th').eq(cur_index);
				sort_type = (header_cell.attr('data-sort-type') != undefined ? header_cell.attr('data-sort-type') : null)
			}
			var value = original_value = cur_cell.data('sort_value');
			value = value.replace(numeric_regex, '');
			
			if (sort_type!= null) {
				if (sort_type == 'numeric') {
					tbr = isNaN(parseInt(value)) ? -(Number.MAX_VALUE) : parseInt(value);
				}
				else {
					tbr = original_value.toLowerCase();
				}
			}
			else {
				tbr = isNaN(parseInt(value)) ? original_value.toLowerCase() : parseInt(value);
			}
			
			return tbr;
		}
		
		/********* Event handlers *********/
		
		/********* Initialize the sortable table, or call a specific function *********/
		if (typeof options_or_method == "string") {
			/* Call a specific function */
			
			options = sortable_table.data('sortable-table-options');
			
			if (options_or_method == 'reinit') {
				// Reinitialize the sortable table
				this.destroy();
				this.initSortableTable();
			}
		}
		else {
			/* Initialize the sortable table */
			options = $.extend(default_options, options_or_method);
			this.initSortableTable();
		}
		
		/********* Return the newly extended element(s) for chaining *********/
		return this;
	}
})(jQuery);