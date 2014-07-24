/*
 Author : Brahim MOUNTASSIR
 */

 /*
 Fonction xml2json
 parameter: xml data
*/

function xml2json(xml) {
      // Create the return object
      var obj = {};
      var impObject={};
      var object={};
    
      if(xml.nodeType == 1) { // element
      // do attributes
            if (xml.attributes.length > 0) {
            var resultSplit=new Array();
      
                  for (var j = 0; j < xml.attributes.length; j++) {
                        // var indice=false;
                        var attribute = xml.attributes.item(j);
                        // obj[attribute.nodeName]=attribute.nodeValue;
                        if(attribute.nodeName!="xmlns")
                        {
                              var name=attribute.nodeName;     
                              if(name!="name")
                              obj[name]=attribute.nodeValue;
                        }
                  }
            }
                      
      }
      // do children
      if (xml.hasChildNodes()) {
            // split name like "occi.compute.state" for all node "attribute"
            if(xml.nodeName!="capabilities")
            {
                  obj["attributes"]={};
                  var child=xml.getElementsByTagName("attribute");
                  var name=child[0].attributes.item(0).nodeValue;
                  var resultSplit=(name).split('.');
                  obj["attributes"][resultSplit[0]]={};
                  obj["attributes"][resultSplit[0]][resultSplit[1]]={};
            }
            for(var i = 0; i < xml.childNodes.length; i++) {
                  var item = xml.childNodes.item(i);
                  var nodeName = item.nodeName;
                        if(nodeName!="attribute" && nodeName!="parent")
                        {
                              if(typeof(obj[nodeName]) == "undefined"){
                                    obj[nodeName] = xml2json(item);    
                              }else{
                                    if (typeof(obj[nodeName].push) == "undefined") {
                                          var old = obj[nodeName];
                                          obj[nodeName] = [];
                                          obj[nodeName].push(old);
                                    }
                                    obj[nodeName].push(xml2json(item));
                              }
                        }
                        else
                        {
                              if(nodeName=="parent")
                              {
                                    obj[nodeName]=(item.attributes[0].nodeValue)+(item.attributes[1].nodeValue);
                              }
                              else if(nodeName=="attribute")
                              {
                                    var name=item.attributes.item(0).nodeValue;
                                    var resultSplit=name.split('.');
                                    
                                    if(resultSplit.length>1)
                                    {
                                          obj["attributes"][resultSplit[0]][resultSplit[1]][resultSplit[2]]=xml2json(item);
                                    }else
                                    {
                                          obj["attributes"]={};
                                          obj["attributes"][resultSplit[0]]=xml2json(item);
                                    }
                              }

                        }
             }
            

            }
      return obj;
};



// Convert xml data (collection) to Json
function xmlToJson(xml)
{
      var obj = {};
      if (xml.nodeType == 1 && xml.nodeName!="collection") { 
            if (xml.attributes.length > 0) {
                  for (var j = 0; j < xml.attributes.length; j++) {
                        var attribute = xml.attributes.item(j);
                        obj= attribute.nodeValue;
                  }
            }
    }

      if (xml.hasChildNodes()){
            obj["resources"]=[];
            for(var i = 0; i < xml.childNodes.length; i++) {
                  var item = xml.childNodes.item(i);
                  obj["resources"].push(xmlToJson(item));
            }
      }
      return obj;
}