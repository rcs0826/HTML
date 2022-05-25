/* Documentação das bibliotecas utilizadas:
 * Angular Gantt: https://www.angular-gantt.com/
 * MomentJs: https://momentjs.com/
 * Menu de contexto: https://github.com/Templarian/ui.bootstrap.contextMenu
 * Popover: https://angular-ui.github.io/bootstrap/
 */

requirejs.config({
    paths: {
        'moment': '/dts/mdb/js/libs/3rdparty/moment/moment',
        'moment-range': '/dts/mdb/js/libs/3rdparty/moment-range/moment-range',
        'angular-gantt': '/dts/mdb/js/libs/3rdparty/angular-gantt/angular-gantt',
        'angular-moment': '/dts/mdb/js/libs/3rdparty/angular-moment/angular-moment',
        'angular-ui-tree': '/dts/mdb/js/libs/3rdparty/angular-gantt/angular-ui-tree.min',
        'ui.bootstrap.contextMenu': '/dts/mdb/js/libs/3rdparty/context-menu/contextMenu',
        'ui.bootstrap': '/dts/mdb/js/libs/3rdparty/ui-bootstrap/ui-bootstrap-tpls-2.5.0'
    },
    shim: {
        'moment':['angular'],
        'moment-range':['moment'],
        'angular-moment':['angular','moment'],
        'angular-ui-tree':['angular'],
        'ui.bootstrap.contextMenu':['angular'],
        'ui.bootstrap':['angular'],
        'angular-gantt':['ui.bootstrap', 'ui.bootstrap.contextMenu', 'angular','angular-moment']
    }
});

