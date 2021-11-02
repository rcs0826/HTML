/*
RCS Biblioteca Javascript
=================================== 
- RCS.mask(id, mask);
- RCS.maskMoney(id);
- RCS.copyClipboard(id);
- RCS.disableSelect(idInput, dis);
- RCS.setValueSelect(id,valor);
- RCS.setValueSelectDesc(id,desc);
- RCS.setValueChecked(name,valor); 
- RCS.getDescSelect(id); retorna a descrição do Option selecionado
- RCS.getValueSelect(id); retorna o valor
- RCS.getValueList(id); retorna um Array
- RCS.getValueChecked(name); retorna o valor
- RCS.getValueCheckedList(name); retorna um Array
- RCS.getTime(); retorna as horas  
- RCS.getDate(); retorna uma data formato PT-BR
- RCS.parseDatePTBR(dt); retorna uma data formato PT-BR
- RCS.parseDateInt(dt); retorna a data em inteiro "yyymmdd"
- RCS.valid2Dt(dti,dtf); Valida data inicial com data final
- RCS.inputSetDate(idInput,disabled);
- RCS.inputSetTime(idInput,disabled);
- RCS.retZeroEsq(valor); retira os zeros a esquerda
- RCS.setCarLeft(val,nchar,rep); prenche uma string com caracteres (valor, caracter a ser preenchido, quantidade)
- RCS.getNumber(val); retorna apenas os números de uma string;
- RCS.csvTOinsert(csv); retorna código Insert Into SQL;
- RCS.validChave(chave);
- RCS.clearWhiteLine(id); id campo, retorna o texto sem linhas vazias;
- RCS.retEspRed(val); String, retorna o texto sem espaços vazios redundantes;
     * *************************************************************************
     *              Valida as Chaves de Validação 
     * *************************************************************************
     *  - (NFe )   Nota Fiscal Eletrônica;
     *  - (NFCe)   Nota Fiscal de Consumidor Eletrônica;
     *  - (CTe )   Conhecimento de Transporte Eletrônico; 
     *  - (CTe OS) Conhecimento de Transporte Eletrônico para Outros Serviços;
     *  - (MDFe)   Manifesto de Documento Fiscal Eletrônico;
     *  *************************************************************************
- RCS.isCPF(cpf); return obj: bolean + msg
- RCS.isCNPJ(cnpj); return obj: bolean + msg  
- RCS.isNullOrEmpty(val); Valida se uma variável está vazia ou nula
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
- RCS.setLimitCaracter(obj,qtd);  Limita a quantidade de Caracteres em um elemento
- RCS.vetReorg(vet); Reorganiza um vetor (precisa da função alfMax)
- RCS.alfMax(val1,val2); Verifica se o valor1 é maior que o valor2, baseado na tabela ASSII
- RCS.help();

 // As funções abaixo precisam de uma 'div' vazia para funcionar
 // e o arquivo rcsBook.css
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
- RCS.newTab(id,complemento); abrecontainsVet uma nova aba com as informações de uma div 
- RCS.print(id,complemento); abre uma nova aba com as informações de uma div e aciona a impressão
- RCS.htmlExpress(id) cria um editor simples de HTML
- RCS.textTable(txt, divRet);  Transforma um texto em tabela HTML simples (separando coluna com ;)
*/
/*TimeClock*/
var tc;
/*Alert*/
/**************************************************************************
*   Deletar objeto Timeclock
* *************************************************************************
* 
* @param id: ID da Div;
* @return Sem retorno;
**************************************************************************/
function closeAlert(id){
    document.getElementById(id).innerHTML="";
};
 /*HTML Express*/
/**************************************************************************
*   Transforma o texto em HTML
* *************************************************************************
* 
* @param del: Valor a ser transformado;
* @return Sem retorno;
**************************************************************************/
function cc(del){               
    document.getElementById("heDiv").innerHTML = document.getElementById("heText").value;
}
/**************************************************************************
*   Apagar a códigos
* *************************************************************************
* 
* @param id: ID da Div;
* @return Sem retorno;
**************************************************************************/
function dd(id){
    document.getElementById(id).innerHTML = "";
}
/*Calc*/
/**************************************************************************
*   Faz o cálculo (Objeto Calculadora)
* *************************************************************************
* 
* @param val: Valor ;
* @return Sem retorno;
**************************************************************************/
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
/**************************************************************************
*   Resultado da Calculadora
* *************************************************************************
* 
* @param Sem parâmetro;
* @return Sem retorno;
**************************************************************************/
function resultCalc(){
     var calc = document.getElementById("cResult").value;
     var result, num1="", num2="", qtd = 0;
     var vet = calc.split("");
     var ini=0,fim,control = true, operador="",operador2="";
     try{
         for(var i = 0;
         i < vet.length;
         i++){
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
                         case "/": num1 = parseFloat(num1)/parseFloat(num2);
                         num2 = "";
                         break;
                         case "*": num1 = parseFloat(num1)*parseFloat(num2);
                         num2 = "";
                         break;
                         case "-": num1 = parseFloat(num1)-parseFloat(num2);
                         num2 = "";
                         break;
                         case "+": num1 = parseFloat(num1)+parseFloat(num2);
                         num2 = "";
                         break;
                         default: num1;
                    }
                }
            }
        }
         switch(operador){
             case "/": result = parseFloat(num1)/parseFloat(num2);
             break;
             case "*": result = parseFloat(num1)*parseFloat(num2);
             break;
             case "-": result = parseFloat(num1)-parseFloat(num2);
             break;
             case "+": result = parseFloat(num1)+parseFloat(num2);
             break;
             default: num1;
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
}

