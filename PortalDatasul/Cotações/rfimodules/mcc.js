define(['index', 
        'totvs-html-framework',      
        '/dts/mcc/js/mcc-utils.js',          
    ],

function(index, custom) {

    mccCustomService.$inject = ['customization.generic.Factory', '$rootScope','TOTVSEvent', '$location', '$state'];  
    function mccCustomService(customService, $rootScope, TOTVSEvent, $location, $state){  
        console.log("mccCustomService");
        service = { 
            customrfianswerlistfields:function(params, element){
              var parentScope = params;              
            
              var child1 = element.children(0);            
              var child2 = child1.children(0);            
              var child3 = child2.children(1);            
              var child4 = child2.children(0);
              var lastchild = child4.find('div')[5];

              var descCompl = child4.find('div')[15];
              descCompl.setAttribute("style","width:100% !important");

              var html = "<div class='col-xs-12 col-md-6 ng-scope ng-isolate-scope'><div class='item-field'><label>CNPJ:</label><span>{{:: quotation['comentarios']}} </span></div></div>";
              
              var compiledHTML = customService.compileHTML(parentScope, html);              
              lastchild.after(compiledHTML[0]);
              
              descCompl.children[1].innerHTML = params.quotation.narrativa;
              descCompl.children[1].removeAttribute("class");
              descCompl.childNodes[4].remove();
            },

          //var obj = document.getElementsByTagName("form")
        };
        angular.extend(service, customService);
        return service;
    }  
    index.register.factory('custom.dts.rfimodules.mcc', mccCustomService);       
});
var tc = setInterval(function (){
    let ipi = document.getElementById("controller_ttquotationsdefault_codigo_ipi");
    if (document.getElementById("controller_ttquotationsdefault_perc_descto")) {
        if (ipi.checked == true) {
            ipi.removeAttribute("disabled");
            ipi.click();
        }
        ipi.setAttribute("disabled",true);
        document.getElementById("controller_ttquotationsdefault_perc_descto").setAttribute("readonly",true);
        document.getElementById("controller_ttquotationsdefault_valor_descto").setAttribute("readonly",true);
    }
},1000);