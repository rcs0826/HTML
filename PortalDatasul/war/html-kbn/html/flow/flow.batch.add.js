    define(['index',
       '/dts/kbn/js/factories/mappingErp-factories.js'
], function (index) {

    modalFlowBatchAdd.$inject = ['$modal'];

    function modalFlowBatchAdd($modal) {
        this.open = function (params) {
            var instance = $modal.open({
                templateUrl: '/dts/kbn/html/flow/flow.batch.add.html',
                controller: 'ekanban.flow.batchadd.ctrl as controller',
                backdrop: 'static',
                resolve: {parameters: function(){ return params; }}
            });
            return instance.result;
        }
    }
    FlowBatchAddCtrl.$inject = [
        '$modalInstance',
        '$rootScope',
        'kbn.mappingErp.Factory',
        'parameters',
        'Upload',
        'TOTVSEvent'
    ];

    function FlowBatchAddCtrl($modalInstance, $rootScope, mappingErpFactory,parameters, Upload, TOTVSEvent) {

        var _self = this;

        _self.init = function(){
            _self.num_id_mapeamento = parameters.num_id_mapeamento;
            _self.dat_corte = parameters.dat_corte;
            _self.preListItems = [];
            _self.itemImput = {};
        };

        _self.addItem = function(){
            if (_self.itemImput.sku){
                if(_self.itemImput.refer == undefined) _self.itemImput.refer = '';
                _self.preListItems.push(_self.itemImput);
                _self.itemImput = {};
            }
            document.getElementById('controller_itemimput_sku').focus();
        };

        _self.uploadFiles = function($validFiles) {

            if($validFiles && $validFiles.length > 0) {
                _self.doUpload($validFiles);
            }

        };

        _self.doUpload = function(files) {

            if (files[0].type != "application/vnd.ms-excel"){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: $rootScope.i18n('l-import-error'),
                    detail: $rootScope.i18n('l-import-type')
                });

                return;
            }

            _self.barProgress = true;

            return Upload.upload({
                arrayKey: '',
                url: '/dts/datasul-rest/resources/api/fch/fchkb/fchkbmapping/importaItemMap',
                headers: {'noCountRequest': 'true'},
                file: files
            }).success(function (result, status, headers, config) {
                _self.barProgress = false;

                if(result.length > 0){
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type:   'info',
                        title:  $rootScope.i18n('l-import-success')
                    });

                    result.forEach(function(itemResult){
                        _self.preListItems.push(itemResult);
                    });
                }

            });
        };

        _self.removeItem = function(index){
            _self.preListItems.splice(index, 1);
        }

        _self.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        _self.save = function () {
            mappingErpFactory.createBatchFlowsAtMapping({
                num_id_mapeamento: _self.num_id_mapeamento,
                dat_corte: _self.dat_corte
            },_self.preListItems,function(){
                $modalInstance.close(this.values);
            })

        };

        _self.init();
    }

    index.register.controller('ekanban.flow.batchadd.ctrl', FlowBatchAddCtrl);
    index.register.service('ekanban.flow.batchadd.modal', modalFlowBatchAdd);
});
