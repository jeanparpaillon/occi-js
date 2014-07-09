angular.module('occi-js.xmpp',[]);
var app = angular.module('occi-js', ['occi-js.xmpp','ngRoute']);
var boshServer = 'http://localhost:5280/http-bind';



app.service('myService',['xmpp','xmppService', function(xmpp, xmppService) {
		this.start=function()
		{
				var service=xmppService.create();
				angular.extend(service,{

				onConnection:function(conn)
				{
					console.log("I m in OnConnection");
					var reqID=this.getCapabilities(conn);
					conn.addHandler(this.printResponse, null, "iq", null, reqID);
				},

				// Get a list of resources
				getCapabilities:function(conn)
				{
				    var request=$iq({to:"admin@localhost/erocci", type:"get", id:"req1"}).c("query",{xmlns: "http://schemas.ogf.org/occi-xmpp", node:"/store/myresources/json/compute/f8f5064e-ddea-4b2d-bc32-686357325b83"});
				    conn.send(request);
				    console.log("I m in getCategories");
				    
				    return "req1";
				},

				printResponse:function(iq)
				{	
					
					console.log("print Response : ");
					var json = xml2json($(iq).context);
				    myJson=jQuery.parseJSON(json);
				    // var textJson=JSON.stringify(json);
					// var xmlData=$(iq).context;
					console.log(json);
					console.log(myJson.iq.query.resource);
					
				 	// myData=myJson.iq.query.resource;
				

				 	// promise.then(function(data)
				 	// {

				 	// });
					// console.log(myJson.iq.query.resource.title);

				},
				
				showData:function(myData)
				{
					console.log("Title of resource : "+myData.title);
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
	
	return service.data;
		}
}]);

app.controller('connCtrl',function($rootScope, myService)
{
	var serv=myService.start();
	// console.log("DATA : "+serv);
	// console.log("Print data : "+serv.getData());
	// $scope.data=myData;
	// $scope.showCategories=true;
});