define(['index',
        'moment',
        'moment-range',
        'ng-load!angular-moment',
        'ng-load!angular-ui-tree',
        'ng-load!angular-gantt',
        'ng-load!ui.bootstrap.contextMenu',
        'ng-load!ui.bootstrap',
        'css!/dts/mdb/js/libs/3rdparty/angular-gantt/angular-gantt.min.css',
        'css!/dts/mdb/js/libs/3rdparty/angular-gantt/angular-gantt-plugins.min.css',
        'css!/dts/mdb/js/libs/3rdparty/angular-gantt/angular-ui-tree.min.css',
        'css!/dts/mdb/html/operationsgantt/task-popover.css',
        'css!/dts/mdb/html/operationsgantt/style.css'], function(index, moment, moment_range) {

    moment_range.extendMoment(moment);

    /**
     * Controller List
     */
    operationsGanttCtrl.$inject = [
        '$rootScope',
        '$scope',
        '$timeout',
        '$filter',
        '$location',
        'totvs.app-main-view.Service',
        'fchmdb.fchmdb0001.Factory',
        'fchmdb.fchmdb0002.Factory',
        'fchmdb.utils.Factory',
        'toaster',
        '$modal',
        '$window',
        '$stateParams',
        'i18nFilter'
    ];

    function operationsGanttCtrl($rootScope,
                                 $scope,
                                 $timeout,
                                 $filter,
                                 $location,
                                 appViewService,
                                 fchmdb0001Factory,
                                 fchmdb0002Factory,
                                 utils,
                                 toaster,
                                 $modal,
                                 $window,
                                 $stateParams,
                                 i18n) {
        var controller = this;

        controller.ganttWitdth = 150;
        controller.ganttSliderWidth = 3;
        controller.ganttSideWitdth = 150;

        controller.ganttData = [];
        controller.headers = ['day', 'week', 'month'];
        controller.header = ['day', 'hour'];
        controller.headersScales = {dayLetter: 'day'};
        controller.headerType = 'day';
        controller.selectedPage = 1;
        controller.selectedSubPage = 1;
        controller.gmList = [];
        controller.ttSubPagina = [];
        controller.pageCount = [];
        controller.subPageList = [];
        controller.listComboSimulation = [];
        controller.rowChanged = false;
        controller.ganttColumns = ['model.descricao'];
        controller.highlightedOperation = undefined;
        controller.operationsDelayed = undefined;        
        controller.scenarios = [];
        controller.listCombo = [];
        controller.selectedScenario = '';
        controller.selectedSimulation = '';                    

        controller.init = function() {
            createTab = appViewService.startView(i18n('l-operation-gantt'), 'mdb.operationsgantt.controller', controller);
            previousView = appViewService.previousView;

            controller.taskContextMenuOptions = [
                {
                    /* Verificar alertas */
                    text: i18n('l-verify-alerts', [], 'dts/mdb'),
                    click: function ($itemScope, $event, modelValue, text, $li) {
                        // modelValue é a operação
                        controller.listAlerts(modelValue);
                    }
                },{
                    /* Divisor */
                    html: controller.getDividerHtml()
                },{
                    /* Demonstrativo de Cálculo do Item */
                    text: i18n('l-item-calculation-statement', [], 'dts/mdb'),
                    click: function ($itemScope, $event, modelValue, text, $li) {
                        controller.operationsCalculationStatement(modelValue);
                    }
                },{
                    /* Divisor */
                    html: controller.getDividerHtml()
                },{
                    /* Realçar Rede */
                    text: i18n('l-net-highlight', [], 'dts/mdb'),
                    click: function ($itemScope, $event, modelValue, text, $li) {
                        controller.operationsHighlight(modelValue);
                    }
                },{
                    /* Realçar Atrasadas */
                    text: i18n('l-delayed-highlight', [], 'dts/mdb'),
                    click: function ($itemScope, $event, modelValue, text, $li) {
                        controller.operationsDelayedHighlight(modelValue);
                    }
                },{
                    /* Divisor */
                    html: controller.getDividerHtml()
                },{
                    /* Desalocar Operação */
                    text: i18n('l-deallocate-operation', [], 'dts/mdb'),
                    click: function ($itemScope, $event, modelValue, text, $li) {
                        controller.operationslDealLocate(modelValue);
                    }
                },{
                    /* Desfazer ajuste manual */
                    text: i18n('l-undo-manual-adjustment', [], 'dts/mdb'),
                    click: function ($itemScope, $event, modelValue, text, $li) {
                        controller.undoOperation(modelValue);
                    }
                }
            ];

            if(controller.highlightedOperation || controller.operationsDelayed){
                controller.addTaskContextMenuOptions();
            }


            var paramObj = JSON.parse($window.localStorage.getItem('operationsganttparamObj'));
            if (paramObj != null) {
                controller.paramModel.selectedPeriod = paramObj["selectedPeriod"];
                controller.paramModel.showOrderOperation = paramObj["showOrderOperation"];
                controller.paramModel.showWorkCentersWithInfiniteCapacity = paramObj["showWorkCentersWithInfiniteCapacity"];
                controller.paramModel.showWorkCentersWithoutOperation = paramObj["showWorkCentersWithoutOperation"];
            }

            var paramSlider = $window.localStorage.getItem('operationsganttsliderWidth');
            if (paramSlider != null) {
                controller.ganttSliderWidth = paramSlider;
                controller.sliderChange();
            }

            controller.listCombo = controller.listComboCenario();
        }

        controller.paramModel = {
            selectedPeriod: 1,
            periodLimit: 1,
            periodLimitMin: 1,
            periodLimitMax: 2,
            atualizaGmList: false,
            gmFilter: [],
            showWorkCentersWithInfiniteCapacity: false,
            showWorkCentersWithoutOperation: false,
            showOrderOperation: false
        };

        controller.ganttGmHeaders = {
            'model.descricao': i18n('l-description', [], 'dts/mdb')
        };

        controller.ganttGmContent = {
            'model.descricao': "<span>{{getValue()}}</span>"
        }

        controller.ganttTreeContent = '<span title="{{row.model.title}}">{{row.model.name}}</span>';

        controller.headersFormats = {
            day: 'DD/MM/YYYY',
            hour: 'HH',
            week: 'Sw/YYYY',
            month: 'MM/YYYY'
        };

        controller.taskPopOverOptions = {
            taskPopoverTemplate: "/dts/mdb/html/operationsgantt/task-popover.html",
            taskPopoverTitle: i18n('l-operation-detail', [], 'dts/mdb'),
            i18n: i18n,
            popoverAppendToBody: true
        };

        controller.showCenarHeader = true;

        controller.getDividerHtml = function() {
            return "<div class='context-menu-divider'></div>";
        }

        controller.openCenarHeader = function() {
            controller.showCenarHeader = !controller.showCenarHeader;
        }

        controller.changeHeaderType = function() {
            switch (parseInt(controller.paramModel.selectedPeriod)) {
                case 1:
                    controller.headerType = 'day';
                    if (controller.ganttWidth > 499){
                        controller.header = ['day', 'hour'];
                    }else{
                        controller.header = ['day'];
                    }
                    break;
                case 2:
                    controller.headerType = 'week';
                    if (controller.ganttWidth > 499){
                        controller.header = ['week', 'day'];
                    }else{
                        controller.header = ['week'];
                    }
                    break;
                case 3:
                    controller.headerType = 'month';
                    if (controller.ganttWidth > 499){
                        controller.header = ['month', 'week' ];
                    }else{
                        controller.header = ['month'];
                    }
                    controller.headersScales = {dayLetter: 'day'};
                    break;
                default:
                    controller.headerType = 'day';
                    controller.header = ['day', 'hour'];
                    break;
            }
        }

        controller.sliderChange = function () {

            switch (parseInt(controller.ganttSliderWidth)) {
                case 1:
                    controller.ganttWidth = 100;
                    break;
                case 2:
                    controller.ganttWidth = 250;
                    break;
                case 3:
                    controller.ganttWidth = 550;
                    break;
                case 4:
                    controller.ganttWidth = 1000;
                    break;
                case 5:
                    controller.ganttWidth = 2000;
                    break;
                default:
                    controller.ganttWidth = 550;
                    break;
            }

            $window.localStorage.setItem('operationsganttsliderWidth',controller.ganttSliderWidth);

            controller.changeHeaderType();
        }

        controller.ganttWidth = 500; // fixar para criar sempre scroll

        //Tooltip simples - Ao posicionar o ponteiro
        controller.customTooltip = "<small><b>OP:</b> {{task.model.ordemAlpha}} / <b>Oper.:</b> {{task.model.opCodigo}}</br>" +
                                   "{{task.model.from.format('DD/MM/YYYY HH:mm')}} - {{task.model.to.format('DD/MM/YYYY HH:mm')}}</small>";

        controller.allowRowSwitch = function(task, targetRow) {
            // Se o destino for um GM, não deixa mover a tarefa
            if (targetRow.model.children) {
                return false;
            }

            return true;
        }

        controller.registerApi = function(api) {

            controller.ganttApi = api;

            api.tasks.on.change($scope, function(task) {

                if (task.isMoving == undefined || task.isMoving) return;

                /* se a diferenca entre o DateTime inicial e o novo DateTime for menor que 5 min nao atualiza a operacao */
                if (Math.abs(moment.range(task.model.dtInitMove, task.model.from).diff()) < 300000) {
                    return;
                }else{
                    task.model.dtInitMove = moment(task.model.from._d).format();
                }

                if (controller.rowChanged == false) {
                    controller.updateOp(task);
                }

                controller.rowChanged = false;

            });

            api.tasks.on.rowChange($scope, function(task, oldRow) {
                controller.rowChanged = true;
                controller.updateOp(task);
            });

            api.tasks.on.beforeRowChange($scope, function(task, oldRow) {
                controller.taskBeforeObject = task.clone();
            });

            api.core.on.rendered($scope, function(api) {

                controller.ttSubPagina.forEach(function(subPage){
                    if (subPage["pagina"] == controller.selectedPage) {
                        if (subPage['sub-pagina'] == controller.selectedSubPage) {

                            api.scroll.toDate(subPage["data-inicio"]);
                        }
                    }
                });

                controller.ganttApi.columns.generate();

                if (controller.localizaOperacao) {
                    controller.scrollToTask();

                    controller.localizaOperacao = false;
                };

                controller.ganttLoading = false;
            });

            api.core.on.ready($scope, function() {

                api.side.on.resizeEnd($scope, function(width) {
                    controller.ganttSideWitdth = width;
                });

                // Largura da tree de GMs e CTs
                controller.ganttApi.side.setWidth(controller.ganttSideWitdth);
            });

        }
        // Fim das funções do Gantt
        controller.userScenario = "";
        controller.dateCenario = "";
        controller.stageScenario = "";

        //retorna a lista de cenários no padrão de combo-box do THF
        controller.listComboCenario = function() {
            var options = [];
            var scenarios = [];

            $timeout(function() {
                fchmdb0001Factory.scenarioList(function(result){

                    if (result && result[0]) {
                        scenarios = result;
                        //Carrego objeto no contexto do controller para não precisar ir no progress novamente.
                        controller.scenarios = scenarios;

                        for (var index = 0; index < scenarios.length; index++) {
                            var option = {};

                            option.label = scenarios[index]['cod-cenario'] + " - " + scenarios[index]['des-cenario'];
                            option.value = scenarios[index]['cod-cenario'];

                            options.push(option);
                        }
                    }

                    if ($stateParams.scenario != null && $stateParams.scenario != ''){
                        controller.selectedScenario = $stateParams.scenario;
                        controller.onChangeScenario();
                    }
                });
            }, 0);

            return options;
        }

        controller.onChangeSimulation = function() {

            controller.userScenario = "";
            controller.dateScenario = "";
            controller.stageScenario = "";
            controller.selectedPage = 1;
            controller.selectedSubPage = 1;

            controller.ganttData = [];
            controller.gmList = [];
            controller.ttSubPagina = [];
            controller.pageCount = [];
            controller.subPageList = [];
            controller.paramModel.gmFilter = [];

            controller.operationsHighlightClear();

            $timeout(function() {

                for (var index = 0; index < controller.scenarios.length; index++) {
                    if (controller.scenarios[index]['cod-cenario'] == controller.selectedScenario){

                        var objSim = controller.scenarios[index]['tt-lista-simulacao'];

                        for (var index2 = 0; index2 < objSim.length; index2++) {

                            if (objSim[index2]['idi-simulacao'] == controller.selectedSimulation) {
                                controller.userScenario  = objSim[index2]['user-calculo'];
                                controller.dateScenario  = objSim[index2]['dtm-exec-calc'];
                                controller.stageScenario = objSim[index2]['desc-idi-fase-calc'];
                                controller.paramModel.datReferCalc = new Date(objSim[index2]['dat-refer-calc']);

                                controller.paramModel.periodDate = {
                                    startDate: controller.paramModel.datReferCalc.getTime(),
                                    endDate: (utils.addMonthsToDate(controller.paramModel.datReferCalc, controller.paramModel.periodLimit)).getTime()
                                };

                                controller.ganttFromDate = moment(controller.paramModel.periodDate.startDate);
                                controller.ganttToDate = moment(controller.paramModel.periodDate.endDate);

                            }
                        }
                    };
                };

                controller.getGantt();
            }, 0);
        }

        controller.onChangeScenario = function() {           

            //limpa itens que estão em tela
            $timeout(function() {
                for (var index = 0; index < controller.scenarios.length; index++) {

                    if (controller.scenarios[index]['cod-cenario'] == controller.selectedScenario){

                        var objSim = controller.scenarios[index]['tt-lista-simulacao'];

                        controller.listComboSimulation = [];
                        controller.selectedSimulation = "";

                        for (var index2 = 0; index2 < objSim.length; index2++) {
                            var optSimulation = {};

                            optSimulation.label = objSim[index2]['idi-simulacao'];
                            optSimulation.value = objSim[index2]['idi-simulacao'] ;

                            controller.listComboSimulation.push(optSimulation);

                        }
                        if ($stateParams.simulation != null && $stateParams.simulation != ''){
                            controller.selectedSimulation = parseInt($stateParams.simulation);
                            controller.onChangeSimulation();
                        }
                    };
                };
            }, 0);
        }

        // Paginação de CTs
        controller.nextList = function() {
            if (controller.selectedPage != controller.maxPages) {
                controller.selectedPage += 1;
                resetSubPages();
                controller.getGantt();
            }

        }
        controller.prevList = function() {
            if (controller.selectedPage != 1) {
                controller.selectedPage -= 1;
                resetSubPages();
                controller.getGantt();
            }
        }

        controller.gotolist = function (page) {
            if (page != controller.selectedPage) {
                controller.selectedPage = page;
                resetSubPages();
                controller.getGantt();
            }
        }

        function resetSubPages() {
            controller.selectedSubPage = 1;

            controller.maxSubPages = 0;

            controller.ttSubPagina.forEach(function(subPage){
                if (subPage["pagina"] == controller.selectedPage) {
                    controller.maxSubPages += 1;
                }
            })

            controller.initialSubPage = 1;

            if (controller.maxSubPages > 5) {
                controller.finalSubPage = 5;
            } else {
                controller.finalSubPage = controller.maxSubPages;
            }
        }

        controller.gettitle  = function (page) {

            inittitle = "";
            finaltitle = "";

            controller.gmList.forEach(function(gm) {
                if (gm["pagina"] == page) {
                    if (inittitle == "") {
                        inittitle =  i18n('l-gm', [], 'dts/mdb') + ': ' + gm["gm-codigo"] + " - " +
                                     i18n('l-level', [], 'dts/mdb')  +  ': ' + gm["num-nivel"];

                    }
                    finaltitle = i18n('l-gm', [], 'dts/mdb') + ': ' + gm["gm-codigo"] + " - " +
                                 i18n('l-level', [], 'dts/mdb')  +  ': ' + gm["num-nivel"];

                }
            });

            return inittitle + " " + i18n('l-to', [], 'dts/mdb')  + " " + finaltitle;
        }

        // Paginação de operações
        controller.nextListOp = function() {
            if (controller.selectedSubPage != controller.maxSubPages) {
                controller.selectedSubPage += 1;
                controller.getGantt();
            }

        }
        controller.prevListOp = function() {
            if (controller.selectedSubPage != 1) {
                controller.selectedSubPage -= 1;
                controller.getGantt();
            }
        }

        controller.goToListOp = function (page) {
            if (page != controller.selectedSubPage) {
                controller.selectedSubPage = page;
                controller.getGantt();
            }
        }

        controller.getTitleOp  = function (page) {
            var inittitle = "";
            var finaltitle = "";

            controller.ttSubPagina.forEach(function(subPage) {

                if (subPage["pagina"] == controller.selectedPage) {
                    if (subPage["sub-pagina"] == page) {
                        inittitle = $filter('date')(subPage["data-inicio"], 'dd/MM/yyyy');
                        finaltitle = $filter('date')(subPage["data-termino"], 'dd/MM/yyyy');
                    }
                }
            });

            return inittitle + " " + i18n('l-to', [], 'dts/mdb')  + " " + finaltitle;
        }

        controller.atualizaGantt = function(result) {
            var literLevel = " - " + i18n('l-lev', [], 'dts/mdb') + ": ";

            controller.gmList = result['tt-ct-list'];
            controller.ttSubPagina = result['tt-sub-pagina'];
            controller.paramModel.gmFilter = result['tt-gm-filtro'];

            if (result && result['tt-param']) {
                controller.ganttLoading = true;

                controller.pageCount = [];

                ttParams = result['tt-param'];
                //Carrego objeto no contexto do controller para não precisar ir no progress novamente.
                controller.maxPages = ttParams[0]['maxPages'];
                controller.initialPage = ttParams[0]['initialPage'];
                controller.finalPage = ttParams[0]['finalPage'];

                for(var i = controller.initialPage; i <= controller.finalPage; i++) {
                    controller.pageCount.push(i);
                }

                controller.subPageList = [];

                controller.maxSubPages = ttParams[0]['maxSubPages'];
                controller.initialSubPage = ttParams[0]['initialSubPage'];
                controller.finalSubPage = ttParams[0]['finalSubPage'];

                for(var i = controller.initialSubPage; i <= controller.finalSubPage; i++) {
                    controller.subPageList.push(i);
                }
            }

            if (result && result['tt-erro']) {
                controller.showToaster(result['tt-erro']);
            }

            if (result && result['dsGantt']) {

                result['dsGantt'].forEach(function(gm) {
                    var gmObj = {
                        name: gm['gm-codigo'] + literLevel + gm['num-nivel'],
                        descricao: gm.descricao,
                        title: gm['gm-codigo-desc'] + literLevel + gm['num-nivel'],
                        children: []
                    };

                    if (gm['tt-wtdbr-ctrab']) {
                        gm['tt-wtdbr-ctrab'].forEach(function(ct) {

                            gmObj.children.push(ct['cod-ctrab']);

                            var ctObj = {
                                tasks: [],
                                name: ct['cod-ctrab'],
                                codCTrab: ct['cod-ctrab'],
                                gmCodigo: ct['gm-codigo'],
                                descricao: ct['descricao'],
                                title: ct['cod-ctrab-desc']
                            };

                            var ordOperacao = "";

                            if (ct['tt-wtdbr-operacao']) {
                                ct['tt-wtdbr-operacao'].forEach(function(operac) {
                                    if(controller.paramModel.showOrderOperation == true){
                                        ordOperacao = operac['num-ord-alpha'] + "/" + operac['op-codigo'];
                                    };
                                    ctObj.tasks.push({
                                        id: operac['id'],
                                        numIdCalc: operac['num-id-calc'],
                                        numIdMaterial: operac['num-id-material'],
                                        numIdOperacao: operac['num-id-operacao'],
                                        name: ordOperacao,
                                        opCodigo: operac['op-codigo'],
                                        descOperac: operac['desc-operac'],
                                        ordem: operac['num-ord-dbr'],
                                        ordemAlpha: operac['num-ord-alpha'], //Recupera string já com máscara do dbapi140 (num-ord-drb datasul)
                                        color: operac['cor-html'],
                                        dtInitMove: moment(operac['datetime-inicio']).format(),
                                        from: moment(operac['datetime-inicio']),
                                        to: moment(operac['datetime-termino']),
                                        gmCodigo: operac['gm-codigo'],
                                        codCTrab: operac['cod-ctrab'],
                                        itCodigo: operac['it-codigo'],
                                        descItem: operac['desc-item'],
                                        codRefer: operac['cod-refer'],
                                        dtLiberacao: new Date(operac['datetime-liberacao']),
                                        dtMaisTarde: new Date(operac['datetime-data-mais-tarde']),
                                        tempoPrepar: operac['tempo-prepar'],
                                        tempoMaquin: operac['tempo-maquin'],
                                        codReducPrepar: operac['cod-reduc-prepar'],
                                        rodadaLiberacao: operac['rodada-liberacao'],
                                        rodadaAlocCalc: operac['rodada-aloc-calc'],
                                        nomeAbrev: operac['nome-abrev'],
                                        nrPedcli: operac['nr-pedcli'],
                                        nrSequencia: operac['nr-sequencia']
                                    });
                                });
                            }

                            controller.ganttData.push(ctObj);
                        });
                    }

                    controller.ganttData.push(gmObj);
                });

                controller.ttSubPagina.forEach(function(subPage){
                    if (subPage["pagina"] == controller.selectedPage) {
                        if (subPage['sub-pagina'] == controller.selectedSubPage) {
                            controller.timespans = [{
                                from: moment(controller.ganttFromDate),
                                to: moment(subPage['data-inicio'])
                            },{
                                from: moment(subPage['data-termino']).add(1, 'days'),
                                to: moment(controller.ganttToDate).add(1, 'days')
                            }];
                        }
                    }
                });
            };
            //verifica se tem operações realcadas e aplica ao trocar de pagina
            if (controller.highlightedOperation != undefined) {
                controller.operationsHighlight(controller.highlightedOperation);
            }
            if(controller.operationsDelayed != undefined){
                controller.operationsDelayedHighlight(controller.operationsDelayed);
            }
        };

        controller.getGantt = function() {
            if (!controller.selectedScenario ||
                !controller.selectedSimulation) return;

            ttParams = [{"codCenario": controller.selectedScenario,
                         "idiSimulation": controller.selectedSimulation,
                         "pagina": controller.selectedPage,
                         "maxPages": controller.maxPages,
                         "initialPage": controller.initialPage,
                         "finalPage": controller.finalPage,
                         "subPage": controller.selectedSubPage,
                         "maxSubPages": controller.maxSubPages,
                         "initialSubPage": controller.initialSubPage,
                         "finalSubPage": controller.finalSubPage,
                         "dtInicio": controller.paramModel.periodDate.startDate,
                         "dtTermino": controller.paramModel.periodDate.endDate,
                         "exibeCtCapacidadeInfinita": controller.paramModel.showWorkCentersWithInfiniteCapacity,
                         "exibeCtSemOperacaoAlocada": controller.paramModel.showWorkCentersWithoutOperation
            }];

            parameters = {"tt-param": ttParams,
                          "tt-gm-filtro": controller.paramModel.gmFilter,
                          "tt-ct-list": controller.gmList,
                          "tt-sub-pagina": controller.ttSubPagina
            };

            controller.ganttData = [];

            fchmdb0002Factory.gantt(parameters, function(result){
                controller.atualizaGantt(result);
            });
        };

        controller.updateOp = function(task) {

            var ttWtdbrOperacao = {
                'id': task.model.id,
                'cod-ctrab':task.row.model.codCTrab,
                'gm-codigo':task.row.model.gmCodigo,
                'num-id-calc': task.model.numIdCalc,
                'num-id-material': task.model.numIdMaterial,
                'num-id-operacao': task.model.numIdOperacao,
                'datetime-inicio': moment(task.model.from).format(),
                'datetime-termino': moment(task.model.to).format(),
                'cor-html': task.model.color
            };

            fchmdb0002Factory.updateOp(ttWtdbrOperacao, function(result) {
                ttWtdbrOperacao = result['tt-wtdbr-operacao'];
                controller.ttErrors = result['tt-erro'];

                if (result.hasError) {
                    if(controller.taskBeforeObject){
                        var oldRow = task.row;
                        oldRow.removeTask(task.model.id, true, true);

                        var newRow = controller.taskBeforeObject.row;
                        task.model.from = moment(ttWtdbrOperacao[0]['datetime-inicio']);
                        task.model.to = moment(ttWtdbrOperacao[0]['datetime-termino']);

                        newRow.addTask(task.model, false);
                        controller.taskBeforeObject = undefined;
                    }

                    controller.ttErrors.forEach(function ( error ){
                        toaster.error(
                            i18n('l-error', [], 'dts/mdb'),
                            error.mensagem,
                            60000
                        );
                    });
                }

                if (result.hasAlert) {
                    toaster.warning(
                        i18n('l-warning', [], 'dts/mdb'),
                        i18n('l-inconsistent-operation', [], 'dts/mdb')
                    );
                }

                task.model.colorBeforeHighlight = ttWtdbrOperacao[0]['cor-html'];
                task.model.color = ttWtdbrOperacao[0]['cor-html'];
                task.model.from = moment(ttWtdbrOperacao[0]['datetime-inicio']);
                task.model.to = moment(ttWtdbrOperacao[0]['datetime-termino']);

                controller.ganttApi.rows.refresh();

            });
        };

	//Desfazer movimentação das operações
        controller.undoOperation = function(task) {
            var ttWtdbrOperacao = {
                'id': task.model.id,
                'cod-ctrab':task.row.model.codCTrab,
                'gm-codigo':task.row.model.gmCodigo,
                'num-id-calc': task.model.numIdCalc,
                'num-id-material': task.model.numIdMaterial,
                'num-id-operacao': task.model.numIdOperacao,
                'datetime-inicio': moment(task.model.from).format(),
                'datetime-termino': moment(task.model.to).format(),
                'cor-html': task.model.color
            };

            fchmdb0002Factory.undoOperation (ttWtdbrOperacao, function(result) {

                /* Resultado retornou erro*/
                if (result && result['tt-erro'] && result['tt-erro'].length > 0) {
                    controller.showToaster(result['tt-erro']);
                    return;
                }

                ttWtdbrOperacao = result['tt-wtdbr-operacao'];

                task.model.from = moment(ttWtdbrOperacao[0]['datetime-inicio']);
                task.model.to = moment(ttWtdbrOperacao[0]['datetime-termino']);
                task.model.color = ttWtdbrOperacao[0]['cor-html'];
                task.model.colorBeforeHighlight = ttWtdbrOperacao[0]['cor-html'];

                

                /* Mudou a linha da posição atual em relação a posição original*/
                
                if (ttWtdbrOperacao[0]['cod-ctrab'] != task.row.model.codCTrab) {
                    var oldRow = task.row;
                    var availableRow = false;

                    oldRow.removeTask(task.model.id, true, true);

                    var rowslist = oldRow.rowsManager.rows;

                    rowslist.forEach(function ( currentrow ){
                        if (currentrow.model.codCTrab == ttWtdbrOperacao[0]['cod-ctrab']) {
                            currentrow.addTask(task.model, false);
                            availableRow = true;
                        }
                    });

                    if (!availableRow) {
                        toaster.warning(
                            i18n('l-warning', [], 'dts/mdb'),
                            i18n('l-operation-undo', [], 'dts/mdb'),
                            60000
                        );
                    }
                }

                controller.ganttApi.rows.refresh();

            });


        }

        //Listage dos alertas - Menu de contexto
        controller.listAlerts = function(task) {
            //Atribuição dos atributos para variável
            var ttWtdbrOperacao = {
                'id': task.model.id,
                'cod-ctrab':task.row.model.codCTrab,
                'op-codigo':task.model.opCodigo,
                'num-ord-dbr':task.model.ordem,
                'num-ord-alpha':task.model.ordemAlpha,
                'gm-codigo':task.row.model.gmCodigo,
                'num-id-calc': task.model.numIdCalc,
                'num-id-material': task.model.numIdMaterial,
                'num-id-operacao': task.model.numIdOperacao,
                'datetime-inicio': moment(task.model.from).format(),
                'datetime-termino': moment(task.model.to).format()
            };
            //Passagem dos parametros para fachada
            fchmdb0002Factory.listAlerts(ttWtdbrOperacao, function(result) {
                //result recebe os dados da tt-erro
                result.forEach(function ( error ){
                    toaster.warning(
                        i18n('l-warning', [], 'dts/mdb'),
                        error.mensagem,
                        60000
                    );
                });

                //quando nao tiver alertas, mostrar mensagem de sucesso
                if (result.length === 0) {
                    toaster.success(
                        '',
                        i18n('msg-no-inconsistency-found', [], 'dts/mdb')
                    );
                }
            });
        }

        //Legend
        controller.legend = function() {
            var modalInstance = $modal.open({
                templateUrl: '/dts/mdb/html/operationsgantt/operationsgantt.legend.html',
                controller: 'mdb.operationsgantt.legend.controller as controller',
                size: 'md'
            });
        }

        controller.openBacklog = function() {
            var params ={
                "p-cod-cenario": controller.selectedScenario,
                "p-num-simulacao": controller.selectedSimulation
            }

            fchmdb0002Factory.operationsBacklog(params, function(result) {


                if (result && result['tt-erro'] && result['tt-erro'].length > 0) {
                    controller.showToaster(result['tt-erro']);
                    return;
                }

                var dataGridModal = {
                    selectedScenario: controller.selectedScenario,
                    selectedSimulation: controller.selectedSimulation,
                    listOper: result['tt-wtdbr-operacao']
                }
                if (result && result['tt-wtdbr-operacao']) {
                    var modalInstance = $modal.open({
                        templateUrl: '/dts/mdb/html/operationsgantt/operationsgantt.backlog.html',
                        controller: 'mdb.operationsgantt.backlog.controller as controller',
                        size: 'lg',
                        resolve: {
                            model: function () {
                                return dataGridModal;
                            }
                        }
                    });
                    modalInstance.result.then(function (paramModel) {
                        if (paramModel){

                            controller.gmList = [];
                            controller.ttSubPagina = [];

                            controller.getGantt();
                        }
                    });
                }
            });

        }
        controller.openValidate = function() {
            var params ={
                "p-cod-cenario": controller.selectedScenario,
                "p-num-simulacao": controller.selectedSimulation
            }

            fchmdb0002Factory.operationsValidate(params, function(result) {

                if (result && result['tt-erro'] && result['tt-erro'].length > 0 ) {
                    controller.showToaster(result['tt-erro']);
                    return;                     
                }

                var dataGridModal = {
                    selectedScenario: controller.selectedScenario,
                    selectedSimulation: controller.selectedSimulation,
                    listOper: result['tt-wtdbr-operacao']
                }

                if (result['tt-wtdbr-operacao']) {
                    var modalInstance = $modal.open({
                        templateUrl: '/dts/mdb/html/operationsgantt/operationsgantt.validate.html',
                        controller: 'mdb.operationsgantt.validate.controller as controller',
                        size: 'lg',
                        resolve: {
                            model: function () {
                                return dataGridModal;
                            }
                        }
                    });
                    modalInstance.result.then(function (paramModel) {
                        if (paramModel){

                            controller.gmList = [];
                            controller.ttSubPagina = [];

                            controller.getGantt();
                        }
                    });
                }
            });
        }

        //desfazer realcar operacoes da rede
        controller.operationsHighlightClear = function () {
            controller.ganttData.forEach(function(row){
                if (row.tasks){
                    row.tasks.forEach(function(rowTask) {
                        if (rowTask.color == "#E6E6E6") {
                            rowTask.color = rowTask.colorBeforeHighlight;
                        }
                        if (rowTask.color == "#F00F00") {
                            rowTask.color = rowTask.colorBeforeHighlight;
                        }
                    })
                }
            });

            controller.addTaskContextMenuOptions();

            //retirar opcao(desfazer realcar rede) do menu de dontexto
            controller.taskContextMenuOptions.forEach(function(list, index) {
                if (list.text == i18n('l-undo-highlight', [], 'dts/mdb')){
                    controller.taskContextMenuOptions.splice(index, 1);
                }
            });

            controller.highlightedOperation = undefined;
            controller.operationsDelayed = undefined;
        };

        //Realcar operacoes da rede - Menu de contexto
        controller.operationsHighlight = function(task) {

            controller.highlightedOperation = task;
            controller.operationsDelayed = undefined;

            //Atribuição dos atributos para variável
            var ttWtdbrOperacao = {
                'num-id-calc': task.model.numIdCalc,
                'num-id-material': task.model.numIdMaterial,
                'num-id-operacao': task.model.numIdOperacao,
            };

            //Passagem dos parametros para fachada
            fchmdb0002Factory.operationsHighlight(ttWtdbrOperacao, function(result) {

                if (result && result['tt-erro']) {
                    controller.showToaster(result['tt-erro']);
                }

                if (result && result['tt-wtdbr-operacao'] && result['tt-wtdbr-operacao'].length > 0)  {
                    controller.operationHighlight(result['tt-wtdbr-operacao']);    
                }
                
            });
        };

        //Desalocar Operação - Menu de contexto
        controller.operationslDealLocate = function(task) {

            var ttWtdbrOperacao = {
                'id': task.model.id,
                'cod-ctrab':task.row.model.codCTrab,
                'gm-codigo':task.row.model.gmCodigo,
                'num-id-calc': task.model.numIdCalc,
                'num-id-material': task.model.numIdMaterial,
                'num-id-operacao': task.model.numIdOperacao
            };

            fchmdb0002Factory.operationslDealLocate (ttWtdbrOperacao, function(result) {
                if (result && result['tt-erro'] && 
                    result['tt-erro'].length > 0) {
                    controller.showToaster(result['tt-erro']);
                    return;
                }


                task.row.removeTask(task.model.id, true, true);
                controller.ganttApi.rows.refresh();

                toaster.success(
                    i18n('l-success-2', [], 'dts/mdb'),
                    i18n('msg-operation-deallocated-successfully', [], 'dts/mdb')
                );
            });
        };

        //Realcar operacoes atrasadas - Menu de contexto
        controller.operationsDelayedHighlight = function(task) {

            var params ={
                "p-cod-cenario": controller.selectedScenario,
                "p-num-simulacao": controller.selectedSimulation
            };

            fchmdb0002Factory.operationsDelayedHighlight(params, function(result) {

                if (result && result['tt-erro']) {
                    controller.showToaster(result['tt-erro']);                    
                }

                if (result && result['tt-wtdbr-operacao'] && result['tt-wtdbr-operacao'].length > 0)  {
                    controller.operDelayedHighlight(result['tt-wtdbr-operacao']);
                }
            });
        };

        //Abrir o demonstrativo de cálculo do item
        controller.operationsCalculationStatement = function(task) {

            var path = "dts/mdb/itemcalculationstatement/detail/" +
                            controller.selectedScenario + "/true/" +
                            task.model['itCodigo'] + "/" +
                            task.model['codRefer'] + "/" +
                            controller.selectedSimulation;

            $location.path(path);

        }

        controller.addTaskContextMenuOptions = function () {
            logOpcaoDesfazerRealcar = false;
            logOpcaoRealcarAtrasadas = false;

            controller.taskContextMenuOptions.forEach(function(list) {
                if (list.text == i18n('l-undo-highlight', [], 'dts/mdb')){
                    logOpcaoDesfazerRealcar = true;
                }
                //Verifica se a opção "Realçar Atrasdas" está no menu de contexto.
                if (list.text == i18n('l-delayed-highlight', [], 'dts/mdb')){
                    logOpcaoRealcarAtrasadas = true;
                }
            });

            //Inclui a opção "Realçar Atrasadas" no menu de contexto caso não exista.
            if(!logOpcaoRealcarAtrasadas){
                for (var index = 0; index < controller.taskContextMenuOptions.length; index++) {
                    var menuOption = controller.taskContextMenuOptions[index];

                    if (menuOption.text == i18n('l-net-highlight', [], 'dts/mdb')){
                        controller.taskContextMenuOptions.splice(index + 1, 0, {
                            text: i18n('l-delayed-highlight', [], 'dts/mdb'),
                            click: function ($itemScope, $event, modelValue, text, $li) {
                                controller.operationsDelayedHighlight(modelValue);
                            }
                        });
                        break;
                    }
                }
            }

            //incluir opcao de desfazer o realcar no menu de contexto
            if (!logOpcaoDesfazerRealcar){
                controller.taskContextMenuOptions.push({
                    text: i18n('l-undo-highlight', [], 'dts/mdb'),
                    click: function ($itemScope, $event, modelValue, text, $li) {
                        // modelValue é a operação
                        controller.operationsHighlightClear();
                    }
                });
            }

        }

        //Parameters
        controller.openParameters = function() {

            var modalInstance = $modal.open({
                templateUrl: '/dts/mdb/html/operationsgantt/operationsgantt.parameters.html',
                controller: 'mdb.operationsgantt.parameters.controller as controller',
                size: 'md',
                resolve: {
                    model: function () {
                        // passa o objeto com os dados da pesquisa avancada para o modal
                        return controller.paramModel;
                    }
                }
            });

            // quando o usuario clicar em salvar:
            modalInstance.result.then(function (paramModel) {
                controller.paramModel = paramModel;
                if (controller.paramModel.atualizaGmList){
                    controller.gmList = [];
                    controller.ttSubPagina = [];
                    controller.selectedPage = 1;
                    controller.selectedSubPage = 1;
                }

                controller.ganttFromDate = controller.paramModel.periodDate.startDate || "";
                controller.ganttToDate = controller.paramModel.periodDate.endDate || "";

                var paramObj = {
                    selectedPeriod: controller.paramModel.selectedPeriod,
                    showOrderOperation: controller.paramModel.showOrderOperation,
                    showWorkCentersWithInfiniteCapacity: controller.paramModel.showWorkCentersWithInfiniteCapacity,
                    showWorkCentersWithoutOperation: controller.paramModel.showWorkCentersWithoutOperation
                };


                $window.localStorage.setItem('operationsganttparamObj', JSON.stringify(paramObj));

                controller.changeHeaderType();
                controller.getGantt();
            });
        };

        controller.searchOperation = function(nextOperation, previousOperation) {

            if(controller.searchModel == ""){
                controller.operationsHighlightClear();
                return;
            }

            controller.localizaOperacao = true;

            ttParams = [{"codCenario": controller.selectedScenario,
                         "pagina": controller.selectedPage,
                         "maxPages": controller.maxPages,
                         "idiSimulation": controller.selectedSimulation,
                         "initialPage": controller.initialPage,
                         "finalPage": controller.finalPage,
                         "subPage": controller.selectedSubPage,
                         "maxSubPages": controller.maxSubPages,
                         "initialSubPage": controller.initialSubPage,
                         "finalSubPage": controller.finalSubPage,
                         "dtInicio": controller.paramModel.periodDate.startDate,
                         "dtTermino": controller.paramModel.periodDate.endDate,
                         "exibeCtCapacidadeInfinita": controller.paramModel.showWorkCentersWithInfiniteCapacity,
                         "exibeCtSemOperacaoAlocada": controller.paramModel.showWorkCentersWithoutOperation
            }];

            if (!nextOperation && !previousOperation)
              controller.operacaoLocalizada = undefined;

            var parameters = {
                "tt-param": ttParams,
                "tt-gm-filtro": controller.paramModel.gmFilter,
                "tt-ct-list": controller.gmList,
                "tt-sub-pagina": controller.ttSubPagina,
                "operacaoPesquisada": controller.searchModel,
                "tt-operacao-localizada": controller.operacaoLocalizada,
                "proximaOperacao": nextOperation,
                "operacaoAnterior": previousOperation
            };

            fchmdb0002Factory.searchOperation(parameters, function(result){

                if(result['tt-erro'].length > 0) {
                    controller.showToaster(result['tt-erro']);
                }

                if(result['tt-operacao-localizada'].length == 0){
                    toaster.warning(
                        i18n('l-warning', [], 'dts/mdb'),
                        i18n('l-operation-not-found', [], 'dts/mdb')
                    );
                    return;
                }

                controller.operacaoLocalizada = result['tt-operacao-localizada'][0];

                if (result.trocaPagina) {
                    controller.selectedPage = result['tt-param'][0].pagina;
                    controller.selectedSubPage = result['tt-param'][0].subPage;

                    controller.ganttData = [];

                    $timeout(function() {
                        controller.atualizaGantt(result);

                        controller.operationHighlight([controller.operacaoLocalizada]);
                    }, 0);
                } else {
                    controller.operationHighlight([controller.operacaoLocalizada]);
                    controller.scrollToTask();

                    controller.localizaOperacao = false;
                }
            });
        };

        controller.scrollToTask = function() {

            $timeout(function() {
                controller.ganttApi.gantt.rowsManager.rows.forEach(function(row){

                    if (row.model.gmCodigo == controller.operacaoLocalizada['gm-codigo'] && row.model.codCTrab == controller.operacaoLocalizada['cod-ctrab']) {
                        for (var index = 0; index < row.tasks.length; index++) {
                        var rowTask = row.tasks[index];

                        if (rowTask.model.numIdOperacao == controller.operacaoLocalizada['num-id-operacao'] &&
                            rowTask.model.numIdMaterial == controller.operacaoLocalizada['num-id-material']) {

                            // Reposiciona na hora
                            controller.ganttApi.scroll.to(rowTask.left);
                            break;
                        }
                        }
                    }
                });
            }, 0);
        };

        controller.operationHighlight = function(operationList) {
            controller.ganttData.forEach(function(row){
                if (row.tasks){
                    row.tasks.forEach(function(rowTask) {
                        if (!rowTask.colorBeforeHighlight){
                            rowTask['colorBeforeHighlight'] = rowTask.color;
                        } else if (rowTask.color == "#E6E6E6") {
                            rowTask.color = rowTask.colorBeforeHighlight;
                        }
                        logRealcarOper = false;
                        operationList.forEach(function(operation){
                            if (rowTask.numIdOperacao == operation['num-id-operacao'] &&
                                rowTask.numIdMaterial == operation['num-id-material']  ){
                                    logRealcarOper = true;
                            }
                        })
                        if (!logRealcarOper){
                            rowTask.color = "#E6E6E6" ;
                        }
                    })
                }
            });
            controller.addTaskContextMenuOptions();
        }

        controller.operDelayedHighlight = function(operationList) {
            controller.ganttData.forEach(function(row){
                if (row.tasks){
                    row.tasks.forEach(function(rowTask) {
                        if (!rowTask.colorBeforeHighlight){
                            rowTask['colorBeforeHighlight'] = rowTask.color;
                        } else if (rowTask.color == "#F00F00") {
                            rowTask.color = rowTask.colorBeforeHighlight;
                        }
                        realcarAtrasadas = true;
                        operationList.forEach(function(operation){
                            if (rowTask.numIdOperacao == operation['num-id-operacao'] &&
                                rowTask.numIdMaterial == operation['num-id-material']  ){
                                    realcarAtrasadas = false;
                            }
                        })
                        if (realcarAtrasadas){
                            rowTask.color = "#F00F00" ;
                        }
                    })
                }
            });

            controller.addTaskContextMenuOptions();

            controller.taskContextMenuOptions.forEach(function(list, index) {
                if (list.text == i18n('l-delayed-highlight', [], 'dts/mdb')){
                    controller.taskContextMenuOptions.splice(index, 1);
                }
            });
        }

        controller.showToaster = function(message) {
            message.forEach(function ( error ){
                toaster.warning(
                    i18n('l-warning', [], 'dts/mdb'),
                    error.mensagem,
                    60000
                );
            });
        }

        controller.init();
    }

    index.register.controller('mdb.operationsgantt.controller', operationsGanttCtrl);

});