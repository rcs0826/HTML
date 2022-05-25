/*global angular */
define(['index',
		'/dts/mpd/js/api/fchdis0048.js',
		'/dts/mpd/js/portal-factories.js',
		'/dts/mpd/js/zoom/emitente.js',
		'/dts/mpd/js/api/fchdis0035api.js'], function(index) {

	selectedCustomerCtrl.$inject = ['$rootScope', 'mpd.customerapd.Factory', 'mpd.fchdis0035.factory', 'portal.getUserData.factory'];

	function selectedCustomerCtrl($rootScope, custSelected, fchdis0035, userdata) {
		var selectedCustCtrl = this;
		this.currentUserRoles  = [];
		this.newOrderInclusionFlow = false;

		this.loadDataCustomer = function(params){

				paramVisibleFieldsCarteiraClienteRepres = {cTable: "carteira-cliente-repres"};

				fchdis0035.getVisibleFields(paramVisibleFieldsCarteiraClienteRepres, function(result) {
					
					angular.forEach(result, function(value) {
						if (value.fieldName === "novo-fluxo-inclusao-pedido") {
							selectedCustCtrl.newOrderInclusionFlow = value.fieldEnabled; 
						}
					});


					if (selectedCustCtrl.codEmitente) {
						custSelected.findByCustomerCode(params, function(values) {

							//Performance - Recarrega o filtro por cliente selecionado nos portlets apenas se houver troca do cliente selecionado
							if((!$rootScope.selectedcustomer) || ($rootScope.selectedcustomer['cod-emitente'] != selectedCustCtrl.codEmitente)){
								$rootScope.selectedcustomer = values[0];
								$rootScope.$broadcast('selectedcustomer');
							}

							//Monta lista de telefones
							selectedCustCtrl.phonelist = "";
							angular.forEach($rootScope.selectedcustomer['telefone'], function(value, key) {
								if(selectedCustCtrl.phonelist != ""){
									if(value != "") selectedCustCtrl.phonelist = selectedCustCtrl.phonelist + ' | ' + value;
								}else{
									selectedCustCtrl.phonelist = value;
								}
							});
						});
						selectedCustCtrl.showCustomer = true;
					}else{
						//Recarrega os portlets para modo sem filtro se não houver um cliente selecionado
						selectedCustCtrl.showCustomer = false;
						$rootScope.selectedcustomer = undefined;
						$rootScope.$broadcast('selectedcustomer');
					}
				});	

		}

		this.applySimpleFilter = function() {
			var params = {};
			params.codEmitente = selectedCustCtrl.codEmitente;
			selectedCustCtrl.loadDataCustomer(params);
		};

		//Verificação utilizada quando é retornado de outra tela para o dashboard através das abas do menu,
		//desta forma recarregando os dados do cliente selecionado
		if($rootScope.selectedcustomer){
			var params = {};
			params.codEmitente = $rootScope.selectedcustomer['cod-emitente'];
			selectedCustCtrl.codEmitente = $rootScope.selectedcustomer['cod-emitente'];
			selectedCustCtrl.loadDataCustomer(params);
		}

		this.getProfileConfig = function(){

			selectedCustCtrl.isRepresentative = false;
			selectedCustCtrl.isCustomer = false;


			for (var i = selectedCustCtrl.currentUserRoles.length - 1; i >= 0; i--) {

				if(selectedCustCtrl.currentUserRoles[i] == "representative"){
					selectedCustCtrl.isRepresentative = true;
				}

				if(selectedCustCtrl.currentUserRoles[i] == "customer"){
					selectedCustCtrl.isCustomer = true;
				}
			}
		}

		/******* initialize *****/
		fchdis0035.getUserRoles({usuario: userdata['user-name']}, function(result){

			selectedCustCtrl.currentUserRoles = result.out.split(",");
			selectedCustCtrl.getProfileConfig();

		}, true);

		//Define se deve exibir informações do cliente ou mensagem de cliente não selecionado
		selectedCustCtrl.showCustomer = false;

		/******* events *****/
		$rootScope.$on('selectedRepresentatives', function(event) {
			if ($rootScope.selectedRepresentatives){
				selectedCustCtrl.repres = " ";
				angular.forEach($rootScope.selectedRepresentatives, function (value) {
					selectedCustCtrl.repres = selectedCustCtrl.repres + value['cod-rep'] + '|';
				});
				selectedCustCtrl.codEmitente = "";
				selectedCustCtrl.applySimpleFilter();
			}
		});

	}

	index.register.controller('apd.dashboard.selectedcustapd.Controller', selectedCustomerCtrl);

});
