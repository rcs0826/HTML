define(['index',
    '/dts/hgp/html/hpp-relatPeona/relatPeonaFactory.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/global/gpsScheduleTotvs.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/global/sharedGlobalFactory.js',
    '/dts/hgp/html/global-parameters/parametersFactory.js'
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    relatPeonaMainController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'totvs.app-main-view.Service',
        'hpp.relatPeona.Factory', 'global.userConfigs.Factory',
        '$modal', 'AbstractAdvancedFilterController', 'TOTVSEvent', '$location', '$timeout', '$anchorScroll', 'shared.global.Factory',
        'dts-utils.utils.Service'];
    function relatPeonaMainController($rootScope, $scope, $state, $stateParams, appViewService, relatPeonaFactory,
        userConfigsFactory, $modal, AbstractAdvancedFilterController,
        TOTVSEvent, $location, $timeout, $anchorScroll, sharedGlobalFactory, dtsUtils) {

        var _self = this;

        this.init = function () {
            appViewService.startView("Relatório de Eventos Ocorridos e Não Avisados", 'hpp.relatPeonaMain.Control', _self);

            if (appViewService.lastAction != 'newtab') {
                return;
            }

            _self.dadosTela = {};
            _self.execution = {};
            _self.execution.filename = "relatpeona.lst";
            _self.dadosTela.cdUnidadeIni = "1";
            _self.dadosTela.cdUnidadeFim = "9999";;
            _self.dadosTela.cdPrestadorIni = "1";
            _self.dadosTela.cdPrestadorFim = "99999999";
            _self.dadosTela.cdCarteiraInicial = "0000000000000";
            _self.dadosTela.cdCarteiraFinal = "9999999999999";
            _self.dadosTela.tpClinicaIni = "1";
            _self.dadosTela.tpClinicaFim = "99";
            _self.dadosTela.cdGrupoPrestadorIni = "1";
            _self.dadosTela.cdGrupoPrestadorFim = "99";
            _self.dadosTela.dtContabIni = new Date();
            _self.dadosTela.dtContabFim = new Date();
            _self.dadosTela.cdContaFim = "ZZZZZZZZZZZZZZZZZZZZ";
            _self.dadosTela.dtRealizacaoIni = "01/01/1900";
            _self.dadosTela.dtRealizacaoFim = new Date();
            _self.dadosTela.cdUnidadeCarteiraIni = "1";
            _self.dadosTela.cdUnidadeCarteiraFim = "9999";
            _self.dadosTela.lgOutrosDados = true;


            _self.dadosTela.tipoRelatorio = 1;
            _self.options = {};
            _self.options.servidores = {
                transport: {
                    read: {
                        url: '../dts/datasul-rest/resources/api/fch/fchsau/shared/fchsausharedglobal/getRpwServers/',
                        dataType: 'json'
                    }
                },
                serverFiltering: true,
                schema: {
                    data: 'data'
                }
            };

        };

        this.irPara = function (local) {
            // set the location.hash to the id of
            // the element you wish to scroll to.
            $location.hash(local);

            // call $anchorScroll()
            $anchorScroll();

        }

        this.generate = function () {

            console.log(_self.schedule);
            console.log(_self.execution);
            console.log();

            if (!_self.checkFields()) {
                return;
            }

            _self.parametros = {};
            _self.rpw = {};

            _self.rpw = dtsUtils.mountExecution(_self.execution, _self.schedule, _self.dadosTela.servidor);

            _self.parametros.lgBeneficiario = _self.dadosTela.lgBeneficiario;
            _self.parametros.tipoRelatorio = _self.dadosTela.tipoRelatorio;
            _self.parametros.arquivo = _self.execution.filename;
            _self.parametros.lgTxt = _self.dadosTela.lgTxt;
            _self.parametros.dsTxt = _self.dadosTela.dsTxt;
            _self.parametros.lgCsv = _self.dadosTela.lgCsv;
            _self.parametros.dsCsv = _self.dadosTela.dsCsv;
            _self.parametros.dtContabIni = new Date(_self.dadosTela.dtContabIni);
            _self.parametros.dtContabFim = new Date(_self.dadosTela.dtContabFim);
            _self.parametros.lgGrupoConta = _self.dadosTela.lgGrupoConta;
            _self.parametros.cdGrupoContaIni = _self.dadosTela.cdGrupoContaIni;
            _self.parametros.cdGrupoContaFim = _self.dadosTela.cdGrupoContaFim;
            _self.parametros.lgOutrosDados = _self.dadosTela.lgOutrosDados;
            _self.parametros.cdContaIni = _self.dadosTela.cdContaIni;
            _self.parametros.cdContaFim = _self.dadosTela.cdContaFim;
            _self.parametros.dtRealizacaoIni = new Date(_self.dadosTela.dtRealizacaoIni);
            _self.parametros.dtRealizacaoFim = new Date(_self.dadosTela.dtRealizacaoFim);
            _self.parametros.cdUnidadeIni = _self.dadosTela.cdUnidadeIni;
            _self.parametros.cdUnidadeFim = _self.dadosTela.cdUnidadeFim;
            _self.parametros.cdPrestadorIni = _self.dadosTela.cdPrestadorIni;
            _self.parametros.cdPrestadorFim = _self.dadosTela.cdPrestadorFim;
            _self.parametros.cdUnidadeCarteiraIni = _self.dadosTela.cdUnidadeCarteiraIni;
            _self.parametros.cdUnidadeCarteiraFim = _self.dadosTela.cdUnidadeCarteiraFim;
            _self.parametros.cdCarteiraInicial = _self.dadosTela.cdCarteiraInicial;
            _self.parametros.cdCarteiraFinal = _self.dadosTela.cdCarteiraFinal;
            _self.parametros.cdGrupoPrestadorIni = _self.dadosTela.cdGrupoPrestadorIni;
            _self.parametros.cdGrupoPrestadorFim = _self.dadosTela.cdGrupoPrestadorFim;
            _self.parametros.lgMovtosContab = _self.dadosTela.lgMovtosContab;
            _self.parametros.lgMovtosExtra = _self.dadosTela.lgMovtosExtra;
            _self.parametros.lgMovtosContestado = _self.dadosTela.lgMovtosContestado;
            _self.parametros.lgMovtosDesconto = _self.dadosTela.lgMovtosDesconto;
            _self.parametros.lgFaturaAvulsa = _self.dadosTela.lgFaturaAvulsa;
            _self.parametros.lgEvento = _self.dadosTela.lgEvento;


            relatPeonaFactory.scheduleRpw(_self.parametros, _self.rpw, function (result) {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'success', title: 'Operação concluída com sucesso!'
                });

            });


        }

        this.changeGrupoConta = function (){

            _self.dadosTela.cdGrupoContaIni = "1";
            _self.dadosTela.cdGrupoContaFim = "99999999";

            if(_self.dadosTela.lgGrupoConta)
                _self.dadosTela.lgOutrosDados = true;

        }

        this.changeOutrosDados = function(){

            _self.dadosTela.cdUnidadeIni = "1";
            _self.dadosTela.cdUnidadeFim = "9999";;
            _self.dadosTela.cdPrestadorIni = "1";
            _self.dadosTela.cdPrestadorFim = "99999999";
            _self.dadosTela.cdCarteiraInicial = "0000000000000";
            _self.dadosTela.cdCarteiraFinal = "9999999999999";
            _self.dadosTela.cdGrupoPrestadorIni = "1";
            _self.dadosTela.cdGrupoPrestadorFim = "99";
            _self.dadosTela.dtContabIni = new Date();
            _self.dadosTela.dtContabFim = new Date();
            _self.dadosTela.cdContaFim = "ZZZZZZZZZZZZZZZZZZZZ";
            _self.dadosTela.dtRealizacaoIni = "01/01/1900";
            _self.dadosTela.dtRealizacaoFim = new Date();
            _self.dadosTela.cdUnidadeCarteiraIni = "1";
            _self.dadosTela.cdUnidadeCarteiraFim = "9999";
            _self.dadosTela.cdContaIni = "";
            _self.dadosTela.cdContaFim = "ZZZZZZZZZZZZZZZZZZZZ";

        }


        this.checkFields = function () {
            var camposOk = true;
            var mensagem = [];

            if (_self.filtersForm.$invalid) {
                camposOk = false;
                _self.filtersForm.$setDirty();
                angular.forEach(_self.filtersForm, function (value, key) {
                    if (typeof value === 'object' && value.hasOwnProperty('$modelValue')) {
                        value.$setDirty();
                    }
                });
                mensagem.push('Existem campos com valor inválido ou nao informado. Revise as informações.');
            }


            if (_self.dadosTela.dtContabIni == "") {
                camposOk = false;
                mensagem.push('Data de Contabilização Inicial não informado.');
            }
            if (_self.dadosTela.dtContabFim == "") {
                camposOk = false;
                mensagem.push('Data de Contabilização Final não informada.');
            }
            if (_self.dadosTela.dtContabIni > _self.dadosTela.dtContabFim) {
                camposOk = false;
                mensagem.push('Data de Contabilização Final deve ser maior que a Inicial.');
            }

            if (_self.dadosTela.lgGrupoCtas) {
                if (_self.dadosTela.cdGrupoContaIni > _self.dadosTela.cdGrupoContaFim) {
                    camposOk = false;
                    mensagem.push('Grupo da Conta Final deve ser maior que o Inicial.');
                }

            }

            if (_self.dadosTela.lgOutrosDados) {
                if (_self.dadosTela.cdContaIni > _self.dadosTela.cdContaFim) {
                    camposOk = false;
                    mensagem.push('Conta Final deve ser maior que o Inicial.');
                }

            }




            if (_self.dadosTela.cdUnidadeIni == "") {
                camposOk = false;
                mensagem.push('Unidade Inicial não informado.');
            }
            if (_self.dadosTela.cdUnidadeFim == "") {
                camposOk = false;
                mensagem.push('Unidade Final não informada.');
            }
            if (_self.dadosTela.cdUnidadeIni > _self.dadosTela.cdUnidadeFim) {
                camposOk = false;
                mensagem.push('Unidade Final deve ser maior que o Inicial.');
            }


            if (_self.dadosTela.cdPrestadorIni == "") {
                camposOk = false;
                mensagem.push('Prestador Inicial não informado.');
            }
            if (_self.dadosTela.cdPrestadorFim == "") {
                camposOk = false;
                mensagem.push('Prestador Final não informada.');
            }
            if (_self.dadosTela.cdPrestadorIni > _self.dadosTela.cdPrestadorFim) {
                camposOk = false;
                mensagem.push('Prestador Final deve ser maior que o Inicial.');
            }


            if (_self.dadosTela.cdGrupoPrestadorIni == "") {
                camposOk = false;
                mensagem.push('Grupo Prestador Inicial não informado.');
            }
            if (_self.dadosTela.cdGrupoPrestadorFim == "") {
                camposOk = false;
                mensagem.push('Grupo Prestador Final não informada.');
            }
            if (_self.dadosTela.cdGrupoPrestadorIni > _self.dadosTela.cdGrupoPrestadorFim) {
                camposOk = false;
                mensagem.push('Prestador Final deve ser maior que o Inicial.');
            }

            if (_self.dadosTela.dtRealizacaoIni == "") {
                camposOk = false;
                mensagem.push('Data de Realização Inicial não informada.');
            }
            if (_self.dadosTela.dtRealizacaoFim == "") {
                camposOk = false;
                mensagem.push('Data de Realização Final não informada.');
            }
            if (_self.dadosTela.dtRealizacaoIni > _self.dadosTela.dtRealizacaoFim) {
                camposOk = false;
                mensagem.push('Data de Realização Final deve ser maior que a Inicial.');
            }


            if (!_self.dadosTela.servidor) {
                camposOk = false;
                mensagem.push('Servidor deve ser informado.');
            }


            if (_self.dadosTela.cdUnidadeCarteiraIni == "") {
                camposOk = false;
                mensagem.push('Unidade Inicial da Carteira não informada.');
            }
            if (_self.dadosTela.cdUnidadeCarteiraFim == "") {
                camposOk = false;
                mensagem.push('Unidade Final da Carteira não informada.');
            }
            if (_self.dadosTela.cdUnidadeCarteiraIni > _self.dadosTela.cdUnidadeCarteiraFim) {
                camposOk = false;
                mensagem.push('Unidade da Carteira Final deve ser maior que o Inicial.');
            }


            if (_self.dadosTela.cdCarteiraIni == "") {
                camposOk = false;
                mensagem.push('Carteira Inicial não informada.');
            }
            if (_self.dadosTela.cdCarteiraFim == "") {
                camposOk = false;
                mensagem.push('Carteira Final não informada.');
            }
            if (_self.dadosTela.cdCarteiraIni > _self.dadosTela.cdCarteiraFim) {
                camposOk = false;
                mensagem.push('Carteira Final deve ser maior que o Inicial.');
            }


            if (!camposOk) {
                mensagem.forEach(function (element) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', title: element
                    });
                }, this);
            }
            return camposOk;
        }

        if ($rootScope.currentuserLoaded) {
            this.init();
        } else {
            $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
                _self.init();
            });
        }
    }
    index.register.controller('hpp.relatPeonaMain.Control', relatPeonaMainController);

});


