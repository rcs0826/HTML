define(['index',
		'/dts/mmi/js/utils/filters.js'
		], function(index) {

	especialidadeCtrl.$inject = [
		'$rootScope',
		'$scope',
		'TOTVSEvent',
		'fchmip.programacao.Factory',
		'helperEspecialidade',
		'helperSprint'
	];

	function especialidadeCtrl($rootScope,
                                $scope,
                                TOTVSEvent,
                                programacaoFactory,
								helperEspecialidade,
								helperSprint) {
		
		especialidadeCtrl = this;
		
		especialidadeCtrl.init = function() {
			especialidadeCtrl.params = {};
		}
		
		var buscaEspecialidades = function(args) {
			especialidadeCtrl.lista = [];
			
			if (!args) return;
			
			var ttProgramacao = args[0].ttProgramacao;
			
			programacaoFactory.buscaEspecialidades(ttProgramacao, buscaEspecialidadesCallback);
		}
		
		var buscaEspecialidadesCallback = function(result) {
			especialidadeCtrl.lista = result;
            
            $rootScope.$emit('hhProgramacaoEspecialidadeEvent', helperEspecialidade.data.especialidade);
		}
		
		especialidadeCtrl.selecionado = function(espec){
            if(helperEspecialidade.data.especialidade && helperEspecialidade.data.especialidade.codigo == espec.codigo){
                return 'especialidade-selecionada';
            } else {
                return '';
            }
        }
		
		especialidadeCtrl.obterAltura = function() {
			return {
				height: (window.innerHeight - 124) + 'px',
				'overflow-y': 'auto'
			};
		}

		especialidadeCtrl.carregaCapacidadeTurno = function() {
			if (!validaPeriodo(helperSprint.data.ttSprint)) {
				return;
			}
			
			especialidadeCtrl.params.ttSprint = helperSprint.data.ttSprint;
			especialidadeCtrl.params.ttEspecialidade = especialidadeCtrl.lista;
			var especialidade = helperEspecialidade.data.especialidade;

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-question',
				text: $rootScope.i18n('msg-confirm-calc-hours-shift'),
				cancelLabel: 'l-no',
				confirmLabel: 'l-yes',
				callback: function(isPositiveResult) {
					if (isPositiveResult) {
						programacaoFactory.capacidadeTurnoEspecialidade(especialidadeCtrl.params, function(result){
							if (especialidade.codigo) $rootScope.$broadcast('hhRecarregarProgramacaoEspecialidade', especialidade);
						});
					}
				}
			});
		};

		especialidadeCtrl.carregaCargaOm = function() {
			if (!validaPeriodo(helperSprint.data.ttSprint)) {
				return;
			}

			especialidadeCtrl.params.ttEspecialidade = especialidadeCtrl.lista;
			especialidadeCtrl.params.ttSprint = helperSprint.data.ttSprint;
			var especialidade = helperEspecialidade.data.especialidade;

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-question',
				text: $rootScope.i18n('msg-confirm-hours-om'),
				cancelLabel: 'l-no',
				confirmLabel: 'l-yes',
				callback: function(isPositiveResult) {
					if (isPositiveResult) {
						programacaoFactory.cargaOMEspecialidade(especialidadeCtrl.params, function(result){
							if (especialidade.codigo) $rootScope.$broadcast('hhRecarregarProgramacaoEspecialidade', especialidade);
						});
					}
				}
			});
		};

		var validaPeriodo = function(sprints) {
			var sprintPlanejada = false;
			
			angular.forEach(sprints, function(sprint){
				if (sprint.situacao === 2) {					
					sprintPlanejada = true;
				}
			});

			if (sprintPlanejada === false) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					detail: $rootScope.i18n('msg-no-periods-planning')
				});				
			}

			return sprintPlanejada;
		}

		especialidadeCtrl.selecionaEspecialidade = function(event, especialidade) {
			removeSelecionado()
            
            helperEspecialidade.data.especialidade = especialidade;
            
			$(event.target).addClass('especialidade-selecionada');
			
			$rootScope.$broadcast('hhProgramacaoEspecialidadeEvent', especialidade);
		}
		
		var removeSelecionado = function() {
	        var els = document.getElementsByClassName("div-nivel-especialidade");
	        Array.prototype.forEach.call(els, function(el) {
	        	$(el).removeClass('especialidade-selecionada');
	        });
		}

		if ($rootScope.currentuserLoaded) { this.init(); }
	
	    $rootScope.$on('especialidadeProgramacaoEvent', function(event, args) {
            if(this.planningCtrl.carregaDados){
                buscaEspecialidades(args);
                
                this.planningCtrl.carregaDados = false;
            }
		});
	    
		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			especialidadeCtrl.init();
		});
	}

	index.register.controller("mmi.sprint.EspecialidadeCtrl", especialidadeCtrl);
    index.register.service('helperEspecialidade', function(){
        return {
            data :{}
        };
    });
});
