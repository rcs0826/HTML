define(['index',
		'/dts/mpd/js/zoom/estabelec.js',
		'/dts/mmi/js/zoom/tag.js',
		'/dts/mmi/js/zoom/tipo-manut.js',
		'/dts/mab/js/zoom/mmv-plandor.js',
		'/dts/mab/js/zoom/mmv-ofici.js',
		'/dts/mab/js/zoom/mmv-setor-ofici.js',
		'/dts/mmi/js/zoom/equipto.js',
		'/dts/mab/js/zoom/mab-model.js',
		'/dts/mab/js/zoom/mmv-plano-prevent.js',
		'/dts/mab/js/zoom/mab-grp-eqpto.js',
		'/dts/mab/js/zoom/mab-eqpto.js'
		], function(index) {

	/**
	 * Controller Detail
	 */
	programacaoCtrl.$inject = [
		'$rootScope',
		'$scope',
		'TOTVSEvent',
		'$modalInstance',
		'$timeout',
		'fchmip.programacao.Factory',
		'model'
	];

	function programacaoCtrl($rootScope,
                            $scope,
                            TOTVSEvent,
							$modalInstance,
							$timeout,
							programacaoFactory,
							model) {
		
		var programacaoCtrl = this;
		
		programacaoCtrl.init = function() {
			carregaCombos();
			iniciaVariaveis();
			setFocus();
		}

        var carregaCombos = function(){
			programacaoCtrl.opcaoTipoPlanejamento = [
				{value: 1, label: $rootScope.i18n('l-Industrial-maintenence')}, 
				{value: 2, label: $rootScope.i18n('l-mechanical-maintenance')}];
	  
			programacaoCtrl.opcaoPlanejamento = [
				{value: 1, label: $rootScope.i18n('l-weekly')}, 
				{value: 2, label: $rootScope.i18n('l-monthly')},
				{value: 3, label: $rootScope.i18n('l-customise')}];

			programacaoCtrl.opcaoStatus = [
				{value: 1, label: $rootScope.i18n('l-active')},
				{value: 2, label: $rootScope.i18n('l-inact')}];

			programacaoCtrl.opcaoInteracao = [
				{value: 1, label: 1}, 
				{value: 2, label: 2},
				{value: 3, label: 3},
				{value: 4, label: 4}];
		}

		var iniciaVariaveis = function(){
			if(model.isNew){
				programacaoCtrl.model = model;
				model.ttProgramacao = {};
				model.ttParametros = {};
				programacaoCtrl.model.ttProgramacao['idi-tip-programac'] = 2;
				programacaoCtrl.model.ttProgramacao['idi-tip-programac-sprint'] = 1;
				programacaoCtrl.model.ttProgramacao['idi-status-programac'] = 1;
				programacaoCtrl.model.ttProgramacao['num-dias-interac'] = 1;
				programacaoCtrl.model.ttProgramacao['dat-inicial-programac'] = new Date();
				programacaoCtrl.headerTitle = $rootScope.i18n('l-add-programming');
			} else {
				programacaoCtrl.model = Object.assign({}, model);
				programacaoCtrl.headerTitle = $rootScope.i18n('l-edit-programming');
				verificaEstadoProgramacao();
			}
		}
		
		var setFocus = function() {
	    	$timeout(function() {
	    		$('#cod-programac').find('*').filter(':input:visible:first').focus();
	        },500);
		}
		
		var verificaEstadoProgramacao = function (){

			var arr = programacaoCtrl.model.ttSprint.filter(function(programacao){
				return programacao.situacao === 2  ;
			});
			if(arr.length > 0){
				programacaoCtrl.model.naoPermiteAlteracao = true;
			} 
		};

		programacaoCtrl.salvar = function() {
			var params = {};
			parametros();

			params.ttProgramacao = programacaoCtrl.model.ttProgramacao;
			params.ttParametros = programacaoCtrl.parametros;
			
			if (model.isNew) {
				programacaoFactory.adicionar(params, adicionarCallback);
			} else {
				$rootScope.$broadcast(TOTVSEvent.showQuestion, {
					title: 'l-question',
					text: $rootScope.i18n('l-confirm-change-prog-parameters', programacaoCtrl.model.ttProgramacao['cod-programac']),
					size: 'md',
					cancelLabel: 'l-no',
					confirmLabel: 'l-yes',

					callback: function(isPositiveResult) {
						if (isPositiveResult) {
				        	programacaoFactory.alterar(params, alterarCallback);
						}
					}
				});

			}
		}
		
		var adicionarCallback = function(result) {
			if(result && result.numIdProgramac > 0){
				programacaoCtrl.model.ttProgramacao['num-id-programac'] = result.numIdProgramac;
				model.ttParametrosAux       = programacaoCtrl.parametros;
				model.ttSprint              = result.ttSprint;
				model.ttPeriodoProgramacao  = result.ttPeriodoProgramacao;
				model.ttDescricaoParametros = result.ttDescricaoParametros;
				sucessNotify();
                programacaoCtrl.fechar();
			}
		} 
		
		var alterarCallback = function(result) {
			if(result && result.ttPeriodoProgramacao.length > 0){
				model.ttProgramacao         = programacaoCtrl.model.ttProgramacao;
				model.ttParametros          = programacaoCtrl.model.ttParametros;
				model.ttParametrosAux       = programacaoCtrl.parametros;
				model.ttSprint              = result.ttSprint;
				model.ttPeriodoProgramacao  = result.ttPeriodoProgramacao;
				model.ttDescricaoParametros = result.ttDescricaoParametros;
				programacaoCtrl.model.ttProgramacao['log-filtro-alterado'] = result.pLogFiltroAlterado;
				sucessNotify();
				programacaoCtrl.fechar();
			}
		}
		
		var parametros = function() {
			programacaoCtrl.parametros = [];
			buscaParametro(programacaoCtrl.model.ttParametros.estabelec, 1, "cod-estabel");
			buscaParametro(programacaoCtrl.model.ttParametros.tag, 2, "cd-tag");
			buscaParametro(programacaoCtrl.model.ttParametros.planejador, 3, "cod-plandor");
			buscaParametro(programacaoCtrl.model.ttParametros.oficina, 4, "cod-ofici");
			buscaParametro(programacaoCtrl.model.ttParametros.setor, 5, "cod-setor-ofici");
			buscaParametro(programacaoCtrl.model.ttParametros.tipoManut, 6, "cd-tipo");
			buscaParametro(programacaoCtrl.model.ttParametros.modelo, 7, "cod-model");
			buscaParametro(programacaoCtrl.model.ttParametros.plano, 8, "cod-plano");
			buscaParametro(programacaoCtrl.model.ttParametros.grupo, 9, "cod-grp-eqpto");
			buscaParametro(programacaoCtrl.model.ttParametros.equipamento, 10, "cod-eqpto");
		}
		
		var buscaParametro = function(obj, param, atr) {
			if (obj) {
				if (obj.objSelected) {
					angular.forEach(obj.objSelected, function(parametro){
						programacaoCtrl.parametros.push({"idi-cod-param": param, "des-val-param": parametro[atr]});
					});
				} else {
					programacaoCtrl.parametros.push({"idi-cod-param": param, "des-val-param": obj});
				}
			}
		}
		
		var sucessNotify = function() {
            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                type: 'success',
                title: (model.isNew ? $rootScope.i18n('msg-record-created') : $rootScope.i18n('msg-record-updated')),
                detail: (model.isNew ? $rootScope.i18n('msg-record-success-created') : $rootScope.i18n('msg-record-success-updated'))
            });
		}
		
		if ($rootScope.currentuserLoaded) {
            programacaoCtrl.init(); 
		}

		programacaoCtrl.fechar = function(){
			$modalInstance.close('cancel');
		}
		
		programacaoCtrl.cancelar = function(){
			$modalInstance.dismiss('cancel');
		}

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {         
            $modalInstance.dismiss('cancel');
		});
		
	    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
	        controller.init();
	    });
	}

	index.register.controller("mmi.sprint.ProgramacaoCtrl", programacaoCtrl);
});
