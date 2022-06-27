$(document).ready(function(){
    $("#btCopi").click(function(){
        RCS.copyClipboard("txtCodCreator");
    });
    $("#btCopiCss").click(function(){
        RCS.copyClipboard("divFormCss");
    });
    $("#btCopiVF").click(function(){
        RCS.copyClipboard("txtValiForm");
    });
    $("#btCopiEF").click(function(){
        RCS.copyClipboard("txtEnabFiel");
    });
    $("#btLimpForm").click(function(){
        $('#txtTituForm').val("");
        $('#txtInst').val("");
        $('#divFormCss').val("");
        $('#txtCodCreator').val("");
        $('#txtValiForm').val("");
        $('#txtEnabFiel').val("");
        $('#divForm').html("");
    });

    $("#txtInst").on("keydown input",function(event){
        if(event.keyCode == 225){
            this.value = this.value+";;;;;;;";  
        }      
        createInputs(this.value,'divForm','txtCodCreator',document.getElementById('txtTituForm').value);
        $('#txtValiForm').val(vkbeautify.css(codValidate(1)));
        $('#txtEnabFiel').val(vkbeautify.css(codValidate(2)));
    });
    $("#txtCodCreator").on("keydown input",function(event){
        $('#txtValiForm').val(vkbeautify.css(codValidate(1)));
        $('#txtEnabFiel').val(vkbeautify.css(codValidate(2)));
    });
});
//p;Controle de Downloads - NOTFIS;i
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
    var bootstrap = RCS.getValueChecked("cbBoot");
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
    var colType = RCS.getValueSelect("slColu");
    var isTable = false;
    var isBot = (bootstrap == 'Sim');

    try {
        if (txtTitle != null && txtTitle != "" && vetTitle.length >= 2) {
            if(vetTitle[0] == "p" && vetTitle.length == 3 && vetTitle[2] != ""){
                nclass = getMessageClass(vetTitle[2]);
            }
            else{
                nclass = "primary";
            }
            table += (vetTitle[0] == "f")?'<fieldset><legend>':'<div class="'+(isBot?"card":"panel panel")+'-'+nclass+'"><div class="'+(isBot?"card-header":"panel panel-heading")+'">'+(isBot?'<div class="card-title">':'<center>')+'<h2 class="fs-no-margin">';
            table += vetTitle[1];
            table += (vetTitle[0] == "f")?'</legend>':'</h2>'+(isBot?"</div>":"</center>")+'</div><div class="'+(isBot?"card":"panel panel")+'-body" >';
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
                if (isTable) {
                    sum = 2;
                    isTable = false;
                    line = true;
                }
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

                if (objType == "table") {
                    isTable = true;
                }

                objType = objType == "" ? "text" : objType;
                idName = objIDName != "" ? objIDName : nameSugeri(objType, objNome.trim());
                titName = clearString(objNome.trim());
                obr = "";
                obr += objReadonly != 1 && objObrigatorio == 1 ? "req" : "";

                if (obr != "") {
                    isObr = true;
                }

                if(objNome != "tablefim"){    
                    table += '<div class="col-'+colType+'-' + tamanho + (isBot?" pr-1":"")+'">';
                }
                table += (objType == "button" || objType == "msg" || objType == "table" || objNome == "tablefim")?'':'<label for="' + idName + '" ' + obr + ">" + objNome + ":</label>";

                if (objPlaceholder == "c" && objReadonly != 1) {
                    objPlaceholder = "Digite o " + titName + " aqui!";
                }

                attr = "";
                attr += objValue == "" || objType == "select" || objType == "dataset" || objType == "checkbox" || objType == "radio" || objType == "button" ? "" : ' value="' + objValue + '"';
                attr += objType == "button" ? ' value="' + objNome + '"' : "";
                attr += objPlaceholder == "" ? "" : ' placeholder="' + objPlaceholder + '"';
                attr += objType != "email" ? "" : ' placeholder="email@email.com.br"';
                attr += objType != "money" ? "" : ' placeholder="000.000,00" maskmoney';
                attr += objNome != "CNPJ" ? "" : ' placeholder="00.000.000/0000-00" mask="00.000.000/0000-00"';
                attr += objNome != "CPF" ? "" : ' placeholder="000.000.000-00" mask="000.000.000-00"';
                attr += objNome != "CEP" ? "" : ' placeholder="00000-000" mask="00000-000"';
                attr += objNome != "RG" ? "" : ' placeholder="00.000.000-0" mask="00.000.000-0"';
                attr += objType != "placa" ? "" : ' placeholder="XXX-0000" mask="XXX-0000"';
                attr += objType != "zoom" ? "" : " data-zoom=\"{'displayKey': 'colleagueName','datasetId': 'colleague','filterValues': 'active,true','fields': [{'field': 'colleagueName','label': 'Nome','standard': 'true','search': 'true'},   {'field': 'colleagueId','label': 'Matricula','standard': 'true','search': 'true'}]}\"";
                attr += objReadonly != 1 ? "" : ' readonly="readonly"';
                attr += objObrigatorio == 1 && objReadonly != 1 ? ' required="required"' : "";
                attr += ( objType == "table" && objReadonly == 1)? " noaddbutton=true nodeletebutton=true" : "";

                if (objType == "radio" || objType == "checkbox") {
                    val = objValue.toString().split("|");
                    if(val.length == 2){
                        table += '<div class="form-group row">';    
                    }
                    for (var x = 0; x < val.length; x++) {
                        if (val[x] != "") {
                            if(val.length == 2){
                                table += '<div class="col-'+colType+'-6"'+(isBot?" pr-1":"")+'>';    
                            }
                            table += '<div class="input-group"> ';
                            table += '<span class="input-group-addon"> ';
                            table += '<input type="'+objType+'" id="' + idName + '_'+nameNormalize(val[x])+'" name="' + idName + '"' + attr + ' value="' + nameNormalize(val[x]) + '" title="' + titName + '" />';
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
                } 
                else if (objType == "select" || objType == "dataset") {
                    let attrDs = "";
                    isSelect = true;
                    val = objValue.toString().split("|");

                    if(objType == "dataset"){
                        for (var x = 0; x < val.length; x++) {
                            if (x == 0) {
                                attrDs += ' dataset="'+((val[x] == "")?"colleague":val[x])+'"';
                            }
                            else if (x == 1) {
                                attrDs += ' datasetkey="'+((val[x] == "")?"colleagueId":val[x])+'"';
                            }
                            else if (x == 2) {
                                attrDs += ' datasetvalue="'+((val[x] == "")?"colleagueName":val[x])+'"';
                            }
                            else if (x == 3) {
                                attrDs += ' addblankline="'+((val[x] == "false")?"false":"true")+'"';
                            }
                        }
                    }

                    table += '<select class="form-control" id="' + idName + '" name="' + idName + '"' + attr + ' title="' + titName+ '"'+attrDs+' >';
                    
                    if(objType == "select"){
                        for (var x = 0; x < val.length; x++) {
                            if (val[x] == "") {
                                table += '<option value="" readonly="readonly" selected="selected" >Selecione</option>';
                            } else {
                                table += '<option value="' + val[x] + '">' + val[x] + "</option>";
                            }
                        }
                    }

                    table += "</select>";
                } else if (objType == "textarea") {
                    table += '<textarea class="form-control" rows="6" id="' + idName + '" name="' + idName + '"' + attr + ' title="' + titName + '" >' + objValue + "</textarea>";

                } else if (objType == "table") {
                    table += '<fieldset> <legend>' + titName + '</legend>';
                    table += '<table id="' + idName + '" class="table table-striped" tablename="' + idName + '" addbuttonlabel="Incluir" addbuttonclass="'+(isBot? 'btn-fill ':'') + 'btn btn-primary" ' + attr + ' width="100%">';
                    table += '<thead> <tr class="tableHeadRow"> <th class="tableColumn"></th> </tr> </thead>';
                    table += '<tbody> <tr class="tableBodyRow"> <td>';

                } else if (objNome == "tablefim") {
                    table += '</div></td></tr></tbody></table></fieldset>';

                } else if (objType == "msg") {
                    table += getDivMensage(objIDName,objNome,objValue);
                } 
                else {
                    nclass = objType == "button" ? "btn btn-block btn-" : "form-control";
                    nclass = (objType == "switch")?"switch-input":nclass;

                    if(objType == "button"){
                        nclass += getMessageClass(objValue);
                    }
                    var typedef = '';
                    if(objType == "data" || objType == "time"){
                        table += '<div class="input-group enable-calendar">';   
                        typedef = (objType == "data")?'text':typedef;
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
                    else if (objType == "pesq"){
                        table += '<div class="input-group">';
                        typedef = 'text';
                    }
                    else if (objType == "switch"){
                        table += '<br /><div class="switch switch-'+getMessageClass(objPlaceholder)+'" >';
                        typedef = 'checkbox';
                    }

                    typedef = (typedef != '')?typedef:objType;
                    table += '<input type="' + typedef + '" class="' + nclass + '" id="' + idName + '" name="' + idName + '"' + attr + ' title="' + titName + '" />';
                    
                    if(objType == "data"){
                        table += '<span class="input-group-addon fs-cursor-pointer"> <span class="fluigicon fluigicon-calendar"></span></span></div>';  
                    }
                    else if(objType == "time"){
                        table += '<span class="input-group-addon fs-cursor-pointer"> <span class="fluigicon fluigicon-time"></span></span></div>';  
                    }
                    else if(objType == "pesq"){
                        table += '<span class="input-group-addon fs-cursor-pointer"> <span class="fluigicon fluigicon-search"></span></span></div>';     
                    }
                    else if(objType == "email" || objType == "money" || objType == "kg"){
                        table += '</div>';   
                    }
                    else if (objType == "switch"){
                        table += '<label class="switch-button" for="'+idName+'">Toggle</label> </div>';
                    }
                }
                if(objType != "table"){
                    table += "</div>";
                }

                if (i + 1 == total) {
                    table += "</div>";
                }
            } else {
                table += '</div><div class="form-group row">';
                sum = 0;
            }
        }
        if (txtTitle != null && txtTitle != "" && vetTitle.length >= 2) {
            table += (vetTitle[0] == "f")?'</fieldset>':'</div></div>';
        }

        //table += "</form></div>";
        var css = "";
        //if (isObr || isSelect || vetTitle.length == 2 && vetTitle[0] == "f") {
        //    table += "<style>";
        //}
        if (isObr) {
            css += "[req]:after {";
            css += '  content: " *" !important;';
            css += "  color: red !important;";
            css += "}";
        }
        if (isSelect) {
            css += "select [readonly]{";
            css += "  display: none;";
            css += "}";
        }

        if (vetTitle.length == 2 && vetTitle[0] == "f") {
            css += "legend{";
            css += "  color: #CB4921 !important;";
            css += "}";
        }
        document.getElementById("divFormCss").value = vkbeautify.css(css);
        //if (obr != "" || isSelect || vetTitle.length == 2 && vetTitle[0] == "f") {
        //if (isObr || isSelect || vetTitle.length == 2 && vetTitle[0] == "f") {
        //    table += "</style>";
        //}
        
        document.getElementById(divRet).innerHTML = table;
        document.getElementById(txtRet).value = vkbeautify.xml(table);
        //document.getElementById(txtRet).value = table;
    } catch (e) {
        alert("Erro: " + e.message);
    }
} 
function getMessageClass(tp){
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
        return tp;
}
function getDivMensage(tp,tt,bd){
    tp = getMessageClass(tp);
    return '<div class="hideLastTD">'
        +'<div class="alert alert-'+tp+'" role="alert">'
        +'<center>'
        +'<big>'
        +'<b>'
        + tt
        +'</b></big><br />'
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
        case "dataset":
            newName = "sl";
            break;
        case "date":
        case "data":
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
        case "table":
            newName = "tb";
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