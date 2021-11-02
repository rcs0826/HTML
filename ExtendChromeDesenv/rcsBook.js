/*
RCS Biblioteca Javascript
=================================== 
- RCS.mask(id, mask);
- RCS.maskMoney(id);
- RCS.disableSelect(idInput, dis);
- RCS.setValueSelect(id,valor);
- RCS.setValueChecked(name,valor); 
- RCS.getDescSelect(id); retorna a descrição do Option selecionado
- RCS.getValueSelect(id); retorna o valor
- RCS.getValueList(id); retorna um Array
- RCS.getValueChecked(name); retorna o valor
- RCS.getValueCheckedList(name); retorna um Array
- RCS.getTime(); retorna as horas  
- RCS.getDate(); retorna uma data formato PT-BR
- RCS.parseDatePTBR(dt); retorna uma data formato PT-BR
- RCS.inputSetDate(idInput,disabled);
- RCS.inputSetTime(idInput,disabled);
- RCS.retZeroEsq(valor); retira os zeros a esquerda
- RCS.isCPF(cpf); return obj: bolean + msg
- RCS.isCNPJ(cnpj); return obj: bolean + msg  
- RCS.isNullOrEmpyt(val); Valida se uma variável está vazia ou nula
- RCS.digitalEfect(id,tipo,message); tipo 1=value, 2=innerHTML
- RCS.calcHour(id1,id2,idResp,menos); retorna valor / idResp e menos opcional / se menos = true, subtrai
- RCS.textHtml(id); retorna um texto convertido em html (ex: é => &eacute;)
- RCS.invertString(param); retorna o texto invertido
- RCS.html5InputSuported(tpObg); Ex= tpObg:date / retorna true ou false
- RCS.codec(param); retorna uma string codificada
- RCS.decode(param); retorna uma string decodificada
- RCS.stringToTXT(filename, text); retorna um arquivo para download / filename: nome do arquivo com extenção | text: conteudo do arquivo
- RCS.htmlTableToCSV(filename, idTable); retorna um arquivo para download / filename: nome do arquivo com extenção | idTable: ID da tabela
- RCS.contains(valor, contain); retorno bolean
- RCS.containsVet(vetor, valor); retorno bolean
- RCS.floatToMoney(val); Converte um número decimal (1.8) em moeda (1,80) 
- RCS.moneyToFloat(val); Converte moeda (1,80) em um número decimal (1.8)
- RCS.help();

 // As funções abaixo precisam de uma 'div' vazia para funcionar
 //**************************************************************************
- RCS.htmlTimeClock(idDiv,icon); icon: true
- RCS.htmlCalendar(idDiv,dtInicial,string-function); retorna mes-ano
  --- Complemento: Feriados SP - RCS.htmlCalendar("id",null,"feriados()");
  --- Arquivo feriadosSP.js
- RCS.htmlCalendarMin(idDiv,function);
- RCS.htmlCalc(id,idReturnValCalc);
- RCS.info(id,msg,type); type: erro, sucess, warn, info(default)
- RCS.alt(id,msg);
- RCS.altClose();
- RCS.infoLoad(id,msg);
- RCS.infoLoadClose();
- RCS.newTab(id,complemento); abre uma nova aba com as informações de uma div 
- RCS.print(id,complemento); abre uma nova aba com as informações de uma div e aciona a impressão
- RCS.htmlExpress(id) cria um editor simples de HTML
- RCS.textTable(txt, divRet);  Transforma um texto em tabela HTML simples
*/
/*TimeClock*/
var tc;
/*Alert*/
function closeAlert(id){
       document.getElementById(id).innerHTML="";
};
 /*HTML Express*/
