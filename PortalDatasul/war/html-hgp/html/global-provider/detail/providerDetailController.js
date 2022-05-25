define(['index',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/util/customFilters.js',
    '/dts/hgp/html/global-provider/providerFactory.js',
    '/dts/hgp/html/enumeration/contactTypeEnumeration.js',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - DETAIL '/healthcare/html/hrc/document/detail/providerDetailController.js'
    // *************************************************************************************

    providerController.$inject = ['$rootScope', '$scope', '$stateParams', 'totvs.app-main-view.Service',
                                  '$location', 'global.provider.Factory'];
    function providerController($rootScope, $scope, $stateParams, appViewService,
                                $location, providerFactory) {

        var _self = this;
        $scope.StringTools = StringTools;
        $scope.CONTACT_TYPE_ENUM = CONTACT_TYPE_ENUM;

        this.onCancel = function(){
            appViewService.removeView({active: true,
                                       name  : 'Dados do Prestador',
                                       url   : _self.currentUrl});
        };

        this.getLabelContactTypeByKey = function (value) {
            return CONTACT_TYPE_ENUM.getLabelByKey(value);
        };

        this.init = function () {
            appViewService.startView('Dados do Prestador','global.providerDetail.Control',_self);
            
            if(appViewService.lastAction != 'newtab'
            && _self.currentUrl == $location.$$path){
                return;
            }
            
            this.provider = {};
            _self.currentUrl = $location.$$path;
            
            if ($stateParams.cdUnidCdPrestador) {                
                providerFactory.getProviderByKey($stateParams.cdUnidCdPrestador,[
                    {property: HibernateTools.SEARCH_OPTION_CONSTANT, value: 'CompleteData'},
                    {property: HibernateTools.SEARCH_OPTION_CONSTANT, value: 'Descriptions'}],
                    function(result){
                        _self.provider = result;
                    });
            }
        };

        $scope.$watch('$viewContentLoaded', function () {
            _self.init();
        });

    }

    index.register.controller('global.providerDetail.Control', providerController);

});
