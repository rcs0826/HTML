
define(['index', '/dts/kbn/js/factories/itemERP-factories.js'], function(index) {

	serviceItem.$inject = ['kbn.itemERP.Factory', '$rootScope', 'kbn.helper.Service'];

	function serviceItem(factoryItem, $rootScope, helperService) {
		var service = {
			zoomName: 'l-sold-items',
			pageNumber: 1,
			pageSize: 25,
			syncFields: [{erpField: 'it-codigo',
						   targetField: 'erpCode'},
						 {erpField: 'desc-item',
						   targetField: 'name'},
						 {erpField: 'cod-refer',
						   targetField: 'reference'},						 
						 {erpField: 'unid-med',
						   targetField: 'unitOfMeasure'},						 
						 {erpField: 'lote-minimo',
						   targetField: 'mininumLot'},
						 {erpField: 'lote-multipl',
						   targetField: 'multipleLot'},
						 {erpField: 'data-liberac',
						   targetField: 'start'},
						 {erpField: 'quant-segur',
						   targetField: 'securityStock'}
						],
	        propertyFields : [
				{label: $rootScope.i18n('l-sku', undefined, 'dts/kbn'), 
				 property: 'it-codigo', 
				 type: 'stringextend', 
				 maxlength: '16', 
				 default: true},
				{label: $rootScope.i18n('l-description', undefined, 'dts/kbn'), 
				 property: 'desc-item', 
				 type: 'stringextend', 
				 maxlength: '60'}
			],
			columnDefs : [
				{headerName: $rootScope.i18n('l-sku', undefined, 'dts/kbn'), field: 'it-codigo', width: 180, minWidth: 180},
				{headerName: $rootScope.i18n('l-reference', undefined, 'dts/kbn'), field: 'cod-refer', width: 160, minWidth: 160},
				{headerName: $rootScope.i18n('l-description', undefined, 'dts/kbn'), field: 'desc-item', width: 350, minWidth: 350},				
			],

			applyFilter: function (parameters) {

				var _self = this;
				_self.zoomResultList = [];

				var value = parameters.selectedFilterValue;

				var startAt = (parameters.more ? Math.abs((_self.zoomResultList.length / _self.pageSize) + 1) : 1);

				var filters = [{
						property: parameters.selectedFilter.property,
						value: value
					}];
			
				factoryItem.getItens({pageNumber: (_self.more ? Math.abs((_self.zoomResultList.length / this.pageSize) + 1) : 1),
									  pageSize: this.pageSize,
									  siteCode: parameters.init.estabErp,
									  'idi-tip-item': 5,
									  cutOffDate: parameters.init.cutOffDate,
									  zoomField: (value === undefined? '' : parameters.selectedFilter.property),
									  zoomValue: (value === undefined? '' : value)}, 
									  {},
									function (result) {
										if (result['ttItem'][0].$length) _self.resultTotal = result['ttItem'][0].$length;
										angular.forEach(result['ttItem'], function(singleRow)
														{
															_self.zoomResultList.push(singleRow);
														});
									});
			}
		};

		return service;

	}
    index.register.factory('kbn.itemERP.Zoom', serviceItem);
});