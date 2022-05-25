define(['index',
        '/dts/mab/js/zoom/mmv-tar-ord-manut.js',
        '/dts/mmi/js/zoom/pend-padrao.js'], function(index) {

	criarImpedimentoCtrl.$inject = [	                              
		'$rootScope',	         
		'$scope',
		'$modalInstance',
		'TOTVSEvent',
		'model',
        'fchmip.dashboard.Factory',
		'helperOrder',
		'$filter'
	];
	
	function criarImpedimentoCtrl($rootScope, 
							 $scope,
							 $modalInstance,
							 TOTVSEvent,
							 model,
                             dashboardFactory,
							 helperOrder,
							 $filter) {
	
		var criarImpedimentoCtrl = this;
		
		// *********************************************************************************
	    // *** Funções
	    // *********************************************************************************
	
		criarImpedimentoCtrl.init = function() {
            criarImpedimentoCtrl.ttImpedimento = {'nrOrdProdu': model.nrOrdProdu,
                                                  'numIdOrd': model.numIdOrd};
            criarImpedimentoCtrl.ttImpedimento.dtIniImped = new Date();
            criarImpedimentoCtrl.username = $rootScope.currentuser.username;
            criarImpedimentoCtrl.ttImpedimento.codUsuarCriac = $rootScope.currentuser.login;
            
            helperOrder.data.nrOrdemFiltro = criarImpedimentoCtrl.ttImpedimento.nrOrdProdu;    
		}
		
		criarImpedimentoCtrl.criaImpedimento = function () {
			validaHora();
			if (criarImpedimentoCtrl.ttImpedimento.codMotivo === undefined){
				criarImpedimentoCtrl.ttImpedimento.codMotivo = "";
			}else{
				criarImpedimentoCtrl.ttImpedimento.codMotivo = criarImpedimentoCtrl.ttImpedimento.codMotivo['cd-pend-padr'];
            }
            
			criarImpedimentoCtrl.ttImpedimento.desObs = criarImpedimentoCtrl.ttImpedimento.desObs === undefined ? "" :criarImpedimentoCtrl.ttImpedimento.desObs;

			dashboardFactory.enviaOrdemImpedimento(criarImpedimentoCtrl.ttImpedimento, criaImpedimentoCallback);
        }
        
        var criaImpedimentoCallback = function(result) {
			if (!result.hasError) {				
				orderNumber = $filter("orderNumberMask")(criarImpedimentoCtrl.ttImpedimento.nrOrdProdu);

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
		            type: 'success',
                    title: $rootScope.i18n('l-impediment-created'),
					detail: $rootScope.i18n('msg-impediment-created', orderNumber)
				});

				criarImpedimentoCtrl.fechar();
			}			
		};
		
		var validaHora = function() {
			if (criarImpedimentoCtrl.ttImpedimento.horaIniImped.substring(1,2) === ":") {
				criarImpedimentoCtrl.ttImpedimento.horaIniImped = "0" + criarImpedimentoCtrl.ttImpedimento.horaIniImped;
			}
		}	
	
		criarImpedimentoCtrl.fechar = function () {
			$modalInstance.close();
	    }
		
		criarImpedimentoCtrl.cancelar = function () {
			$modalInstance.dismiss('cancel');
		}
				
	    if ($rootScope.currentuserLoaded) { criarImpedimentoCtrl.init(); }
	    
	    $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {		 
		    $modalInstance.dismiss('cancel');
		});
	     
	    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
	    	criarImpedimentoCtrl.init();
	    });
	}
	
    index.register.controller("mmi.sprint.CriarImpedimentoCtrl", criarImpedimentoCtrl);
    
    index.register.service('helperOrder', function(){
        return {
            data :{}
        };
    });
});