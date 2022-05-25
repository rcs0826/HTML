define(['index',
        '/dts/kbn/js/helpers.js',
        '/dts/kbn/js/legend.js',
        '/dts/kbn/js/directives.js',
        '/dts/kbn/js/factories/structure-factories.js',
        '/dts/kbn/js/factories/mappingErp-factories.js',
        '/dts/kbn/js/time-cast.js'
], function (index) {

        modalCellItemEdit.$inject = ['$modal'];
        function modalCellItemEdit($modal) {
            this.open = function (params) {
                var instance = $modal.open({
                    templateUrl: '/dts/kbn/html/flow/flow.cell.item.edit.html',
                    controller: 'kbn.cell.item.edit.ctrl as controller',
                    backdrop: 'static',
                    keyboard: true,
                    size: 'lg',
                    resolve: { parameters: function () { return params; } }
                });
                return instance.result;
            };
        }

        cellItemEditCtrl.$inject = [
            'parameters',
            '$modalInstance',
            '$rootScope',
            'kbn.structure.Factory',
            'kbn.helper.Service',
            'messageHolder',
            'kbn.mappingErp.Factory',
            'TOTVSEvent',
            'kbn.timeCast.Service'
        ];
        function cellItemEditCtrl(
            parameters,
            $modalInstance,
            $rootScope,
            structureService,
            serviceHelper,
            messageHolder,
            factoryMappingErp,
            TOTVSEvent,
            timeCastService
        ) {

            var _self = this;
            _self.maxInt32OpenEdgeValue = (Math.pow(2, 32) / 2) - 1;
            _self.init = function(){

                _self.cell = {};

                var cellId = parameters.cellMember;
                var itemId = parameters.itemDetail;
                _self.mapping = parameters.mapping;
                _self.displaySubtitle = false;

                callback = function(result){
                    _self.cell = result[0];
                    calcCycleTime(_self.cell);
                    convertTime(_self.cell, timeCastService.milisecondsToHour);
                };

                var properties = {
                    properties: "num_id_cel",
                    values: cellId
                };

                if (itemId) {
                    properties.num_id_item_det = itemId;
                }

                factoryMappingErp.getFlowCell(properties, callback);
            };

            _self.convertItemTimeData = function(item, operation) {
                item.forEach(function(processFlow){
                    processFlow.kanbanCycleTime = operation(processFlow.kanbanCycleTime);
                    processFlow.vli_tempo_ciclo = operation(processFlow.vli_tempo_ciclo);
					processFlow.vli_tempo_setup = operation(processFlow.ttItemDetDs.ttMatrizSetupDs.vli_tempo_setup);
                    processFlow.ttItemDetDs.ttMatrizSetupDs.vli_tempo_setup = operation(processFlow.ttItemDetDs.ttMatrizSetupDs.vli_tempo_setup);
                });
            };

            var convertTime = function(cell, operation) {
                _self.convertItemTimeData(cell.ttProcessFlowDs,operation);

            };
            var calcCycleTime = function(cell) {
                cell.ttProcessFlowDs.forEach(function(processFlow){
                    processFlow.kanbanCycleTime = processFlow.ttItemDetDs.qti_tam_kanban * processFlow.vli_tempo_ciclo;
                });
            };

            _self.calckanbanCycleTime = function(processFlow){

                try{
                    tempo = timeCastService.hourToMiliseconds(processFlow.vli_tempo_ciclo);
                    processFlow.kanbanCycleTime = timeCastService.milisecondsToHour(tempo * processFlow.ttItemDetDs.qti_tam_kanban);
                }catch(e){
                    processFlow.kanbanCycleTime = "";
                }

                _self.markEdited(processFlow);
            };

            _self.markEdited = function(processFlow) {
                _self.displaySubtitle = true;
                if(!processFlow.edited) processFlow.edited = true;
            };

            _self.cancel = function(){
                $modalInstance.dismiss('cancel');
            };
            _self.isValidInt32Range = function(value)
            {
                var maximumPositive = _self.maxInt32OpenEdgeValue;
                var maximumNegative = maximumPositive * -1;
                return ((value >= maximumNegative && value <= maximumPositive) ? true : false);
            }
            _self.canPersistItemTime = function(item)
            {
                return (_self.isValidInt32Range(item.vli_tempo_ciclo)
                        &&
                        _self.isValidInt32Range(item.ttItemDetDs.ttMatrizSetupDs.vli_tempo_setup)
                        );
            }

            _self.save = function(){
                var cell = angular.copy(_self.cell);
                var itemsEdited = [];
                cell.ttProcessFlowDs.forEach(function(item){
                    if(item.edited) itemsEdited.push(item);
                });

                if(itemsEdited.length === 0) {
                    messageHolder.showMsg( $rootScope.i18n('l-warning'), $rootScope.i18n('l-not-edited') );
                    return;
                }

                cell.ttProcessFlowDs = angular.copy(itemsEdited);

                convertTime(cell, timeCastService.hourToMiliseconds);
                if(_self.canPersistItemTime(cell.ttProcessFlowDs[0]))
                {
                    factoryMappingErp.saveFlowCell({ ttCellDs: [cell]}, function(result) {
                        if(!result.$hasError) {
                            if(_self.mapping.idi_status==3){
                                messageHolder.showMsg( $rootScope.i18n('l-warning'), $rootScope.i18n('l-editing-published-mapping') );
                            }

                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type:   'sucess',
                                title:  $rootScope.i18n('l-cell-edit'),
                                detail: $rootScope.i18n('l-success-transaction')
                            });

                            $modalInstance.close(result);
                        }
                    });
                }
                else
                {
                    messageHolder.showNotify({
                        type: 'error',
                        title:
                            $rootScope.i18n('l-item-time-fields-max-value') +
                            ' ' +
                            $rootScope.i18n('l-the-max-value-is').replace(
                                '{0}',
                                timeCastService.milisecondsToHour(_self.maxInt32OpenEdgeValue)
                            )
                    });
                }
            };

            _self.init();

            }

        index.register.controller('kbn.cell.item.edit.ctrl', cellItemEditCtrl);
        index.register.service('kbn.cell.item.edit.modal', modalCellItemEdit);

    }
);