function cc(del){               
         document.getElementById("heDiv").innerHTML = document.getElementById("heText").value;
}
function dd(id){
         document.getElementById(id).innerHTML = "";
}
/*Calc*/
function inputCalc(val){
     var vet = document.getElementById("cResult").value.split("");
     var result = val;
     var simbol1= false
        ,simbol2= false;
     
         switch(vet[vet.length -1]){
            case "/":
            case "*":
            case "-":
            case "+":
                simbol1 = true;
              break;
           default:
              simbol1 = false;    
         }         
         
         switch(val){
            case "/":
            case "*":
            case "-":
            case "+":
               simbol2 = true;
               break;
            default:
              simbol2 = false; 
         } 
    
     if((val == '/' || val == '+' || val == '*' || val == '.' ) && vet.length == 0){}
     else if(vet[vet.length -1] == '.' && val == "."){}
     else if(simbol1 == true && simbol2 == true){}
     else{
         document.getElementById("cResult").value += result; 
     }
};
function resultCalc(){
     var calc = document.getElementById("cResult").value;
     var result, num1="", num2="", qtd = 0;
     var vet = calc.split("");
     var ini=0,fim,control = true, operador="",operador2="";
     
     try{
           for(var i = 0; i < vet.length; i++){
               
               if(i==0 && vet[i] == "-"){                     
                   num1 += vet[i];
               } 
               else if(vet[i] != "-" && vet[i] != "+" && vet[i] != "/" && vet[i] != "*"){
                    if(operador == ""){
                        num1 += vet[i];
                    }
                    else{
                        num2 += vet[i];
                    }               
               }
               else {
                   operador2 = operador;
                   operador = vet[i];
                   
                   if(num2 != ""){
                     switch(operador2){
                            case "/":
                               num1 = parseFloat(num1)/parseFloat(num2);
                               num2 = "";
                               break;
                            case "*":
                               num1 = parseFloat(num1)*parseFloat(num2);
                               num2 = "";
                               break;
                            case "-":
                               num1 = parseFloat(num1)-parseFloat(num2);
                               num2 = "";
                               break;
                            case "+":
                               num1 = parseFloat(num1)+parseFloat(num2); 
                               num2 = "";
                               break;
                            default:
                              num1;
                        }
                   }
               }
         }
         switch(operador){
                      case "/":
                         result = parseFloat(num1)/parseFloat(num2);
                         break;
                      case "*":
                         result = parseFloat(num1)*parseFloat(num2);
                         break;
                      case "-":
                         result = parseFloat(num1)-parseFloat(num2);
                         break;
                      case "+":
                         result = parseFloat(num1)+parseFloat(num2);
                         break;
                      default:
                        num1;
                  } 
           document.getElementById("cResult").value = (result.toString().indexOf(".") != -1)?result.toFixed(2):result;
           var ret = document.getElementById("cReturn").value;
     
           if(ret != ""){
                  document.getElementById(ret).value = (result.toString().indexOf(".") != -1)?result.toFixed(2):result;
           } 
     }
     catch(e){
          document.getElementById("cResult").value = "Error";
          console.error(e.message);
     }
};
function delCalc(id){ 
     var val = document.getElementById("cResult").value;  
     var vet = val.split("");
     if(id == "del"){
         document.getElementById("cResult").value = "";
     }
     else{ 
        document.getElementById("cResult").value = val.substring(0, vet.length -1);
     }
};
/*Conversão em HTML*/
function convertHtml(param){ 
        var ret = param;
        ret = ret.replace("Á","&Aacute;");
        ret = ret.replace("á","&aacute;");
        ret = ret.replace("Â","&Acirc;");
        ret = ret.replace("â","&acirc;");
        ret = ret.replace("À","&Agrave;");
        ret = ret.replace("à","&agrave;");
        ret = ret.replace("Å","&Aring;");
        ret = ret.replace("å","&aring;");
        ret = ret.replace("Ã","&Atilde;");
        ret = ret.replace("ã","&atilde;");
        ret = ret.replace("Ä","&Auml;");
        ret = ret.replace("ä","&auml;");
        ret = ret.replace("Æ","&AElig;");
        ret = ret.replace("æ","&aelig;");
        ret = ret.replace("É","&Eacute;");
        ret = ret.replace("é","&eacute;");
        ret = ret.replace("Ê","&Ecirc;");
        ret = ret.replace("ê","&ecirc;");
        ret = ret.replace("È","&Egrave;");
        ret = ret.replace("è","&egrave;");
        ret = ret.replace("Ë","&Euml;");
        ret = ret.replace("ë","&euml;");
        ret = ret.replace("Ð","&ETH;");
        ret = ret.replace("ð","&eth;");
        ret = ret.replace("Í","&Iacute;");
        ret = ret.replace("í","&iacute;");
        ret = ret.replace("Î","&Icirc;");
        ret = ret.replace("î","&icirc;");
        ret = ret.replace("Ì","&Igrave;");
        ret = ret.replace("ì","&igrave;");
        ret = ret.replace("Ï","&Iuml;");
        ret = ret.replace("ï","&iuml;");
        ret = ret.replace("Ó","&Oacute;");
        ret = ret.replace("ó","&oacute;");
        ret = ret.replace("Ô","&Ocirc;");
        ret = ret.replace("ô","&ocirc;");
        ret = ret.replace("Ò","&Ograve;");
        ret = ret.replace("ò","&ograve;");
        ret = ret.replace("Ø","&Oslash;");
        ret = ret.replace("ø","&oslash;");
        ret = ret.replace("Õ","&Otilde;");
        ret = ret.replace("õ","&otilde;");
        ret = ret.replace("Ö","&Ouml;");
        ret = ret.replace("ö","&ouml;");
        ret = ret.replace("Ú","&Uacute;");
        ret = ret.replace("ú","&uacute;");
        ret = ret.replace("Û","&Ucirc;");
        ret = ret.replace("û","&ucirc;");
        ret = ret.replace("Ù","&Ugrave;");
        ret = ret.replace("ù","&ugrave;");
        ret = ret.replace("Ü","&Uuml;");
        ret = ret.replace("ü","&uuml;");
        ret = ret.replace("Ç","&Ccedil;");
        ret = ret.replace("ç","&ccedil;");
        ret = ret.replace("Ñ","&Ntilde;");
        ret = ret.replace("ñ","&ntilde;"); 
        ret = ret.replace("-","&#45;");
        /*
        ret = ret.replace("<","&lt;");
        ret = ret.replace(">","&gt;");
        ret = ret.replace("&","&amp;");
        ret = ret.replace("\"","&quot;");
        ret = ret.replace("®","&reg;");
        ret = ret.replace("©","&copy;");
        ret = ret.replace("Ý","&Yacute;");
        ret = ret.replace("ý","&yacute;");
        ret = ret.replace("Þ","&THORN;");
        ret = ret.replace("þ","&thorn;");
        ret = ret.replace("ß","&szlig;");
        */
        
        return ret;
    };
