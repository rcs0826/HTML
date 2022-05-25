/*global angular */
define([
	'index', 
	'totvs-html-framework', 
	'/dts/acr/js/acr-utils.js',
	'/dts/acr/js/api/inquirecustdocs.js',
	'/dts/acr/js/api/inquirerepdocs.js'
], function (index) {


	booleanI18N.$inject = ['$filter'];


	function booleanI18N($filter) {

		return function (sentence, param) {
			if (sentence) {
				return $filter('i18n')('l-yes');
			} else {
				return $filter('i18n')('l-no');
			}
		};
	}
	index.register.filter('booleanI18N', booleanI18N);

	startFrom.$inject = ['$filter'];

	function startFrom() {
		return function (input, start) {
			start = +start; //parse to int
			return input.slice(start);
		}
	}
	index.register.filter('startFrom', startFrom);

	acrUserDataFactory.$inject = ["$http", "$rootScope"];
	function acrUserDataFactory($http, $rootScope) {

		$http.get(
			'/dts/datasul-rest/resources/api/fch/fchacr/userpreference/preference/menu.defaultPage'
		).success(function (data) {
			if (!data) { return; }
			$rootScope.defaultPageHome = data.prefValue;
		});

		if ($rootScope.currentuser && $rootScope.currentuser.hasOwnProperty("user-entity"))
			return $rootScope.currentuser;

		if ($rootScope.currentuser && $rootScope.currentuser.then) {
			$rootScope.currentuser.then(function () {

				if ($rootScope.currentuser && $rootScope.currentuser.hasOwnProperty("user-entity"))
					return $rootScope.currentuser;
				$http.get("/dts/datasul-rest/resources/api/fch/fchacr/userpreference").then(function (result) {
					angular.extend($rootScope.currentuser, result.data[0]);
					return $rootScope.currentuser;
				});
			});

		} else {
			$http.get("/dts/datasul-rest/resources/api/fch/fchacr/userpreference").then(function (result) {
				angular.extend($rootScope.currentuser, result.data[0]);
				return $rootScope.currentuser;
			});
		}

		return $rootScope.currentuser;
	}
	index.register.factory('acr.getUserData.factory', acrUserDataFactory);


	genericController.$inject = ['$filter'];
	function genericController($filter) {
		return {

			max: 10,
			orderBy: [],
			asc: [],
			filterBy: [],

			findRecord: function (parameters, options, callback, instance) {

				var i, properties = [], values = [];

				if (parameters) {
					if (parameters instanceof Array) {
						for (i = 0; i < parameters.length; i++) {
							properties.push(parameters[i].property);
							values.push(parameters[i].value);
						}
					} else if (parameters.property) {
						properties.push(parameters.property);
						values.push(parameters.value);
					}
				}

				parameters = { properties: properties, values: values };

				options = options || {};

				if (!options.end) {
					options.end = 50;
				}

				if (!options.type) {
					options.type = 2;
				}

				if (options) {
					angular.extend(parameters, options); 
				}

				return instance.TOTVSQuery(parameters, function (result) {
					if (callback) {
						callback(result);
					}
				}, options.headers, options.cache);
			},

			decorate: function (controller, resource) {
				angular.extend(controller, this);
				controller.resource = resource;
			},

			clearDefaultData: function (lQuickSearch) {

				this.listResult = [];
				this.totalRecords = 0;
				this.isAdvancedSearch = false;

				if (!lQuickSearch || lQuickSearch == undefined) {
					this.quickSearchText = '';
				}
			},

			addFilter: function (property, value, label, labelValue) {

				if (!labelValue) {
					if (value == null || value === undefined) {
						labelValue = $filter('i18n')('l-not-supplied');
						value = null;
					} else {
						if (value instanceof Boolean) {
							if (value == true) {
								labelValue = $filter('i18n')('l-yes');
							} else {
								labelValue = $filter('i18n')('l-no');
							}
						}
						labelValue = value.toString();
					}
				}
				this.filterBy.push({
					property: property,
					label: label,
					value: value,
					title: labelValue
				});
			},

			removeFilter: function (filter) {
				var index = this.filterBy.indexOf(filter);
				if (index != -1) {
					this.filterBy.splice(index, 1);
				}
			},

			clearFilter: function () {
				this.filterBy = [];
			},

			processResultSearch: function (result) {
				if (this.listResult === undefined)
					this.listResult = [];

				var that = this;
				that.totalRecords = 0;
				angular.forEach(result, function (value) {
					if (value && value.$length)
						that.totalRecords = value.$length;

					that.listResult.push(value);

				});
			},

			
		};
	} index.register.factory('acr.generic.Controller', genericController);


	factoryMessage.$inject = ['$totvsresource'];
	function factoryMessage($totvsresource) {

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchacr/userpreference/messages/:page', { page: '@page' }, {});

		factory.getMessages = function (page, callback) {
			return this.TOTVSQuery({ page: page }, callback);
		};

		return factory;

	} // function factoryMessage ($totvsresource)
	index.register.factory('acr.message.Factory', factoryMessage);
	
});