/**************************************************************************
*   Apaga o valor de uma calculadora
* *************************************************************************
* 
* @param id: Parâmetro de deletar;
* @return Sem retorno;
**************************************************************************/
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
/**************************************************************************
*   Conversão em HTML
* *************************************************************************
* 
* @param param: Valor a ser tratada;
* @return: Valor tratado;
**************************************************************************/
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
        ret = ret.replace("","&quot;");
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
/**************************************************************************
*   Navegação do calendário para o próximo mês
* *************************************************************************
* 
* @param id: ID do mês atual;
* @param data: Data para tratar;
* @param funct: Função a ser chamado;
* @return: Botão tratado;
**************************************************************************/
function botaoProximo(id,data,funct) {
    var dat = data.split("/" );
    var mes = (parseInt(dat[1]) + 1) > 12 ? 1 : (parseInt(dat[1]) + 1);
    var ano = (parseInt(dat[1]) + 1) > 12 ? (parseInt(dat[2]) + 1) : dat[2];
    var novaData = "1/" + mes + "/" + ano;
    return "<input type='button' id='btpxcalendatio' value='Proximo"+String.fromCharCode(9658)+"' onclick='Javascript:RCS.htmlCalendar("+id+","+ novaData + ","+ funct + ");'>";
};
/**************************************************************************
*   Navegação do calendário para o mês anterior
* *************************************************************************
* 
* @param id: ID do mês atual;
* @param data: Data para tratar;
* @param funct: Função a ser chamado;
* @return: Botão tratado;
**************************************************************************/
function botaoAnterior(id,data,funct) {
       var dat = data.split("/" );
       var mes = (parseInt(dat[1]) - 1) < 0 ? 12 : (parseInt(dat[1]) - 1);
       var ano = (parseInt(dat[1]) - 1) < 0 ? (parseInt(dat[2]) - 1) : dat[2];
       var novaData = "1/" + mes + "/" + ano;
       return "<input type='button' id='btancalendatio' value='"+String.fromCharCode(9668)+"Anterior' onclick='Javascript:RCS.htmlCalendar("+id+","+ novaData + ","+ funct + ");'>";
};
/**************************************************************************
*   Navegação do calendário para o mês atual
* *************************************************************************
* 
* @param id: ID do mês atual;
* @param funct: Função a ser chamado;
* @return: Botão tratado;
**************************************************************************/
function botaoHoje(id,funct){
    var data = new Date();
    var mes = data.getMonth() + 1;
    var ano = data.getFullYear();                    
    var novaData = "1/"+mes+"/" +ano;                       
    return "<input type='button' id='bthjcalendatio' value='"+String.fromCharCode(9632)+"' onclick='Javascript:RCS.htmlCalendar("+id+","+novaData+ ","+ funct + ");'>";
};
/**************************************************************************
*   Traz o nome do dia da semana 
* *************************************************************************
* 
* @param dia: Número do dia da semana;
* @return: Nome do dia da semana;
**************************************************************************/
function diaDaSemanaExtenso(dia) {
    var semana = new Array("Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado");
    return semana[dia];
};
/**************************************************************************
*   Traz o nome do mês
* *************************************************************************
* 
* @param mes: Número do mês;
* @return: Nome do mês;
**************************************************************************/
function mesExtenso(mes) {
    var meses = new Array("Janeiro", "Fevereiro", "Março" , "Abril" , "Maio", "Junho", "Julho" , "Agosto" , "Setembro" , "Outubro" , "Novembro", "Dezembro");
    return meses[mes];
};
/**************************************************************************
*   Traz o último dia do mês
* *************************************************************************
* 
* @param mes: Número do mês;
* @param ano: Ano;
* @return: Último dia do mês;
**************************************************************************/
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
/**************************************************************************
*   Valida se o valor 1 é maior que o valor 2
* *************************************************************************
* 
* @param val1: Valor a ser comparado;
* @param val2: Valor a ser comparado;
* @return: Boolean;
**************************************************************************/
    alfMax:function(val1, val2){
            var vm1 = val1.toString().split().length;
            var vm2 = val2.toString().split().length;
            var ct = (vm1 < vm2)?vm1:vm2;
            val1 = val1.toString();
            val2 = val2.toString();

        for(var i=0; i< ct; i++){
            if((val1[i]).toString().charCodeAt(0) < (val2[i]).toString().charCodeAt(0)){
                return true;
            }
        }

        return false;
    },    
