$(document).ready(function(){
    $("#divfunc").append("<input class=\"btn btn-primary \" type=\"button\" value=\"ValidateForm\" onclick=\"document.getElementById('res').innerHTML = vkbeautify.css(codValidate(1));\" />" +
                     "<input class=\"btn btn-primary \" type=\"button\" value=\"EnableFields\" onclick=\"document.getElementById('res').innerHTML = vkbeautify.css(codValidate(2));\" />" +
                     "<input class=\"btn btn-primary \" type=\"button\" value=\"InsertValues\" onclick=\"document.getElementById('res').innerHTML = vkbeautify.css(codValidate(3));\" />" );
    $("#divfunc").append("<input type='button' value='readonlyNo' onclick='readonlyNo()' class='btn btn-primary '/>");
    $("#divfunc").append("<div id=\"res\"></div>");
});
/* =======================
* Criador de Validação
* =======================
* tp 1 = validateForm
* tp 2 = enableFields
* tp 3 = Captura os valores dos inputs e cria um script de insersão
* */
function codValidate(tp){
    var obj = (tp == 1)?$('[required]'):$('[name]');
    var retorno = "";
    var vetVerif = new Array();
  
    if(tp == 1){
           retorno += "function validateForm(form){ <br />";
           retorno += "var msg = \"\";<br />";
           retorno += "var txtBreak = form.getMobile()?\"\r\n\":\"&lt;br /&gt;\";<br />";
           retorno += "var txtLine = form.getMobile()?\" &lt;br /&gt; \":\"&lt;hr /&gt;\";<br />";
    }
    else if(tp == 2){
        retorno += "function enableFields(form){  <br />";
    }
    retorno += "var act = getValue('WKNumState'); <br />";
    retorno += "var ini = ( act == 0 || act == 4 ); <br />";
    
    for(var i=0; i < obj.length; i++){
        if(obj[i].name != undefined && obj[i].name != "form"){
            if(!isVet(vetVerif,obj[i].name)){
                if(tp == 1){
                      if(obj[i].type == "text" || obj[i].type == "textarea" || obj[i].type == "number"){
                            retorno += "if( form.getValue(\""+obj[i].name+"\") == \"\" ){ msg += \"Campo '"+obj[i].title+"' não pode ser vazio.\" + txtBreak; } <br />";
                      }
                      else{
                            retorno += "if( form.getValue(\""+obj[i].name+"\") == \"\" ){ msg += \"Selecione uma alternativa no campo '"+obj[i].title+"'.\" + txtBreak; } <br />";              
                      }
                }
                else if(tp == 2){
                      retorno += "form.setEnabled(\""+obj[i].name+"\", false); <br />";
                }
                else{
                  retorno += "$('[name=\""+obj[i].name+"\"]').val(\""+$('[name="'+obj[i].name+'"]').val()+"\"); <br />";
                }
            }
        }
    }
   
    if(tp == 1){
        retorno += "if(msg != \"\"){ <br />";  
        retorno += "throw txtLine + msg + txtLine; <br />";
        retorno += "} <br />"; 
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