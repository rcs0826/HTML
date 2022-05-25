define(['index',
    	  'filter-i18n'], function(index) {

    // *********************************************************************************
    // *** Controller Detalhe
    // *********************************************************************************
    actlistController.$inject = [
        '$scope',
        '$rootScope',
        '$filter',
        'i18nFilter',
        'fchmcs.fchmcs0001.Factory',
        'totvs.app-main-view.Service',
        '$stateParams',
        '$location',
        'totvs.app-notification.Service',
        'mcs.actlist.advancedsearch.service',
        'helperActList'];


    function actlistController ($scope,
                                $rootScope,
                                $filter,
                                i18n,
                                fchmcs0001Factory,
                                appViewService,
                                $stateParams,
                                $location,
                                notification,
                                modalAdvancedSearch,
                                helperActList) {

        var self = this;

        self.selectItCodigo = "";
        self.enabledButtons = false;
        self.closingType = 2;

        self.model = {"itemCodeRange": {
            "start":"",
            "end":"ZZZZZZZZZZZZZZZZ"
        }};

        self.periodType = 1;

        self.init = function () {

            createTab = appViewService.startView('Lista de ACTs', 'mcs.actlist.controller', actlistController);
            previousView = appViewService.previousView;

            self.acts = [];

            self.actTypes = [];

            self.actTypeSelected = "";

            self.siteCode = "";
            self.dtTrans = (new Date()).getTime();

            self.gridOptions = {
                reorderable: true,
                columns: [
                    { field: 'it-codigo', title: i18n('l-item', [], 'dts/mcs'), width: 170 },
                    { field: 'cod-estabel', title: i18n('l-site', [], 'dts/mcs'), width: 140 },
                    { field: 'nro-docto', title: i18n('l-type', [], 'dts/mcs'), width: 50 },
                    { field: 'quantidade', title: i18n('l-quantity', [], 'dts/mcs'), width: 100, format: "{0:n2}", attributes: {style: "text-align: right;"} },
                    { field: 'valor-mat-m', title: i18n('l-material', [], 'dts/mcs'), width: 125, format: "{0:n2}", attributes: {style: "text-align: right;"} },
                    { field: 'valor-ggf-m', title: i18n('l-ggf', [], 'dts/mcs'), width: 125, format: "{0:n2}", attributes: {style: "text-align: right;"} },
                    { field: 'valor-mob-m', title: i18n('l-mob-label', [], 'dts/mcs'), width: 125, format: "{0:n2}", attributes: {style: "text-align: right;"} },
                    { field: 'valor-total-m', title: i18n('l-total', [], 'dts/mcs'), width: 125, format: "{0:n2}", attributes: {style: "text-align: right;"} },
                    { field: 'val-unit-tot-atu', title: i18n('l-val-total-medio', [], 'dts/mcs'), width: 140, format: "{0:n4}", attributes: {style: "text-align: right;"} },
                    { field: 'val-unit-tot-ant', title: i18n('l-val-total-medio-ant', [], 'dts/mcs'), width: 150, format: "{0:n4}", attributes: {style: "text-align: right;"} },
                    { field: 'val-unit-mat-atu', title: i18n('l-val-mat-medio', [], 'dts/mcs'), width: 140, format: "{0:n4}", attributes: {style: "text-align: right;"} },
                    { field: 'val-unit-ggf-atu', title: i18n('l-val-ggf-medio', [], 'dts/mcs'), width: 140, format: "{0:n4}", attributes: {style: "text-align: right;"} },
                    { field: 'val-unit-mob-atu', title: i18n('l-val-mob-medio', [], 'dts/mcs'), width: 140, format: "{0:n4}", attributes: {style: "text-align: right;"} },
                    { field: 'val-unit-mat-ant', title: i18n('l-val-mat-medio-ant', [], 'dts/mcs'), width: 170, format: "{0:n4}", attributes: {style: "text-align: right;"} },
                    { field: 'val-unit-ggf-ant', title: i18n('l-val-ggf-medio-ant', [], 'dts/mcs'), width: 170, format: "{0:n4}", attributes: {style: "text-align: right;"} },
                    { field: 'val-unit-mob-ant', title: i18n('l-val-mob-medio-ant', [], 'dts/mcs'), width: 170, format: "{0:n4}", attributes: {style: "text-align: right;"} }
                ],
                change: function(e) {
                    var selectedRows = this.select();

                    for (var i = 0; i < selectedRows.length; i++) {
                        var dataItem = this.dataItem(selectedRows[i]);
                        self.selectItCodigo = dataItem["it-codigo"];

                        self.selectedSiteCode = dataItem["cod-estabel"];

                        self.enabledButtons = true;
                        $scope.$apply();

                    };
                },
                selectable: true
            };

            if ($stateParams && $stateParams.actType && $stateParams.site && $stateParams.date && $stateParams.periodType) {
                self.actTypeSelected = $stateParams.actType;
                self.siteCode = $stateParams.site;
                self.dtTrans = parseInt($stateParams.date);
                self.periodType = $stateParams.periodType;
            };

            if (helperActList && helperActList.data && helperActList.data.siteCode) {
                self.siteCode = helperActList.data.siteCode;
                self.dtTrans = helperActList.data.dtTrans;
                self.actTypeSelected = helperActList.data.actType;
            };

            fchmcs0001Factory.costClosingType(function(result) {
                self.closingType = result.closingType;

                self.removeAllDisclaimers();

                self.setInitialDisclaimers();

                if (result && result.closingType && result.closingType == 1) {
                    fchmcs0001Factory.getCostClosingInfo("", function(result) {

                        if (result && result[0]) {
                            self.dtTrans = result[0].dtIniPeriod;

                            if ($stateParams && $stateParams.actType && $stateParams.site && $stateParams.date) {
                                self.actTypeSelected = $stateParams.actType;
                                self.siteCode = $stateParams.site;
                                self.dtTrans = parseInt($stateParams.date);
                            };

                            if (helperActList && helperActList.data && helperActList.data.siteCode) {
                                self.siteCode = helperActList.data.siteCode;
                                self.dtTrans = helperActList.data.dtTrans;
                                self.actTypeSelected = helperActList.data.actType;
                            };

                            self.getActTypesCb();
                        }
                    }, {});
                } else {
                    self.myGrid.hideColumn(1);
                    self.getActTypesCb();
                }
            });
        }

        self.getActTypesCb = function() {
            self.getActTypes(function() {
                var parameters = {site: self.siteCode,
                                  dt_trans: self.dtTrans,
                                  c_Nro_docto: self.actTypeSelected,
                                  it_codigo_ini: self.model.itemCodeRange.start || "",
                                  it_codigo_fim: self.model.itemCodeRange.end || "",
                                  periodType: self.periodType
                                };

                self.getActs(parameters);
            });
        }

        self.exportCSV = function() {
            var parameters = {site: self.selectedSiteCode,
                              item: self.selectItCodigo,
                              periodType: self.periodType
                            };

            fchmcs0001Factory.ACT_LIST_CSV(parameters, function(result){

                if (result && result.csv != "") {
                    var ie = navigator.userAgent.match(/MSIE\s([\d.]+)/),
                        ie11 = navigator.userAgent.match(/Trident\/7.0/) && navigator.userAgent.match(/rv:11/),
                        ieEDGE = navigator.userAgent.match(/Edge/g),
                        ieVer=(ie ? ie[1] : (ie11 ? 11 : (ieEDGE ? 12 : -1)));

                    if (ie && ieVer<10) {
                        console.log("No blobs on IE ver<10");
                        return;
                    }

                    var textFileAsBlob = new Blob([result.csv], {type: 'text/plain'});
                    var fileName = i18n('l-statement', [], 'dts/mcs') + " - " + self.selectItCodigo + '.csv';

                    if (ieVer>-1) {
                        window.navigator.msSaveBlob(textFileAsBlob, fileName);
                    } else {
                        var a         = document.createElement('a');
                        a.href        = 'data:attachment/csv,' +  encodeURIComponent(result.csv);
                        a.target      = '_blank';
                        a.download    = fileName;

                        document.body.appendChild(a);
                        a.click();
                    }
                } else {
                    notification.notify({
                    type: 'info',
                    title: 'Não há movimentações',
                    text: 'Não tem!'
                });
                }

            });
        };

        self.onActTypeChange = function () {

            setTimeout(function() {
                if (self.actTypeSelected) {

                    var parameters = {site: self.siteCode,
                                      dt_trans: self.dtTrans,
                                      c_Nro_docto: self.actTypeSelected,
                                      it_codigo_ini: self.model.itemCodeRange.start || "",
                                      it_codigo_fim: self.model.itemCodeRange.end || "",
                                      periodType: self.periodType
                                    };

                    self.getActs(parameters);

                } else {
                    self.acts = [];
                    self.actTypeSelected = undefined;
                }

                $scope.$apply();
            }, 100);
        }

        self.openAdvancedSearch = function () {
            modalAdvancedSearch.open({
                    siteCode: self.siteCode,
                    dtTrans: self.dtTrans,
                    itemCodeRange: self.model.itemCodeRange,
                    closingType: self.closingType

            }).then(function (result) {
                self.siteCode = result.parametros.siteCode;
                self.dtTrans = result.parametros.dtTrans;
                self.model.itemCodeRange = result.parametros.itemCodeRange;

                self.disclaimers = result.disclaimers;

                var parameters = {site: self.siteCode,
                                  dt_trans: self.dtTrans,
                                  c_Nro_docto: self.actTypeSelected,
                                  it_codigo_ini: self.model.itemCodeRange.start || "",
                                  it_codigo_fim: self.model.itemCodeRange.end || "",
                                  periodType: self.periodType
                                };

                self.getActs(parameters);
            });
        }

        self.setInitialDisclaimers = function () {

            self.disclaimers.push({
                property: 'date',
                value: self.dtTrans,
                title: $rootScope.i18n('l-transaction-date', [], 'dts/mcs') + ': ' + (new Date(self.dtTrans)).toLocaleDateString('pt-br'),
                fixed: true
            });

            self.disclaimers.push({
                property: 'site',
                value: self.siteCode,
                title: $rootScope.i18n('l-site', [], 'dts/mcs') + ': ' + self.siteCode,
                fixed: true
            });

            if (helperActList && helperActList.data && helperActList.data.itemCodeRange) {
                self.model.itemCodeRange = helperActList.data.itemCodeRange;

                if ((self.model.itemCodeRange.start != "" && self.model.itemCodeRange.start != undefined) || (self.model.itemCodeRange.end != "ZZZZZZZZZZZZZZZZ")) {
                    self.disclaimers.push({
                        property: 'itemCodeRange',
                        value: self.model.itemCodeRange,
                        title: $rootScope.i18n('l-item', [], 'dts/mcs') + ': ' + (self.model.itemCodeRange.start || "") + ' ' +
                            $rootScope.i18n('l-to', [], 'dts/mcs') + ' ' + (self.model.itemCodeRange.end || ""),
                        fixed: false
                    });
                }
            }
        }

        self.removeAllDisclaimers = function () {
            self.disclaimers = [];
        }

        self.removeDisclaimer = function (disclaimer) {
            var index = self.disclaimers.indexOf(disclaimer);

            if (index != -1) {
                switch (disclaimer.property) {
                    case 'itemCodeRange':
                        self.model.itemCodeRange = {
                            "start":"",
                            "end":"ZZZZZZZZZZZZZZZZ"
                        };

                        break;
                }

                self.disclaimers.splice(index, 1);

                var parameters = {site: self.siteCode,
                                  dt_trans: self.dtTrans,
                                  c_Nro_docto: self.actTypeSelected,
                                  it_codigo_ini: self.model.itemCodeRange.start || "",
                                  it_codigo_fim: self.model.itemCodeRange.end || "",
                                  periodType: self.periodType
                                };

                self.getActs(parameters);
            }
        }

        self.getActs = function (parameters) {

            fchmcs0001Factory.ACT_Detail(parameters, function(result) {

                if (result && result[0]) {
                    self.acts = result;
                } else {
                    self.acts = [];
                }
            });
        }

        self.exportListCsv = function() {

            var parameters = {site: self.siteCode,
                              dt_trans: self.dtTrans,
                              c_Nro_docto: self.actTypeSelected,
                              it_codigo_ini: self.model.itemCodeRange.start || "",
                              it_codigo_fim: self.model.itemCodeRange.end || ""};

            fchmcs0001Factory.actsCsv(parameters, function(result){
                if (result && result.csv != "") {
                    var ie = navigator.userAgent.match(/MSIE\s([\d.]+)/),
                        ie11 = navigator.userAgent.match(/Trident\/7.0/) && navigator.userAgent.match(/rv:11/),
                        ieEDGE = navigator.userAgent.match(/Edge/g),
                        ieVer=(ie ? ie[1] : (ie11 ? 11 : (ieEDGE ? 12 : -1)));

                    if (ie && ieVer<10) {
                        console.log("No blobs on IE ver<10");
                        return;
                    }

                    var textFileAsBlob = new Blob([result.csv], {type: 'text/plain'});
                    var fileName = 'Export.csv';

                    if (ieVer>-1) {
                        window.navigator.msSaveBlob(textFileAsBlob, fileName);
                    } else {
                        var a         = document.createElement('a');
                        a.href        = 'data:attachment/csv,' +  encodeURIComponent(result.csv);
                        a.target      = '_blank';
                        a.download    = fileName;

                        document.body.appendChild(a);
                        a.click();
                    }
                }
            });
        }

        self.getActTypes = function (callback) {
            fchmcs0001Factory.ACT_list({}, function(result) {
                if (result && result[0]) {
                    angular.forEach(result, function(value) {
                        self.actTypes.push({
                            value: value['ind-tip-act'],
                            label: value['ind-tip-act'] + ' - ' + value['Descricao']
                        });
                    });

                    self.actTypes.sort(function(a, b) {
                        return parseFloat(a.value) - parseFloat(b.value);
                    });

                    if ($stateParams && $stateParams.actType) {
                        self.actTypeSelected = $stateParams.actType;
                    }

                    if (helperActList && helperActList.data && helperActList.data.actType) {
                        self.actTypeSelected = helperActList.data.actType;
                    }

                    callback();
                }
            });
        }

        $scope.$on('$destroy', function () {
            helperActList.data = {
                siteCode: self.siteCode,
                dtTrans: self.dtTrans,
                actType: self.actTypeSelected,
                itemCodeRange: self.model.itemCodeRange
            };

            self = undefined;
        });

        self.init();
    }

    // SERVICE PESQUISA AVANCADA
    modalAdvancedSearch.$inject = ['$modal'];

    function modalAdvancedSearch($modal) {
        this.open = function (params) {

            var instance = $modal.open({

                templateUrl: '/dts/mcs/html/actlist/actlist.advancedsearch.html',
                controller: 'mcs.actlist.advancedsearch.controller as controller',
                backdrop: 'static',
                keyboard: false,
                size: 'md',
                resolve: {
                    parameters: function () {
                        return params;
                    }
                }
            });

            return instance.result;
        }
    }

    // SERVICE para manter parametros
    index.register.service('helperActList', function() {
        return {
            data: {}
        };
    });

    index.register.controller('mcs.actlist.controller', actlistController);
    index.register.service('mcs.actlist.advancedsearch.service', modalAdvancedSearch);
});