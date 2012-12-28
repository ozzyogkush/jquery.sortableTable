jQuery Sortable Table Plugin
============================
Allows the user to sort the rows of an HTML `<table>` based on the text inside
the cell corresponding to the column header that is clicked.

Cross-platform Compatibility
----------------------------
* Firefox 3+
* Webkit (Google Chrome, Apple's Safari)
* Internet Explorer 7+
* Opera

Requirements
------------
* jQuery 1.7.0+
* underscore.js

Feature Overview
----------------
* Can handle up to 3 levels of nested data
* Supports sorting by numeric and string values
* Can exclude sets of rows from the set of sortable rows

Usage
=====

Create a regular `<table>` widget in HTML. Override any CSS styles needed for
your theme. If your table is showing grouped data, each group level requires
a `data-level` attribute on the `<tr>` row. The `data-level` attribute must be
an integer between 1 and 3 (inclusive). This will assume that your table,
by default, is showing your grouped data in the correct order.

Requires that your header row uses `<th>` tags rather than `<td>` tags.

Simply call .sortableTable() on your jQuery extended `<table>` element,
and you'll be able to sort on each column by clicking on the `<th>` header
cell for a given column.

####Required options:
* image\_base				location of directory where images are located

You can re-initialize the table's sort, say because the table was updated with
new rows, by calling .sortableTable() on your jQuery extended `<table>` element
with the method name 'reinit' as the first argument, rather than a set of options.
Example
-------
	<table id="grouping_example_table">
		<tr>
			<th>State Name</th>
			<th data-sort-type="numeric">Number of Respondents</th>
		</tr>
		<tr data-level="1">
			<td colspan="2"><b>Division:</b> New England</td>
		</tr>
		<tr data-level="2">
			<td>Connecticut</td>
			<td>4</td>
		</tr>
		<tr data-level="3">
			<td>06010</td>
			<td>1</td>
		</tr>
		<tr data-level="3">
			<td>06790</td>
			<td>2</td>
		</tr>
		<tr data-level="3">
			<td>06512</td>
			<td>1</td>
		</tr>
		<tr data-level="2">
			<td>Massachusetts</td>
			<td>4</td>
		</tr>
		<tr data-level="3">
			<td>02130</td>
			<td>1</td>
		</tr>
		<tr data-level="3">
			<td>01002</td>
			<td>1</td>
		</tr>
		<tr data-level="3">
			<td>02721</td>
			<td>1</td>
		</tr>
		<tr data-level="3">
			<td>01830</td>
			<td>1</td>
		</tr>
		<tr data-level="2">
			<td>Maine</td>
			<td>3</td>
		</tr>
		<tr data-level="3">
			<td>04240</td>
			<td>1</td>
		</tr>
		<tr data-level="3">
			<td>04401</td>
			<td>2</td>
		</tr>
		<tr data-level="2">
			<td>New Hampshire</td>
			<td>0</td>
		</tr>
		<tr data-level="2">
			<td>Rhode Island</td>
			<td>1</td>
		</tr>
		<tr data-level="3">
			<td>02910</td>
			<td>1</td>
		</tr>
		<tr data-level="2">
			<td>Vermont</td>
			<td>0</td>
		</tr>
		<tr data-level="1">
			<td colspan="2"><b>Division:</b> Middle Atlantic</td>
		</tr>
		<tr data-level="2">
			<td>New Jersey</td>
			<td>150</td>
		</tr>
		<tr data-level="3">
			<td>08062</td>
			<td>50</td>
		</tr>
		<tr data-level="3">
			<td>07481</td>
			<td>25</td>
		</tr>
		<tr data-level="3">
			<td>08534</td>
			<td>30</td>
		</tr>
		<tr data-level="3">
			<td>07013</td>
			<td>45</td>
		</tr>
		<tr data-level="2">
			<td>New York</td>
			<td>165</td>
		</tr>
		<tr data-level="3">
			<td>10701</td>
			<td>20</td>
		</tr>
		<tr data-level="3">
			<td>11530</td>
			<td>20</td>
		</tr>
		<tr data-level="3">
			<td>10005</td>
			<td>15</td>
		</tr>
		<tr data-level="3">
			<td>10606</td>
			<td>30</td>
		</tr>
		<tr data-level="3">
			<td>10021</td>
			<td>75</td>
		</tr>
		<tr data-level="3">
			<td>14420</td>
			<td>5</td>
		</tr>
		<tr data-level="2">
			<td>Pennsylvania</td>
			<td>420</td>
		</tr>
		<tr data-level="3">
			<td>15012</td>
			<td>105</td>
		</tr>
		<tr data-level="3">
			<td>16504</td>
			<td>100</td>
		</tr>
		<tr data-level="3">
			<td>17109</td>
			<td>120</td>
		</tr>
		<tr data-level="3">
			<td>19010</td>
			<td>95</td>
		</tr>
		<tr data-level="1" id="west_south_central">
			<td colspan="2"><b>Division:</b> West South Central</td>
		</tr>
		<tr data-level="2">
			<td>Arkansas</td>
			<td>0</td>
		</tr>
		<tr data-level="2">
			<td>Louisiana</td>
			<td>3</td>
		</tr>
		<tr data-level="3">
			<td>70123</td>
			<td>1</td>
		</tr>
		<tr data-level="3">
			<td>70131</td>
			<td>1</td>
		</tr>
		<tr data-level="3">
			<td>70817</td>
			<td>1</td>
		</tr>
		<tr data-level="2">
			<td>Oklahoma</td>
			<td>6</td>
		</tr>
		<tr data-level="3">
			<td>74820</td>
			<td>1</td>
		</tr>
		<tr data-level="3">
			<td>73505</td>
			<td>5</td>
		</tr>
		<tr data-level="2">
			<td>Texas</td>
			<td>570</td>
		</tr>
		<tr data-level="3">
			<td>75063</td>
			<td>100</td>
		</tr>
		<tr data-level="3">
			<td>76180</td>
			<td>50</td>
		</tr>
		<tr data-level="3">
			<td>75057</td>
			<td>420</td>
		</tr>
	</table>

	<script type='text/javascript'>
		$(document).ready(function() {
			$('table#grouping_example_table').sortableTable({image_base:'img/default',
															 rows_to_anchor:'#west_south_central'});
		});
	</script>