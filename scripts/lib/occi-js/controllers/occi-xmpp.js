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
				myData:{},

				onConnection:function(conn)
				{
					connection=conn;
					console.log("I m in OnConnection");
					this.getCapabilities();
					// console.log("Ressource : "+this.myData);
				},

				// Get a list of resources
				getCapabilities:function()
				{
					// node:"/store/myresources/json/compute/f8f5064e-ddea-4b2d-bc32-686357325b83"
				    var request=$iq({to:"admin@localhost/erocci", type:"get", id:"getResource"}).c("query",{xmlns: "http://schemas.ogf.org/occi-xmpp", node:"/store"});
				    connection.send(request);
				    connection.addHandler(service.printResponse, null, "iq", null, "getResource");

				},

				printResponse:function(iq)
				{
   					$(iq).find('entity').each(function(index)
   					{
   						var url="/"+Strophe.getResourceFromJid($(this).attr('xl:href'));
		   				var req="Req"+index;
		   				var request2=$iq({to:"admin@localhost/erocci", type:"get", id:req}).c("query",{xmlns: "http://schemas.ogf.org/occi-xmpp", node:url});
		   				connection.send(request2);
		   				connection.addHandler(service.showResult, null, "iq", null, req);
		   				// console.log($(iq).find('entity').attr('xl:href'));
   					});
					
					return true;
				},

				// print results of a collection
			    showResult:function(iq)
				{
					console.log("I m in showResult");
			   		// var listAttribute=new Array();

			   		// var attribute=$(iq).find('attribute').each(function(index)
			   		// {
			   		// 	listAttribute[index]=$(this).attr('value');
			   		// });
			   		// console.log("show Result : "+listAttribute[0]);
			   		var json = xml2json($(iq).context);
				    var myJson=jQuery.parseJSON(json);
					console.log(json);
					$rootScope.$apply(function()
				    {
				    	deffered.resolve(json);
				    });
		   		}
		   	});
		return deffered.promise;
		}
	}
}]);

app.controller('connCtrl',['$scope', 'xmppSession', 'myService', function($scope, xmppSession, myService)
{
	myService.start().then(function(result)
	{
		// console.log("Data : "+result);
		$scope.data=result;
		$scope.showCategories=true;
	});
}]);

