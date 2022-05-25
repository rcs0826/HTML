define(['index',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    statusReportController.$inject = ['$scope', '$modalInstance', 'configs', 'resultList', 'TOTVSEvent'];
    function statusReportController($scope, $modalInstance, configs, resultList, TOTVSEvent) {
        
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
            movtsNumber      : 0,
            movtsWithSuccess : 0,
            movtsWithWarning : 0,
            movtsWithError   : 0,
            
            doctsSuccessPercent : 0,
            doctsWarningPercent : 0,
            doctsErrorPercent   : 0,
            movtsSuccessPercent : 0,
            movtsWarningPercent : 0,
            movtsErrorPercent   : 0
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

                if(angular.isUndefined(docto.movimentos) == true
                || docto.movimentos == null
                || docto.movimentos.length == 0){
                    return;
                }
                
                _self.stats.movtsNumber += docto.movimentos.length;
                
                angular.forEach(docto.movimentos, function(movto){
                    switch(movto.inStatus){
                        case _self.SUCCESS_CONST:
                            _self.stats.movtsWithSuccess += 1;
                            break;
                        case _self.WARNING_CONST:
                            _self.stats.movtsWithWarning += 1;
                            break;
                        case _self.ERROR_CONST:
                            _self.stats.movtsWithError += 1;
                            break;
                    }
                });
            });
            
            _self.stats.doctsSuccessPercent = 
                    _self.stats.doctsWithSuccess / _self.stats.doctsNumber * 100;
            
            _self.stats.doctsWarningPercent = 
                    _self.stats.doctsWithWarning / _self.stats.doctsNumber * 100;
            
            _self.stats.doctsErrorPercent = 
                    _self.stats.doctsWithError / _self.stats.doctsNumber * 100;
            
            _self.stats.movtsSuccessPercent = 
                    _self.stats.movtsWithSuccess / _self.stats.movtsNumber * 100;
            
            _self.stats.movtsWarningPercent = 
                    _self.stats.movtsWithWarning / _self.stats.movtsNumber * 100;
            
            _self.stats.movtsErrorPercent = 
                    _self.stats.movtsWithError / _self.stats.movtsNumber * 100;
            
            
        };
        
        this.cancel = function () {
            $modalInstance.close();
        };

        this.getMajorStatus = function (status1, status2){
            if(status1 == null){
                return status2;
            }else if(status2 == null){
                return status1;
            }else if(status1 == _self.ERROR_CONST
                  || status2 == _self.ERROR_CONST){
                return _self.ERROR_CONST;
            }else if(status1 == _self.WARNING_CONST
                  || status2 == _self.WARNING_CONST){
                return _self.WARNING_CONST;
            }else return _self.SUCCESS_CONST;
        };

        this.groupResults = function(result){
            var groupedResults = [];

            if(result.tmpDocumentResult){
                angular.forEach(result.tmpDocumentResult, function(doc){
                    var newDoc = _self.getDocument(groupedResults, doc);

                    newDoc.results.push({
                        dsErro : doc.dsErro,
                        tpRegistro: doc.tpRegistro
                    })

                    newDoc.inStatus = _self.getMajorStatus(newDoc.inStatus, doc.tpRegistro);

                    //groupedResults.push(newDoc);
                });    
            }

            if(result.tmpMovementResult){
                angular.forEach(result.tmpMovementResult, function(mov){
                    var newDoc = _self.getDocument(groupedResults, mov);

                    var groupedMovto = null;

                    for(var i = 0; i < newDoc.movimentos.length; i++){
                        if(newDoc.movimentos[i].cdMovimento         == mov.cdMovimento
                        && newDoc.movimentos[i].cdUnidade           == mov.cdUnidade
                        && newDoc.movimentos[i].cdUnidadePrestadora == mov.cdUnidadePrestadora
                        && newDoc.movimentos[i].cdTransacao         == mov.cdTransacao
                        && newDoc.movimentos[i].nrSerieDocOriginal  == mov.nrSerieDocOriginal
                        && newDoc.movimentos[i].nrDocOriginal       == mov.nrDocOriginal
                        && newDoc.movimentos[i].nrDocSistema        == mov.nrDocSistema
                        && newDoc.movimentos[i].nrProcesso          == mov.nrProcesso
                        && newDoc.movimentos[i].nrSeqDigitacao      == mov.nrSeqDigitacao){
                            groupedMovto = newDoc.movimentos[i];
                            break;
                        }
                    }                    

                    if(groupedMovto == null){
                        groupedMovto = {
                             cdUnidade           : mov.cdUnidade,
                             cdUnidadePrestadora : mov.cdUnidadePrestadora,
                             cdTransacao         : mov.cdTransacao,
                             nrSerieDocOriginal  : mov.nrSerieDocOriginal,
                             nrDocOriginal       : mov.nrDocOriginal,
                             nrDocSistema        : mov.nrDocSistema,
                             nrProcesso          : mov.nrProcesso,
                             nrSeqDigitacao      : mov.nrSeqDigitacao,
                             cdMovimento         : mov.cdMovimento,
                             rotulo : "Processo " + mov.nrProcesso
                                    + " | Sequência " + mov.nrSeqDigitacao
                                    + " | Movimento " + mov.cdMovimento 
                                              + " - " + mov.dsMovimento,
                             results : []
                        }
                        newDoc.movimentos.push(groupedMovto);
                    }

                    groupedMovto.results.push({
                        dsErro : mov.dsErro,
                        tpRegistro: mov.tpRegistro
                    })

                    groupedMovto.inStatus = _self.getMajorStatus(groupedMovto.inStatus, mov.tpRegistro);
                    newDoc.inStatus = _self.getMajorStatus(newDoc.inStatus, groupedMovto.inStatus);

                    //groupedResults.push(newDoc);
                });
            }

            _self.resultList = groupedResults;
            
        };

        /* Procura na lista se existe um documento com a chave do currentObject,
           caso nao existir cria um novo e coloca nessa lista*/
        this.getDocument = function(groupedResults, currentObject){

            for(var i = 0; i < groupedResults.length; i++){
                if(groupedResults[i].cdUnidade           == currentObject.cdUnidade
                && groupedResults[i].cdUnidadePrestadora == currentObject.cdUnidadePrestadora
                && groupedResults[i].cdTransacao         == currentObject.cdTransacao
                && groupedResults[i].nrSerieDocOriginal  == currentObject.nrSerieDocOriginal
                && groupedResults[i].nrDocOriginal       == currentObject.nrDocOriginal
                && groupedResults[i].nrDocSistema        == currentObject.nrDocSistema){
                    return groupedResults[i];
                }
            }

            var newDoc = {
                cdUnidade           : currentObject.cdUnidade,
                cdUnidadePrestadora : currentObject.cdUnidadePrestadora,
                cdTransacao         : currentObject.cdTransacao,
                nrSerieDocOriginal  : currentObject.nrSerieDocOriginal,
                nrDocOriginal       : currentObject.nrDocOriginal,
                nrDocSistema        : currentObject.nrDocSistema,
                rotuloDocumento : "Unidade Prestadora " + StringTools.fill(currentObject.cdUnidadePrestadora, '0', 4)
                       + " | Trans "           + StringTools.fill(currentObject.cdTransacao, '0', 4)
                       + " | Série "           + currentObject.nrSerieDocOriginal
                       + " | Número "          + StringTools.fill(currentObject.nrDocOriginal, '0', 8)  
                       + " | Sequência "       + StringTools.fill(currentObject.nrDocSistema, '0', 9),
                results : [],
                movimentos : []
            };

            groupedResults.push(newDoc);
            return newDoc;
        };

        $scope.$watch('$viewContentLoaded', function () {
            _self.init();
        });
        
        return this;
    }

    index.register.controller('hrc.statusReport', statusReportController);
});
