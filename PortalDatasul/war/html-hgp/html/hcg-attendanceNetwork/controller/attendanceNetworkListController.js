define(['index',
    '/dts/hgp/html/hcg-attendanceNetwork/attendanceNetworkFactory.js',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/hcg-attendanceNetwork/maintenance/controller/attendanceNetworkMaintenanceController.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    attendanceNetworkListController.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service',
                                                  'hcg.attendanceNetwork.Factory','global.userConfigs.Factory',
                                                  '$modal','AbstractAdvancedFilterController','TOTVSEvent'];
    function attendanceNetworkListController($rootScope, $scope, appViewService,attendanceNetworkFactory,
                                                userConfigsFactory,$modal,AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;

        _self.cdProgramaCorrente = 'hcg.attendanceNetworkList';
        _self.config = [];
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.disclaimers = [];
        _self.listOfAttendanceNetwork = [];
        _self.listOfAttendanceNetworkCount = 0;
        
        this.search = function (isMore) {

            var startAt = 0;
            _self.listOfAttendanceNetworkCount = 0;

            if (isMore) {
                startAt = _self.listOfAttendanceNetwork.length + 1;
            } else {
                _self.listOfAttendanceNetwork = [];
            }
            
            //Testa se foi preenchido o campo de busca
            if (!angular.isUndefined(this.searchInputText)
            && this.searchInputText != ''){ 

                    //Remove todos os disclaimers
                    var arrayLength = this.disclaimers.length - 1;
                    for (var i = arrayLength ; i >= 0 ; i--) {
                        
                        this.disclaimers.splice(i, 1);                    
                    }     

                    if(this.searchInputText.length < 9 && StringTools.hasOnlyNumbers(this.searchInputText)){
                        _self.disclaimers.push({property:'cdnRede',title: 'Código da Rede' + ': ' 
                            + this.searchInputText,
                            value:this.searchInputText, priority:1});
                    }else{
                        _self.disclaimers.push({property:'desRede',title: 'Descrição da Rede' + ': ' 
                            + this.searchInputText,
                            value:this.searchInputText, priority:1, operator: 'begins'});             
                    }
           }   

            //Limpa o campo de busca 
            _self.searchInputText = '';
           
            //Busca os periodos com os filtros informados, retornando o numero de registros configurados após o campo startAt
            attendanceNetworkFactory.getAttendanceNetworkByFilter('', startAt, 
                    20, true, _self.disclaimers, 
                function (result) {
                    _self.hasDoneSearch = true;
                    
                    //Se encontrou resultados, preenche a lista de periodos com os mesmos.
                    if (result) {
                        angular.forEach(result, function (value) {

                            if (value && value.$length) {
                               _self.listOfAttendanceNetworkCount = value.$length;
                            }
                            _self.listOfAttendanceNetwork.push(value);
                        });
                        if (isMore === false) {
                            $('.page-wrapper').scrollTop(0);
                        }
                    }
                });
        };    

        this.removeAttendanceNetwork = function (selectedAttendanceNetwork) {

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
               title: 'Atenção!',
               text: 'Você realmente deseja remover a rede selecionada e todos seus prestadores?',
               cancelLabel: 'Não',
               confirmLabel: 'Sim',
               size: 'md',
               callback: function (hasChoosenYes) {
                    if (hasChoosenYes != true) 
                        return;

                    attendanceNetworkFactory.removeAttendanceNetwork(selectedAttendanceNetwork,
                    function (result) {

                        if(result.$hasError == true){
                            return;
                        }
                       
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'success', title: 'Registro removido com sucesso'
                        });
                        _self.search(false);
                    }); 
                }
            }); 
        };   

        this.removeDisclaimer = function (disclaimer) {

            // percorre os disclaimers até encontrar o disclaimer passado na função e o remove
            // obs.: Não funciona para mais de um disclaimer quando são apenas 2, 
            //       pois o length dos disclaimers usado no for é modificado assim
            //       que é removido o primeiro disclaimer

            for (var i = 0; i < _self.disclaimers.length; i++) {
                if (_self.disclaimers[i].property === disclaimer.property) {
                    _self.disclaimers.splice(i, 1);
                }
            }

            _self.search(false);
       };

       this.addEventListeners = function(){

            $rootScope.$on('invalidateAttendanceNetwork',function(event, changedAttendanceNetwork){

                if(!_self.listOfAttendanceNetwork
                || _self.listOfAttendanceNetwork.length == 0){
                    return;
                }

                for (var i=0; i < _self.listOfAttendanceNetwork.length; i++) {
                    var attendanceNetwork = _self.listOfAttendanceNetwork[i];
                    var indAux = i;

                    if(attendanceNetwork.cdnRede == changedAttendanceNetwork.cdnRede){
                
                         attendanceNetworkFactory.getAttendanceNetworkByFilter('', 0, 0, false,[
                                {property:'cdnRede', value: attendanceNetwork.cdnRede, priority:9}
                            ],function(result){                                

                                if(result){
                                    var attendanceNetworkAux = result[0];
                                    attendanceNetworkAux.$selected = attendanceNetwork.$selected;
                                    _self.listOfAttendanceNetwork[indAux] = attendanceNetworkAux;
                                }
                        }, {noCountRequest: true});
                        break;
                    }
                }
            });  
        };

        this.init = function(){
            appViewService.startView("Redes de Atendimentos", 'hcg.attendanceNetworkList.Control', _self);
                        
            if(appViewService.lastAction != 'newtab'){
                return;
            }

            _self.addEventListeners();
               
            _self.search(false);            
        };

        if ($rootScope.currentuserLoaded) {
            _self.init();
        } else {
            $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
                _self.init();
            });
        }
    }
    index.register.controller('hcg.attendanceNetworkList.Control', attendanceNetworkListController);

});


