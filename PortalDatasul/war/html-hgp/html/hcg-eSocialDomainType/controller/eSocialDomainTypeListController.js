define(['index',
    '/dts/hgp/html/hcg-eSocialDomainType/eSocialDomainTypeFactory.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    eSocialDomainTypeListController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'totvs.app-main-view.Service',
                                                  'hcg.eSocialDomainType.Factory','global.userConfigs.Factory',
                                                  '$modal','AbstractAdvancedFilterController','TOTVSEvent'];
    function eSocialDomainTypeListController($rootScope, $scope, $state, $stateParams,  appViewService,eSocialDomainTypeFactory,
                                                userConfigsFactory,$modal,AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;

        _self.cdProgramaCorrente = 'hcg.eSocialDomainTypeList';
        _self.config = [];
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.disclaimers = [];
        _self.listOfESocialDomainType = [];
        
        this.init = function(){
            appViewService.startView("Domínios do eSocial", 'hcg.eSocialDomainTypeList.Control', _self);
                        
            if(appViewService.lastAction != 'newtab'){
                return;
            }
            
            eSocialDomainTypeFactory.getDomainType(function (result) {
                if (result) {
                    angular.forEach(result, function (value) {
                        _self.listOfESocialDomainType.push(value);
                    });
                    $('.page-wrapper').scrollTop(0);
                }
            });

        };

        if ($rootScope.currentuserLoaded) {
            this.init();
        } else {
            $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
                _self.init();
            });
        }
    }
    index.register.controller('hcg.eSocialDomainTypeList.Control', eSocialDomainTypeListController);

});


