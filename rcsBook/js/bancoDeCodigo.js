var obj = {
    panel:function(id){
        return '<div class="panel panel-default"><div class="panel-heading"><center><h2 id="titleH2" class="fs-no-margin">Panel</h2></center></div><div class="panel-body" id="divc'+id+'" obj ></div></div>';
    },
    text:function(id){
        return '<div class="col-md-3" id="divc'+id+'" obj> <label for="text">Text:</label> <input type="text" class="form-control" id="text" name="text" placeholder="text" /></div>';
    },
    destinatario:function(id){
        return '<div class="col-md-5"> <label for="txtDestinatario">Destinatário:</label><div class="input-group"> <span class="input-group-addon">⛟</span> <input type="text" class="form-control" id="txtDestinatario" name="txtDestinatario" placeholder="Insira o Destinatário" /></div></div>';
    },
    valor:function(id){
        return '<div class="col-md-2" > <label for="valor">Valor:</label><div class="input-group"> <span class="input-group-addon">R$</span> <input type="text" class="form-control" id="valor" name="valor" placeholder="R$ 000.000,00" mask="#0.000.000,00" /></div></div>';
    },
    telefone:function(id){
        return '<div class="col-md-2"> <label for="txtTelefone">Telefone:</label><div class="input-group"> <span class="input-group-addon">☎</span> <input type="text" class="form-control" id="txtTelefone" name="txtTelefone" placeholder="(00) 0000-0000" mask="(00) 0000-0000" /></div></div>';
    },
    celular:function(id){
        return '<div class="col-md-2"> <label for="txtCelular">Celular:</label><div class="input-group"> <span class="input-group-addon">✆</span> <input type="text" class="form-control" id="txtCelular" name="txtCelular" placeholder="(00) 00000-0000" mask="(00) 00000-0000" /></div></div>';
    },
    email:function(id){
        return '<div class="col-md-5"> <label for="txtEmail">E-mail:</label><div class="input-group"> <span class="input-group-addon">@</span> <input type="text" class="form-control" id="txtEmail" name="txtEmail" placeholder="email@email.com.br" /></div></div>';
    },     
    data:function(id){
        return '<div class="col-md-2"> <label for="dtData">Data:<span class="is-required">*</span></label><div class="input-group enable-calendar" > <input type="date" class="form-control" id="dtData" name="dtData" placeholder="00/00/0000" /> <span class="input-group-addon fs-cursor-pointer"> <span class="fluigicon fluigicon-calendar"></span></span></div></div>';
    },     
    zoom:function(id){
        return "<div class=\"col-md-6\"> <label for=\"txtZoom\">Zoom:<span class=\"is-required\">*</span></label> <input type=\"zoom\" class=\"form-control\" id = \"txtZoom\" name=\"txtZoom\" data-zoom=\"{'displayKey': 'colleagueName','datasetId': 'colleague','filterValues': 'active,true','fields': [{'field': 'colleagueName','label': 'Nome','standard': 'true','search': 'true'},   {'field': 'colleagueId','label': 'Matricula','standard': 'true','search': 'true'}]}\"  /></div>";
    },     
    selectDataset:function(id){
        return '<div class="col-md-2"> <label style="white-space:normal;" class="label-field-properties">Select Dataset</label> <span class="is-required" style="display: inline;"><b>*</b></span><div > <select class="form-control" required="required" id="selectDataset" name="selectDataset" dataset= "Mes" datasetkey= "Num" datasetvalue="Nome" addBlankLine = "true"></select></div></div>';
    },     
    select:function(id){
        return '<div class="col-md-2"> <label style="white-space:normal;" class="label-field-properties">Select</label> <span class="is-required" style="display: inline;"><b>*</b></span><div > <select class="form-control" required="required" id="select" name="select" ><option value=""></option></select></div></div>';
    },     
    time:function(id){
        return '<div class="col-md-2"> <label for="tmHora">Hora: <span class="is-required">*</span></label><div class="input-group enable-calendar"> <input type="text" class="form-control" id="tmHora" name="tmHora" placeholder="00:00" mask="00:00" /> <span class="input-group-addon fs-cursor-pointer"> <span class="fluigicon fluigicon-time"></span></span></div></div>';
    }, 
    textarea:function(id){
        return '<div class="col-md-6" id="divc'+id+'" obj> <label for="textarea">Textarea:</label> <textarea class="form-control" id="textarea" name="textarea" placeholder="textarea" rows="6"></textarea></div>';
    },    
    radio:function(id){
        return '<div class="col-md-4" > <label for="rdId">Radio? <span class="obr">*</span></label><div class="form-group row"><div class="col-md-1"><div class="input-group"> <span class="input-group-addon"> <input type="radio" id="rdId_sim" name="rdId" value="sim" ></span> <label class="form-control">Sim</label></div></div><div class="col-md-2"></div><div class="col-md-1"><div class="input-group"> <span class="input-group-addon"> <input type="radio" id="rdId_nao" name="rdId" value="nao" ></span> <label class="form-control">N&atilde;o</label></div></div></div></div>';
    },    
    table:function(id){
        return '<div class="col-md-12"><table id="tabela" class="table table-striped" tablename="tabelaName" width="100%"  addbuttonlabel="Incluir"  addbuttonclass="btn btn-primary" ><thead><tr class="tableHeadRow"><th class="tableColumn"></th><th class="tableColumn"></th></tr></thead><tbody><tr class="tableBodyRow"> <td></td> <td></td></tr></tbody></table></div>';
    },     
    row:function(id){
        return '<div class="form-group row" id="divc'+id+'" ></div>';
    },    
    col1:function(id){
        return '<div class="col-md-1" id="divc'+id+'" ></div>';
    },    
    col2:function(id){
        return '<div class="col-md-2" id="divc'+id+'" ></div>';
    },    
    col3:function(id){
        return '<div class="col-md-3" id="divc'+id+'" ></div>';
    },    
    col4:function(id){
        return '<div class="col-md-4" id="divc'+id+'" ></div>';
    },    
    col5:function(id){
        return '<div class="col-md-5" id="divc'+id+'" ></div>';
    },    
    col6:function(id){
        return '<div class="col-md-6" id="divc'+id+'" ></div>';
    },    
    col7:function(id){
        return '<div class="col-md-7" id="divc'+id+'" ></div>';
    },    
    col8:function(id){
        return '<div class="col-md-8" id="divc'+id+'" ></div>';
    },    
    col9:function(id){
        return '<div class="col-md-9" id="divc'+id+'" ></div>';
    },    
    col10:function(id){
        return '<div class="col-md-10" id="divc'+id+'" ></div>';
    },    
    col11:function(id){
        return '<div class="col-md-11" id="divc'+id+'" ></div>';
    },    
    col12:function(id){
        return '<div class="col-md-12" id="divc'+id+'" ></div>';
    },    
    nulo:function(id){
        return '';
    }
};
