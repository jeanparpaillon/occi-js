angular.module('occi-js.xmpp',[]);
var app = angular.module('occi-js', ['occi-js.xmpp','ngRoute']);
var boshServer = 'http://localhost:5280/http-bind';



app.factory('myService',['$q', 'xmpp','xmppService', 'xmppSession', function($q, xmpp, xmppService, xmppSession) {
	return {	
		start:function()
		{
				// var deffered=$q.defer();
				var service=xmppService.create();
				angular.extend(service,{

				onConnection:function(conn)
				{
					console.log("I m in OnConnection");
					this.getResource(conn);
				},

				// Get a list of resources
				getResource:function(conn)
				{
				    var request=$iq({to:"admin@localhost/erocci", type:"get", id:"getResource"}).c("query",{xmlns: "http://schemas.ogf.org/occi-xmpp", node:"/store/myresources/json/compute/f8f5064e-ddea-4b2d-bc32-686357325b83"});
				    conn.addHandler(this.printResponse, null, "iq", null, "getResource");
				    conn.send(request);
				    console.log("I'm in getResource");
				},

				//Get one resource				
				printResponse:function(iq)
				{	
					console.log("print Response : ");
					var json = xml2json($(iq).context);
				    myJson=jQuery.parseJSON(json);
					console.log(json);
				},

				// print results of a collection
			    showResult:function(iq)
				{
					console.log("I m in showResult");
			   		var resource=$(iq).find('resource');
			   		var kind=$(iq).find('kind');	
			   		var listAttribute=new Array();

			   		var attribute=$(iq).find('attribute').each(function(index)
			   		{
			   			listAttribute[index]=$(this).attr('value');
			   		});
			   		console.log("show Result : "+listAttribute[0]);
		   		}
		   	});
		},

	 showResults:function()
	 {
	 	console.log("SHOW...");
	 	console.log(xmppSession.data.title);
	 }
	}
}]);

app.controller('connCtrl',['$scope', 'xmppSession', 'myService', function($scope, xmppSession, myService)
{
	myService.start();
	// myService.showResults();
		
	// console.log("Title of resource : "+xmppSession.data.title);
	// console.log("DATA : "+serv);
	// console.log("Print data : "+serv.getData());
	// $scope.data=myData;
	// $scope.showCategories=true;
}]);

