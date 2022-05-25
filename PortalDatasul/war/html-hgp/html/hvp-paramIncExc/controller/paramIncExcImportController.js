define(['index',
    '/dts/hgp/html/hvp-paramIncExc/paramIncExcFactory.js'
], function (index) {

    paramIncExcImportController.$inject = ['$rootScope', '$scope','$modalInstance', 
                                                  'hvp.paramIncExc.Factory', 'TOTVSEvent'];
    function paramIncExcImportController($rootScope, $scope, $modalInstance, 
                                                   paramIncExcFactory,  TOTVSEvent) {

        var _self = this;
        this.model = {}; 
        _self.listOfImportParam = [];
        _self.arqImportacao = "";
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.importando = false;

        this.import = function () {
            if (_self.importando){
                return;
            }
            var semArquivo = false;
            if (angular.isUndefined(_self.arqImportacao)){
                semArquivo = true;
            }
            else if (_self.arqImportacao.length == 0){
                semArquivo = true;
            }
            else if (angular.isUndefined(_self.arqImportacao[0])){
                semArquivo = true;
            }   
            else if (!_self.arqImportacao[0]){
                semArquivo = true;
            }
            if (semArquivo){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'warning', title: 'Arquivo de importação não selecionado ou inválido.'
                }); 
                return;
            }
            if (_self.arqImportacao[0].extension.toUpperCase() != ".CSV"){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'warning', title: 'Arquivo selecionado não é um arquivo .CSV.'
                }); 
                return;
            }
            _self.importando = true;
            successCallback = function (result) {
                if(result.$hasError == true){
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', title: 'Erro no upload do arquivo. Por favor, reinicie o processo e tente novamente.'
                    }); 
                    _self.importando = false;
                    return;
                }
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'success', title: 'Upload realizado com sucesso.'
                }); 

                /* NO CALLBACK DO UPLOAD CHEGA O NOME DO ARQUIVO TEMPORÁRIO NO SERVIDOR
                   E, COM ESTE NOME, MANDA O PROGRESS IMPORTAR O ARQUIVO QUE AGORA JÁ FOI FEITO UPLOAD  */
                paramIncExcFactory.saveImportParam(result.fileTempName, 
                                                   _self.listOfImportParam,
                                                   function (result) {
                                                        if(result.$hasError == true){
                                                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                                                type: 'error', title: 'Erro ao importar arquivo. Por favor, reinicie o processo e tente novamente.'
                                                            }); 
                                                            _self.importando = false;
                                                            return;
                                                        }
                                                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                                            type: 'success', title: 'Importação realizada com sucesso. Relatório de importação disponível na central de arquivos.'
                                                        }); 
                                                        _self.importando = false;
                                                        $modalInstance.close();
                                                    }
                );
            };
            progressCallback = function (progress) {

            };

            errorCallback = function (result, status, headers, config, attachmentInstance) {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Erro no upload do arquivo. Por favor, reinicie o processo e tente novamente.'
                }); 
            };           
            
            paramIncExcFactory.upload(_self.arqImportacao[0].rawFile,
                                      _self.arqImportacao[0].name,
                                      successCallback,
                                      progressCallback,
                                      errorCallback); 
        };
        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
                
        this.sobe = function (id) {
            var ixAnt    = undefined;
            var ixAtual  = undefined;
            var paramAux = undefined;

            for (var i = 0; i < _self.listOfImportParam.length; i++) {
                importParam = _self.listOfImportParam[i];
                if (importParam.cdnNivParam == id){
                    if (ixAnt == undefined){
                        break;
                    }
                    ixAtual = i;
                    paramAux = _self.listOfImportParam[ixAtual];
                    _self.listOfImportParam[ixAtual] = _self.listOfImportParam[ixAnt];
                    _self.listOfImportParam[ixAnt]   = paramAux;

                }
                ixAnt = i;
            }
            _self.ajustaNivParam();
        };

        this.desce = function (id) {
            var ixAnt    = undefined;
            var ixAtual  = undefined;
            var paramAux = undefined;

            for (var i = _self.listOfImportParam.length - 1; i >= 0 ; i--) {
                importParam = _self.listOfImportParam[i];
                if (importParam.cdnNivParam == id){
                    if (ixAnt == undefined){
                        break;
                    }
                    ixAtual = i;
                    paramAux = _self.listOfImportParam[ixAtual];
                    _self.listOfImportParam[ixAtual] = _self.listOfImportParam[ixAnt];
                    _self.listOfImportParam[ixAnt]   = paramAux;

                }
                ixAnt = i;
            }
            _self.ajustaNivParam();
        };

        this.ajustaNivParam = function(){
            for (var i = 0; i < _self.listOfImportParam.length; i++) {
                _self.listOfImportParam[i].cdnNivParam = i + 1;
            }
        };

        this.init = function () {
            paramIncExcFactory.searchImportParam(function (result) {
                if (result) {
                    angular.forEach(result, function (value) {
                        _self.listOfImportParam.push(value);
                    });
                }
            });

        };

        $scope.$watch('$viewContentLoaded', function () {
            _self.init();
        });
    };

    index.register.controller('hvp.paramIncExcImport.Control', paramIncExcImportController);
});


