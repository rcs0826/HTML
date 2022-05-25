define(['index', 
        '/dts/hgp/html/hrc-period/periodFactory.js',
        '/dts/hgp/html/js/util/StringTools.js',
        '/dts/hgp/html/js/util/DateTools.js',
        '/dts/hgp/html/hrc-periodSituation/sitPerZoomController.js'
	], function(index) {

	periodMaintenanceController.$inject = ['$rootScope', '$scope','$state','$stateParams', 'totvs.app-main-view.Service',
	                              '$location', 'hrc.period.Factory', 'TOTVSEvent'];
	function periodMaintenanceController($rootScope, $scope, $state, $stateParams, appViewService, 
						$location, periodFactory, TOTVSEvent) {

            var _self = this;
            _self.action = 'INSERT';
            
            this.period = {};

            this.init = function() {
               
                appViewService.startView("Manutenção de Período de Movimentação", 'hrc.periodMaintenance.Control', _self);
                _self.currentUrl = $location.$$path;    
                if (!angular.isUndefined($stateParams.dtAnoref)
                &&  !angular.isUndefined($stateParams.nrPerref)) { 
                    
                    if($state.current.name === 'dts/hgp/hrc-period.detail'){
                        _self.action = 'DETAIL';
                    }else{
                        _self.action = 'EDIT';
                    }
                   
                    var disclaimersAux = [];
                    disclaimersAux.push({property: HibernateTools.SEARCH_OPTION_CONSTANT, value: 'PeriodSituation'});
                    disclaimersAux.push({property: 'dtAnoref', value: $stateParams.dtAnoref, priority:2});
                    disclaimersAux.push({property: 'nrPerref', value: $stateParams.nrPerref, priority:1});
                    
                   
                    periodFactory.getPeriodByFilter('', 0, 1, false, disclaimersAux, 
                        function (result) {
    
                        if (result) {
                            _self.period = result[0];
                        }
                    });

                }else{
                    _self.action = 'INSERT';
                    _self.period = {
                        dtAnoref       : new Date().getFullYear(),
                        dtInicioPer    : Date.now(),
                        dtFimPer       : Date.now().moveToLastDayOfMonth(),
                        dtBaseValor    : Date.now(),
                        dtAtualizacao  : Date.now(),
                        cdSitPer       : 1
                    };                                              
                }

            };
            
            this.save = function() {
                periodFactory.savePeriod(_self.period, _self.action, 
                    function (result) {
                        
                        
                        if(result.$hasError == true){
                            return;
                        }
                        
                        result = result[0];
                        
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'success', title: 'Período '
                                        + result.dtAnoref +'/' + StringTools.fill(result.nrPerref, '0', 3)
                                        +' salvo com sucesso'
                        });

                        _self.invalidatePeriod(result);

                        appViewService.removeView({active: true,
                                           name  : 'Manutenção de Período de Movimentação',
                                           url   : _self.currentUrl});
    
                    });
            };     

            this.dtInicioPerBlur = function(){

                
               _self.period.dtFimPer = new Date(_self.period.dtInicioPer).moveToLastDayOfMonth();
                
            } 

            this.onCancel = function(){
                appViewService.removeView({active: true,
                                           name  : 'Manutenção de Período de Movimentação',
                                           url   : _self.currentUrl});
            };

            this.invalidatePeriod = function(period){
                //dispara um evento pra lista atualizar o registro
                $rootScope.$broadcast('invalidatePeriod',
                        {dtAnoref: period.dtAnoref,
                         nrPerref: period.nrPerref});
            };


            $scope.$watch('$viewContentLoaded', function(){
                _self.init();
            });

	}
	
	index.register.controller('hrc.periodMaintenance.Control', periodMaintenanceController);
});
