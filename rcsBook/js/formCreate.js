$(document).ready(function(){    
    $("#btCopi").click(function(){
        RCS.copyClipboard("txtCodCreator");
    });
});
/***************************************************************************
 * Criador de Formulário
 * *************************************************************************
 * 
 * @param txt = Instruções separado por ; (Nome; Type; ID/Name; Value; Placeholder (c = Copia o Title); Readonly (1); Obrigatorio(1); Tamanho)
 * @param divRet = ID da div que vai aparecer o Formulário em HTML
 * @param txtRet = ID do Input que irá receber o código HTML
 * @param txtTitle = Valor do Input com o Título do Panel
 * @return Sem Retorno
 **************************************************************************/
function createInputs(txt, divRet, txtRet, txtTitle) {
    if (txt == "") {
        return;
    }

    var row = txt.split("\n");
    var total = row.length;
    var column,
        val,
        sum = 0,
        line = true,
        line2 = false, 
        tamanho = 0;
    var table = '';//'<div class="fluig-style-guide"><form name="form" role="form">';
    var attr = "";
    var idName = "";
    var titName = "";
    var nclass = "";
    var obr = "";
    var isObr = false;
    var isSelect = false;
    var vetTitle = txtTitle.split(";");   

    try {
        if (txtTitle != null && txtTitle != "" && vetTitle.length == 2) {
            table += (vetTitle[0] == "f")?'<fieldset><legend>':'<div class="panel panel-primary"><div class="panel-heading"><center><h2 class="fs-no-margin">';
            table += vetTitle[1];
            table += (vetTitle[0] == "f")?'</legend>':'</h2></center></div><div class="panel-body" >';
        }
        for (var i = 0; i < total; i++) {
            column = row[i].toString().split(";");

            if (column.length == 8) {
                var objNome = column[0];
                var objType  = column[1];
                var objIDName = column[2];
                var objValue  = column[3];
                var objPlaceholder = column[4];
                var objReadonly = column[5];
                var objObrigatorio = column[6];
                var objTamanho = column[7];

                tamanho = objTamanho.trim() == "" ? 2 : parseInt(objTamanho);
                sum += tamanho;
                //console.info("soma: "+soma);
                if (sum > 12) {
                    line2 = true;
                    table += "</div>";
                    sum = parseInt(objTamanho);
                    line = true;
                }
                if (line == true) {
                    table += '<div class="form-group row">';
                    line = false;
                }

                objType = objType == "" ? "text" : objType;
                idName = objIDName != "" ? objIDName : nameSugeri(objType, objNome.trim());
                titName = clearString(objNome.trim());
                obr = "";
                obr += objReadonly != 1 && objObrigatorio == 1 ? " req" : "";

                if (obr != "") {
                    isObr = true;
                }

                table += '<div class="col-md-' + tamanho + '">';
                table += (objType == "button" || objType == "msg")?'':'<label for="' + idName + '" ' + obr + ">" + objNome + ":</label>";

                if (objPlaceholder == "c" && objReadonly != 1) {
                    objPlaceholder = "Digite o " + titName + " aqui!";
                }

                attr = "";
                attr += objValue == "" || objType == "select" || objType == "checkbox" || objType == "radio" || objType == "button" ? "" : ' value="' + objValue + '"';
                attr += objType == "button" ? ' value="' + objNome + '"' : "";
                attr += objPlaceholder == "" ? "" : ' placeholder="' + objPlaceholder + '"';
                attr += objType != "email" ? "" : ' placeholder="email@email.com.br"';
                attr += objType != "money" ? "" : ' placeholder="000.000,00" maskmoney';
                attr += objNome != "CNPJ" ? "" : ' placeholder="00.000.000/0000-00" mask="00.000.000/0000-00"';
                attr += objNome != "CPF" ? "" : ' placeholder="000.000.000-00" mask="000.000.000-00"';
                attr += objNome != "CEP" ? "" : ' placeholder="00000-000" mask="00000-000"';
                attr += objNome != "RG" ? "" : ' placeholder="00.000.000-0" mask="00.000.000-0"';
                attr += objType != "placa" ? "" : ' placeholder="XXX-0000" mask="XXX-0000"';
                attr += objReadonly != 1 ? "" : ' readonly="readonly"';
                attr += objObrigatorio == 1 && objReadonly != 1 ? ' required="required"' : "";

                if (objType == "radio" || objType == "checkbox") {
                    val = objValue.toString().split("|");
                    if(val.length == 2){
                        table += '<div class="form-group row">';    
                    }
                    for (var x = 0; x < val.length; x++) {
                        if (val[x] != "") {
                            if(val.length == 2){
                                table += '<div class="col-md-6">';    
                            }
                            table += '<div class="input-group"> ';
                            table += '<span class="input-group-addon"> ';
                            table += '<input type="'+objType+'" id="' + idName + '" name="' + idName + '"' + attr + ' value="' + val[x] + '" title="' + titName + '" />';
                            table += "</span> ";
                            table += '<label class="form-control">' + val[x] + "</label>";
                            table += "</div>";
                            if(val.length == 2){
                                table += '</div>';    
                            }
                        }
                    }
                    if(val.length == 2){
                        table += '</div>';    
                    }
                } else if (objType == "select") {
                    isSelect = true;
                    table += '<select class="form-control" id="' + idName + '" name="' + idName + '"' + attr + ' title="' + titName + '" >';
                    val = objValue.toString().split("|");
                    for (var x = 0; x < val.length; x++) {
                        if (val[x] == "") {
                            table += '<option value="" readonly="readonly" selected="selected" >Selecione</option>';
                        } else {
                            table += '<option value="' + val[x] + '">' + val[x] + "</option>";
                        }
                    }
                    table += "</select>";
                } else if (objType == "textarea") {
                    table += '<textarea class="form-control" rows="6" id="' + idName + '" name="' + idName + '"' + attr + ' title="' + titName + '" >' + objValue + "</textarea>";

                } else if (objType == "msg") {
                    table += getDivMensage(objIDName,objNome,objValue);
                } 
                else {
                    nclass = objType == "button" ? "btn btn-" : "form-control";
                    if(objType == "button"){
                        switch (objValue) {
                                case "p":
                                    nclass += "primary"
                                    break;
                                case "i":
                                    nclass += "info";
                                    break;
                                case "d":
                                    nclass += "danger";
                                    break;
                                case "w":
                                    nclass += "warning";
                                    break;
                                case "s":
                                    nclass += "success";
                                    break;
                                default:
                                    nclass += "default";
                                    break;
                            }
                    }
                    var typedef = '';
                    if(objType == "date" || objType == "time"){
                        table += '<div class="input-group enable-calendar">';  
                    }
                    else if(objType == "placa"){
                        typedef = 'text';
                    }
                    else if(objType == "email"){
                        table += '<div class="input-group"><span class="input-group-addon">@</span>';   
                        typedef = 'text';
                    }
                    else if(objType == "money"){
                        table += '<div class="input-group"><span class="input-group-addon">R$</span>';   
                        typedef = 'text';
                    }
                    else if (objType == "kg"){
                        table += '<div class="input-group"><span class="input-group-addon">Kg</span>';    
                        typedef = 'number';     
                    }

                    typedef = (typedef != '')?typedef:objType;
                    table += '<input type="' + typedef + '" class="' + nclass + '" id="' + idName + '" name="' + idName + '"' + attr + ' title="' + titName + '" />';
                    
                    if(objType == "date"){
                        table += '<span class="input-group-addon fs-cursor-pointer"> <span class="fluigicon fluigicon-calendar"></span></span></div>';  
                    }
                    else if(objType == "time"){
                        table += '<span class="input-group-addon fs-cursor-pointer"> <span class="fluigicon fluigicon-time"></span></span></div>';  
                    }
                    else if(objType == "email" || objType == "money" || objType == "kg"){
                        table += '</div>';   
                    }
                }

                table += "</div>";

                if (i + 1 == total) {
                    table += "</div>";
                }
            } else {
                table += '</div><div class="form-group row">';
                sum = 0;
            }
        }
        if (txtTitle != null && txtTitle != "" && vetTitle.length == 2) {
            table += (vetTitle[0] == "f")?'</fieldset>':'</div></div>';
        }

        //table += "</form></div>";

        if (isObr || isSelect || vetTitle.length == 2 && vetTitle[0] == "f") {
            table += "<style>";
        }
        if (isObr) {
            table += "[req]:after {";
            table += '  content: " *" !important;';
            table += "  color: red !important;";
            table += "}";
        }
        if (isSelect) {
            table += "select [readonly]{";
            table += "  display: none;";
            table += "}";
        }

        if (vetTitle.length == 2 && vetTitle[0] == "f") {
            table += "legend{";
            table += "  color: #CB4921 !important;";
            table += "}";
        }

        //if (obr != "" || isSelect || vetTitle.length == 2 && vetTitle[0] == "f") {
        if (isObr || isSelect || vetTitle.length == 2 && vetTitle[0] == "f") {
            table += "</style>";
        }
        
        document.getElementById(divRet).innerHTML = table;
        document.getElementById(txtRet).value = vkbeautify.xml(table);
    } catch (e) {
        alert("Erro: " + e.message);
    }
}    
function getDivMensage(tp,tt,bd){
    switch (tp) {
            case "p":
                tp =  "primary"
                break;
            case "i":
                tp =  "info";
                break;
            case "d":
            case "e":
                tp =  "danger";
                break;
            case "w":
                tp =  "warning";
                break;
            case "s":
                tp =  "success";
                break;
            default:
                tp = "default";
                break;
        }
    return '<div class="hideLastTD">'
        +'<div class="alert alert-'+tp+'" role="alert">'
        +'<center>'
        +'<big>'
        +'<b>'
        + tt
        +'</b></big><br>'
        + bd
        +'</center>'
        +'</div>'
        +'</div>';

}
/***************************************************************************
 * Limpa uma String 
 * *************************************************************************
 * 
 * @param name = Input Name
 * @return nome tratado
 **************************************************************************/
