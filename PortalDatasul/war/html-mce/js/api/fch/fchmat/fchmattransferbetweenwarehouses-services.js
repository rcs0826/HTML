define(['index'], function(index) {


	transferBetweenWarehouseFactory.$inject = ['$totvsresource'];

	function transferBetweenWarehouseFactory($totvsresource) {

		var specificResources = {
			setDefaultsTransfer: {
				method: 'POST',
				isArray: false,
				params: {
					method: 'setDefaultsTransfer'
				}
			},
			initializeInterface: {
				method: 'GET',
				isArray: false,
				params: {
					method: 'initializeInterface'
				}
			},
			createTransfer:
			{
				method: 'POST',
				isArray: false,
				params: {
					method: 'createTransfer'
				}
			}
		};

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmat/fchmattransferbetweenwarehousesHTML/:method/', {},
			specificResources);
		return factory;

	};

	index.register.factory('mce.transferBetweenWarehouse.Factory', transferBetweenWarehouseFactory);


});