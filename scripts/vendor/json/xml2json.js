/*
 Author : Brahim MOUNTASSIR
 */

 
// Fonction convert Capabilities from xml to json
function xmlCapabilitiesToJson(xml){
      // Create the return object
      var obj = {};
    
      if(xml.nodeType == 1) { // element
      // do attributes
            if (xml.attributes.length > 0) {
                  for (var j = 0; j < xml.attributes.length; j++) {
                        var attribute = xml.attributes.item(j);
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
                  var name=searchAttribute(child[0].attributes, "name");
                  console.log('JsonCapabilities : '+name);
                  var resultSplit=(name).split('.');
                  obj["attributes"][resultSplit[0]]={};
                  obj["attributes"][resultSplit[0]][resultSplit[1]]={};
            }
            for(var i = 0; i < xml.childNodes.length; i++) {
                  var item = xml.childNodes.item(i);
                  var nodeName = item.nodeName;
                        if(nodeName!="attribute" && nodeName!="parent")
                        {
                              nodeName+="s";
                              if(typeof(obj[nodeName]) == "undefined"){

                                    obj[nodeName] = xmlCapabilitiesToJson(item);    
                              }else{
                                    if (typeof(obj[nodeName].push) == "undefined") {
                                          var old = obj[nodeName];
                                          obj[nodeName] = [];
                                          obj[nodeName].push(old);
                                    }
                                    obj[nodeName].push(xmlCapabilitiesToJson(item));
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
                                    var name=searchAttribute(item.attributes, "name");
                                    var secondSplit=name.split('.');
                                    
                                    if(secondSplit.length>1)
                                    {
                                          obj["attributes"][resultSplit[0]][resultSplit[1]][secondSplit[2]]=xmlCapabilitiesToJson(item);
                                    }else
                                    {
                                          obj["attributes"]={};
                                          obj["attributes"][resultSplit[0]]=xmlCapabilitiesToJson(item);
                                    }
                              }

                        }
             }
            

            }
      return obj;
};



// Convert xml data (collection) to Json
function xmlCollectionsToJson(xml)
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
                  obj["resources"].push(xmlCollectionsToJson(item));

            }
      }
      return obj;
}


// Convert xml data (Resource) to Json
function xmlResourcesToJson(xml)
{
      console.log("Invoke xmlResourcesToJson function");
      console.log("xml node Name : "+xml.nodeName);
      var obj = {};
      if (xml.nodeType == 1) { 
            var name=xml.nodeName;
            if (xml.attributes.length > 0 && name!="query") {
                  for (var j = 0; j < xml.attributes.length; j++) {
                        var attribute = xml.attributes.item(j);
                        console.log("Attribute : "+attribute.nodeName);
                        if(attribute.nodeName=="id")
                               obj[attribute.nodeName]= attribute.nodeValue;
                  }
            }
    }


      if (xml.hasChildNodes()){
            var firstChild=xml.firstChild;
            var name=firstChild.nodeName;
            var term=xml.getElementsByTagName("kind")[0].getAttribute("term");
            if(xml.nodeName!="query")
            {
                  obj["attributes"]={};
                  var attribute=xml.getElementsByTagName("attribute");
                  var nam=searchAttribute(attribute[0].attributes, "name");
                  console.log("Name : "+attribute[1].attributes.item(1).nodeValue);
                  var firstSplit=(nam).split('.');
                  obj["attributes"][firstSplit[0]]={};
                  obj["attributes"][firstSplit[0]][term]={};
            }else{
                  obj[name]=[];
            }            
            for(var i = 0; i < xml.childNodes.length; i++) {
                  var item = xml.childNodes.item(i);
                  nodeName=item.nodeName;
                  console.log("before Test attribute :"+nodeName);
                  
                  if(nodeName!="attribute")
                  {
                        console.log("nodeName different from attribute : "+nodeName);
                        if(nodeName=="kind")
                        {
                              var attributeKind=item.attributes;
                              obj[nodeName]=searchAttribute(attributeKind, "scheme")+searchAttribute(attributeKind, "term");
                        }

                        else if(nodeName=="mixin")
                        {
                              var attributeMixin=item.attributes;
                              var mixinValue=searchAttribute(attributeMixin, "scheme")+searchAttribute(attributeMixin, "term");
                              var name="mixins";
                              obj[name]=[];
                              console.log("Mixin Json value : "+mixinValue);
                              obj[name].push(mixinValue);
                        }
                        else if(typeof(obj[nodeName]) == "undefined"){
                                    obj[nodeName] = xmlResourcesToJson(item);    
                              }else{
                                    if (typeof(obj[nodeName].push) == "undefined") {
                                          var old = obj[nodeName];
                                          obj[nodeName] = [];
                                          obj[nodeName].push(old);
                                    }
                                    obj[nodeName].push(xmlResourcesToJson(item));
                              }
                  }else{
                              var name=searchAttribute(item.attributes, "name");
                              console.log("Node  attribute : "+name);
                              var secondSplit=name.split('.');
                              if(secondSplit[2]=="source"|| secondSplit[2]=="target")
                              {
                                    obj[secondSplit[2]]=searchAttribute(item.attributes, "xl:href");
                              }
                              else if(secondSplit[1]==term)
                              {
                                    console.log("secondSplit : "+secondSplit);
                                    obj["attributes"][firstSplit[0]][secondSplit[1]][secondSplit[2]]=searchAttribute(item.attributes, "value");
                              }
                  }   
            }
      }
      return obj;
}




function searchAttribute(node, attribute)
{
      var result;
      for(var i=0; i<node.length; i++)
      {
            if(node.item(i).nodeName==attribute)
                  result=node.item(i).nodeValue;
      }
      return result;
}