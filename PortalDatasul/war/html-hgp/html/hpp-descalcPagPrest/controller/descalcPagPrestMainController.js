define(['index',
    '/dts/hgp/html/hpp-descalcPagPrest/descalcPagPrestFactory.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/global/gpsScheduleTotvs.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/global/sharedGlobalFactory.js',
    '/dts/hgp/html/hcg-unit/unitZoomController.js',
    '/dts/hgp/html/global-provider/providerZoomController.js',
    '/dts/hgp/html/hcg-providerGroup/providerGroupZoomController.js',
    '/dts/hgp/html/hpr-medicineType/medicineTypeZoomController.js',
    '/dts/hgp/html/hpp-tituPrestRef/tituPrestRefZoomController.js',
    '/dts/hgp/html/hpp-tituPrest/tituPrestZoomController.js',
    '/dts/hgp/html/global-parameters/parametersFactory.js'
], function(index) {

    descalcPagPrestMainController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'totvs.app-main-view.Service', 'hpp.descalcPagPrest.Factory', 
    'global.userConfigs.Factory', '$modal', 'AbstractAdvancedFilterController', 'hpp.tituPrestZoomController', 'global.providerZoomController',
    'TOTVSEvent', '$location', '$timeout', '$anchorScroll', 'shared.global.Factory', 'dts-utils.utils.Service'];
    function descalcPagPrestMainController($rootScope, $scope, $state, $stateParams, appViewService, descalcPagPrestFactory,
        userConfigsFactory, $modal, AbstractAdvancedFilterController, tituPrestZoomController, providerZoomController,
        TOTVSEvent, $location, $timeout, $anchorScroll, sharedGlobalFactory, dtsUtils) {

        var _self = this;
        _self.dadosTela = {};
        _self.options = {};
        _self.arqImportacao = "";
        _self.fixedFiltersProvider = {};
        _self.fixedFiltersTitleProvider = {};
        _self.uploadURL="/dts/datasul-rest/resources/prg/hvp/v1/attachments/";
        _self.fixedFiltersTitleProviderRef = {};
        _self.provider;
        _self.providerTitle;
        _self.showTitle = false;

        _self.tituPrestZoomController = tituPrestZoomController;
        _self.providerZoomController = providerZoomController;

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
    
        this.irPara = function (local) {
            // set the location.hash to the id of
            // the element you wish to scroll to.
            $location.hash(local);

            // call $anchorScroll()
            $anchorScroll();
        }
        
        this.onChangeParamProvider = function() {
            $timeout(function () {
                /*if (_self.dadosTela.unidade > 0) {
                    _self.fixedFiltersProvider['cdUnidade'] = _self.dadosTela.unidade;
                } else {
                    delete _self.fixedFiltersProvider['cdUnidade'];
                }*/
                /* Unidade */
                if (_self.dadosTela.unidadePrest.start > 0) {
                    _self.fixedFiltersProvider['cdUnidadeIni'] = _self.dadosTela.unidadePrest.start;
                } else {
                    delete _self.fixedFiltersProvider['cdUnidadeIni'];
                }
                if (_self.dadosTela.unidadePrest.end > 0) {
                    _self.fixedFiltersProvider['cdUnidadeFin'] = _self.dadosTela.unidadePrest.end;
                } else {
                    delete _self.fixedFiltersProvider['cdUnidadeFin'];
                }
                /* Prestador */
                if (_self.dadosTela.prestador.start > 0) {
                    _self.fixedFiltersProvider['cdPrestadorIni'] = _self.dadosTela.prestador.start;
                } else {
                    delete _self.fixedFiltersProvider['cdPrestadorIni'];
                }
                if (_self.dadosTela.prestador.end > 0) {
                    _self.fixedFiltersProvider['cdPrestadorFin'] = _self.dadosTela.prestador.end;
                } else {
                    delete _self.fixedFiltersProvider['cdPrestadorFin'];
                }
                /* Grupo Prestador */
                if (_self.dadosTela.grupoPrest.start > 0) {
                    _self.fixedFiltersProvider['cdGrupoPrestadorIni'] = _self.dadosTela.grupoPrest.start;
                } else {
                    delete _self.fixedFiltersProvider['cdGrupoPrestadorIni'];
                }
                if (_self.dadosTela.grupoPrest.end > 0) {
                    _self.fixedFiltersProvider['cdGrupoPrestadorFin'] = _self.dadosTela.grupoPrest.end;
                } else {
                    delete _self.fixedFiltersProvider['cdGrupoPrestadorFin'];
                }
                /* Unidade Seccional */
                if (_self.dadosTela.unidadeSec.start > 0) {
                    _self.fixedFiltersProvider['cdUnidadeSecIni'] = _self.dadosTela.unidadeSec.start;
                } else {
                    delete _self.fixedFiltersProvider['cdUnidadeSecIni'];
                }
                if (_self.dadosTela.unidadeSec.end > 0) {
                    _self.fixedFiltersProvider['cdUnidadeSecFin'] = _self.dadosTela.unidadeSec.end;
                } else {
                    delete _self.fixedFiltersProvider['cdUnidadeSecFin'];
                }
                _self.provider = null;
            });
        }

        this.onChangeParamTitleProvider = function() {
            $timeout(function () {
                /* Unidade */
                if (_self.dadosTela.unidade > 0) {
                    _self.fixedFiltersTitleProvider['cdUnidade'] = _self.dadosTela.unidade;
                } else {
                    delete _self.fixedFiltersTitleProvider['cdUnidade'];
                }
                /* ReferÃªncia */
                if (_self.dadosTela.referencia > 0) {
                    _self.fixedFiltersTitleProvider['referencia'] = _self.dadosTela.referencia;
                } else {
                    delete _self.fixedFiltersTitleProvider['referencia'];
                }
                /* Tipo Medicina */
                if (_self.dadosTela.tpMedicina.start > 0) {
                    _self.fixedFiltersTitleProvider['cdTipoMedicinaIni'] = _self.dadosTela.tpMedicina.start;
                } else {
                    delete _self.fixedFiltersTitleProvider['cdTipoMedicinaIni'];
                }
                if (_self.dadosTela.tpMedicina.end > 0) {
                    _self.fixedFiltersTitleProvider['cdTipoMedicinaFin'] = _self.dadosTela.tpMedicina.end;
                } else {
                    delete _self.fixedFiltersTitleProvider['cdTipoMedicinaFin'];
                }
                /* Prestador */
                if (_self.provider) {
                    var cdUnidCdPrestadorConc = _self.formatUnidPrestRng(_self.provider);
                    _self.fixedFiltersTitleProvider['unidPrestRng'] = cdUnidCdPrestadorConc;
                } else {
                    delete _self.fixedFiltersTitleProvider['unidPrestRng'];
                }
                _self.providerTitle = null;
            });
        }

        this.init = function () {
            appViewService.startView("Descálculo Pagamento Prestadores", 'hpp.descalcPagPrestMain.Control', _self);
            if (appViewService.lastAction != 'newtab') {
                return;
            }

            /* Carregar dados do zoom sem ter que pesquisar */
            _self.fixedFiltersProvider['loadResultZoom'] = true;
            _self.fixedFiltersTitleProvider['loadResultZoom'] = true;

            descalcPagPrestFactory.getDefaultFilters(function (result) {
                angular.forEach(result, function (value, key) {
                    if (!angular.isUndefined(result)) {
                        _self.dadosTela.unidade = result[0].cdUnidade;
                    } else {
                        _self.dadosTela.unidade = "9999";
                    }
                });
            });

            _self.dadosTela.lgGerarCSV = false;
            _self.dadosTela.nmArquivoCSV = "DescalcPagPrest";
            _self.dadosTela.inParametro = 1;
            _self.dadosTela.unidadePrest = {start: "0000", end: "9999"};
            _self.dadosTela.prestador = {start: "00000000", end: "99999999"};
            _self.dadosTela.grupoPrest = {start: "00", end: "99"};
            _self.dadosTela.unidadeSec = {start: "0000", end: "9999"};
            _self.dadosTela.tpMedicina = {start: "01", end: "99"};
            _self.dadosTela.anoFatura = {start: new Date().getFullYear().toString(), end: "9999"};
            _self.dadosTela.serieFatura = {start: "", end: "ZZZ"};
            _self.dadosTela.numeroFatura = {start: "", end: "ZZZZZZZZZZZZZZZZ"};
            _self.dadosTela.referencia = "";

            _self.execution = {};
            _self.execution.filename = "DescalcPagPrest";

            _self.onChangeParamProvider();
            _self.onChangeParamTitleProvider();
        }

        if ($rootScope.currentuserLoaded) {
            this.init();
        } else {
            $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
                _self.init();
            });
        }

        this.onChangeProvider = function(value){
            if (value) {
                _self.providerZoomController.getSelectResultList(value, {filters: _self.fixedFiltersTitleProvider}, function(result) {
                    _self.provider = null;
                    if (result) {
                        if (result.cdPrestador !== 0){
                            _self.provider = result;
                        }
                    }
                });
            }
            _self.onChangeParamTitleProvider();
        }

        this.onChangeTitleProvider = function(value){
            if (value) {
                _self.tituPrestZoomController.getSelectResultList(value, {filters: _self.fixedFiltersTitleProvider}, function(result) {
                    _self.providerTitle = null;
                    if (result) {
                        if (result.cdUnidCdPrestador.length > 0){
                            _self.providerTitle = result;
                        }
                    }
                });
            }
        }

        this.changeInParametro = function() {
            _self.showTitle = false;
            if(_self.dadosTela.inParametro != 2) {
               _self.dadosTela.anoFatura = {start: new Date().getFullYear().toString(), end: "9999"};
               _self.dadosTela.serieFatura = {start: "", end: "ZZZ"};
               _self.dadosTela.numeroFatura = {start: "", end: "ZZZZZZZZZZZZZZZZ"};
            }
            if (_self.dadosTela.inParametro == 3) {
                _self.showTitle = true;
            }
            if (_self.dadosTela.inParametro == 4) {
                _self.fixedFiltersProvider['lgCalculaAdto'] = true;
                _self.fixedFiltersTitleProviderRef['inTipoTitulo'] = 'AD';
            } else {
                delete _self.fixedFiltersProvider['lgCalculaAdto'];
                _self.fixedFiltersTitleProviderRef['inTipoTitulo'] = "NO";
            }
        }

        this.formatUnidPrestRng = function(provider){
            var cdUnidCdPrestadorConc = "";
            if (provider) {
                if (provider.objSelected) {
                    provider.objSelected.forEach(function (element) {
                        cdUnidCdPrestadorConc = cdUnidCdPrestadorConc + element.cdUnidCdPrestador + ";";
                    });
                } else {
                    if (provider.cdUnidCdPrestador) {
                        cdUnidCdPrestadorConc = provider.cdUnidCdPrestador + ";";
                    }
                }
            }
            return cdUnidCdPrestadorConc;
        }

        this.formatPrestTitleRng = function(providerTitle){
            var prestadorTitleConc = "";
            if (providerTitle) {
                if (providerTitle.objSelected) {
                    providerTitle.objSelected.forEach(function (element) {
                        prestadorTitleConc = prestadorTitleConc +
                                             element.cdUnidCdPrestador + "#" +
                                             element.cdTipoMedicina + "#" +
                                             element.codEsp + "#" +
                                             element.cdSerieNf + "#" +
                                             element.codDoctoAp + "#" +
                                             element.parcela + ";";
                    });
                } else {
                    if (providerTitle.cdUnidCdPrestador) {
                        prestadorTitleConc = providerTitle.cdUnidCdPrestador + "#" +
                                             providerTitle.cdTipoMedicina + "#" +
                                             providerTitle.codEsp + "#" +
                                             providerTitle.cdSerieNf + "#" +
                                             providerTitle.codDoctoAp + "#" +
                                             providerTitle.parcela + ";";
                    }
                }
            }
            return prestadorTitleConc;
        }

        this.generate = function() {

            var cdUnidCdPrestadorConc = _self.formatUnidPrestRng(_self.provider);

            var prestadorTitleConc = _self.formatPrestTitleRng(_self.providerTitle);

            if (!_self.checkFields()) {
                return;
            }

            _self.rpw = dtsUtils.mountExecution(_self.execution, _self.schedule, _self.dadosTela.servidor);

            _self.parametros = {};
            _self.parametros.arquivo             = _self.execution.filename;
            _self.parametros.parametro           = _self.dadosTela.inParametro;
            _self.parametros.lgGerarCSV          = _self.dadosTela.lgGerarCSV;
            _self.parametros.nmArquivoCSV        = _self.dadosTela.nmArquivoCSV;
            _self.parametros.unidade             = Number(_self.dadosTela.unidade);
            _self.parametros.unidadePrestIni     = Number(_self.dadosTela.unidadePrest.start);
            _self.parametros.unidadePrestFim     = Number(_self.dadosTela.unidadePrest.end);
            _self.parametros.prestadorIni        = Number(_self.dadosTela.prestador.start);
            _self.parametros.prestadorFim        = Number(_self.dadosTela.prestador.end);
            _self.parametros.grupoPrestIni       = Number(_self.dadosTela.grupoPrest.start);
            _self.parametros.grupoPrestFim       = Number(_self.dadosTela.grupoPrest.end);
            _self.parametros.unidadeSecIni       = Number(_self.dadosTela.unidadeSec.start);
            _self.parametros.unidadeSecFim       = Number(_self.dadosTela.unidadeSec.end);
            _self.parametros.tpMedicinaIni       = Number(_self.dadosTela.tpMedicina.start);
            _self.parametros.tpMedicinaFim       = Number(_self.dadosTela.tpMedicina.end);
            _self.parametros.anoFaturaIni        = Number(_self.dadosTela.anoFatura.start);
            _self.parametros.anoFaturaFim        = Number(_self.dadosTela.anoFatura.end);
            _self.parametros.serieFaturaIni      = _self.dadosTela.serieFatura.start;
            _self.parametros.serieFaturaFim      = _self.dadosTela.serieFatura.end;
            _self.parametros.numeroFaturaIni     = _self.dadosTela.numeroFatura.start;
            _self.parametros.numeroFaturaFim     = _self.dadosTela.numeroFatura.end;
            _self.parametros.referencia          = _self.dadosTela.referencia;
            _self.parametros.unidPrestRng        = cdUnidCdPrestadorConc;
            _self.parametros.prestTitleRng       = prestadorTitleConc;
            
            if (!this.validateField(_self.provider, false)) {
                $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                    title: 'Atenção!',
                    text: 'Você não selecionou nenhum prestador, desta forma, serão considerados todos os prestadores encontrados nessa seleção. Deseja realmente emitir o relatório com essa seleção?',
                    cancelLabel: 'Não',
                    confirmLabel: 'Sim',
                    size: 'md',
                    callback: function (hasChoosenYes) {
                        if (hasChoosenYes != true) {
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'error', title: "Emissão cancelada, seleção de prestadores não autorizada."
                            });
                        } else {
                            descalcPagPrestFactory.generate(_self.parametros, _self.rpw, function(result) {
                                if (angular.isUndefined(result.$hasError) || !result.$hasError) {
                                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                        type: 'success', title: "Pedido " + result.nrPedido  + " criado com sucesso."
                                    });
                                }
                            });
                        } 
                    }
                }); 
            } else {
                descalcPagPrestFactory.generate(_self.parametros, _self.rpw, function(result) {
                    if (angular.isUndefined(result.$hasError) || !result.$hasError) {
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'success', title: "Pedido " + result.nrPedido  + " criado com sucesso."
                        });
                    }
                });
            }
        }

        this.checkFields = function() {
            var camposOk = true;
            var mensagem = [];

            if (_self.dadosTela.lgGerarCSV && _self.dadosTela.nmArquivoCSV == "") {
                camposOk = false;
                mensagem.push('Arquivo .CSV não informado');
            }

            if (!this.validateField(_self.dadosTela.unidade, false)) {
                camposOk = false;
                mensagem.push('Unidade não informada.');
            }

            if (!this.validateField(_self.dadosTela.unidadePrest, true)) {
                camposOk = false;
                mensagem.push('Unidade da Prestadora não informada.');
            }
            if (Number(_self.dadosTela.unidadePrest.start) > Number(_self.dadosTela.unidadePrest.end)) {
                camposOk = false;
                mensagem.push('Unidade da Prestadora Final deve ser maior que a Inicial.');
            }

            if (!this.validateField(_self.dadosTela.prestador, true)) {
                camposOk = false;
                mensagem.push('Código do Prestador não informado.');
            }
            if (Number(_self.dadosTela.prestador.start) > Number(_self.dadosTela.prestador.end)) {
                camposOk = false;
                mensagem.push('Código do Prestador Final deve ser maior que o Inicial.');
            }

            if (!this.validateField(_self.dadosTela.grupoPrest, true)) {
                camposOk = false;
                mensagem.push('Grupo do Prestador não informado.');
            }
            if (Number(_self.dadosTela.grupoPrest.start) > Number(_self.dadosTela.grupoPrest.end)) {
                camposOk = false;
                mensagem.push('Grupo do Prestador Final deve ser maior que o Inicial.');
            }

            if (!this.validateField(_self.dadosTela.unidadeSec, true)) {
                camposOk = false;
                mensagem.push('Unidade da Seccional não informada.');
            }
            if (Number(_self.dadosTela.unidadeSec.start) > Number(_self.dadosTela.unidadeSec.end)) {
                camposOk = false;
                mensagem.push('Unidade da Seccional Final deve ser maior que a Inicial.');
            }

            if (!this.validateField(_self.dadosTela.tpMedicina, true)) {
                camposOk = false;
                mensagem.push('Tipo de Medicina não informada.');
            }
            if (Number(_self.dadosTela.tpMedicina.start) > Number(_self.dadosTela.tpMedicina.end)) {
                camposOk = false;
                mensagem.push('Tipo de Medicina Final deve ser maior que o Inicial.');
            }

            if (_self.dadosTela.inParametro == 2) {
                if (!this.validateField(_self.dadosTela.anoFatura, true)) {
                    camposOk = false;
                    mensagem.push('Ano da Fatura não informado.');
                }
                if (Number(_self.dadosTela.anoFatura.start) > Number(_self.dadosTela.anoFatura.end)) {
                    camposOk = false;
                    mensagem.push('Ano da Fatura Final deve ser maior que o Inicial.');
                }
    
                if (!this.validateField(_self.dadosTela.serieFatura.end, false)) {
                    camposOk = false;
                    mensagem.push('Série da Fatura não informada.');
                }
    
                if (!this.validateField(_self.dadosTela.numeroFatura.end, false)) {
                    camposOk = false;
                    mensagem.push('Número da Fatura não informado.');
                }
            } else if (_self.dadosTela.inParametro == 3) {
                if (!this.validateField(_self.providerTitle, false)) {
                    camposOk = false;
                    mensagem.push("Títulos dos Prestadores não informados");
                }
            }

            if (!this.validateField(_self.dadosTela.referencia, false)) {
                camposOk = false;
                mensagem.push('Referência não informada.');
            }

            if (!this.validateField(_self.dadosTela.servidor, false)) {
                camposOk = false;
                mensagem.push("Servidor de Execução não informado");
            }

            if (_self.execution.schedule.type == "DATE") {
                if (!this.validateField(_self.execution.schedule.date, false)) {
                    camposOk = false;
                    mensagem.push("Informe a data e hora do agendamento");
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
        }

        this.validateField = function(field, isRangeField) {
            if (isRangeField) {
                if (angular.isUndefined(field.start)) {
                    return false;
                }
                if (field.start == "") {
                    return false;
                }
                if (angular.isUndefined(field.end)) {
                    return false;
                }
                if (field.end == "") {
                    return false;
                }
            } else {
                if (angular.isUndefined(field)) {
                    return false;
                }
                if (field == "") {
                    return false;
                }
                if (field == null) {
                    return false;
                }
            }
            return true;
        }


        this.onUploadSuccess = function(event){            

			var lgAchouPrest = false;

            descalcPagPrestFactory.getCSVHealthProviders(event.files[0].name, function(result) {
                if (angular.isUndefined(result.$hasError) || !result.$hasError) {                   

                    if(!_self.provider || !_self.provider.objSelected){
                        _self.provider = {objSelected: []};                        
                    }
                    
                    result.forEach(function (element) {
                            
						lgAchouPrest = false;
						for (var i=0; i<_self.provider.objSelected.length; i++) { // verifica se existe o mesmo elemento dentro do array
							 if (element.healthInsurerCode == _self.provider.objSelected[i].cdUnidade && element.code == _self.provider.objSelected[i].cdPrestador) {
								 lgAchouPrest = true;
								 break;
							 }
						}
						
						// se não encontrou então cria o registro de origem do CSV dentro do array do combo
						if (!lgAchouPrest) {
                            _self.provider.objSelected.push({
                                cdUnidade: element.healthInsurerCode,
                                cdPrestador: element.code,
                                nmPrestador: element.name,
                                nrCgcCpf: element.taxpayerRegistry,
                                cdUnidCdPrestador: element.healthInsurerCodeProviderCode
							});
                        }     
						
                    });                    
                }
            });                    
        }       
    }

    index.register.controller('hpp.descalcPagPrestMain.Control', descalcPagPrestMainController);
});