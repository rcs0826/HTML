define(['index',
        '/dts/mab/js/zoom/mmv-plandor.js',
        '/dts/mmi/js/zoom/causa-padr.js',
        '/dts/mmi/js/zoom/sintoma.js',
        '/dts/mab/js/zoom/mmv-setor-ofici.js',
        '/dts/mab/js/zoom/mmv-ofici.js'
    ], function(index) {

	/**
	 * Controller Detail
	 */
	ordemManutencaoModalCtrl.$inject = [
		'$rootScope',
		'$scope',
		'TOTVSEvent',
        '$modalInstance',
        'model',
        'fchmip.programacao.Factory',
        'mab.mmv-plandor.zoom',
        'mmi.causa.zoom',
        'mmi.sintoma.zoom',
        'mab.mmvSetorOfici.zoom',
        'mab.oficina.zoom',
        '$filter'
	];

	function ordemManutencaoModalCtrl($rootScope,
                                      $scope,
                                      TOTVSEvent,
                                      $modalInstance,
                                      model,
                                      programacaoFactory,
                                      serviceZoomMmvPlandor,
                                      serviceZoomCausa,
                                      serviceZoomSintoma,
                                      serviceZoomMmvSetorOfici,
                                      serviceZoomOficina,
                                      $filter) {
		
        var ordemManutencaoModalCtrl = this;
            
        ordemManutencaoModalCtrl.init = function() {
            ordemManutencaoModalCtrl.model = {};
            ordemManutencaoModalCtrl.ttProgramacao    = model.ttProgramacao;
            ordemManutencaoModalCtrl.ttEventosBacklog = model.ttEventosBacklog;
            ordemManutencaoModalCtrl.ttSprint         = model.ttSprintSelecionada;
            ordemManutencaoModalCtrl.ttEquipamento    = model.ttEquipamento;
            ordemManutencaoModalCtrl.model.datEntr    = ordemManutencaoModalCtrl.ttSprint.dataInicial;
            ordemManutencaoModalCtrl.model.datTerm    = ordemManutencaoModalCtrl.model.datEntr;
            ordemManutencaoModalCtrl.model.hraTerm    = "23:59";

            for (i = 0; i < ordemManutencaoModalCtrl.ttEventosBacklog.length; i++) {
                if (ordemManutencaoModalCtrl.ttEventosBacklog[i]["cd-tipo"] !== 0) {
                    ordemManutencaoModalCtrl.model.tpManut    = ordemManutencaoModalCtrl.ttEventosBacklog[i]["cd-tipo"];
                    break;
                }
            }
        }

        ordemManutencaoModalCtrl.salvar = function() {
            var params = {};
            params.ttOrdemBacklog   = ordemManutencaoModalCtrl.model;
            params.ttEventosBacklog = ordemManutencaoModalCtrl.ttEventosBacklog;
            params.ttProgramacao    = ordemManutencaoModalCtrl.ttProgramacao;
            params.ttSprint         = ordemManutencaoModalCtrl.ttSprint ;
            params.ttEquipamento    = ordemManutencaoModalCtrl.ttEquipamento;

            programacaoFactory.criaOmEventos(params, criaOmEventosCallback);
        };

        var criaOmEventosCallback = function(result){
        	if (result) {
        		model.result = {"ttEventosBacklog": result.ttEventosBacklog}; 
	            if (!result.hasError) {
	            	$rootScope.$broadcast(TOTVSEvent.showNotification, {
			            type: 'success',
	                    title: $rootScope.i18n('l-backlog'),
	                    detail: $rootScope.i18n('msg-success-order-created-number', $filter('orderNumberMask')(result.nrOrdProdu))
			        });
	            	$modalInstance.close('cancel');
	            }
        	}
        };
        
        ordemManutencaoModalCtrl.ajustaDataTermino = function () {
        	ordemManutencaoModalCtrl.model.datTerm = ordemManutencaoModalCtrl.model.datEntr;
		}
        
        ordemManutencaoModalCtrl.fechar = function(){
            $modalInstance.dismiss();
        }
        
        if ($rootScope.currentuserLoaded) {
            ordemManutencaoModalCtrl.init();
        }
            
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
        });
	}

	index.register.controller("mmi.sprint.ordem.OrdemManutencaoModalCtrl", ordemManutencaoModalCtrl);
});
