define(['index',
		'/dts/mmi/js/zoom/tecn-mi.js',
		'/dts/mab/js/zoom/mmv-func-ofici.js',
		'/dts/mmi/js/zoom/equipto.js',
		'/dts/mmi/js/zoom/manut.js',
		'/dts/mmi/js/zoom/tipo-manut.js',
		'/dts/mmi/js/zoom/equipe.js',
		'/dts/mmi/js/zoom/tag.js',
		'/dts/mmi/js/zoom/sintoma.js',
        '/dts/mmi/js/zoom/causa-padr.js',
        '/dts/mmi/js/zoom/interv-padr.js',
		], function(index) {

	logEditCtrl.$inject = [
		'$rootScope',
		'$modalInstance',
		'model',
		'fchmip.log.Factory',
		'helperZoomFunc',
		'$timeout',
		'TOTVSEvent'
	];

	function logEditCtrl($rootScope,
                         $modalInstance,							
						 model,
						 logService,
						 helperZoomFunc,
						 $timeout,
						 TOTVSEvent) {
		
		var controller = this;
		
        var init = function() {
			controller.model = model;
		    controller.model.ttLogErroLin = [];
			controller.model.ttAnexo = [];
			controller.model.consulta = model.consulta;
			validaTecnicoGrupo();
			setFocus();
			
			helperZoomFunc.data = {
				'pEmpresa': $rootScope.currentcompany.companycode,
				'pCodEstabel':model.codEstabel,
			}			
			
			controller.tipoApontamento = [
				{ value: '1', label: $rootScope.i18n('l-counter'), disabled: false },
				{ value: '2', label: $rootScope.i18n('l-utility'), disabled: false }
			];

			controller.model.tpApont = controller.model.tpApont;

			carregaErros();
			buscaAnexos();
		}

		var carregaErros = function(){
			logService.buscaErrosLog(controller.model.id, buscaErrosLogCallabck);            
		}
		
		var buscaAnexos = function(){
			logService.buscaAnexos(controller.model.idAnexo, buscaAnexosCallabck);            
		}

		var buscaErrosLogCallabck = function(result){
			if(result.length > 0){
				controller.model.ttLogErroLin = result;
				controller.habilitaGrid = true;
			}else {
				controller.habilitaGrid = false;
			}
		}
		
		var buscaAnexosCallabck = function(result){
			if(result.length > 0){
				controller.model.ttAnexo = result;
		
			}
		}
		
		controller.reprocessar = function() {			
			validaHora();

			if (controller.model.origem === 3) {
				if (!validaOrdem()) return;
			}

			if (controller.model.origem === 4) {
				if (!validaSolicitacao()) return;
			}

			logService.reprocessar(controller.model, reprocessarCallabck);
		}

		var setFocus = function() {
			if(controller.model.origem === 1){
				$timeout(function() {
					$('#cd-tecnico').find('*').filter(':input:visible:first').focus();
				},500);
			}else{
				$timeout(function() {
					$('#cod-matr').find('*').filter(':input:visible:first').focus();
				},500);
			}
		}
		
		var validaTecnicoGrupo = function(){
			if(controller.model.tecnicoGrupo && controller.model.origem === 1){
				controller.model.grupo = true;
			}
		}

		var validaHora = function(){

			if (controller.model.horaInicial.substring(1,2) === ":"){
				controller.model.horaInicial = "0" + controller.model.horaInicial;
				
			}
			if (controller.model.horaFinal.substring(1,2) === ":"){
				controller.model.horaFinal = "0" + controller.model.horaFinal;
			}
		}

		var validaOrdem = function() {	         
	        var messages = [];
	        	        
	        if (!controller.model.codEqpto || controller.model.codEqpto === "") {
	        	messages.push('l-equipment');
	        }
	        
	        if (!controller.model.descricao || controller.model.descricao === "") {
	        	messages.push('l-description');
	        }	        
			
			if (messages.length > 0) {
				angular.forEach(messages, function(item) {
					var warning = '';
					warning = $rootScope.i18n('l-field');
					warning = warning + ' ' + $rootScope.i18n(item);
					warning = warning + ' ' + $rootScope.i18n('l-is-required');
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error',
						title: $rootScope.i18n('l-attention'),
						detail: warning
					});
				});
				
				return false;
			}
			
            return true;
		}

		var validaSolicitacao = function() {	         
	        if (controller.model.prioridade !== 0 && !controller.model.prioridade) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-invalid-priority')
				});

				return false;
			}
			
            return true;
		}
		
		var reprocessarCallabck = function(result){
			if(!result.hasError){
				if (controller.model.origem === 3 || controller.model.origem === 4) {
					controller.model.nrDocumento = result.ttRetorno[0].nrDocumento;
				}
			 	$modalInstance.close();
			}
		}

		controller.fechar = function() {
			$modalInstance.dismiss('cancel');
		}

        if ($rootScope.currentuserLoaded) { init(); }
	   
	}
	
	index.register.service('helperZoomFunc', function(){
        // serviço para passagem de parametro
        return {
            data :{}
        };
    });

	index.register.controller("mmi.log.EditCtrl", logEditCtrl);
});    
