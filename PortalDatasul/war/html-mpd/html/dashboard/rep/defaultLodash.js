define(['index',
		'/dts/dts-utils/js/lodash-angular.js'
		], function (index) {

/*************************************************************************************
Default Lodash é usado para somente para iniciar o html do portlet, e para separar o 
controller da tela e iniciar ele somente no html da tela.

**************************************************************************************/

	defaultLodashCtrl.$inject = [];

	function defaultLodashCtrl() {
		
		this.init = function () {};
	}

	index.register.controller('salesorder.dashboard.defaultLodash.Controller', defaultLodashCtrl);
});
