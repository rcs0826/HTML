define(['index',
        'filter-i18n'], function(index) {

    // *********************************************************************************
    // *** Controller Detalhe
    // *********************************************************************************
    comparativeRealStandardCtrl.$inject = [
        '$scope',
        '$modal',
        '$filter',
        '$stateParams',
        'i18nFilter',
        'fchmcs.fchmcs0002.Factory',
        'totvs.app-main-view.Service',
        'mpd.estabelec.zoom',
        'men.item.zoom',
        'men.referenciaitem.zoom',
        'totvs.app-notification.Service',
        'toaster',
        'helperComparativeRealStandard'];


    function comparativeRealStandardCtrl ($scope,
                                         $modal,
                                         $filter,
                                         $stateParams,
                                         i18n,
                                         fchmcs0002Factory,
                                         appViewService,
                                         serviceSiteZoom,
                                         serviceItemZoom,
                                         serviceItemReferenceZoom,
                                         notification,
                                         toaster,
                                         helperComparativeRealStandard) {

        var self = this;
        
        this.serviceItemZoom = serviceItemZoom;
        this.serviceSiteZoom = serviceSiteZoom;
        this.serviceItemReferenceZoom = serviceItemReferenceZoom;
        this.isMultiSites = true;
        self.hasRecord    = false;

        self.model = {initialPeriod: 0,
                      finalPeriod: 0,
                      itemHasReference: false, // habilita o campo referencia quando o item for controlado por referencia
                      reference: {'cod-refer': ''}
        };
        
        self.paramModel = {
            orderRange: { start: '0', end: '999999999' },
            emissionDateRange: { startDate: new Date(1900,0,1), endDate: new Date() },
            lotRange: {start: '', end: 'ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ'},            
            internalOrder: true,
            externalOrder: true,
            interExterOrder: true,
            reworkOrder: false,
            consertoOrder: false,            
            maintOrder: true,
            fixedActiveOrder: true,
            toolingOrder: true,
            reuseOrder: false,            
            selectedPriceType: 1,
            selectedOrderStatus: 1,
            selectedOperationCost: 1,
            structureCutDate: new Date(),
            operationCutDate: new Date(),
            currencies: [],
            managerialCurrencies: [],
            selectedCurrency: 0,
            ssp_fech_gerencial_active: false
        };

        self.alertsModel = [];


        self.refreshComparative = function () {
            
            var parameters = {
                ttParamCustoReal: [{
                    'estab'             : self.model.site,
                    'itCodigo'          : self.model.item,
                    'codRefer'          : self.model.reference['cod-refer'],
                    'moeda'             : self.paramModel.selectedCurrency,
                    'dtIniMovto'        : self.model.initialPeriod,
                    'dtFimMovto'        : self.model.finalPeriod,
                    'estadoOrd'         : self.paramModel.selectedOrderStatus,
                    'dtIniEmis'         : self.paramModel.emissionDateRange.startDate,
                    'dtFimEmis'         : self.paramModel.emissionDateRange.endDate,
                    'ordIni'            : self.paramModel.orderRange.start,
                    'ordFim'            : self.paramModel.orderRange.end,
                    'lotIni'            : self.paramModel.lotRange.start,
                    'lotFim'            : self.paramModel.lotRange.end,
                    'lInternalOrder'    : self.paramModel.internalOrder,
                    'lExternalOrder'    : self.paramModel.externalOrder,
                    'lInterExterOrder'  : self.paramModel.interExterOrder,
                    'lMaintOrder'       : self.paramModel.maintOrder,
                    'lFixedActiveOrder' : self.paramModel.fixedActiveOrder,
                    'lToolingOrder'     : self.paramModel.toolingOrder,                    
                    'lConsertoOrder'    : self.paramModel.consertoOrder,
                    'lReworkOrder'      : self.paramModel.reworkOrder,
                    'lReuseOrder'       : self.paramModel.reuseOrder,                    
                }],
                ttParamCustoPadrao: [{
                    'dtCorteEstrut'     : self.paramModel.structureCutDate,
                    'dtCorteOP'         : self.paramModel.operationCutDate,
                    'iTpPreco'          : self.paramModel.selectedPriceType,
                    'iTpOper'           : self.paramModel.selectedOperationCost
                }]
            };

            resetValuesComparative();
            fchmcs0002Factory.costRealStandard(parameters, function(result){
                if (result) {
                    var valoresReal = result.ttValoresReal[0];
                    var valoresPadrao = result.ttValoresPadrao[0];

                    self.comparative = {
                        produced              : valoresReal.qtProduzida,
                        scrap                 : valoresReal.qtRefugo,
                        realMaterialValue     : valoresReal.valorMatReal,
                        realGGFValue          : valoresReal.valorGgfReal,
                        realLaborValue        : valoresReal.valorMobReal,
                        realTotalValue        : valoresReal.valorTotReal,

                        standardMaterialValue : valoresPadrao.valorMatPadrao,
                        standardGGFValue      : valoresPadrao.valorGgfPadrao, 
                        standardLaborValue    : valoresPadrao.valorMobPadrao,
                        standardTotalValue    : valoresPadrao.valorTotPadrao,

                        standardDetailGGF     : valoresPadrao.valorGgfDetalhe,
                        standardDetailPrepar  : valoresPadrao.valorPrepar,
                        standardDetailOpExt   : valoresPadrao.valorOpExt,
                    
                        realMaterialDetail    : result.dsMaterial,
                        realGgfDetail         : result.dsGGF,
                        realMobDetail         : result.dsMob,
                        dsOrder               : result.dsOrdem,

                        variationMaterialPercentage : valoresPadrao.variacaoMat,
                        variationGGFPercentage      : valoresPadrao.variacaoGgf,
                        variationLaborPercentage    : valoresPadrao.variacaoMob
                    };

                    self.alertsModel = result["ttErrors"];

                    if (self.alertsModel.length != 0) {
                        toaster.warning(i18n('l-warning', [], 'dts/mcs'),
                                        i18n('l-warnings-found', [], 'dts/mcs') + 
                                        i18n('l-alert-click', [], 'dts/mcs'),
                                        {timeOut: 9000});
                    }

                    updateChart();
                    createGgfDetailHtml();
                }
            });

        }

        var resetValuesComparative = function() {
            
            self.comparative = {
                standardMaterialValue : 0,
                standardGGFValue      : 0,
                standardLaborValue    : 0,
                standardTotalValue    : 0,
                produced              : 0,
                scrap                 : 0,
                realMaterialValue     : 0,
                realGGFValue          : 0,
                realLaborValue        : 0,
                realTotalValue        : 0,
                variationGGFPercentage : 0,
                variationMaterialPercentage : 0,
                variationLaborPercentage : 0,
                realMaterialDetail: [],
                realGgfDetail     : [],
                realMobDetail     : [],
                standardDetailGGF: [0,0,0,0,0,0],
                standardDetailPrepar: 0,
                standardDetailOpExt: 0
            };

            self.alertsModel = [];

            updateChart();
            getStatusFuncaoFechGerencial();
        }

        var getStatusFuncaoFechGerencial = function(){
            fchmcs0002Factory.statusFuncaoFechGerencial(function(result){
                console.log(result);
                self.paramModel.ssp_fech_gerencial_active = result.ativo;
            });
        }           

        var updateChart = function() {

            self.series = [
                                {name: i18n('l-real-value', [], 'dts/mcs'), color: '#1E90FF',
                                 data: [ self.comparative.realMaterialValue,
                                         self.comparative.realGGFValue, 
                                         self.comparative.realLaborValue, 
                                         self.comparative.realTotalValue]},
                                {name: i18n('l-standard-value', [], 'dts/mcs'), color: '#87CEFA', 
                                data: [ self.comparative.standardMaterialValue,
                                        self.comparative.standardGGFValue, 
                                        self.comparative.standardLaborValue, 
                                        self.comparative.standardTotalValue]}
                              ];

            self.categories = [i18n('l-mat-value', [], 'dts/mcs'), 
                               i18n('l-ggf-value', [], 'dts/mcs'), 
                               i18n('l-labor-value', [], 'dts/mcs'), 
                               i18n('l-total-value', [], 'dts/mcs')];

        }

        self.onChangeSite = function() {
            var parameters = {
                site: (self.model.site === undefined) ? '' : self.model.site
            }

            fchmcs0002Factory.period(parameters, function(result){

                if (result) {
                    self.model.initialPeriod    = new Date(result.pDtIniPer);
                    self.model.finalPeriod      = new Date(result.pDtFimPer);
                } else {
                    var d = new Date();
                    self.model.initialPeriod    = new Date(d.getFullYear(), d.getMonth() - 1, d.getDate());
                    self.model.finalPeriod      = new Date();

                }
            });
        }
        
        /* Função....: onChangeItem
           Descrição.: evento ng-change do campo item
           Parâmetros:  */
        self.onChangeItem = function() {

            self.model.reference = {'cod-refer': ""};

            // Verifica se o item é controlado por referência
            if (self.model.item != undefined) {
                var parameters = {
                    itCodigo: self.model.item
                }
    
                fchmcs0002Factory.tipoConEstItem(parameters, function(result){
                    
                    if (result.tipoConEst == 4) {
                        self.model.itemHasReference = true;
                        self.serviceItemReferenceZoom.getReference({'init': {'property': 'it-codigo',
                                                                             'value': self.model.item,
                                                                             'type': 'integer'}});
                    } else {
                        self.model.itemHasReference = false;
                    }
                });
            }

            if (!self.model.item) {
                self.model.item = undefined;
            }
        }

        self.onChangeReference = function() {
            if (!self.model.reference) {
                self.model.reference = {'cod-refer': ""};
            }
        }

        self.openParameters = function () {
            var modalInstance = $modal.open({
                templateUrl: '/dts/mcs/html/comparativeRealStandard/comparativeRealStandard.parameters.html',
                controller: 'mcs.comparativeRealStandard.parameters.controller as controller',
                size: 'md',
                resolve: {
                    model: function () {
                        // passa o objeto com os dados da pesquisa avancada para o modal
                        return self.paramModel;
                    }
                }
            });
            
            // quando o usuario clicar em salvar:
            modalInstance.result.then(function (paramModel) {
                self.paramModel = paramModel;
            });
        }

        self.openAlerts = function() {
            var modalInstance = $modal.open({
                templateUrl: '/dts/mcs/html/modalErrors/modalErrors.html',
                controller: 'mcs.modalErrors.controller as controller',
                size: 'lg',
                resolve: {
                    model: function () {
                        
                        return self.alertsModel;
                    }
                }
            });
            
            // quando o usuario clicar em salvar:
            modalInstance.result.then(function (alertsModel) {
                self.alertsModel = alertsModel;
            });            
        }

        
        var init = function () {

            createTab = appViewService.startView(i18n('l-comp-real-pad-html', [], 'dts/mcs'), 'mcs.comparativeRealStandard.controller', comparativeRealStandardCtrl);
            previousView = appViewService.previousView;	

            var d = new Date();
            self.model.initialPeriod    = new Date(d.getFullYear(), d.getMonth() - 1, d.getDate());
            self.model.finalPeriod      = new Date();

            resetValuesComparative();

            if ($(window).width() > 1024) {
                self.labelMat = i18n('l-detail-material', [], 'dts/mcs');
                self.labelGgf = i18n('l-detail-ggf', [], 'dts/mcs');
                self.labelMob = i18n('l-detail-mob', [], 'dts/mcs');
            } else {
                self.labelMat = i18n('l-material', [], 'dts/mcc');
                self.labelGgf = i18n('l-ggf', [], 'dts/mcs');
                self.labelMob = i18n('l-mob', [], 'dts/mcs');
            }

            fchmcs0002Factory.currencies(function(result){
                if (result && result[0]) {
                    self.paramModel.currencies = [];
                    angular.forEach(result, function (moeda) {
                        if (moeda.tipo === 1){
                            self.paramModel.currencies.push({
                                value: moeda.valor,
                                label: moeda.descricao
                            })
                        } else {
                            self.paramModel.managerialCurrencies.push({
                                value: moeda.valor,
                                label: moeda.descricao
                            })
                        }

                    })
                }
            });

            fchmcs0002Factory.especieGgf(function(result){
                if (result && result[0]) {
                    self.especiesGgf = result;
                }

                createGgfDetailHtml();
            });

 
            if (helperComparativeRealStandard && helperComparativeRealStandard.data && helperComparativeRealStandard.data.model) {
                self.model = helperComparativeRealStandard.data.model;
                self.paramModel = helperComparativeRealStandard.data.paramModel;                
                self.hasRecord = true;
            }

            if ($stateParams.site || $stateParams.date || $stateParams.item) {
                self.model.item = $stateParams.item;
                self.model.site = $stateParams.site;

                if ($stateParams.date != "") {
                    self.model.finalPeriod      = new Date(parseInt($stateParams.date));

                    var d = self.model.finalPeriod;
                    self.model.initialPeriod    = new Date(d.getFullYear(), d.getMonth(), 01);
                }

                if (self.model.site != "" && self.model.item != "" && self.model.finalPeriod != "") {
                    self.hasRecord = true;
                }
            }
            
            if(self.hasRecord) {
                self.refreshComparative();
                self.hasRecord = false;
            }
            

            setTimeout(function() {
                $('[data-toggle="popover"]').popover({
                    container: 'body'
                });
            }, 100);
        }

        var createGgfDetailHtml = function() {
            var spanStart = '<span class="col-xs-12" style="margin-bottom: 10px;">';
            var spanEnd = '</span>';
            var boldStart = '<b>';
            var boldEnd = '</b>';

            self.comparative.ggfDetailHtml = "<div class='row'>";

            angular.forEach(self.especiesGgf, function (especie) {
                const valor = $filter('number')(self.comparative.standardDetailGGF[especie.valor - 1], 4);

                self.comparative.ggfDetailHtml = self.comparative.ggfDetailHtml + 
                                                 spanStart + 
                                                 boldStart + 
                                                 especie.descricao + ': ' +
                                                 boldEnd + 
                                                 valor + 
                                                 spanEnd;
            });

            self.comparative.ggfDetailHtml = self.comparative.ggfDetailHtml + '<hr style="width: 100%;">';

            self.comparative.ggfDetailHtml = self.comparative.ggfDetailHtml + 
                                             spanStart + 
                                             boldStart + 
                                             i18n('l-preparacao', [], 'dts/mcs') + ': ' +
                                             boldEnd + 
                                             $filter('number')(self.comparative.standardDetailPrepar, 4) + 
                                             spanEnd;

            self.comparative.ggfDetailHtml = self.comparative.ggfDetailHtml + 
                                            spanStart + 
                                            boldStart + 
                                            i18n('l-opext', [], 'dts/mcs') + ': ' +
                                            boldEnd + 
                                            $filter('number')(self.comparative.standardDetailOpExt, 4) +
                                            spanEnd;
            
            self.comparative.ggfDetailHtml = self.comparative.ggfDetailHtml + "</div>"
        }

        self.openDetail = function(type) {

            var gridOptions = createGridOptions(type);

            var gridData = getGridData(type);
            
            var modalTitle = createModalTitle(type);

            var model = {
                type: type,
                moeda: self.paramModel.selectedCurrency,
                tipoMedio: self.paramModel.selectedPriceType,
                title: modalTitle,
                gridData: gridData,
                gridOptions: gridOptions
            }

            var modalInstance = $modal.open({
                templateUrl: '/dts/mcs/html/comparativeRealStandard/comparativeRealStandard.detail.html',
                controller: 'mcs.comparativeRealStandard.detail.controller as controllerDetail',
                size: 'lg',
                resolve: {
                    model: function () {
                        // passa o objeto com os dados da pesquisa avancada para o modal
                        return model;
                    }
                }
            });
        };

        var createModalTitle = function(type) {

            var titleQty = " - " + i18n('l-quantity-produced', [], 'dts/mcp') +
                           ": " + $filter('number')(self.comparative.produced, 2) +
                           " - " + i18n('l-refugo', [], 'dts/mcs') +
                           ": " + $filter('number')(self.comparative.scrap, 2);

            var titleMaterial = i18n('l-material-detail', [], 'dts/mcs') + titleQty;

            var titleGgf = i18n('l-ggf-detail-2', [], 'dts/mcs') + titleQty;
            
            var titleMob = i18n('l-mob-detail', [], 'dts/mcs') + titleQty;
            
            var titleOrder = i18n('l-production-orders-detail', [], 'dts/mcs') + titleQty;

            var modalTitleList = [titleMaterial, titleGgf, titleMob, titleOrder];

            return modalTitleList[type];
        };

        var getGridData = function(type) {
            
            if (type == 0) { // MAT
                var gridData = self.comparative.realMaterialDetail;
            } else if (type == 1) { // GGF
                var gridData = self.comparative.realGgfDetail;
            } else if (type == 2) { // MOB
                var gridData = self.comparative.realMobDetail;
            } else if (type == 3) { // Ordem
                var gridData = self.comparative.dsOrder;
            }

            return gridData;
        }

        var createGridOptions = function(type) {
            if (type == 0) { // MAT
                var gridOptions = {
                    reorderable: true,
                    resizable: true,
                    columns: [
                        { field: 'itCodigo', title: i18n('l-item', [], 'dts/mcs'), width: 170 },
                        { field: 'qtdeReal', title: i18n('l-real-quantity', [], 'dts/mcs'), format: "{0:n4}", attributes: {style: "text-align: right;width: 160px;"}, width: 160 },
                        { field: 'qtdePadrao', title: i18n('l-standard-quantity', [], 'dts/mcs'), format: "{0:n4}", attributes: {style: "text-align: right; width: 160px;"}, width: 160 },
                        { field: 'variacaoQtde', title: "% " + i18n('l-variation', [], 'dts/mcs'), format: "{0:n2}", attributes: {style: "text-align: right; width: 100px;"}, width: 100 },
                        { field: 'valorReal', title: i18n('l-real-value', [], 'dts/mcs'), format: "{0:n4}", attributes: {style: "text-align: right; width: 120px;"}, width: 120 },
                        { field: 'valorPadrao', title: i18n('l-standard-value', [], 'dts/mcs'), format: "{0:n4}", attributes: {style: "text-align: right; width: 120px;"}, width: 120 },
                        { field: 'variacaoValor', title: "% " + i18n('l-variation', [], 'dts/mcs'), format: "{0:n2}", attributes: {style: "text-align: right; width: 100px;"}, width: 100 },
                        { field: 'codRefer', title: i18n('l-reference', [], 'dts/mcs'), width: 120 },
                        { field: 'descItem', title: i18n('l-description', [], 'dts/mcs'), width: 200 },
                        { field: 'un', title: 'Un', width: 40 }
                    ]
                };
            } else if (type == 1) { // GGF
                var gridOptions = {
                    reorderable: true,
                    resizable: true,
                    columns: [
                        { field: 'ccCodigo', title: i18n('l-cc-codigo', [], 'dts/mcs'), width: 170 },
                        { field: 'descricao', title: i18n('l-description', [], 'dts/mcs'), width: 160 },
                        { field: 'tempoReal', title: i18n('l-time-real', [], 'dts/mcs'), format: "{0:n4}", attributes: {style: "text-align: right; width: 140px;"}, width: 140 },
                        { field: 'tempoPadrao', title: i18n('l-standard-time', [], 'dts/mcs'), format: "{0:n4}", attributes: {style: "text-align: right; width: 140px;"}, width: 140 },
                        { field: 'variacaoTempo', title: "% " + i18n('l-variation', [], 'dts/mcs'), format: "{0:n2}", attributes: {style: "text-align: right; width: 100px;"}, width: 100 },
                        { field: 'valorReal', title: i18n('l-real-value', [], 'dts/mcs'), format: "{0:n4}", attributes: {style: "text-align: right; width: 140px;"}, width: 140 },
                        { field: 'valorPadrao', title: i18n('l-standard-value', [], 'dts/mcs'), format: "{0:n4}", attributes: {style: "text-align: right; width: 140px;"}, width: 140 },
                        { field: 'variacaoValor', title: "% " + i18n('l-variation', [], 'dts/mcs'), format: "{0:n2}", attributes: {style: "text-align: right; width: 100px;"}, width: 100 },
                    ]
                };
            } else if (type == 2) { // MOB
                var gridOptions = {
                    reorderable: true,
                    resizable: true,
                    columns: [
                        { field: 'cdMobDir', title: i18n('l-mob-codigo', [], 'dts/mcs'), width: 120 },
                        { field: 'descricao', title: i18n('l-description', [], 'dts/mcs'), width: 160 },
                        { field: 'tempoReal', title: i18n('l-time-real', [], 'dts/mcs'), format: "{0:n4}", attributes: {style: "text-align: right; width: 140px;"}, width: 140 },
                        { field: 'tempoPadrao', title: i18n('l-standard-time', [], 'dts/mcs'), format: "{0:n4}", attributes: {style: "text-align: right; width: 140px;"}, width: 140 },
                        { field: 'variacaoTempo', title: "% " + i18n('l-variation', [], 'dts/mcs'), format: "{0:n2}", attributes: {style: "text-align: right; width: 100px;"}, width: 100 },
                        { field: 'valorReal', title: i18n('l-real-value', [], 'dts/mcs'), format: "{0:n4}", attributes: {style: "text-align: right; width: 140px;"}, width: 140 },
                        { field: 'valorPadrao', title: i18n('l-standard-value', [], 'dts/mcs'), format: "{0:n4}", attributes: {style: "text-align: right; width: 140px;"}, width: 140 },
                        { field: 'variacaoValor', title: "% " + i18n('l-variation', [], 'dts/mcs'), format: "{0:n2}", attributes: {style: "text-align: right; width: 100px;"}, width: 100 },
                    ]
                };
            } else if (type == 3) { // Ordem
                var gridOptions = {
                    reorderable: true,
                    columns: [
                        { field: 'nrOrdProd', title: i18n('l-production-order', [], 'dts/mcs'), format: "{0:n0}", width: 170 },
                        { field: 'qtProduzida', title: i18n('l-prodction-quantity', [], 'dts/mcs'), format: "{0:n4}", attributes: {style: "text-align: right; width: 160px;"}, width: 160 },
                        { field: 'qtRefugada', title: i18n('l-scrap-quantity', [], 'dts/mcs'), format: "{0:n4}", attributes: {style: "text-align: right; width: 160px;"}, width: 160 },
                        { field: 'estado', title: i18n('l-state', [], 'dts/mcs'), attributes: {style: "text-align: center; width: 140px;"}, width: 140 },
                        { field: 'nrPedido', title: i18n('l-order', [], 'dts/mcs'), width: 140 },
                        { field: 'nomeAbrev', title: i18n('l-customer', [], 'dts/mcs'), width: 140 },
                        { field: 'narrativa', title: i18n('l-narrative', [], 'dts/mcs'), width: 800, attributes: {style: "white-space: nowrap;"} }
                    ]
                };
            }

            return gridOptions;
        }

        $scope.$on('$destroy', function () {
            helperComparativeRealStandard.data = {
                model: self.model,
                paramModel: self.paramModel
            };

            $(".popover").remove();

            self = undefined;
        });

        init();
    }

    $(document).on('click', function (e) {
        $('[data-toggle="popover"]').each(function () {
            //the 'is' for buttons that trigger popups
            //the 'has' for icons within a button that triggers a popup
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {                
                (($(this).popover('hide').data('bs.popover')||{}).inState||{}).click = false  // fix for BS 3.3.6
            }
        });
    });

    // SERVICE para manter parametros do Comparativo Real x Padrão
    index.register.service('helperComparativeRealStandard', function() {
        return {
            data: {}
        };
    });

    index.register.controller('mcs.comparativeRealStandard.controller', comparativeRealStandardCtrl);

});