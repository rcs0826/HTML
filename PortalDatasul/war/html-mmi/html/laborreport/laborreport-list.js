define(['index',
        'ng-load!ui-file-upload',
        '/dts/mmi/js/directive/select-tecn-mi.js',
        '/dts/mmi/html/laborreport/laborreport-param.js',
        '/dts/mmi/html/laborreport/laborreport-search.js',
        'totvs-html-framework'
], function(index) {

    laborreportListController.$inject = ['$rootScope',
        '$scope',
        '$modal',
        'totvs.app-main-view.Service',
        '$filter',
        'fchmip.fchmip0066.Factory',
        'mmi.bomn136.Service',
        'TOTVSEvent',
        '$q',
        'fchmip.fchmiporder.Factory',
        '$timeout',
        'upload',
        '$totvsprofile'
    ];

    function laborreportListController($rootScope,
        $scope,
        $modal,
        appViewService,
        $filter,
        fchmip0066,
        bomn136Service,
        TOTVSEvent,
        $q,
        fchmiporderFactory,
        $timeout,
        upload,
        $totvsprofile) {

        var controller = this;
	  
        controller.paramAbertura = {'nr-ord-produ' : "",
                                    'userTechnician': ""
         };

        controller.parametros = {"lAceitePendente": false,
                                 "lTarefaPendente": true,
                                 "lReqPendente": false,
                                 "locPendente": false,
                                 "ultimaOrdem": true,
                                 "ultimoTecnico": true,
                                 "informaCentroCusto": false}; 
                            

        // *********************************************************************************
        // *** Atributos
        // *********************************************************************************
        controller.externalApps = [];
        controller.saveUrl = '/dts/datasul-rest/resources/api/fch/fchmip/fchmip0066/uploadCsv';
        
        // *********************************************************************************
        // *** Methods
        // *********************************************************************************

        controller.onSelected = function (file) {
            if (file.files[0].extension === '.csv'){
                controller.barProgress = true;
                controller.invalidExtension = false;
            } else {
                controller.invalidExtension = true;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: $rootScope.i18n('l-extension-csv')
                });
            }
        }

        controller.uploadFile = function($validFiles){
            $('.k-button.k-upload-button input').click();
        };

        controller.onError = function(){
            controller.barProgress = false;
        }

        controller.onSuccess = function(result){
            if (result.response.data.length > 0 && controller.invalidExtension === false){

                iCont = 2;

                if (controller.sensitiveOff){

                    do{
                        controller.myGrid.columns[iCont].editable = true;

                        iCont = iCont + 1;
                    }while(iCont < 17);

                    controller.myGrid.showColumn(0);
                    controller.myGrid.showColumn(1);
                    controller.sensitiveOff = false;
                }

                controller.externalApps = [];
                controller.myGrid._data = [];
                controller.ttErro       = [];
                controller.disclaimers  = [];
                controller.isConsulta = false;

                var iCont = 0;

                controller.csvReports = result.response.data;                

                angular.forEach(controller.csvReports, function(csvRow) {

                	controller.myGrid._data.push({
                        linha: iCont,
                        nrOrdProdu: !csvRow.orderNumber ? "0" : csvRow.orderNumber,
                        cdTarefa: csvRow.taskCode,
                        cdTecnico: csvRow.technicalCode,
                        especialidade: csvRow.specialityType,
                        cdTurno: csvRow.turnCode,
                        dttrans: csvRow.reportDate,
                        horaTermino: csvRow.finishHour,
                        horaInicio: csvRow.initialHour,
                        horaNormal: csvRow.normalHours,
                        horaExtra: csvRow.extraHours,
                        intervalo: csvRow.pointingDuringInterval.toLowerCase() == "s" ? true : false,
                        encerrarTarefa: csvRow.isFinished.toLowerCase() == "s" ? true : false,
                        encerrarOrdem: csvRow.finishedOrder.toLowerCase() == "s" ? true : false,
                		descOrder: "",
                        descTaref: "",		
                        narrativa: csvRow.note,
                        centroCusto: csvRow.costCenter.trim()
                    });                    

                    iCont = iCont + 1;
                });

                controller.barProgress = false;

                $timeout(function() {
                    angular.copy(controller.myGrid._data, controller.externalApps);

                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'information',
                        title: $rootScope.i18n('l-imported-records') + ' ' + controller.myGrid._data.length
                    });
                },10);
            }
        };

        controller.filterTechnician = function(input) {
            return function(element) {
                if (element['cdTecnico'].toLowerCase().indexOf(input.toLowerCase()) != -1) return true;
                if (element['nomeCompl'].toLowerCase().indexOf(input.toLowerCase()) != -1) return true;
                return false;
            };
        };

        controller.leaveNrOrdProdu = function(dataItem) {
        	
        	if (dataItem.nrOrdProdu) {
        		dataItem.nrOrdProdu = dataItem.nrOrdProdu.replace(" ", "");
        		dataItem.nrOrdProdu = dataItem.nrOrdProdu.replace(".", ",");
        	}
        	
        	if (controller.parametros.ultimaOrdem && dataItem.nrOrdProdu === controller.linhaAnterior.nrOrdProdu) return;

            if (!isNaN(dataItem.nrOrdProdu) && dataItem.nrOrdProdu !== undefined) {

                if (dataItem.nrOrdProdu != 0) {
                    controller.ttSelecao = {
                        startAt: 1,
                        filtro: 1,
                        nrOrdProdu: dataItem.nrOrdProdu,
                        cdEquipto: "",
                        lNaoIniciada: true,
                        lIniciada: true,
                        lSuspensa: true,
                        lEncerrada: true
                    };

                    var i = controller.myGrid._data.indexOf(dataItem);

                    fchmiporderFactory.getListOrder(controller.ttSelecao, function(result) {
                        if (result.ttOrdem.length > 0) {
                            if (result.ttOrdem[0]['des-man-corr'] != undefined)
                                dataItem.descOrder = result.ttOrdem[0]['des-man-corr'];
                            	controller.linhaAnterior.nrOrdProdu = dataItem.nrOrdProdu;
                            	controller.linhaAnterior.descOrder = dataItem.descOrder;
                        }else{
                            dataItem.descOrder = $rootScope.i18n("l-not-found");
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'error',
                                title: $rootScope.i18n('l-attention'),
                                detail: $rootScope.i18n('msg-maintenance-order-valid-number')
                            });
                        }

                        angular.copy(controller.myGrid._data, controller.externalApps);
                            $timeout(function() {
                                var rows = controller.myGrid.tbody[0];                        
                                rows.children[i].cells[3].click();
                        }, 10);
                    });
                }
            } else {
                dataItem.nrOrdProdu = "";
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: $rootScope.i18n('l-attention'),
                    detail: $rootScope.i18n('msg-maintenance-order-valid-number')
                });
            }
        };

        controller.leaveCdTarefa = function(dataItem) {

            dataItem.cdTarefa = dataItem.cdTarefa.replace(".", ",");

            var i = controller.myGrid._data.indexOf(dataItem);

            if (dataItem.cdTarefa != undefined && dataItem.cdTarefa != "" && dataItem.cdTarefa != 0 && dataItem.nrOrdProdu != "" && dataItem.nrOrdProdu != undefined) {

                if (!isNaN(dataItem.cdTarefa) || dataItem.cdTarefa == undefined) {                    

                    bomn136Service.getRecord({
                        pNrOrdProdu: dataItem.nrOrdProdu,
                        pCdTarefa: dataItem.cdTarefa
                    }, function(result) {

                        if (result.descricao != undefined)
                            dataItem.descTaref = result.descricao;
                        else {
                            dataItem.descTaref = $rootScope.i18n("l-not-found");
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'error',
                                title: $rootScope.i18n('l-attention'),
                                detail: $rootScope.i18n('msg-task-valid-number')
                            });
                        }

                        angular.copy(controller.myGrid._data, controller.externalApps);
                        $timeout(function() {
                            var rows = controller.myGrid.tbody[0];                        
                            rows.children[i].cells[4].click();
                        }, 10);                           
                    });
                } else {
                    dataItem.cdTarefa = "";
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error',
                        title: $rootScope.i18n('l-attention'),
                        detail: $rootScope.i18n('msg-task-valid-number')
                    });
                }
            } else {
                if (dataItem.cdTarefa == 0){
                    dataItem.descTaref = $rootScope.i18n("l-not-found");
                    angular.copy(controller.myGrid._data, controller.externalApps);
                    $timeout(function() {
                        var rows = controller.myGrid.tbody[0];                        
                        rows.children[i].cells[4].click();
                    }, 10);

                }

            }

        };
        
        controller.onLeaveTecnico = function(dataItem) {
        	controller.linhaAnterior.cdTecnico = dataItem.cdTecnico;
        	
        	if (!dataItem.nrOrdProdu || !dataItem.cdTarefa || !dataItem.cdTecnico) return;
        	
        	var cdTecnico = dataItem.cdTecnico.replace("-", "");
        	var index = controller.myGrid._data.indexOf(dataItem);
        	
        	var params = {
                'nrOrdem': parseInt(dataItem.nrOrdProdu),
                'cdTarefa': parseInt(dataItem.cdTarefa),
                'cdTecnico': cdTecnico
            };

            fchmiporderFactory.getDadosApontamento(params, function(result) {
    	        if (result && result.nomeCompl) {
            		dataItem.cdTurno = result.cdTurno;
                    dataItem.especialidade = result.tpEspecialidade;
                    dataItem.descTecnico = result.nomeCompl;
                    dataItem.grupo = result.grupo;
                    dataItem.centroCusto = result.centroCusto;
                    
                    if (dataItem.grupo) {
                    	dataItem.horaInicio  = "00:00";
                    	dataItem.horaTermino = "00:00";
                    } else {
                    	dataItem.horaNormal = "0";
                    	dataItem.horaExtra = "0";
                    }
                    
                    angular.copy(controller.myGrid._data, controller.externalApps);
                    $timeout(function() {
                        var rows = controller.myGrid.tbody[0];
                        rows.children[index].cells[5].click();
                    }, 10);
                    
            	} else {
                    dataItem.descTaref = $rootScope.i18n("l-not-found");
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error',
                        title: $rootScope.i18n('l-attention'),
                        detail: $rootScope.i18n('l-technician') + " " + $rootScope.i18n('l-not-found')
                    });
    	        }
        	});
        }
         
        controller.editNrOrdProdu = function(container, options) {
            var input = angular.element("<input class='k-input k-textbox' maxlength='9' ng-blur='controller.leaveNrOrdProdu(dataItem)'></input>");
        	
            input.attr("data-bind", "value: ['nrOrdProdu']");
            input.attr('ng-model', 'nrOrdProdu');
            input.attr('name', 'nrOrdProdu');
            input.appendTo(container);
        };

        controller.editCdTarefa = function(container, options) {
            var input = angular.element("<input class='k-input k-textbox' maxlength='5' ng-blur='controller.leaveCdTarefa(dataItem)'></input>");
            input.attr("data-bind", "value: ['cdTarefa']");
            input.attr('ng-model', 'cdTarefa');
            input.attr('name', 'cdTarefa');
            input.appendTo(container);
        };
        
        controller.editCdTecnico = function(container, options) {
            var input = angular.element("<input class='k-input k-textbox' maxlength='7' ng-blur='controller.onLeaveTecnico(dataItem)'></input>");
            input.attr("data-bind", "value: ['cdTecnico']");
            input.attr('ng-model', 'cdTecnico');
            input.attr('name', 'cdTecnico');
            input.kendoMaskedTextBox({
                mask: "00000-0"
            });
            input.appendTo(container);
        };
        
        controller.editEspecialidade = function(container, options) {
            var input = angular.element("<input class='k-input k-textbox' maxlength='8'></input>");
            input.attr("data-bind", "value: ['especialidade']");
            input.attr('ng-model', 'especialidade');
            input.attr('name', 'especialidade');
            input.appendTo(container);
        };

        controller.editCentroCusto = function(container, options) {
            var input = angular.element("<input class='k-input k-textbox' maxlength='20'></input>");
            input.attr("data-bind", "value: ['centroCusto']");
            input.attr('ng-model', 'centroCusto');
            input.attr('name', 'centroCusto');
            input.appendTo(container);
        };
        
        controller.editHoraInicio = function(container, options) {
            var input = $("<input type='text' class='k-input k-textbox' " +
            			  "ng-blur='controller.leaveHrIni(dataItem)'>");
            input.attr('ng-model', 'horaInicio');
            input.attr('name', 'horaInicio');
            input.attr('data-bind', 'value:horaInicio');
            input.attr('ng-focus', 'controller.validaTipoTecnico("horaInicio", dataItem)');
            input.kendoMaskedTextBox({
                mask: "00:00"
            });
            input.appendTo(container);
        };

        controller.editHoraTermino = function(container, options) {
            var input = $("<input type='text' class='k-input k-textbox' ng-blur='controller.leaveHrFim(dataItem)'>");
            input.attr('ng-model', 'horaTermino');
            input.attr('name', 'horaTermino');
            input.attr('data-bind', 'value:horaTermino');
            input.attr('ng-disabled', 'dataItem.grupo');
            input.kendoMaskedTextBox({
                mask: "00:00"
            });
            input.appendTo(container);
        };

        controller.editHoraNormal = function(container, options) {
            var input = $("<input type='text' class='k-input k-textbox' ng-blur='controller.leaveHrNormal(dataItem)'>");
            input.attr('ng-model', 'horaNormal');
            input.attr('name', 'horaNormal');
            input.attr('data-bind', 'value:horaNormal');
            input.attr('ng-focus', 'controller.validaTipoTecnico("horaNormal", dataItem)');
            input.appendTo(container);
        };

        controller.editHoraExtra = function(container, options) {
            var input = $("<input type='text' class='k-input k-textbox' ng-blur='controller.leaveHrExtra(dataItem)'>");
            input.attr('ng-model', 'horaExtra');
            input.attr('name', 'horaExtra');
            input.attr('data-bind', 'value:horaExtra');
            input.attr('ng-disabled', '!dataItem.grupo');
            input.appendTo(container);
        };

        controller.editIntervalo = function(container, options) {
            var input = $("<input type='checkbox' class='ng-binding alinha-check' ng-model='intervalo' ></field>");
            input.attr('name', options.field);
            input.attr('data-bind', 'checked:intervalo');
            input.appendTo(container);
        };

        controller.editNarrativa = function(container, options){
            var input = $("<textarea class='k-input k-textbox'>");
            input.attr('ng-model', 'narrativa');
            input.attr('name', 'narrativa');
            input.attr('data-bind', 'value:narrativa');
            input.attr('maxlength', '200');
            input.appendTo(container);

        }

        controller.templateIntervalo = function(dataItem) {
            var input = "<span ";
            if (dataItem.intervalo)
                input = input + "class='glyphicon glyphicon-ok alinha-icon'";

            input = input + "'></span>";

            return input;
        };

        controller.templateNrOrdProdu = function(dataItem){
            var input = "<span";
            if (dataItem.nrOrdProdu){
                input = input + ' data-toggle="tooltip" title="' + dataItem.descOrder + '" >';
                input = input + dataItem.nrOrdProdu;
            }else
                input = input + '>';            

            input = input + "</span>";

            return input;
        }

        controller.templateCdTarefa = function(dataItem){
            var input = "<span";
            if (dataItem.nrOrdProdu){
                input = input + ' data-toggle="tooltip" title="' + dataItem.descTaref + '" >';
                input = input + dataItem.cdTarefa;
            }else
                input = input + '>';
            
            input = input + "</span>";

            return input;
        }
        
        controller.templateCdTecnico = function(dataItem) {
        	var input = "<span";
            if (dataItem.nrOrdProdu) {
                input = input + ' data-toggle="tooltip" title="' + dataItem.descTecnico + '" >';
                input = input + dataItem.cdTecnico;
            }else
                input = input + '>';
            
            input = input + "</span>";

            return input;
        }

        controller.editEncTarefa = function(container, options) {
            var input = $("<input type='checkbox' class='ng-binding alinha-check' ng-model='encerrarTarefa' ></field>");
            input.attr('name', options.field);
            input.attr('data-bind', 'checked:encerrarTarefa');
            input.appendTo(container);
        };

        controller.templateEncTarefa = function(dataItem) {
            var input = "<span ";
            if (dataItem.encerrarTarefa)
                input = input + "class='glyphicon glyphicon-ok alinha-icon'";

            input = input + "'></span>";

            return input;
        };

        controller.editEncOrdem = function(container, options) {
            var input = $("<input type='checkbox' class='ng-binding alinha-check'  ng-model='encerrarOrdem' ></field>");
            input.attr('name', options.field);
            input.attr('data-bind', 'checked:encerrarOrdem');
            input.appendTo(container);
        };

        controller.templateEncOrdem = function(dataItem) {
            var input = "<span ";
            if (dataItem.encerrarOrdem)
                input = input + "class='glyphicon glyphicon-ok alinha-icon'";

            input = input + "'></span>";

            return input;
        };

        controller.templateHeaderIntervalo = function(){
            var input = '<span';
            input = input + ' class="glyphicon glyphicon-time alinha-icon"';
            input = input + ' data-toggle="tooltip" title="' + $rootScope.i18n('l-points-during-break') + '"';
            input = input + ' ></span>';

            return input;            
        };

        controller.templateHeaderEncTarefa = function(){
            var input = '<span';
            input = input + ' class="glyphicon glyphicon-list-alt alinha-icon"';
            input = input + ' data-toggle="tooltip" title="' + $rootScope.i18n('l-end-task') + '"';
            input = input + ' ></span>';

            return input;            
        };

        controller.templateHeaderEncOrdem = function(){
            var input = '<span';
            input = input + ' class="glyphicon glyphicon-check alinha-icon"';
            input = input + ' data-toggle="tooltip" title="' + $rootScope.i18n('l-end-order') + '"';
            input = input + ' ></span>';

            return input;            
        };

        controller.templateHeader = function(title){
            var input = '<span';
            input = input + ' class="alinha-icon"';
            input = input + ' data-toggle="tooltip" title="' + $rootScope.i18n(title) + '"';
            input = input + ' >' + $rootScope.i18n(title) + '</span>';

            return input;  
        }

        var opts = {
            change: function(e) {
                var selRow = this.select();
                var data = this.dataSource.at(selRow[0].rowIndex);

                if (this.dataItem(selRow[0]).encerrarTarefa) {
                    data.set("encerrarTarefa", this.dataItem(selRow[0]).encerrarTarefa);
                    controller.externalApps[selRow[0].rowIndex].encerrarTarefa = this.dataItem(selRow[0]).encerrarTarefa;
                }
                if (this.dataItem(selRow[0]).encerrarOrdem) {
                    data.set("encerrarOrdem", this.dataItem(selRow[0]).encerrarOrdem);
                    controller.externalApps[selRow[0].rowIndex].encerrarOrdem = this.dataItem(selRow[0]).encerrarOrdem;
                }
            },
            navigatable: true,
            selectable: true
        };

        controller.onAdd = function() {

            if(controller.isConsulta){
            	controller.myGrid._data = [];
                controller.externalApps = [];
                controller.disclaimers = [];
        	}	
        	controller.isConsulta = false;

            iCont = 2;

            if (controller.sensitiveOff){

                controller.externalApps = [];
                controller.myGrid._data = [];

                do{
                    controller.myGrid.columns[iCont].editable = true;

                    iCont = iCont + 1;
                }while(iCont < 17);

                controller.myGrid.showColumn(0);
                controller.myGrid.showColumn(1);
                controller.sensitiveOff = false;
            }
    		
            var iCont = controller.myGrid._data.length - 1;
            if (iCont < 0 || controller.myGrid._data[iCont].nrOrdProdu != undefined && controller.myGrid._data[iCont].nrOrdProdu != "" &&
                        controller.myGrid._data[iCont].cdTarefa != undefined && controller.myGrid._data[iCont].cdTarefa != ""){
            	
            	var nrOrdProdu = "";
            	
            	if (controller.parametros.ultimaOrdem === true && controller.linhaAnterior.nrOrdProdu) {
            		nrOrdProdu = controller.linhaAnterior.nrOrdProdu;
            	} else {
            		if (controller.parametros.ultimaOrdem === false && controller.parametros.ultimoTecnico === true) {
            			nrOrdProdu = " ";	
            		}
            	}
                
                controller.myGrid._data.push({
                    linha: iCont+1,
                    nrOrdProdu: nrOrdProdu,
                    cdTarefa: "",
                    cdTecnico: controller.parametros.ultimoTecnico === true && controller.linhaAnterior.cdTecnico ? controller.linhaAnterior.cdTecnico : "",
                    especialidade: "",
                    cdTurno: "",
                    dttrans: new Date(),
                    horaTermino: "00:00",
                    horaInicio: "00:00",
                    horaNormal: "0",
                    horaExtra: "0",
                    intervalo: false,
                    encerrarTarefa: false,
                    encerrarOrdem: false,
                    descOrder: controller.parametros.ultimaOrdem === true ? controller.linhaAnterior.descOrder : "",
                    descTaref: "",
                    descTecnico: "",
                    grupo: false,
                    centroCusto: ""
                });

                angular.copy(controller.myGrid._data, controller.externalApps);

                $timeout(function() {
                	var rows = controller.myGrid.tbody[0];
                    var lengthRows = rows.children.length;
                    rows.children[lengthRows-1].cells[2].click();
                }, 100);
            }
        };

        controller.editCdTurno = function(container, options){
            var input = $("<input type='text' class='k-input k-textbox' maxlength='3' ng-blur='controller.changeCdTurno(dataItem)'>");
            input.attr('ng-model', 'cdTurno');
            input.attr('name', 'cdTurno');
            input.attr('data-bind', 'value:cdTurno');
            input.appendTo(container);
        };

        controller.changeCdTurno = function(dataItem){

            if (isNaN(dataItem.cdTurno) || dataItem.cdTurno === undefined) {
                dataItem.cdTurno = "";
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error',
                        title: $rootScope.i18n('l-attention'),
                        detail: $rootScope.i18n('msg-shift-valid-number')
                });
            }
        };

        controller.leaveHrIni = function(dataItem) {

            var strReplace = eval('/'+'_'+'/g');

            dataItem.horaInicio = dataItem.horaInicio.replace(strReplace,"");
            dataItem.horaInicio = dataItem.horaInicio.replace(":","");

            var i = dataItem.horaInicio.length;

            while(i < 4){
                dataItem.horaInicio = dataItem.horaInicio + "0";
                i++;
            }

            dataItem.horaInicio = $filter('timeMask')(dataItem.horaInicio);

            if (dataItem.horaInicio === "") {
                dataItem.horaInicio = "00:00";
            }
        };
        
        controller.leaveHrFim = function(dataItem) {

            var strReplace = eval('/'+'_'+'/g');

            dataItem.horaTermino = dataItem.horaTermino.replace(strReplace,"");
            dataItem.horaTermino = dataItem.horaTermino.replace(":","");

            var i = dataItem.horaTermino.length;

            while(i < 4){
                dataItem.horaTermino = dataItem.horaTermino + "0";
                i++;
            }

            dataItem.horaTermino = $filter('timeMask')(dataItem.horaTermino);

            if (dataItem.horaTermino === "") {
                dataItem.horaTermino = "00:00";
            }
        };

        controller.leaveHrNormal = function(dataItem) {

            if (dataItem.horaNormal === "") {
                dataItem.horaNormal = "0";
            } else {

                dataItem.horaNormal = dataItem.horaNormal.split(",").join(".");

                var charAux = dataItem.horaNormal.split(".");

                if (isNaN(dataItem.horaNormal)){
                            dataItem.horaNormal = "0";
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'error',
                                title: $rootScope.i18n('l-attention'),
                                detail: $rootScope.i18n('msg-time-valid-number')
                            });
                } else {
                    if (charAux.length == 1){
                        if (charAux[0].length > 3){
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'error',
                                title: $rootScope.i18n('l-attention'),
                                detail: $rootScope.i18n('msg-time-valid-number')
                            });
                            dataItem.horaNormal = "0";
                        }
                    } else if (charAux.length == 2) {
                        if (charAux[0].length > 3 || charAux[1].length > 4){
                            dataItem.horaNormal = "0";
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'error',
                                title: $rootScope.i18n('l-attention'),
                                detail: $rootScope.i18n('msg-time-valid-number')
                            });
                        }
                    }
                }
            }
        };

        controller.leaveHrExtra = function(dataItem) {
            if (dataItem.horaExtra === "") {
                dataItem.horaExtra = "0";
            } else {

                dataItem.horaExtra = dataItem.horaExtra.split(",").join(".");

                var charAux = dataItem.horaExtra.split(".");

				if (isNaN(dataItem.horaExtra)){
					dataItem.horaExtra = "0";
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error',
						title: $rootScope.i18n('l-attention'),
						detail: $rootScope.i18n('msg-time-valid-number')
					});
				} else {
					if (charAux.length == 1){
						if (charAux[0].length > 3){
							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'error',
								title: $rootScope.i18n('l-attention'),
								detail: $rootScope.i18n('msg-time-valid-number')
							});
							dataItem.horaExtra = "0";
						}
					} else if (charAux.length == 2) {
						if (charAux[0].length > 3 || charAux[1].length > 4){
							dataItem.horaExtra = "0";
							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'error',
								title: $rootScope.i18n('l-attention'),
								detail: $rootScope.i18n('msg-time-valid-number')
							});
						}
					}					
                }
            }
        };
        
        controller.validaTipoTecnico = function(column, dataItem) {
        	var index = controller.myGrid._data.indexOf(dataItem);
        	var cell = 0;
        	
        	if (dataItem.grupo) {
        		if (column === "horaInicio") {
        			cell = 10;
        		}
        	} else {
        		if (column === "horaNormal") {
        			cell = 12;
        		}
        	}
        	
        	if (cell > 0) {
	        	$timeout(function() {
	                var rows = controller.myGrid.tbody[0];
	                rows.children[index].cells[cell].click();
	            }, 10);
        	}
        }

        controller.showNotifications = function(dataItem) {

            var hasError = false;

            angular.forEach(controller.ttErro, function(notification) {

                if (notification.ErrorLinha == dataItem.linha) {

                    hasError = true;

                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: notification.ErrorSubType.toLowerCase(),
                        title: notification.ErrorDescription,
                        detail: notification.ErrorHelp
                    });
                }
            });
        };

        controller.onSave = function() {

            if (controller.isConsulta) { return; }

        	if (controller.externalApps.length >= 1) {
        		
                var params = {};
                params.estabCorrente = "*";
                params.AuxttPointingInformationVO = [];
                var iCont = 0;

				if(controller.ttErro == undefined){
					controller.ttErro = [];
				}

                controller.ttErro = $filter('filter')(controller.ttErro, function(a){
                     return a.ErrorSubType.toLowerCase() == 'success' || a.ErrorSubType != undefined 
                });

                var strReplace = eval('/'+'_'+'/g');
                
                angular.copy(controller.myGrid._data, controller.externalApps);

                angular.forEach(controller.externalApps, function(row) {

                    var totalHora  = parseFloat(row.horaNormal) + parseFloat(row.horaExtra);

                    iCont = iCont + 1;

                    row.horaInicio  = row.horaInicio.replace(strReplace,"");
                    row.horaTermino = row.horaTermino.replace(strReplace,"");
                    row.cdTecnico   = row.cdTecnico.replace("-","");

                    if (row.nrOrdProdu != 0 && row.logErro != 2 && row.logErro != 3){
                        params.AuxttPointingInformationVO.push({
                            taskCode: row.cdTarefa,
                            specialityType: row.especialidade,
                            technicalCode: row.cdTecnico,
                            transactionDate: new Date(row.dttrans),
    						initialHour: row.horaInicio,
    						finishHour: row.horaTermino,
    						normalHours: parseFloat(row.horaNormal),
    						extraHours: parseFloat(row.horaExtra),
                            percentConclusion: 0,
                            currentStatus: 1,
    						orderNumber: parseInt(row.nrOrdProdu),
                            turnCode: row.cdTurno,
                            reportDate: new Date().getTime(),
    						realTime: row.grupo === true ? totalHora : "0",
                            action: "1", //reporte=1; estorno=2
                            costCenter: row.centroCusto,
                            isFinished: row.encerrarTarefa,
                            pointingDuringInterval: !row.intervalo ? true : false,
    						isGroupTechnical: row.grupo,
                            sequence: 1,
                            subSystemCode: "",
                            narrativaTaref: row.narrativa,
                            isFinishedOrder: row.encerrarOrdem,
                            linha: iCont,
                            aceitePendente: controller.parametros.lAceitePendente,
                            tarefaPendente: controller.parametros.lTarefaPendente,
                            reqPendente: controller.parametros.lReqPendente,
                            ocPendente: controller.parametros.locPendente
                        });
                    } else {
                        if (row.nrOrdProdu == 0){

                            controller.externalApps[iCont-1].logErro = 1;

                            controller.ttErro.push({
                                ErrorLinha: iCont-1,
                                ErrorSubType: 'error',
                                ErrorDescription: $rootScope.i18n('l-attention'),
                                ErrorHelp: $rootScope.i18n('msg-maintenance-order-valid-number')
                            });
                        }
                    }
                });

                if (params.AuxttPointingInformationVO.length > 0){

                    fchmip0066.setLaborReportBatch(params, function(result) {

                        angular.forEach(controller.externalApps, function(row) {
                            if (row.nrOrdProdu && row.nrOrdProdu != 0 && row.logErro != 3){
                                row.logErro = 2;
                            }                                                    
                        });

                        if (controller.ttErro){
                            angular.forEach(controller.externalApps, function(r){
                                if(r.logErro != 3)
                                    controller.ttErro = $filter('filter')(controller.ttErro, function(a){ return a.ErrorLinha != r.linha }); 
                                else
                            controller.ttErro = $filter('filter')(controller.ttErro, function(a){ return a.ErrorSubType != 'success' && a.ErrorSubType != undefined });
                            });                                                       
                        }
                        else 
                          controller.ttErro = [];

                        angular.forEach(result.ttErroApontamentoLote, function(erro) {

                            controller.ttErro.push(erro);
                            erro.ErrorLinha = erro.ErrorLinha - 1;

                            controller.externalApps[erro.ErrorLinha].logErro = 1;
                        });

                        angular.forEach(result.ttErroEncerramentoLote, function(erro) {                                                    
                            controller.ttErro.push(erro);
                            erro.ErrorLinha = erro.ErrorLinha - 1;

                            controller.externalApps[erro.ErrorLinha].logErro = 3;

                        });

                        var i = 0;
                        do {
                            if (controller.externalApps[i].logErro != 1 && controller.externalApps[i].logErro != 3) {

                                controller.externalApps[i].logErro = 2;
                                if (controller.externalApps[i].encerrarOrdem){
                                    controller.ttErro.push({
                                        ErrorLinha: i,
                                        ErrorSubType: 'success',
                                        ErrorDescription: $rootScope.i18n('l-closing') + " " + $rootScope.i18n('l-requisition'),
                                        ErrorHelp: $rootScope.i18n('msg-requisition-closing-success')
                                    });
                                }

                                controller.ttErro.push({
                                    ErrorLinha: i,
                                    ErrorSubType: 'success',
                                    ErrorDescription: $rootScope.i18n('l-labor-report'),
                                    ErrorHelp: $rootScope.i18n('msg-labor-report-success')
                                });

                                controller.externalApps[i].linha = i;

                            } else if (controller.externalApps[i].logErro != 1 && controller.externalApps[i].logErro == 3){
                                controller.ttErro.push({
                                    ErrorLinha: i,
                                    ErrorSubType: 'success',
                                    ErrorDescription: $rootScope.i18n('l-labor-report'),
                                    ErrorHelp: $rootScope.i18n('msg-labor-report-success')
                                });
                                controller.externalApps[i].linha = i;
                            }else
                                controller.externalApps[i].linha = i;
                            
                            i++;
                        } while (i < controller.externalApps.length);
                    });
                }
        	}
        };


        controller.loadLaborTechnician = function(parametrosBusca){
            controller.isConsulta = true;

            var paramProgress = {
                'p-cd-tecnico' :!parametrosBusca.userTechnician ? "" :parametrosBusca.userTechnician.cdTecnico,
                'p-nr-ord' : !parametrosBusca['nr-ord-produ'] ? "0" :parametrosBusca['nr-ord-produ'],
                'dt-ini' : parametrosBusca.date.startDate,
                'dt-fim' :parametrosBusca.date.endDate
            } 

            fchmip0066.loadLaborTechnician(paramProgress, function(result){

                if (result) {
                    controller.myGrid._data = [];
                    controller.externalApps = [];

                    iCont = 0;
                    controller.ttErro = [];

                    angular.forEach(result, function (value) {

                        controller.ttErro.push({
                            ErrorLinha: iCont+1,
                            ErrorSubType: 'success',
                            ErrorDescription: $rootScope.i18n('l-labor-report'),
                            ErrorHelp: $rootScope.i18n('msg-labor-report-success')
                        });

                        controller.myGrid._data.push({
                            logErro: 2,
                            linha: iCont+1,
                            nrOrdProdu: value.orderNumber,
                            cdTarefa: value.taskCode,
                            cdTecnico: value.technicalCode.substring(0,5) + "-" + value.technicalCode.substring(5),
                            especialidade: value.specialityType,
                            cdTurno: value.turnCode,
                            dttrans: value.transactionDate,
                            horaTermino: value.finishHour.substring(0,5),
                            horaInicio: value.initialHour.substring(0,5),
                            horaNormal: value.normalHours.toFixed(4).replace(".", ","),
                            horaExtra: value.extraHours.toFixed(4).replace(".", ","),
                            intervalo: value.pointingDuringInterval,
                            encerrarTarefa: value.isFinished,
                            encerrarOrdem: value.finishedOrder,
                            descTecnico:value.technicalName,
                            descOrder: value.descOrdem,
                            descTaref: value.descTarefa,
                            narrativaTaref: value.observation,
                            centroCusto: value.costsCenter
                        }); 

                        iCont++;
                    });

                    angular.copy(controller.myGrid._data, controller.externalApps);

                    iCont = 2;

                    do{
                        controller.myGrid.columns[iCont].editable = false;

                        iCont = iCont + 1;
                    }while(iCont < 17); 

                    controller.sensitiveOff = true;
                    controller.myGrid.hideColumn(0);
                    controller.myGrid.hideColumn(1);
                }

            });				
        }

        controller.onClear = function(){

            if(controller.externalApps.length > 0 || controller.isConsulta == true){

                $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                    title: 'l-question',
                    text: $rootScope.i18n('msg-clear-report'),
                    cancelLabel: 'l-no',
                    confirmLabel: 'l-yes',
                    callback: function(isPositiveResult) {
                        if (isPositiveResult) {
                            controller.isConsulta    = false;
                            controller.externalApps  = [];
                            controller.myGrid._data  = [];
                            controller.ttErro        = [];
                            controller.linhaAnterior = {};
                            controller.disclaimers   = [];
                        }
                    }
                });
            }
        }

        controller.onRemove = function(dataItem){            
            var index = controller.myGrid._data.indexOf(dataItem);
            controller.myGrid._data.splice(index, 1);
            angular.copy(controller.myGrid._data, controller.externalApps);
            if(controller.ttErro){
                controller.ttErro = $filter('filter')(controller.ttErro, function(a){ return a.ErrorLinha != dataItem.linha });
            }
        }

        controller.gridOptions = function() {
            var deferred = $q.defer();
            deferred.resolve(opts);
            return deferred.promise;
        };

        controller.setParametros = function(){

            document.removeEventListener('keydown', controller.pressionaTecla);

            var modalInstance = $modal.open({
	            templateUrl: '/dts/mmi/html/laborreport/laborreport.param.html',
	            controller: 'mmi.laborreport.paramCtrl as paramCtrl',
	            size: 'md',
				backdrop: 'static',
                keyboard: true,
	            resolve: {
	            	model: function () {
	            		return controller.parametros;
	            	}
	            }
            });
            
            modalInstance.result.then(function(){

                document.addEventListener('keydown', controller.pressionaTecla);
 
                if (controller.parametros.informaCentroCusto === true){
                    controller.myGrid.showColumn(16);                   
                }
                else{                
                    controller.myGrid.hideColumn(16);                       
                }

                if (controller.externalApps.length < 1){
                    controller.onAdd();

                    $timeout(function(){
                        controller.myGrid._data = [];
                        controller.externalApps = [];
                    },100);
                }

                var parametros = {
                    "dataCode": "parametros",
                    "dataValue": JSON.stringify(controller.parametros)
                };

				$totvsprofile.remote.set("totvs.mmi.laborreport.params", parametros, function () {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success',
                        title: $rootScope.i18n('msg-parameters-saved')
                    });
                });
            });
        }

        controller.buscaApontamento = function(){

            document.removeEventListener('keydown', controller.pressionaTecla);

            var modalInstance = $modal.open({
	            templateUrl: '/dts/mmi/html/laborreport/laborreport.search.html',
                controller: 'mmi.laborreport.buscaCtrl as consultaCtrl',
                size: 'md',
				backdrop: 'static',
                keyboard: true,
	            resolve: {
	            	model: function () {
	            		return controller.paramAbertura;
	            	}
	            }
            });
            
            modalInstance.result.then(function(cancel){
                if (cancel !== 'cancel'){
                    controller.loadLaborTechnician(controller.paramAbertura);
                    controller.addDisclaimers();
                }
                document.addEventListener('keydown', controller.pressionaTecla);
            });
        }

	    controller.addDisclaimer = function(property, value, label) {
	        controller.disclaimers.push({
	            property: property,
	            value: value,
	            title: label,
	            fixed: true
	        });	     
	    }

	    controller.addDisclaimers = function() {
	        controller.disclaimers = [];
            
	        if (controller.paramAbertura.date){

		        if (controller.paramAbertura.date.startDate || controller.paramAbertura.date.endDate) {
		            var faixa = '0', deate = $rootScope.i18n('l-from-start');
		            if (controller.paramAbertura.date.startDate)  {
		                faixa = controller.paramAbertura.date.startDate;
		                deate = ' ' + $rootScope.i18n('l-from') + ' ' + $filter('date')(controller.paramAbertura.date.startDate, 'dd/MM/yyyy');
		            }
		            if (controller.paramAbertura.date.endDate) {
		                faixa = faixa + ';' + controller.paramAbertura.date.endDate;
		                deate = deate + ' ' + $rootScope.i18n('l-to') + ' ' + $filter('date')(controller.paramAbertura.date.endDate, 'dd/MM/yyyy');
		            } else {
		                faixa = faixa + ';ZZZZZZZZ';
		                deate = deate + ' ' + $rootScope.i18n('l-to-end');
		            }
		            controller.addDisclaimer('date', faixa, $rootScope.i18n('l-period') + deate);
		        }
	        }

	        if (controller.paramAbertura['nr-ord-produ'])
	            controller.addDisclaimer('nr-ord-produ', '*' + controller.paramAbertura['nr-ord-produ']  + '*', $rootScope.i18n('l-orderline-number') + ": " + controller.paramAbertura['nr-ord-produ']);

            if (controller.paramAbertura.userTechnician){
                var codTecnico = controller.paramAbertura.userTechnician.cdTecnico.substring(0,5) + "-" + controller.paramAbertura.userTechnician.cdTecnico.substring(5);
                controller.addDisclaimer('userTechnician', '*' + codTecnico  + '*', $rootScope.i18n('l-technician') + ": " + codTecnico);
            }
        }

        controller.pressionaTecla = function(event){
            if (event.keyCode == 40){
                $("button#addButton.btn.btn-primary.clickable").trigger('focus');
                $timeout(function(){
                    controller.onAdd();
                },10);
            }
        }

        document.addEventListener('keydown', controller.pressionaTecla);

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************
        controller.init = function() {
            controller.linhaAnterior = {};
            controller.isConsulta = false;
        	
            if (appViewService.startView($rootScope.i18n('l-labor-report'), 'mmi.laborreport.ListCtrl', controller)) {
            }

            controller.isChange = false;
            controller.isChangeInit = true;

            $totvsprofile.remote.get("totvs.mmi.laborreport.params", undefined, function (result) {
                if (result[0] != undefined) {
                    if (typeof(result[0].dataValue) === "object"){
                        angular.copy(result[0].dataValue, controller.parametros);
                    } else {
                        angular.copy(JSON.parse(result[0].dataValue), controller.parametros);
                    }

                    $timeout(function(){
                        if (controller.parametros.informaCentroCusto == false){
                            controller.myGrid.hideColumn(16);
                        }
                    },10);
                }
            });
        };

        if ($rootScope.currentuserLoaded) {
        	controller.init();
        };

    };

    index.register.controller('mmi.laborreport.ListCtrl', laborreportListController);
});
