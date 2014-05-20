var occi = angular.module('occi-js', []);

occi.controller('AppCtrl', function ($scope, $http, $attrs) {

	// Set default headers for GET requests
	$http.defaults.headers.get = { 'Accept': 'application/json' };

	// Default OCCI server url
	$scope.serverurl = "localhost:8080";

	/* Get categories */
	$scope.getCategories = function() {
	
		$http({
			method: "GET",
			url: "http://" + $scope.serverurl + "/-/"			
		}).success(function(data) {
			$scope.showCategories = true;
			$scope.data = data;
			//console.log(data);
		}).error(function(data, status) {
			console.log(status);
		});
		
	};
	
	/* Get resources */
	$scope.getResources = function(location, title) {
	
		// Show the resources element
		$scope.showResources = true;
		
		// Set the resources location
		$scope.resourcesLocation = location;
		
		// Update the resource title with the selected category
		$scope.category_title = title;
		
		// Fecth resources
		$http({
			url: location,
			method: "GET"
		}).success(function(data) {
			$scope.resources = data;
		}).error(function(data, status) {
			console.log(status);
		});
	};
	
	/* Get a resource's details */
	$scope.getResourceDetails = function(location) {
		$scope.resourceLocation = location; // FIXME Why was that?
		$http({
			url: location,
			method: "GET"
		}).success(function(data) {
			$scope.resourcedetails = data;
		}).error(function(data, status) {
			console.log(status);
		});
	};
	
	/*Delete a resource */
	$scope.deleteResource = function(location) {
		$http.delete(location)
			.success(function(data) {
				console.log(data);
			}).error(function(data, status) {
				console.log(status);
			});
	}

	/* Add a resource */
	$scope.addResource = function() {
		
		/*
		 Working CURL command to add a new resource:
		//curl -v -X POST -H "content-type: application/json" -d '{"resources":[{"kind":"http://schemas.ogf.org/occi/infrastructure#compute","attributes":{"occi":{"core":{"title":"Laptop"},"compute":{"architecture":"x86","cores":2,"hostname":"thinkpad","memory":128,"speed":8000}}}}]}' http://localhost.localdomain:8080/collections/compute/
		*/

		// Json object
		var newResource = {"resources":[{"kind":"http://schemas.ogf.org/occi/infrastructure#compute","attributes":{"occi":{"core":{"title":"Laptop"},"compute":{"architecture":"x86","cores":2,"hostname":"thinkpad","memory":128,"speed":8000}}}}]};

		// With Angular's $http
		$http({
			url:'http://localhost:8080/collections/compute/',
			method:"POST",
			headers: {
				'Content-Type': 'application/json'
			},
			data: JSON.stringify(newResource)
		}).success(function(data, status) {
			console.log("Yea! Resource added!");
			//console.log(status);
		}).error(function(data, status) {
			console.log("Error");
			console.log(status);
		});
		
		// With Angular's $http.post
		/*
		$http.post('http://localhost:8080/collections/compute/', JSON.stringify(newResource))
		.success(function(data, status) {
			console.log("Yea! Resource added!");
			//console.log(status);
		}).error(function(data, status) {
			console.log("Error");
			console.log(status);
		});
		*/
				
		// With Jquery's AJAX
		/*
		$.ajax({
			headers: {
				'Content-Type': 'application/json' 
			},
			'url': 'http://localhost:8080/collections/compute/',
			'data': JSON.stringify(newResource),
			'success': console.log("YES")
		});
		*/
		
	}
	
});


