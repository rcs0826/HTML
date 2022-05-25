define(['index'], function(index) {

    fchmcs0001Factory.$inject = ['$totvsresource'];    
    function fchmcs0001Factory($totvsresource) {
        
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmcs/fchmcs0001/:method/:id', {}, {
            postArray: { 
                method: 'POST',
                isArray: true
            }
        });
        
        factory.TOTVSPostArray = function (parameters, model, callback, headers) {
            this.parseHeaders(headers);
            var call = this.postArray(parameters, model);
            return this.processPromise(call, callback);
        };

        factory.getCostClosingInfo = function (parameters, callback, headers) {
            return this.TOTVSPostArray({method:"getCostClosingInfo"}, parameters, callback, headers);
        };

        factory.getRelatedProgram = function (parameters, callback, headers) {
            return this.TOTVSPostArray({method:"getRelatedProgram"}, parameters, callback, headers);
        };

        factory.deleteRelatedProgram = function (parameters, callback, headers) {
            return this.TOTVSPost({method:"deleteRelatedProgram"}, parameters, callback, headers);
        };

        factory.getLastSequence = function (parameters, callback, headers) {
            return this.TOTVSPost({method:"getLastSequence"}, parameters, callback, headers);
        };

        factory.saveRelatedProgram = function (parameters, callback, headers) {
            return this.TOTVSPost({method:"saveRelatedProgram"}, parameters, callback, headers);
        };

        factory.getProgramCode = function (parameters, callback, headers) {
            return this.TOTVSPostArray({method:"getProgramCode"}, parameters, callback, headers);
        };

        factory.getTotalItensGauge = function (parameters, callback, headers) {
            return this.TOTVSPost({method:"getTotalItensGauge"}, parameters, callback, headers);
        };

        factory.getCalculatedItensGauge = function (parameters, callback, headers) {
            return this.TOTVSGet({method:"getCalculatedItensGauge",
                                  site: parameters}, callback, headers);
        };

        factory.ACT_count = function (parameters, callback, headers) {
            return this.TOTVSGet({method:"ACT_count",
                                  site: parameters.site,
                                  dt_trans: parameters.dt_trans}, callback, headers);
        };

        factory.OCOR_count = function (parameters, callback, headers) {
            return this.TOTVSPostArray({method:"OCOR_count"}, parameters, callback, headers);
        };
        factory.ACT_LIST_CSV = function (parameters, callback, headers) {
            return this.TOTVSGet({method:"ACT_LIST_CSV",
                                  site: parameters.site,
                                  item: parameters.item}, callback, headers);
        };

        factory.OCOR_LIST_CSV = function (parameters, callback, headers) {
            return this.TOTVSGet({method:"OCOR_LIST_CSV",
                                  site: parameters.site,
                                  type: parameters.type}, callback, headers);
        };

        factory.costClosingType = function (callback, headers) {
            return this.TOTVSGet({method:"costClosingType"}, callback, headers);
        };

         factory.ACT_Detail = function (parameters, callback, headers) {
            return this.TOTVSPostArray({method:"ACT_Detail"}, parameters, callback, headers);
        };

        factory.ACT_list = function (parameters, callback, headers) {
            return this.TOTVSPostArray({method:"ACT_list"}, parameters, callback, headers);
        };

        factory.actsCsv = function (parameters, callback, headers) {
            return this.TOTVSGet({method:"actsCsv",
                                  site: parameters.site,
                                  dt_trans: parameters.dt_trans,
                                  c_Nro_docto: parameters.c_Nro_docto,
                                  it_codigo_ini: parameters.it_codigo_ini,
                                  it_codigo_fim: parameters.it_codigo_fim}, callback, headers);
        };

        return factory;
    }
    
    index.register.factory('fchmcs.fchmcs0001.Factory', fchmcs0001Factory);
});