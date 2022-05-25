/* global angular */
define(['index',
	'/dts/hgp/html/hvp-updateIndexAdjustment/updateIndexAdjustmentFactory.js',
	'/dts/hgp/html/hvp-contractingparty/contractingPartyFactory.js'],
	function (index) {

		contractingPartyZoomController.$inject = ['$injector', 'healthcare.hvp.updateindexadjustment.factory', 'hvp.contractingparty.Factory'];

		function contractingPartyZoomController($injector, updateIndexAdjustmentFactory, contractingPartyFactory) {

			var _self = this;

			this.zoomResultList = [];
			this.resultTotal = 0;
			this.zoomName = 'Contratantes';

			this.propertyFields = [
				{ label: 'Código', property: 'cdContratante' },
				{ label: 'Nome', property: 'nmContratante', default: true }];

			this.tableHeader = [
				{ label: 'Código', property: 'cdContratante' },
				{ label: 'Nome', property: 'nmContratante' }];

			this.returnValue = function () {

				var contractingPartySelected = this.zoomResultList[this.selected];

				return contractingPartySelected['cdContratante'] + ' - ' + contractingPartySelected['nmContratante'];
			};

			this.getObjectFromValue = function (value) {

				for (var i = 0; i < this.zoomResultList.length; i++) {

					if (this.zoomResultList[i].id == value) {
						return this.zoomResultList[i];
					}
				}

				return null;
			};

			this.applyFilter = function (parameters) {

				if (parameters.more == true) {

					parameters.init = this.zoomResultList.length;
				} else {

					this.zoomResultList.splice(0, this.zoomResultList.length);
					parameters.init = 0;
				}

				var controller = this;
				
				contractingPartyFactory.getContractingPartyByFilter(
					'', 
					parameters.init, 
					100,
					[{property: parameters.selectedFilter.property, 
						value: parameters.selectedFilterValue}], 
					function(result) {
						
						this.zoomResultList = [];
						
					if (result) {

						angular.forEach(result, function (value) {

							if (value && value.$length) {
								controller.resultTotal = value.$length;
							}

							_self.zoomResultList.push(value);
						});
					}
				});
			}

			return this;
		}

		index.register.factory('hvp.contractingPartyZoomController', contractingPartyZoomController);
	});