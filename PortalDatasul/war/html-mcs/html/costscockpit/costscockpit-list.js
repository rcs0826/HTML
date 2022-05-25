define(['index',
        '/dts/mab/js/zoom/empresa.js'], function(index) {
    
    index.register.controller('mcs.costscockpit.ListCtrl', costscockpitListCtrl);
    
    /**
     * Controller List
     * 
     */
    costscockpitListCtrl.$inject = [
        '$rootScope',
        '$scope',
        '$modal',
        '$filter',
        'totvs.app-main-view.Service',
        'fchmcs.fchmcs0001.Factory',
        'TOTVSEvent',
        '$location',
        'i18nFilter',
        '$window',
        'mcs.costscockpit.chartparameters.service',
        'helperCostsCockpit',
        'helperActList',
        'mab.empresa.zoom',
        'mpd.estabelecSE.zoom',
        'fchmcs.fchmcs0002.Factory'
    ];
    
    function costscockpitListCtrl($rootScope,$scope,$modal,$filter,appViewService,fchmcs0001Factory,TOTVSEvent,$location,i18n,$window,modalChartParametersService,helperCostsCockpit,helperActList,serviceZoomEmpresa,serviceZoomEstabelecimentoSE, fchmcs0002Factory) {
        
        var controller = this;

        controller.records = [];
        controller.recordsCount = 0;
        controller.showBadge = false;
        controller.hasSelectedProgram = false;
        controller.companyAgroup = false;
        controller.filter = {};
        controller.serviceZoomEstabelecimentoSE = serviceZoomEstabelecimentoSE;

        controller.alreadyCalcItens = 0;
        controller.totalItens = 0;

        controller.selectedNumber = 0;
        controller.gaugeScale = {
            min: 0,
            max: 100,
            startAngle: 0,
            endAngle: 180
        };
        
        controller.defaultHeaders = {noCount: true,
                                     noCountRequest: true,
                                     noErrorMessage: false};
        
        controller.pieChartData = [];

        controller.actTypes = [];

        var procedimento = "html.costscockpit";
        
        controller.indexedGroups = [];
        
        controller.loadData = function(){
            
            fchmcs0001Factory.getRelatedProgram(procedimento, function(result) {
                if (result && result[0]) {
                    angular.forEach(result, function(value) {
                        controller.programs.push({
                            "code": value.nom_prog_ext,
                            "proc": value.cod_proced,
                            "name": value.nom_prog_menu_verbal,
                            "seq": value.num_seq,
                            "type": value.idi_interfac,
                            "group": controller.getGroup(4)
                        });
                    });
                }
            }, controller.defaultHeaders);

            fchmcs0001Factory.costClosingType(function(result) { 
                if (result) {

                    controller.companyAgroup = result.companyAgroup;

                    if (!controller.companyAgroup) {                        
                        controller.companyCode = undefined;                        
                    } else {
                        controller.companyCode = "";
                    }


                    if (result.closingType) {

                        controller.costclosinginfo = {closingType: result.closingType};

                        if ((result.closingType == 2 && controller.siteCode != undefined && controller.siteCode != "") || (result.closingType == 1)) {
                            fchmcs0001Factory.getCostClosingInfo(controller.siteCode || "", function(result) {
                                if (result && result[0]) {
                                    controller.costclosinginfo = result[0];

                                    if (controller.costclosinginfo.dtIniPeriod && controller.costclosinginfo.dtEndPeriod) {
                                        controller.costclosinginfo.dtIniPeriodNum = controller.costclosinginfo.dtIniPeriod;
                                        controller.costclosinginfo.dtIniPeriod = (new Date(controller.costclosinginfo.dtIniPeriod)).toLocaleDateString('pt-br', {timeZone: 'UTC'});
                                        controller.costclosinginfo.dtEndPeriodNum = controller.costclosinginfo.dtEndPeriod;
                                        controller.costclosinginfo.dtEndPeriod = (new Date(controller.costclosinginfo.dtEndPeriod)).toLocaleDateString('pt-br', {timeZone: 'UTC'});

                                        controller.setInitialDate();
                
                                        if (helperCostsCockpit && helperCostsCockpit.data && helperCostsCockpit.data.dtTrans) {
                                            controller.dtTrans = helperCostsCockpit.data.dtTrans;
                                            controller.series = helperCostsCockpit.data.series;
                                            controller.pieChartData = helperCostsCockpit.data.pieChartData;
                                            
                                        } else {
                                            controller.updateActChart(controller.siteCode || "");
                                        }
                                    }
                                    
                                    if (controller.costclosinginfo.closingType == 1) {
                                        controller.siteCodeDisabled = true;
                                    }
                                    //Carrega as ocorrencias apenas quando está com o médio fechado
                                    if (controller.costclosinginfo.calculatedAverage) {
                                        if (controller.costclosinginfo.closingType == 1){
                                            controller.getOccurrences("*");
                                        } else {
                                            controller.getOccurrences(controller.siteCode);
                                        }
                                    }
                                } else {
                                    controller.costclosinginfo = undefined;
                                }
                            }, {});
                        }
                    }

                }

            }, controller.defaultHeaders);

            controller.getGaugeData();
        }

        controller.updateActChart = function(siteCode) {
            
            var parameters = {
                site: siteCode,
                dt_trans: controller.dtTrans
            };

            fchmcs0001Factory.ACT_count(parameters, function(result) {
                
                controller.pieChartData = [];
                controller.series = [];

                if (result && result.ttAct && result.ttAct[0]) {
                    controller.series = [{data: []}];

                    angular.forEach(result.ttAct, function(value) {
                        controller.pieChartData.push({
                            category: controller.getCategory(value['ind-tip-act']),
                            color: controller.getColor(value['ind-tip-act']),
                            actType : parseInt(value['ind-tip-act']),
                            value: value.quantidade
                        });
                    });

                    for (var i = 0; i < controller.selectedActTypes.length; i++) {
                        for (var j = 0; j < controller.pieChartData.length; j++) {
                            if (controller.selectedActTypes[i].value == controller.pieChartData[j].actType) {
                                controller.series[0].data.push(controller.pieChartData[j]);
                            }
                        }
                    }
                    
                    controller.series[0].data.sort(function(a, b) {
                        return parseFloat(a.actType) - parseFloat(b.actType);
                    });

                    if (controller.series[0].data.length == 0) {
                        controller.series = [];
                    }
                }
            }, {noCount: true, noCountRequest: true, noErrorMessage: true});
        };

        controller.openChartParameters = function() {
            modalChartParametersService.open({
                    dtTrans: controller.dtTrans,
                    actTypes: controller.actTypes,
                    selectedActTypes: controller.selectedActTypes
            }).then(function (result) {
                controller.dtTrans = result.parametros.dtTrans;
                controller.selectedActTypes = result.parametros.selectedActTypes;

                controller.updateActChart(controller.siteCode);
            });
        }

        controller.openHelp = function() {
            $window.open('http://tdn.totvs.com/pages/viewpage.action?pageId=224396191', '_blank');
        }

        controller.getGaugeData = function() {
            fchmcs0001Factory.getTotalItensGauge({site: controller.siteCode || '?', periodType: controller.periodType}, function(result) {
                if (result && !result.$hasError) {
                    controller.alreadyCalcItens = result.already_calc;
                    controller.totalItens = result.total_itens;

                    controller.selectedNumber = Math.floor((controller.alreadyCalcItens / controller.totalItens) * 100, 0) || 0;
                }
            });
        }

        controller.updateGauge = function() {
            fchmcs0001Factory.getCalculatedItensGauge({site: controller.siteCode || '?', periodType: controller.periodType}, function(result) {
                if (result && !result.$hasError) {
                    controller.alreadyCalcItens = result.already_calc;
                    controller.costclosinginfo.calculatedAverage = result.calculatedAverage;

                    controller.selectedNumber = Math.floor((controller.alreadyCalcItens / controller.totalItens) * 100, 0) || 0;

                    if (controller.costclosinginfo.calculatedAverage) {
                        if (controller.costclosinginfo.closingType == 1){
                            controller.getOccurrences("*");
                        } else {
                            controller.getOccurrences(controller.siteCode);
                        }
                    }

                    controller.setInitialDate();
                    
                    controller.updateActChart(controller.siteCode);
                }
            }, controller.defaultHeaders);
        }


        controller.changeCompany = function() {
            
            if (!controller.companyAgroup) {                        
                controller.companyCode = undefined;                        
            } 

            controller.serviceZoomEstabelecimentoSE.getObjectFromValue(controller.siteCode, {'filter': {'ep-codigo': controller.companyCode}} );

            

        }

        controller.leaveSite = function() {
            if (controller.siteCode && controller.siteCode != undefined && controller.siteCode != "") {
                fchmcs0001Factory.getCostClosingInfo({site: controller.siteCode, periodType: controller.periodType}, function(result) {
                    if (result && result[0]) {
                        controller.costclosinginfo = result[0];
                        if (controller.costclosinginfo.closingType == 1) {
                            controller.siteCodeDisabled = true;
                        }

                        if (controller.costclosinginfo.dtIniPeriod && controller.costclosinginfo.dtEndPeriod) {
                            controller.costclosinginfo.dtIniPeriodNum = controller.costclosinginfo.dtIniPeriod;
                            controller.costclosinginfo.dtIniPeriod = (new Date(controller.costclosinginfo.dtIniPeriod)).toLocaleDateString('pt-br', {timeZone: 'UTC'});
                            controller.costclosinginfo.dtEndPeriodNum = controller.costclosinginfo.dtEndPeriod;
                            controller.costclosinginfo.dtEndPeriod = (new Date(controller.costclosinginfo.dtEndPeriod)).toLocaleDateString('pt-br', {timeZone: 'UTC'});

                            controller.setInitialDate();

                            controller.updateActChart(controller.siteCode);
                        }
                        
                        if (controller.costclosinginfo && controller.costclosinginfo.calculatedAverage) {
                            controller.totalItens = controller.alreadyCalcItens;
                            controller.selectedNumber = Math.floor((controller.alreadyCalcItens / controller.totalItens) * 100, 0) || 0;
                        }
                        //Carrega as ocorrencias apenas quando está com o médio fechado
                        if (controller.costclosinginfo.calculatedAverage) {
                            controller.getOccurrences(controller.siteCode);                        
                        }
                    } else {
                        controller.costclosinginfo = undefined;
                    }
                }, {});
            }

            controller.loadOccurrences();

            controller.getGaugeData();
        }
        
        controller.openProgress = function(program) {
            // 1 é o código de Interface: "GUI", no cadastro de programas bas_prog_dtsul
            if (program.type == 1)
                $rootScope.openProgramProgress(program.code, program.name);
            // 2 é o código de Interface: "WEB", no cadastro de programas bas_prog_dtsul
            else if (program.type == 2) {

                var programCode = "" + program.code;
                var paramValue;
                
                if (program.params) {
                    program.params.forEach ( function(parameter) {
                        
                        if (controller[parameter] == "siteCode") {
                            paramValue = (controller[parameter] || "*");
                        } else {
                            paramValue = (controller[parameter] || "");
                        }

                        programCode += '/' + paramValue;
                    });
                }

                $location.path(programCode);
            }                
        }

        controller.setSelectedProgram = function(program) {
            if (program)
                controller.selectedProgram = program;
        }

        controller.getGroup = function(groupCode) {
            switch (groupCode) {
                case 1:
                    return i18n('l-prefechamento', [], 'dts/mcs');
                case 2:
                    return i18n('l-fechamento', [], 'dts/mcs');
                case 3:
                    return i18n('l-posfechamento', [], 'dts/mcs');
                case 4:
                    return i18n('l-custom', [], 'dts/mcs');
                default:
                    return "";
            }
        }

        controller.getCategory = function(category) {
            var act;

            act = controller.actTypes.filter(function(act) {
                return act.value === category;
            });

            return act[0].label;
        }

        controller.getColor = function(category) {
            var act;

            act = controller.actTypes.filter(function(act) {
                return act.value === category;
            });

            return act[0].color;
        }

        controller.addProgram = function() {
            var model = {};

            var modalInstance = $modal.open({
                templateUrl: '/dts/mcs/html/costscockpit/costscockpit.add.program.html',
                controller: 'mcs.costscockpit.AddProgramCtrl as controller',
                size: 'md',
                resolve: {
                    model: function () {
                        // passa o objeto com os dados da pesquisa avançada para o modal
                        return model;
                    }
                }
            });
            
            // quando o usuario clicar em salvar:
            modalInstance.result.then(function () {
                controller.programs.push({
                    "code": model.program,
                    "name": model.name,
                    "proc": model.program,
                    "seq": model.seq,
                    "type": model.type,
                    "group": controller.getGroup(4)
                });
            });
        }

        controller.onClickChart = function(e) {

            var path = "dts/mcs/actlist/" + e.dataItem.actType + "/"
                                          + (controller.siteCode || "*") + "/"
                                          + controller.dtTrans;
            
            if (helperActList && helperActList.data && helperActList.data.siteCode) {
                helperActList.data.siteCode = (controller.siteCode || "*");
                helperActList.data.dtTrans = controller.dtTrans;
                helperActList.data.actType = e.dataItem.actType + "";
            }

            $location.path(path);
            $scope.$apply();
        }

        controller.removeProgram = function() {
            var message;
            var params;
            
            if (controller.indexOfObject(controller.defaultPrograms, controller.selectedProgram) > -1) {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: i18n('msg-program-cant-be-removed', [], 'dts/mcs'),
                    detail: i18n('msg-program-cant-be-removed-help', [], 'dts/mcs')
                });
            } else {
                params = {
                    "cod_proced": procedimento,
                    "num_seq": controller.selectedProgram.seq
                };
                
                fchmcs0001Factory.deleteRelatedProgram(params, function(result) {
                    if (result && !result.$hasError) {
                        controller.programs = controller.programs.filter(function(program) {
                            return program.code !== controller.selectedProgram.code;
                        });

                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'success',
                            title: i18n('msg-success-removing', [], 'dts/mcs'),
                            detail: ''
                        });
                    }
                });
            }
        }

        controller.indexOfObject = function (array, object) {
            for (var i = 0; i < array.length; i++) {
                if (array[i].code == object.code && array[i].name == object.name && array[i].group == object.group) {
                    return i;
                }
            }
            return -1;
        }

        controller.createProgramsList = function() {

            return [
                {seq: 1, type: '1', code: 'csp/cs0530.w', proc: 'cs0530', name: i18n('l-ordens-cri', [], 'dts/mcs'), group: controller.getGroup(1)},
                {seq: 2, type: '1', code: 'csp/cs0531.w', proc: 'cs0531', name: i18n('l-order-balance', [], 'dts/mcs'), group: controller.getGroup(1)},
                {seq: 3, type: '1', code: 'cep/ce0416.w', proc: 'ce0416', name: i18n('l-appropriate-hours', [], 'dts/mcs'), group: controller.getGroup(1)},
                {seq: 4, type: '1', code: 'csp/cs0305.w', proc: 'cs0305', name: i18n('l-close-manufacturing-orders', [], 'dts/mcs'), group: controller.getGroup(1)},
                {seq: 1, type: '1', code: 'cep/ce0401.w', proc: 'ce0401', name: i18n('l-average-price-calc', [], 'dts/mcs'), group: controller.getGroup(2)},
                {seq: 2, type: '1', code: 'cep/ce0420.w', proc: 'ce0420', name: i18n('l-average-price-outdate', [], 'dts/mcs'), group: controller.getGroup(2)},
                {seq: 3, type: '1', code: 'cep/ce0407.w', proc: 'ce0407', name: i18n('l-acc-summary', [], 'dts/mcs'), group: controller.getGroup(2)},
                {seq: 4, type: '1', code: 'cep/ce0412.w', proc: 'ce0412', name: i18n('l-posting', [], 'dts/mcs'), group: controller.getGroup(2)},
                {seq: 5, type: '1', code: 'cep/ce0409.w', proc: 'ce0409', name: i18n('l-period-closing', [], 'dts/mcs'), group: controller.getGroup(2)},
                {seq: 6, type: '1', code: 'cep/ce0413.w', proc: 'ce0413', name: i18n('l-period-reopening', [], 'dts/mcs'), group: controller.getGroup(2)},
                {seq: 1, type: '1', code: 'cep/ce0419.w', proc: 'ce0419', name: i18n('l-average-price-variation', [], 'dts/mcs'), group: controller.getGroup(3)},
                {seq: 2, type: '1', code: 'csp/cs0611.w', proc: 'cs0611', name: i18n('l-item-analysis', [], 'dts/mcs'), group: controller.getGroup(3)},
                {seq: 3, type: '1', code: 'csp/cs0501.w', proc: 'cs0501', name: i18n('l-comp-real-pad', [], 'dts/mcs'), group: controller.getGroup(3)},
                {seq: 4, type: '2', code: 'dts/mcs/comparativeRealStandard', proc: 'html.comparativeRealStandard', name: (i18n('l-item-production-real-standard', [], 'dts/mcs')), group: controller.getGroup(3), newProgram: {'font-weight': 'bold'}, params: ['siteCode', 'item', 'period']},
                {seq: 5, type: '2', code: 'dts/mcs/costssimulation', proc: 'html.costssimulation', name: (i18n('l-costssimulation', [], 'dts/mcs')), group: controller.getGroup(3)},
                {seq: 6, type: '1', code: 'ofp/of0791.w', proc: 'of0791', name: i18n('l-inventory-registry', [], 'dts/mcs'), group: controller.getGroup(3)},
                {seq: 7, type: '1', code: 'csp/cs0503.w', proc: 'cs0503', name: i18n('l-res-ord-serv', [], 'dts/mcs'), group: controller.getGroup(3)},
                {seq: 8, type: '1', code: 'cep/ce0402.w', proc: 'ce0402', name: i18n('l-stock-reason', [], 'dts/mcs'), group: controller.getGroup(3)},
                {seq: 9, type: '1', code: 'cep/ce0403.w', proc: 'ce0403', name: i18n('l-auxiliar-journal', [], 'dts/mcs'), group: controller.getGroup(3)},
                {seq: 10, type: '2', code: 'dts/mcs/realforecastedcost' , proc: 'html.realforecastedcost', name: (i18n('l-real-forecasted-cost', [], 'dts/mcs')), group: controller.getGroup(3), newProgram: {'font-weight': 'bold'}, params: ['siteCode', 'period'] },
                {seq: 11, type: '2', code: 'dts/mcs/ggfbycostcenter', proc: 'html.ggfbycostcenter', name: (i18n('l-ggf-by-cost-center', [], 'dts/mcs')), group: controller.getGroup(3), newProgram: {'font-weight': 'bold'}}];
        }

        controller.filterProgramGroups = function(program) {
            var programIsNew = controller.indexedGroups.indexOf(program.group) == -1;
            if (programIsNew) {
                controller.indexedGroups.push(program.group);
            }
            return programIsNew;
        }

        // this will reset the list of indexed programs each time the list is rendered again
        controller.programsToFilter = function() {
            controller.indexedGroups = [];
            return controller.programs;
        }
        
        controller.getActTypes = function (callback) {
            fchmcs0001Factory.ACT_list({}, function(result) {
                callback(result);
            });
        }

        controller.setInitialDate = function() {
            /*
            Valores defaults: se o médio está calculado traz a data de final do período (param-estoq ou estab-mat), se médio não está calculado traz a data de início do período.
            Para tipo de período diário, permitir informar qualquer data. Para tipo de período mensal, deixar informar somente as datas de início ou final do período.
            */

            controller.period =   controller.costclosinginfo.dtEndPeriodNum;

            if (controller.costclosinginfo.calculatedAverage) {
                controller.dtTrans = controller.costclosinginfo.dtEndPeriodNum;
            } else  {
                controller.dtTrans = controller.costclosinginfo.dtIniPeriodNum;
            }
        };
        
        controller.init = function (){

            createTab = appViewService.startView(i18n('l-cockpit', [], 'dts/mcs'), 'mcs.costscockpit.ListCtrl', costscockpitListCtrl);
            previousView = appViewService.previousView;
            
            controller.programs = controller.createProgramsList();
            controller.defaultPrograms = controller.createProgramsList();
            controller.periodType = 1;

            if (helperCostsCockpit && helperCostsCockpit.data && helperCostsCockpit.data.dtTrans) {
                controller.siteCode = helperCostsCockpit.data.siteCode;
                controller.dtTrans = helperCostsCockpit.data.dtTrans;
                controller.selectedActTypes = helperCostsCockpit.data.selectedActTypes;
                controller.actTypes = helperCostsCockpit.data.actTypes;
                controller.pieChartData = helperCostsCockpit.data.pieChartData;
            } else {
                controller.selectedActTypes = [];

                controller.getActTypes(function(result){
                    if (result && result[0]) {
                        angular.forEach(result, function(value) {
                            controller.actTypes.push({
                                value: value['ind-tip-act'],
                                label: value['ind-tip-act'] + ' - ' + value['Descricao'],
                                color: value['cor'],
                                show: value['valor-padrao']
                            });
                        });
                        
                        controller.actTypes.sort(function(a, b) {
                            return parseFloat(a.value) - parseFloat(b.value);
                        });
                        
                        controller.selectedActTypes = controller.actTypes.filter(function(actType){
                            return actType.show == true;
                        });
                    }
                });
            }

            fchmcs0002Factory.statusFuncaoFechGerencial(function(r){
                controller.funcAtiva = r.ativo;
            });

            controller.loadData();

            controller.loadOccurrences();
        }

        $scope.$on('$destroy', function () {
            helperCostsCockpit.data = {
                siteCode: controller.siteCode,
                dtTrans: controller.dtTrans,
                selectedActTypes: controller.selectedActTypes,
                actTypes: controller.actTypes,
                series: controller.series,
                pieChartData: controller.pieChartData
            };

            controller = undefined;
        });
	
	    controller.loadOccurrences = function() {
            
            controller.gridOptions = {
                reorderable: true,
                scrollable: false,
                columns: [
                    { field: 'typeDescription', title: i18n('l-type', [], 'dts/mcs'), width: 70 },
                    { field: 'amount', title: i18n('l-quantity', [], 'dts/mcs'), width: 70 },
                    { command: [
                            {
                                name: "Exportar",
                                click: function(e) {
                                    // prevent page scroll position change
                                    e.preventDefault();
                                    var tr = $(e.target).closest("tr"); // get the current table row (tr)
                                    // get the data bound to the current table row
                                    var data = this.dataItem(tr);
                                    controller.exportCSV(data.TYPE);
                                },
                            }
                        ], 
                        title: " ",
                        width: 40
                        
                    }
                ], selectable: false
            };
            

        }

        controller.getOccurrences = function (param) {

            fchmcs0001Factory.OCOR_count(param, function(retorno) {

                if (retorno && retorno[0]) {
                    controller.occurrences = retorno;
                } else {
                    controller.occurrences = [];
                }
            });
        }

        controller.exportCSV = function(ptype) {
            var parameters = {site: controller.siteCode || "*",
                              type: ptype};
            
            fchmcs0001Factory.OCOR_LIST_CSV(parameters, function(result){

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
                    var fileName = i18n('l-middle-calculation-occurrences', [], 'dts/mcs')  + '.csv';
        
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

        controller.clickPeriodType = function(){
            if(controller.siteCode !== undefined) controller.leaveSite();
        };
        
        controller.init();
    }    

    // SERVICE Parametros do Gráfico
    modalChartParametersService.$inject = ['$modal'];

    function modalChartParametersService($modal) {
        this.open = function (params) {

            var instance = $modal.open({

                templateUrl: '/dts/mcs/html/costscockpit/costscockpit.chartparameters.html',
                controller: 'mcs.costscockpit.chartparameters.controller as controller',
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
    
    // SERVICE para manter parametros do Cockpit
    index.register.service('helperCostsCockpit', function() {
        return {
            data: {}
        };
    });
    
    // SERVICE para manter parametros da lista de ACTs
    index.register.service('helperActList', function() {
        return {
            data: {}
        };
    });

    index.register.service('mcs.costscockpit.chartparameters.service', modalChartParametersService);
});