/**************************************************************************
*   Aparece uma menssagem em um Input
* *************************************************************************
* 
* @param idInput: ID do Input;
* @param id: ID do alt;
* @param msg: Mensagem;
* @return Sem retorno;
**************************************************************************/
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
/**************************************************************************
*   Fecha o A menssagem tipo Alt
* *************************************************************************
* 
* @param Sem parâmetro;
* @return Sem retorno;
**************************************************************************/
  altClose:function(){
      RCS.infoLoadClose();
  },
/**************************************************************************
*   Calcula 2 horários
* *************************************************************************
* 
* @param id1: ID do Primeiro Input (Valor);
* @param id2: ID do Segundo Input (Valor);
* @param idResp: ID do Input do Resultado do Cálculo (Valor);
* @param menos: Indica soma ou subtração (Boolean)
* @return: Retorno do resultado do Cálculo
**************************************************************************/
   calcHour:function(id1,id2,idResp,menos){
     var hs1 = document.getElementById(id1).value.split(':');
     var hs2 = document.getElementById(id2).value.split(':');
     var horas = 0, minutos = 0, result;
     if(hs1.length != 2){
         return false;
    }
     if (hs1.length != 2) {
         return false;
    }
     if(hs2.length != 2){
         hs2 = ["00",val2];
    }
     if (menos || menos == true) {
         minutos = parseInt(hs1[1]) - parseInt(hs2[1]);
         if (parseInt(hs1[1]) < parseInt(hs2[1])) {
             loop = parseInt(parseInt(hs2[1] / 61)) + 1;
             for (var i = 0; i < loop; i++) {
                 minutos = minutos + 60;
                 horas--;
            }
        }
         horas = (parseInt(hs1[0]) - parseInt(hs2[0])) + horas;
    }
     else {
         minutos = parseInt(hs1[1]) + parseInt(hs2[1]);
         loop = parseInt(minutos / 60);
         for (var i = 0; i < loop; i++) {
             minutos = minutos - 60;
             horas++;
        }
         horas = horas + parseInt(hs1[0]) + parseInt(hs2[0]);
    }
     result = ((horas < 10) ? "0" + horas : horas).toString() + ":" + ((minutos < 10) ? "0" + minutos : minutos).toString();
     return result;
},
/**************************************************************************
*   Exclui as linhas vazias
* *************************************************************************
* 
* @param txt: Texto a ser tratado;
* @return: Texto tratado;
**************************************************************************/
      clearDoubleWhiteLine:function(txt){
        var vet = txt.split("\n");
        var clear = 0;

        txt = "";
        for (var i = 0; i < vet.length; i++) {
            if ((vet[i]).replace(/\t/g,"").trim() == "") {
                clear++;
            }
            else{
                clear = 0;
            }

            if (clear < 2) {
                if(i != 0){
                     txt += "\n"
                }
                txt += vet[i];
            }            
        }

        return txt;
      },
/**************************************************************************
*   Exclui as linhas vazias
* *************************************************************************
* 
* @param txt: Texto a ser tratado;
* @return: Texto tratado;
**************************************************************************/
      clearWhiteLine:function(txt){
        var vet = txt.split("\n");
        txt = "";
        for (var i = 0; i < vet.length; i++) {
            if ((vet[i]).replace(/\t/g,"").trim() != "") {
                if(i != 0){
                     txt += "\n"
                }
                txt += vet[i];
            }
        }

        return txt;
      },
/**************************************************************************
*   Cria uma criptografia de um texto
* *************************************************************************
* 
* @param param: Texto a ser criptografado;
* @return: Texto criptografado;
**************************************************************************/
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
/**************************************************************************
*   Valida se existe um caracter em uma string
* *************************************************************************
* 
* @param valor: String a ser verificada;
* @param contain: Caracter para encontrar;
* @return: Boolean;
**************************************************************************/
  contains:function(valor, contain){
    if(valor.indexOf(contain) != -1){
         return true;
    }
    return false;
  },  
/**************************************************************************
*   Valida se existe um valor em um vetor
* *************************************************************************
* 
* @param vet: Vetor a ser verificado;
* @param val: Valor para encontrar;
* @return: Boolean;
**************************************************************************/
  containsVet:function(vet,val){
      for(var i=0; i<vet.length; i++){    
        if(vet[i] == val){
          return true;
        }
      }
      return false;
    },
/**************************************************************************
*   Copia as informações na memória temporária do Computador
* *************************************************************************
* 
* @param id: ID do Input;
* @return Sem retorno;
**************************************************************************/
    copyClipboard:function(id) {
      var copyText = document.getElementById(id);
      copyText.select();
      copyText.setSelectionRange(0, 99999)
      document.execCommand("copy");
    },
