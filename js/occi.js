/*global $, _ */
var occi = {};

(function(occi, undefined) {
	occi.baseurl = '';
	occi.kinds = [];
	occi.mixins = [];
	occi.actions = [];
	occi.category_name = '';
	occi.category_location = '';

	occi.server = function(url) {
		this.baseurl = "http://" + url;
	};

	/*
		Get categories: Kinds, Mixins and Actions
	*/
	occi.loadCategories = function() {
	
		// Reset current categories
		occi.kinds = [];
		occi.mixins = [];
		occi.actions = [];
		
		var i, j = 0;
		var jqxhr = $.getJSON(this.baseurl + "/-/",
			function(data) {
				//console.log(data);
				
				// Build up the array of kinds
				for (i=0, j=data['kinds'].length; i<j; i++) {
					occi.kinds.push(data['kinds'][i]);
				}

				// Build up the array of mixins
				for (i=0, j=data['mixins'].length; i<j; i++) {
					occi.mixins.push(data['mixins'][i]);
				}

				// Build up the array of actions
				for (i=0, j=data['actions'].length; i<j; i++) {
					occi.actions.push(data['actions'][i]);
				}
				//console.log(occi.kinds);
				//console.log(occi.mixins);
				//console.log(occi.actions);
			});
		return jqxhr;
	};
	
	/*
		Get resources
	*/
	occi.getResources = function (term, location) {
	
		var term = occi.category_name;
		var location = occi.category_location;
		
		// FIXME Temporarily remove localdomain from the url
		location = location.replace('.localdomain', '');
		console.log("Current URL is: " + location);
		
		// Fetch the resources
		var jqxhr_resources = $.getJSON(location,
			function(data) {
			    var i, j;
				
				// Reset the resources
				occi.resources = [];

				// Check if we have any resources
				if (data.length < 1) {
					occi.resources.push({link: 'No resource for this category!'});
				} else {
					for(i=0, j=data.length; i<j; i++) {
						occi.resources.push({link: data[i]});
					}
				}
			});
			
			return jqxhr_resources;		
	}
	
	/*
		Get categories
	*/
	occi.addResource = function (resource_description) {
	
		// Post the new resource
		var jqxhr_add_resource = $.post(this.baseurl + "/" + occi.category_name + "/", "description=" + resource_description)
			.done(function () {
				alert("Resource added");
			})
			.fail(function() {
				alert("Impossible to add the resource");
			});
	
	}
	
})(occi);
;
