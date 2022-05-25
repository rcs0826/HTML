define(['index'], function (index) {

advancedSearchController.$inject = ['$rootScope', 
                                    '$scope', 
                                    '$modalInstance', 
                                    'i18nFilter', 
                                    'model'];

    function advancedSearchController($rootScope, 
                                      $scope, 
                                      $modalInstance, 
                                      i18n, 
                                      model) {
        var controller = this;    
        controller.model = JSON.parse(JSON.stringify(model));
        controller.managerialPeriods = [];
        controller.model.resultType = controller.model.resultType;
        controller.rsExibeOpt = [{value: 1, label: i18n('l-taxa-hora', [], 'dts/mcs'), disabled: false},
                                 {value: 2, label: i18n('l-total-ggf', [], 'dts/mcs'), disabled: false},
                                 {value: 3, label: i18n('l-horas-rep', [], 'dts/mcs'), disabled: false}];                                 

        controller.model.valueType = controller.model.valueType;
        controller.rsTipoValOpt = [{value: 1, label: i18n('l-total', [], 'dts/mcs'), disabled: false},
                                   {value: 2, label: i18n('l-forecasted', [], 'dts/mcs'), disabled: false},
                                   {value: 3, label: i18n('l-forecasted2', [], 'dts/mcs'), disabled: false},
                                   {value: 4, label: i18n('l-managerial', [], 'dts/mcs'), disabled: false}];

        controller.managerialPeriods.push({ id: 0, value: "Todos"});

        for (var i = 1; i < 13; i++) {   
            controller.managerialPeriods.push({ id: i, value: `${i}` });
        }        

        $scope.status = {
            isFirstOpen: true,
            open: true
        };


        controller.apply = function () {
            if ((controller.model.managerialPeriods.length == 0 && controller.model.valueType == 4) || (!controller.model.managerialYear && controller.model.valueType == 4)){
                controller.isInvalid = true;
                return;
            }
            if (controller.model.variation.start === undefined || controller.model.variation.start === "") {
                controller.model.variation.start = 0.0;
            } else {
                controller.model.variation.start = parseFloat(controller.model.variation.start.replace(",", "."));
            }
            if (controller.model.variation.end === undefined || controller.model.variation.end === "") {
                controller.model.variation.end = 0.0;
            } else {
                controller.model.variation.end = parseFloat(controller.model.variation.end.replace(",", "."));
            }
            
            $modalInstance.close(controller.model);
        }

        controller.cancel = function () {
            controller.isInvalid = false;
            $modalInstance.dismiss('cancel');
        }

        controller.changePeriod = function(){
            const period = controller.model.managerialPeriods.map(x => x.value)
            if (period.find(x => x == "Todos")){
                controller.model.managerialPeriods = controller.model.managerialPeriods.filter(x => x.value == "Todos");
            }
        }
    };

    index.register.controller('mcs.ggfbycostcenter.advancedsearch.controller', advancedSearchController);
});