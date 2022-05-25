/* global angular */
define(['index',
	'/dts/hgp/html/hvp-proposals/proposalsFactory.js'],
	function (index) {

		proposalZoomController.$inject = ['$injector', 'hvp.proposals.Factory'];

		function proposalZoomController($injector, proposalsFactory) {

			var _self = this;

			this.zoomResultList = [];
			this.resultTotal = 0;
			this.zoomName = 'Propostas';
			
			this.propertyFields = [
				{ label: 'Modalidade/Proposta', property: 'nrProposta', default: true }];

			this.tableHeader = [
				{ label: 'Propostas', property: 'nrProposta' }];

			this.returnValue = function () {

				var proposalSelected = this.zoomResultList[this.selected];

				return proposalSelected['nrProposta'];
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
				if (parameters.selectedFilterValue == null)
					parameters.selectedFilterValue = "";
				if (parameters.more == true) {

					parameters.init = this.zoomResultList.length;
				} else {

					this.zoomResultList.splice(0, this.zoomResultList.length);
					parameters.init = 0;
				}

				var controller = this;
				
				proposalsFactory.getAllProposalsByFilter(
					'', 
					parameters.init, 
					100,
					[{property: parameters.selectedFilter.property, 
						value: parameters.selectedFilterValue}], 
					function(result) {
						
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

		index.register.factory('hvp.proposalZoomController', proposalZoomController);
	});