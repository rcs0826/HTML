define(['index',
        '/dts/mce/js/zoom/deposito.js'], function(index) {

	openDepositoCtrl.$inject = [
		'$rootScope',
		'$scope',
		'TOTVSEvent',
        'model',
        '$modalInstance',
        '$timeout',
        'fchmip.programacao.Factory'
	];

	function openDepositoCtrl($rootScope,
                                $scope,
                                TOTVSEvent,
                                model,
                                $modalInstance,
                                $timeout,
                                programacaoFactory) {
		
        openDepositoCtrl = this;
        openDepositoCtrl.parametros = [];
		
		openDepositoCtrl.init = function() {
             buscaParametrosDepositos();
             setFocus();
        }

        openDepositoCtrl.confirmar = function(){
            if(!openDepositoCtrl.ttDeposito){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
	                type: 'warning',
	                title: $rootScope.i18n('l-attention'),
                    detail: $rootScope.i18n('l-no-selected-record-txt')
               });
            } else {
                var params = {};
                parametros();
                params.ttProgramacao = model.ttProgramacao;
                params.ttParametros =  openDepositoCtrl.parametros;
                programacaoFactory.editarDepositos(params, editarDepositosCallback);
                model.ttDeposito =  openDepositoCtrl.ttDeposito;
              };
        };

        var parametros = function() {
			openDepositoCtrl.parametros = [];
			buscaParametro(openDepositoCtrl.ttDeposito, 13, "cod-depos");
		};

        var buscaParametrosDepositos= function(){
            var params = {'ttProgramacao':model.ttProgramacao,
                          'pCodParam': 13 };
            programacaoFactory.buscaParametrosDepositos(params, buscaParametrosDepositosCallback);
        };
        
        var buscaParametrosDepositosCallback = function(result){
            model.deposito = montaObjetoSelecionadoVazio();
            result.ttDescricaoParametros.forEach(function(param){
                if (param['idi-cod-param'] === 13) {
                    model.deposito.objSelected.push(montaObjetoSelecionado("cod-depos", param['des-val-param'], param));
                }
            })
            openDepositoCtrl.ttDeposito = model.deposito
        }

        var montaObjetoSelecionadoVazio = function() {
			return {"objSelected": []};
		}

        var montaObjetoSelecionado = function(nomeAtributo, valor, ttObject) {
			var data = {};
			if(ttObject) {
				for(var k in ttObject) {
					data[k]=ttObject[k];
				}	
			}

			data[nomeAtributo] = valor;
			data['$selected'] = true;
			return data;
		}

        var editarDepositosCallback = function(result){
			$modalInstance.close();
		}

        var buscaParametro = function(obj, param, atr) {
			if (obj) {
				if (obj.objSelected) {
					angular.forEach(obj.objSelected, function(parametro){
						openDepositoCtrl.parametros.push({"idi-cod-param": param, "des-val-param": parametro[atr]});
					});
				} else {
					openDepositoCtrl.parametros.push({"idi-cod-param": param, "des-val-param": obj});
				}
			}
		}


        var setFocus = function() {
	    	$timeout(function() {
	    		$('#cod-depos').find('*').filter(':input:visible:first').focus();
	        },500);
		}

        openDepositoCtrl.close = function () {
            $modalInstance.dismiss('cancel');
        };
        
        $scope.$on('$destroy', function () {
            openDepositoCtrl = undefined;
        });
        

		if ($rootScope.currentuserLoaded) { this.init(); }
	
	    
		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			materialCtrl.init();
		});
	}

	index.register.controller("mmi.sprint.OpenDepositoCtrl", openDepositoCtrl);
   
});
