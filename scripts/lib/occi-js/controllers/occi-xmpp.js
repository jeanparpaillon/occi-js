

var app = angular.module('occi-xmpp', ['occi-services', 'occi-js.xmpp']);

// Global variable
var categories;
var saveLocation;
var saveTitle;
var saveResource;
var saveCollectionAttributes;
var typeOfEntity;


app.controller('xmppCtrl',['$scope', 'xmpp', 'xmppSession', 'myService', function($scope, xmpp, xmppSession, myService)
{
	console.log("in XMPP controller");
	$scope.connexionStatus=true;
	 // Initialize attributs
    $scope.showXmpp=true;
    // $scope.xmpps=true;
    $scope.showHttp=false;
    $scope.jidModel="";
    $scope.passModel="";
    $scope.serverurl="admin@localhost/erocci";
    $scope.listOfAttributes={};


	// Retrieve capabilities
	myService.start().then(function(result)
	{
		$scope.data=result;
		categories=angular.copy(result);
		$scope.showCategories=true;

	});

	
	$scope.getResources=function(location, title)
	{
		saveTitle=title;
		$scope.categoryTitle=title;
		saveLocation=location;
		myService.getDetails().getCollections(location).then(function(result)
		{
			// $scope.listOfResources=result;
			saveCollectionAttributes=result.collectionAttributes;
			$scope.resources=result.resources;
			$scope.showResources=true;
		});
	}

	$scope.getResourceDetails=function(resource)
	{
		getDetails(resource);
	}


	getDetails=function(resource)
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
			$scope.Linkattributes=null;
			$scope.sourceOfLink=null;
			$scope.targetOfLink=null;
			// console.log("Location of resource : "+saveLocation);
			for(var i=0; i<categories.kinds.length;i++)
			{
				if(categories.kinds[i].location==saveLocation)
				{
					typeResource=categories.kinds[i].term;
					attribute=categories.kinds[i].attributes.occi;
					if(result.resource!=undefined)
					{
						resourceDetails=result.resource[0].attributes.occi[typeResource];
						$scope.titleOfResource=result.resource[0].title;
						if(result.resource[0].link!=undefined)
						{
							linkDetails=result.resource[0];
							// console.log("Json link Details : "+JSON.stringify(linkDetails.link));
							getLinksDetails(linkDetails.link);
						}
					}
					
					for(attr in attribute)
					{
						var nameAttr="occi."+attr;
						for(subAttr in attribute[attr])
						{
							if(subAttr in resourceDetails)
							{
								nameAttr=(nameAttr)+"."+subAttr;
								attributesDetail[nameAttr]=angular.copy(attribute[attr][subAttr]);
								attributesDetail[nameAttr]["value"]=resourceDetails[subAttr];
								$scope.attributeDetails=attributesDetail[nameAttr];
								nameAttr="occi."+attr;
							}
						}
					}
					// console.log("attributeDetails : "+JSON.stringify(attributesDetail));
					$scope.attributes=attributesDetail;
				}
			}
	}


	function getLinksDetails(result)
	{
		var linkDetails={};
		var kindAssociateToLink;
		var linkResource;
		

		if(result.attributes!=undefined)
		{
				kindAssociateToLink=result.attributes.occi;
				var myKinds, myMixins;
				var termOfKind=((result.kind).split("#"))[1];
				var termOfMixin=((result.mixins[0]).split("#"))[1];
				// Retrive attributes from kinds and Mixins
				// For Kinds
				for(var i=0;i<categories.kinds.length;i++)
				{
					if(categories.kinds[i].term==termOfKind)
					{
						// console.log("term of kinds : "+categories.kinds[i].term);
						myKinds=categories.kinds[i].attributes.occi;

						break;
					}
				}
				// For Mixins
				
				for(var i=0;i<categories.mixins.length;i++)
				{
					if(categories.mixins[i].term==termOfMixin)
					{
						// console.log("term of Mixin : "+categories.mixins[i].term);
						myMixins=categories.mixins[i].attributes.occi;
						break;
					}
				}

				//loop for checking if attributes existe in myMixins and myKinds in order to get type of attributes

				for(attr in myMixins)
				{
					var attributeName="occi."+attr;
					// console.log("attributeName : "+attributeName);
					for(subAttr in myMixins[attr])
					{
						// console.log("SubAttr : "+subAttr);
						if(subAttr in kindAssociateToLink[attr])
						{
							attributeName=attributeName+"."+subAttr;
							// console.log("attributeName after If condition : "+attributeName);
							linkDetails[attributeName]=angular.copy(myMixins[attr][subAttr]);
							var value=(kindAssociateToLink[attr][subAttr]);
							linkDetails[attributeName]["value"]=value;
							attributeName="occi."+attr;
						}
					}
				}

				if(result.source!=undefined)
				{
					$scope.sourceOfLink=result.source;
				}else
					$scope.sourceOfLink='';
				if(result.target!=undefined)	
					$scope.targetOfLink=result.target;
				
				

				for(attr in myKinds)
				{
					var nameOfAttribute="occi."+attr;
					// console.log("nameOfAttribute : "+nameOfAttribute);
					for(subAttr in myKinds[attr])
					{
						// console.log("SubAttr : "+subAttr);
						if(subAttr in kindAssociateToLink[attr])
						{
							nameOfAttribute=nameOfAttribute+"."+subAttr;
							// console.log("nameOfAttribute after If condition : "+nameOfAttribute);
							linkDetails[nameOfAttribute]=angular.copy(myKinds[attr][subAttr]);
							linkDetails[nameOfAttribute]["value"]=(kindAssociateToLink[attr][subAttr]);
							nameOfAttribute="occi."+attr;
						}
					}
				}

				for(nameAttribute in linkDetails)
					$scope.linkDetails=linkDetails[nameAttribute];
				$scope.Linkattributes=linkDetails;
		}
		else
		{
			$scope.Linkattributes=result;
		}

		// console.log("attributes : "+JSON.stringify(result));
	}

	$scope.deleteResource=function(resource)
	{
		myService.deleteResourceService(resource);
	}

	$scope.createForm=function(boolean)
	{
		// If we click on button update we will hide the button Add else we hide the button Update
		saveResource=this.resource;
		$scope.btnUpdate=(boolean==true)? true:false;
		$scope.btnAdd=(boolean==false)? true:false;

		var attributes={};
		for(var i=0;i<categories.kinds.length;i++)
		{
			var kind=categories.kinds[i];
			// We take the term of the element parent
			
			var nameAttribute="occi.";
			if(kind.title==saveTitle)
			{
				typeOfEntity=(kind.parent.split("#"))[1];
				// console.log("In kind :: "+JSON.stringify(kind));
				for(attR in kind.attributes.occi)
				{
					nameAttribute+=attR;
					for(subAttr in kind.attributes.occi[attR])
					{
						nameAttribute+="."+subAttr;
						attributes[nameAttribute]=kind.attributes.occi[attR][subAttr]["type"];
						// console.log("nameAttribute : "+JSON.stringify(kind.attributes.occi[attR][subAttr]));
						nameAttribute="occi."+attR;
					}
				}
				if(typeOfEntity=="link")
				{
					var sourceAttribute="occi."+kind.term+".source";
					var targetAttribute="occi."+kind.term+".target";
					attributes[sourceAttribute]="string";
					attributes[targetAttribute]="string";
				}
				break;
			}else
			{
				for(j=0;j<categories.mixins.length;j++)
					{
						var mixin=categories.mixins[j];
						var nameMixin="occi.";
						// console.log("title : "+saveTitle);
						if(mixin.title==saveTitle)
						{
							for(attr in mixin.attributes.occi)
							{
								nameMixin+=attr;
								for(subAttribute in mixin.attributes.occi[attr])
								{
									nameMixin+="."+subAttribute;
									attributes[nameMixin]=mixin.attributes.occi[attr][subAttribute]["type"];
									nameMixin="occi."+attr;
								}
							}
							break;
						}
					}
			}
		}
		console.log("Details of attributes : "+JSON.stringify(attributes));
		$scope.detailsOfAttribute=attributes;
	}


	$scope.addResource=function()
	{
		myService.addResourceService($scope.listOfAttributes, saveCollectionAttributes, saveTitle, typeOfEntity);
		// Clean list of attributes
		$scope.listOfAttributes={};
	}

	$scope.updateResource=function()
	{
		var urlOfResource=saveResource.substring(staticText.length,saveResource.length);
		myService.updateResourceService(urlOfResource, saveCollectionAttributes, saveTitle, $scope.listOfAttributes);
	}

}]);




