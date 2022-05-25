define(['index',
        '/dts/kbn/js/helpers.js',
        '/dts/kbn/js/legend.js',
        '/dts/kbn/js/directives.js',
        '/dts/kbn/js/factories/structure-factories.js',
        '/dts/kbn/js/factories/workcenter-factories.js',
        '/dts/kbn/js/factories/mappingErp-factories.js',
        '/dts/kbn/js/time-cast.js',
        '/dts/kbn/js/zoom/ct-estab.js',
        '/dts/kbn/html/flow/flow.workcenter.edit.js',
        '/dts/kbn/js/factories/workcenter-zoom.js'
], function (index) {

        modalCellListEdit.$inject = ['$modal'];
        function modalCellListEdit($modal) {
            this.open = function (params) {
                var instance = $modal.open({
                    templateUrl: '/dts/kbn/html/flow/flow.celllist.edit.html',
                    controller: 'kbn.celllist.edit.ctrl as controller',
                    backdrop: 'static',
                    keyboard: true,
                    size: 'lg',
                    resolve: { parameters: function () { return params; } }
                });
                return instance.result;
            };
        }

        cellListEditCtrl.$inject = [
            'parameters',
            '$modalInstance',
            '$rootScope',
            'kbn.structure.Factory',
            'kbn.helper.Service',
            'messageHolder',
            'kbn.workcenter.Factory',
            'kbn.mappingErp.Factory',
            'TOTVSEvent',
            'kbn.timeCast.Service',
            'kbn.workcenter.edit.modal',
            'kbn.workcenter-zoom.Factory'
        ];
        function cellListEditCtrl(
            parameters,
            $modalInstance,
            $rootScope,
            structureService,
            serviceHelper,
            messageHolder,
            factoryWorkCenter,
            factoryMappingErp,
            TOTVSEvent,
            timeCastService,
            workcenterModal
        ) {

            var _self = this;
            _self.maxInt32OpenEdgeValue = (Math.pow(2, 32) / 2) - 1;
            _self.init = function(){

                _self.cell = {};

                var cellId = parameters.cellMember;
                var itemId = parameters.itemDetail;
                _self.log_ativo = parameters.log_ativo;
                _self.mapping = parameters.mapping;

                callback = function(result){
                    _self.cell = result[0];
                    convertTime(_self.cell, timeCastService.milisecondsToHour);
                };

                var properties = {
                    properties: "num_id_cel",
                    values: cellId
                };

                if (itemId) {
                    properties.num_id_item_det = itemId;
                }

                factoryMappingErp.getFlowCellEdit(properties, callback);
            };

            _self.convertCellTimeData = function(cell, operation) {
                cell.qtd_horiz = operation(cell.qtd_horiz);
                cell.qtd_faixa_fixa = operation(cell.qtd_faixa_fixa);
            };

            var convertTime = function(cell, operation) {
                _self.convertCellTimeData(cell,operation);
            };

            _self.loadWorkcenters = function () {
                factoryMappingErp.getCtFromCel({
                    "num_id_cel": _self.cell.num_id_cel
                }, {}, function(result){
                    _self.cell.ttMasterWorkcenterDs2 = result;
                    _self.init();
                });
            };

            _self.removeCt = function(obj){
                messageHolder.showQuestion(
                    $rootScope.i18n('l-remove-workcenters'),
                    $rootScope.i18n('msg-remove-workcenters-confirmation'),
                    function(answer){
                        if (answer === true) {
                            _self.doRemoveCt(obj);
                        }
                    }
                );
            };

            _self.doRemoveCt = function (idCtMestre){
                factoryMappingErp.deleteCtFromCel({
                    "num_id_cel":_self.cell.num_id_cel,
                    "num_id_ct_mestre": idCtMestre
                }, {},
                    function(result){
                        if(!result.$hasError){
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type:   'info',
                                title:  $rootScope.i18n('l-remove-workcenters'),
                                detail: $rootScope.i18n('l-success-transaction')
                            });
                        }
                        _self.loadWorkcenters();
                });
            };

            _self.regenCt = function(){
                messageHolder.showQuestion(
                    $rootScope.i18n('l-regen-workcenters'),
                    $rootScope.i18n('msg-regen-workcenters-confirmation'),
                    function(answer){
                        if (answer === true) {
                            _self.doRegenCt();
                        }
                    }
                );
            };

            _self.doRegenCt = function (){
                factoryMappingErp.regenWorkCenter({
                    "num_id_cel": _self.cell.num_id_cel,
                    "cod_estab_erp": _self.mapping.cod_estab_erp
                }, {}, function(result){
                    if(!result.$hasError){
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type:   'info',
                            title:  $rootScope.i18n('l-regen-workcenters'),
                            detail: $rootScope.i18n('l-success-transaction')
                        });
                    }
                    _self.loadWorkcenters();
                });
            };

            _self.cancel = function(){
                $modalInstance.dismiss('cancel');
            };

            _self.save = function(){
                var cell = angular.copy(_self.cell);
                convertTime(cell, timeCastService.hourToMiliseconds);                
                factoryMappingErp.saveFlowCellEdit({ ttCellDs: [cell]}, function(result) {
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
            };

            _self.retornoZoom = function(ctSelected, cell) {
                var cts = [];
                if(ctSelected.size) cts = ctSelected.objSelected
                else cts = [ctSelected];

                workcenterModal.open({
                    mapping: _self.mapping,
                    cell: cell,
                    ctSelected: cts
                }).then(function(result){
                    if(result){
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type:   'info',
                            title:  $rootScope.i18n('l-inserts-workcenters'),
                            detail: $rootScope.i18n('l-success-transaction'),
                        });
                    }
                    _self.loadWorkcenters();
                });
            };

            _self.init();
        }

        index.register.controller('kbn.celllist.edit.ctrl', cellListEditCtrl);
        index.register.service('kbn.celllist.edit.modal', modalCellListEdit);
    }
);
