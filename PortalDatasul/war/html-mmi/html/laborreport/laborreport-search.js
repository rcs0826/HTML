define(['index',
        '/dts/mmi/js/zoom/ord-manut.js',
        '/dts/mce/js/mce-utils.js',
        '/dts/mmi/js/utils/mmi-utils.js'], function(index) {

    consultaCtrl.$inject = [
        '$rootScope',	                          
        '$scope',
        'TOTVSEvent',
        '$modalInstance',
        'model',
        'helperOrder',
        'fchmip.fchmiporder.Factory',
        '$filter',
        'mmi.utils.Service'];
  
    function consultaCtrl($rootScope,
                          $scope,
                          TOTVSEvent,
                          $modalInstance,
                          model,
                          helperOrder,
                          fchmiporder,
                          $filter,
                          mmiUtils) {

            var consultaCtrl = this;
            consultaCtrl.model = model;
            consultaCtrl.hifen = " - ";

            consultaCtrl.init = function() {

                if (!consultaCtrl.model.periodo) {
                    consultaCtrl.model.periodo = 0;
                    consultaCtrl.periodoConsulta(0);
                }
                consultaCtrl.buscaTecnicos();
            };

            consultaCtrl.periodoConsulta = function(periodo){
                var dateIni = new Date();
                dateIni.setDate(dateIni.getDate() - periodo);
                consultaCtrl.model.periodo = periodo;

                consultaCtrl.model.date = {
                    'startDate': dateIni,
                    'endDate': new Date()                    
                };
            }
            
           consultaCtrl.confirmaConsulta = function(){

                if (consultaCtrl.isInvalidForm()){
                    return;
                }
                $modalInstance.close();
                
            };

            consultaCtrl.filterTechnician = function(input){
                consultaCtrl.listOfTechnician = $filter('filter')(consultaCtrl.listOfTechnicianAux, {$:input});
            }		
            
            consultaCtrl.buscaTecnicos = function(){

                var params = {'nrOrdem': 0,
                              'cdTarefa': 0};
        
                fchmiporder.getTecnicoDados(params, function(result){
                    
                    if (result) {

                        consultaCtrl.listOfTechnician = [];

                        angular.forEach(result.ttListTecnico, function (value) {
            
                            consultaCtrl.listOfTechnician.push(value);
                            consultaCtrl.listOfTechnicianAux = consultaCtrl.listOfTechnician;
                        });
                    }
                });
            }

            consultaCtrl.isInvalidForm = function() {
                var messages = [];
                var isInvalidForm = false;
                    

                if (!consultaCtrl.model['nr-ord-produ'] && !consultaCtrl.model.userTechnician ){
                    isInvalidForm = true
                    messages.push('l-technician-search');
                }

                if (isInvalidForm) {
                    angular.forEach(messages, function(item) {
                      var warning = '';
                          warning = warning + ' ' + $rootScope.i18n(item);
                      $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'error',
                            title: $rootScope.i18n('l-attention'),
                            detail: warning
                        });
                    });
                }
                return isInvalidForm;

            }

            consultaCtrl.close = function () {
                $modalInstance.close('cancel');
            }    

            if ($rootScope.currentuserLoaded) { 
                consultaCtrl.init(); 
            }
    
            $scope.$on(TOTVSEvent.rootScopeInitialize, function () { });	
    
            $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                $modalInstance.close('cancel');
            });

    }

        index.register.controller('mmi.laborreport.buscaCtrl', consultaCtrl);
        index.register.service('helperOrder', function(){
                return {
                    data :{}
                };
            });
        
});