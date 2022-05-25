define(['index',
        '/dts/kbn/js/directives.js',
        '/dts/kbn/js/factories/itemERP-zoom-factories.js',
        '/dts/kbn/html/dashboard/settings/settings.service.js',
        '/dts/kbn/js/directives.js'
],function(index) {

    dashboardSettingsModalService.$inject = [ "$modal" ];
    function dashboardSettingsModalService($modal) {
        var _self = this;
        _self.open = function(params) {
            return _self.openTemplate(params, '/dts/kbn/html/dashboard/settings/settings.html');
        };

        _self.openTemplate = function(params, template) {
            var instance = $modal.open({
                templateUrl: template,
                controller: 'kbn.dashboard.settings.controller as settingsController',
                backdrop: 'static',
                keyboard: true,
                size: 'lg',
                resolve: { parameters: function () { return params; } }
            });
            return instance.result;
        };
    }

    dashboardSettingsController.$inject = [
        '$rootScope',
        'TOTVSEvent',
        'kbn.dashboard.settings.service',
        '$modalInstance'
    ];
    function dashboardSettingsController(
        $rootScope,
        TOTVSEvent,
        dashboardSettingsService,
        $modalInstance
    ) {
        var _self = this;
        _self.accordionClassifie = false;
        _self.accordionException = false;
        _self.settings = angular.copy(dashboardSettingsService.settings, {});

        _self.cancel = function cancel() {
            $modalInstance.dismiss('cancel');
        };

        _self.apply = function apply() {
            _self.invalidParam = false;
            if(_self.settings.dateRange.end > (new Date()).getTime() ){
                _self.settings.dateRange.$invalid = true;
            } else {
                _self.settings.dateRange.$invalid = false;
            }
            if(!_self.settings.bloqFila && !_self.settings.bloqProducao && !_self.settings.bloqTransporte && !_self.settings.ajusteSaldo && !_self.settings.emissaoExtra){
                _self.invalidParam = true;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type:   'error',
                        title:  $rootScope.i18n('l-parameters-error', [], 'dts/kbn'),
                        detail: $rootScope.i18n('l-must-select-exception-params', [], 'dts/kbn'),
                    });
            }
            if (!_self.settings.dateRange.$invalid && !_self.invalidParam){
                dashboardSettingsService.apply(_self.settings);
                $modalInstance.close();
            }
        };

        _self.noop = angular.noop;
    }

    index.register.service('kbn.dashboard.settings.modalService', dashboardSettingsModalService);
    index.register.controller('kbn.dashboard.settings.controller', dashboardSettingsController);
});
