define(['index',
    '/dts/hgp/html/hrc-document/documentFactory.js',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    linkDocumentsController.$inject = ['$rootScope', '$scope', '$modalInstance',
                                           'hrc.document.Factory', 'disclaimers', 'document', 'showOnlyLinkedDocuments', 'TOTVSEvent']
    function linkDocumentsController($rootScope, $scope, $modalInstance, 
                                     documentFactory, disclaimers, document, showOnlyLinkedDocuments, TOTVSEvent) {

        var _self = this;
        $scope.StringTools = StringTools;
        _self.documentKey = null;
        _self.document = document;
        _self.showOnlyLinkedDocuments = showOnlyLinkedDocuments;

        this.init = function () {
            if(angular.isUndefined(document) === false){
                _self.documentKey = "Unidade Prestadora " + StringTools.fill(document.cdUnidadePrestadora, '0', 4) 
                                  + " | Transação "       + StringTools.fill(document.cdTransacao, '0', 4) 
                                  + " | Série "           + document.nrSerieDocOriginal
                                  + " | Número "          + StringTools.fill(document.nrDocOriginal, '0', 8)
                                  + " | Sequência "       + StringTools.fill(document.nrDocSistema, '0', 9);
            }

            if(_self.showOnlyLinkedDocuments == true){
                documentFactory.getLinkedDocuments(document.cdUnidade, document.cdUnidadePrestadora, document.cdTransacao,
                document.nrSerieDocOriginal, document.nrDocOriginal, document.nrDocSistema,
                    function(result){
                        _self.documentsList = result;                
                    });
                return;
            }

            documentFactory.getDocumentsToLink(document.cdUnidade, document.cdUnidadePrestadora, document.cdTransacao,
                document.nrSerieDocOriginal, document.nrDocOriginal, document.nrDocSistema,
                function(result){
                    _self.documentsList = result;                
                    for (var i = _self.documentsList.length - 1; i >= 0; i--) {
                      _self.documentsList[i].$selected = true;
                    }
                });
        };

        this.linkDocuments = function () {
            var tmpDocrecon = [];
            for (var i = _self.documentsList.length - 1; i >= 0; i--) {
                if(_self.documentsList[i].$selected == true){
                    tmpDocrecon.push(_self.documentsList[i]);
                }
            }

            if(tmpDocrecon.length == 0){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title:  'É necessário selecionar documentos para realizar a vinculação'
                });
                return;
            }

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Atenção',
                text: 'Confirma a vinculação dos documentos selecionados?',
                cancelLabel: 'Não',
                confirmLabel: 'Sim',
                callback: function(lgConfirmar) {
                    if(lgConfirmar){
                        documentFactory.linkDocumentsToHospitalization(_self.document.cdUnidade,
                          _self.document.cdUnidadePrestadora, _self.document.cdTransacao, 
                          _self.document.nrSerieDocOriginal, _self.document.nrDocOriginal, _self.document.nrDocSistema,
                          tmpDocrecon,
                          function (result) {
                              if(result.$hasError == true){
                                  return;
                              }

                              $modalInstance.close(result);
                        });
                    }
                }
            });
        };

        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.$watch('$viewContentLoaded', function() {
            _self.init();
        });
    }
    
    index.register.controller('hrc.linkDocuments.Control', linkDocumentsController);
});
