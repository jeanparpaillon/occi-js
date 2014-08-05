angular.module('occi-services', []);

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
					$rootScope.online=true;
				},

				onDisconnection:function()
				{
					$rootScope.online=false;
				},

				// Get a list of resources
				getCapabilities:function()
				{
				    var request=$iq({to:"admin@localhost/erocci", type:"get", id:"getCapa"}).c("query",{xmlns: "http://schemas.ogf.org/occi-xmpp", type:"caps"});
				    connection.send(request);
				    connection.addHandler(service.printCapabilities, null, "iq", null, "getCapa");
				},
				printCapabilities:function(iq)
				{
					var node=($(iq).find('capabilities')[0]);
			   		var jsonCapabilities = xmlCapabilitiesToJson(node);
				    var capabilitiesString=JSON.stringify(jsonCapabilities);
				    categories=jQuery.parseJSON(capabilitiesString);
					// console.debug(capabilitiesString);
					$rootScope.$apply(function()
				    {
				    	deffered.resolve(categories);
				    });
					
					return false;
				}
		   	});
		return deffered.promise;
		},
		getDetails:function(){
				var deffered=$q.defer();
			return{
				   getCollections:function(location) {
						// Use attribute "location" to send a new query
						// console.log(location);
						var resultSplit=location.split('/');
						var url="/"+resultSplit[1]+"/"+resultSplit[2]+"/";
						var request=$iq({to:"admin@localhost/erocci", type:"get", id:"getCol"}).c("query",{xmlns: "http://schemas.ogf.org/occi-xmpp", node: url});
					    connection.send(request);
					    connection.addHandler(this.printCollections, null, "iq", null, "getCol");
					    return deffered.promise;
					},
					printCollections:function(iq)
					{
					   		var collection=($(iq).find('collection')[0]);
					   		var jsonCollections = xmlCollectionsToJson(collection);
							var collectionString=JSON.stringify(jsonCollections);
							var collections=jQuery.parseJSON(collectionString);
							// console.log(collectionString);
							$rootScope.$apply(function()
							    {
							    	deffered.resolve(collections);
							    });
							return false;
				   	},
				   	getResourceLocations:function(resource)
				   	{
				   		// console.log("getResource of Xmpp");
				   		var url=resource.substring(25,resource.length);
				   		// console.log("URL : "+url);
				   		var request=$iq({to:"admin@localhost/erocci", type:"get", id:"getResource"}).c("query",{xmlns: "http://schemas.ogf.org/occi-xmpp", node: url});
					    connection.send(request);
					    connection.addHandler(this.printResource, null, "iq", null, "getResource");
					    return deffered.promise;
				   	},
				   	printResource:function(iq)
				   	{
				   		// console.log("printRessource");
				   		var resource=($(iq).find('query')[0]);
				   		var jsonResource = xmlResourcesToJson(resource);
						var resourceString=JSON.stringify(jsonResource);
						var resources=jQuery.parseJSON(resourceString);
						console.log(resourceString);
						$rootScope.$apply(function()
						    {
						    	deffered.resolve(resources);
						    });
						return false;
				   	}, 
				   	deleteResourceController:function(resource)
				   	{
				   		// console.log("In deleteRessource");
				   		var url=resource.substring(25,resource.length);
				   		var request=$iq({to:"admin@localhost/erocci", type:"set"}).c("query",{xmlns: "http://schemas.ogf.org/occi-xmpp", op:"delete", node:url});
					    connection.send(request);
				   	}
				   }
		}
	}
}]);