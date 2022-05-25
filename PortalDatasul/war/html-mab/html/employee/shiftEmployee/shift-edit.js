define(['index',
        '/dts/mmi/js/zoom/mi-turno.js'], function(index) {

    shiftEditController.$inject = [	                              
        '$rootScope',	         
        '$scope',
        '$modalInstance',
        'model',
        '$filter',
        'TOTVSEvent',
        '$modal',
        '$timeout',
        'mmi.mi-turno.zoom',
        'fchmab.fchmabemployee.Factory'
    ];

    function shiftEditController($rootScope, 
                                $scope,
                                $modalInstance,
                                model,
                                $filter,
                                TOTVSEvent,
                                $modal,
                                $timeout,
                                serviceZoomTurno,
                                fchmabemployeeFactory) {

        /**
         * shiftEditControl
         */ 
        var shiftEditControl = this;
        
        shiftEditControl.shift = model;

        shiftEditControl.shift.list = [];

        shiftEditControl.init = function() {
            setFocus();
            shiftEditControl.shift.turno = undefined;
            shiftEditControl.shift['dtEfetivacao'] = new Date();
        }
        
        shiftEditControl.save = function(salvarNovo) {
            //valida campos obrigatórios
            if (shiftEditControl.validaTela()) {
                return;
            }
            
            shiftEditControl.saveRecord(salvarNovo);
        }

        /**
         * Criação de tarefa
         */
        shiftEditControl.saveRecord = function(salvarNovo) {
            
            var parametros = {
                'epCodigo': shiftEditControl.shift.epCodigo,
                'codEstabel': shiftEditControl.shift.codEstabel,
                'codMatr': shiftEditControl.shift.codMatr,
                'codTurno': shiftEditControl.shift.turno["cd-turno"],
                'dtEfetivacao':shiftEditControl.shift["dtEfetivacao"]
            };

            //chama BO para criação do registro
            fchmabemployeeFactory.salvaTurnoFuncionario(parametros, function(result) {
                if (!result.$hasError) { 

                    parametros.descricao = shiftEditControl.shift.turno['descricao'];
                    shiftEditControl.shift.list.push(parametros);
                    
                    if(salvarNovo){
                        shiftEditControl.shift.turno = undefined;
                        setFocus();
                    }else{
                        $modalInstance.close();
                    }    
                    shiftEditControl.successNotify();
                }    
            });
        }
        /**
         * Método para verificar se o formulario é invalido
         */
        shiftEditControl.validaTela = function() {
            var messages = [];
            var isInvalidForm = false;
            
            if (shiftEditControl.shift.turno == undefined) {
                isInvalidForm = true;
                messages.push('l-shift');
            }

            if (!shiftEditControl.shift['dtEfetivacao']) {
                isInvalidForm = true;
                messages.push('l-valid-date');
            }
            
            // se for invalido, monta e mostra a mensagem
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
        
        shiftEditControl.successNotify = function() {
            // notifica o usuario que conseguiu salvar o registro
            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                type: 'success',
                title: ($rootScope.i18n('msg-record-created')),
                detail: ($rootScope.i18n('msg-record-success-created'))
            });
        }
        
        shiftEditControl.close = function () {
            $modalInstance.close();
        }

        shiftEditControl.cancel = function () {
			$modalInstance.close(true);
		}
        
        var setFocus = function() {
            $timeout(function() {
               $('#cd-turno').find('*').filter(':input:visible:first').focus();
            },500);
        }
        
        // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) { shiftEditControl.init(); }
        
        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {		 
            $modalInstance.dismiss('cancel');
        });
        
        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************
        
        // cria um listerner de evento para inicializar o shiftEditControl somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            shiftEditControl.init();
        });
            
    }
    index.register.controller('mab.employee.shiftEmployee.ShiftEditCtrl', shiftEditController);
});