define(['index',
		'/dts/mpo/js/api/fch/fchmpo/fchmpoagenda.js'], function(index) {

			/*
			<select-tecn-mi
				data-ng-model="controller.model"
				ng-change="controller.selectTecnMi"
				tecn-usuar-default="false">
			</select-tecn-mi>
			*/

	index.register.directive('selectTecnMi',function(){
		return {
			required: '?ngModel',
	 		restrict: 'E',
	 		transclude: true,
	 		scope: {
      			ngModel: '=',
      			ngChangeModel: '&ngChange',
      			tecnUsuarDefault : '='
    		},
    		templateUrl: '/dts/mmi/js/directive/select.tecn-mi.html',
    		controller: ['$timeout', '$scope', '$rootScope', 'fchmpo.fchmpoagenda.Factory', function selTecnController($timeout, $scope, $rootScope, fchmpoagendaFactory){
				controller = this;
		
				$scope.ngModel = null;

				$scope.ngChangeCookie = function(){					

		      		$timeout(function() {
	      				fchmpoagendaFactory.set('tecn-mi', $scope.ngModel);	      				
						if (angular.isFunction($scope.ngChangeModel))
							$scope.ngChangeModel();	

		      		}, 1);					
		      	};

				$scope.loadDataSource = function(callback){
					
					$scope.dataSource = new kendo.data.DataSource({
					 	offlineStorage: {
			          		getItem: function() {
			          			if(!$scope.isOnline && $scope.isCallback){
			          				callback();
			          			}
			              		return fchmpoagendaFactory.getSession('tecn-mi-list');
			          		},
			          		setItem: function(listTecnMi) {
			          			if(listTecnMi.length > 0)
			              			fchmpoagendaFactory.setSession('tecn-mi-list', listTecnMi);
			          		}
			      		},
						transport: {
							read: {
					            url: "/dts/datasul-rest/resources/api/fchmpoagenda/getListTecnico",
					            dataType: "json",
					            type: "post",
					            contentType: "application/json;charset=UTF-8"
					        },
						    parameterMap: function(a,b){
					    		return "getListTecnico";
						    }
					    },
					    dataTextField: 'nomeCompl',
					    serverFiltering: false,
					    schema: {
					        data: function(response){
				        		if(!response.data)
				        			response.data = fchmpoagendaFactory.getSession('tecn-mi-list');

					        	var listTecnMi = [];
					        	angular.forEach(response.data, function(resp){
				        			listTecnMi.push({ 
					        			'cdTecnico' : resp.cdTecnico,
					        			'nomeCompl': resp.nomeCompl,
					        			'description': resp.cdTecnico + " - " + resp.nomeCompl,
					        			'grupo': resp.grupo
					        		});

					        	});

					        	return listTecnMi;
					        }
					    }
					});					
					$scope.dataSource.online($scope.isOnline);
				};

				$scope.init = function(){			

					$scope.isOnline = true;
					$scope.isCallback = true;

					if (fchmpoagendaFactory.getSession('tecn-mi-list')){
						if(fchmpoagendaFactory.getSession('tecn-mi-list').length > 0)
							$scope.isOnline = false;
					}

					if ($scope.isOnline){
						$timeout(function() {					
							$scope.ngModel = fchmpoagendaFactory.get('tecn-mi');
						}, 1);
					}

					$scope.loadDataSource(function(){
						if (fchmpoagendaFactory.get('tecn-mi')){							
							$timeout(function() {					
								$scope.ngModel = fchmpoagendaFactory.get('tecn-mi');
							}, 1);
						}else{
							if ($scope.tecnUsuarDefault){
								fchmpoagendaFactory.getUserGroup($rootScope.currentuser.login,function(result){
									if (result){
										angular.forEach(result.ttListTecnico, function(resp){
											$scope.ngModel = { 
							        			'cdTecnico' : resp.cdTecnico,
							        			'nomeCompl': resp.nomeCompl,
							        			'description': resp.cdTecnico + " - " + resp.nomeCompl,
							        			'grupo': resp.grupo
						        			};
										});
									}
								});
							}
						}
						$scope.isCallback = false;							
					});

				}

				if ($rootScope.currentuserLoaded) { $scope.init(); }
    		}],
    		controllerAs:'selTecnController'
  		};
	});
});
