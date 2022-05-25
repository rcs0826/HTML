define([
    'index',
    'angularAMD',		
    '/dts/mce/js/mce-utils.js',
    '/dts/mce/js/dbo/inbo/boin00881.js',
    '/dts/mce/js/zoom/deposito.js',
    '/dts/men/js/zoom/item.js',
    '/dts/mpd/js/zoom/estabelec.js',
], function (index) {

    blockItemWarehouseEditCtrl.$inject = [
        '$rootScope', '$scope',
        'totvs.app-main-view.Service',
        'mce.utils.Service',
        'mce.boin00881.factory',
        '$filter',
        '$state',
        '$location',
        'TOTVSEvent'
	];

    function blockItemWarehouseEditCtrl($rootScope, $scope, appViewService, util, boin00881, $filter, $state, $location, TOTVSEvent) {

        // *********************************************************************************
        // *** Variables
        // *********************************************************************************   

        this.model = {
            isBlockWarehouse: false
        };
        this.mceUtils = util;
        this.boin00881 = boin00881;
        this.isEnableItem = true;
        var controller = this;



        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************


        /* Função....: init
           Descrição.: responsável por inicializar o controller principal
           Parâmetros: <não há>
        */
        this.init = function (isSaveNew) {
            createTab = appViewService.startView($rootScope.i18n('l-new-block-item-warehouse'), 'mce.blockitemwarehouse.editCtrl', controller);

            controller.model = {};

            // Data e hora atual
            controller.model['dat-inic-bloq'] = new Date().getTime();
            controller.model['hra-inic-bloq'] = $filter('date')(new Date(), 'HH:mm:ss');

            if (isSaveNew) {
                $('#estab').focus();
            }

        }

        /* Função....: isInvalidForm
            Descrição.: responsável por validar o formulário
            Parâmetros: <não há> 
         */


        this.isInvalidForm = function () {
            var warning = '';
            var isInvalidForm = false;
            var missingFields = [];

            missingFields = controller.mceUtils.validateMissingFields($("#blockFormFields"), false);

            if (!controller.model.isBlockWarehouse &&
                (controller.model['it-codigo'] === '' || controller.model['it-codigo'] === undefined)) {
                missingFields.push({
                    label: "Item"
                });
            }

            if (missingFields.length > 0) {
                isInvalidForm = true;
                // Monta mensagem campos obrigatórios                       
                warning = $rootScope.i18n('l-field') + ":";

                if (missingFields.length > 1)
                    warning = $rootScope.i18n('l-fields') + ":";

                angular.forEach(missingFields, function (item) {
                    warning = warning + ' ' + $rootScope.i18n(item.label) + ',';
                });

                if (missingFields.length > 1)
                    warning = warning + ' ' + $rootScope.i18n('l-requireds') + '. ';
                else
                    warning = warning + ' ' + $rootScope.i18n('l-required') + '. ';

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: $rootScope.i18n('l-attention'),
                    detail: warning
                });
            }

            return isInvalidForm;
        }

        this.successNotification = function () {

            var msg, arr = [controller.model['it-codigo'],
                            controller.model['cod-depos'],
                            controller.model['cod-estabel'],
                            controller.mceUtils.formatDate(controller.model['dat-inic-bloq'])];


            if (controller.model.isBlockWarehouse) {
                msg = $rootScope.i18n('l-warehouse-blocked-msg', arr, 'dts/mce');
            } else {
                msg = $rootScope.i18n('l-item-blocked-msg', arr, 'dts/mce');
            }

            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                type: 'success',
                title: $rootScope.i18n('l-blockade') + " " + $rootScope.i18n('l-success'),
                detail: msg
            });
        }

        this.blockWarehouse = function () {
                // Se a opcao for bloqueia deposito, desabilita o campo de item e apaga o seu valor;
                controller.isEnableItem = !controller.model.isBlockWarehouse;
                if (!controller.isEnableItem) {
                    controller.model['it-codigo'] = undefined;
                }

            }
            /* Função....: isInvalidForm
               Descrição.: disparada ao clicar no botão confirma
               Parâmetros: <não há> 
               Obs: Nesta função a cópia do model é feita pois tem alguns campos que são tratados  antes de 
                    criar o registro.
             */
        this.save = function (isSaveNew) {

            var modelCopy = {};

            if (!controller.isInvalidForm()) {

                modelCopy.isBlockWarehouse = controller.model.isBlockWarehouse;
                modelCopy['cod-depos'] = controller.model['cod-depos'];
                modelCopy['it-codigo'] = controller.model['it-codigo'];
                modelCopy['cod-estabel'] = controller.model['cod-estabel'];
                modelCopy['dat-inic-bloq'] = controller.model['dat-inic-bloq'];
                modelCopy['hra-inic-bloq'] = controller.model['hra-inic-bloq'];


                var time = modelCopy['hra-inic-bloq'].replace(":", "");

                // Se a hora escolhida for antes de 10:00 o componente de hora 
                // retorna em formato inválido para o progress (9:55), neste caso é acrescido um zero
                // à frente da hora informada                
                if (time.length === 3) {
                    time = '0' + time;
                }

                // Completa a hora com o formato correto para ser enviado ao progress
                modelCopy['hra-inic-bloq'] = time + '00';


                //Se a flag bloqueia deposito estib=ver marcada, atualiza o código do 
                // item para ser enviado ao progress. Essecódigo é interno e não é mostrado em tela.                
                if (modelCopy.isBlockWarehouse) {
                    modelCopy['it-codigo'] = '#TODOS#';
                }

                boin00881.saveRecord(modelCopy, function (result) {
                    if (!result.$hasError) {
                        controller.successNotification();
                        if (isSaveNew) {
                            controller.init(true);
                        } else {
                            $state.go('dts/mce/blockitemwarehouse.start');
                        }
                    }
                });
            }

        }

        this.saveNew = function () {
            controller.save(true);
        };

        this.cancel = function () {

            // Volta para o contexto raiz
            appViewService.removeView({
                active: true,
                name: $rootScope.i18n('l-new-block-item-warehouse'),
                url: $location.url('/dts/mce/blockitemwarehouse')
            });
        };


        if ($rootScope.currentuserLoaded) {
            controller.init();
        }

        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************
        $scope.$on('$destroy', function () {
            controller = undefined;
        });

        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            controller.init();
        });


    }

    index.register.controller('mce.blockitemwarehouse.editCtrl', blockItemWarehouseEditCtrl);

});
