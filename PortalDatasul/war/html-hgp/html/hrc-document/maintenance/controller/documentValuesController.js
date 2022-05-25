define(['index',
    '/dts/hgp/html/hrc-document/documentFactory.js',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER 
    // *************************************************************************************

    documentValuesController.$inject = ['$scope', '$modalInstance',
                                        'hrc.document.Factory', 'disclaimers', 
                                        'document', '$rootScope', 'tmpUnselectedDocuments', 'TOTVSEvent'];
    function documentValuesController($scope, $modalInstance, documentFactory, disclaimers, document,
                                      $rootScope, tmpUnselectedDocuments, TOTVSEvent) {

        var _self = this;
        
        $scope.StringTools = StringTools;
        this.documentValues = [];
        this.disclaimers = disclaimers;
        this.documentKey = null;

        this.init = function () {
            documentFactory.getDocumentValues(disclaimers, tmpUnselectedDocuments, function (result) {
                if (result) {
                    _self.documentValues = result[0];
                }
            });
            
            if(angular.isUndefined(document) === false){                                
                _self.documentKey =  "Unidade Prestadora " + StringTools.fill(document.cdUnidadePrestadora, '0', 4) 
                                    + " | Transação  "  + StringTools.fill(document.cdTransacao, '0', 4) 
                                    + " | Série  "      + document.nrSerieDocOriginal
                                    + " | Número  "     + StringTools.fill(document.nrDocOriginal, '0', 8)
                                    + " | Sequência  "  + StringTools.fill(document.nrDocSistema, '0', 9);
            }
        };

        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.$watch('$viewContentLoaded', function () {
            _self.init();
        });
    }
    index.register.controller('hrc.documentValues.Control', documentValuesController);
});

