define(['index'],
    function (index) {

        updateIndexAdjustmentFactory.$inject = ['$totvsresource'];

        function updateIndexAdjustmentFactory($totvsresource) {

            var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hvp/fchsauupdateindexadjustment/:method/:id', {}, {
                'query': { method: 'GET', params: { method: '@method' }, isArray: false },
                'queryPost': { method: 'POST', params: { method: '@method' }, isArray: true },
                'queryZoom': { method: 'POST', params: { method: '@method' }, isArray: true },
                'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
                
            });
            var factoryModality = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hpr/fchsaumodalid/:method/:id', {}, {
                'query': { method: 'GET', params: { method: '@method' }, isArray: false },
                'queryPost': { method: 'POST', params: { method: '@method' }, isArray: true },
                'queryZoom': { method: 'POST', params: { method: '@method' }, isArray: true }
            });

            // ----------------------------------------------------------------- function updateIndexAdjustment()
            // updateIndexAdjustment - Realiza a geração/simulação/impressão
            // ---------- processType - Indica o tipo de processo que esta sendo executado pela tela [1 - Geracao | 2 - Simulacao | 3 - Relatorio]
            // ---------- controller - Controller da tela [updateIndexAdjustment]
            // ---------- callback - Callback da função.
            factory.updateIndexAdjustment = function (
                processType,
                controller,
                preSelect,
                callback) {

            	tmpUpdateIndexadjustmentInput = {
            			inTipoProcesso: processType,
            			inTipoRelatorioAcom: (processType != 3 ? controller.model.FileType : controller.model.FileTypeReport),
                        inTipoRelatorioErro: (processType != 3 ? controller.model.FileErrorType : controller.model.FileErrorTypeReport),
                        inSelecaoContrato: controller.model.ContractSelection,
                        qtVidas: (processType != 3 ? controller.model.AmountLifes : controller.model.AmountLifesReport),
                        tpIndicePool: controller.model.PoolIndexType,
                        tpIndiceOutroAntigo: controller.model.OldIndexType,
                        tpIndiceOutroNovo: controller.model.NewIndexType,
                        dsPreselect: preSelect};
        
            	tmpIndexTypes = (processType != 3 ? controller.model.IndexTypeList : controller.model.IndexTypeListReport);
            	tmpModalid = (processType != 3 ? controller.model.ModalityList : controller.model.ModalityListReport);

                
            	
            	this.postWithArray(
                    {method: 'updateIndexAdjustment', tmpUpdateIndexadjustmentInput:tmpUpdateIndexadjustmentInput, tmpIndexTypes:tmpIndexTypes,
                    	tmpModalid:tmpModalid}, callback);
            };
			
            // ----------------------------------------------------------------- function getAllIndexType()
            // getAllIndexType - Busca os tipos de índice cadastrados no sistema para preenchimento da tela
            // ---------- callback - Callback da função.
            factory.getAllIndexType = function (callback) {
                    
                    this.queryPost({method: 'getAllIndexType'}, callback);
            };
            
            // ----------------------------------------------------------------- function getContractingPartyByFilter()
            // getContractByFilter - Busca contratantes por filtro
            // ----- Parâmetros
            // ---------- simpleFilterValue - filtro da pesquisa simples.
            // ---------- pageOffset - registro de início.
            // ---------- limit - Limite de registros por página.
            // ---------- disclaimers - Filtros informados na tela.
            // ---------- callback - Callback da função.
            factory.getContractingPartyByFilter = function (
                simpleFilterValue,
                pageOffset,
                limit,
                disclaimers,
                callback) {
                    
                    this.queryZoom(
                        {method: 'getContractingPartyByFilter'}, 
                        {simpleFilterValue: simpleFilterValue, 
                        pageOffset: pageOffset, 
                        limit: limit, 
                        disclaimers: disclaimers },
                        callback);
            };
            
            // ----------------------------------------------------------------- function getProposalByFilter()
            // getProposalByFilter - Busca propostas por filtro
            // ----- Parâmetros
            // ---------- simpleFilterValue - filtro da pesquisa simples.
            // ---------- pageOffset - registro de início.
            // ---------- limit - Limite de registros por página.
            // ---------- disclaimers - Filtros informados na tela.
            // ---------- callback - Callback da função.
            factory.getProposalByFilter = function (
                simpleFilterValue, 
                pageOffset, 
                limit, 
                disclaimers, 
                callback) {
            
                    this.queryZoom(
                        {method: 'getProposalByFilter'}, 
                        {simpleFilterValue: simpleFilterValue, 
                        pageOffset: pageOffset, 
                        limit: limit, 
                        disclaimers: disclaimers },
                        callback);
            };
            // ----------------------------------------------------------------- function getProposalByFilter()
            
            return factory;
        }

        index.register.factory('healthcare.hvp.updateindexadjustment.factory', updateIndexAdjustmentFactory);
    });