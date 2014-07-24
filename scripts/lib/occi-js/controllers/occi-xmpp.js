angular.module('occi-js.xmpp',[]);
var app = angular.module('occi-js', ['occi-js.xmpp','ngRoute']);
var boshServer = 'http://localhost:5280/http-bind';
var connection=null;

app.factory('myService',['$q', '$rootScope', 'xmpp','xmppService', 'xmppSession', function($q, $rootScope, xmpp, xmppService, xmppSession) {
	return {	
		start:function()
		{
				var deffered=$q.defer();
				var service=xmppService.create();
				angular.extend(service,{

				onConnection:function(conn)
				{
					connection=conn;
					this.getCapabilities();
				},

				// Get a list of resources
				getCapabilities:function()
				{
				    var request=$iq({to:"admin@localhost/erocci", type:"get", id:"getCapa"}).c("query",{xmlns: "http://schemas.ogf.org/occi-xmpp", type:"caps"});
				    connection.send(request);
				    connection.addHandler(service.printCategories, null, "iq", null, "getCapa");
				},
				printCategories:function(iq)
				{
					var node=($(iq).find('capabilities')[0]);
			   		var json = xml2json(node);
				    var resultJson=JSON.stringify(json);
				    var myJson=jQuery.parseJSON(resultJson);
					console.debug(resultJson);
					$rootScope.$apply(function()
				    {
				    	deffered.resolve(myJson);
				    });
					
					return false;
				}
		   	});
		return deffered.promise;
		},
		getRes:function(){
				var deffered=$q.defer();
			return{
				   getCollection:function(location) {
						// Use attribute "location" to send a new query
						console.log(location);
						var resultSplit=location.split('/');
						var url="/"+resultSplit[1]+"/"+resultSplit[2]+"/";
						var request=$iq({to:"admin@localhost/erocci", type:"get", id:"getCol"}).c("query",{xmlns: "http://schemas.ogf.org/occi-xmpp", node: url});
					    connection.send(request);
					    connection.addHandler(this.printCollection, null, "iq", null, "getCol");
					    return deffered.promise;
					},
					printCollection:function(iq)
					{
					   		var collection=($(iq).find('collection')[0]);
					   		var json = xmlToJson(collection);
							var result=JSON.stringify(json);
							var myJson=jQuery.parseJSON(result);
							console.log(result);
							$rootScope.$apply(function()
							    {
							    	deffered.resolve(myJson);
							    });
							return false;
				   	},
				   	getRessource:function(resource)
				   	{
				   		var url=resource.substring(25,resource.length);
				   		console.log("URL : "+url);
				   		var request=$iq({to:"admin@localhost/erocci", type:"get", id:"getResource"}).c("query",{xmlns: "http://schemas.ogf.org/occi-xmpp", node: url});
					    connection.send(request);
					    connection.addHandler(this.printRessource, null, "iq", null, "getResource");
					    return deffered.promise;
				   	},
				   	printRessource:function(iq)
				   	{
				   		console.log("printRessource");
				   		var resource=($(iq).find('resource')[0]);
				   		var json = xmlJson(resource);
						var result=JSON.stringify(json);
						var myJson=jQuery.parseJSON(result);
						console.log(result);
						$rootScope.$apply(function()
						    {
						    	deffered.resolve(myJson);
						    });
						return false;
				   	}, 
				   	deleteRessource:function(resource)
				   	{
				   		console.log("In deleteRessource");
				   		var url=resource.substring(25,resource.length);
				   		var request=$iq({to:"admin@localhost/erocci", type:"set"}).c("query",{xmlns: "http://schemas.ogf.org/occi-xmpp", op:"delete", node:url});
					    connection.send(request);
					    $route.reload();
				   	}
				   }
		}
	}
}]);


app.controller('connCtrl',['$scope', 'xmppSession', 'myService', function($scope, xmppSession, myService)
{
	myService.start().then(function(result)
	{
		$scope.data=result;
		$scope.showCategories=true;
	});

	$scope.getRessources=function(location, title)
	{
		$scope.categoryTitle=title;
		myService.getRes().getCollection(location).then(function(result)
		{
			$scope.resources=result.resources;
			$scope.showResources=true;
		});
	}

	$scope.getResourceDetails=function(resource)
	{
		// console.log(resource);
		myService.getRes().getRessource(resource).then(function(result)
		{	
			$scope.resourceDetails=result;
		});
	}

	$scope.deleteResource=function(resource)
	{
		myService.getRes().deleteRessource(resource);
	}
}]);

