/*$(document).ready(function(){
    $("#divfunc").append("<input class=\"btn btn-primary \" type=\"button\" value=\"ValidateForm\" onclick=\"document.getElementById('res').innerHTML = vkbeautify.css(codValidate(1));\" />" +
                     "<input class=\"btn btn-primary \" type=\"button\" value=\"EnableFields\" onclick=\"document.getElementById('res').innerHTML = vkbeautify.css(codValidate(2));\" />" +
                     "<input class=\"btn btn-primary \" type=\"button\" value=\"InsertValues\" onclick=\"document.getElementById('res').innerHTML = vkbeautify.css(codValidate(3));\" />" );
    $("#divfunc").append("<input type='button' value='readonlyNo' onclick='readonlyNo()' class='btn btn-primary '/>");
    $("#divfunc").append("<div id=\"res\"></div>");
});*/
/* =======================
* Criador de Validação
* =======================
* tp 1 = validateForm
* tp 2 = enableFields
* tp 3 = Captura os valores dos inputs e cria um script de insersão
* */
function codValidate(tp){
    var obj = (tp == 1)?$('#formCreate  [required]'):$('#formCreate [name]');
    var retorno = "";
    var vetVerif = new Array();
  
    if(tp == 1){
           retorno += "function validateForm(form){ \n";
           retorno += "var msg = \"\";\n";
           retorno += "var txtBreak = form.getMobile()?\"\r\n\":\"<br />\";\n";
           retorno += "var txtLine = form.getMobile()?\" <br /> \":\"<hr />\";\n";
    }
    else if(tp == 2){
        retorno += "function enableFields(form){  \n";
    }
    if (tp != 3) {
        retorno += "var act = getValue('WKNumState'); \n";
        retorno += "var ini = ( act == 0 || act == 4 ); \n";
    }
    for(var i=0; i < obj.length; i++){
        if(obj[i].name != undefined && obj[i].name != "form"){
            if(!isVet(vetVerif,obj[i].name)){
                if(tp == 1){
                    if (obj[i].id == "txtEmai") {
                        retorno += "var rgxEmail = new RegExp(/\\S+@\\S+\\.\\S+/);";
                    }
                    else if (obj[i].id == "txtCNPJ") {
                        retorno += "var rgxCNPJ = new RegExp(/^[0-9]{2}.[0-9]{3}.[0-9]{3}\/[0-9]{4}-[0-9]{2}$/ );";                        
                    }

                    if(obj[i].type == "text" || obj[i].type == "textarea" || obj[i].type == "number"){
                          retorno += "if( form.getValue(\""+obj[i].name+"\") == \"\" ){ msg += \"Campo '"+obj[i].title+"' não pode ser vazio.\" + txtBreak; } \n";
                    }
                    else{
                          retorno += "if( form.getValue(\""+obj[i].name+"\") == \"\" ){ msg += \"Selecione uma alternativa no campo '"+obj[i].title+"'.\" + txtBreak; } \n";              
                    }
                    
                    if (obj[i].id == "txtEmai") {
                        retorno += "else if( form.getValue(\"txtEmail\" ).match(rgxEmail) == null ){msg += \"Campo 'Email' com valor inválido; \" + txtBreak; }";
                    }
                    else if (obj[i].id == "txtCNPJ") {
                        retorno += "else if( form.getValue(\"txtCNPJ\" ).match(rgxCNPJ) == null ){msg += \"Campo CNPJ com valor inválido; \" + txtBreak; }";
                    }
                }
                else if(tp == 2){
                      retorno += "form.setEnabled(\""+obj[i].name+"\", ini); \n";
                }
                else{
                  //retorno += "$('[name=\""+obj[i].name+"\"]').val(\""+$('[name="'+obj[i].name+'"]').val()+"\"); \n";
                  retorno += "<item><item>"+obj[i].name+"</item><item>"+$('[name="'+obj[i].name+'"]').val()+"</item></item> \n";
                  //retorno += "<item><item>"+obj[i].name+"</item><item>"+obj[i].name+"</item></item>";
                }
            }
        }
    }
   
    if(tp == 1){
        retorno += "if(msg != \"\"){ \n";  
        retorno += "throw txtLine + msg + txtLine; \n";
        retorno += "} \n"; 
        retorno += "}"; 
    }
    else if(tp == 2){
          retorno += "}"; 
    }
  
    return retorno;
}
// Teste - Retira o readonly
function readonlyNo(){
      var obj = $('[name]');
      var hidden = $('[type="hidden"]');
      $("[value='Novo']").show();
      $("[value='Inserir']").show();
      $('.fluigicon.fluigicon-trash.fluigicon-md').show();
      $("th").removeAttr("style");
      $("td").removeAttr("style");
     
      for(var x=0; x < hidden.length; x++){
            hidden[x].type = "text";
      }
     
      for(var i=0; i < obj.length; i++){
            $("#"+obj[i].id).removeAttr("readonly");
            $("#"+obj[i].id).removeAttr("disabled");
      }

}


function isVet(vet,val){
    for(var i=0;i<vet.length;i++){
       if(vet[i] == val){
          return true;
       }
    }
    vet.push(val);
    return false;
}