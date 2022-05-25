define(['index',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    statusReportLinkDocumentController.$inject = ['$scope', '$modalInstance', 'configs', 'resultList', 'TOTVSEvent'];
    function statusReportLinkDocumentController($scope, $modalInstance, configs, resultList, TOTVSEvent) {
        
        var _self = this;

        $scope.StringTools = StringTools;
        
        this.SUCCESS_CONST = 'SUCCESS';
        this.WARNING_CONST = 'WARNING';
        this.ERROR_CONST   = 'ERROR';
        
        this.resultList = resultList;
        this.configs  = configs;        
        
        this.stats = {
            doctsNumber      : 0,
            doctsWithSuccess : 0,
            doctsWithWarning : 0,
            doctsWithError   : 0,
            
            doctsSuccessPercent : 0,
            doctsWarningPercent : 0,
            doctsErrorPercent   : 0
        };
        
        this.init = function () {
            _self.groupResults(resultList);

            _self.stats.doctsNumber = this.resultList.length;

            angular.forEach(_self.resultList, function(docto){
                switch(docto.inStatus){
                    case _self.SUCCESS_CONST:
                        _self.stats.doctsWithSuccess += 1;
                        break;
                    case _self.WARNING_CONST:
                        _self.stats.doctsWithWarning += 1;
                        break;
                    case _self.ERROR_CONST:
                        _self.stats.doctsWithError += 1;
                        break;
                }
            });
            
            _self.stats.doctsSuccessPercent = 
                    _self.stats.doctsWithSuccess / _self.stats.doctsNumber * 100;
            
            _self.stats.doctsWarningPercent = 
                    _self.stats.doctsWithWarning / _self.stats.doctsNumber * 100;
            
            _self.stats.doctsErrorPercent = 
                    _self.stats.doctsWithError / _self.stats.doctsNumber * 100;
        };
        
        this.cancel = function () {
            $modalInstance.close();
        };

        this.groupResults = function(result){
            var groupedResults = [];

            var documentListAux = angular.copy(result);

            if(result){
                angular.forEach(result, function(doc){
                    if(doc.idRegistroPai == 0){
                        var newDoc = _self.getDocument(groupedResults, doc);

                        newDoc.results.push({
                            dsErro : doc.dsErro,
                            tpRegistro: doc.tpRegistro
                        })
                    }
                });    
            }

            if(documentListAux){
                angular.forEach(documentListAux, function(docChild){

                    if(docChild.idRegistroPai != 0){
                        var newDoc = _self.getDocument(groupedResults, docChild);

                        var groupedDocto = null;

                        groupedDocto = {
                             cdUnidade           : docChild.cdUnidade,
                             cdUnidadePrestadora : docChild.cdUnidadePrestadora,
                             cdTransacao         : docChild.cdTransacao,
                             nrSerieDocOriginal  : docChild.nrSerieDocOriginal,
                             nrDocOriginal       : docChild.nrDocOriginal,
                             nrDocSistema        : docChild.nrDocSistema,
                             tpDocumento         : docChild.tpDocumento,
                             dtRealizacao        : docChild.dtRealizacao,
                             hrRealizacao        : docChild.hrRealizacao,
                             rotuloMovimento     : docChild.rotuloMovimento,
                             inStatus            : docChild.tpRegistro,
                             rotuloDocumento : "Unidade Prestadora " + StringTools.fill(docChild.cdUnidadePrestadora, '0', 4)
                                             + " | Trans "           + StringTools.fill(docChild.cdTransacao, '0', 4)
                                             + " | Série "           + docChild.nrSerieDocOriginal
                                             + " | Número "          + StringTools.fill(docChild.nrDocOriginal, '0', 8)  
                                             + " | Sequência "       + StringTools.fill(docChild.nrDocSistema, '0', 9),
                             results : []
                        }
                        newDoc.children.push(groupedDocto);

                        groupedDocto.results.push({
                            dsErro : docChild.dsErro,
                            tpRegistro: docChild.tpRegistro
                        });
                    }
                });
            }

            _self.resultList = groupedResults;
            
        };

        /* Procura na lista se existe um documento com a chave do currentObject,
           caso nao existir cria um novo e coloca nessa lista*/
        this.getDocument = function(groupedResults, currentObject){

            for(var i = 0; i < groupedResults.length; i++){
                if(groupedResults[i].idRegistro == currentObject.idRegistroPai){
                    return groupedResults[i];
                }
            }

            var newDoc = {
                idRegistro          : currentObject.idRegistro,
                idRegistroPai       : currentObject.idRegistroPai,
                cdUnidade           : currentObject.cdUnidade,
                cdUnidadePrestadora : currentObject.cdUnidadePrestadora,
                cdTransacao         : currentObject.cdTransacao,
                nrSerieDocOriginal  : currentObject.nrSerieDocOriginal,
                nrDocOriginal       : currentObject.nrDocOriginal,
                nrDocSistema        : currentObject.nrDocSistema,
                rotuloBenef         : currentObject.rotuloBenef,
                rotuloPrestador     : currentObject.rotuloPrestador,
                rotuloInternacao    : currentObject.rotuloInternacao,
                inStatus            : currentObject.tpRegistro,
                rotuloDocumento : "Unidade Prestadora " + StringTools.fill(currentObject.cdUnidadePrestadora, '0', 4)
                       + " | Trans "           + StringTools.fill(currentObject.cdTransacao, '0', 4)
                       + " | Série "           + currentObject.nrSerieDocOriginal
                       + " | Número "          + StringTools.fill(currentObject.nrDocOriginal, '0', 8)  
                       + " | Sequência "       + StringTools.fill(currentObject.nrDocSistema, '0', 9),
                results  : [],
                children : []
            };

            groupedResults.push(newDoc);
            return newDoc;
        };

        $scope.$watch('$viewContentLoaded', function () {
            _self.init();
        });
        
        return this;
    }

    index.register.controller('hrc.statusReportLinkDocument.Control', statusReportLinkDocumentController);
});