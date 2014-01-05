/*jslint browser: true*/
/*global $, occi, Handlebars  */
var app = {
	tpl_kinds: undefined,
	tpl_mixins: undefined,
	tpl_actions: undefined,

	init: function() {
		Handlebars.registerHelper('list', function(ctx, options) {
			
			// Check that we have an object with data to work with
			if (ctx != null && typeof ctx === 'object') {
				var i = 0;
				var ret = '';
				for (i=0; i<ctx.length; i++) {
					ret = ret + '<li>' + options.fn(ctx[i]) + '</li>';
				}
				return ret;
			} else {
				return false;
			}

		});

		this.tpl_kinds = Handlebars.compile($('#tpl-kinds').html());
		this.tpl_mixins = Handlebars.compile($('#tpl-mixins').html());
		this.tpl_actions = Handlebars.compile($('#tpl-actions').html());
		this.tpl_resources = Handlebars.compile($('#tpl-resources').html());

	}

};

$(document).ready(function() {

	// Hide the form to add a resource
	$('#addResource').hide();

	// Catch the form submission
	$('#serverForm').on('submit', function() {

		// Set the server's url
		var url = $('#url').val();
		occi.server(url);
		
		// Load the categories
		var jqxhr = occi.loadCategories();
		
		// Wait until the request has been successfully processed to continue and print the HTML
		jqxhr.done(function() {
		
			app.init();
	
			// Show the list of categories
			$('#kinds').html(app.tpl_kinds(occi));
			$('#mixins').html(app.tpl_mixins(occi));
			$('#actions').html(app.tpl_actions(occi));
			
			// Add an onclick event for each link/category
			$('#kinds a').click(function() {
			
				// Start by resetting the list of resources
				$('#resources').html('');
			
				// Keep track of the category details
				occi.category_name = this.getAttribute('title');
				occi.category_location = this.getAttribute('href');
				
				// Try to load the resources for this category
				var jqxhr_resources = occi.loadResources();
				
				// Failed requested
				jqxhr_resources.fail(function(jqxhr_resources, textStatus, error) {
					var err = textStatus + ', ' + error;
					console.log( 'Request Failed: ' + err );
					alert('No resources for this category');
				});
				
				// Successful request
				jqxhr_resources.done(function () {
				
					// Load the resources
					$('#resources').html(app.tpl_resources(occi));
					
				});
				
				// Always show the form to add a resource
				jqxhr_resources.always(function () {
				
					// Show the form
					$('#addResource').show();
					
					// Catch the form submission
					$('#addResource').on('submit', function() {
					
						// Add the new resource
						occi.addResource($('#resource_description').val());
						
						// Try to reload the resources for this category
						var jqxhr_reload_resources = occi.loadResources();
						
						// Failed requested
						jqxhr_reload_resources.fail(function(jqxhr_reload_resources, textStatus, error) {
							var err = textStatus + ', ' + error;
							console.log( 'Request Failed: ' + err );
						});
				
						// Successful request
						jqxhr_reload_resources.done(function () {
							// Load the new resources
							$('#resources').html(app.tpl_resources(occi));
						});
						
						return false;
						
					});

				});

				// Prevent the clic to reresh the page
				return false;
				
			});
			
		});
		
		// Prevent the form from being submitted
		return false;
		
	});
	
});
