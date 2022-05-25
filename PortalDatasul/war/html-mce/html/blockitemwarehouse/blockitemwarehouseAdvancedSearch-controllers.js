define([
    'index',
    'angularAMD',	
    '/dts/mce/js/mce-utils.js',
    '/dts/mce/js/dbo/inbo/boin00881.js'
], function (index) {


    // CONTROLLER PESQUISA AVANCADA
    blockItemWarehouseCtrlAdvacedSearch.$inject = [
   '$rootScope', '$scope', '$modalInstance', 'parameters', 'mce.utils.Service'
   ];



    function blockItemWarehouseCtrlAdvacedSearch($rootScope, $scope, $modalInstance, parameters, util) {

        // *********************************************************************************
        // *** Variables
        // *********************************************************************************
        
        var _controllerAdvancedSearch = this;
        this.mceUtil = util;
        this.model = {
            warehouseBlock: undefined
        };
        this.disclaimers = undefined;
        this.enableItem = true;

        // *********************************************************************************
        // *** Functions
        // ***********************************************************************************

        /* Função....: onlyBlocked
           Descrição.: responsável por controlar a habilitação dos campos Item
           Parâmetros: <não há> 
        */
        this.onlyBlocked = function () {
            _controllerAdvancedSearch.enableItem = !_controllerAdvancedSearch.model.warehouseBlock;

            if (_controllerAdvancedSearch.model.warehouseBlock) { // somente deposito bloqueado                   

                _controllerAdvancedSearch.model['it-codigo'] = undefined;

            } else {
                _controllerAdvancedSearch.model['it-codigo'] = {
                    start: "",
                    end: "ZZZZZZZZZZZZZZZZ"
                };
            }
        }

        /* Função....: apply
           Descrição.: Função disparada ao clicar no botõa aplicar
           Parâmetros: <não há> 
        */
        this.apply = function () {

            this.parseModelToDisclaimers();

            $modalInstance.close({
                disclaimers: this.disclaimers
            }); // fecha modal retornando parametro
        }
        
        /* Função....: apply
           Descrição.: Função disparada ao clicar no botõa cancelar
           Parâmetros: <não há> 
        */
        this.cancel = function () {
            $modalInstance.dismiss('cancel'); // fecha modal sem retornar parametros
        }

        /* Função....: parseDisclaimersToModel
           Descrição.: Função responsável por fazer o parser dos disclaimers da tela de listagem 
                       para o model da tela de pesquisa avançada.
           Parâmetros: <não há> 
        */  
        this.parseDisclaimersToModel = function () {

            if (parameters.disclaimers[0].property != "") { // somente executa se tiver algum disclaimer ativo
                
                /* Bloco feito para compatibilidade de disclaimers com a tela de filtro avançado */
                /* Caso tenha sido informado algum item na tela de listagem, passa o valor do 
                   item para os campos inicial e final da modal de pesquisa avançada */
                if ((!parameters.disclaimers[0].model) && (parameters.disclaimers[0].property === 'it-codigo')) {
                    parameters.disclaimers[0].model = {
                        propety: parameters.disclaimers[0].property,
                        value: {
                            start: parameters.disclaimers[0].value,
                            end: parameters.disclaimers[0].value
                        }
                    };

                }
                _controllerAdvancedSearch.mceUtil.parseDisclaimersToModel(parameters.disclaimers,
                    function (model, disclaimers) {
                        _controllerAdvancedSearch.model = model;
                        _controllerAdvancedSearch.disclaimers = disclaimers

                        //atualiza variavel de controle campo item
                        _controllerAdvancedSearch.enableItem = !_controllerAdvancedSearch.model.warehouseBlock;
                    });
            }

            // carrega defualts dos campos 
            this.loadDefaultModel();
        }

        /* Função....: parseDisclaimersToModel
           Descrição.: Função responsável por fazer o parser do model da pesquisa avançada 
                       para os diclaimers que serão retornados para a tela de listagem.
           Parâmetros: <não há> 
        */ 
        this.parseModelToDisclaimers = function () {

            _controllerAdvancedSearch.disclaimers = [];

            for (key in _controllerAdvancedSearch.model) {

                var model = _controllerAdvancedSearch.model[key];

                if (model == undefined)
                    continue;

                switch (key) {
                case 'cod-estabel':
                    // Somente monta filtro se alterar o valor do campo
                    if ((model.start != "") || (model.end != "ZZZZZ")) {
                        _controllerAdvancedSearch.disclaimers.push(
                            this.mceUtil.parseTypeToDisclaimer('char-range', key, model, $scope.i18n('l-site'), false, '') 
                        );
                    }
                    break;
                case 'cod-depos':
                    // Somente monta filtro se alterar o valor do campo
                    if ((model.start != "") || (model.end != "ZZZ")) {
                        _controllerAdvancedSearch.disclaimers.push(
                            this.mceUtil.parseTypeToDisclaimer('char-range', key, model, $scope.i18n('l-warehouse'), false, '')
                        );
                    }
                    break;

                case 'it-codigo':
                    // Somente monta filtro se alterar o valor do campo
                    if ((model.start != "") || (model.end != "ZZZZZZZZZZZZZZZZ")) {
                        _controllerAdvancedSearch.disclaimers.push(
                            this.mceUtil.parseTypeToDisclaimer('char-range', key, model, $scope.i18n('l-item'), false, '')
                        );
                    }
                    break;
                case 'warehouseBlock':
                    // somente cria o disclaimer se o parametro estiver marcado
                    if (_controllerAdvancedSearch.model.warehouseBlock) {
                        _controllerAdvancedSearch.disclaimers.push(
                            this.mceUtil.parseTypeToDisclaimer('boolean', key, model, $scope.i18n('l-view-block-warehouse'), false, '')
                        );
                    }

                    break;
                }
            };

            if (_controllerAdvancedSearch.disclaimers.length === 0) {
                _controllerAdvancedSearch.disclaimers = [{
                    property: '',
                    value: '',
                    title: $scope.i18n('l-no-filter-informed'), 
                    fixed: true
                }];
            }
        }


        /* Função....: loadDefaultModel
           Descrição.: responsável indicar valores iniciais paras os campos
           Parâmetros: <não há> 
        */
        this.loadDefaultModel = function () {

            if (_controllerAdvancedSearch.model['cod-estabel'] === undefined) {
                _controllerAdvancedSearch.model['cod-estabel'] = {
                    start: "",
                    end: "ZZZZZ"
                };
            }
            if (_controllerAdvancedSearch.model['cod-depos'] === undefined) {
                _controllerAdvancedSearch.model['cod-depos'] = {
                    start: "",
                    end: "ZZZ"
                };
            }
            if (_controllerAdvancedSearch.model['it-codigo'] === undefined) {

                // carrega defaul para o item se o parametro considera somente bloqueado estiver desmarcado
                if (!_controllerAdvancedSearch.model.warehouseBlock) {
                    _controllerAdvancedSearch.model['it-codigo'] = {
                        start: "",
                        end: "ZZZZZZZZZZZZZZZZ"
                    };
                }
            }
        }

        _controllerAdvancedSearch.parseDisclaimersToModel(); // Transforma os disclaimers no objeto model

        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************

        $scope.$on('$destroy', function () {
            _controllerAdvancedSearch = undefined;
        });
        
        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) { 
            // TODO: Confirmar o fechamento caso necessário.
            $modalInstance.dismiss('cancel');
        });
        

    };
    index.register.controller('mce.blockitemwarehouse.AdvacendSearch', blockItemWarehouseCtrlAdvacedSearch);

});