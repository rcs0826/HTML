define(['index',
		'/dts/mmi/js/zoom/ref-item.js'], function(index) {

    /**
     * MaterialsEditCtrl
     */
    materialsEditCtrl.$inject = [	                              
    	'$rootScope',	         
    	'$scope',
    	'$modalInstance',
    	'model',
    	'$filter',
    	'TOTVSEvent',
        '$timeout',
        'men.item.zoom',
        'mmi.refeItem.zoom',
        'mce.deposito.zoom',
        'mce.localizacao.zoom',
        'mmi.formLub.zoom',
        'mmi.boin390.Service',
        'mmi.ord-taref.zoom',
        'fchmip.fchmiporder.Factory',
        'helperItem',
        'mmi.utils.Service'
        ];

    function materialsEditCtrl($rootScope, 
   							   $scope,
							   $modalInstance,
							   model,
							   $filter,
							   TOTVSEvent,
                               $timeout,
                               serviceZoomItem,
                               serviceItemReferenceZoom,
                               serviceZoomDeposito,
                               serviceZoomLocalizacao,
                               serviceZoomFormLub,
                               boin390Service,
                               serviceZoomOrdTaref,
                               fchmiporderFactory,
                               helperItem,
                               mmiUtils) {

    	/**
    	 * materialsEditCtrl
    	 */ 
    	var materialsEditCtrl = this;

        this.refresh = false;
    	
    	this.materials = model;

        this.headerTitle;

        this.serviceItemReferenceZoom = serviceItemReferenceZoom;

        this.codEstabelecimento = detailOrderCtrl.model['cod-estabel'];

        var scope;

		var oldRefer = materialsEditCtrl.materials['cod-refer'];
		
    	var isLubrific = false;
    	
        
    	// *********************************************************************************
        // *** Funções
        // *********************************************************************************

        this.buscaLocaliz = function(){

            scope = angular.element("#cod-refer .input-group-btn button").scope();
            materialsEditCtrl.disableSerie = false;

            if(materialsEditCtrl.materials.isNew){
                materialsEditCtrl.materials['cod-refer'] = undefined;
            }

            if (materialsEditCtrl.materials.item != undefined && materialsEditCtrl.materials.item['tipo-con-est'] == 4) {
                helperItem.data = materialsEditCtrl.materials.item['it-codigo'];
                if(materialsEditCtrl.materials.isNew){
                    materialsEditCtrl.materials['cod-refer'] = undefined;
                }
                scope.cleanValue();
            }

            if(materialsEditCtrl.materials.item){
                var params = {
                    'codEstab': this.codEstabelecimento,
                    'itCodigo': materialsEditCtrl.materials.item['it-codigo']
                }

                fchmiporderFactory.buscaLocalizacao(params, function(result){
                    if (result) {
                        materialsEditCtrl.disableLocaliz = result.localizUnica;

                        if (result.localizUnica)
                            materialsEditCtrl.materials['cod-localiz'] = null;

                        materialsEditCtrl.materials['cod-depos'] = result.codDepos;
                        materialsEditCtrl.materials['cod-localiz'] = result.codLocaliz;
                    }
                });


                if (materialsEditCtrl.materials.item['tipo-con-est'] <= 1 || materialsEditCtrl.materials.item['tipo-con-est'] === undefined){
                    materialsEditCtrl.materials['lote-serie'] = null;
                    materialsEditCtrl.disableSerie = true;
                }

            }
        }

        /**
         * Salva reserva
         */
        this.save = function(closePopUp) {        	

            model.isSaveNew = closePopUp;

            //valida campos obrigatórios
            if (materialsEditCtrl.isInvalidMaterialsForm()) {
                return;
            }

            if (materialsEditCtrl.materials.isNew) {
                materialsEditCtrl.saveRecord(closePopUp);
            } else {
                materialsEditCtrl.updateRecord();
            }
        }

        /**
         * Criação de reserva
         */
        this.saveRecord = function(closePopUp) {

            var materials = {};
            var loteSerie;

            angular.copy(materialsEditCtrl.materials, materials);

            if (materialsEditCtrl.materials.item) {
                materials['it-codigo'] = materialsEditCtrl.materials.item['it-codigo'];
                materials['un'] = materialsEditCtrl.materials.item['un'];
            }

            materials['nr-ord-produ'] = detailOrderCtrl.model['nr-ord-produ'];
            materials['quant-orig']   = String(materialsEditCtrl.materials['quant-orig']).replace(",",".");
            materials['lote-serie']   = materials['lote-serie'] == null || !materials['lote-serie'] ? "" : materials['lote-serie']; 

            materialsEditCtrl.refresh = true;

        	//chama BO para criação do registro
        	boin390Service.saveRecord(materials, function(result) {
            	if (!result.$hasError) { 
                    materialsEditCtrl.refresh = true;
                    materialsEditCtrl.sucessNotify();
                    if (closePopUp){
                        materialsEditCtrl.close(false);    
                    } else {
                        materialsEditCtrl.materials.item = undefined;
                        materialsEditCtrl.materials['cod-refer'] = undefined;
                        materialsEditCtrl.materials['lote-serie'] = undefined;
                        materialsEditCtrl.materials['cod-depos'] = undefined;
                        materialsEditCtrl.materials['quant-orig'] = "0,0000";
                        materialsEditCtrl.materials['cod-lubr'] = undefined;
                        materialsEditCtrl.materials['cod-localiz'] = undefined;
                        $('#it-codigo').find('*').filter(':input:visible:first').focus();
                    }
            	}
            });
        }

        /**
         * Alteração de reserva
         */
        this.updateRecord = function() {

        	var materialId = {pNrOrdProdu: materialsEditCtrl.materials['nr-ord-produ'], pItemPai: materialsEditCtrl.materials['item-pai'] == "" ? " " : materialsEditCtrl.materials['item-pai'], pCodRoteiro: materialsEditCtrl.materials['cod-roteiro'] == "" ? " " : materialsEditCtrl.materials['cod-roteiro'], pOpCodigo: materialsEditCtrl.materials['op-codigo'] == undefined ? "0" : materialsEditCtrl.materials['op-codigo'], pItCodigo: materialsEditCtrl.materials['it-codigo'], pCodRefer: oldRefer == "" ? " " : oldRefer};
        	var loteSerie = materialsEditCtrl.materials['lote-serie'] == null || !materialsEditCtrl.materials['lote-serie'] ? "" : materialsEditCtrl.materials['lote-serie']; 

            var params = {
                'quant-orig': String(materialsEditCtrl.materials['quant-orig']).replace(",","."),
                'lote-serie': loteSerie,
				'cod-refer': materialsEditCtrl.materials['cod-refer'] === undefined ? "" : materialsEditCtrl.materials['cod-refer'],
                'cod-depos': materialsEditCtrl.materials['cod-depos'] === null ? "" : materialsEditCtrl.materials['cod-depos'],
                'cd-lubr': materialsEditCtrl.materials['cd-lubr'] === null ? "" : materialsEditCtrl.materials['cd-lubr'],
                'cod-localiz': materialsEditCtrl.materials['cod-localiz'] === null ? "" : materialsEditCtrl.materials['cod-localiz']
            };

            if (materialsEditCtrl.materials['dt-reserva'] !== materialsEditCtrl.materials['dt-aux']) {
                params['dt-reserva'] = materialsEditCtrl.materials['dt-reserva'];
            }

            boin390Service.updateRecord(materialId, params, function(result) {
            	if (!result.$hasError) {
            		materialsEditCtrl.refresh = true;
                    materialsEditCtrl.sucessNotify(true);
                    materialsEditCtrl.close(false);
            	}
            });
        }
        
        /**
         * Notifica criação e alteração do registro
         */
        this.sucessNotify = function(isUpdate) {
        	// notifica o usuario que conseguiu salvar o registro
            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                type: 'success',
                title: (isUpdate ? $rootScope.i18n('msg-material-updated') : $rootScope.i18n('msg-material-created')),
                detail: (isUpdate ? $rootScope.i18n('msg-material-success-updated') : $rootScope.i18n('msg-material-success-created'))
            });
        }

        /**
         * Método para verificar se o formulario é invalido
         */
        this.isInvalidMaterialsForm = function() {
            var messages = [];
            var isInvalidForm = false;
            
            // verifica se o item foi informada
            if (!this.materials.item || this.materials.item.length === 0) {
                isInvalidForm = true;
                messages.push('l-item');
            }
		
            // verifica se o quantidade foi informada
            if (!this.materials['quant-orig'] || this.materials['quant-orig'].length === 0) {
                isInvalidForm = true;
                messages.push('l-quantity');
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
    	 * Fechar janela
    	 */
        materialsEditCtrl.close = function (cancel) {


            if (cancel === true && materialsEditCtrl.refresh != true){
                model.cancel = true;
                $modalInstance.close();
            } else {
                model.refresh = materialsEditCtrl.refresh;
                $modalInstance.close();
            }
        }
    	
    	// *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************
         
        this.init = function() {

            model.isSaveNew = true;
        	
        	materialsEditCtrl.isLubrific = detailOrderCtrl.model['tp-manut'] === 4;        	

            $timeout(function() {
                angular.element('#cd-tarefa').find('*').filter(':input:visible:first').focus();
            },500);

            if (materialsEditCtrl.materials.isNew) {
        		materialsEditCtrl.headerTitle = $rootScope.i18n('l-add');
                materialsEditCtrl.materials['dt-reserva'] = new Date();
                materialsEditCtrl.materials['quant-orig'] = "0,0000";
        	} else {
        		materialsEditCtrl.headerTitle = $rootScope.i18n('l-edit');
        		materialsEditCtrl.materials.item = {'it-codigo': materialsEditCtrl.materials['it-codigo']}
                materialsEditCtrl.materials['dt-aux'] = materialsEditCtrl.materials['dt-reserva'];
        		materialsEditCtrl.materials['cod-refer'] = mmiUtils.converteValorBranco(materialsEditCtrl.materials['cod-refer']);
				materialsEditCtrl.materials['quant-orig'] = materialsEditCtrl.materials['quant-orig'].replace(/\./g,'');
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
         
        // cria um listerner de evento para inicializar o materialsEditCtrl somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            materialsEditCtrl.init();
        });
            
    }


    index.register.controller('mmi.order.materialsEditCtrl', materialsEditCtrl);
});