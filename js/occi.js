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

	occi.loadCategories = function() {
	
		// Reset current categories
		occi.kinds = [];
		occi.mixins = [];
		occi.actions = [];
		
		var i, j = 0;
		var jqxhr = $.getJSON(this.baseurl + "/-/",
			function(data) {
				for (i=0, j=data.categories.length; i<j; i++) {
					switch (data.categories[i].class) {
						case "kind":
							occi.kinds.push(data.categories[i]);
							break;
						case "mixin":
							occi.mixins.push(data.categories[i]);
							break;
						case "action":
							occi.actions.push(data.categories[i]);
							break;
					}
				}
			});
		return jqxhr;
	};
	
	occi.loadResources = function (term, location) {
	
		var term = occi.category_name;
		var location = occi.category_location;
		
		// Fetch the resources
		var jqxhr_resources = $.getJSON(this.baseurl + location,
			function(data) {
			    var i, j;
			
				// Reset the resources
				occi.resources = [];
				
				//console.log(data.occi[term].location);
				for (i=0, j=data.occi[term].location.length; i<j; i++) {
					occi.resources.push({title: data.occi[term].location[i]});
				}
				
			});
			
			return jqxhr_resources;		
	}
	
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
