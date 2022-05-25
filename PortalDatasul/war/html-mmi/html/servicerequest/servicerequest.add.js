define([
    'index',
    '/dts/mmi/js/dbo/bomn150.js',
    '/dts/mce/js/mce-utils.js',
    '/dts/utb/js/zoom/cta-ctbl-integr.js',
    '/dts/utb/js/zoom/ccusto.js',
    '/dts/mce/js/zoom/unid-negoc.js',
    '/dts/mpd/js/zoom/estabelec.js',
    '/dts/mcc/js/zoom/sub-div-ordem.js',
    '/dts/mce/js/api/fch/fchmat/fchmatintegrationaccountcostcenter-services.js',
    '/dts/mmi/js/zoom/ord-manut.js',
    '/dts/mmi/js/zoom/equipe.js'
], function (index) {
    modalServiceRequest.$inject = ['$modal'];
    function modalServiceRequest($modal) {
        this.open = function (params) {
            var instance = $modal.open({
                templateUrl: '/dts/mmi/html/servicerequest/servicerequest.add.html',
                controller: 'mmi.service-modal.EditCtrl as controller',
                backdrop: 'static',
                keyboard: true,
                size: 'lg',
                resolve: { parameters: function () { return params; } }
            });
            return instance.result;
        }
    }
    NewServiceModal.$inject = [
        '$modalInstance',
        'parameters',
        '$rootScope',
        '$scope',
        '$location',
        '$filter',
        'mmi.bomn150.Service',
        'mmi.equipto.zoom',
        'mmi.tag.zoom',
        'mmi.manut.zoom',
        'mmi.sintoma.zoom',
        'mmi.causa.zoom',
        'mmi.intervencao.zoom',
        'mmi.parada.zoom',
        'mmi.mntplanejador.zoom',
        'mmi.equipe.zoom',
        'fchmip.fchmipservicerequest.Factory',
        'helperServiceRequest',
        'TOTVSEvent',
        '$timeout',
        'mmi.utils.Service',
        'totvs.utils.Service',
        'helperOrder'
    ];
    function NewServiceModal(
        $modalInstance,
        parameters,
        $rootScope,
        $scope,
        $location,
        $filter,
        bomn150Service,
        serviceZoomEquipment,
        serviceZoomTag,
        serviceZoomMaintenance,
        serviceZoomSympthom,
        serviceZoomCause,
        serviceZoomIntervation,
        serviceZoomStop,
        serviceZoomMntPlanejador,
        serviceZoomTeam,
        fchmipservicerequest,
        helperServiceRequest,
        TOTVSEvent,
        $timeout,
        mmiUtils,
        totvsUtils,
        helperOrder
    ) {
        _self = this;

        _self.init = function () {
            _self.totalOrcamento = 0;
            _self.data = parameters.value;
            _self.edit = false;
            $scope.serviceZoomEquipment = serviceZoomEquipment;
            _self.model = {};              // mantem o conteudo do registro em edição/inclusão
            _self.serviceRequestNumber = 0 // atributo para carregar o número da solicitação de serviço
            _self.saveUrl = '/dts/datasul-rest/resources/api/fch/fchmip/fchmipservicerequest/uploadFile';
            _self.removeUrl = ' ';
            _self.count = 0;
            var isSaveNew = false;        // controlar se o usuário selecionou a opção Salvar e Novo

            if (parameters.edit) _self.edit = parameters.edit;

            $timeout(function () {
                $('#cd-equipto').find('*').filter(':input:visible:first').focus();
            }, 500);

            if (_self.data == 'new' || _self.isSaveNew) {
                _self.applyLeaveEquipto = true;
                _self.applyLeaveTag = true;
                _self.applyLeaveManut = true;
            } else {
                _self.applyLeaveEquipto = false;
                _self.applyLeaveTag = false;
                _self.applyLeaveManut = false;
            }

            _self.initialize();
        };

        _self.initialize = function () {
            fchmipservicerequest.getParamMiPermEquip(function (result) {
                _self.permEquip = result.permEquip;
            });

            if (_self.data === 'new') _self.initNewServiceRequest();
            else _self.initEditServiceRequest();
        };

        _self.initEditServiceRequest = function () {
            _self.model = angular.copy(_self.data);
            _self.model.data = $filter('date')(_self.model.data, 'shortDate');
            _self.model.prioridade = _self.model.prioridade === undefined ? 0 : _self.model.prioridade;
            _self.title = $filter('orderNumberMask')(_self.model['nr-soli-serv']) + " - " + _self.model["descricao"];
            _self.atualizaTotalOrcado();

            if (!_self.model['cd-equipto'] || _self.model['cd-equipto'] == " ") {
                _self.model['cd-equipto'] = undefined;
                _self.applyLeaveEquipto = true;
            }

            if (!_self.model['cd-tag']) _self.applyLeaveTag = true;

            if (!_self.model['cd-tag'] || _self.model['cd-tag'] === " ") _self.model['cd-tag'] = undefined;

            if (!_self.model['cd-manut'] || _self.model['cd-manut'] === " ") {
                _self.model['cd-manut'] = undefined;
                _self.applyLeaveManut = true;
            }

            if (!_self.model['cd-sint-padr'] || _self.model['cd-sint-padr'] === " ") _self.model['cd-sint-padr'] = undefined;

            if (!_self.model['cd-equip-res'] || _self.model['cd-equip-res'] === " ") _self.model['cd-equip-res'] = undefined;

            if (!_self.model['cd-causa-padr'] || _self.model['cd-causa-padr'] === " ") _self.model['cd-causa-padr'] = undefined;

            if (!_self.model['cd-interv-padr'] || _self.model['cd-interv-padr'] === " ") _self.model['cd-interv-padr'] = undefined;

            if (!_self.model['cd-planejado'] || _self.model['cd-planejado'] === " ") _self.model['cd-planejado'] = undefined;
        };

        _self.initNewServiceRequest = function () {
            _self.title = $rootScope.i18n('l-new-solicitation');
            _self.model = { prioridade: 0 };
        };

        _self.leaveCdEquipto = function () {
            if (_self.model['cd-equipto'] !== undefined && _self.applyLeaveEquipto) {

                if (_self.model['cd-tag'] == undefined || _self.model['cd-tag']['cd-tag'] == undefined || (_self.model['cd-tag']['cd-tag'] && _self.model['cd-tag']['cd-tag'] !== _self.model['cd-equipto']['cd-tag'])) {
                    _self.model['cd-tag'] = _self.model['cd-equipto']['cd-tag'] == "" ? undefined : _self.model['cd-equipto']['cd-tag'];

                    if (_self.model['cd-tag'] != undefined && _self.model['cd-tag'] != "") {
                        _self.applyLeaveEquipto = false;
                    }

                }

                if (_self.applyLeaveEquipto) {
                    _self.calculaPrioridade();
                };

            }

            _self.applyLeaveEquipto = true;
        };

        _self.leaveCdTag = function () {
            if (_self.applyLeaveTag) {
                _self.calculaPrioridade();
            }

            _self.applyLeaveTag = true;
        };

        _self.leaveCdManut = function () {
            if (_self.model['cd-manut'] !== undefined && _self.applyLeaveManut) {

                if (_self.model['cd-equip-res'] == undefined || _self.model['cd-equip-res']['cd-equipe'] == undefined || (_self.model['cd-equip-res']['cd-equipe'] && _self.model['cd-equip-res']['cd-equipe'] !== _self.model['cd-manut']['cd-equip-res'])) {
                    _self.model['cd-equip-res'] = _self.model['cd-manut']['cd-equip-res'] == "" ? undefined : _self.model['cd-manut']['cd-equip-res'];
                }
            }

            if (_self.count > 0) {
                var param = {
                    'cdManut': _self.model['cd-manut'] == undefined ? "" : _self.model['cd-manut']['cd-manut'],
                    'cdTag': _self.model['cd-tag'] == undefined ? " " : _self.model['cd-tag']['cd-tag'],
                    'cdEquipto': _self.model['cd-equipto'] == undefined ? " " : _self.model['cd-equipto']['cd-equipto']
                };

                fchmipservicerequest.calculaOrcamento(param, function (result) {
                    _self.model['vl-orcado-mat'] = result[0] == undefined ? 0 : result[0].vlOrcadoMat;
                    _self.model['vl-orcado-mob'] = result[0] == undefined ? 0 : result[0].vlOrcadoMob;
                    _self.model['vl-orcado-ggf'] = result[0] == undefined ? 0 : result[0].vlOrcadoGgf;

                    _self.atualizaTotalOrcado();

                });
            }

            _self.count = _self.count + 1;

            if (_self.applyLeaveManut) {
                _self.calculaPrioridade();
            }

            _self.applyLeaveManut = true;
        };

        _self.calculaPrioridade = function () {

            if (_self.model['cd-manut']) {

                _self.setParametersToSave();

                fchmipservicerequest.getPriority(parameters, function (result) {

                    _self.model['prioridade'] = result[0].prioridade;
                    _self.model['plano-orig'] = result[0].planoOrig;
                });
            }
        }

        _self.onSuccess = function () {
            $scope.$apply(function () {
                _self.carregandoArquivos = false;
            });
            _self.model.ttAnexo = _self.model.files;
            _self.removerDeleteGrid();
        };

        _self.uploadCompleto = function () {
            _self.removerDeleteGrid();
        };

        _self.onSelect = function () {
            $scope.$apply(function () {
                _self.carregandoArquivos = true;
            });
            angular.forEach(_self.model.ttAnexo, function (result) {
                result.name = result.name.replace(/&amp;/g, '&');
            });
        };

        _self.upload = function () {
            _self.removerDeleteGrid();
        };

        _self.removerDeleteGrid = function () {
            if ($('.k-delete')) {
                $('.k-delete').remove();
            }
        };

        _self.remover = function (value) {
            _self.habilitarSalvar();
        };

        _self.onCancel = function () {
            _self.habilitarSalvar();

        };

        _self.habilitarSalvar = function () {
            $scope.$apply(function () {
                _self.carregandoArquivos = false;
            });

            if (_self.model.files != undefined) {
                var carregandoArquivos = _self.model.files.filter(function (element) {
                    return element.isntUploaded;
                });
                if (carregandoArquivos.length > 0) {
                    $scope.$apply(function () {
                        _self.carregandoArquivos = true;
                    });
                }
            }

        };

        _self.onError = function () {
            $scope.$apply(function () {
                _self.carregandoArquivos = false;
            });
            _self.model.ttAnexo = undefined;

            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                type: 'error',
                title: $rootScope.i18n('msg-anexo'),
                detail: $rootScope.i18n('msg-file-send-error')
            });
        };

        _self.save = function () {
            if (_self.isInvalidForm()) return;

            _self.setParametersToSave();

            if (_self.model['cd-equipto'] == undefined)
                _self.model['cd-equipto'] = " ";

            if (_self.data === 'new') _self.saveNewRequest();
            else {
                if (_self.validaFormulario() && _self.validaPrioridade()) {
                    fchmipservicerequest.updateServiceRequest(parameters['tt-solic-serv-html'], function (result) {
                        if (result[0] != undefined) {
                            if (!result.$hasError) {
                                _self.onSaveUpdate(result);
                            }
                        }
                    });
                }
            }
            // Quando há edição/criação, recarrega a lista
            helperServiceRequest.data.reloadList = true;
            _self.isSaveNew = false;
        };

        _self.saveNewRequest = function () {
            if (_self.permEquip == 2) {
                if (_self.model['cd-equipto'].situacao > 1) {
                    /* Equipamento n�o est� ativo. Deseja Cadastrar ? */
                    $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                        title: 'l-question',
                        text: $rootScope.i18n('l-msg-active-equipment-validation'),
                        cancelLabel: 'l-no',
                        confirmLabel: 'l-yes',
                        callback: function (isPositiveResult) {
                            if (isPositiveResult) {
                                _self.createServiceRequest(parameters);
                            }
                        }
                    });
                } else {
                    _self.createServiceRequest(parameters);
                }
            } else if (_self.permEquip == 3) {
                if (_self.model['cd-equipto'].situacao == 1) {
                    _self.createServiceRequest(parameters);
                } else {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error',
                        title: $rootScope.i18n('l-msg-equipment-not-active'),
                        detail: $rootScope.i18n('l-msg-detail-equipment-not-active')
                    });
                }
            } else {
                _self.createServiceRequest(parameters);
            }
        };

        _self.createServiceRequest = function (param) {
            if (_self.validaPrioridade()) {
                fchmipservicerequest.createServiceRequest(param, function (result) {
                    if (result[0] != undefined) {
                        if (!result.$hasError) {
                            _self.nrSoliServ = result['pi-nr-soli-serv'];
                            _self.onSaveUpdate(result);
                        }
                    }
                });
            }
        };

        _self.setParametersToSave = function () {
            parameters = {};

            parameters['tt-solic-serv-html'] = {
                'nrSoliServ': _self.model['nr-soli-serv'],
                'cdEquipto': _self.model['cd-equipto'] == undefined ? " " : _self.model['cd-equipto']['cd-equipto'] == undefined ? " " : _self.model['cd-equipto']['cd-equipto'],
                'cdManut': _self.model['cd-manut'] == undefined ? " " : _self.model['cd-manut']['cd-manut'] == undefined ? " " : _self.model['cd-manut']['cd-manut'],
                'cdSintPadr': _self.model['cd-sint-padr'] == undefined ? " " : _self.model['cd-sint-padr']['cd-sint-padr'] == undefined ? " " : _self.model['cd-sint-padr']['cd-sint-padr'],
                'cdEquipRes': _self.model['cd-equip-res'] == undefined ? " " : _self.model['cd-equip-res']['cd-equipe'] == undefined ? " " : _self.model['cd-equip-res']['cd-equipe'],
                'cdTag': _self.model['cd-tag'] == undefined ? " " : _self.model['cd-tag']['cd-tag'] == undefined ? _self.model['cd-tag'] : _self.model['cd-tag']['cd-tag'],
                'descricao': _self.model['descricao'],
                'narrativa': _self.model['des-narrativa'],
                'nomeUsuar': "",
                'prioridade': _self.model['prioridade'],
                'planoOrig': _self.model['plano-orig']
            }

            parameters.ttAnexo = [];

            angular.forEach(_self.model.ttAnexo, function (anexo) {
                parameters.ttAnexo.push({ 'nomeAnexo': anexo.name });
            });

            if (_self.data != 'new') {
                Object.assign(parameters['tt-solic-serv-html'], {
                    'dtInicio': _self.model['dt-inicio'],
                    'dtTermino': _self.model['dt-termino'],
                    'cdCausaPadr': _self.model['cd-causa-padr'] || "",
                    'cdIntervPadr': _self.model['cd-interv-padr'] || "",
                    'cdPlanejado': _self.model['cd-planejado'],
                    'nrOrdOrig': _self.model['nr-ord-orig'],
                    'cdTarefaOrig': _self.model['cd-tarefa-orig'],
                    'vlOrcadoMat': _self.model['vl-orcado-mat'] == "" ? 0 : _self.model['vl-orcado-mat'],
                    'vlOrcadoMob': _self.model['vl-orcado-mob'] == "" ? 0 : _self.model['vl-orcado-mob'],
                    'vlOrcadoGgf': _self.model['vl-orcado-ggf'] == "" ? 0 : _self.model['vl-orcado-ggf'],
                    'ccCodigo': _self.model['cc-codigo'],
                    'codUnidNegoc': _self.model['cod-unid-negoc']
                }
                );

                _self.model['total-orcado'] = _self.totalOrcamento;
            }
        };

        _self.saveNew = function () {
            _self.save();
            _self.isSaveNew = true;
        };

        _self.onSaveUpdate = function (result) {
            newDocto = undefined;
            var isUpdate = true;
            if (_self.data === 'new') isUpdate = false;

            if (result[0] != undefined && !result.$hasError) {
                if (_self.isSaveNew === true) {
                    _self.initialize();
                } else {
                    _self.redirectToDetail(result);
                    _self.close();
                }

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'success',
                    title: (isUpdate ? $rootScope.i18n('msg-service-request-update') : $rootScope.i18n('msg-sertvice-request-created')),
                    detail: (isUpdate ? $rootScope.i18n('msg-sucess-service-request-update') : $rootScope.i18n('msg-success-service-request-created'))
                });
            }
        };

        _self.isInvalidForm = function () {
            var messages = [];
            var isInvalidForm = false;

            if (!_self.model['descricao'] && !_self.model['des-narrativa']) {
                isInvalidForm = true;
                messages.push('l-description-or-narrative');
            }

            if (isInvalidForm) {
                angular.forEach(messages, function (item) {
                    var warning = '';
                    warning = $rootScope.i18n('l-field');
                    warning = warning + ' ' + $rootScope.i18n(item);
                    warning = warning + ' ' + $rootScope.i18n('l-is-required');
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error',
                        title: $rootScope.i18n('l-attention'),
                        detail: warning
                    });
                });
            }
            return isInvalidForm;
        };

        _self.redirectToDetail = function (result) {
            helperServiceRequest.data = result[0];
            helperServiceRequest.data['cd-tar-orig'] = result[0]['cd-tarefa-orig'];

            if (_self.edit) $modalInstance.close();
            else $location.path('/dts/mmi/servicerequest/detail/');
        };

        _self.close = function () {
            $modalInstance.close();
        };

        _self.atualizaOrdemOrigem = function () {
            helperOrder.data.nrOrdemFiltro = mmiUtils.getIntValue(_self.model['nr-ord-orig']);
            _self.model['cd-tarefa-orig'] = 0;
        }

        _self.atualizaTotalOrcado = function () {
            _self.totalOrcamento = Number(_self.model['vl-orcado-mat']) +
                Number(_self.model['vl-orcado-mob']) +
                Number(_self.model['vl-orcado-ggf']);
        };

        _self.validaFormulario = function () {
            if (_self.model['vl-orcado-mat'] === undefined ||
                _self.model['vl-orcado-mob'] === undefined ||
                _self.model['vl-orcado-ggf'] === undefined) return false;

            return true;
        };

        _self.validaPrioridade = function () {
            if (_self.model.prioridade === undefined) return false;

            return true
        };

        _self.init();

    };

    function undefinedToEmptyString(object) {
        var objectReturn = {};

        for (var label in object) {
            if (typeof (object[label]) === "object")
                objectReturn[label] = undefinedToEmptyString(object[label]);

            if (object[label] == undefined)
                objectReturn[label] = "";
        }

        return objectReturn;
    }

    index.register.service('helperServiceRequest', function () {
        return {
            data: {}
        };
    });

    index.register.service('helperOrder', function () {
        return {
            data: {}
        };
    });

    index.register.controller('mmi.service-modal.EditCtrl', NewServiceModal);
    index.register.service('mmi.servicerequest.modal', modalServiceRequest);
}); 
