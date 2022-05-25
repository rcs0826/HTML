define([
	'index',
	'angularAMD',
    '/dts/mce/js/api/fch/fchmat/fchmatinventorybalanceinquiry-services.js',
    '/dts/mce/js/mce-legend-service.js',
    '/dts/mce/js/mce-utils.js'
], function (index) {

    ce0814DetailController.$inject = ['$rootScope', '$scope', '$stateParams', '$state',
                                   'totvs.app-main-view.Service', 'mce.fchmatInventoryBalanceInquiryFactory.factory', 'mce.zoom.serviceLegend', 'mce.utils.Service', 'TOTVSEvent'];

    function ce0814DetailController($rootScope, $scope, $stateParams, $state, appViewService, fchmatInventoryBalanceInquiryFactory, legend, util, TOTVSEvent) {
        // *********************************************************************************
        // *** Atributos
        // *********************************************************************************
        this.model = {}; // mantem o conteudo do registro em detalhamento

        this.legendUtil = legend;
        this.mceUtils = util;
        this.hideCurrency1 = true;
        this.hideCurrency2 = true;
        this.hideCurrency3 = true;

        var _controller = this;

        // *********************************************************************************
        // *** Methods
        // *********************************************************************************
        /* Função....: load
           Descrição.: faz a busca do movimento selecionado na tela de consulta de movimentos
           Parâmetros: id
        */
        this.load = function (id) {

                this.model = {}; // zera o model

                var params = {};
                params.transactionNumber = $stateParams.nrTrans;
                params.currencyCode = $stateParams.currency;
                params.averageType = $stateParams.averageType;

                fchmatInventoryBalanceInquiryFactory.getMovementDetail(params, {}, function (result) {

                    _controller.model = result[0];

                    _controller.model['transactionDate'] = _controller.mceUtils.formatDate(_controller.model['transactionDate']);
                    _controller.model['lotValidityDate'] = _controller.mceUtils.formatDate(_controller.model['lotValidityDate']);
                    _controller.model['fiscalOutDate'] = _controller.mceUtils.formatDate(_controller.model['fiscalOutDate']);

                    _controller.enableCurrencies();
                });
            }
            /* Função....: enableCurrencies
               Descrição.: mostra os valores da moeda selecionada
               Parâmetros: 
            */
        this.enableCurrencies = function () {
            switch ($stateParams.currency) {
                case '0':
                    _controller.hideCurrency1 = false;
                    _controller.hideCurrency2 = true;
                    _controller.hideCurrency3 = true;
                    break;
                case '1':
                    _controller.hideCurrency1 = true;
                    _controller.hideCurrency2 = false;
                    _controller.hideCurrency3 = true;
                    break;
                case '2':
                    _controller.hideCurrency1 = true;
                    _controller.hideCurrency2 = true;
                    _controller.hideCurrency3 = false;
                    break;
            }
        }

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************

        this.init = function () {
            appViewService.startView(
                $rootScope.i18n('l-item-inventory-movement'),
                'mce.ce0814.DetailController',
                _controller
            );
            this.load();
        }

        // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) {
            this.init();
        }

        // *********************************************************************************
        // *** Events Listeners
        // *********************************************************************************

        // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            _controller.init();
        });

    }
    index.register.controller('mce.ce0814.DetailController', ce0814DetailController);
});
