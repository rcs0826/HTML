define(['index',
    '/dts/hgp/html/hac-geracSenhaLote/geracSenhaLoteFactory.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/global/gpsScheduleTotvs.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/global/sharedGlobalFactory.js',
    '/dts/hgp/html/global-parameters/parametersFactory.js'
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    geracSenhaLoteMainController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'totvs.app-main-view.Service',
        'hac.geracSenhaLote.Factory', 'global.userConfigs.Factory',
        '$modal', 'AbstractAdvancedFilterController', 'TOTVSEvent', '$location', '$timeout', '$anchorScroll', 'shared.global.Factory',
        'dts-utils.utils.Service'];
    function geracSenhaLoteMainController($rootScope, $scope, $state, $stateParams, appViewService, geracSenhaLoteFactory,
        userConfigsFactory, $modal, AbstractAdvancedFilterController,
        TOTVSEvent, $location, $timeout, $anchorScroll, sharedGlobalFactory, dtsUtils) {

        var _self = this;
        _self.dadosTela = {};
        _self.options = {};
        _self.options.tipoAtendimento = [
            { 'value': 1, 'label': 'Telefônico' },
            { 'value': 2, 'label': 'Sistema' },
            { 'value': 3, 'label': 'Carta' },
            { 'value': 4, 'label': 'Presencial' },
            { 'value': 5, 'label': 'Outro' }];
        _self.options.prestadorBenef = [{ 'value': 'Beneficiário', 'label': 'Beneficiário' }
            , { 'value': 'Prestador', 'label': 'Prestador' }];
        _self.dadosTela.lgPrestadorBenef = 'Prestador';
        _self.dadosTela.dtSenhas = new Date();
        _self.execution = {};
        _self.execution.filename = "geracsenha";
        _self.dadosTela.clinicaIni = "1";
        _self.dadosTela.clinicaFim = "99999999";
        _self.dadosTela.cdUnidadeIni = "1";
        _self.dadosTela.cdUnidadeFim = "9999";;
        _self.dadosTela.cdPrestadorIni = "1";
        _self.dadosTela.cdPrestadorFim = "99999999";
        _self.dadosTela.cdCarteira = "0000000000000";
        _self.dadosTela.tpClinicaIni = "1";
        _self.dadosTela.tpClinicaFim = "99";
        _self.dadosTela.cdGrupoPrestadorIni = "1";
        _self.dadosTela.cdGrupoPrestadorFim = "99";
        _self.options.prioridade = [];
        _self.options.motivoAtendimento = [];
        _self.options.categoria = [];
        _self.options.grupoAtendimento = [];
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
        this.getMotivoAtendimento = function () {
            _self.options.motivoAtendimento = [];
            _self.dadosTela.inMotivo = "";
            $timeout(function () {
                geracSenhaLoteFactory.getAllMotivesByGroup(_self.dadosTela.inGrupoAtendimento, function (result) {
                    angular.forEach(result, function (value, key) {

                        var motivoAtendimento = {};
                        motivoAtendimento.value = value["cdMotivo"];
                        motivoAtendimento.label = value["dsMotivo"];
                        _self.options.motivoAtendimento.push(motivoAtendimento);

                    });
                });
            })
        };

        this.changeGenerationType = function () {

            if (_self.dadosTela.lgPrestadorBenef == 'Beneficiário') {
                _self.dadosTela.cdCarteira = "";
                _self.dadosTela.clinicaIni = "1";
                _self.dadosTela.clinicaFim = "99999999";
                _self.dadosTela.cdUnidadeIni = "1";
                _self.dadosTela.cdUnidadeFim = "9999";;
                _self.dadosTela.cdPrestadorIni = "1";
                _self.dadosTela.cdPrestadorFim = "99999999";
                _self.dadosTela.cdCarteira = "0000000000000";
                _self.dadosTela.tpClinicaIni = "1";
                _self.dadosTela.tpClinicaFim = "99";
                _self.dadosTela.cdGrupoPrestadorIni = "1";
                _self.dadosTela.cdGrupoPrestadorFim = "99";
            }
            else {
                _self.dadosTela.tpClinicaIni = "";
                _self.dadosTela.tpClinicaFim = "";
                _self.dadosTela.clinicaFim = "";
                _self.dadosTela.cdUnidadeFim = "";
                _self.dadosTela.cdPrestadorFim = "";
                _self.dadosTela.cdGrupoPrestadorIni = "";
                _self.dadosTela.cdGrupoPrestadorFim = "";
                _self.dadosTela.qtdSenhas = "1";
                _self.dadosTela.clinicaIni = "1";
                _self.dadosTela.clinicaFim = "99999999";
                _self.dadosTela.cdUnidadeIni = "1";
                _self.dadosTela.cdUnidadeFim = "9999";;
                _self.dadosTela.cdPrestadorIni = "1";
                _self.dadosTela.cdPrestadorFim = "99999999";
                _self.dadosTela.cdCarteira = "0000000000000";
                _self.dadosTela.tpClinicaIni = "1";
                _self.dadosTela.tpClinicaFim = "99";
                _self.dadosTela.cdGrupoPrestadorIni = "1";
                _self.dadosTela.cdGrupoPrestadorFim = "99";
            }

        };
        this.zeroPad = function (num, places) {
            var zero = places - num.toString().length + 1;
            return Array(+(zero > 0 && zero)).join("0") + num;
        };
        this.init = function () {
            appViewService.startView("Gerar Lote de Senhas por Seleção", 'hac.geracSenhaLoteMain.Control', _self);
            if (appViewService.lastAction != 'newtab') {
                return;
            }


            geracSenhaLoteFactory.getQuery('getCallPriority', function (result) {
                angular.forEach(result, function (value, key) {

                    var prioridade = {};
                    prioridade.value = value["id-prioridade"];
                    prioridade.label = value["ds-prioridade"];
                    _self.options.prioridade.push(prioridade);

                });
            });

            geracSenhaLoteFactory.getQuery('getAllCategories', function (result) {
                angular.forEach(result, function (value, key) {

                    var categoria = {};
                    categoria.value = value["cdCategoria"];
                    categoria.label = value["dsCategoria"];
                    _self.options.categoria.push(categoria);

                });
            });

            geracSenhaLoteFactory.getQuery('getAllGroupsByUserAndRole', function (result) {
                angular.forEach(result, function (value, key) {

                    var grupoAtendimento = {};
                    grupoAtendimento.value = value["cdn-grp-atendim"];
                    grupoAtendimento.label = value["nom-grp-atendim"];
                    _self.options.grupoAtendimento.push(grupoAtendimento);

                });
            });
        };

        this.irPara = function (local) {
            // set the location.hash to the id of
            // the element you wish to scroll to.
            $location.hash(local);

            // call $anchorScroll()
            $anchorScroll();

        };

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

            _self.parametros.arquivo = _self.execution.filename;
            _self.parametros.qtSenhas = _self.dadosTela.qtdSenhas;
            _self.parametros.dtSenhas = _self.dadosTela.dtSenhas;
            _self.parametros.dsAssunto = _self.dadosTela.dsAssunto;
            _self.parametros.dsDescricao = _self.dadosTela.dsDescricao;
            _self.parametros.inPrioridade = _self.dadosTela.inPrioridade;
            _self.parametros.inGrupoAtendimento = _self.dadosTela.inGrupoAtendimento;
            _self.parametros.inCategoria = _self.dadosTela.inCategoria;
            _self.parametros.inMotivo = _self.dadosTela.inMotivo;
            _self.parametros.tpAtendimento = _self.dadosTela.tpAtendimento;
            _self.parametros.clinicaIni = _self.dadosTela.clinicaIni;
            _self.parametros.clinicaFim = _self.dadosTela.clinicaFim;
            _self.parametros.cdUnidadeIni = _self.dadosTela.cdUnidadeIni;
            _self.parametros.cdUnidadeFim = _self.dadosTela.cdUnidadeFim;
            _self.parametros.cdPrestadorIni = _self.dadosTela.cdPrestadorIni;
            _self.parametros.cdPrestadorFim = _self.dadosTela.cdPrestadorFim;
            _self.parametros.cdCarteira = _self.dadosTela.cdCarteira;
            _self.parametros.tpClinicaIni = _self.dadosTela.tpClinicaIni;
            _self.parametros.tpClinicaFim = _self.dadosTela.tpClinicaFim;
            _self.parametros.cdGrupoPrestadorIni = _self.dadosTela.cdGrupoPrestadorIni;
            _self.parametros.cdGrupoPrestadorFim = _self.dadosTela.cdGrupoPrestadorFim;

            geracSenhaLoteFactory.generatePasscode(_self.parametros, _self.rpw, function(result){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'success', title: 'Operação concluída com sucesso!'
                });       

            });


        };



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


            if (_self.dadosTela.lgPrestadorBenef == 'Beneficiário') {
                if (_self.dadosTela.cdCarteira == "") {
                    camposOk = false;
                    mensagem.push('Carteira não informada.');
                }

                if (_self.dadosTela.clinicaIni == "") {
                    camposOk = false;
                    mensagem.push('Clínica Inicial não informada.');
                }

                if (_self.dadosTela.cdUnidadeIni == "") {
                    camposOk = false;
                    mensagem.push('Unidade Inicial não informado.');
                }

                if (_self.dadosTela.cdPrestadorIni == "") {
                    camposOk = false;
                    mensagem.push('Prestador Inicial não informado.');
                }

            }
            else {
                if (_self.dadosTela.tpClinicaIni == "") {
                    camposOk = false;
                    mensagem.push('Tipo de Clínica Inicial não informado.');
                }
                if (_self.dadosTela.tpClinicaFim == "") {
                    camposOk = false;
                    mensagem.push('Tipo de Clínica Final não informado.');
                }
                if (_self.dadosTela.tpClinicaIni > _self.dadosTela.tpClinicaFim) {
                    camposOk = false;
                    mensagem.push('Tipo de Clínica Final deve ser maior que o Inicial.');
                }

                if (_self.dadosTela.clinicaIni == "") {
                    camposOk = false;
                    mensagem.push('Clínica Inicial não informada.');
                }
                if (_self.dadosTela.clinicaFim == "") {
                    camposOk = false;
                    mensagem.push('Clínica Final não informada.');
                }
                if (_self.dadosTela.clinicaIni > _self.dadosTela.clinicaFim) {
                    camposOk = false;
                    mensagem.push('Clínica Final deve ser maior que o Inicial.');
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

                if(!_self.dadosTela.servidor){
                    camposOk = false;
                    mensagem.push('Servidor deve ser informado.');
                }

            }



            if (!camposOk) {
                mensagem.forEach(function (element) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', title: element
                    });
                }, this);
            }
            return camposOk;
        };

        if ($rootScope.currentuserLoaded) {
            this.init();
        } else {
            $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
                _self.init();
            });
        }
    }
    index.register.controller('hac.geracSenhaLoteMain.Control', geracSenhaLoteMainController);

});


