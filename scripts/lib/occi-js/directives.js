/*

Unused - Keep this for learning purposes

lizennApp.directive('getResources', function() {
	return {
		restrict: 'AE',
		link: function(scope, elem, attrs) {
			elem.bind('click', function() {
				scope.$apply(function() {
					scope.getResources(attrs.location, attrs.title);
				});
			});
		}
	};
});

lizennApp.directive('getResourceDetails', function() {
	return {
		restrict: 'AE',
		link: function(scope, elem, attrs) {
			elem.bind('click', function() {
				scope.$apply(function() {
					scope.getResourceDetails(attrs.location);
				});
			});
		}
	};
});

lizennApp.directive('deleteResource', function() {
	return {
		restrict: 'AE',
		link: function(scope, elem, attrs) {
			elem.bind('click', function() {
				scope.$apply(function() {
					scope.deleteResource(attrs.location);
				});
			});
		}
	};
});
*/