/**************************************************************************
*   Transforma um CSV em comandos SQL Insert
* *************************************************************************
* 
* @param tabela: Nome da tabela (SQL);
* @param csv: Conteúdo CSV;
* @return: Texto tratado;
**************************************************************************/
    csvTOinsert:function(tabela,csv){
        var vet = csv.replace(/[\;]/g, ",").split("\n");
        var insert = "insert into "+tabela+" ({col}) values ({val})";
        var code = "";
        
        if(vet.length > 1){
          insert = insert.replace('{col}',vet[0]);

          for(var i=1; i<vet.length;i++){
            var rows = (vet[i]).split(",");
            var val = "";
            for(var x=0; x<rows.length;x++){
                if((!isNaN(rows[x]) &&  rows[x] != '') || (rows[x]).toUpperCase() == "NULL" ){
                    val += rows[x] +",";
                }
                else{
                    val += "'"+ rows[x] +"',";
                }
            }
            val = val.substring(0, val.length -1);
            code += insert.replace('{val}',val) + "\r\n";                                                
          }
        }

      return code;
    },
/**************************************************************************
*   Decodifica um texto que foi codificado com a função "codec"
* *************************************************************************
* 
* @param param: Texto a ser decodificado;
* @return: Texto decodificado;
**************************************************************************/
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
/**************************************************************************
* 	Cria um efeito de Digitação
* *************************************************************************
* 
* @param id: ID do objeto;
* @param tipo: Tipo de Objeto (1=Inputs, 2=Divs);
* @param message: Mensagem que irá aparecer;
* @return Sem retorno;
**************************************************************************/
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
/**************************************************************************
*   Fecha a mensagem de informação
* *************************************************************************
* 
* @param Sem parâmetro;
* @return Sem retorno;
**************************************************************************/
  infoLoadClose:function(){
        var id = document.getElementById("idLoad").value;
        document.getElementById(id).innerHTML = "";
  },  
/**************************************************************************
*   (Des)abilita os valores do objeto Select que não foi selecionado
* *************************************************************************
* 
* @param id: ID do select;
* @param dis: Valor booleano (Des)abilita;
* @return Sem retorno;
**************************************************************************/
    disableSelect:function(id, dis){
            var x = document.getElementById(id);
            for (var i = 0; i < x.length; i++) {
                if (x[i].selected != true) {
                    x[i].disabled = dis;
                }
            }
        },
/**************************************************************************
*   Converte um número tipo Float em formato de Dinheiro (String)
* *************************************************************************
* 
* @param val: Valor a ser tratado (Float);
* @return: Valor tratado (String);
**************************************************************************/
    floatToMoney:function(val){
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
/**************************************************************************
*   Retorna a data atual (00/00/0000)
* *************************************************************************
* 
* @param Sem parâmetro;
* @return: Data formato Pt-Br 00/00/000;
**************************************************************************/
    getDate:function(){
         var today = new Date();
         var year = today.getFullYear();
         var month = today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
         var day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
         var dtAtual = (day + '/' + month + '/' + year);
         return dtAtual;
    },
/**************************************************************************
*   Retorna a descrição de um objeto select
* *************************************************************************
* 
* @param id: ID do select;
* @return: Descrição do select selecionado;
**************************************************************************/
    getDescSelect:function(id){
         var x = document.getElementById(id);
         for (var i = 0; i < x.length; i++) {
             if (x[i].selected == true) {
                 return x[i].innerHTML;
            }
        }
         return "";
    },
/**************************************************************************
*   Retorna apenas os números em uma String
* *************************************************************************
* 
* @param val: Valor a ser Tratado;
* @return: Valor tratado;
**************************************************************************/
    getNumber:function(val){
            var ret = "";
            for(var i=0; i < val.length; i++){
                if(!isNaN(val[i])){
                    ret += val[i];
                }
            }            
            return ret;
    },
/**************************************************************************
*   Retorna o Horário Atual
* *************************************************************************
* 
* @param Sem parâmetro;
* @return: Horário atual;
**************************************************************************/
    getTime:function(){
        var today = new Date();
        var minute = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
        var hour = today.getHours() < 10 ? '0' + today.getHours() : today.getHours();
        var horas = (hour + ':' + minute);  
        return horas;  
    },
/**************************************************************************
*   Retorna o valor de um objeto checkbox
* *************************************************************************
* 
* @param parname: Nome do objeto;
* @return: Valor do checkbox selecionado;
**************************************************************************/
     getValueChecked:function(parname){
          var x = document.getElementsByName(parname); 
          for (var i = 0; i < x.length; i++) {
              if (x[i].checked == true) { 
                  return x[i].value;
              }
          }
          return "";
      },        
/**************************************************************************
*   Retorna uma lista de valores de um objeto checkbox
* *************************************************************************
* 
* @param parname: Nome do objeto;
* @return: Lista de valor do select selecionado;
**************************************************************************/
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
/**************************************************************************
*   Retorna uma lista de valores de um objeto select multiplo
* *************************************************************************
* 
* @param id: ID do select;
* @return: Lista de valor do select selecionado;
**************************************************************************/
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
/**************************************************************************
*   Retorna o valor de um objeto select
* *************************************************************************
* 
* @param id: ID do select;
* @return: Valor do select selecionado;
**************************************************************************/
    getValueSelect:function(id){
            var x = document.getElementById(id);    
            for (var i = 0; i < x.length; i++) {
                if (x[i].selected == true) {
                    return x[i].value;
                }
            }
            return "";
     },
/**************************************************************************
*   Valida se o navegador suporta o HTML5
* *************************************************************************
* 
* @param tpObg: Tipo de Input HTML5;
* @return: Boolean;
**************************************************************************/
     html5InputSuported:function(tpObg){
           var suportedDate = true;
           var testElement=document.createElement("input");
           testElement.setAttribute("type", tpObg); 
           if (tpObg != "text" && testElement.type=="text"){ 
                 suportedDate = false;
           } 
           return suportedDate;
     },
/**************************************************************************
*   Apresenta uma calculadora em HTML
* *************************************************************************
* 
* @param idConstr: ID da div;
* @param idReturn: ID do Input que irá o resultado do cálculo;
* @return Sem retorno;
**************************************************************************/
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
          
        document.getElementById(idConstr).innerHTML = slot;
        document.getElementById("cReturn").value = idReturn;
  },
