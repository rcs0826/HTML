define([
	'index',
	'/dts/mla/js/api/fchdis0035.js',
	'/dts/mla/js/api/fchlapdocumentapproval.js',
	'/dts/mla/js/mlaService.js'
], function(index) {

	// ########################################################
	// ### CONTROLLER GERAL - Aprovação/Rejeição por E-mail
	// ########################################################
	approvalCtrl.$inject = ['$rootScope', 
							'$scope', 
							'$location',
							'TOTVSEvent',
							'mla.fchlapdocumentapproval.factory',
							'$injector',
							'mla.service.mlaService'];
	function approvalCtrl($rootScope, 
						  $scope, 
						  $location, 
						  TOTVSEvent, 
						  fchlapdocumentapproval,
						  $injector,
						  mlaService) {
		var ctrl = this;

        /*
		 * Objetivo: Executar os métodos iniciais da tela
		 * Parâmetros:
		 * Observações: Este é o primeiro método que é executado quando a tela é aberta.
		 */
		ctrl.init = function(){		
			
			encodeUrl = $location.url(); /*Caso informado caracteres especiais na URL, desfaz o encode*/
			$location.url(decodeURI(encodeUrl));
			
				
			ctrl.queryParams = $location.search();
			ctrl.successMsg = undefined;
			ctrl.errorMsg = undefined;
			ctrl.errorList = [];
			ctrl.transactionCode = undefined;

			if(ctrl.queryParams.hid_empresa){
				var companyId = ctrl.queryParams.hid_empresa;
				if($injector.has('CompanyInfo')){
					var CompanyInfo = $injector.get('CompanyInfo');
					//Se empresa logada for diferente da empresa da pendência efetua a troca de empresa
					if(CompanyInfo.getCompanyInfo().companyId != companyId){
						mlaService.changeCompany(companyId);					
					}else{
						ctrl.documentApproval();
					}
				}
			}
		};

		/*
		 * Objetivo: Executa a aprovação/rejeição do documento
		 * Parâmetros:
		 * Observações: 
		 */
		ctrl.documentApproval = function(){
			
			/* Paliativo Framework: 
				Precisa ser realizado um GET antes do POST devido a autenticação do contexto, 
				pois ao retornar da autenticação a requisição é disparada como GET.*/
			fchlapdocumentapproval.get({}, function(){
				ctrl.transactionCode = ctrl.queryParams.hid_nr_trans;

				//Seta parâmetros comuns entre aprovação e rejeição
				var params = {username : $rootScope.currentuser.login,            
								userComment  : ctrl.queryParams.w_narrativa_usuar,          
								transactionCode  : ctrl.queryParams.hid_nr_trans 
							};

				//Executa a aprovação
				if (ctrl.queryParams.action == "Aprovar"){
					params['transactionNotification'] = ctrl.queryParams.notifica_usuar_trans_aprova;
					params['documentNotification'] = ctrl.queryParams.notifica_usuar_doc_aprova;

					fchlapdocumentapproval.approveDocument(params,function(result){
						if(!result['hasError']){
							ctrl.successMsg = $rootScope.i18n('l-document-success-approved-msg') + ".";
							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('l-approval'),
								detail: $rootScope.i18n('l-transaction') + ': ' + params['transactionCode'] + ', ' +
								($rootScope.i18n('l-approved')) + '!'
							});
						}else{
							ctrl.errorMsg = $rootScope.i18n('l-request-problem-ocurred-msg'); 
							ctrl.errorList = result['RowErrorsAux'];	
						}
					})
				//Executa a rejeição
				} else if(ctrl.queryParams.action == "Rejeitar"){
					params['rejectionCode'] = ctrl.queryParams.w_cod_rejeicao;
					params['transactionNotification'] = ctrl.queryParams.notifica_usuar_trans_rejeita;
					params['documentNotification'] = ctrl.queryParams.notifica_usuar_doc_rejeita;

					fchlapdocumentapproval.rejectDocument(params,function(result){
						if(!result['hasError']){
							ctrl.successMsg = $rootScope.i18n('l-document-success-rejected-msg') + "."; 
							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('l-rejection'),
								detail: $rootScope.i18n('l-transaction') + ': ' + params['transactionCode'] + ', ' +
								($rootScope.i18n('l-rejected')) + '!'
							});
						}else{
							ctrl.errorMsg = $rootScope.i18n('l-request-problem-ocurred-msg'); 
							ctrl.errorList = result['RowErrorsAux'];	
						}
					})
				 
				}
			});
			
		}

		/* Objetivo: Iniciar a tela (executa o método inicial) */
		if($rootScope.currentuserLoaded){
            ctrl.init();
		}

        /* Objetivo: Iniciar a tela (executa o método inicial ) */
		$scope.$on(TOTVSEvent.currentuserLoaded, function(event){
            ctrl.init();
		});
		
		
		/* Objetivo: realiza a ação de aprovar ou rejeitar após trocar a empresa */
		$scope.$on("mla.selectCompany.event", function (event, currentcompany) {
			ctrl.documentApproval();
		});

		/* Objetivo: Quando efetuada a troca de empresa pela DI */
		$rootScope.$on('DiCompanyChanged', function (event, companyId) {
			ctrl.documentApproval();
            $rootScope.$broadcast('companyChanged');
        });
	};


	// ########################################################
	// ### Registers
	// ########################################################
	index.register.controller('mla.approval.email.ctrl', approvalCtrl);
});
