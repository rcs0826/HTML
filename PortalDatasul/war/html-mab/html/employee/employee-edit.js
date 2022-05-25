define(['index',
		'/dts/mpd/js/zoom/estabelec.js',
		'/dts/mab/js/zoom/empresa.js',
		'/dts/mab/js/zoom/mmv-setor-ofici.js',
		'/dts/mab/js/zoom/tab-mob-dir.js',
		'/dts/mab/js/zoom/user-zoom-service.js',
		'/dts/mab/js/zoom/centro-custo.js'], function(index) {
	
	employeeEditCtrl.$inject = [
		'$rootScope', 
		'$scope', 
		'mab.bofr032.Service',
		'$modalInstance',
		'TOTVSEvent',
		'model',
		'$timeout',
		'$location',
	    'fchmab.fchmabemployee.Factory'];
	
	function employeeEditCtrl($rootScope,
							  $scope,
							  bofr032Service,
							  $modalInstance,
							  TOTVSEvent,
							  model,
							  $timeout,
							  $location,
							  fchmabemployeeFactory) {
	
		var employeeEditCtrl = this;
		// *************************************************************************************
		// *** Functions
		// *************************************************************************************

		employeeEditCtrl.init = function() {
			employeeEditCtrl.model = {}; 
			
			angular.copy(model, employeeEditCtrl.model);
			
			inicializaSituacao();
			inicializaCabecalho();	

			if (model.isNew === true){	
				novoRegistro();
				employeeEditCtrl.model.isSaveNew = false;
			}

			setFocus();
		}

		var inicializaSituacao = function() {
			if (employeeEditCtrl.model['idi-situacao'] === 1){
				employeeEditCtrl.model.situacao = true;
			} else{
				employeeEditCtrl.model.situacao = false;
			}
		}

		var inicializaCabecalho = function() {
			if(employeeEditCtrl.model.isNew){
				employeeEditCtrl.headerTitle = $rootScope.i18n('l-new-record');
			}else {
				employeeEditCtrl.headerTitle = employeeEditCtrl.model['cod-matr'] + " - " + employeeEditCtrl.model['nom-func'];
			}
		}

		employeeEditCtrl.save = function(again) {
			employeeEditCtrl.model.isSaveNew = again;

			if (employeeEditCtrl.validaTela()) {
				return;
			}

			atualizaSituacao();
			
			if (employeeEditCtrl.model.isNew) {
				employeeEditCtrl.saveRecord();
			} else {
				employeeEditCtrl.updateRecord();
			}
		}

		var atualizaSituacao = function() {
			employeeEditCtrl.model['idi-situacao'] = employeeEditCtrl.model.situacao === true ? 1 : 2;
			
			if (employeeEditCtrl.model.situacao) {
				employeeEditCtrl.model['dat-desativ'] = null;
			}
		}

		employeeEditCtrl.saveRecord = function() {
			bofr032Service.saveRecord(employeeEditCtrl.model, function(result) {
				if (!result.$hasError) {
					employeeEditCtrl.sucessNotify();
				
					if (employeeEditCtrl.model.isSaveNew){
						novoRegistro();
						setFocus();
					} else {
						employeeEditCtrl.close();
						employeeEditCtrl.redirectToDetail();
				  }
				}
			});
		}

        employeeEditCtrl.updateRecord = function() {
			var id = {"epCodigo"  :employeeEditCtrl.model['ep-codigo'],
					  "codEstabel":employeeEditCtrl.model['cod-estabel'],
					  "codMatr"   :employeeEditCtrl.model['cod-matr']};	

			var employeeParams = {};
			
			angular.copy(employeeEditCtrl.model, employeeParams);

			bofr032Service.updateRecord(id, employeeParams,function(result) {
				if (!result.$hasError) {
					angular.copy(employeeParams, model);
					employeeEditCtrl.sucessNotify(true);
					employeeEditCtrl.close();					
				}
			});
		}

		employeeEditCtrl.sucessNotify = function(isUpdate) {
            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                type: 'success',
                title: (isUpdate ? $rootScope.i18n('msg-record-updated') : $rootScope.i18n('msg-record-created')),
                detail: (isUpdate ? $rootScope.i18n('msg-record-success-updated') : $rootScope.i18n('msg-record-success-created'))
            });
		}
		
		employeeEditCtrl.buscaCentroCusto = function() {

			fchmabemployeeFactory.buscaCentroCustoSetor(employeeEditCtrl.model['cod-setor-ofici'], function(result){
				if(result){
					employeeEditCtrl.model['cc-codigo'] = result.ccCodigo;
				} 
			});
		};

		employeeEditCtrl.redirectToDetail = function() {
			$location.path('dts/mab/employee/detail/' + employeeEditCtrl.model['ep-codigo'] +"/"
													  + employeeEditCtrl.model['cod-estabel']+"/"
													  + employeeEditCtrl.model['cod-matr']);
		}
		
		employeeEditCtrl.validaTela = function() {
			var messages = [];
			var isInvalidForm = false;
			
			if (!employeeEditCtrl.model['ep-codigo'] || employeeEditCtrl.model['ep-codigo'].length === 0) {
				isInvalidForm = true;
				messages.push('l-company');
			}
			
			if (!employeeEditCtrl.model['cod-estabel'] || employeeEditCtrl.model['cod-estabel'].length === 0) {
				isInvalidForm = true;
				messages.push('l-site');
			}

			if (!employeeEditCtrl.model['cod-matr'] || employeeEditCtrl.model['cod-matr'].length === 0) {
				isInvalidForm = true;
				messages.push('l-code-employee');
			}

			if (!employeeEditCtrl.model['nom-func'] || employeeEditCtrl.model['nom-func'].length === 0) {
				isInvalidForm = true;
				messages.push('l-employee');
			}
			
			if (!employeeEditCtrl.model['dat-inicial']) {
				isInvalidForm = true;
				messages.push('l-control-start');
			}

			if (!employeeEditCtrl.model['cod-setor-ofici'] || employeeEditCtrl.model['cod-setor-ofici'].length === 0) {
				isInvalidForm = true;
				messages.push('l-sector');
			}

			if (!employeeEditCtrl.model['cd-mob-dir']) {
				employeeEditCtrl.model['cd-mob-dir'] = "";
			}

			if (!employeeEditCtrl.model['cc-codigo']) {
				employeeEditCtrl.model['cc-codigo'] = "";
			}

			if (isInvalidForm) {
				var warning = $rootScope.i18n('l-field');
				if (messages.length > 1) {
					warning = $rootScope.i18n('l-fields');
				}
				angular.forEach(messages, function(item) {
					warning = warning + ' ' + $rootScope.i18n(item) + ',';
				});
				if (messages.length > 1) {
					warning = warning + ' ' + $rootScope.i18n('obrigatórios');
				} else {
					warning = warning + ' ' + $rootScope.i18n('obrigatório');
				}
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-attention'),
					detail: warning
				});
			}
	
			return isInvalidForm;
		}

		var novoRegistro = function() {
			employeeEditCtrl.model['ep-codigo'] = "";
			employeeEditCtrl.model['cod-estabel']= "";
			employeeEditCtrl.model['cod-usuar'] = "";
			employeeEditCtrl.model['cod-matr'] = "";
			employeeEditCtrl.model['nom-func'] = ""
			employeeEditCtrl.model['log-control-hora'] = true;
			employeeEditCtrl.model['log-permite-cria-tar'] = true;
			employeeEditCtrl.model.situacao = true;
			employeeEditCtrl.model['idi-situacao'] = 1;
			employeeEditCtrl.model['dat-desativ'] = new Date();
			employeeEditCtrl.model['dat-inicial'] = new Date();
			employeeEditCtrl.model['cod-setor-ofici'] = undefined;
			employeeEditCtrl.model['cc-codigo'] = " ";
			employeeEditCtrl.model['cd-mob-dir'] = "";
		}

		employeeEditCtrl.close = function () {
            
            $modalInstance.close();
         }

		employeeEditCtrl.cancel = function () {
			$modalInstance.dismiss();
		}

		var setFocus = function() {
			$timeout(function() {
				if (employeeEditCtrl.model.isNew) {
					$('#ep-codigo').find('*').filter(':input:visible:first').focus();
				} else {
					$('#nom-func').find('*').filter(':input:visible:first').focus();
				}
			},500);
		}

		if ($rootScope.currentuserLoaded) { this.init(); }

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {		 
			$modalInstance.dismiss('cancel');
		});

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			employeeEditCtrl.init();
		});
	}	 
	
	index.register.controller('mab.employee.EditCtrl', employeeEditCtrl);	
	
});