/**************************************************************************
*   Insere um calendário em uma div
* *************************************************************************
* 
* @param idCalendar: ID da div;
* @param dat: Data inicial do calendário;
* @param func: Função a ser chamada após a criação;
* @return: Mês e o ano atual (00-0000);
**************************************************************************/
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
/**************************************************************************
*   Insere um calendário minimalista em uma div
* *************************************************************************
* 
* @param idCalendar: ID da div;
* @param func: Função a ser chamada após a criação;
* @return: Mês e o ano atual (00-0000);
**************************************************************************/
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
/**************************************************************************
*   Editor de HTML para teste
* *************************************************************************
* 
* @param id: ID da Div que ira ser incementado o Popup;
* @return Sem retorno;
**************************************************************************/
     htmlExpress:function(id){
        var html = "<div id='htmlExpress'><label id='heLb'>HTML Express: </label><button id='heBt' onclick=dd('"+id+"');>X</button><hr><textarea id='heText' rows='6' onkeypress='cc();' onkeyup='cc();'></textarea><div id='heDiv'></div></div>";
        document.getElementById(id).innerHTML = html;
     },                
/**************************************************************************
*   Cria um arquivo CSV de uma tabela em HTML
* *************************************************************************
* 
* @param filename: Nome do arquivo;
* @param idTable: ID da div que contém a tabela;
* @return Sem retorno;
**************************************************************************/
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
/**************************************************************************
*   Insere um relógio em uma div
* *************************************************************************
* 
* @param id: ID da div;
* @param icon: Ativa o icone (Boolean);
* @return Sem retorno;
**************************************************************************/
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
/**************************************************************************
*   Popup de Mensagem de erro/info
* *************************************************************************
* 
* @param id: ID da div base;
* @param msg: Mensagem a ser exibida;
* @param tipo: Tipo de mensagem;
* @return Sem retorno;
**************************************************************************/
  info:function(id,msg,tipo){
      var tp,titulo,cd;
      switch(tipo){
           case "erro":
           case "e":
           case "d":
               tp = "erro";
               titulo = " - Erro";
               cd = 10008;
               break; 
           case "warn": 
           case "w":
               tp = "warn";
               titulo = " - Atenção";
               cd = 9888;
               break;
           case "sucess":
           case "s":
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
/**************************************************************************
*   Mostra uma mensagem de informação 
*   (Usado quando está carregando alguma informação)
* *************************************************************************
* 
* @param id: ID da div;
* @param msg: Mensagem a ser exibida;
* @return Sem retorno;
**************************************************************************/
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
/**************************************************************************
*   Fecha a mensagem de informação
* *************************************************************************
* 
* @param Sem parâmetro;
* @return Sem retorno;
**************************************************************************/
  infoLoadClose:function(){
        var id = document.getElementById("idLoad").value;
        document.getElementById(id).innerHTML = "";
  },
/**************************************************************************
*   Insere em um objeto a data atual e o status de desabilitado
* *************************************************************************
* 
* @param id: ID do Objeto;
* @param disabled: Bollean;
* @return Sem retorno;
**************************************************************************/
    inputSetDate:function(id,disabled){
         var today = new Date();
         var year = today.getFullYear();
         var month = today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
         var day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
         var dtAtual = (day + '/' + month + '/' + year);              
         document.getElementById(id).value = dtAtual; 
         document.getElementById(id).disabled = disabled; 
    },
/**************************************************************************
*   Insere em um objeto o horário atual e o status de desabilitado
* *************************************************************************
* 
* @param id: ID do Objeto;
* @param disabled: Bollean;
* @return Sem retorno;
**************************************************************************/
    inputSetTime:function(id,disabled){
        var today = new Date();
        var minute = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
        var hour = today.getHours() < 10 ? '0' + today.getHours() : today.getHours();
        var horas = (hour + ':' + minute);              
        document.getElementById(id).value =horas;             
        document.getElementById(id).disabled = disabled;  
    },
/**************************************************************************
*   Inverte o valor de uma string
* *************************************************************************
* 
* @param param: Valor a ser tratado;
* @return: Valor tratado;
**************************************************************************/
    invertString:function(param){
        var txt="";
        var vet = param.split("");
        for(var i=(vet.length-1); i>-1; i--){
                txt += vet[i]; 
        }                    
        return txt;
    },
/**************************************************************************
*   Validação CNPJ
* *************************************************************************
* 
* @param param: CNPJ a ser validado;
* @return: Objeto de erro (message = Mensagem de erro, semErro = Boolean);
**************************************************************************/
  isCNPJ:function(param){
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
/**************************************************************************
*   Validação de CPF
* *************************************************************************
* 
* @param val: CPF a ser validade;
* @return: Objeto de erro (message = Mensagem de erro, semErro = Boolean);
**************************************************************************/
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
/**************************************************************************
*   Valida se o valor é nulo ou vazio
* *************************************************************************
* 
* @param val: Valor a ser validado;
* @return: Booleam;
**************************************************************************/
    isNullOrEmpty:function(val){
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
/**************************************************************************
*   Trata a máscara do de acordo com uma referência
* *************************************************************************
* 
* @param id: ID do objeto;
* @param mask: Referência (Obs: XXX-0000)
* [a = Alfanumérico, x = Letras, 0 = Número, A/X = Tem a mesma função mas com Upper Case]
* @return Sem retorno;
**************************************************************************/
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
           console.error("Erro: " + e.message);
        }
      },
/**************************************************************************
*   Trata a máscara formato de dinheiro
* *************************************************************************
* 
* @param id: ID do objeto;
* @return Sem retorno;
**************************************************************************/
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
           console.error( "Erro: " + e.message);
        }
      }, 
