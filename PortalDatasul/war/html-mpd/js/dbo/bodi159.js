define(['index'], function(index) {
    // *************************************************************************************
    // *** FACTORIES
    // *************************************************************************************
    pedVendaFactory.$inject = ['$totvsresource'];
    function pedVendaFactory($totvsresource) {
         
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/dbo/dibo/bodi159/:method/:nomeAbrev/:nrPedcli',{},{});
         
        factory.getRecord = function (nomeAbrev, nrPedcli, callback) {
            return this.TOTVSGet({nomeAbrev: nomeAbrev, nrPedcli: nrPedcli}, callback);
        };
         
        return factory;
    }

         
    // **************************************************************************************
    // *** SERVICE
    // **************************************************************************************
     
    pedVendaService.$inject = ['mpd.ped-venda.Factory'];
    function pedVendaService(pedVendaFactory) {
         
        this.getRecord = function (nomeAbrev, nrPedcli, callback) {
            return pedVendaFactory.getRecord(nomeAbrev, nrPedcli, callback);
        };
         
    }
        
    index.register.service('mpd.ped-venda.Service', pedVendaService);    
    index.register.factory('mpd.ped-venda.Factory', pedVendaFactory);     
});

