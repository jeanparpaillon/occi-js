occi.directive('getResources', function() {
	return {
		restrict: 'AE',
		link: function(scope, elem, attrs) {
			elem.bind('click', function() {
				scope.$apply(function() {
					scope.getResources(attrs.location, attrs.title);
				});
			});
			elem.bind('mouseover', function() {
				elem.css('cursor', 'pointer');
			});
		}
	};
});

occi.directive('getResourceDetails', function() {
	return {
		restrict: 'AE',
		link: function(scope, elem, attrs) {
			elem.bind('click', function() {
				scope.$apply(function() {
					scope.getResourceDetails(attrs.location);
				});
			});
			elem.bind('mouseover', function() {
				elem.css('cursor', 'pointer');
			});
		}
	};
});

occi.directive('deleteResource', function() {
	return {
		restrict: 'AE',
		link: function(scope, elem, attrs) {
			elem.bind('click', function() {
				scope.$apply(function() {
					scope.deleteResource(attrs.location);
				});
			});
			elem.bind('mouseover', function() {
				elem.css('cursor', 'pointer');
			});
		}
	};
});