/**************************************************************************
*   Converte um número tipo Dinheiro (String) em formato de Float
* *************************************************************************
* 
* @param val: Valor a ser tratado (String);
* @return: Valor tratado (Float);
**************************************************************************/
    moneyToFloat:function(val){
          val = val.replace(/[\.]/g, "");
          val = val.replace(",","."); 
          val = parseFloat(val);
          return val; 
    },
/**************************************************************************
*   Mostra as informações de um Html em outra aba
* *************************************************************************
* 
* @param id: ID do Form/Div;
* @param complemento: Instruções em HTML;
* @return Sem retorno;
**************************************************************************/
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
/**************************************************************************
*   Converte a data em formato Inteiro
* *************************************************************************
* 
* @param dt: Data a ser tratada;
* @return: Data tratada;
**************************************************************************/
    parseDateInt:function(dt){
      dt = dt.toString().replace("-","/").replace("-","/");
      var vet = dt.split("/"); 
      var ret = "";
            
      if((vet[0]).split("").length == 4 ){
          ret = vet[0] +""+vet[1] +""+vet[2];
      }
      else{
          ret = vet[2] +""+vet[1] +""+vet[0];
      }

      return parseInt(ret);
    },
/**************************************************************************
*   Converte a data em formato Pt-Br 00/00/0000
* *************************************************************************
* 
* @param dt: Data a ser tratada;
* @return: Data tratada;
**************************************************************************/
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
/**************************************************************************
*   Aciona o comando de print de um navegador
* *************************************************************************
* 
* @param id: ID do Form/Div;
* @param complemento: Instruções em HTML;
* @return Sem retorno;
**************************************************************************/
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
/**************************************************************************
*   Retira os espaços redundantes de uma String
* *************************************************************************
* 
* @param val: String a ser tratada;
* @return: Valor tratado;
**************************************************************************/
    retEspRed:function(val){
      var ret = "";   
      var val = val.split("");
      var bl = false;
      
      for(var i=0; i<val.length;i++){
            if(bl && val[i] == " "){
                ret += val[i];
              bl = false;
          }
          else if(val[i] != " "){
                ret += val[i];
                bl = true;
          }
      }
      
      return ret;
    },
/**************************************************************************
*   Retira os zeros a esquerda de uma string
* *************************************************************************
* 
* @param val: Valor a ser Tratado;
* @return: Valor tratado;
**************************************************************************/
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
/**************************************************************************
*   Completa caracteres a esquerda de uma string
* *************************************************************************
* 
* @param val: Valor a ser tratado;
* @param nchar: Caracter de preenchimento;
* @param rep: Total de caracteres a ser preenchido, incluindo o valor a ser tratado;
* @return: Valor tratado;
**************************************************************************/
  setCarLeft:function(val,nchar,rep){
    var vet = val.split("");
    var ret = "";
    
    if(rep > vet.length){
      for (var i = 0; i < (rep - vet.length); i++) {
          ret += nchar;
      }
    }    
    
    return ret + val;
  },
