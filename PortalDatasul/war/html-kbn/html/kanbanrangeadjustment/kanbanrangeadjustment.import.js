define(['index',
    	'ng-load!ui-file-upload',
        '/dts/kbn/js/factories/mappingErp-factories.js',
        '/dts/kbn/js/factories/kbn-factories.js',
        '/dts/kbn/js/directives.js'
], function(index) {

    controllerKanbanRangeAdjustmentImport.$inject = [
        '$scope',
        'kbn.data.Factory',
        '$rootScope',
        'kbn.mappingErp.Factory',
        'totvs.app-main-view.Service',
		'Upload',
        '$window'
    ];
    function controllerKanbanRangeAdjustmentImport($scope, dataFactory, $rootScope, mappingErpFactory, appViewService, Upload, $window) {
        var _self = this;
        _self.isMappingPublished = false;

        _self.init = function() {
            createTab = appViewService.startView($rootScope.i18n('l-recalculation-stack-kanban'), 'ekanban.kanbanrangeadjustment.ImportCtrl', controllerKanbanRangeAdjustmentImport);

            _self.establishment = dataFactory.getEstablishment();
        };
		_self.uploadFiles = function($validFiles)
		{
			if($validFiles && $validFiles.length > 0)
			{
				_self.files = $validFiles;
				_self.filePath = $validFiles[0].name;
				_self.doUpload();
			}
		};
        _self.exportarItens = function(){
            if(_self.isMappingPublished){
                $window.open("/dts/datasul-rest/resources/api/fch/fchkb/fchkbmapping/downloadCsv?cod_estab_erp=" + _self.establishmentCode);
            }
        };
        _self.importItens = function(){
            if(_self.isMappingPublished){
                document.getElementById('file-input').click();
            }
        }        
        _self.establishmentChanged = function(value, oldValue) {
            _self.establishment = value;
            
            mappingErpFactory.mapping({properties: ["num_id_estab","idi_status"],values: [_self.establishment,3]}, function(result){
                if(result.length == 1){
				    _self.isMappingPublished = true;
                    _self.establishmentCode = result[0].cod_estab_erp;
                } else {
                    _self.isMappingPublished = false;
                    _self.establishmentCode = undefined;
                }
			});
            
        };
		_self.doUpload = function()
		{
      _self.barProgress = true;
			return Upload.upload({

                arrayKey: '', 
				url: '/dts/datasul-rest/resources/api/fch/fchkb/fchkbmapping/uploadCsv?estab=' + _self.establishmentCode,
				headers: {'noCountRequest': 'true'},
				file: _self.files

			}).success(function (result, status, headers, config) {
        _self.barProgress = false;
				if(result.length > 0)
				{
					dataFactory.set('kanbanRangeSimulation', JSON.stringify(result));
					window.location = "#/dts/kbn/kanbanrangeadjustment/simulation";
				}
			});
		};
        _self.init();
    }

    index.register.controller('ekanban.kanbanrangeadjustment.ImportCtrl', controllerKanbanRangeAdjustmentImport);
});