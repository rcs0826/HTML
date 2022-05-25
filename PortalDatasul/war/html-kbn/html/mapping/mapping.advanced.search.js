define([
	'index',
	'/dts/kbn/js/factories/mappingErp-factories.js'
], function (index) {

	modalMappingAdvancedSearch.$inject = ['$modal'];
	function modalMappingAdvancedSearch($modal) {

		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/kbn/html/mapping/mapping.advanced.search.html',
				controller: 'ekanban.mapping.advanced.search.ctrl as controller',
				backdrop: 'static',
				keyboard: false,
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	}

	mappingAdvancedSearchCtrl.$inject = ['$modalInstance', '$rootScope', '$filter', 'parameters'];
	function mappingAdvancedSearchCtrl($modalInstance, $rootScope, $filter, callerParams) {

		var _self = this;

		_self.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
		callerParams.disclaimers.forEach(function(single)
		{
			if (single.property == 'cod_estab_erp')
			{
				_self.establishmentErpCode = single.value;
			}
			if (single.property == 'dat_publicacao')
			{
				_self.publicationDate = single.value;
			}

		})
		_self.apply = function() {
			var filtros = [];

			if (_self.establishmentErpCode && _self.establishmentErpCode !== "") {
				filtros.push({
					property: 'cod_estab_erp',
					title: $rootScope.i18n('l-site') + ": " + _self.establishmentErpCode,
					value: _self.establishmentErpCode
				});
			}

			if (_self.publicationDate && _self.publicationDate !== "") {
				filtros.push({
					property: 'dat_publicacao',
					title: $rootScope.i18n('l-publication-date') + ': ' + $filter('date')(_self.publicationDate, 'shortDate'),
					value: _self.publicationDate
				});
			}
			$modalInstance.close(filtros);
		};
	}

	index.register.controller('ekanban.mapping.advanced.search.ctrl', mappingAdvancedSearchCtrl);
	index.register.service('ekanban.mapping.advanced.search.modal', modalMappingAdvancedSearch);
});
