$(document).ready(function () {
    //$("#idClick").val("46456");
});
// Insere os elementos
function inserirHTML(nome) {
    var id = "result";
    var res;
    if (nome == "Celular") {
        res = obj.celular(creteId());
    }
    if (nome == "Data") {
        res = obj.data(creteId());
    }
    if (nome == "Destinatario") {
        res = obj.destinatario(creteId());
    }
    if (nome == "E-mail") {
        res = obj.email(creteId());
    }
    if (nome == "Panel") {
        res = obj.panel(creteId());
    }
    if (nome == "Radio") {
        res = obj.radio(creteId());
    }
    if (nome == "Row") {
        res = obj.row(creteId());
    }
    if (nome == "Select Dataset") {
        res = obj.selectDataset(creteId());
    }
    if (nome == "Select") {
        res = obj.select(creteId());
    }
    if (nome == "Telefone") {
        res = obj.telefone(creteId());
    }
    if (nome == "Text") {
        res = obj.text(creteId());
    }
    if (nome == "Textarea") {
        res = obj.textarea(creteId());
    }
    if (nome == "Time") {
        res = obj.time(creteId());
    }
    if (nome == "Valor") {
        res = obj.valor(creteId());
    }
    if (nome == "Zoom") {
        res = obj.zoom(creteId());
    }
    if (nome == "Table") {
        res = obj.table(creteId());
    }
    if (nome == "Col1") {
        res = obj.col1(creteId());
    }
    if (nome == "Col2") {
        res = obj.col2(creteId());
    }
    if (nome == "Col3") {
        res = obj.col3(creteId());
    }
    if (nome == "Col4") {
        res = obj.col4(creteId());
    }
    if (nome == "Col5") {
        res = obj.col5(creteId());
    }
    if (nome == "Col6") {
        res = obj.col6(creteId());
    }
    if (nome == "Col7") {
        res = obj.col7(creteId());
    }
    if (nome == "Col8") {
        res = obj.col8(creteId());
    }
    if (nome == "Col9") {
        res = obj.col9(creteId());
    }
    if (nome == "Col10") {
        res = obj.col10(creteId());
    }
    if (nome == "Col11") {
        res = obj.col11(creteId());
    }
    if (nome == "Col12") {
        res = obj.col12(creteId());
    }

    if (nome == "") {
        res = obj.nulo(creteId());
        $("#" + id).html(res);
        return;
    }

    if ($("#idClick").val() != "") {
        id = $("#idClick").val();
    }
    $("#" + id).append(res);
    setIdCollect();

    //==========================================
    $("#result > div,[obj]").mouseover(function () {
        //alert(this.id);
        //RCS.infoLoad(this.id,"Objeto: " + this.id);
        RCS.alt(this.id, "alert", "Objeto: " + this.id);
    });
    $("#result > div,[obj]").mouseleave(function () {
        //RCS.infoLoadClose();
        RCS.altClose();
    });
}
// Resgata o Código Fonte
function codHtml() {
    var res = $("#result").html();
    $("#codHtml").val(vkbeautify.xml(res.trim()));
    RCS.copyClipboard("codHtml");
}
// Cria um ID Dinâmicamente
function creteId() {
    var id = $("#idInfo").val();
    if (id == "") {
        id = 1;
    } else {
        id = parseInt(id) + 1;
    }
    $("#idInfo").val(id);

    return id;
}
// Captura o ID  do Objeto
function idCollect(id) {
    $("#idClick").val(id);
    //$("#idClick").val(event.target.id);
}
// Seta um Id em um elemento
function setIdCollect() {
    var info = $("#result > div,[obj]");
    for (var i = 0; i < info.length; i++) {
        $("#" + info[i].id).click(function () {
            idCollect(this.id);
        });
    }
}
