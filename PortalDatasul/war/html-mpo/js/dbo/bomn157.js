define(['index'],function (index) {
	
        // *************************************************************************************
        // *** FACTORIES
        // *************************************************************************************
        bomn157Factory.$inject = ['$totvsresource'];
        function bomn157Factory($totvsresource) {

            // definimos uma nova factory a partir do totvsresource, passando a URL do serviÃ§o de DBO
            var factory = $totvsresource.REST('/datasul-rest/resources/dbo/mnbo/bomn157/:id');

            // implementamos um metodo findRecords para abstrair a chamada ao resource
            factory.findRecords = function (parameters, callback) {
                return this.TOTVSQuery(parameters, callback);
            };

            // implementamos tambem o getRecord e todos os outros metodos de CRUD
            factory.getRecord = function (id, callback) {
                return this.TOTVSGet({id: id}, callback);
            };

            factory.saveRecord = function (model, callback) {
                return this.TOTVSSave({}, model, callback);
            };

            factory.updateRecord = function (id, model, callback) {
                return this.TOTVSUpdate({id: id}, model, callback);
            };

            factory.deleteRecord = function (id, callback) {
                return this.TOTVSRemove({id: id}, callback);
            };

            return factory;
        }

        // factory injeta o valor de retorno da bomn157Factory
        index.register.factory('mpo.bomn157.Factory', bomn157Factory); 

        // **************************************************************************************
        // *** SERVICE
        // **************************************************************************************

        bomn157Service.$inject = ['mpo.bomn157.Factory'];
        function bomn157Service(bomn157Factory) {

            // definimos um service que usa a factory, nesses metodos abstraimos a chamada e tratamos outros detalhes da chamada.
            this.findRecords = function (startAt, limitAt, parameters, callback) {
                if (!parameters) {
                    parameters = {};
                }
                parameters.start = startAt;
                parameters.limit = limitAt;

                return bomn157Factory.findRecords(parameters, callback);
            };

            this.getRecord = function (id, callback) {
                return bomn157Factory.getRecord(id, callback);
            };

            this.saveRecord = function (model, callback) {
                return bomn157Factory.saveRecord(model, callback);
            };

            this.updateRecord = function (id, model, callback) {
                return bomn157Factory.updateRecord(id, model, callback);
            };

            this.deleteRecord = function (id, callback) {
                return bomn157Factory.deleteRecord(id, callback);
            };
        }

        // service injeta uma instancia da funÃ§Ã£o        
        index.register.service('mpo.bomn157.Service', bomn157Service);

});