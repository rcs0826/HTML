define([
	'index',
	'/dts/hub/js/hub-factories.js'
], function(index) {

	factoryHierarchyTeam.$inject = ['$totvsresource', '$cacheFactory', 'hub.generic.factory'];
	function factoryHierarchyTeam($totvsresource, $cacheFactory, factoryGeneric) {

		var cache = $cacheFactory('hub.hierarchyTeam.Cache');

		var factory = $totvsresource.REST(HUBURL.hierarchyTeamService + ':method/:id');

		factory.getAll = function(type, reportTo, callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'hierarchyteam-' + type + '-' + reportTo;

			var result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) callback(result);
			} else {
				return this.TOTVSQuery({'method': 'all', 'type': type, 'report_to': reportTo}, function(data) {
					cache.put(idCache, data);
					if (callback) callback(data);
				});
			}
		};

		factory.getHierarchy = function(hierarchyID, callback) {
			return this.TOTVSQuery({'method': 'hierarchy', 'hierarchy': hierarchyID}, function(data) {
				if (callback) callback(data);
			});
		};

		return factory;
	} // factoryHierarchyTeam

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('hub.hier_time.factory', factoryHierarchyTeam);
});
