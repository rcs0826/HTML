define(['index',
		'/dts/mmi/js/utils/filters.js',
		'/dts/mmi/html/sprint/dashboard/dashboard-maintenance-especialidade-grid.js',
		], function(index) {

	especialidadeCtrl.$inject = [
		'$rootScope',
		'$scope',
		'fchmip.programacao.Factory',
		'fchmip.dashboard.Factory',
		'mmi.utils.Service',
		'i18nFilter'
	];

	function especialidadeCtrl($rootScope,
                                $scope,
								programacaoFactory,
								dashboardFactory,
								mmiUtils,
								i18n) {
		
		especialidadeCtrl = this;
		
		especialidadeCtrl.init = function() {
			especialidadeCtrl.lista = [];
			especialidadeCtrl.buscaEspecialidades();
		};

		especialidadeCtrl.buscaEspecialidades = function(){
			programacaoFactory.buscaEspecialidPeriodo(especialidadeCtrl.ttSprint, function(result){
				especialidadeCtrl.lista = result;
			});
		};

		especialidadeCtrl.obterAltura = function() {
			return {
				height: (window.innerHeight - 124) + 'px',
				'overflow-y': 'auto'
			};
		};
		
		especialidadeCtrl.selecionaEspecialidade = function(event) {
			especialidadeCtrl.removeSelecionado();
			$(event.target).addClass('especialidade-selecionada');
			$rootScope.$broadcast('gridEspecialidade', especialidadeCtrl);
		};

		especialidadeCtrl.removeSelecionado = function() {
			var els = document.getElementsByClassName("div-nivel-especialidade");
			
	        Array.prototype.forEach.call(els, function(el) {
	        	$(el).removeClass('especialidade-selecionada');
	        });
		};

	    $scope.$on('especialidadeAcompanhamentoEvent', function(event, args) {
				especialidadeCtrl.ttSprint = args[0].ttSprint;
				especialidadeCtrl.ttProgramacao = args[0].ttProgramacao;
				especialidadeCtrl.init();
				
		});

		especialidadeCtrl.exportaHorasTotaisEspecialidadesCsv = function() {

			var params = {
				'ttSprint': especialidadeCtrl.ttSprint,
				'ttEspecialidade': especialidadeCtrl.lista,
				'ttProgramacao': especialidadeCtrl.ttProgramacao
			};

			especialidadeCtrl.filename = i18n('l-speciality-view-file', [], 'dts/mmi')  + '.csv';							

			dashboardFactory.exportaHorasTotaisEspecialidadesCsv(params, exportaCsvCallback);
				
		}

		var exportaCsvCallback = function(result){
			mmiUtils.geraCsv(result, especialidadeCtrl.filename); 
		}

	}

	index.register.controller("mmi.dashboard.EspecialidadeCtrl", especialidadeCtrl);
});
