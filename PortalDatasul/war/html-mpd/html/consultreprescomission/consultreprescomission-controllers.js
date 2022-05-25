define(['index',
    '/dts/mpd/js/zoom/repres.js',
    '/dts/mpd/js/api/consultreprescomission.js'
], function (index) {

    consultRepresComissionController.$inject = [
        '$rootScope',
        '$scope',
        '$filter',
        'TOTVSEvent',
        'totvs.app-main-view.Service',
        'dts-utils.consultreprescomission.Factory'
    ];

    function consultRepresComissionController($rootScope, $scope, $filter, TOTVSEvent, appViewService, appFactory) {

        var controller = this;

        var dtInitial = new Date();
        dtInitial.setMonth(dtInitial.getMonth() - 1);
        var dtFinal = new Date();

        this.listResult = [];
        this.listDetailResult = [];
        this.page = 0;
        this.pageSize = 20;

        this.repres = {};

        this.dtImplantInitial = dtInitial;
        this.dtImplantFinal = dtFinal;
        this.dtEmissInitial = dtInitial;
        this.dtEmissFinal = dtFinal;
        this.dtDeliveryInitial = dtInitial;
        this.dtDeliveryFinal = dtFinal;

        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            controller.init();
        });

        this.loadData = function (more) {

            if (!more) {
                controller.listResult = [];
                controller.page = 0;
            } else {
                controller.page = controller.page + 1;
            }

            var filter = {
                page: controller.page,
                pageSize: controller.pageSize,
                dtImplantInitial: $filter('date')(controller.dtImplantInitial, 'dd-MM-yyyy'),
                dtImplantFinal: $filter('date')(controller.dtImplantFinal, 'dd-MM-yyyy'),
                dtEmissInitial: $filter('date')(controller.dtEmissInitial, 'dd-MM-yyyy'),
                dtEmissFinal: $filter('date')(controller.dtEmissFinal, 'dd-MM-yyyy'),
                dtDeliveryInitial: $filter('date')(controller.dtDeliveryInitial, 'dd-MM-yyyy'),
                dtDeliveryFinal: $filter('date')(controller.dtDeliveryFinal, 'dd-MM-yyyy'),
                repres: controller.repres !== undefined ? controller.repres['nome-abrev'] : ""
            };

            appFactory.getRecords(filter, function (result) {
                if (result.items) {
                    controller.page = result.items[0]["iPageSize"];
                    controller.listResult = controller.listResult.concat(result.items[1]);                    
                }
            });
        }

        this.loadDetailData = function (obj) {
            if (!obj.listDetailResult) {
                var filter = {
                    dtImplantInitial: $filter('date')(controller.dtImplantInitial, 'dd-MM-yyyy'),
                    dtImplantFinal: $filter('date')(controller.dtImplantFinal, 'dd-MM-yyyy'),
                    dtEmissInitial: $filter('date')(controller.dtEmissInitial, 'dd-MM-yyyy'),
                    dtEmissFinal: $filter('date')(controller.dtEmissFinal, 'dd-MM-yyyy'),
                    dtDeliveryInitial: $filter('date')(controller.dtDeliveryInitial, 'dd-MM-yyyy'),
                    dtDeliveryFinal: $filter('date')(controller.dtDeliveryFinal, 'dd-MM-yyyy'),
                    repres: obj['tta_nom_repres']
                };

                appFactory.getDetailRecords(filter, function (result) {
                    if (result.items) {
                        obj.listDetailResult = result.items;

                        if (obj.listDetailResult.length === 0) {
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'warning',
                                title: $rootScope.i18n('Não encontrado registros de comissão por item'),
                                detail: $rootScope.i18n('Não encontrado registros de comissão por item')
                            });
                        }
                    }
                });
            }
        }

        this.init = function () {           
            if (appViewService.startView($rootScope.i18n('l-consult-repres-comiss'), 'mpd.consultreprescomission-list.Control', controller)) {
                // se é a abertura da tab, implementar aqui inicialização do controller
            }
            
            this.loadData(false);            
        }

        if ($rootScope.currentuserLoaded) {
            this.init();
        }
    };

    index.register.controller('mpd.consultreprescomission-list.Control', consultRepresComissionController);    
});