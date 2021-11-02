$(document).ready(function(){    
  $("#btCriar").click(function(){
      var params = $("#txtNome").val() 
              +";"+$("#selType").val()
              +";"+$("#txtCod").val()  
              +";"+$("#txtValue").val() 
              +";"+$("#txtPlace").val() 
              +";"+$("#txtTitle").val() 
              +";"+$("#txtTaman").val()
              +"\n";
      var txt = $("#txtTable").val() + params;
      $("#txtTable").val(txt);
      createInputs(txt,'divTeste','divTeste2');
  });
  
  
RCS.htmlExpress("divInfo");
});
function createInputs(txt, divRet, txtRet){
  /* param txt = nome, type, id/name, value, placeholder, title, tamanho */
  if(txt == ""){
    return;
  }
  var row = txt.split("\n");
  var total = row.length;
  var column,val,sum = 0,line=true,line2=false,tamanho=0;
  var table = '<div class="fluig-style-guide"><form name="form" role="form">';
  try{
    for(var i=0;i<total;i++){
      column = row[i].toString().split(";");
      if(column.length == 7){
        tamanho = ((column[6]).toString() == "")?2:parseInt(column[6]);
        sum += tamanho;
        if(sum > 12 ){
          line2 = true;
          table += '</div>';
          sum = parseInt(column[6]);
          line=true;
        }
        if(line == true){
          table += '<div class="form-group row">';
          line=false;
        }
        console.info("sum: "+sum);
        table += '<div class="col-md-'+tamanho+'">';
        table += '<label for="'+column[2]+'">'+column[0]+':</label>';
        if(column[1] == "select"){
          table += '<select class="form-control" id="'+column[2]+'" name="'+column[2]+'" title="'+column[5]+'" />';
          val = column[3].toString().split("|");
          for(var x=0;x < val.length;x++){
            table += '<option value="'+val[x]+'">'+val[x]+'</option>';
          }
          table += '</select>';
        }
        else if(column[1] == "textarea"){
          table += '<textarea class="form-control" rows="6" id="'+column[2]+'" name="'+column[2]+'" placeholder="'+column[4]+'" title="'+column[5]+'" >'+column[3]+'</textarea>';
        }
        else{
          table += '<input type="'+column[1]+'" class="form-control" id="'+column[2]+'" name="'+column[2]+'" value="'+column[3]+'" placeholder="'+column[4]+'" title="'+column[5]+'" />';
        }
        table += '</div>';
        if((i+1) == total){
          table += '</div>';
        }
      }
    }
    table += '</form></div>';
    document.getElementById(divRet).innerHTML = table;
    document.getElementById(txtRet).value = table;
  }
  catch(e){
    alert("Erro: " + e.message);
  }
};
