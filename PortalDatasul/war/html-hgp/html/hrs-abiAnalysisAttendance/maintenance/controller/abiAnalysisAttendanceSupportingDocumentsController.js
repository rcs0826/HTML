define(['index',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/hrs-reason/reasonFactory.js',
    '/dts/hgp/html/hvp-beneficiary/beneficiaryZoomController.js',
    '/dts/hgp/html/hvp-contractingparty/contractingPartyZoomController.js',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/maintenance/controller/abiAnalysisAttendanceSupDocAttachment.js',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/maintenance/controller/abiAnalysisAttendanceSupDocReasonController.js',
    '/dts/hgp/html/hrs-situation/situationFactory.js',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/abiAnalysisAttendanceFactory.js',
    '/dts/hgp/html/hrs-documents/documentsFactory.js',
    '/dts/hgp/html/enumeration/documentsEnumeration.js'
], function (index) {

    abiAnalysisAttendanceSupportingDocumentsController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', '$location',
        'AbstractAdvancedFilterController', 'TOTVSEvent',
        'hrs.reason.Factory', 'hrs.situation.Factory', 'hrs.abiAnalysisAttendance.Factory', '$modal',
        'hrs.documents.Factory'];
    function abiAnalysisAttendanceSupportingDocumentsController($rootScope, $scope, $state, $stateParams, $location,
        AbstractAdvancedFilterController, TOTVSEvent,
        reasonFactory, situationFactory, abiAnalysisAttendanceFactory, $modal,
        documentsFactory) {

        var _self = this;
        _self.model = {};
        _self.abiAnalysisAttendanceProcedures = [];
        _self.cdRessusAbiAtendim;
        _self.disclaimers;
        _self.openAttachmentModel = {};

        _self.searchDocument = {};
        _self.cellAddDocument = {};
        _self.removeDocument = {};

        _self.idPermissao;

        _self.cellRendererPostedToGl = {};
        _self.cellOpenAttachment = {};
        _self.idItem = 0;
        _self.changeValuePadrao = {};

        _self.doctoAtendimentoArr = [];
        _self.doctoDisponivelArr = [];
        _self.tmpListReasonSemDcto = [];
        _self.tmpListReasonComDcto = [];
        _self.tmpListReason = [];
        _self.docComp = [];
        _self.impugnationMotiveModalController;

        $scope.TP_ANEXO_ENUM = TP_ANEXO_ENUM;

        _self.situacaoArquivo = [{ id: 0, name: 'Sem Arquivo' }, { id: 1, name: 'Com Arquivo' }];

        this.init = function () {
            _self.currentUrl = $location.$$path;
            _self.searchMotivo();
            if (_self.cdRessusAbiAtendim) {
                setTimeout(_self.updateDocCompVinculado(), 100);
            }
        }

        this.save = function () {
            var vetorChave = new Array();

            $.each(_self.doctoAtendimentoArr, function (i) {
                vetorChave.push({
                    idDocto: _self.doctoAtendimentoArr[i].idDocto,
                    idImpugdocs: _self.doctoAtendimentoArr[i].idImpugdocs,
                    cdRessusAbiAtendim: _self.doctoAtendimentoArr[i].cdRessusAbiAtendim
                });
            });

            abiAnalysisAttendanceFactory.saveAttendenceDocuments(
                _self.cdRessusAbiAtendim,
                vetorChave,
                function (result) { });
        }

        this.setParams = function (parent, cdRessusAbiAtendim, idPermissao, disclaimers) {
            parent.setControllerDocumentosComprobatorios(_self);
            _self.cdRessusAbiAtendim = cdRessusAbiAtendim;
            _self.idPermissao = idPermissao;
            _self.impugnationMotiveModalController = parent;
        }

        this.addDocument = function (dataItem) {

            $.each(_self.doctoDisponivelArr, function (i) {
                if (_self.doctoDisponivelArr[i].idImpugdocs == dataItem.idImpugdocs) {
                    _self.doctoDisponivelArr.splice(i, 1);
                    return false;
                }
            });

            dataItem.$selected = true;

            _self.doctoAtendimentoArr.push(dataItem);
        };

        this.removeDoc = function (dataItem) {

            if (dataItem.lgPadrao) {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Não é possível remover um arquivo obrigatório!'
                });
                dataItem.$selected = true;
                return false;
            }

            $.each(_self.doctoAtendimentoArr, function (i) {
                if (_self.doctoAtendimentoArr[i].idImpugdocs == dataItem.idImpugdocs) {
                    _self.doctoAtendimentoArr.splice(i, 1);
                    return false;
                }
            });

            dataItem.$selected = false;

            _self.doctoDisponivelArr.push(dataItem);

        };

        this.atualizarInformacoes = function (result) {
            var doctoAtendimento;
            var doctoDisponivel;

            if (result.tmpDoctoAnexo) {
                _self.doctoAtendimentoArr = [];
                angular.forEach(result.tmpDoctoAnexo, function (tmpDoctoAnexoItem) {
                    doctoAtendimento = _self.formataCamposDocTela(tmpDoctoAnexoItem);
                    doctoAtendimento.$selected = true;
                    _self.doctoAtendimentoArr.push(doctoAtendimento);
                });
            }

            if (result.tmpDocumento) {
                _self.doctoDisponivelArr = [];
                angular.forEach(result.tmpDocumento, function (tmpDocumentoItem) {
                    doctoDisponivel = _self.formataCamposDocTela(tmpDocumentoItem);

                    if ((tmpDocumentoItem.nmArquivo != "") && (tmpDocumentoItem.nmArquivo != undefined)) {
                        doctoDisponivel.tmDocumento = 1;
                        doctoDisponivel.tpDocumento = tmpDocumentoItem.nmArquivo;
                    }
                    _self.doctoDisponivelArr.push(doctoDisponivel);
                });
            }

            if (result.tmpDocumentoMotivo) {
                _self.tmpListReasonSemDcto = [];
                angular.forEach(result.tmpDocumentoMotivo, function (listMotivoItem) {
                    angular.forEach(_self.tmpListReason, function (tmpListReasonItem) {
                        if ((tmpListReasonItem.idNatureza == listMotivoItem.idNatur) &&
                            (tmpListReasonItem.idMotivo == listMotivoItem.idMotiv)) {
                            _self.tmpListReasonSemDcto.push(tmpListReasonItem);
                        }
                    });
                });
                // remove duplicados
                _self.tmpListReasonSemDcto = _self.tmpListReasonSemDcto.filter(function (elem, pos, self) {
                    return self.indexOf(elem) == pos;
                });
                // ordena pelo id do motivo
                _self.tmpListReasonSemDcto = _self.tmpListReasonSemDcto.sort(function (a, b) {
                    return a.idMotivo - b.idMotivo;
                });
            }

            if (result.tmpDocumentoMotivo) {
                _self.tmpListReasonComDcto = [];
                angular.forEach(result.tmpDoctoMotivoAnexo, function (listMotivoItem) {
                    angular.forEach(_self.tmpListReason, function (tmpListReasonItem) {
                        if ((tmpListReasonItem.idNatureza == listMotivoItem.idNatur) &&
                            (tmpListReasonItem.idMotivo == listMotivoItem.idMotiv)) {
                            _self.tmpListReasonComDcto.push(tmpListReasonItem);
                        }
                    });
                });
                // remove duplicados
                _self.tmpListReasonComDcto = _self.tmpListReasonComDcto.filter(function (elem, pos, self) {
                    return self.indexOf(elem) == pos;
                })
                // ordena pelo id do motivo
                _self.tmpListReasonComDcto = _self.tmpListReasonComDcto.sort(function (a, b) {
                    return a.idMotivo - b.idMotivo;
                });
            }
        };

        this.updateDocCompVinculado = function () {
            abiAnalysisAttendanceFactory.updateDocCompVinculado(_self.cdRessusAbiAtendim,
                function (result) {
                    if (result) {
                        return _self.searchDocument();
                    }
                });

        }

        this.openAttachmentModel = function (dataItem) {
            var AttendanceData = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrs-abiAnalysisAttendance/maintenance/ui/abiAnalysisAttendanceSupDocAttachment.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrs.abiAnalysisAttendanceSupDocAttachment.Control as controller',
                resolve: {
                    dataItem: function () {
                        return dataItem;
                    },
                    idPermissao: function () {
                        return _self.idPermissao;
                    },
                    maintenancePermission: function () {
                        return _self.impugnationMotiveModalController.maintenancePermission;
                    }
                }
            });

            AttendanceData.result.then(function (dataItem) {
                $.each(_self.doctoAtendimentoArr, function (i) {
                    if (dataItem
                        && _self.doctoAtendimentoArr[i].idImpugdocs == dataItem.idImpugdocs) {
                        if (dataItem.removed == true) {
                            _self.doctoAtendimentoArr[i].idDocto = null;
                            _self.doctoAtendimentoArr[i].nmArquivo = "";
                            _self.doctoAtendimentoArr[i].nmArquivoUrl = "";
                            _self.doctoAtendimentoArr[i].tpDocumento = "";
                            _self.doctoAtendimentoArr[i].possuiAnexo = false;
                        }
                        else {
                            _self.doctoAtendimentoArr[i].nmArquivo = dataItem.nmArquivo;
                            _self.doctoAtendimentoArr[i].nmArquivoUrl = dataItem.nmArquivo;
                            _self.doctoAtendimentoArr[i].tmDocumento = dataItem.tmDocumento;
                            _self.doctoAtendimentoArr[i].tpDocumento = dataItem.tpDocumento;
                            _self.doctoAtendimentoArr[i].idDocto = dataItem.idDocto;
                            _self.doctoAtendimentoArr[i].possuiAnexo = dataItem.nmArquivo != "";

                        }
                    }

                });

            });
        };

        this.removeDocAnexo = function (dataItem) {
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Atenção!',
                text: "Deseja remover o anexo?",
                cancelLabel: 'Não',
                confirmLabel: 'Sim',
                size: 'md',

                callback: function (hasChooseYes) {
                    if (hasChooseYes) {
                        abiAnalysisAttendanceFactory.removerDocComprobatorio(dataItem.cdRessusAbiAtendim, dataItem.idDocto,
                            function (result) {
                                if (result) {
                                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                        type: 'sucess', title: "Arquivo removido com sucesso!"
                                    });
                                    return _self.atualizarInformacoes(result);
                                }
                            });
                    } else {
                        return;
                    }
                }
            });

        }

        this.b64toBlob = function (b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;

            var byteCharacters = atob(b64Data);
            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }

            var blob = new Blob(byteArrays, { type: contentType });
            return blob;
        }

        this.navegatorIdentify = function () {
            var ua = navigator.userAgent, tem,
                M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) || [];
            if (/trident/i.test(M[1])) {
                tem = /\brv[ :]+(\d+(\.\d+)?)/g.exec(ua) || [];
                return 'IE ' + (tem[1] || '');
            }
            M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
            if ((tem = ua.match(/version\/([\.\d]+)/i)) != null) M[2] = tem[1];
            return M.join(' ');
        }

        this.searchDocument = function () {
            abiAnalysisAttendanceFactory.searchDocument(_self.cdRessusAbiAtendim,
                function (result) {
                    if (result) {
                        // Busca informações de todos os documentos comprobatórios                        
                        _self.searchDocComp();

                        // Formata campos dos resultados
                        return _self.atualizarInformacoes(result);
                    }
                });
        }

        this.formataCamposDocTela = function (tmpDocumento) {
            var documento = {
                idDocto: null,
                idImpugdocs: null,
                cdRessusAbiAtendim: null,
                nmDocumento: "",
                lgPadrao: false,
                dsMotivo: "",
                possuiAnexo: 0,
                nmArquivo: "",
                nmArquivoUrl: "",
                tmDocumento: 0,
                tpDocumento: "",
                dtInclusao: ""
            };

            if (_self.cdRessusAbiAtendim) {
                documento.cdRessusAbiAtendim = _self.cdRessusAbiAtendim;
            }
            if (tmpDocumento.idDocto) {
                documento.idDocto = tmpDocumento.idDocto;
            }
            if (tmpDocumento.idImpugdocs) {
                documento.idImpugdocs = tmpDocumento.idImpugdocs;
            }
            if (tmpDocumento.nmDocumento) {
                documento.nmDocumento = tmpDocumento.nmDocumento;
            }
            if (tmpDocumento.lgPadrao) {
                documento.lgPadrao = tmpDocumento.lgPadrao;
            }
            if ((tmpDocumento.dsMotivo) && (tmpDocumento.dsMotivo != "0")) {
                documento.dsMotivo = tmpDocumento.dsMotivo;
            }
            if (tmpDocumento.nmArquivo) {
                documento.nmArquivo = tmpDocumento.nmArquivo;
            }
            if (tmpDocumento.nmArquivoUrl) {
                documento.nmArquivoUrl = tmpDocumento.nmArquivoUrl;
            }
            if (tmpDocumento.tmDocumento) {
                documento.tmDocumento = tmpDocumento.tmDocumento;
            }
            if (tmpDocumento.tpDocumento) {
                documento.tpDocumento = tmpDocumento.tpDocumento;
            }
            if (tmpDocumento.dtInclusao) {
                documento.dtInclusao = new Date(tmpDocumento.dtInclusao).toLocaleDateString();
            }

            if ((tmpDocumento.nmArquivo != "") &&
                (tmpDocumento.tmDocumento > 0)) {
                documento.possuiAnexo = 1;
            }

            return documento;
        }


        // Busca por ID
        this.searchDocCompByID = function (idImpugdocs) {
            if (!angular.isUndefined(idImpugdocs)) {
                documentsFactory.prepareDataToMaintenanceWindow(idImpugdocs,
                    function (result) {
                        if (result) {

                            angular.forEach(result.tmpAbiImpugdocs, function (value) {

                                value.dsAnexo = '';
                                if (value.tpAnexo !== 0) {
                                    value.dsAnexo = ' (' + TP_ANEXO_ENUM.getLabelByKey(value.tpAnexo) + ')';
                                }

                                value.possuiDocumento = 0;
                                if (result.tmpDocumentoContratante.length > 0) {
                                    value.possuiDocumento = 1;
                                }

                                _self.docComp[value.idImpugdocs] = value;
                            });
                            return;
                        }
                    });
            }
        }

        // Se precisar pegar todos devido a performance
        this.searchDocComp = function () {
            _self.docComp = [];
            documentsFactory.getDocumentsByFilter('', 0, 1000, true, [{ property: "cdRessusAbiAtendim", value: _self.cdRessusAbiAtendim }],
                function (result) {
                    if (result) {
                        angular.forEach(result, function (value) {
                            value.dsAnexo = '';
                            if (value.tpAnexo !== 0) {
                                value.dsAnexo = ' (' + TP_ANEXO_ENUM.getLabelByKey(value.tpAnexo) + ')';
                            }
                            _self.docComp[value.idImpugdocs] = value;
                        });
                        return;
                    }
                });
        };


        this.searchMotivo = function () {
            reasonFactory.getReasonByFilter('', 0, 1000, true, [],
                function (result) {
                    if (result) {
                        _self.tmpListReason = result;
                    }
                });
        }

        $scope.$watch('$viewContentLoaded', function ($scope) {
            _self.init();
        });

        $.extend(this, abiAnalysisAttendanceSupportingDocumentsController);
    }
    index.register.controller('hrs.abiAnalysisAttendanceSupDoc.Control', abiAnalysisAttendanceSupportingDocumentsController);
});

