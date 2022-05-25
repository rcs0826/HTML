define([
		'index'
], function(index) {

	fieldsReportConfigService.$inject = ['$rootScope', '$modal'];
	function fieldsReportConfigService($rootScope, $modal){
		var service ={
			open: function(params){
				var instance = $modal.open({
						templateUrl: '/dts/mcc/html/fieldsreportconfig/fieldsreportconfig.html',
						controller: 'mcc.fieldsreportconfig.fieldsReportConfigCtrl as controller',
						backdrop: 'static',
						keyboard: false,
						size: 'md',
						resolve: {
							parameters: function (){ return params; }
						}
					});
				return instance.result;
			}
		};
		return service;
	}

	fieldsReportConfigController.$inject = ['$rootScope', '$modalInstance', 'parameters'];
	function fieldsReportConfigController($rootScope, $modalInstance, parameters){
		fieldsReportConfigControl = this;		
		fieldsReportConfigControl.model = [];
		fieldsReportConfigControl.printParams = {};
        fieldsReportConfigControl.columnsMode = false;


		fieldsReportConfigControl.init = function(){
            fieldsReportConfigControl.fields = parameters.fieldsReportConfig;
			fieldsReportConfigControl.printParams = parameters.printParams;
            fieldsReportConfigControl.columnsMode = parameters.columnsMode;
			
            if (fieldsReportConfigControl.fields) {
                for(var i = 0; i < fieldsReportConfigControl.fields.length; i++) {
                    fieldsReportConfigControl.model[fieldsReportConfigControl.fields[i].fieldName] = fieldsReportConfigControl.fields[i].fieldShow;
                }
            }
		}

		fieldsReportConfigControl.cancel = function(){
			$modalInstance.dismiss('cancel');
		}

		fieldsReportConfigControl.apply = function(){
			result = {};

            if (!fieldsReportConfigControl.columnsMode) {
                result.printParams = {"detailInstallments":fieldsReportConfigControl.printParams.detailInstallments};
            }

			for(var i =0; i<fieldsReportConfigControl.fields.length; i++){
				fieldsReportConfigControl.fields[i].fieldShow = fieldsReportConfigControl.model[fieldsReportConfigControl.fields[i].fieldName];
			}			
			result.fieldsReportConfig = fieldsReportConfigControl.fields;
			$modalInstance.close(result);
		}

		fieldsReportConfigControl.init();
	}

	// ########################################################
	// ### Registers
	// ########################################################
	index.register.factory('mcc.fieldsreportconfig.fieldsReportConfigService',fieldsReportConfigService);
	index.register.controller('mcc.fieldsreportconfig.fieldsReportConfigCtrl', fieldsReportConfigController);
});
