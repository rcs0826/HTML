define(['index',
		'/dts/mmi/js/dbo/bomn134.js',
		'/dts/mmi/js/dbo/bomn136.js',
		'/dts/mmi/js/dbo/bomn131.js',
		'/dts/mmi/js/dbo/bomn132.js',
		'/dts/mmi/js/dbo/bomn160.js',
		'/dts/mmi/html/order/task/task-list.js',
		'/dts/mmi/html/order/task/task-detail.js',
		'/dts/mmi/html/order/task/task-edit.js',
		'/dts/mmi/html/order/laborreport/laborreport-edit.js',
		'/dts/mce/js/zoom/usuar-mater.js',
        '/dts/mmi/html/order/specialty/specialty-list.js',
        '/dts/mmi/html/order/specialty/specialty-edit.js',
        '/dts/mmi/html/order/materials/materials-list.js',
        '/dts/mmi/html/order/shift/shift-list.js', 
        '/dts/mmi/html/order/materials/materials-edit.js',
        '/dts/mmi/html/order/epi/epi-list.js',
        '/dts/mmi/html/order/method/method-list.js',
        '/dts/mmi/html/order/tool/tool-list.js',
        '/dts/mmi/html/order/tool/tool-edit.js',
		'/dts/mmi/html/order/history/history-list.js',
		'/dts/mmi/html/order/task/tabs/task-report.js',
		'/dts/mmi/html/order/pert/pert-list.js',
		'/dts/mmi/html/order/task/tabs/task-history.js',
		'/dts/mmi/html/order/order-list.js'
	], function(index) {
	orderDetailingCtrl.$inject = [
		'$rootScope',
		'$scope',
		'$stateParams',
		'$location',
		'$filter',
		'mmi.bomn134.Service',
		'mmi.bomn136.Service',
		'mmi.bomn131.Service',
		'totvs.app-main-view.Service',
		'helperOrder',
		'TOTVSEvent',
	    'fchmip.fchmiporder.Factory',
	    'fchmip.fchmipparameter.Factory',
	    'helperHistory'
	];

	function orderDetailingCtrl(
		$rootScope,
		$scope,
		$stateParams,
		$location,
		$filter,
		bomn134Service,
		bomn136Service,
		bomn131Service,
		appViewService,
		helperOrder,
		TOTVSEvent,
		fchmiporderFactory,
		fchmipparameterFactory,
		helperHistory) {

		_self = this;
		detailOrderCtrl = this;
		
		_self.model = {};
		_self.orderNumber = 0;
		_self.listOfTasks = [];
		_self.showOrderDates = false;
		_self.showAccounting = false;
		_self.showOrderPlan = false;
		_self.showStopPlan = false;
		_self.showOriginMaintenance = false;
		_self.showOrderMoreInfo = false;
		_self.closeOthers = false;
	    _self.showTasks = true;
	    _self.showShift = false;
	    _self.showEpi = false;
	    _self.showMethod = false;
		_self.showOrderDetail = true;
		_self.siteCode;
	    _self.reloadSpecialty = false;
	    _self.reloadMaterials = false;
	    _self.reloadEpi = false;
	    _self.reloadTools = false;
	    _self.reloadShift = false;
	    _self.reloadMethod = false;
	    _self.reloadPert = false;
	    _self.reloadHistory = false;
		
		_self.init = function() {
			createTab = appViewService.startView($rootScope.i18n('l-detail-om'), 'mmi.orderdetailing.Ctrl', orderDetailingCtrl);
			helperOrder.data.showButton = false;
	        _self.doSearch($stateParams.id);
	    };

	    _self.load = function() {
	    	_self.model = helperOrder.data;
	    	_self.validateShift();
			_self.showOrderMoreInfo = _self.model['narrativa'] !== "";
			_self.listaAnexos = [];
	    	_self.downloadUrl = '/dts/datasul-rest/resources/api/fch/fchmip/fchmiporder/downloadFile?filename=' + _self.model["cod-docto-anexo"];
	    	_self.downloadUrl = _self.downloadUrl.split("+").join("%2B");
	    	_self.downloadUrl = _self.downloadUrl.split("#").join("%23");
			_self.downloadUrl = _self.downloadUrl.split("&").join("%26");
			self.usuarioLogado = $rootScope.currentuser.login;
			_self.buscarAnexos();
		};

		_self.buscarAnexos = function () {
			fchmiporderFactory.buscarAnexos(detailOrderCtrl.model['nr-ord-produ'], function (result) {
				if (result && result.length > 0) {
					_self.listaAnexos = result;
				}
			});
		}

	    _self.doSearch = function(id) {
	    	if (isNaN(id)) {
	    		_self.showOrderDetail = false;
	    		return;
	    	}
	    	
			var params = {
				startAt: 1,
				filtro: 1,
				nrOrdProdu: id
			};
	    	
	    	fchmiporderFactory.getListOrder(params, function(result) {
	    		if (result && result.ttOrdem) {
	    			if (result.ttOrdem.length > 0) {
	    				_self.showOrderDetail = true;
						helperOrder.data = result.ttOrdem[0];
						helperOrder.data.showButton = false;
			    		$rootScope.$broadcast('getListOrder');
			    		_self.load();
	    			} else {
	    				_self.showOrderDetail = false;
	    			}
	    		} 
	    	});
		};

		_self.loadOrderHistory = function () {
        	fchmiporderFactory.getOrderHistory(detailOrderCtrl.model['nr-ord-produ'], function(result) {

        		$scope.listOfHistory = helperHistory.data;
        		$scope.listOfHistory.length = 0; 
        			        		
        		if (result) {
                    angular.forEach(result, function (value) {
                    	value.data = $filter('date')(value.data, 'dd/MM/yyyy'),
                    	$scope.listOfHistory.push(value);
                    });
        		}
        	});

        	_self.load();
		};

	    _self.openOrderPlan = function() {
	    	_self.showOrderPlan = !_self.showOrderPlan;
	    };

	    _self.openOrderDates = function() {
	    	_self.showOrderDates = !_self.showOrderDates;
	    };

		_self.openAccounting = function() {
	    	_self.showAccounting = !_self.showAccounting;
	    };

	    _self.openStopPlan = function() {
	    	_self.showStopPlan = !_self.showStopPlan;
	    };

	    _self.openOriginMaintenance = function() {
	    	_self.showOriginMaintenance = !_self.showOriginMaintenance;
	    };

	    _self.openOrderMoreInfo = function() {
	    	_self.showOrderMoreInfo = !_self.showOrderMoreInfo;
	    };

		_self.validateShift = function() {
			fchmipparameterFactory.getIntParam("tp-turno", function(result) {
    			if (result.pFieldValue == 2) {
    				_self.showShift = true;
    			} else {
    				_self.showShift = false;
    			}
			});
		};

	    _self.redirectToDetail = function() {
	        $location.path('dts/mmi/order/detail/' + helperOrder.data['nr-ord-produ']);
	    };

	    _self.init();
	}

	index.register.service('helperHistory', function(){
		return {
			data: []
		};
	});

	index.register.controller('mmi.orderdetailing.Ctrl', orderDetailingCtrl);
	index.register.controller('mmi.order.TaskDetailCtrl', taskDetailCtrl);
	index.register.controller('mmi.order.LaborReportCtrl', laborReportCtrl);	
});
