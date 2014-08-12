

var app = angular.module('occi-xmpp', ['occi-services', 'occi-js.xmpp']);
var categories;
var saveLocation;

// app.config(function($stateProvider, $urlRouterProvider, $locationProvider){
 
//    $stateProvider.state("configuration", {url:"/configuration", templateUrl:"conf.html" })
//                .state("configuration.tab1", { url: "/tab1", templateUrl: "tab1.html" })
//                .state("configuration.tab2", { url: "/tab2", templateUrl: "tab2.html" })
//                .state("configuration.tab3", { url: "/tab3", templateUrl: "tab3.html" });
               
//   $urlRouterProvider.otherwise("/");
//   $locationProvider.html5Mode(true);
// });


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
		var typeResource, resourceDetails, attribute, linkDetails;
		
		myService.getDetails().getResourceLocations(resource).then(function(result)
		{	
			if(result.resource!=undefined)
			{
				getKindsDetails(result);
			}else
			{
				$scope.attributes=null;
				getLinksDetails(result.link[0]);
			}
			
		});
			
	}

	function getKindsDetails(result)
	{
			var attributesDetail={};
			console.log("Location of resource : "+saveLocation);
			for(var i=0; i<categories.kinds.length;i++)
			{
				if(categories.kinds[i].location==saveLocation)
				{
					typeResource=categories.kinds[i].term;
					attribute=categories.kinds[i].attributes.occi;
					if(result.resource!=undefined)
					{
						resourceDetails=result.resource[0].attributes.occi[typeResource];
						if(result.resource[0].link!=undefined)
						{
							linkDetails=result.resource[0];
							console.log("Json link Details : "+JSON.stringify(linkDetails.link));
							getLinksDetails(linkDetails.link);
						}
					}
					console.log("Json attribute before loop : "+JSON.stringify(attribute));
					for(attr in attribute)
					{
						var nameAttr="occi."+attr;
						for(subAttr in attribute[attr])
						{
							if(subAttr in resourceDetails)
							{
								nameAttr=(nameAttr)+"."+subAttr;
								attributesDetail[nameAttr]=attribute[attr][subAttr];
								attributesDetail[nameAttr]["value"]=resourceDetails[subAttr];
								$scope.attributeDetails=attributesDetail[nameAttr];
								nameAttr="occi."+attr;
							}
						}
					}
					$scope.attributes=attributesDetail;
				}
			}
	
	}


	function getLinksDetails(result)
	{
		var linkDetails={};
		var kindAssociateToLink=result.attributes.occi;
		var myKinds, myMixins;
		var termOfKind=((result.kind).split("#"))[1];
		var termOfMixin=((result.mixins[0]).split("#"))[1];
		// Retrive attributes from kinds and Mixins
		// For Kinds
		for(var i=0;i<categories.kinds.length;i++)
		{
			if(categories.kinds[i].term==termOfKind)
			{
				console.log("term of kinds : "+categories.kinds[i].term);
				myKinds=categories.kinds[i].attributes.occi;
				break;
			}
		}
		// For Mixins
		
		for(var i=0;i<categories.mixins.length;i++)
		{
			if(categories.mixins[i].term==termOfMixin)
			{
				console.log("term of Mixin : "+categories.mixins[i].term);
				myMixins=categories.mixins[i].attributes.occi;
				break;
			}
		}

		//loop for checking if attributes existe in myMixins and myKinds in order to get type of attributes

		for(attr in myMixins)
		{
			var attributeName="occi."+attr;
			console.log("attributeName : "+attributeName);
			for(subAttr in myMixins[attr])
			{
				console.log("SubAttr : "+subAttr);
				if(subAttr in kindAssociateToLink[attr])
				{
					attributeName=attributeName+"."+subAttr;
					console.log("attributeName after If condition : "+attributeName);
					linkDetails[attributeName]=myMixins[attr][subAttr];
					linkDetails[attributeName]["value"]=kindAssociateToLink[attr][subAttr];
					attributeName="occi."+attr;
				}
			}
		}


		for(attr in myKinds)
		{
			var nameOfAttribute="occi."+attr;
			console.log("nameOfAttribute : "+nameOfAttribute);
			for(subAttr in myKinds[attr])
			{
				console.log("SubAttr : "+subAttr);
				if(subAttr in kindAssociateToLink[attr])
				{
					nameOfAttribute=nameOfAttribute+"."+subAttr;
					console.log("nameOfAttribute after If condition : "+nameOfAttribute);
					linkDetails[nameOfAttribute]=myKinds[attr][subAttr];
					linkDetails[nameOfAttribute]["value"]=kindAssociateToLink[attr][subAttr];
					nameOfAttribute="occi."+attr;
				}
			}
		}



		console.log("kindAssociateToLink : "+JSON.stringify(kindAssociateToLink));
		console.log("KindDetails: "+JSON.stringify(myKinds));
		console.log("MixinDetails: "+JSON.stringify(myMixins));
		console.log("linkDetails: "+JSON.stringify(linkDetails));

		for(nameAttribute in linkDetails)
			$scope.linkDetails=linkDetails[nameAttribute];
		$scope.Linkattributes=linkDetails;
	}

	$scope.deleteResource=function(resource)
	{
		myService.getDetails().deleteResourceController(resource);
	}

}]);




