

var app = angular.module('occi-xmpp', ['occi-services', 'occi-js.xmpp']);




app.controller('xmppCtrl',['$scope', 'xmpp', 'xmppSession', 'myService', function($scope, xmpp, xmppSession, myService)
{

	console.log("In xmpp controller");
	  // Initialize attributs
    $scope.showXmpp=true;
    $scope.xmpps=true;
    $scope.https=false;
    $scope.showHttp=false;
    $scope.jidModel="";
    $scope.passModel="";
    $scope.serverurl="admin@localhost/erocci";
	
	// Retrieve capabilities
	myService.start().then(function(result)
	{
		// console.log("get categories XMPP");
		$scope.data=result;
		$scope.showCategories=true;

	});

	$scope.getResources=function(location, title)
	{
		$scope.categoryTitle=title;
		myService.getDetails().getCollections(location).then(function(result)
		{
			$scope.resources=result.resources;
			$scope.showResources=true;
		});
	}

	$scope.getResourceDetails=function(resource)
	{
		// console.log(resource);
		myService.getDetails().getResourceLocations(resource).then(function(result)
		{	
			// console.log(result);
			$scope.resourceDetails=result;
		});
	}

	$scope.deleteResource=function(resource)
	{
		myService.getDetails().deleteResourceController(resource);
	}

}]);




