define([
	'index'
], function(index) {	
	
    mlahtml010p.$inject = ['$totvsresource'];
    function mlahtml010p($totvsresource) {        
        var specificResources = {  
            /*
             *  Objetivo:  Retorna Mapa Comparativo de uma ordem de compra                
             *  Parametros: Entrada: iNumOrdem - numero da ordem de compra a ser buscado o mapa   
             *              Saída:     lHasMap - retorna se encontrou mapa(cotacao) para ordem    
             *                         ttDados - retorna as cotacaoes (mapa) encontrado           
             */          
            'getComparativeMaps': {
                method: 'POST',
                isArray: false,
                params: {'iNumOrdem':'@iNumOrdem'},
                url: '/dts/datasul-rest/resources/api/laphtml/mlahtml010p/getComparativeMaps/'
            }           
        }    

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/laphtml/:method', {}, specificResources);
        return factory;
    };

	// ########################################################
	// ### Registers
	// ########################################################
	index.register.factory('mla.mlahtml010p.factory', mlahtml010p);
});