/**************************************************************************
*   Inclui um contador e limitador de caracteres em um Input
* *************************************************************************
* 
* @param obj: Objeto Input (this);
* @param qtd: Máximo de quantidades de caracteres;
* @return Sem retorno;
**************************************************************************/
    setLimitCaracter:function(obj,qtd){
      var val = obj.value;
      var idCont = 'qtdc'+obj.id;
      var calc = obj.value.length;
      if(!document.getElementById(idCont)){                      
          var element = document.createElement('input');
          element.setAttribute('type', 'text'); 
          element.setAttribute('id', idCont); 
          element.setAttribute('readonly', true); 
          element.setAttribute('class', 'limitCaracter'); 
          element.setAttribute('size', qtd.toString().length);
          obj.after(element);
      }
      var objQtd = document.getElementById(idCont);
      calc = parseInt(qtd) - calc;
      if(calc < 0){
          calc = 0;
          val = val.substring(0,parseInt(qtd));
      }
      objQtd.value = calc;
      obj.value = val;
    },
/**************************************************************************
*   Seleciona um valor no objeto checkbox
* *************************************************************************
* 
* @param prname: Nome do objeto;
* @param val: Valor a ser selecionado;
* @return Sem retorno;
**************************************************************************/
    setValueChecked:function(prname,val){
        var x = document.getElementsByName(prname);    
        for (var i = 0; i < x.length; i++) {
            x[i].checked = false;
            if (x[i].value == val) {
                x[i].checked = true;
            }
        }
     },
/**************************************************************************
*   Seleciona um valor no objeto Select
* *************************************************************************
* 
* @param id: ID do select;
* @param val: Valor a ser selecionado;
* @return Sem retorno;
**************************************************************************/
    setValueSelect:function(id,val){
            var x = document.getElementById(id);    
            for (var i = 0; i < x.length; i++) {
                x[i].selected = false;
                if (x[i].value == val) {
                    x[i].selected = true;
                }
            }
     },
/**************************************************************************
*   Seleciona um valor no objeto Select baseado na descrição
* *************************************************************************
* 
* @param id: ID do select;
* @param desc: Descrição a ser selecionado;
* @return Sem retorno;
**************************************************************************/
    setValueSelectDesc:function(id,desc){
            var x = document.getElementById(id);    
            for (var i = 0; i < x.length; i++) {
                x[i].selected = false;
                if (x[i].innerHTML == desc) {
                    x[i].selected = true;
                }
            }
     },
/**************************************************************************
*   Cria um arquivo de Texto de uma String e faz Download
* *************************************************************************
* 
* @param filename: Nome do arquivo;
* @param text: String a ser tratada;
* @return Sem retorno;
**************************************************************************/
    stringToTXT:function(filename, text) {
         var element = document.createElement('a');
         element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text)); 
         element.setAttribute('download', filename);
       
         element.style.display = 'none';
         document.body.appendChild(element);
       
         element.click();
       
         document.body.removeChild(element);         
     },
/**************************************************************************
*   Converte um texto em formato HTML (acentuações)
* *************************************************************************
* 
* @param id: ID do input;
* @return: Texto tratado;
**************************************************************************/
     textHtml:function(id){
        var vInput = document.getElementById(id).value;
        var vOutput = "";
        var vet = vInput.split("");
        for(var i=0;i<vet.length;i++){
             vOutput += convertHtml(vet[i]);   
        }
        return vOutput;
     },
/**************************************************************************
*   Converte um CSV em uma tabela HTML
* *************************************************************************
* 
* @param txt: Texto a ser convertido;
* @param divRet: ID da div de retorno;
* @return Sem retorno;
**************************************************************************/
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
/**************************************************************************
*   Valida um período de Datas
* *************************************************************************
* 
* @param dti: Data Inicial;
* @param dtf: Data Final;
* @return: Retorna se a data é válida;
**************************************************************************/
    valid2Dt:function(dti,dtf){
          var dtfi = this.parseDateInt(dti);
          var dtff = this.parseDateInt(dtf);
          
          if(dtfi > dtff){
            return false;
          }
          return true;
    },
