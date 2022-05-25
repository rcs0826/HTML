define(['index',
        '/dts/kbn/js/helpers.js',
        '/dts/kbn/js/legend.js',
        '/dts/kbn/js/factories/formula-factory.js',
        '/dts/kbn/js/filters-service.js',
        '/dts/kbn/js/directives.js'
], function (index) {

    modalSupermarketEdit.$inject = ['$modal'];
    function modalSupermarketEdit($modal) {
        this.open = function (params) {
            var instance = $modal.open({
                templateUrl: '/dts/kbn/html/flow/flow.supermarket.edit.html',
                controller: 'kbn.supermarket.edit.ctrl as controller',
                backdrop: 'static',
                keyboard: true,
                size: 'lg',
                resolve: { parameters: function () { return params; } }
            });
            return instance.result;
        };
    }

    supermarketEditCtrl.$inject = [
        'parameters',
        '$modalInstance',
        'kbn.mappingErp.Factory',
        'kbn.helper.Service',
        '$rootScope',
        'kbn.legend',
        'messageHolder',
        '$location',
        'kbn.formula.Factory',
        'kbn.filters.service',
        'kbn.data.Factory'
    ];
    function supermarketEditCtrl(
         parameters,
         $modalInstance,
         mappingErpFactory,
         serviceHelper,
         $rootScope,
         legend,
         messageHolder,
         $location,
         formulaFactory,
         filtersService,
         kbnDataService) {

        var supermarket = parameters.model;
        var currentSupermarketInicial = angular.copy(parameters.model);

        _self = this;
        _self.space = " - ";

        _self.init = function(){
            _self.formulas = [];
            _self.currentSupermarketInicial = [];
            _self.mapping = parameters.mapping;
            _self.currentSupermarket = supermarket;

            _self.carregaFormulas();
        };

        _self.carregaFormulas = function(){
            formulaFactory.getFormulas({currentPage: 0, pageSize: 0}, {}, function(result){
                _self.formulas = result;
                _self.currentSupermarket.forEach(function(item){
                    _self.formulas.forEach(function(formula){
                        if (item.idi_formul_verde == formula.num_id_formul) {
                            item.ds_kbn_formul_verde = formula;
                        }
                        if (item.idi_formul_amarela == formula.num_id_formul) {
                            item.ds_kbn_formul_amarela = formula;
                        }
                        if (item.idi_formul_vermelha == formula.num_id_formul) {
                            item.ds_kbn_formul_vermelha = formula;
                        }
                    });
                });
            });
        };

        _self.setFormScope = function (scope) {
            _self.formScope = scope;
        };

        _self.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        _self.save = function (model) {
            
            

            PutValue = {
                "ds_kbn_item_det": supermarket
            }

            model.forEach(function(item){
                if(item.log_calc_autom){
                    if (item.ds_kbn_formul_verde !== undefined || item.ds_kbn_formul_verde !== "") {
                        item.idi_formul_verde = item.ds_kbn_formul_verde.num_id_formul;
                    }

                    if (item.ds_kbn_formul_amarela !== undefined || item.ds_kbn_formul_amarela !== "") {
                        item.idi_formul_amarela = item.ds_kbn_formul_amarela.num_id_formul;
                    }

                    if (item.ds_kbn_formul_vermelha !== undefined || item.ds_kbn_formul_vermelha !== "") {
                        item.idi_formul_vermelha = item.ds_kbn_formul_vermelha.num_id_formul;
                    }
                }
            });

			mappingErpFactory.SaveSupermarket({},PutValue, function (result) {
                var alterouTamKanban = false;
                
				if(!result.$hasError){

					if(_self.mapping.idi_status==3) {
						currentSupermarketInicial.forEach(function(item){
                            model.forEach(function(obj){
                                if (item.num_id_item_det === obj.num_id_item_det && item.qti_tam_kanban != obj.qti_tam_kanban){
                                    alterouTamKanban = true;
                                    return;
                                }
                            });
                        });

                        if (alterouTamKanban) {                        
                            var openPublishModalConfirm = function(answer) {
                                if(answer){
                                    mappingErpFactory.getKbnEstablishmentByCode({codEstab: currentSupermarketInicial[0].ds_kbn_item[0].cod_estab_erp},{},function(result){
                                        kbnDataService.setEstablishmentDirective(result[0]);

                                        currentSupermarketInicial.forEach(function(item){
                                            model.forEach(function(obj){
                                                if (item.num_id_item_det === obj.num_id_item_det && item.qti_tam_kanban != obj.qti_tam_kanban){                                                    
                                                    filtersService.addFilter('inventoryadjustment',{
                                                        property: 'quickSearch',
                                                        restriction: 'LIKE',
                                                        title: $rootScope.i18n('l-description') + ': ' + item.cod_chave_erp,
                                                        value: item.cod_chave_erp
                                                    });
                                                    return;
                                                }
                                            });
                                        });
                                        $location.path("/dts/kbn/inventoryadjustment");
                                    });
                                }
                            };
                            messageHolder.showQuestion($rootScope.i18n("l-inventory-balance-adjust") , $rootScope.i18n("l-want-adjust-inventory"), openPublishModalConfirm);
                        }
                        messageHolder.showMsg($rootScope.i18n('l-warning'), $rootScope.i18n('l-editing-published-mapping'));
					}

					$modalInstance.close(result);

					var alert = {
						type: 'info',
						title: $rootScope.i18n('l-update-supermarket'),
						detail: $rootScope.i18n('l-success-transaction')
					};
					messageHolder.showNotify(alert);
				}

			});

        };

        /*_self.calcKanbanRanges = function (model) {
            
            if (model.log_calc_autom) {

                var tamKanban = (model.qti_tam_kanban === 0 ? 1 : model.qti_tam_kanban);

                model.qti_verde_kanban    = Math.ceil(model.qti_lote_minimo / tamKanban);
                model.qti_amarela_kanban  = Math.ceil(model.qti_estoq_segur / tamKanban);
                model.qti_vermelha_kanban = Math.ceil(((model.qtd_demand * model.val_tempo_ressup) / tamKanban) + 1);

                model.qti_verde_kanban    = (model.qti_verde_kanban    < 1 ? 1 : model.qti_verde_kanban)
                model.qti_amarela_kanban  = (model.qti_amarela_kanban  < 1 ? 1 : model.qti_amarela_kanban)
                model.qti_vermelha_kanban = (model.qti_vermelha_kanban < 1 ? 1 : model.qti_vermelha_kanban)

            }

        };*/
             
        _self.calcKanbanStandard = function(formula,model){
            var result
            var tamKanban = (model.qti_tam_kanban === 0 ? 1 : model.qti_tam_kanban);
            
            switch (formula) {
                case 1:
                    result = Math.ceil(model.qti_lote_minimo / tamKanban);
                    result = (result < 1 ? 1 : result)
                    break;
                case 2:
                    result =  Math.ceil(model.qti_estoq_segur / tamKanban);
                    result = (result < 1 ? 1 : result);
                    break;
                case 3:
                    result = Math.ceil(((model.qtd_demand * model.val_tempo_ressup) / tamKanban) + 1);
                    result = (result < 1 ? 1 : result)
                    break;
            }
            return result;            
        } 
		
		_self.producaoManual = function (item){
			if(!item.log_prod_manual){
				item.log_aloca_autom = false;
			}
		};
             
        _self.changeValue = function (item){
            
            if(item.log_calc_autom){
            
                _self.ttCalculo = {};
                _self.ttCalculo.num_id_item_det = item.num_id_item_det;
                _self.ttCalculo.qti_tam_kanban  = item.qti_tam_kanban;
                _self.ttCalculo.qti_estoq_segur = item.qti_estoq_segur;
                _self.ttCalculo.qti_lote_minimo = item.qti_lote_minimo;
                _self.ttCalculo.qtd_demand      = item.qtd_demand;
                _self.ttCalculo.val_tempo_ressup = item.val_tempo_ressup;
                _self.ttCalculo.idi_formul_verde = item.ds_kbn_formul_verde.num_id_formul;
                _self.ttCalculo.idi_formul_amarela = item.ds_kbn_formul_amarela.num_id_formul;
                _self.ttCalculo.idi_formul_vermelha = item.ds_kbn_formul_vermelha.num_id_formul;

                if(_self.ttCalculo.idi_formul_verde > 1000 ||
                   _self.ttCalculo.idi_formul_amarela > 1000 ||
                   _self.ttCalculo.idi_formul_vermelha > 1000){

                    formulaFactory.calcFormula({}, _self.ttCalculo, function (result) {
                        if(!result.$hasError){
                            
                            if(result[0].qti_verde_kanban){
                                item.qti_verde_kanban    = result[0].qti_verde_kanban;
                            }
                            if(result[0].qti_amarela_kanban){
                                item.qti_amarela_kanban  = result[0].qti_amarela_kanban;    
                            }
                            if( result[0].qti_vermelha_kanban){
                                item.qti_vermelha_kanban = result[0].qti_vermelha_kanban;
                            }
                        };
                    });        
                };
                
                if(_self.ttCalculo.idi_formul_verde < 1001){
                    item.qti_verde_kanban = _self.calcKanbanStandard(_self.ttCalculo.idi_formul_verde,item);
                };
                if(_self.ttCalculo.idi_formul_amarela < 1001){
                    item.qti_amarela_kanban = _self.calcKanbanStandard(_self.ttCalculo.idi_formul_amarela,item);
                };
                if(_self.ttCalculo.idi_formul_vermelha < 1001){
                    item.qti_vermelha_kanban = _self.calcKanbanStandard(_self.ttCalculo.idi_formul_vermelha,item);
                };
            };
        };
             
        _self.init();
    }

    index.register.controller('kbn.supermarket.edit.ctrl', supermarketEditCtrl);
    index.register.service('kbn.supermarket.edit.modal', modalSupermarketEdit);
});
