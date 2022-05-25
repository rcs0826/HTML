define(['index',
    '/dts/hgp/html/hrc-document/documentFactory.js',
    '/dts/hgp/html/hrc-document/maintenance/controller/restrictionZoomController.js',
    '/dts/hgp/html/hrc-movement/movementFactory.js',
    '/dts/hgp/html/enumeration/billingValidationEnumeration.js',
    '/dts/hgp/html/enumeration/paymentValidationEnumeration.js',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER
    // *************************************************************************************

    releaseDocumentParamsController.$inject = ['$rootScope', '$scope', '$modalInstance',
                                           'hrc.document.Factory', 'hrc.movement.Factory', 'disclaimers',
                                           'document', 'batchRelease', 'tmpUnselectedDocuments', 'source', 'TOTVSEvent'];
    function releaseDocumentParamsController($rootScope, $scope, $modalInstance, documentFactory,
                                          movementFactory, disclaimers, document, batchRelease, tmpUnselectedDocuments, source, TOTVSEvent) {

        var _self = this;
        _self.msgDesc = "";
        _self.dsDocument = {};
        _self.document = document;
        _self.lgLiberacaoFatura = false;
        _self.source = source;

        /* Variaveis */
        _self.lgConsisteDiariasInternacao = true;
        _self.lgConsisteDoctosPendVincul = true;
        _self.lgGerarCSV = true;

        _self.lgLiberarFaturas = false;
        _self.lgConsideraPercDifValores = false;
        _self.vlPercDifValores = 0;

        this.init = function () {            

            if(angular.isUndefined(document) === true){

                /* Procura se filtro é por fatura */
                for (var i = disclaimers.length - 1; i >= 0; i--) {
                    if (disclaimers[i].property == "aaFaturaCdSerieNfCodFaturAp"){
                        _self.lgLiberacaoFatura = true;
                        break;
                    }
                }

                if (_self.lgLiberacaoFatura == false){
                    /* Busca se existe documentos com fatura no filtro */
                    documentFactory.hasDocumentWithInvoice(disclaimers, function(result){
                        _self.lgLiberacaoFatura = result.lgTemFatura;
                    });
                }

                _self.msgDesc = 'Caso algum documento possua fatura, todos os documentos da fatura serão liberados.';

                if(_self.lgLiberacaoFatura == true){
                    _self.lgLiberarFaturas = true;
                    $('#modalReleaseDocumentParams').css('height', '440px');
                    _self.msgDesc = 'Todos os documentos desta fatura serão liberados.';
                }

                if (_self.source == "GRU"){
                    $('#modalReleaseDocumentParams').css('height', '210px');
                }

            }else{
                /* Se documento tiver fatura */
                if(document.urlFatura != ""){
                    _self.lgLiberacaoFatura = true;
                    _self.lgLiberarFaturas = true;
                    _self.msgDesc = 'Todos os documentos desta fatura serão liberados.';
                }else{
                    _self.msgDesc = ''
                }

                if(_self.lgLiberacaoFatura == true){
                    $('#modalReleaseDocumentParams').css('height', '520px');
                }

                _self.dsDocument = '  Unidade Prestadora  ' + StringTools.fill(document.cdUnidadePrestadora, '0', 4)
                                 + '  | Transação  ' + StringTools.fill(document.cdTransacao, '0', 4)
                                 + '  | Série  '     + document.nrSerieDocOriginal
                                 + '  | Documento  ' + StringTools.fill(document.nrDocOriginal, '0', 8)
                                 + '  | Sequência  ' + StringTools.fill(document.nrDocSistema, '0', 9);
            }            
        };

        this.releaseDocuments = function () {

            if (_self.source == "GRU"){
                _self.lgConsisteDiariasInternacao = false;
                _self.lgConsisteDoctosPendVincul = false;
            }

            var parameters = [{property: 'lgConsisteDiarias', value: _self.lgConsisteDiariasInternacao},
                              {property: 'lgValidaDoctosPendVincul',  value: _self.lgConsisteDoctosPendVincul},
                              {property: 'lgGerarCSV',                  value: _self.lgGerarCSV},
                              {property: 'lgConsideraPercDifValores',   value: _self.lgConsideraPercDifValores},
                              {property: 'vlPercDifValores',            value: _self.vlPercDifValores},
                              {property: 'nmPrograma',                  value: _self.source}];

            if (batchRelease == true) {
                documentFactory.batchReleaseDocuments(disclaimers, parameters, tmpUnselectedDocuments, function (result) {
                    if (result) {
                        $modalInstance.close(result);
                    }
                });
            }else{
                documentFactory.releaseDocuments(disclaimers, parameters, tmpUnselectedDocuments, function (result) {
                        if (result) {
                        $modalInstance.close(result);
                    }
                });
            }
        };

        this.onChangeConsideraDifValores = function () {
            _self.vlPercDifValores = 0;
        };

        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.$watch('$viewContentLoaded', function() {
            _self.init();
        });
    }

    index.register.controller('hrc.releaseDocumentParams.Control', releaseDocumentParamsController);
});
