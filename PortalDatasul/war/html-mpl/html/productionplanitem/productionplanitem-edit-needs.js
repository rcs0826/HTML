define(['index'], function(index) {
    
    /**
     * Controller Modal Necessidades
     */
    
    EditNeedsCtrl.$inject = ['$modalInstance',
                             '$rootScope',
                             '$filter',
                             'model',
                             'fchman.fchmanproductionplanitem.Factory',
                             'TOTVSEvent',
                             '$q'];
    
    function EditNeedsCtrl ($modalInstance,
                            $rootScope,
                            $filter,
                            model,
                            fchmanproductionplanitemFactory,
                            TOTVSEvent,
                            $q) {
        
        var controller = this;
        
        // recebe os dados de pesquisa atuais e coloca no controller
        this.model = model;
        this.isOpen = true;
        
        this.listNeed = [];  // array que mantem a lista de registros de necessidades
        this.saveNeedsDisabled = true;
        this.totalRecords = 0;
        this.planCode = controller.model.planCode;
        this.itemCode = controller.model.itemCode;
        this.itemDescription = controller.model.itemDescription;
        this.reference = controller.model.reference;
        this.siteCode = controller.model.siteCode;
        this.periodType = controller.model.periodType;
        
        this.radioDataPeriodo = 0;
        this.showAllFields = false;

        var hiddenColumns = [4, 5, 6]; // "shortName","customerGroup","customerRequest"
        
        /* Função....: onChangeDataPeriodo
           Descrição.: evento ng-change do radio data/periodo
           Parâmetros: state: 1 - Período/Ano, 2 - Data */
        this.onChangeDataPeriodo = function (state) {
            controller.radioDataPeriodo = state;
            
            // Esconde periodo, mostra data
            if (controller.radioDataPeriodo == "0") {
                controller.grid.hideColumn(1);
                controller.grid.showColumn(0);
            } else {
                controller.grid.hideColumn(0);
                controller.grid.showColumn(1);
            }
        };
        
        /* Função....: showAllFieldsFunction
           Descrição.: evento ng-change do checkbox todos os campos
           Parâmetros:  */
        this.showAllFieldsFunction = function () {

            hiddenColumns.forEach(function(col){
                if (controller.showAllFields) 
                    controller.grid.showColumn(col);
                else 
                    controller.grid.hideColumn(col);
            })
            
            if (!controller.model.isMultiSites) {
                controller.grid.hideColumn(2);
            }
        };
        
        /* Função....: addNeed
           Descrição.: adiciona uma linha no grid, com valores padrão
           Parâmetros:  */
        this.addNeed = function() {

            if (controller.gridData.length == 0) {

                controller.addGridRow("001/2000", new Date("01/01/2000").toLocaleDateString());

            } else {

                var fullPeriod = "";
                var year = "";
                var period = "";
                var date = "";
                
                var need = controller.gridData[controller.gridData.length - 1];
                fullPeriod = need['period'];
                period = parseInt(fullPeriod.split("/")[0]) + 1;
                period = ("00" + period).slice(-3);
                year = fullPeriod.split("/")[1];
                fullPeriod = period + "/" + year;
                
                var parameters = {
                    period: period,
                    year: year,
                    planType: controller.periodType,
                };

                // Retorna a data referente ao período informado
                fchmanproductionplanitemFactory.getDateOfPeriod(parameters, function(result) {
                    if (result && result[0]) {
                        
                        if (result[0].periodValue != -1 && result[0].yearValue != -1) {
                            controller.addGridRow(fullPeriod, new Date(result[0].dateValue).toLocaleDateString());
                        } else {
                            controller.addGridRow("001/2000", new Date("01/01/2000").toLocaleDateString());
                        }
                    }
                });
            }
        };

        this.addGridRow = function(period, date) {
            // adiciona uma linha vazia
            controller.gridData.push({period: period,
                                      date: date,
                                      siteCode: controller.siteCode,
                                      quantity: 0,
                                      reference: controller.reference,
                                      shortName: "",
                                      customerGroup: "0",
                                      customerRequest: "",
                                      sequence: 0,
                                      confirmQuantity: 0});

            controller.saveNeedsDisabled = false;
            controller.totalRecords++;
        };
        
        /* Função....: removeNeed
           Descrição.: remove uma linha no grid de acordo com a linha selecionada
           Parâmetros:  */
        this.removeNeed = function() {
            
            // se tiver uma necessidade selecionada no grid
            if (controller.selectedItems.length > 0 && controller.gridData) {
                controller.saveNeedsDisabled = false;
                
                controller.selectedItems.forEach(function(selectedItem) {
                    for (let i = 0; i < controller.gridData.length; i++) {
                        const gridItem = controller.gridData[i];
                        if (selectedItem.confirmQuantity == gridItem.confirmQuantity &&
                            selectedItem.customerGroup == gridItem.customerGroup &&
                            selectedItem.customerRequest == gridItem.customerRequest &&
                            selectedItem.date == gridItem.date &&
                            selectedItem.period == gridItem.period &&
                            selectedItem.quantity == gridItem.quantity &&
                            selectedItem.reference == gridItem.reference &&
                            selectedItem.sequence == gridItem.sequence &&
                            selectedItem.shortName == gridItem.shortName &&
                            selectedItem.siteCode == gridItem.siteCode) {

                            controller.gridData.splice(i, 1);
                            controller.totalRecords--;
                        }
                    }
                });
            };
        };
        
        /* Função....: saveNeeds
           Descrição.: salva as necessidades do grid
           Parâmetros:  */
        this.saveNeeds = function() {
            
            var ttProductionPlanItemVO = [];
            var ttProductionPlanItemVOAux = [];
            
            if (controller.gridData.length == 0) {
                var parameters = {
                    productionPlanCode: controller.planCode,
                    itemCode: controller.itemCode,
                    reference: controller.reference,
                    siteCode: controller.siteCode
                };

                // chama o metodo de remover registro do service
                fchmanproductionplanitemFactory.removeProductionPlanItem(parameters, function(result) {
                    if (!result['$hasError']) {
                        // notifica o usuario que o registro foi removido
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'success', // tipo de notificação
                            title: $rootScope.i18n('msg-needs-deleted'),
                            detail: $rootScope.i18n('msg-needs-removed')
                        });

                        // fecha a janela
                        $modalInstance.close();
                    }
                });
            } else {
                angular.forEach(controller.gridData, function(value) {                                      
                    var data = new Date(value.date.split("/")[1] + "/" + value.date.split("/")[0] + "/" + value.date.split("/")[2]).getTime();
                    
                    ttProductionPlanItemVOAux.push({date: data,
                                                    quantity: parseFloat(value.quantity),
                                                    reference: controller.reference,
                                                    shortName: value.shortName,
                                                    customerGroup: value.customerGroup,
                                                    customerRequest: value.customerRequest,
                                                    sequence: value.sequence,
                                                    confirmQuantity: parseFloat(value.confirmQuantity),
                                                    period: parseInt(value.period.split("/")[0]),
                                                    source: "",
                                                    structureNumber: "",
                                                    deliveryNumber: "",
                                                    itemCode: controller.itemCode,
                                                    componentListCode: "",
                                                    siteCode: value.siteCode,
                                                    planCode: controller.planCode,
                                                    year: parseInt(value.period.split("/")[1]),
                                                    unitOfMeasureDescription: "",
                                                    isSelected: "",
                                                    periodString: value.period,
                                                    periodType: controller.periodType,
                                                    itemDescription: controller.itemDescription,
                                                    hasReference: false});
                });

                var canFind = false;

                for (var i = 0, len = ttProductionPlanItemVOAux.length; i < len; i++) {
                    canFind = false;

                    for (var j = 0, lenJ = ttProductionPlanItemVO.length; j < lenJ; j++) {
                        if ((ttProductionPlanItemVOAux[i].planCode == ttProductionPlanItemVO[j].planCode) &&
                            (ttProductionPlanItemVOAux[i].itemCode == ttProductionPlanItemVO[j].itemCode) &&
                            (ttProductionPlanItemVOAux[i].siteCode == ttProductionPlanItemVO[j].siteCode) &&
                            (ttProductionPlanItemVOAux[i].reference == ttProductionPlanItemVO[j].reference) &&
                            (ttProductionPlanItemVOAux[i].period == ttProductionPlanItemVO[j].period) &&
                            (ttProductionPlanItemVOAux[i].year == ttProductionPlanItemVO[j].year) &&
                            (ttProductionPlanItemVOAux[i].shortName == ttProductionPlanItemVO[j].shortName) &&
                            (ttProductionPlanItemVOAux[i].customerGroup == ttProductionPlanItemVO[j].customerGroup) &&
                            (ttProductionPlanItemVOAux[i].customerRequest == ttProductionPlanItemVO[j].customerRequest) &&
                            (ttProductionPlanItemVOAux[i].sequence == ttProductionPlanItemVO[j].sequence)) {

                            canFind = true;
                            ttProductionPlanItemVO[j].quantity += ttProductionPlanItemVOAux[i].quantity;
                            break;
                        }
                    }

                    if (!canFind) {
                        ttProductionPlanItemVO.push(ttProductionPlanItemVOAux[i]);
                    }
                }

                var parameters = {productionPlanCode: controller.planCode,
                                  ttProductionPlanItemVO: ttProductionPlanItemVO,
                                  isImport: false,
                                  isOverride: true,
                                  importType: controller.radioDataPeriodo};

                fchmanproductionplanitemFactory.setProductionPlanItemNeeds(parameters, function(result) {
                    if (!result['$hasError']) {
                        controller.saveNeedsDisabled = true;
                        // notifica o usuario que o registro foi removido
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'success', // tipo de notificação
                            title: $rootScope.i18n('msg-needs-saved'), // titulo da notificação
                            detail: $rootScope.i18n('msg-success-save-needs') // detalhe da notificação
                        });

                        // fecha a janela
                        $modalInstance.close();
                    };
                });
            }
        };
        
        /* Função....: dataNotSaved
           Descrição.: informa o usuário que existem informações não salvas,
                       questiona se deseja continuar
           Parâmetros:  */
        this.dataNotSaved = function() {
            // envia um evento para perguntar ao usuário
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'msg-question-data-not-saved',                 // titulo da mensagem
                text: $rootScope.i18n('msg-confirm-data-not-saved'),  // texto da mensagem
                cancelLabel: 'l-no',                                  // label do botão cancelar
                confirmLabel: 'l-yes',                                // label do botão confirmar
                callback: function(isPositiveResult) {                // função de retorno
                    if (isPositiveResult) { // se foi clicado o botão confirmar
                        $modalInstance.dismiss();
                        
                        return isPositiveResult;
                    }
                }
            });
        };
        
        /* Função....: formatPeriod
           Descrição.: formata o campo de período no formato "PPP/AAAA"
           Parâmetros: params - objeto com os valores da celula selecionada */
        this.formatPeriod = function (params) {
            var fullPeriod = params.data.period;
            var period = fullPeriod.split("/")[0];
            var year = fullPeriod.split("/")[1];
            period = parseInt(fullPeriod.split("/")[0]);
            period = ("00" + period).slice(-3);
            year = fullPeriod.split("/")[1];
            fullPeriod = period + "/" + year;

            if (!period || !year) {
                return "000/0000";
            } else {
                return fullPeriod;
            }
        };
        
        /* Função....: getDateOfPeriod
           Descrição.: busca a data do período
           Parâmetros: params - objeto com os valores da celula selecionada */
        this.getDateOfPeriod = function (data) {
            
            if (!data.period || data.period == "") {
                data.period = "001/1990";
            }
            
            var period = data.period.split("/")[0];
            var year = data.period.split("/")[1];
            
            if (isNaN(period)) {
                period = "001";
            }
            
            if (isNaN(year)) {
                year = "1990";
            }
            
            var parameters = {
                period: period,
                year: year,
                planType: controller.periodType,
            };

            // Retorna a data referente ao período informado
            fchmanproductionplanitemFactory.getDateOfPeriod(parameters, function(result) {
                if (result && result[0]) {
                    if (result[0].periodValue != -1 && result[0].yearValue != -1) {
                        for (var i = 0, len = controller.gridData.length; i < len; i++) {
                            if (controller.gridData[i] == data) {
                                controller.gridData[i].date = result[0].dateValue;
                                break;
                            }
                        }
                    } else {
                        // Se não encontrar um período, busca o período da data
                        var parameters = {
                            date: data.date,
                        };

                        // Retorna o período referente a data informada
                        fchmanproductionplanitemFactory.getPeriodOfDate(controller.periodType, parameters, function(result){
                            if (result && result[0]) {
                                if (result[0].periodValue != -1 && result[0].yearValue != -1) {
                                    for (var i = 0, len = controller.gridData.length; i < len; i++) {
                                        if (controller.gridData[i] == data) {
                                            controller.gridData[i].date = result[0].finalDateValue;
                                            controller.gridData[i].period = result[0].periodValue + "/" + result[0].yearValue;
                                            break;
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
            });
        };
        
        /* Função....: getPeriodOfDate
           Descrição.: busca o período da data
           Parâmetros: params - objeto com os valores da celula selecionada */
        this.getPeriodOfDate = function (data) {
            
            if (!data.date || data.date == "") {
                data.date = "01/01/1990";
            }
            
            var newDate = new Date(data.date.split("/")[1] + "/" + data.date.split("/")[0] + "/" + data.date.split("/")[2]).getTime();
            
            if (isNaN(newDate)) {
                newDate = new Date("01/01/1990").getTime();
            }
            
            var parameters = {
                date: newDate,
            };
            
            // Retorna o período referente a data informada
            fchmanproductionplanitemFactory.getPeriodOfDate(controller.periodType, parameters, function(result){
                if (result && result[0]) {
                    if (result[0].periodValue != -1 && result[0].yearValue != -1) {
                        for (var i = 0, len = controller.gridData.length; i < len; i++) {
                            if (controller.gridData[i] == data) {
                                controller.gridData[i].date = result[0].finalDateValue;
                                controller.gridData[i].period = result[0].periodValue + "/" + result[0].yearValue;
                                break;
                            }
                        }
                    }
                }
            });
        };
        
        /* Função....: loadData
           Descrição.: Métotodo que faz a busca de dados para alimentar a grid
           Parâmetros:  */
        this.loadData = function() {
            
            controller.listNeed = [];
            controller.totalRecords = 0;
            var parameters = {
                productionPlanCode: controller.planCode,
                itemCode: controller.itemCode,
                reference: controller.reference,
                siteCode: controller.siteCode
            };
            fchmanproductionplanitemFactory.getProductionPlanItemNeedsReference(parameters, function(result){
                if (result) {
                    
                    controller.gridData = [];
                    controller.totalRecords = result.length;
                    
                    // para cada item do result
                    angular.forEach(result, function (value) {
                        // adicionar o item na lista de resultado

                        controller.listNeed.push({period: value.period,
                                                  year: value.year,
                                                  quantity: value.quantity,
                                                  confirmQuantity: value.confirmQuantity});
                        
                        // atualiza o grid de necessidades
                        controller.gridData.push({period: value.period + "/" + value.year,
                                                  date: new Date(value.date).toLocaleDateString(),
                                                  siteCode: value.siteCode,
                                                  quantity: value.quantity,
                                                  reference: value.reference,
                                                  shortName: value.shortName,
                                                  customerGroup: value.customerGroup,
                                                  customerRequest: value.customerRequest,
                                                  sequence: value.sequence,
                                                  confirmQuantity: value.confirmQuantity});
                    });
                    
                    controller.onChangeDataPeriodo(controller.radioDataPeriodo);
                    controller.showAllFieldsFunction();
                };
            });
        };
        
        //
        this.gridOptions = function () {
  
            // simulando delay de 2 segundos e retornando um promise
            var deferred = $q.defer();
       
            setTimeout(function () {
                deferred.resolve({
                    rowData: controller.loadData(),
                    sortable: true,
                    resizable: true,
                    navigatable: true
                });
            }, 0);
       
            return deferred.promise;
         }
        
        
        /**
         * Fim da Definição dos Grids
         */
        
        
        /* Função....: save
           Descrição.: ação de clicar no botão salvar
           Parâmetros:  */
        this.save = function () {
            controller.saveNeeds();
        };
        
        /* Função....: close
           Descrição.: ação de clicar no botão fechar
           Parâmetros:  */
        this.close = function () {
            if (!controller.saveNeedsDisabled) {
                controller.dataNotSaved();
            } else {
                // dismiss é o fechamento quando cancela ou quando clicar fora do modal (ESC)
                $modalInstance.dismiss();
            }
        };
    };
    
    index.register.controller('mpl.productionplanitem.EditNeedsCtrl', EditNeedsCtrl);
    
});