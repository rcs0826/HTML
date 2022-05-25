define(['index',
    '/dts/hgp/html/hrc-document/documentFactory.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER 
    // *************************************************************************************

    csvConfigurationController.$inject = ['$scope', '$modalInstance','hrc.document.Factory','global.userConfigs.Factory',
                                         'config','programName','$rootScope', 'TOTVSEvent'];
    function csvConfigurationController($scope, $modalInstance, documentFactory,userConfigsFactory,
                                        config,programName,$rootScope, TOTVSEvent) {

        var _self = this;
        _self.config = config;
        _self.programName = programName;
        $scope.StringTools = StringTools;
        _self.pages = [];
        _self.columns = _self.config.csvColumns;
        
        this.init = function () {
            documentFactory.getAllCSVColumns(_self.columns,function (result) {
                if (result) {
                    _self.pages = result.tmpPageColumnsConfiguration;
                    _self.columns = result.tmpColumnsConfiguration;

                    for (let i = 0; i < _self.pages.length; i++) {
                        _self.pages[i].columns = [];

                        for (let j = 0; j < _self.columns.length; j++) {
                            const column =  _self.columns[j];
            
                            if(column.pageId == _self.pages[i].pageId){
                                _self.pages[i].columns.push(column);
                            }
                        }
                    }
                    
                }
            });
        };

        this.selectAll = function(){
            for (let i = 0; i < _self.pages.length; i++) {

                const page =  _self.pages[i];
                _self.setIsSelected(page,true);
            }
        }

        this.deselectAll = function(){
            for (let i = 0; i < _self.pages.length; i++) {

                const page =  _self.pages[i];
                _self.setIsSelected(page,false);
            }
        }

        this.setIsSelected = function(page,option){

            for (let j = 0; j < page.columns.length; j++) {

                const column =  page.columns[j];

                column.isSelected = option;
            }
            
        }

        this.selectAllPageColumns = function(page){
            _self.setIsSelected(page,true);
        }

        this.deselectAllPageColumns = function(page){
            _self.setIsSelected(page,false);
        }

        this.onChangeTab = function (page) {
            _self.pageColumns = [];
            
        }

        this.saveCSVColumnsConfiguration = function(){

            let selectedColumns = [];

            for (let i = 0; i < _self.pages.length; i++) {

                const page =  _self.pages[i];

                for (let j = 0; j < page.columns.length; j++) {

                    const column =  page.columns[j];

                    if(column.isSelected){
                        selectedColumns.push(column);
                    }
                }
            }

            _self.config.csvColumns = selectedColumns;

            userConfigsFactory.saveUserConfiguration($rootScope.currentuser.login, 
                _self.programName, _self.config ,undefined, {noCountRequest: true}); 

            $modalInstance.close(_self.config);
        }

        this.close = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.$watch('$viewContentLoaded', function () {
            _self.init();
        });
    }
    index.register.controller('hrc.csvConfiguration.Control', csvConfigurationController);
});

