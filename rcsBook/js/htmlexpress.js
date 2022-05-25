$(document).ready(function(){
  RCS.digitalEfect("title1",2,"HTML Express");
  $("#btCodeCSS").click(function(){
        HE.codecss = (HE.codecss)?false:true;
        HE.codehtml = true;
        HE.codelibcss = true;
        HE.hide("[divCodeCSS]",HE.codecss);
        HE.hide("[divCodeHTML]",true);
        HE.hide("#divLibrary",true);
  });
  $("#btCodeHTML").click(function(){
        HE.codehtml = (HE.codehtml)?false:true;
        HE.codecss = true;
        HE.codelibcss = true;
        HE.hide("[divCodeHTML]",HE.codehtml);
        HE.hide("[divCodeCSS]",true);
        HE.hide("#divLibrary",true);
  });
  $("#btCleaCode").click(function(){
        var code = (!HE.codecss)?"txtCodeCSS":"txtCodeHTML";
        HE.limparHTML(code);
  });
  $("#btLibrCSS").click(function(){
        HE.codelibcss = (HE.codelibcss)?false:true;
        HE.hide("#divLibrary",HE.codelibcss);
  });
  $("#txtCodeHTML").on("input",function(){
        HE.recriar('result');
  });
  $("#txtCodeCSS").on("input",function(){
        HE.recriar('result');
  });
  $("#btIndentarHTML").click(function(){
        $("#txtCodeHTML").val(vkbeautify.xml(RCS.clearWhiteLine($("#txtCodeHTML").val())));
  });
  $("#btIndentarCSS").click(function(){
        $("#txtCodeCSS").val(vkbeautify.css(RCS.clearWhiteLine($("#txtCodeCSS").val())));
  });
  $("#btCopiHTML").click(function(){
      RCS.copyClipboard("txtCodeHTML");
  });
  $("#btCopiCSS").click(function(){
      RCS.copyClipboard("txtCodeCSS");
  });


});
var HE = {
    codecss:true,
    codehtml:true,
    codelibcss:true,
    hideLibCss:function(){

    },
    // ================================================================================
    // Esconde ou mostra um objeto
    // ================================================================================
    hide:function(id, val) {
        if (val) {
            $(id).hide();
        } 
        else {
            $(id).show();
        }
    },
    popup:function(id) {
        var complemento = '<meta charset="UTF-8">';
        complemento += '<link type= "text/css" rel ="stylesheet" href="./jQueryTE/jquery-te-1.4.0.css" >';
        complemento += '<link type="text/css" rel="stylesheet" href="./fluigStyleGuide/fluig-style-guide-flat.min.css"/>';
        complemento += '<script type= "text/javascript" src="./fluigStyleGuide/jquery.min.js" charset="utf-8"></ script>';
        complemento += '<script type="text/javascript" src="./fluigStyleGuide/fluig-style-guide.min.js" charset="utf-8"></ script>';
        complemento += "</ script>";
        RCS.newTab(id, complemento);
    },
    cor:function(cor) {
        document.getElementById("cor").value = cor;
    },
    recriar:function(idDiv) {
        var Inicio = " <html><head></head ><body> ";
        var Fim = " </body></ html>";
        document.getElementById(idDiv).innerHTML = document.getElementById("txtCodeHTML").value + "<style>" + document.getElementById("txtCodeCSS").value + "</style>";
    },
    limparHTML:function(idDiv) {
        document.getElementById(idDiv).value = "";
        this.recriar("result");
    },
    inserirHTML:function(type) {
        var idtxta = "txtCodeHTML";
        var textarea = document.getElementById(idtxta);
        switch (type) {
            case "div":
                textarea.value += '<div class="form-control" id="" ></div> ';
                break;
            case "textarea":
                textarea.value += '<textarea class="form-control" ></textarea> ';
                break;
            case "a":
                textarea.value += '<a href="#" target="_blank">Ancora</a>';
                break;
            case "img":
                textarea.value += '<img src="" />';
                break;
            case "fieldset":
                textarea.value += "<fieldset><legend>Grupo</legend></fieldset> ";
                break;
            case "iframe":
                textarea.value += '<iframe src="" frameBorder="1" ></iframe>';
                break;
            case "select-one":
                textarea.value += '<select class="form-control" ><option></option></select>';
                break;
            default:
                var xClass = type == "button" || type == "submit" ? "btn btn-primary" : "form-control";
                textarea.value += ('<input class="' + xClass + '" type="[x]" value="" /> ').replace("[x]", type);
        }
        textarea.value += "\n";
        this.recriar("result");
    }
}