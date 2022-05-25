
define(['index'], function (index) {

	filtersService.$inject = [];
	function filtersService(){

		var myControl = this;

		myControl.filters = {};

		myControl.verifyIfValid = function() {
			if(myControl.filters === undefined)
			{
				myControl.filters = {};
			}
		};

		myControl.initializeProperty = function(key) {
			myControl.verifyIfValid();
			if(myControl.filters[key] === undefined){
				myControl.filters[key] = [];
			}
		};

		myControl.set = function(obj) {
			myControl.verifyIfValid();
			angular.forEach(obj,function(value,key){
				myControl.filters[key] = value;
			});
		};

		myControl.get = function(key) {
			myControl.initializeProperty(key);
			return myControl.filters[key];
		};

		myControl.removeFilter = function(key,property) {
			myControl.initializeProperty(key);

			for(i=0; i<myControl.filters[key].length; i++){
				if(myControl.filters[key][i].property == property){
					myControl.filters[key].splice(i, 1);
					break;
				}
			}
		};

		myControl.clearFilters = function(key) {
			myControl.initializeProperty(key);

			myControl.filters[key] = [];
		};

		myControl.getFilter = function(key,property) {
			myControl.initializeProperty(key);

			for(i=0; i<myControl.filters[key].length; i++){
				if(myControl.filters[key][i].property == property){
					return myControl.filters[key][i];
				}
			}

			return false;
		};

		myControl.addFilter = function(key,obj) {
			myControl.initializeProperty(key);

			if(typeof(obj.property) == "undefined"){
				throw "[kbn/filters-services.js] Erro property do filtro nao enviado";
				return;
			}

			if(typeof(obj.restriction) == "undefined"){
				obj.restriction = "EQUALS";
			}

			myControl.removeFilter(key,obj.property);
			myControl.filters[key].push(obj);
		};

		myControl.inheritSoftFilterProperties = function(filtersApplied, quickFilters) {
			filtersApplied.forEach(function(filter) {
				var sFilter = quickFilters.filter(function(soft) {
					return soft.property == filter.property && soft.value == filter.value;
				});
				if(sFilter.length > 0) {
					filter.softFilter = sFilter[0].softFilter;
					filter.softFilterBehavior = sFilter[0].softFilterBehavior;
				}
			});
		};

		return myControl;
	}

	index.register.service('kbn.filters.service', filtersService);
});
