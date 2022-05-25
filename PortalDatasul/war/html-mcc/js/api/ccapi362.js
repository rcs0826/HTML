define([
	'index',
], function(index) {
	
	// ########################################################
	// ### Factories
	// ########################################################  
    function factoryRequestQuotation($totvsresource) {
    
        var specificResources = {

             // # Purpose: Retorna os valores padrões para a criação de um processo de cotação
             // # Parameters: 
             // # Notes: 
            'getDefaultsQuotationProcess':{              
                method:'POST',
                isArray: false,
                params: {}, 
                url: '/dts/datasul-rest/resources/api/ccp/ccapi362/getDefaultsQuotationProcess/'
            },


             // # Purpose: Busca relação item x fornecedores das ordens de compras vinculadas a um processo de cotacao
             // # Parameters:              
             // # Notes:             
            'getItemFornecPurchaseOrder':{
                method:'POST',
                isArray:true,
                params:{},
                url: '/dts/datasul-rest/resources/api/ccp/ccapi362/getItemFornecPurchaseOrder/'

            },

            // # Purpose: Cria um processo de cotação com os valores default e retorna para tela
             // # Parameters: 
             // # Notes: 
             'getNewQuotationProcess':{              
                method:'POST',
                isArray: false,
                params: {}, 
                url: '/dts/datasul-rest/resources/api/ccp/ccapi362/getNewQuotationProcess/'
            },

             // # Purpose: Retorna os valores de um processo de cotação para alteração
             // # Parameters: 
             // #     pQuotationProcessNumber: Número do processo de cotação
             // # Notes: 
            'getQuotationProcess':{              
                method:'GET',
                isArray: false,
                params: {pQuotationProcessNumber: '@pQuotationProcessNumber'}, 
                url: '/dts/datasul-rest/resources/api/ccp/ccapi362/getQuotationProcess/'
            },
            
            // # Purpose: Retorna os valores do cabeçalho de um processo de cotação 
             // # Parameters: 
             // #     pQuotationProcessNumber: Número do processo de cotação
             // # Notes: 
            'getQuotationProcessHeader':{              
                method:'GET',
                isArray: true,
                params: {pQuotationProcessNumber: '@pQuotationProcessNumber'}, 
                url: '/dts/datasul-rest/resources/api/ccp/ccapi362/getQuotationProcessHeader/'
            },
            
            // # Purpose: Retorna as solicitações enviadas para uma ordem de compra
             // # Parameters: 
             // #     purchaseOrderNumber: Número da ordem de compra
             // # Notes: 
            'getSendedQuotationProcess':{              
                method:'GET',
                isArray: false,
                params: {purchaseOrderNumber: '@purchaseOrderNumber'}, 
                url: '/dts/datasul-rest/resources/api/ccp/ccapi362/getSendedQuotationProcess/'
            },

            // # Purpose: Retorna as solicitações enviadas para um processo de cotação
             // # Parameters: 
             // #     quotationProcessNumber: Número do processo de cotação
             // # Notes: 
             'getSendedQuotationProcessByProcess':{              
                method:'GET',
                isArray: false,
                params: {quotationProcessNumber: '@quotationProcessNumber'}, 
                url: '/dts/datasul-rest/resources/api/ccp/ccapi362/getSendedQuotationProcessByProcess/'
            },
            
             // # Purpose: Retorna informações sobre o envio de cotação para um determinado fornecedor e ordem
             // # Parameters: 
             // #     processQuotation: Número do processo de cotação
             // #     purchOrderLine: Número da ordem de compra
             // #     vendorNumber: Código do fornecedor
             // #     seq: Sequência do envio
             // # Notes: 
            'getSendedQuotationProcessDetail':{              
                method:'GET',
                isArray: true,
                params: {processQuotation: '@processQuotation', purchOrderLine: '@purchOrderLine', vendorNumber: '@vendorNumber', seq: '@seq'}, 
                url: '/dts/datasul-rest/resources/api/ccp/ccapi362/getSendedQuotationProcessDetail/'
            },

            // # Purpose: Retorna informações de detalhe do envio efetuado ao fornecedor 
             // # Parameters: 
             // #     processQuotation: Número do processo de cotação
             // #     vendorNumber: Código do fornecedor
             // #     seq: Sequência do envio
             // # Notes: 
             'getSendedDetailByProcessVendor':{              
                method:'GET',
                isArray: false,
                params: {processQuotation: '@processQuotation', vendorNumber: '@vendorNumber', seq: '@seq'}, 
                url: '/dts/datasul-rest/resources/api/ccp/ccapi362/getSendedDetailByProcessVendor/'
            },
       
            // # Purpose: Retorna informações sobre um fornecedor do processo de cotação
             // # Parameters: 
             // #     processQuotation: Número do processo de cotação
             // #     vendorNumber: Código do fornecedor
             // # Notes: 
            'getVendorDetail':{              
                method:'GET',
                isArray: true,
                params: {processQuotation: '@processQuotation', vendorNumber: '@vendorNumber'}, 
                url: '/dts/datasul-rest/resources/api/ccp/ccapi362/getVendorDetail/'
            },
       
             // # Purpose: Gravar os dados do processo de cotação 
             // # Parameters: 
             // # Notes: 
            'saveQuotationProcess':{              
                method:'POST',
                isArray: false,
                params: {}, 
                url: '/dts/datasul-rest/resources/api/ccp/ccapi362/saveQuotationProcess/'
            },
          
            // # Purpose: Gravar os dados de fornecedores de ordens do processo
             // # Parameters: 
             // # Notes: 
            'saveItemFornecPurchaseOrder':{              
                method:'POST',
                isArray: false,
                params: {}, 
                url: '/dts/datasul-rest/resources/api/ccp/ccapi362/saveItemFornecPurchaseOrder/'
            },
          
             // # Purpose: Gravar os dados de fornecedores de ordens de todo o processo de cotação
             // # Parameters: 
             // # Notes: 
            'saveItemFornecByProcessQuotation':{              
                method:'POST',
                isArray: false,
                params: {}, 
                url: '/dts/datasul-rest/resources/api/ccp/ccapi362/saveItemFornecByProcessQuotation/'
            },
             // # Purpose: Gravar os dados de fornecedores de ordens de todo o processo de cotação
             // # Parameters: 
             // # Notes: 
            'saveVendorQuotationProcess':{              
                method:'POST',
                isArray: false,
                params: {}, 
                url: '/dts/datasul-rest/resources/api/ccp/ccapi362/saveVendorQuotationProcess/'
            },
             // # Purpose: Gravar os dados de configuração de e-mail do processo de cotação
             // # Parameters: 
             // # Notes: 
            'saveQuotationProcessConfigEmail':{              
                method:'POST',
                isArray: false,
                params: {}, 
                url: '/dts/datasul-rest/resources/api/ccp/ccapi362/saveQuotationProcessConfigEmail/'
            },
             // # Purpose: Busca dados referente a integração com o Clicbusiness 
             // # Parameters: 
             // # Notes: 
            'returnIntegrationClicbusiness':{              
                method:'GET',
                isArray: true,
                params: {}, 
                url: '/dts/datasul-rest/resources/api/ccp/ccapi362/returnIntegrationClicbusiness/'
            },
           
             // # Purpose: Busca dados das famílias dos itens utilizadas para a 
             // #          busca de fornecedores no Clicbusiness 
             // # Parameters: 
             // # Notes: 
            'returnClicbusinessFamilyList':{              
                method:'POST',
                isArray: true,
                params: {}, 
                url: '/dts/datasul-rest/resources/api/ccp/ccapi362/returnClicbusinessFamilyList/'
            },

            // # Purpose: Vincula ordens de compra ao processo de cotação
             // # Parameters: 
             // # Notes: 
             'linkOrderlinesToQuotationProcess':{              
                method:'POST',
                isArray: false,
                params: {}, 
                url: '/dts/datasul-rest/resources/api/ccp/ccapi362/linkOrderlinesToQuotationProcess/'
            },
            // # Purpose: Valida desvinculação da ordem de compra do processo de cotação
            // # Parameters: pQuotationProcessNumber: Número do processo de cotação,
            //               pOrderLineNumber: Número da ordem de compra 
            // # Notes: 
            'validateDeleteQuotationProcessItem':{              
                method:'GET',
                isArray: false,
                params: {pQuotationProcessNumber: '@pQuotationProcessNumber', pOrderLineNumber: '@pOrderLineNumber'}, 
                url: '/dts/datasul-rest/resources/api/ccp/ccapi362/validateDeleteQuotationProcessItem/'
            },

            // # Purpose: Desvincula ordem de compra do processo de cotação
            // # Parameters: pQuotationProcessNumber: Número do processo de cotação,
            //               pOrderLineNumber: Número da ordem de compra
            // # Notes: 
            'unlinkOrderLineFromQuotationProcess':{              
                method:'DELETE',
                isArray: false,
                params: {pQuotationProcessNumber: '@pQuotationProcessNumber', pOrderLineNumber: '@pOrderLineNumber'}, 
                url: '/dts/datasul-rest/resources/api/ccp/ccapi362/unlinkOrderLineFromQuotationProcess/'
            },

            // # Purpose: Vincula um fornecedor a um processo de cotação
            // # Parameters: pQuotationProcessNumber: Número do processo de cotação,
            //               pVendorNumber: Código do fornecedor
            // # Notes: 
            'linkVendorsToQuotationProcess':{
                method:'POST',
                isArray: false,
                params: {pQuotationProcessNumber: '@pQuotationProcessNumber', pVendorNumber: '@pVendorNumber'}, 
                url: '/dts/datasul-rest/resources/api/ccp/ccapi362/linkVendorsToQuotationProcess/'
            },

            // # Purpose: Desvincula fornecedor do processo de cotação
            // # Parameters: pQuotationProcessNumber: Número do processo de cotação,
            //               pVendorCode: Código do fornecedor
            // # Notes: 
            'unlinkVendorFromQuotationProcess':{              
                method:'DELETE',
                isArray: false,
                params: {pQuotationProcessNumber: '@pQuotationProcessNumber', pVendorCode: '@pVendorCode'}, 
                url: '/dts/datasul-rest/resources/api/ccp/ccapi362/unlinkVendorFromQuotationProcess/'
            },
            
            // # Purpose: Imprime planilha das ordens vinculadas a solicitação de cotação sem fornecedores
            // # Parameters: pQuotationProcessNumber: Número do processo de cotação
            // # Notes: 
            'printSpreadSheetWithoutVendor':{              
                method:'GET',
                isArray: false,
                params: {pQuotationProcessNumber: '@pQuotationProcessNumber'}, 
                url: '/dts/datasul-rest/resources/api/ccp/ccapi362/printSpreadSheetWithoutVendor/'
            },

            // # Purpose: Imprime planilha das ordens vinculadas a solicitação de cotação sem fornecedores
            // # Parameters: pQuotationProcessNumber: Número do processo de cotação
            // #             pVendorCode: Código do fornecedor
            // #             pSuggestVendorRelated: Sugere Fornecedores relacionados
            // # Notes: 
            'printSpreadSheetWithVendor':{              
                method:'GET',
                isArray: false,
                params: {pQuotationProcessNumber: '@pQuotationProcessNumber',
                         pVendorCode: '@pVendorCode',
                         pSuggestVendorRelated: '@pSuggestVendorRelated'}, 
                url: '/dts/datasul-rest/resources/api/ccp/ccapi362/printSpreadSheetWithVendor/'
            },

			// # Purpose: Busca informações de ordens e fornecedores para 
            // #          apresentação na tela de confirmação do envio
            // # Parameters: pQuotationProcessNumber: Número do processo de cotação,
            //               pSuggestVendorRelated: Sugere Fornecedores relacionados
            // # Notes: 
            'getSendingConfirmInfo': {
                method: 'GET',
                isArray: true,
                params: {pQuotationProcessNumber: '@pQuotationProcessNumber', 
                         pSuggestVendorRelated: '@pSuggestVendorRelated'}, 
                url: '/dts/datasul-rest/resources/api/ccp/ccapi362/sendingConfirmInfo/'
            },

            // # Purpose: Envia as ordens para cotação dos fornecedores
            // # Parameters: 
            // # Notes: 
            'sendQuotationProcess':{
                method:'POST',
                isArray: false,
                params: {}, 
                url: '/dts/datasul-rest/resources/api/ccp/ccapi362/sendQuotationProcess/'
            },

            // # Purpose: Busca os processos de cotação
            // # Parameters: 
            // # Notes: 
            'getListQuotationProcess': { 
                method: 'POST',
                isArray: false,
                url: '/dts/datasul-rest/resources/api/ccp/ccapi362/getListQuotationProcess/',
                params: {}       
            },  

            // # Purpose: Remover o processo de cotação
            // # Parameters: pQuotationProcessNumber: Número do processo de cotação
            // # Notes: 
            'removeQuotationProcess':{              
                method:'DELETE',
                isArray: false,
                params: {pQuotationProcessNumber: '@pQuotationProcessNumber'}, 
                url: '/dts/datasul-rest/resources/api/ccp/ccapi362/removeQuotationProcess/'
            },
        };  
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/ccp/ccapi362', {}, specificResources);

        return factory;
    }

	// ########################################################
	// ### Registers
	// ########################################################	
    index.register.factory('mcc.ccapi362.Factory', factoryRequestQuotation);
});
