define(['index',
        '/dts/kbn/js/factories/workcenter-zoom.js'
], function (index) {

    modalWorkcenterEdit.$inject = ['$modal'];
        function modalWorkcenterEdit($modal) {
            this.open = function (params) {
                var instance = $modal.open({
                    templateUrl: '/dts/kbn/html/flow/flow.workcenter.edit.html',
                    controller: 'kbn.workcenter.edit.ctrl as controller',
                    backdrop: 'static',
                    keyboard: true,
                    size: 'lg',
                    resolve: { parameters: function () { return params; } }
                });
                return instance.result;
            };
        }

        workcenterEditCtrl.$inject = [
            'parameters',
            '$modalInstance',
            'kbn.workcenter-zoom.Factory'
        ];
        function workcenterEditCtrl(
            parameters,
            $modalInstance,
            factoryZoomWorkcenter
        ) {

            var _self = this;

            _self.init = function(){
                _self.mapping = parameters.mapping;
                _self.cell = parameters.cell;
                _self.workcenters = parameters.ctSelected;
                _self.linked = false;

                _self.workcenters.forEach(function(workcenter){
                    if(workcenter.linked) _self.linked = true;
                });

                $modalInstance.close(true);
            };

            _self.confirm = function(){
                factoryZoomWorkcenter.transferCentroTrabalho({num_id_cel: _self.cell.num_id_cel, num_id_mapeamento: _self.mapping.num_id_mapeamento}, _self.workcenters, 
                    function(result){
                        if(result.$hasError) $modalInstance.close(false);
                        else $modalInstance.close(true);
                    });
            }

            _self.cancel = function(){
                $modalInstance.dismiss('cancel');
            };

            _self.init();
        }

        index.register.controller('kbn.workcenter.edit.ctrl', workcenterEditCtrl);
        index.register.service('kbn.workcenter.edit.modal', modalWorkcenterEdit);
    }
);
