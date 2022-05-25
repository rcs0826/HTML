define(['index',
'/dts/hgp/html/hcg-eSocialImportaCSV/eSocialImportaCSVFactory.js',
'/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
'/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
], function (index) {

// *************************************************************************************
// *** CONTROLLER - LIST
// *************************************************************************************

eSocialImportaCSVListController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'totvs.app-main-view.Service',
                                              'hcg.eSocialImportaCSV.Factory','global.userConfigs.Factory',
                                              '$modal','AbstractAdvancedFilterController','TOTVSEvent', '$location'];
function eSocialImportaCSVListController($rootScope, $scope, $state, $stateParams,  appViewService, eSocialImportaCSVFactory,
                                            userConfigsFactory, $modal,AbstractAdvancedFilterController, TOTVSEvent, $location) {

    var _self = this;

    _self.cdProgramaCorrente = 'hcg.eSocialImportaCSVList';
    _self.config = [];
    _self.listItemInfoClasses = "col-sm-12 col-md-12 col-lg-12 col-sm-height";
    _self.disclaimers = [];
    _self.eSocialImpPar = [];
    _self.eSocialConfigCSV = [];
    _self.eSocialConfigCSVOriginal = [];
    _self.arqImportacao = "";
    _self.uploadURL="/dts/datasul-rest/resources/api/fch/fchsau/hcg/fchsauimportacsvesocial/uploadfile";
    
    this.init = function(){
        appViewService.startView("eSocial - Atualização de Prestadores", 'hcg.eSocialImportaCSVList.Control', _self);
                    
        if(appViewService.lastAction != 'newtab'){
            return;
        }
        
        eSocialImportaCSVFactory.getConfiguracoesCSV(function (result) {
            if (result) {
                _self.eSocialConfigCSV[0] = [];
                _self.eSocialConfigCSV[1] = [];
                _self.eSocialConfigCSV[2] = [];

                angular.forEach(result, function (value) {
                    _self.eSocialConfigCSVOriginal.push(value);
                    if (value.cdTabela == "tmpESocialCSVPrest"){
                        _self.eSocialConfigCSV[0].push(value);
                        _self.eSocialConfigCSV[0].desTabela = "Prestador";
                    }
                    else if (value.cdTabela == "tmpESocialCSVDep"){
                        _self.eSocialConfigCSV[1].push(value);
                        _self.eSocialConfigCSV[1].desTabela = "Dependente";
                    }
                    else if (value.cdTabela == "tmpESocialCSVCateg"){
                        _self.eSocialConfigCSV[2].push(value);
                        _self.eSocialConfigCSV[2].desTabela = "Prestador x Categoria eSocial";
                    }
                });
                $('.page-wrapper').scrollTop(0);
            }
        });

    };
    
    
    this.onUploadSelect = function(event){
        return;
        var semArquivo = false;
        if (angular.isUndefined(event.files)){
            semArquivo = true;
        }
        else if (event.files.length == 0){
            semArquivo = true;
        }
        else if (angular.isUndefined(event.files[0])){
            semArquivo = true;
        }   
        else if (!event.files[0]){
            semArquivo = true;
        }
        if (semArquivo){
            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                type: 'warning', title: 'Arquivo de atualização não selecionado ou inválido.'
            }); 
            return;
        }
        if (_self.arqImportacao[0].extension.toUpperCase() != ".CSV"){
            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                type: 'warning', title: 'Arquivo selecionado não é um arquivo .CSV.'
            }); 
            _self.arqImportacao = [];
            return;
        }
    };
    
    this.onUploadSuccess = function(event){
        var eSocialImpPar = [{
            dsArqImp: event.response.data.fileTempName,
            dsArqResultErro: "",
            dsArqResultImp: "", 
            dsArqResultNaoImp: ""
        }];
        

        eSocialImportaCSVFactory.importaCSV(eSocialImpPar, 
            _self.eSocialConfigCSVOriginal,
            function (result) {
                 if(result.$hasError == true){
                     $rootScope.$broadcast(TOTVSEvent.showNotification, {
                         type: 'error', title: 'Erro ao importar arquivo. Por favor, reinicie o processo e tente novamente.'
                     }); 
                     return;
                 }
                 $rootScope.$broadcast(TOTVSEvent.showNotification, {
                     type: 'success', title: 'Atualização realizada com sucesso. Relatório de atualização disponível na central de arquivos.'
                 }); 
             });
    }

    if ($rootScope.currentuserLoaded) {
        this.init();
    } else {
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            _self.init();
        });
    }
}
index.register.controller('hcg.eSocialImportaCSVList.Control', eSocialImportaCSVListController);

});