function clearString(name) {
    return name.replace(/<(.*?)>/g, "").replace(/(.*?)/g, "");
}        
/***************************************************************************
 * Cria um nome/id para um Input
 * *************************************************************************
 * 
 * @param type = Input Type
 * @param name = Input Name
 * @return New name
 **************************************************************************/
function nameSugeri(type, name) {
    var newName = "";
    var vet = clearString(name).split(/(?=[A-Z])/);
    var temp = "";

    for (var i = 0; i < vet.length; i++) {
        temp += vet[i].substring(0, 4).trim().replaceAll(" ","");
    }
    switch (type) {
        case "money":
        case "text":
        case "textarea":
            newName = "txt";
            break;
        case "number":
        case "tel":
        case "kg":
            newName = "num";
            break;
        case "select":
        case "zoom":
            newName = "sl";
            break;
        case "date":
            newName = "dt";
            break;
        case "radio":
            newName = "rd";
            break;
        case "checkbox":
            newName = "cb";
            break;
        case "button":
            newName = "bt";
            break;
        case "time":
            newName = "tm";
            break;
        default:
            newName = "txt";
            break;
    }
    return newName + nameNormalize(temp);
}

function nameNormalize(name){
    name = name.replace(/[\á]/g, "a");
    name = name.replace(/[\à]/g, "a");
    name = name.replace(/[\ã]/g, "a");
    name = name.replace(/[\â]/g, "a");
    name = name.replace(/[\Á]/g, "A");
    name = name.replace(/[\À]/g, "A");
    name = name.replace(/[\Ã]/g, "A");
    name = name.replace(/[\Â]/g, "A");
    name = name.replace(/[\é]/g, "e");
    name = name.replace(/[\ê]/g, "e");
    name = name.replace(/[\É]/g, "E");
    name = name.replace(/[\Ê]/g, "E");
    name = name.replace(/[\í]/g, "i");
    name = name.replace(/[\Í]/g, "I");
    name = name.replace(/[\ó]/g, "o");
    name = name.replace(/[\ô]/g, "o");
    name = name.replace(/[\õ]/g, "o");
    name = name.replace(/[\Ó]/g, "O");
    name = name.replace(/[\Ô]/g, "O");
    name = name.replace(/[\Õ]/g, "O");
    name = name.replace(/[\ú]/g, "u");
    name = name.replace(/[\Ú]/g, "U");
    name = name.replace(/[\ç]/g, "c");
    name = name.replace("?", "");
    name = name.replace("!", "");
    name = name.replace(",", "");
    name = name.replace(".", "");
    name = name.replace(":", "");
    name = name.replace(";", "");
    name = name.replace("/", "");
    name = name.replace("|", "");
    name = name.replace("*", "");
    name = name.replace("+", "");
    name = name.replace("-", "");
    name = name.replace("_", "");
    name = name.replace("=", "");
    name = name.replace("%", "");
    name = name.replace("$", "");
    name = name.replace("#", "");
    name = name.replace("@", "");
    name = name.replace("&", "");
    name = name.replace("(", "");
    name = name.replace(")", "");
    name = name.replace("{", "");
    name = name.replace("}", "");
    name = name.replace("[", "");
    name = name.replace("]", "");
    name = name.replace("\\", "");

    return name;
}