

var app = angular.module('occi-xmpp', ['occi-services', 'occi-js.xmpp']);
var categories;
var saveLocation;


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
		$scope.data=result;
		categories=result;
		$scope.showCategories=true;

	});

	$scope.getResources=function(location, title)
	{
		$scope.categoryTitle=title;
		saveLocation=location;
		myService.getDetails().getCollections(location).then(function(result)
		{
			$scope.resources=result.resources;
			$scope.showResources=true;
		});
	}

	$scope.getResourceDetails=function(resource)
	{
		var typeResource, resourceDetails;
		var attribute;
		var attributeDetails;
		var attributeValue=[];
		myService.getDetails().getResourceLocations(resource).then(function(result)
		{	
			console.log(saveLocation);
			for(var i=0; i<categories.kinds.length;i++)
			{
				if(categories.kinds[i].location==saveLocation)
				{
					typeResource=categories.kinds[i].term;
					attribute=categories.kinds[i].attributes.occi;
					resourceDetails=result.resource[0].attributes.occi[typeResource];
					for(attr in attribute)
					{
						var nameAttr="occi."+attr;
						for(subAttr in attribute[attr])
						{
							if(subAttr in resourceDetails)
							{
								nameAttr=(nameAttr)+"."+subAttr;
								attribute[nameAttr]=attribute[attr][subAttr];
								attribute[nameAttr]["value"]=resourceDetails[subAttr];
								$scope.attributeDetails=attribute[nameAttr];
								delete attribute[attr][subAttr];
								nameAttr="occi."+attr;
							}else
							{
								delete attribute[attr][subAttr];
							}
						}
						// if(attr in resourceDetails)
						// {
						// 	console.log("second loop : "+attr);
						// 	attribute[attr]["value"]=resourceDetails[attr];
						// 	$scope.attributeDetails=attribute[attr];
						// }else
						// {
						// 	delete attribute[attr];
						// }
						// $scope.attributes=attribute;
						// console.log(attribute);
							
						// console.log("attribute : "+attr+" Value : "+attribute[attr]["title"]);
					}
					delete attribute[attr];
					$scope.attributes=attribute;
				}
			}
			
		});
	}

	$scope.deleteResource=function(resource)
	{
		myService.getDetails().deleteResourceController(resource);
	}

}]);




