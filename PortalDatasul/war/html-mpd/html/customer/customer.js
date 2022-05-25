define(['index', 
        '/dts/mpd/js/userpreference.js', 
        '/dts/mpd/js/portal-factories.js',
        '/dts/dts-utils/js/lodash-angular.js',
        '/dts/mpd/js/api/fchdis0035api.js'], function (index) {
	
    index.stateProvider
	
    .state('dts/mpd/customer', {  
            abstract: true,
            template: '<ui-view/>'
    })
    .state('dts/mpd/customer.start', {
        url:'/dts/mpd/customer/:customerId',
	controller:'salesorder.customerdetail.Controller',
	controllerAs: 'controller',
	templateUrl:'/dts/mpd/html/customer/customer.html'
    })  
    
    customerCtrl.$inject = ['salesorder.customer.Factory', 
                            '$stateParams', 
                            'userPreference', 
                            'totvs.app-main-view.Service', 
                            'customization.generic.Factory',
                            'portal.getUserData.factory', 
                            '$filter',
                            'mpd.fchdis0035.factory'];

    function customerCtrl(customer, 
                          $stateParams, 
                          userPreference, 
                          appViewService, 
                          customService, 
                          userdata,
                          $filter,
                          fchdis0035) {
		
        var controller = this;
        var i18n = $filter('i18n');
        this.currentUserRoles  = [];
        this.newOrderInclusionFlow = false;
        this.logPermiteCotac = false;
					
        if (appViewService.startView(i18n('l-detail-of-customer') + $stateParams.customerId, 'salesorder.customerdetail.Controller', this)) {		
            
            var paramVisibleFieldsCarteiraClienteRepresDetalhe = {cTable: "carteira-cliente-repres-detalhe"};

			fchdis0035.getUserRoles({usuario: userdata['user-name']}, function(result){                
				controller.currentUserRoles = result.out.split(",");

				fchdis0035.getVisibleFields(paramVisibleFieldsCarteiraClienteRepresDetalhe, function(result) {

                    angular.forEach(result, function(value) {

                        if (value.fieldName === "novo-fluxo-inclusao-pedido") {
							controller.newOrderInclusionFlow = value.fieldEnabled; 
                        }
                        
                        if (value.fieldName === "btn-new-order") {
                            controller.btnOpenOrder = value.fieldEnabled;
						}
                        
                        if (value.fieldName === "log-permite-cotac") {
                           controller.logPermiteCotac = value.fieldEnabled;
                        }
                    });

                    
                    controller.carteiraClienteRepresDetalheVisibleFields = result;
                    controller.getProfileConfig();

                    customer.getCustomerDetails({codEmitente: $stateParams.customerId}, function(data) {
                        // chamada de ponto de customização
                        customService.callEvent ('salesorder.customer', 'afterLoadCustomer', {controller: controller});
                        
                        controller.customer = data;
                        controller.getCustomerContacts();
                    });
				});
			});
        }
        
        this.getProfileConfig = function(){

            controller.isRepresentative = false;
            controller.isCustomer = false;
            
            controller.showCustomer = false;

            controller.showAddress = false;	
            controller.showFinancial = false;
            controller.showCredit = false;
            controller.showFiscal = false;
            controller.showFaturam = false;


			for (var i = controller.currentUserRoles.length - 1; i >= 0; i--) {
				if(controller.currentUserRoles[i] == "representative"){
					controller.isRepresentative = true;
				}

				if(controller.currentUserRoles[i] == "customer"){
					controller.isCustomer = true;
				}
            }

            for (var i = controller.carteiraClienteRepresDetalheVisibleFields.length - 1; i >= 0; i--) {
                
  				if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "nome-emit"){
					controller.showCustomer = true;
                }

                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "endereco_text") controller.showAddress = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "endereco") controller.showAddress = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "bairro") controller.showAddress = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "cep") controller.showAddress = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "cidade") controller.showAddress = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "caixa-postal") controller.showAddress = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "pais") controller.showAddress = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "telefone[1]") controller.showAddress = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "telefone[2]") controller.showAddress = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "telefax") controller.showAddress = true;   
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "telef-modem") controller.showAddress = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "e-mail") controller.showAddress = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "home-page") controller.showAddress = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "cod-parceiro-edi") controller.showAddress = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "estado") controller.showAddress = true;		
        
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "cod-banco") controller.showFinancial = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "agencia") controller.showFinancial = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "conta-corren") controller.showFinancial = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "ins-banc[1]") controller.showFinancial = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "ins-banc[2]") controller.showFinancial = true;
                
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "ind-cre-cli") controller.showCredit = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "lim-credito") controller.showCredit = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "moeda-libcre") controller.showCredit = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "dt-lim-cred") controller.showCredit = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "lim-adicional") controller.showCredit = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "dt-fim-cred") controller.showCredit = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "ind-aval") controller.showCredit = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "ind-aval-embarque") controller.showCredit = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "nr-peratr") controller.showAddress = true;
                
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "natureza") controller.showFiscal = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "ins-estadual") controller.showFiscal = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "ins-municipal") controller.showFiscal = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "cod-suframa") controller.showFiscal = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "cod-cacex") controller.showFiscal = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "cod-inscr-inss") controller.showFiscal = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "insc-subs-trib") controller.showFiscal = true;		
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "contrib-icms") controller.showFiscal = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "log-optan-suspens-ipi") controller.showFiscal = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "log-calcula-pis-cofins-unid") controller.showFiscal = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "nr-tb-pauta") controller.showFiscal = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "nat-operacao") controller.showFiscal = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "nat-ope-ext") controller.showFiscal = true;
                
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "cod-transp") controller.showFaturam = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "nr-tabpre") controller.showFaturam = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "mo-fatur") controller.showFaturam = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "per-max-canc") controller.showFaturam = true;
                if(controller.carteiraClienteRepresDetalheVisibleFields[i]['fieldName'] == "per-minfat") controller.showFaturam = true;

			}


			controller.customerDetailProfileConfig = {fields: controller.carteiraClienteRepresDetalheVisibleFields,
											        isRepresentative: controller.isRepresentative,
                                                    isCustomer: controller.isCustomer,
                                                    showCustomer: controller.showCustomer,
                                                    showAddress: controller.showAddress,
                                                    showFinancial: controller.showFinancial,
                                                    showCredit: controller.showCredit,
                                                    showFiscal: controller.showFiscal,
                                                    showFaturam: controller.showFaturam
                                                };

        }
        
        this.getCustomerContacts = function(){
            
            if(controller.customerContacts == undefined){
                customer.getCustomerContacts({codEmitente: $stateParams.customerId}, function(result) {
                    controller.customerContacts = result;
                });	
            };
        };
        
        this.getCustomerDeliveryPlaces = function(){
            if(controller.customerDeliveryPlaces == undefined){
                customer.getCustomerDeliveryPlaces({codEmitente: $stateParams.customerId}, function(result) {
                    controller.customerDeliveryPlaces = result;
                });
            };
        };
        
        this.getCustomerSites = function(){
            if(controller.customerSites == undefined){
                customer.getCustomerSites({codEmitente: $stateParams.customerId}, function(result) {
                    controller.customerSites = result;
                });
            };
        };
        
        this.getCustomerInformers = function(){
            if(controller.customerInformers == undefined){
                customer.getCustomerInformers({codEmitente: $stateParams.customerId}, function(result) {
                    controller.customerInformers = result;
                });
            };
        };
        
        this.getCustomerItens = function(){
            if(controller.customerItens == undefined){
                customer.getCustomerItens({codEmitente: $stateParams.customerId}, function(result) {
                    controller.customerItens = result;
                });	
            }
        };
        
    } // function customerCtrl(loadedModules) 
    
    index.register.controller('salesorder.customerdetail.Controller', customerCtrl);   
});