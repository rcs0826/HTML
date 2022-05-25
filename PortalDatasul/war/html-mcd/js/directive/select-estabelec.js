define(['index',
		'/dts/mcd/js/api/fch/fchmcd/fchmcd0001.js'], function(index) {

		/*
		<select-estabelec
			data-ng-model="controller.model"
			on-change="controller.selectEstabel">
		</select-estabelec>
		*/

	index.register.directive('selectEstabelec',function(){
		return {
			required: '?ngModel',
	 		restrict: 'E',
	 		transclude: true,
	 		scope: {
      			ngModel: '=',
      			ngChangeModel: '=ngChange',
      			labelComp: '@label'
    		},
    		templateUrl: '/dts/mcd/js/directive/select.estabelec.html',
    		controller: ['$timeout', '$scope', '$rootScope', 'fchmcd.fchmcd0001.Factory', function selEstabelController($timeout, $scope, $rootScope, fchmcd0001Factory){
				controller = this;

				$scope.ngChangeCookie = function(){	

					var scopeTecnicoMi = angular.element("totvs-field[select-id=cdTecnico] input[name=ngmodel_input]").scope();
					var scopeTotvsField = angular.element("totvs-field[select-id=cdTecnico]").scope();
					var scopeSelectTecnMi = angular.element("select-tecn-mi").scope();

					$timeout(function() {
						fchmcd0001Factory.set('estabel-mcd', $scope.ngModel);						
					}, 1).then(function(){

						if (scopeTecnicoMi && $scope.ngModel)
											scopeTecnicoMi.cleanValue();	
					
	      				if (angular.isFunction($scope.ngChangeModel))
							$scope.ngChangeModel();

					});
					

			

		      	};

				$scope.init = function(){

					if ($scope.ngModel == "" || !$scope.ngModel){
						$scope.ngModel = null;
						fchmcd0001Factory.set('estabel-mcd', null);
					}else if(!$scope.ngModel.tta_cod_estab){
						$scope.ngModel = null;
						fchmcd0001Factory.set('estabel-mcd', null);
					}

				}

				if ($rootScope.currentuserLoaded) { $scope.init(); }
    		}],
    		controllerAs:'selEstabelController'
  		};
	});
});
