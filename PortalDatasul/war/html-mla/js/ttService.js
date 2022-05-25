define([
	'index'
], function(index) {
	
	// ########################################################
    // ### SERVIÇO DE TRATAMENTO DA TEMP-TABLE ttDados
    // ######################################################## 
    ttService.$inject = [];
    function ttService(){
        var ttCriadas = [];

        var service = {
            /* 
             * Objetivo: Transformar o json da ttDados em um array para que o controller e a viewer
                         possam utilizá-los de maneira navegável
             * Parâmetros: ttFull: json da ttDados retornado pelo progress
             * Observações:
             */
            transformTT: function(ttFull){
                var ttResult = [];
                var ttResultAux = [];
                var ttCriadas = [];

                if(ttFull.length>0){
                    for(var i=0;i<ttFull.length;i++){
                        cTable = ttFull[i]['cTable'].trim();
                        iRow   = ttFull[i]['iRow'];
                        cField = ttFull[i]['cField'].trim();
                        cValue = ttFull[i]['cValue'].trim();

                        cValue = cValue.replace(/[\n|\n\r]/g," ");
                        cValue = cValue.replace(/'/g,"\\'");

                        if(ttResultAux[cTable] == undefined){
                            ttResultAux[cTable] = [];
                            ttCriadas.push(cTable);
                        }

                        if(ttResultAux[cTable][iRow] == undefined)
                            ttResultAux[cTable][iRow] = [];

                        ttResultAux[cTable][iRow][cField] = cValue;
                    }
                    for(var i=0; i<ttCriadas.length; i++){
                        for(key in ttResultAux[ttCriadas[i]]){
                            if(ttResult[ttCriadas[i]] == undefined){
                                ttResult[ttCriadas[i]] = [];
                            }
                            ttResult[ttCriadas[i]].push(ttResultAux[ttCriadas[i]][key]);
                        }
                    }
                }else{
                    return false;
                }
                
                return ttResult;
            }
        };
        return service;
    }

	// ########################################################
	// ### Registers
	// ########################################################
	index.register.factory('mla.service.ttService',ttService); 
});
