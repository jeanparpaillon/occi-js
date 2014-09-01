function guid(){
 	var uid = function(){
		return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	}
	return uid()+uid()+"-"+uid()+"-"+uid()+"-"+uid()+"-"+uid()+uid()+uid();
}