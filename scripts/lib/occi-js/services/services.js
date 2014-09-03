angular.module('occi-services', []);


var connection=null;
var staticText="xmpp+occi:admin@localhost";



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
					document.location='#xmpp';
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
							$rootScope.$apply(function()
							    {
							    	deffered.resolve(collections);
							    });
							return false;
				   	},
				   	getResourceLocations:function(resource)
				   	{
				   		var url=resource.substring(staticText.length,resource.length);
				   		var request=$iq({to:"admin@localhost/erocci", type:"get", id:"getResource"}).c("query",{xmlns: "http://schemas.ogf.org/occi-xmpp", node: url});
					    connection.send(request);
					    connection.addHandler(this.printResource, null, "iq", null, "getResource");
					    return deffered.promise;
				   	},
				   	printResource:function(iq)
				   	{
				   		var resource=($(iq).find('query')[0]);
				   		var jsonResource = xmlResourcesToJson(resource);
						var resourceString=JSON.stringify(jsonResource);
						var resources=jQuery.parseJSON(resourceString);
						$rootScope.$apply(function()
						    {
						    	deffered.resolve(resources);
						    });
						return false;
				   	}
				   }
		},
		deleteResourceService:function(resource)
	   	{
	   		var url=resource.substring(staticText.length,resource.length);//changer la fonction subString()
	   		var request=$iq({to:"admin@localhost/erocci", type:"set"}).c("query",{xmlns: "http://schemas.ogf.org/occi-xmpp", op:"delete", node:url});
		    connection.send(request);
	   	},
	   	addResourceService:function(listOfAttributes, collectionAttributes, resourceTitle, typeOfEntity)
	   	{
	   		var id=guid();
	   		console.log("id created : "+id);
	   		var termOfKind=collectionAttributes.term;
	   		var schemeOfKind=collectionAttributes.scheme;
	   		var titleOfResource=resourceTitle;

	   		// if typeOfEntity is resource we create an iq with element 'resource', else we create an element 'link'
	   		var myRequestString='$iq({to:"admin@localhost/erocci", type:"set"}).c("query",{xmlns: "http://schemas.ogf.org/occi-xmpp", op:"save", node:"/newResources/'+termOfKind+'/'+id+'"})';
	   		if(typeOfEntity=="link")
	   		{
	   			myRequestString+='.c("link", {xmlns: "http://schemas.ogf.org/occi"})';
	   		}else
	   		{
	   			myRequestString+='.c("resource", {xmlns: "http://schemas.ogf.org/occi", title: "'+resourceTitle+'"})';
	   		}
	   		myRequestString+='.c("kind", {scheme:"'+schemeOfKind+'", term: "'+termOfKind+'"})';
	   		for(attribute in listOfAttributes)
	   		{
	   			myRequestString+='.c("attribute",{name: "'+attribute+'", value: "'+listOfAttributes[attribute]+'"})';
	   		}
	   	
	   		var myRequest=eval(myRequestString);
	   		connection.send(myRequest);
	   	},
	   	updateResourceService:function(urlOfResource, collectionAttributes, resourceTitle, listOfAttributes)
	   	{
	   		var myRequestString='$iq({to:"admin@localhost/erocci", type:"set"}).c("query",{xmlns: "http://schemas.ogf.org/occi-xmpp", op:"update", node:"'+urlOfResource+'"})';
			if(typeOfEntity=="link")
			{
				myRequestString+='.c("link", {xmlns: "http://schemas.ogf.org/occi"})';
			}else
			{
				myRequestString+='.c("resource", {xmlns: "http://schemas.ogf.org/occi", title: "'+resourceTitle+'"})';
			}
			myRequestString+='.c("kind", {scheme:"'+collectionAttributes.scheme+'", term: "'+collectionAttributes.term+'"})';
			for(attribute in listOfAttributes)
			{
				myRequestString+='.c("attribute",{name: "'+attribute+'", value: "'+listOfAttributes[attribute]+'"})';
			}
			// console.log("myRequest : "+myRequestString);
			var myRequest=eval(myRequestString);
	   		console.log("Request after evaluation :"+myRequest);
	   		// Send request to server
	   		connection.send(myRequest);
	   	}
	}
}]);