/**************************************************************************
*   Validação de CTE
* *************************************************************************
* 
* @param valor: Chave a ser validada
* @return: Objeto de erro (message = Mensagem de erro, semErro = Boolean);
**************************************************************************/
  validChave:function(valor) {
        var valormult = "4329876543298765432987654329876543298765432"; //Valor a ser multiplicado
        var valorresmult = "0000000000000000000000000000000000000000000" ;
        var divisao=123.123;
        var resto=0,digitoV=0,digitoverificador=0,soma=0;
        var msg = {message:"", semErro:true};
        var valorJtxt = valor.split("");
        var valorMulti = valormult.split("");
        var valorResMult = valorresmult.split("");
          valor = valor.split("");
        
        if ((valor.length < 44) ||(valor.length > 44)) { // Verifica quantidade de digitos
          msg.message = "O campo deve conter 44 digitos [contêm "+valor.length+"]";
          msg.semErro = false;
          return msg;
        } 
        else {
            for (var i=0; i<43;i++){
                valorResMult[i] = valorMulti[i]*valorJtxt[i];
            }
            for (var i=0; i<43;i++){
                soma += valorResMult[i];
            }
            divisao = soma/11;
            resto = parseInt(soma) % 11;
            digitoV = 11-resto;

           if ((resto == 0) || (resto==1)){
               digitoverificador= 0;
           }
           else {
               digitoverificador=digitoV;
           }
           
           if(parseInt(digitoverificador) == parseInt(valor[valor.length - 1])){
              msg.message = "Chave Válida";
              msg.semErro = true;
              return msg;
           }
           else{
              msg.message = "Chave Inválida";
            msg.semErro = false;
              return msg;
           }
        }
    },
/**************************************************************************
*   Reorganiza um vetor
* *************************************************************************
* 
* @param vet: Vetor a ser reorganizado;
* @return: Vetor organizado;
**************************************************************************/
    vetReorg:function(vet){
            var ct = vet.length;
            var tmp;                        
            for(var i=0; i<ct;i++){
                for(var x=0; x<ct;x++){
                    if(this.alfMax(vet[i],vet[x])){
                        tmp = vet[i];
                        vet[i] = vet[x];
                        vet[x] = tmp;
                    }
                }
            }      
           return vet;
    },
/**************************************************************************
*   Lista as funções dessa biblioteca
* *************************************************************************
* 
* @param Sem parâmetro;
* @return: Lista de funções;
**************************************************************************/
    help:function(){ 
           var bk = "\r\n";
           var msg = ""       
           +'=================================== ' + bk
           +'RCS Biblioteca Javascript' + bk
           +'=================================== ' + bk
           +'- RCS.mask(id, mask);' + bk
           +'- RCS.maskMoney(id);' + bk
           +'- RCS.copyClipboard(id);' + bk
           +'- RCS.disableSelect(idInput, dis);' + bk
           +'- RCS.setValueSelect(id,valor);' + bk
           +'- RCS.setValueSelectDesc(id,desc);' + bk
           +'- RCS.setValueChecked(name,valor); ' + bk
           +'- RCS.getDescSelect(id); retorna a descrição do Option selecionado' + bk
           +'- RCS.getValueSelect(id); retorna o valor' + bk
           +'- RCS.getValueList(id); retorna um Array' + bk
           +'- RCS.getValueChecked(name); retorna o valor' + bk
           +'- RCS.getValueCheckedList(name); retorna um Array' + bk 
           +'- RCS.getTime(); retorna as horas' + bk  
           +'- RCS.getDate(); retorna uma data formato PT-BR' + bk 
           +'- RCS.parseDatePTBR(dt); retorna uma data formato PT-BR' + bk                      
           +'- RCS.parseDateInt(dt); retorna a data em inteiro "yyymmdd"' + bk
           +'- RCS.valid2Dt(dti,dtf); Valida data inicial com data final' + bk
           +'- RCS.inputSetDate(idInput,disabled);' + bk
           +'- RCS.inputSetTime(idInput,disabled);' + bk
           +'- RCS.retZeroEsq(valor); retira os zeros a esquerda' + bk
           +'- RCS.validChave(chave); valida a chave NFe, NFCe, CTe, CTe OS e MDFe' + bk
           +'- RCS.isCPF(cpf); return obj: bolean + msg' + bk
           +'- RCS.isCNPJ(cnpj); return obj: bolean + msg' + bk   
           +'- RCS.isNullOrEmpty(val); Valida se uma variável está vazia ou nula' + bk         
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
           +'- RCS.getNumber(val); retorna apenas os números de uma string;' + bk  + bk   
           +'- RCS.setLimitCaracter(obj,qtd);  Limita a quantidade de Caracteres em um elemento' + bk  + bk   
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
           +'- RCS.textTable(txt, divRet);  Transforma um texto em tabela HTML simples (separando coluna com ;)' + bk    
           +'- RCS.floatToMoney(val); Converte um número decimal (1.8) em moeda (1,80)' + bk    
           +'- RCS.moneyToFloat(val); Converte moeda (1,80) em um número decimal (1.8)' + bk   
           +'- RCS.vetReorg(vet); Reorganiza um vetor (precisa da função alfMax)' + bk
           +'- RCS.alfMax(val1,val2); Verifica se o valor1 é maior que o valor2, baseado na tabela ASSII' + bk
           + "";
           
           console.info(msg);
    }
};