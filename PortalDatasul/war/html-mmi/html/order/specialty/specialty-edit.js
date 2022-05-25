define(['index',
        '/dts/mmi/js/dbo/bomn131.js',
        '/dts/mmi/js/zoom/ord-taref.js',
        '/dts/mmi/js/zoom/mi-espec.js'
        ], function(index) {

    /**
     * specialtyEditController
     */
    specialtyEditController.$inject = [	                              
    	'$rootScope',	         
    	'$scope',
    	'$modalInstance',
    	'model',
    	'TOTVSEvent',
    	'mmi.bomn131.Service',
    	'$timeout'
    ];

    function specialtyEditController($rootScope, 
        							 $scope,
        							 $modalInstance,
        							 model,
        							 TOTVSEvent,
        							 bomn131Service,
        							 $timeout) {

    	/**
    	 * specialtyEditCtrl
    	 */ 
    	var specialtyEditCtrl = this;
    	
    	this.specialty = model;
    	this.headerTitle;
    	
    	// *********************************************************************************
        // *** Funções
        // *********************************************************************************

        /**
         * Salva tarefa
         */
        this.save = function(again) {

            //specialtyEditCtrl.isSaveNew = again;
            model.isSaveNew = again;

            //valida campos obrigatórios
            if (specialtyEditCtrl.isInvalidSpecialtyForm()) {
                return;
            }

            if (specialtyEditCtrl.specialty.isNew) {
                specialtyEditCtrl.saveRecord();
            } else {
                specialtyEditCtrl.updateRecord();
            }
        }


        this.limpaDecimal = function(dec){
            
            dec = String(dec).replace(/\./g, "");
            dec = dec.replace(/\,/g, "");

            return dec;
        }


        /**
         * Criação de tarefa
         */
        this.saveRecord = function() {
        	
            specialtyEditCtrl.specialty['nr-ord-produ'] = detailOrderCtrl.model['nr-ord-produ'];
            
            specialtyEditCtrl.specialty['cd-tarefa'] = specialtyEditCtrl.specialty['cd-tarefa']['cd-tarefa'];

        	//chama BO para criação do registro

        	bomn131Service.saveRecord(specialtyEditCtrl.specialty, function(result) {
            	if (!result.$hasError) { 
                    model.refresh = true;

                    specialtyEditCtrl.sucessNotify();
                    
                    if(model.isSaveNew){
                        specialtyEditCtrl.specialty['tp-especial'] = undefined;
                        specialtyEditCtrl.specialty['tempo'] = specialtyEditCtrl.specialty['cd-tarefa']['tempo'];
                        specialtyEditCtrl.specialty['nr-homens'] = 1;
                        specialtyEditCtrl.specialty['aloc-minima'] = 0.2500;
                        specialtyEditCtrl.specialty['aloc-maxima'] = 24.0000;
                        specialtyEditCtrl.specialty['tipo-espec'] = 1;
                        specialtyEditCtrl.specialty['tipo-tempo'] = 1;
                        specialtyEditCtrl.specialty['msg-exp'] = undefined;   
                    
                    }else
                        specialtyEditCtrl.close();
            	}
            });
        }

        /**
         * Alteração de tarefa
         */
        this.updateRecord = function() {
        	
            var params = {pNrOrdProdu: detailOrderCtrl.model['nr-ord-produ'], pCdTarefa: specialtyEditCtrl.specialty['cd-tarefa']['cd-tarefa'], pTpEspecial: specialtyEditCtrl.specialty['tp-especial']};    	

            var specialty = {
                "tempo": String(specialtyEditCtrl.specialty['tempo']).replace(/\,/g, "."),
                "cd-tarefa":specialtyEditCtrl.specialty['cd-tarefa']['cd-tarefa'],
                "tp-especial":specialtyEditCtrl.specialty['tp-especial'],
                "nr-homens":specialtyEditCtrl.specialty['nr-homens'],
                "aloc-minima": String(specialtyEditCtrl.specialty['aloc-minima']).replace(/\,/g, "."),
                "aloc-maxima": String(specialtyEditCtrl.specialty['aloc-maxima']).replace(/\,/g, "."),
                "tipo-espec":specialtyEditCtrl.specialty['tipo-espec'],
                "tipo-tempo":specialtyEditCtrl.specialty['tipo-tempo'],
                "msg-exp":specialtyEditCtrl.specialty['msg-exp'],
                "nr-ord-produ": detailOrderCtrl.model['nr-ord-produ']
            };
            
            

        	bomn131Service.updateRecord(params, specialty, function(result) {
            	if (!result.$hasError) {
            		model.refresh = true;
                    specialtyEditCtrl.sucessNotify(true);
                    specialtyEditCtrl.close();
            	}
            });
        }
        
        this.setTime = function() {
        	if ((specialtyEditCtrl.specialty.isNew || specialtyEditCtrl.isSaveNew) && specialtyEditCtrl.specialty['cd-tarefa']) {
            	specialtyEditCtrl.specialty['tempo'] = specialtyEditCtrl.specialty['cd-tarefa']['tempo'];
        	}
        }
        
        /**
         * Método para verificar se o formulario é invalido
         */
        this.isInvalidSpecialtyForm = function() {

        	var messages = [];
            var isInvalidForm = false;

            // verifica se o codigo foi informado
            if (!this.specialty['tp-especial'] || this.specialty['tp-especial'].length === 0) {
                isInvalidForm = true;
                messages.push('l-specialty');
            }
            if(!specialtyEditCtrl.specialty['cd-tarefa']){
                isInvalidForm = true;
                messages.push('l-task');
            }

            if(specialtyEditCtrl.specialty['tempo'] === "" || specialtyEditCtrl.specialty['tempo'] === undefined){
                isInvalidForm = true;
                messages.push('l-time-2');
            }
            if (!specialtyEditCtrl.specialty['aloc-minima']){
                isInvalidForm = true;
                messages.push('l-min-allocation');
            }
            if(!specialtyEditCtrl.specialty['aloc-maxima']){
                isInvalidForm = true;
                messages.push('l-max-allocation');
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
                    warning = warning + ' ' + $rootScope.i18n('l-requireds-2');
                } else {
                    warning = warning + ' ' + $rootScope.i18n('l-required-2');
                }
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: $rootScope.i18n('l-attention'),
                    detail: warning
                });
            }

            return isInvalidForm;
        }          
        /**
         * Notifica criação e alteração do registro
         */
        this.sucessNotify = function(isUpdate) {
        	// notifica o usuario que conseguiu salvar o registro
            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                type: 'success',
                title: (isUpdate ? $rootScope.i18n('msg-specialty-update') : $rootScope.i18n('msg-specialty-created')),
                detail: (isUpdate ? $rootScope.i18n('msg-success-specialty-update') : $rootScope.i18n('msg-success-specialty-created'))
            });
        }
        
        /**
    	 * Fechar janela
    	 */
        specialtyEditCtrl.close = function () {
            // dismiss é o fechamento quando cancela ou quando clicar fora do modal (ESC)
            $modalInstance.close();
        }
    	
    	// *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************
         
        this.init = function() {

                model.isSaveNew = false;

                specialtyEditCtrl.optionsRadioTipoSpec = [{value: 1, label: $rootScope.i18n('l-normal'), disabled: false},
                                                          {value: 2, label: $rootScope.i18n('l-support'), disabled: false}];

                specialtyEditCtrl.optionsRadioTipoTempo = [{value: 1, label: $rootScope.i18n('l-individual'), disabled: false},
                                                           {value: 2, label: $rootScope.i18n('l-total'), disabled: false}];

            if (specialtyEditCtrl.specialty.isNew) {
        		specialtyEditCtrl.headerTitle = $rootScope.i18n('l-add');
                        
                specialtyEditCtrl.specialty['nr-homens'] = 1;
                specialtyEditCtrl.specialty['aloc-minima'] = 0.2500;
                specialtyEditCtrl.specialty['aloc-maxima'] = 24.0000;
                specialtyEditCtrl.specialty['tipo-espec'] = 1;
                specialtyEditCtrl.specialty['tipo-tempo'] = 1;
            	$timeout(function() {
            		angular.element('#cd-tarefa').find('*').filter(':input:visible:first').focus();
                },500);
        	} else {
        		specialtyEditCtrl.headerTitle = $rootScope.i18n('l-edit');

                specialtyEditCtrl.specialty['aloc-maxima'] = String(specialtyEditCtrl.specialty['aloc-maxima']).replace(/\./g, "");
                specialtyEditCtrl.specialty['aloc-minima'] = String(specialtyEditCtrl.specialty['aloc-minima']).replace(/\./g, "");
                specialtyEditCtrl.specialty['tempo'] = String(specialtyEditCtrl.specialty['tempo']).replace(/\./g, "");
            	$timeout(function() {
            		angular.element('#nr-homens').find('*').filter(':input:visible:first').focus();
                },500);
        	}
        }
         
        // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) { this.init(); }
        
        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {		 
    	    $modalInstance.dismiss('cancel');
    	});
         
        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************
         
        // cria um listerner de evento para inicializar o specialtyEditCtrl somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            specialtyEditCtrl.init();
        });
            
    }


    index.register.controller('mmi.order.SpecialtyEditCtrl', specialtyEditController);
});