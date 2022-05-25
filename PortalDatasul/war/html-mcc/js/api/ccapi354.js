define([
	'index'
], function(index) {
	
	// ########################################################
	// ### Factories
	// ########################################################

    factoryRequest.$inject = ['$totvsresource'];
    function factoryRequest($totvsresource) {
        var specificResources = {
            'getRequest': { // Retorna uma requisição
                method: 'GET',
                isArray: false,
                params: {pNrRequisicao: '@pNrRequisicao'}, // Número da requisição
                url: '/dts/datasul-rest/resources/api/ccp/ccapi354/requestDetails/'
            },
            'getRequestItens': { // Retorna os itens de uma requisição
                method: 'GET',
                isArray: false,
                params: {pNrRequisicao: '@pNrRequisicao', // Número da requisição
                         pRowidItRequisicao: '@pRowidItRequisicao', // Rowid do último item da lista (para realizar a paginação)
                         pShouldPaginate: '@pShouldPaginate' // Se deve paginar os resultados
                        },
                url: '/dts/datasul-rest/resources/api/ccp/ccapi354/requestItems/'
            },
            'getRequestItem': { // Retorna os detalhes de um item da requisição
                method: 'GET',
                isArray: false,
                params: {pNrRequisicao: '@pNrRequisicao',   // Número da requisição a qual o item pertence
                         pSequencia: '@pSequencia',         // Sequencia do item
                         pItCodigo: '@pItCodigo'},          // Código do item
                url: '/dts/datasul-rest/resources/api/ccp/ccapi354/requestItemDetails/'
            },
            'getDefaults':{ // Retorna os valores padrões para uma requisição
                method:'GET',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/api/ccp/ccapi354/getDefaults/'
            },
            'getRequestToUpdate':{ // Retorna os dados de uma requisição para realizar a ediçao
                method:'GET',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/api/ccp/ccapi354/getRequestToUpdate/'
            },
            'getDefaultsItem':{ // Retorna os valores padrões para a criação de um item da requisição
                method:'GET',
                isArray: false,
                params: {pNrRequisicao: '@pNrRequisicao'}, // Número da requisição a qual o item a ser criado pertence
                url: '/dts/datasul-rest/resources/api/ccp/ccapi354/getDefaultsItem/'
            },
            'onLeaveItemRequisicao':{ // Retorna os dados para um item da requisição no evento de leave de determinado campo
                method:'POST',
                isArray: false,
                params: {pAction: '@pAction', // Indica o tipo de transação (CREATE ou UPDATE)
                         pField: '@pField'},  // Campo em que ocorreu o leave
                url: '/dts/datasul-rest/resources/api/ccp/ccapi354/onLeaveItemRequisicao/'
            },
            'getRequestItemForEdit':{ // Retornas os dados de um item da requisição para realizar a edição
                method:'GET',
                isArray: false,
                params: {pNrRequisicao: '@pNrRequisicao', // Número da requisição a qual o item pertence
                         pSequencia: '@pSequencia',       // Sequencia do item
                         pItCodigo: '@pItCodigo'},        // Código do item
                url: '/dts/datasul-rest/resources/api/ccp/ccapi354/getRequestItemForEdit/'
            },
            'validateUpdateButton': { // Verifica se deve habilitar os botões de edição/exclusão/cópia de requisições
                method: 'GET',
                isArray: false,
                params: {pNrRequisicao: '@pNrRequisicao'}, // Número da requisição
                url: '/dts/datasul-rest/resources/api/ccp/ccapi354/validateBtUpdateRequest/'  
            },
            'createUpdateRequestItem': { // Cria ou edita um item da requisição
                method: 'POST',
                isArray: false,
                params: {pAction: '@pAction',       // Indica o tipo de transação (CREATE ou UPDATE)
                         pLastItem: '@pLastItem'},  // Indica se é o último item a ser cadastrado pelo usuário
                url: '/dts/datasul-rest/resources/api/ccp/ccapi354/createUpdateRequestItem'
            },
            'createUpdateRequestItem_v2': { // Cria ou edita um item da requisição
                method: 'POST',
                isArray: false,
                params: {pAction: '@pAction',       // Indica o tipo de transação (CREATE ou UPDATE)
                         pLastItem: '@pLastItem',   // Indica se é o último item a ser cadastrado pelo usuário
                         pChangeRequestStatus: '@pChangeRequestStatus'},  // Indica se deve alterar a situação da requisição/itens da requisição
                url: '/dts/datasul-rest/resources/api/ccp/ccapi354/createUpdateRequestItem_v2'
            },
            'removeRequestItem': { // Remove um item da requisição
                method: 'DELETE',
                isArray: false,
                params: {pNrRequisicao: '@pNrRequisicao',  // Número da requisição a qual o item pertence
                         pSequencia: '@pSequencia',        // Sequencia do item
                         pItCodigo: '@pItCodigo'},         // Código do item
                url: '/dts/datasul-rest/resources/api/ccp/ccapi354/removeRequestItem'
            },
            'updateApprovalInfo': { // Atualiza as informações de aprovações
                method: 'POST',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/api/ccp/ccapi354/updateApprovalInfo'
            },
            'getListRequests': { // Retorna uma lista de requisições
                method: 'POST',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/api/ccp/ccapi354/getListRequests'
            },
            'getListRequestsWithOutCount': { // Retorna uma lista de requisições
                method: 'POST',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/api/ccp/ccapi354/getListRequestsWithOutCount'
            },
            'getSummaryRequestItem': { // Retorna uma lista de itens da requisição
                method: 'GET',
                isArray: false,
                params: {pNrRequisicaoOrig: '@pNrRequisicaoOrig',  // Número da requisição origem
                         pNrRequisicaoDest: '@pNrRequisicaoDest'}, // Número da requisição destino
                url: '/dts/datasul-rest/resources/api/ccp/ccapi354/getSummaryRequestItem'
            },
            'copyItemRequest': { // Copiar os itens de uma requisição
                method: 'POST',
                isArray: false,
                params: {pNrRequisicao: '@pNrRequisicao'},  // Número da requisião destino 
                url: '/dts/datasul-rest/resources/api/ccp/ccapi354/copyItemRequest/:pNrRequisicao'
            },
            'updateStatus': { // Atualizar status da requisição
                method: 'POST',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/api/ccp/ccapi354/updateStatus/'
            },
            'getFieldsReportConfigDefault': { // Retorna a lista dos campos disponíveis para exibição no relatório
                method: 'GET',
                isArray: true,
                params: {},
                url: '/dts/datasul-rest/resources/api/ccp/ccapi354/getFieldsReportConfigDefault/'
            }
        }    

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/ccp/ccapi354/:method', {}, specificResources);
        
        factory.findRecords = function(startAt, limitAt, where, callback) { // Método padrão para retornar registros
            this.limitAt = 50;
            return this.TOTVSQuery({start: startAt, limit: limitAt, where: where}, callback);
        };

        factory.saveRecord = function (model, callback) { // Método padrão para criar um registros
            return this.TOTVSSave({}, model, callback);
        };
         
        factory.updateRecord = function (model, callback) { // Método padrão para editar um registro
            return this.TOTVSUpdate({}, model, callback);
        };
         
        factory.deleteRecord = function (id, callback) { // Método padrão para remover um registro
            return this.TOTVSRemove({pNrRequisicao: id}, callback);
        };

        return factory;
    };

	// ########################################################
	// ### Registers
	// ########################################################	
    index.register.factory('mcc.ccapi354.Factory', factoryRequest);
});
