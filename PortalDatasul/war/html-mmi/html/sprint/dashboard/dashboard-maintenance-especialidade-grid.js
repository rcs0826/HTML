define(['index',
		'/dts/mmi/js/utils/filters.js'
		], function(index) {

	especialidadeGridCtrl.$inject = [
		'$rootScope',
		'$scope',
        'TOTVSEvent',
        '$filter',
		'fchmip.dashboard.Factory'
	];

	function especialidadeGridCtrl($rootScope,
                                   $scope,
                                   TOTVSEvent,
                                   $filter,
                                   dashboardFactory) {
		
        especialidadeGridCtrl = this;
        
        especialidadeGridCtrl.init = function() {
            especialidadeGridCtrl.dataAte = "";
            especialidadeGridCtrl.tituloEspecialidade = $rootScope.i18n('l-no-specialty-selected');
        };

        var calculaTotal = function(){
            var total = 0;
            var totalPeriodo = 0;
            var total2 = 0;
            var totalPeriodo2 = 0;
            
            if(especialidadeGridCtrl.capacidadePrev.length > 0){
                especialidadeGridCtrl.capacidadePrev.forEach(function(value){
                    total += value.valPrevisAte;
                    totalPeriodo += value.valPrevis;
                });
            }

            if(especialidadeGridCtrl.cargaProgramada.length <= 0){
                especialidadeGridCtrl.cargaProgramada.push({
                    codTipHora: $rootScope.i18n('l-hours-mo'),
                    valProgramacAte: 0,
                    valProgramac: 0
                  });
            }

            especialidadeGridCtrl.capacidadePrev.push({
                codTipHora: $rootScope.i18n('l-total-capacity'),
                valPrevisAte: total,
                valPrevis: totalPeriodo
            });

            if(especialidadeGridCtrl.cargaPrev.length > 0){
                especialidadeGridCtrl.cargaPrev.forEach(function(value){
                    total2 += value.valPrevisAte;
                    totalPeriodo2 += value.valPrevis;
                });
            }

            especialidadeGridCtrl.cargaPrev.push({
                codTipHora: $rootScope.i18n('l-total-loads'),
                valPrevisAte: total2,
                valPrevis: totalPeriodo2
            });

            especialidadeGridCtrl.resumo.push({
                codTipHora: $rootScope.i18n('l-expected-capabilities'),
                valRealizAte: total,
                valRealiz: totalPeriodo
            });

            especialidadeGridCtrl.resumo.push({
                codTipHora: $rootScope.i18n('l-scheduled-charges'),
                valRealizAte: total2,
                valRealiz: totalPeriodo2
            });

            especialidadeGridCtrl.resumo.push({
                codTipHora: $rootScope.i18n('l-om-hours-scheduled'),
                valRealizAte:  especialidadeGridCtrl.cargaProgramada.length > 0 ? especialidadeGridCtrl.cargaProgramada[0].valProgramacAte : 0,
                valRealiz: especialidadeGridCtrl.cargaProgramada.length > 0 ? especialidadeGridCtrl.cargaProgramada[0].valProgramac : 0
            });

            especialidadeGridCtrl.resumo.push({
                codTipHora: $rootScope.i18n('l-om-hours-done'),
                valRealizAte:  especialidadeGridCtrl.resumoAux.length > 0 ? especialidadeGridCtrl.resumoAux[0].valRealizAte : 0,
                valRealiz: especialidadeGridCtrl.resumoAux.length > 0 ? especialidadeGridCtrl.resumoAux[0].valRealiz : 0
            });
           
        }
		especialidadeGridCtrl.obterAltura = function() {
			return {
				height: (window.innerHeight - 122) + 'px',
				'overflow-y': 'auto'
			};
        };

        var calculaGrids = function(args){
           especialidadeGridCtrl.resumo = [];
           especialidadeGridCtrl.capacidadePrev = [];
           especialidadeGridCtrl.cargaPrev = [];
           especialidadeGridCtrl.cargaProgramada = [];
           especialidadeGridCtrl.resumoAux = [];

            var params = {
                'ttSprint': args.ttSprint,
                'ttEspecialidade':{
                    'codigo' : args.selecionaEspecialidade.arguments[1]['tp-especial']
                }
            };
            dashboardFactory.apresentaHorasEspecialid(params , apresentaHorasEspecialidCallback);             
        };
        
        var apresentaHorasEspecialidCallback = function(result){

            if(result.ttCapacidPrevista.length > 0){
                especialidadeGridCtrl.capacidadePrev = result.ttCapacidPrevista;
            };

            if(result.ttCargaPrevista.length > 0){
                especialidadeGridCtrl.cargaPrev = result.ttCargaPrevista;
            };
                especialidadeGridCtrl.resumoAux = result.ttHorasOmRealizada;
            if(result.ttCargaProgramada.length > 0){
                especialidadeGridCtrl.cargaProgramada = result.ttCargaProgramada;
                especialidadeGridCtrl.cargaProgramada[0].codTipHora = $rootScope.i18n('l-hours-mo');
            };

            if (especialidadeGridCtrl.ttSprint.situacao === 5){
                especialidadeGridCtrl.listaCapacidadePrev.hideColumn(1);
                especialidadeGridCtrl.listaCargaPrev.hideColumn(1);
                especialidadeGridCtrl.listaCargaProgramada.hideColumn(1);
                especialidadeGridCtrl.listaResumo.hideColumn(1);
            } 
            calculaTotal();
            
            // Manipulando a coluna do grid
            document.getElementsByClassName('k-header')[1].innerText = $rootScope.i18n('l-to-mcc')  + " " + $filter('date')(result.pdataAte, 'dd/MM/yyyy');
            document.getElementsByClassName('k-header')[4].innerText = $rootScope.i18n('l-to-mcc')  + " " + $filter('date')(result.pdataAte, 'dd/MM/yyyy');
            document.getElementsByClassName('k-header')[7].innerText = $rootScope.i18n('l-to-mcc')  + " " + $filter('date')(result.pdataAte, 'dd/MM/yyyy');
            document.getElementsByClassName('k-header')[10].innerText = $rootScope.i18n('l-to-mcc') + " " + $filter('date')(result.pdataAte, 'dd/MM/yyyy');

        };
    

		especialidadeGridCtrl.selecionaEspecialidade = function(event) {
			especialidadeGridCtrl.removeSelecionado()
			$(event.target).addClass('especialidade-selecionada');
		};

		especialidadeGridCtrl.removeSelecionado = function() {
			var els = document.getElementsByClassName("div-nivel-especialidade");
			
	        Array.prototype.forEach.call(els, function(el) {
	        	$(el).removeClass('especialidade-selecionada');
	        });
		};
          
        if ($rootScope.currentuserLoaded) {
            especialidadeGridCtrl.init();
        }

        $scope.$on('gridEspecialidade', function(event, args) {
            especialidadeGridCtrl.tituloEspecialidade = args.selecionaEspecialidade.arguments[1]['tp-especial'] + ' - '+ args.selecionaEspecialidade.arguments[1].descricao
            especialidadeGridCtrl.ttSprint = {};
            especialidadeGridCtrl.ttSprint.situacao = args.ttSprint[0].situacao;
            calculaGrids(args);
        });

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			especialidadeGridCtrl.init();
		});
	
    }
    index.register.controller("mmi.dashboard.EspecialidadeGridCtrl", especialidadeGridCtrl);
    
});
