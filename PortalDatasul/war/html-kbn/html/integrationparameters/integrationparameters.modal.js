define([
    'index',
    '/dts/kbn/js/helpers.js',
    '/dts/kbn/js/factories/integration-params-factory.js',
    '/dts/kbn/js/filters.js'
], function (index) {

    modalIntegrationparameters.$inject = ['$modal'];
    function modalIntegrationparameters($modal) {
        this.open = function (params) {
            var instance = $modal.open({
                templateUrl: '/dts/kbn/html/integrationparameters/integrationparameters.modal.html',
                controller: 'ekanban.integrationparameters.modal.ctrl as controller',
                backdrop: 'static',
                keyboard: true,
                size: 'lg',
                resolve: { parameters: function () { return params; } }
            });
            return instance.result;
        };
    }
    integrationparametersCtrl.$inject = [
        'parameters',
        '$modalInstance',
        'kbn.integrationparams.Factory',
        'kbn.helper.Service',
        '$rootScope',
        'TOTVSEvent'
    ];
    function integrationparametersCtrl(
        parameters,
        $modalInstance,
        integrationparamsFactory,
        serviceHelper,
        $rootScope,
        TOTVSEvent
    ) {
        var _self = this;

        _self.init = function(){
            
            integrationparamsFactory.getIntegrationParamsTT({},{},function(result){
                _self.server = result.ttParams[0];
                _self.server.serverAuth = "1";

                _self.urls = [{
                    key_param: 'url_estab',
                    label: $rootScope.i18n('l-site'),
                    info: $rootScope.i18n('msg-method-url-site'),
                    value_param: result.ttUrls[0].urlEstab
                },{
                    key_param: 'url_zoom_item',
                    label: $rootScope.i18n('l-item-zoom'),
                    info: $rootScope.i18n('msg-method-item-zoom'),
                    value_param: result.ttUrls[0].urlZoomItem
                },{
                    key_param: 'url_fluxo_producao',
                    label: $rootScope.i18n('l-production-flow'),
                    info: $rootScope.i18n('msg-method-production-flow'),
                    value_param: result.ttUrls[0].urlFluxoProducao
                },{
                    key_param: 'url_regerar_ct',
                    label: $rootScope.i18n('l-workcenter'),
                    info: $rootScope.i18n('msg-method-workcenter'),
                    value_param: result.ttUrls[0].urlRegerarCT
                }];
            });

        };

        _self.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        _self.save = function() {
            if(!_self.server.serverPassword){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type:   'error',
                    title:  $rootScope.i18n('l-confirm-senha'),
                    detail: $rootScope.i18n('l-must-inform-password'),
                });
            } else {
            
                _self.buildParameters();
                _self.getTestUrl();
            }
        };

        _self.getTestUrl = function() {
            integrationparamsFactory.testAndSaveIntegrationParams({}, params, function(result){
                if(!result.$hasError) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type:   'info',
                        title:  $rootScope.i18n('l-configure-urls'),
                        detail: $rootScope.i18n('l-success-transaction'),
                    });
                    $modalInstance.close();
                }
            });
        };

        _self.buildParameters = function() {
            params = [{
                key_param: 'server_name',
                value_param: _self.server.serverName
            },{
                key_param: 'server_port',
                value_param: _self.server.serverPort
            },{
                key_param: 'server_user',
                value_param: _self.server.serverUser
            },{
                key_param: 'server_password',
                value_param: _self.server.serverPassword
            }].concat(_self.urls);
        };

        _self.init();

    }

    index.register.controller('ekanban.integrationparameters.modal.ctrl', integrationparametersCtrl);
    index.register.service('ekanban.integrationparameters.modal.modal', modalIntegrationparameters);
});
