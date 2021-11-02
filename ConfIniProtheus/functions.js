function criaIni(){
                  /* General */
                  var obj = $("[general]");
                  var val = "[General]\r\n";
                  for(var i=0; i < obj.length; i++){
                     if( obj[i].getAttribute("general") == "ConsoleLog" && obj[i].value == "0"){ 
                         val += obj[i].getAttribute("general") + "=" + obj[i].value  + "\r\n";
                          break;
                     }
                     else{
                          val += obj[i].getAttribute("general") + "=" + obj[i].value  + "\r\n";
                     }
                  }  
                  val += "\r\n";
                  
                  if($("#cbService").is(":checked")){
                       obj = $("[service]");
                       val += "[Service]\r\n";
                       for(var i=0; i < obj.length; i++){
                           val += obj[i].getAttribute("service") + "=" + obj[i].value  + "\r\n";
                       }  
                       val += "\r\n";
                  }
                  
                  if($("#cbDrivers").is(":checked")){
                       obj = $("[drivers]");
                       val += "[Drivers]\r\n";
                       for(var i=0; i < obj.length; i++){
                           if(i == 1){  
                               val += "\r\n[" + obj[i-1].value + "]\r\n";
                           }
                           val += obj[i].getAttribute("drivers") + "=" + obj[i].value  + "\r\n";
                       }  
                       val += "\r\n";
                  }
                  
                  
                  
                  
                  $("#confIni").val(val);     
            }