/*Calendar*/
function botaoProximo(id,data,funct) {
       var dat = data.split("/" );
       var mes = (parseInt(dat[1]) + 1) > 12 ? 1 : (parseInt(dat[1]) + 1);
       var ano = (parseInt(dat[1]) + 1) > 12 ? (parseInt(dat[2]) + 1) : dat[2];
       var novaData = "1/" + mes + "/" + ano;
       return "<input type='button' id='btpxcalendatio' value='Proximo"+String.fromCharCode(9658)+"' onclick='Javascript:RCS.htmlCalendar(\""+id+"\",\""+ novaData + "\",\""+ funct + "\");'>";
};
function botaoAnterior(id,data,funct) {
       var dat = data.split("/" );
       var mes = (parseInt(dat[1]) - 1) < 0 ? 12 : (parseInt(dat[1]) - 1);
       var ano = (parseInt(dat[1]) - 1) < 0 ? (parseInt(dat[2]) - 1) : dat[2];
       var novaData = "1/" + mes + "/" + ano;
       return "<input type='button' id='btancalendatio' value='"+String.fromCharCode(9668)+"Anterior' onclick='Javascript:RCS.htmlCalendar(\""+id+"\",\""+ novaData + "\",\""+ funct + "\");'>";
};
function botaoHoje(id,funct){
      var data = new Date();
      var mes = data.getMonth() + 1;
      var ano = data.getFullYear();                    
      var novaData = "1/"+mes+"/" +ano;                       
      return "<input type='button' id='bthjcalendatio' value='"+String.fromCharCode(9632)+"' onclick='Javascript:RCS.htmlCalendar(\""+id+"\",\""+novaData+ "\",\""+ funct + "\");'>";
};
function diaDaSemanaExtenso(dia) {
       var semana = new Array("Domingo", "Segunda-feira", "Terça-feira","Quarta-feira", "Quinta-feira" , "Sexta-feira" , "Sábado" );
       return semana[dia];
};
function mesExtenso(mes) {
       var meses = new Array("Janeiro", "Fevereiro", "Março" , "Abril" , "Maio", "Junho", "Julho" , "Agosto" , "Setembro" , "Outubro" , "Novembro", "Dezembro");
       return meses[mes];
};
function ultimoDia(mes, ano) {
       if (mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10 || mes == 12) {
             return 31;
       }
       if (mes == 4 || mes == 6 || mes == 9 || mes == 11) {
             return 30;
       }
       if (mes == 2)
             if (ano % 400 == 0) {
                   return 29;
            }
       if (mes == 2)
             if (ano % 100 == 0) {
                   return 28;
            }
       if (mes == 2)
             if (ano % 4 == 0) {
                   return 29;
            } else {
                   return 28;
            }
};
/*Funções*/
var RCS = {

    mask:function(id, mask){
        try{
            var campo = document.getElementById(id);
            var result="" ,
                vet= "",
                cont=0,
                ascii=0,
                temp="";
                      
             mask = mask.split("");
             vet = campo.value.split("");
                         
             if(vet.length <= mask.length){             
                 for(var i = 0 ; i < vet.length ; i++){
                      if(mask[i + cont] == '0'){  
                           if(!isNaN(vet[i])){
                               result += vet[i];               
                           }
                           else{
                               result = result.substring(0, vet.length);
                           }
                      }
                      else if (mask[i + cont] == 'X' || mask[i + cont] == 'x'){
                           ascii = vet[i].charCodeAt(0);
                           if( (ascii >= 65 && ascii <=90) || (ascii >= 97 && ascii <= 122) ){
                               if(mask[i + cont] == 'X' ){
                                    temp = vet[i];
                                    result += temp.toUpperCase();
                               }
                               else{
                                   result += vet[i];
                               }             
                           }
                           else{
                               result = result.substring(0, vet.length);
                           }
                      }
                      else if (mask[i + cont] == 'A' || mask[i + cont] == 'a'){
                           ascii = vet[i].charCodeAt(0);
                           if( (ascii >= 65 && ascii <=90) || (ascii >= 97 && ascii <= 122) || (ascii >= 48 && ascii <= 57)){
                               if(mask[i + cont] == 'A' ){
                                    temp = vet[i];
                                    result += temp.toUpperCase();
                               }
                               else{
                                   result += vet[i];
                               }
                           }
                           else{
                               result = result.substring(0, vet.length);
                           }
                      }
                      else if (mask[i + cont] == vet[i]){
                           result += mask[i + cont];                     
                      }
                      else{
                           result += mask[i + cont];                           
                           cont ++;
                           i--;
                      }
                 }            
                 campo.value = result;
            }
            else{
                 campo.value = campo.value.substring(0, mask.length);
            }
        }
        catch(e){
           console.log("Erro: " + e.message);
        }
      },
    maskMoney:function(id){
        try{
            var campo = document.getElementById(id);
            var result="" ,
                vet= "",
                cont=0,
                conteiner,
                block = true,
                temp=""
                temp2="";
             vet = campo.value.split( "");
             for(var i = 0 ; i < vet.length ; i++){
                 if(!isNaN(vet[i])){
                      temp += vet[i];
                 }   
             } 
             conteiner = temp.split("");
             for(var j = conteiner.length ; j > 0  ; j--){   
                 if(block && cont == 2){
                     temp2 += "," + conteiner[j-1];
                     block = false;
                     cont = 1;
                 }
                 else if(cont == 3){
                     temp2 += "." + conteiner[j-1];
                     cont = 1;
                 }
                 else{
                      temp2 += conteiner[j-1];
                      cont++; 
                 }
             }    
             conteiner = temp2.split("");
             for(var x = conteiner.length ; x > 0  ; x--){
                 result += conteiner[x-1];
             }     
             campo.value = result;
        }
        catch(e){
           console.log( "Erro: " + e.message);
        }
      },  
     parseDatePTBR:function(dt){
      dt = dt.toString().replace("-","/").replace("-","/");
      var vet = dt.split("/"); 
      var ret = "";
      
      if((vet[0]).split("").length == 4 ){
        ret = vet[2] +"/"+vet[1] +"/"+vet[0];
      }
      else{
        ret = dt;
      }
      return ret;
    },    
    disableSelect:function(id, dis){
            var x = document.getElementById(id);
            for (var i = 0; i < x.length; i++) {
                if (x[i].selected != true) {
                    x[i].disabled = dis;
                }
            }
        },
    setValueSelect:function(id,val){
            var x = document.getElementById(id);    
            for (var i = 0; i < x.length; i++) {
                if (x[i].value == val) {
                    x[i].selected = true;
                }
            }
     },
    setValueChecked:function(prname,val){
            var x = document.getElementsByName(prname);    
            for (var i = 0; i < x.length; i++) {
                if (x[i].value == val) {
                    x[i].checked = true;
                }
            }
     },
    getDescSelect:function(id){
            var x = document.getElementById(id);    
            for (var i = 0; i < x.length; i++) {
                if (x[i].selected == true) {
                    return x[i].innerHTML;
                }
            }
            return "";
     },
    getValueSelect:function(id){
            var x = document.getElementById(id);    
            for (var i = 0; i < x.length; i++) {
                if (x[i].selected == true) {
                    return x[i].value;
                }
            }
            return "";
     },
    getValueList:function(id){
            var x = document.getElementById(id);
            var val = new Array();
            for (var i = 0; i < x.length; i++) {
                if (x[i].selected == true) {
                    val.push(x[i].value);
                }
            }
            return val;
     },
     getValueChecked:function(parname){
          var x = document.getElementsByName(parname); 
          for (var i = 0; i < x.length; i++) {
              if (x[i].checked == true) { 
                  return x[i].value;
              }
          }
          return "";
      },       
     getValueCheckedList:function(parname){
          var x = document.getElementsByName(parname); 
            var val = new Array();
          for (var i = 0; i < x.length; i++) {
              if (x[i].checked == true) { 
                  val.push(x[i].value)
              }
          }
          return val;
      },
    getDate:function(){
             var today = new Date();
             var year = today.getFullYear();
             var month = today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
             var day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
             var dtAtual = (day + '/' + month + '/' + year);  
             return dtAtual;
            } ,
    getTime:function(){
             var today = new Date();
             var minute = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
             var hour = today.getHours() < 10 ? '0' + today.getHours() : today.getHours();
             var horas = (hour + ':' + minute);  
             return horas;  
            } ,
    inputSetDate:function(id,disabled){
             var today = new Date();
             var year = today.getFullYear();
             var month = today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
             var day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
             var dtAtual = (day + '/' + month + '/' + year);              
             document.getElementById(id).value = dtAtual; 
             document.getElementById(id).disabled = disabled; 
            } ,
    inputSetTime:function(id,disabled){
             var today = new Date();
             var minute = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
             var hour = today.getHours() < 10 ? '0' + today.getHours() : today.getHours();
             var horas = (hour + ':' + minute);              
             document.getElementById(id).value =horas;             
             document.getElementById(id).disabled = disabled;  
            } ,
    invertString:function(param){
           var txt="";
           var vet = param.split("");
           for(var i=(vet.length-1); i>-1; i--){
                   txt += vet[i]; 
           }                    
           return txt;
           },
    htmlCalendarMin:function(idCalendar, func) {
           var data = new Date();
           var mes = data.getMonth();
           var ano = data.getFullYear();
           var dia = data.getDate();
           var diaSem = data.getDay();             
           var estrutura = "<table id='minCalendar'><tr id='calHead'><td><b>"
             + diaDaSemanaExtenso(diaSem)
             + "</b></td></tr><tr id='calBody'><td><center><b><span id='cDia'>"
             + dia 
             + "</span></b><br><span id='cAno'>"
             +  mesExtenso(mes) +"-"+ano
             + "</span></center></td></tr></table>";             
             document.getElementById(idCalendar).innerHTML = estrutura;
             if(func != null && typeof(func) == "function"){
                func();
             }                
               return mes+"-"+ano;
            },
    htmlCalendar:function(idCalendar,dat,func) {
       var data, estrutura, id;
       try {
             if (dat == null || dat.trim() == "") {
                  data = new Date();
            } else {
                  dat = dat.split("/");
                  data = new Date(dat[2], (dat[1] - 1), dat[0]);
            }
             var mes = data.getMonth();
             var ano = data.getFullYear();
             var ultimoDiaMes = ultimoDia((mes + 1), ano);
             var novaData = new Date(ano, mes, 1);
             var diasCont = 1;
             var verificarPrimeiroDia = true;
             var dtButton = "1/" + (mes + 1) + "/" + ano;
             var funct = func;
            estrutura = "<dir id='objcalendario'><h2>" + mesExtenso(mes) + " - "
                        + ano + "</h2><hr>";
            estrutura += "<table border='0' id='tbcalendario'>" ;
            estrutura += "<tr>";
             for (var x = 0; x < 7; x++) {
                  estrutura += "<th><center>" + diaDaSemanaExtenso(x) + "</center></th>" ;
            }
            estrutura += "</tr>";
             for (var i = 0; i < 6; i++) {
                   if (diasCont <= ultimoDiaMes) {
                        estrutura += "<tr>";
                         for (var j = 0; j < 7; j++) {
                               if (novaData.getDay() == j && verificarPrimeiroDia) {
                                    id = ano + "_" + ((mes+1)<10?"0"+(mes+1):(mes+1)) + "_" + (diasCont<10?"0"+diasCont:diasCont);
                                    estrutura += "<td id='" + id + "'><center>" + diasCont + "</center></td>";
                                    verificarPrimeiroDia = false;
                                    diasCont++;
                              } else if (!verificarPrimeiroDia && parseInt(diasCont) <= ultimoDiaMes) {
                                    id = ano + "_" + ((mes+1)<10?"0"+(mes+1):(mes+1)) + "_" + (diasCont<10?"0"+diasCont:diasCont);
                                    estrutura += "<td id='" + id + "'><center>" + diasCont + "</center> </td>";
                                    diasCont++;
                              } else {
                                    estrutura += "<td class='dtnull'></td>";
                              }
                        }
                        estrutura += "</tr>";
                  }
            }  //console.info("funct: "+funct.toString());
            estrutura += "</table><hr>";
            estrutura += botaoAnterior(idCalendar,dtButton,funct);
            estrutura += botaoHoje(idCalendar,funct);
            estrutura += botaoProximo(idCalendar,dtButton,funct);
            estrutura += "</dir>";
            estrutura += "<input type='hidden' value='' id='calendarMesAno'>";
            
      } catch (e) {
            estrutura = "Erro na formatação da data: " + e.message
      }  
      document.getElementById(idCalendar).innerHTML = estrutura;  
      document.getElementById("calendarMesAno").value = (mes+1)+"-"+ano;

      var dthj = new Date();
      id = dthj.getFullYear() + "_" + ((dthj.getMonth()+1)<10?"0"+(dthj.getMonth()+1):(dthj.getMonth()+1)) + "_" + (dthj.getDate()<10?"0"+dthj.getDate():dthj.getDate());
      if(document.getElementById(id)){
         document.getElementById(id).innerHTML = "<center><b>" + dthj.getDate() + "</b></center>";
      }    
      
      if(func != null ){//&& typeof(func) == "function"){
              eval(func);
      } 
      
      return (mes+1)+"-"+ano;   
    },
    retZeroEsq:function(val){
      var  vet = val.split("")
        ,result = ""
        ,nzero = false;
      
      for(var i = 0; i<vet.length; i++){
        if(nzero){
          result += vet[i];
        }
        else if(parseInt(vet[i]) != 0){
          result += vet[i];
                nzero = true;
        }
      }
      return result;  
  },
  isCPF:function(val){ 
     var cpf = val.trim().replace(".","").replace(".","").replace("-","");
     var msg = {message:"", semErro:true};
     var qtd = cpf.split("").length;
     if(cpf == "" ) {
      msg.message = "Campo CPF não pode ser vazio";
        msg.semErro = false;      
        return msg;
   }
  else if(parseInt(qtd) < 11){
    msg.message = "Campo CPF com menos de 11 digitos";
    msg.semErro = false;   
        return msg;
  }
  else{  
     var Soma = 0;
     var Resto;      
     
      if (cpf == "00000000000" || 
                cpf == "11111111111" || 
                cpf == "22222222222" || 
                cpf == "33333333333" || 
                cpf == "44444444444" || 
                cpf == "55555555555" || 
                cpf == "66666666666" || 
                cpf == "77777777777" || 
                cpf == "88888888888" || 
                cpf == "99999999999"){ 
        msg.message = "Campo CPF inválido";
            msg.semErro = false;
                return msg;
      }
        
      for (i=1; i<=9; i++){
        Soma = Soma + parseInt(cpf.substring(i-1, i)) * (11 - i);
      }     
      Resto = (Soma * 10) % 11;
      
        if ((Resto == 10) || (Resto == 11)){
          Resto = 0;
        }       
        if (Resto != parseInt(cpf.substring(9, 10)) ){
          msg.message = "Campo CPF inválido";
            msg.semErro = false;
                return msg;
        }     
      Soma = 0;
      
        for (i = 1; i <= 10; i++){
          Soma = Soma + parseInt(cpf.substring(i-1, i)) * (12 - i);
        }
        
        Resto = (Soma * 10) % 11;
      
        if ((Resto == 10) || (Resto == 11)){
          Resto = 0;
        }
        if (Resto != parseInt(cpf.substring(10, 11) ) ){
          msg.message = "Campo CPF inválido";
            msg.semErro = false;
                return msg;
        }
                    
        msg.message = "CPF válido";
        msg.semErro = true;
            return msg;
  }
  },
  isCPF:function(param){
    var msg = {message:"", semErro:true};
  var cnpj = param.trim().replace(".","").replace(".","").replace(".","").replace("/","").replace("-","");  
  
  // Validação do Campo CNPJ
  if( cnpj == "" ) {
      msg.message = "Campo CNPJ não pode ser vazio";
          msg.semErro = false;
            return msg;
  }
  else if(cnpj.split("").length < 14){
        msg.message = "Campo CNPJ com menos de 14 digitos";
          msg.semErro = false;
            return msg;
  }
  else{ 
    var numeros, digitos, soma, i, resultado, pos, tamanho;
    
        // Elimina CNPJs invalidos conhecidos
        if (cnpj == "00000000000000" || 
            cnpj == "11111111111111" || 
            cnpj == "22222222222222" || 
            cnpj == "33333333333333" || 
            cnpj == "44444444444444" || 
            cnpj == "55555555555555" || 
            cnpj == "66666666666666" || 
            cnpj == "77777777777777" || 
            cnpj == "88888888888888" || 
            cnpj == "99999999999999"){
            msg.message = "Campo CNPJ inválido";
              msg.semErro = false;
                return msg;
        } 
           
         var i;
           var numero;
           var situacao = '';
           numero = cnpj; 
             s = numero;
           c = s.substr(0,12);
           var dv = s.substr(12,2);
           var d1 = 0;

           for (i = 0; i < 12; i++){
              d1 += c.charAt(11-i)*(2+(i % 8));
           }

           if (d1 == 0){
              msg.message = "Campo CNPJ inválido";
              msg.semErro = false;
                return msg;
           }
           d1 = 11 - (d1 % 11);

           if (d1 > 9) d1 = 0;

              if (dv.charAt(0) != d1){
                 msg.message = "Campo CNPJ inválido";
                   msg.semErro = false;
                   return msg;
              }

           d1 *= 2;
           for (i = 0; i < 12; i++){
              d1 += c.charAt(11-i)*(2+((i+1) % 8));
           }

           d1 = 11 - (d1 % 11);
           if (d1 > 9) d1 = 0;

              if (dv.charAt(1) != d1){
                 msg.message = "Campo CNPJ inválido";
                 msg.semErro = false;
                   return msg;
              }

             msg.message = "CNPJ válido";
         msg.semErro = true;
             return msg;
       }
  },
  htmlTimeClock:function(id,icon){ 
       tc = setInterval(function (){
           var d=new Date();
           var hora = d.getHours();
           var minuto = d.getMinutes();
           var segundo = d.getSeconds();
           var slot = "<div id='timeClock'><span id='hr'>";
           if(icon){
                slot += "<span id='tcicon'>" + String.fromCharCode(hora<18?9728:9729); + "</span>";     
           }
           slot +=  ((hora < 10)? "0" + hora.toString():hora)
                + "</span>:<span id='min'>"
                +  ((minuto < 10)? "0" + minuto.toString():minuto) 
                + "</span>:<span id='sec'>"                    
                +  ((segundo < 10)? "0" + segundo.toString():segundo) 
                + "</span>";
           
           slot += "</div>";
           document.getElementById(id).innerHTML=slot;
       },1000);
  },
  htmlCalc:function(idConstr,idReturn){
            var slot = '<div id="calc" draggable="true" ondragstart="drag(event)">'
                     + '<div id="calcDisplay">'
                        + '<input type="text" value="" id="cResult" placeholder="0" readonly>'
                        + '<input type="hidden" value="" id="cMemory">'                        
                        + '<input type="hidden" value="" id="cReturn">'
                     + '</div>'
                     + '<div id="calcButtom">'
                        + '<div id="bksp" onclick="Javascript:delCalc(this.id);">BkSp</div>'                        
                        + '<div id="del" onclick="Javascript:delCalc(this.id);">Del</div>'
                        + '<br>'
                        + '<input type="button" value="7" onclick="Javascript:inputCalc(this.value);">'
                        + '<input type="button" value="8" onclick="Javascript:inputCalc(this.value);">'
                        + '<input type="button" value="9" onclick="Javascript:inputCalc(this.value);">'
                        + '<input type="button" value="/" onclick="Javascript:inputCalc(this.value);">'
                        + '<br>'
                        + '<input type="button" value="4" onclick="Javascript:inputCalc(this.value);">'
                        + '<input type="button" value="5" onclick="Javascript:inputCalc(this.value);">'
                        + '<input type="button" value="6" onclick="Javascript:inputCalc(this.value);">'
                        + '<input type="button" value="*" onclick="Javascript:inputCalc(this.value);">'
                        + '<br>'
                        + '<input type="button" value="1" onclick="Javascript:inputCalc(this.value);">'
                        + '<input type="button" value="2" onclick="Javascript:inputCalc(this.value);">'
                        + '<input type="button" value="3" onclick="Javascript:inputCalc(this.value);">'
                        + '<input type="button" value="-" onclick="Javascript:inputCalc(this.value);">'
                        + '<br>'       
                        + '<input type="button" value="." onclick="Javascript:inputCalc(this.value);">'
                        + '<input type="button" value="0" onclick="Javascript:inputCalc(this.value);">'
                        + '<input type="button" value="=" onclick="Javascript:resultCalc(this.value);">'
                        + '<input type="button" value="+" onclick="Javascript:inputCalc(this.value);">'
                     + '</div>'
                  + '</div>';
                  
                  document.getElementById(idConstr).innerHTML=slot;
                  document.getElementById("cReturn").value = idReturn;
  },
  alt:function(idInput,id,msg){
       var obj = document.getElementById(id);
       var obj2 = document.getElementById(idInput);    
       var xtop = obj2.offsetTop - 40;
       var xleft = obj2.offsetLeft + 40;
       
       var slot = '<input type="hidden" id="idLoad" value="'
                + id
                + '">' 
                +'<div id="custalt" >'
                   +'<center>'
                     + msg
                   +'</center>'
                +'</div>';
        obj.innerHTML=slot;
        obj.style = "position:fixed;top:"+xtop+";left:"+xleft;  
  },
  altClose:function(){
      RCS.infoLoadClose();
  },
  info:function(id,msg,tipo){
      var tp,titulo,cd;
      switch(tipo){
           case "erro":
               tp = "erro";
               titulo = " - Erro";
               //cd = 10006;
               cd = 10008;
               break; 
           case "warn":
               tp = "warn";
               titulo = " - Atenção";
               cd = 9888;
               break;
           case "sucess":
               tp = "sucess";
               titulo = " - Sucesso";
               cd = 10004;
               break;
           default:
               tp = "info";
               titulo = " - Informação";
               cd = 10069;
              
      }
      var slot = '<div id="alfundo"></div> '
                + '<div id="custalert" onclick="Javascript:closeAlert(\''
                + id
                +'\')">'
                   + '<div id="altitle" class="'
                + tp
                +'">'
                     + '<center><b>'
                     + String.fromCharCode(cd)
                     + titulo
                     + '</b></center>'
                   + '</div>'
                   + '<div id="albody">'
                    + '<textarea readonly>'
                    + msg
                    + '</textarea>'
                   + '</div>'
                + '</div>';
       document.getElementById(id).innerHTML=slot;         
  },
  contains:function(valor, contain){
                  if(valor.indexOf(contain) != -1){
                       return true;
                  }
                  return false;
                }, 
  containsVet:function(vet,val){
      for(var i=0; i<vet.length; i++){    
        if(vet[i] == val){
          return true;
        }
      }
      return false;
    },
  infoLoad:function(id,msg){
       var slot = '<div id="alfundo"></div>'
                +'<input type="hidden" id="idLoad" value="'
                + id
                + '">' 
                +'<div id="custalert">'
                   +'<div id="albody">'
                     +'<center><h1>'
                     + msg
                     +'</h1></center>'
                   +'</div>'
                +'</div>';
        document.getElementById(id).innerHTML=slot;  
  },
  infoLoadClose:function(){
        var id = document.getElementById("idLoad").value;
        document.getElementById(id).innerHTML = "";
  },
  digitalEfect:function(id,tipo,message){
        var obj = document.getElementById(id);
        var val = message.split("");
        var msg = "";
        if(tipo == 1){
            obj.value = "";
        }
        else if(tipo == 2){
            obj.innerHTML = "";
        }
        for(var i = 0; i<val.length; i++){
             if(tipo == 1){
                 eval("setTimeout(function(){obj.value += val["+i+"];},"+i+"00)");
             }
             else if(tipo == 2){
                 eval("setTimeout(function(){obj.innerHTML += val["+i+"];},"+i+"00)");
             }
        }
  },
  newTab:function(id,complemento){
              var htmlIni = "<html><head></head><body>";
              var htmlFim = "</body></html>";
              var compl = (complemento != "")?complemento:"";
              var val = htmlIni + compl + "<div id='body'>"+ document.getElementById(id).innerHTML + "</div>" + htmlFim;
              var win = window.open("", "" , "width=1000, height=500");
              var doc = win.document;
              doc.open();
              doc.write(val);
              doc.close();
    },
  print:function(id,complemento){
              var htmlIni = "<html><head></head><body>";
              var htmlFim = "</body></html>";
              var compl = (complemento != "")?complemento:"";
              var val = htmlIni + compl + "<div id='body'>"+ document.getElementById(id).innerHTML + "</div>" + htmlFim;
              var win = window.open("", "" , "width=1000, height=500");
              var doc = win.document;
              doc.open();
              doc.write(val);
              doc.close();
              setTimeout(function(){
                win.print();
              },1000);      
    },
   calcHour:function(id1,id2,idResp,menos){
         var hs1 = document.getElementById(id1).value.split(':');
         var hs2 = document.getElementById(id2).value.split(':');
         var horas = 0, minutos = 0, result;
         
         if(hs1.length != 2 || hs2.length != 2){
             return false;
         }
         
         if(menos || menos == true){
             minutos = parseInt(hs1[1]) - parseInt(hs2[1]);
             if(minutos < 0){
                minutos = minutos + 60;
                horas--;
             }
             horas = (parseInt(hs1[0]) - parseInt(hs2[0])) + horas;
         }
         else{         
           minutos = parseInt(hs1[1]) + parseInt(hs2[1]);
           if(minutos >= 60){
              minutos = minutos - 60;
              horas++;
           }
           horas = horas + parseInt(hs1[0]) + parseInt(hs2[0]);
         }  
         result = ((horas < 10)?"0"+horas:horas).toString() + ":" + ((minutos < 10)?"0"+minutos:minutos).toString();
          
         if(idResp){
            document.getElementById(idResp).value = result;
         }
                   
         return result;  
     },
     htmlExpress:function(id){
           var html = "<div id='htmlExpress'><label id='heLb'>HTML Express: </label><button id='heBt' onclick=\"dd('"+id+"');\">X</button><hr><textarea id='heText' rows='6' onkeypress='cc();' onkeyup='cc();'></textarea><div id='heDiv'></div></div>";
           document.getElementById(id).innerHTML = html;
     },
     html5InputSuported:function(tpObg){
           var suportedDate = true;
           var testElement=document.createElement("input");
           testElement.setAttribute("type", tpObg); 
           if (tpObg != "text" && testElement.type=="text"){ 
                 suportedDate = false;
           } 
           return suportedDate;
     },
     textHtml:function(id){
              var vInput = document.getElementById(id).value;
              var vOutput = "";
              var vet = vInput.split("");
              for(var i=0;i<vet.length;i++){
                   vOutput += convertHtml(vet[i]);   
              }
              return vOutput;
     },
     codec:function(param){
                   var _min = 31, _max = 126;
                   var vet = param.split("");
                   var qtd = vet.length;
                   var ctr = true;
                   var num = 0;
                   var lt;
                   var vcodec = "";
                    
                   for(var i=0; i<qtd; i++){
                     if(ctr){
                        lt = (vet[i]).toString();   
                        num = lt.charCodeAt(0) + qtd;
                        if(num >= _max){
                            num = _min + (num - _max);
                        }
                        vcodec += String.fromCharCode(num);
                        ctr=false;
                     }
                     else{
                        lt = (vet[i]).toString(); 
                        num = lt.charCodeAt(0) - qtd;
                        if(num <= _min){
                            num = _max - (_min - num);
                        }  
                        vcodec += String.fromCharCode(num);
                        ctr=true;  
                     }
                   }
                   
                   return this.invertString(vcodec);
               },
          textTable:function(txt, divRet){
                    if(txt == ""){
                         return;
                    }
                    var row = txt.split("\n");
                    var column;
                    var table = "<table border='1'>";                     
                    for(var i=0; i<row.length; i++){
                         column =  row[i].toString().split(";");
                          table += "<tr>";
                          for(var j=0; j<column.length; j++){
                                 table += "<td>";
                                 table += column[j];
                                 table += "</td>";
                          }
                          table += "</tr>";
                    }                                       
                    table += "</table>";        
                    document.getElementById(divRet).innerHTML = table;
               },
          decode:function(param){
                   var _min = 31, _max = 126;
                   param = this.invertString(param);
                   var vet = param.split("");
                   var qtd = vet.length;
                   var ctr = true;
                   var num = 0;
                   var lt = "";
                   var vdecode = "";
                   
                   for(var i=0; i<qtd; i++){
                     if(ctr){
                        lt = (vet[i]).toString(); 
                        num = lt.charCodeAt(0) - qtd;              
                        if(num <= _min){
                            num = _max - (_min - num);
                        }
                        vdecode += String.fromCharCode(num);
                        ctr=false;
                     }
                     else{
                        lt = (vet[i]).toString();
                        num = lt.charCodeAt(0) + qtd;
                        if(num >= _max){
                            num = _min + (num - _max);
                        }
                        vdecode += String.fromCharCode(num);
                        ctr=true;  
                     }
                   }
                   
                   return vdecode;
               },
               stringToTXT:function(filename, text) {
                    var element = document.createElement('a');
                    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text)); 
                    element.setAttribute('download', filename);
                  
                    element.style.display = 'none';
                    document.body.appendChild(element);
                  
                    element.click();
                  
                    document.body.removeChild(element);         
                },                
                htmlTableToCSV:function(filename, idTable){
                         var element = document.createElement('a'); 
                         var table = document.getElementById(idTable).innerHTML;
                         table = table.replace(/&(.*?);/g, "");
                         table = table.replace(/<(.td?)>/g, ";");
                         table = table.replace(/<(.th?)>/g, ";");
                         table = table.replace(/<(.tr?)>/g, "\n");
                         table = table.replace(/<(.*?)>/g, "");
                         
                         element.setAttribute('href', 'data:application/octet-stream;charset=ISO-8859-1,' + encodeURIComponent(table));
                         element.setAttribute('download', filename);
                      
                         element.style.display = 'none';
                         document.body.appendChild(element);
                      
                         element.click();
                      
                         document.body.removeChild(element);
                },
                isNullOrEmpyt:function(val){
                  var ret = false;
                  
                  if(val == null){
                    ret = true;
                  }
                  else if(val == undefined){
                    ret =  true;
                  }
                  else if(val.toString().trim() == ""){
                    ret = true;
                  }
                  
                  return ret;
                },
              floatToMoney : function(val) {
                var ret = 0;
                var fl = parseFloat(val).toFixed(2);
                var vet = fl.toString().split(".");
                var vet2 = null;
                var result = "", cont = 0, conteiner, block = true, temp = ""
                  temp2 = "";
                if (vet.length == 1) {
                  ret = val + ",00";
                } 
                else {
                  vet2 = vet[1].split("");
                  if (vet2.length == 1) {
                    ret = vet[0] + "," + vet[1] + "0";
                  } else {
                    ret = vet[0] + "," + vet[1];
                  }
                }
                
                vet = ret.split("");
                for (var i = 0; i < vet.length; i++) {
                  if (!isNaN(vet[i])) {
                    temp += vet[i];
                  }
                }
                conteiner = temp.split("");
                for (var j = conteiner.length; j > 0; j--) {
                  if (block && cont == 2) {
                    temp2 += "," + conteiner[j - 1];
                    block = false;
                    cont = 1;
                  } else if (cont == 3) {
                    temp2 += "." + conteiner[j - 1];
                    cont = 1;
                  } else {
                    temp2 += conteiner[j - 1];
                    cont++;
                  }
                }
                conteiner = temp2.split("");
                for (var x = conteiner.length; x > 0; x--) {
                  result += conteiner[x - 1];
                }
            
                return result;
              },
                moneyToFloat:function(val){
                      val = val.replace(/[\.]/g, "");
                      val = val.replace(",","."); 
                      val = parseFloat(val);
                      return val; 
                } ,
               help:function(){ 
                      var bk = "\r\n";
                      var msg = ""       
                      +'=================================== ' + bk
                      +'RCS Biblioteca Javascript' + bk
                      +'=================================== ' + bk
                      +'- RCS.mask(id, mask);' + bk
                      +'- RCS.maskMoney(id);' + bk
                      +'- RCS.disableSelect(idInput, dis);' + bk
                      +'- RCS.setValueSelect(id,valor);' + bk
                      +'- RCS.setValueChecked(name,valor); ' + bk
                      +'- RCS.getDescSelect(id); retorna a descrição do Option selecionado' + bk
                      +'- RCS.getValueSelect(id); retorna o valor' + bk
                      +'- RCS.getValueList(id); retorna um Array' + bk
                      +'- RCS.getValueChecked(name); retorna o valor' + bk
                      +'- RCS.getValueCheckedList(name); retorna um Array' + bk 
                      +'- RCS.getTime(); retorna as horas' + bk  
                      +'- RCS.getDate(); retorna uma data formato PT-BR' + bk 
                      +'- RCS.parseDatePTBR(dt); retorna uma data formato PT-BR' + bk
                      +'- RCS.inputSetDate(idInput,disabled);' + bk
                      +'- RCS.inputSetTime(idInput,disabled);' + bk
                      +'- RCS.retZeroEsq(valor); retira os zeros a esquerda' + bk
                      +'- RCS.isCPF(cpf); return obj: bolean + msg' + bk
                      +'- RCS.isCNPJ(cnpj); return obj: bolean + msg' + bk   
                      +'- RCS.isNullOrEmpyt(val); Valida se uma variável está vazia ou nula' + bk         
                      +'- RCS.digitalEfect(id,tipo,message); tipo 1=value, 2=innerHTML' + bk
                      +'- RCS.calcHour(id1,id2,idResp,menos); retorna valor / idResp e menos opcional / se menos = true, subtrai' + bk
                      +'- RCS.textHtml(id); retorna um texto convertido em html (ex: é => &eacute;)' + bk
                      +'- RCS.invertString(param); retorna o texto invertido' + bk
                      +'- RCS.html5InputSuported(tpObg); Ex= tpObg:date / retorna true ou false' + bk
                      +'- RCS.codec(param); retorna uma string codificada' + bk
                      +'- RCS.decode(param); retorna uma string decodificada' + bk
                      +'- RCS.stringToTXT(filename, text); retorna um arquivo para download / filename: nome do arquivo com extenção | text: conteudo do arquivo' + bk
                      +'- RCS.htmlTableToCSV(filename, idTable); retorna um arquivo para download / filename: nome do arquivo com extenção | idTable: ID da tabela' + bk
                      +'- RCS.contains(valor, contain); retorno bolean' + bk  + bk
                      +'- RCS.containsVet(vetor, valor); retorno bolean' + bk  + bk    
                       +'//**************************************************************************' + bk
                       +'// As funções abaixo precisam de uma "div" vazia para funcionar' + bk
                       +'//**************************************************************************' + bk
                      +'- RCS.htmlTimeClock(idDiv,icon); icon: true' + bk
                      +'- RCS.htmlCalendar(idDiv,dtInicial,string-function); retorna mes-ano' + bk
                        +'--- Complemento: Feriados SP - RCS.htmlCalendar("id",null,"feriados()");' + bk
                        +'--- Arquivo feriadosSP.js' + bk
                      +'- RCS.htmlCalendarMin(idDiv,function);' + bk
                      +'- RCS.htmlCalc(id,idReturnValCalc);' + bk
                      +'- RCS.info(id,msg,type); type: erro, sucess, warn, info(default)' + bk
                      +'- RCS.alt(id,msg);' + bk
                      +'- RCS.altClose();' + bk
                      +'- RCS.infoLoad(id,msg);' + bk
                      +'- RCS.infoLoadClose();' + bk
                      +'- RCS.newTab(id,complemento); abre uma nova aba com as informações de uma div ' + bk
                      +'- RCS.print(id,complemento); abre uma nova aba com as informações de uma div e aciona a impressão' + bk
                      +'- RCS.htmlExpress(id) cria um editor simples de HTML' + bk
                      +'- RCS.textTable(txt, divRet);  Transforma um texto em tabela  HTML simples' + bk    
                      +'- RCS.floatToMoney(val); Converte um número decimal (1.8) em moeda (1,80)' + bk    
                      +'- RCS.moneyToFloat(val); Converte moeda (1,80) em um número decimal (1.8)' + bk  
             
                      + "";
                      
                      console.info(msg);
               }
};
