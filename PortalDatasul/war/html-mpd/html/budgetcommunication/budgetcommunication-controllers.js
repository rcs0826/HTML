define(['index', 
        '/dts/mpd/js/api/fchdis0061.js'], function (index) {

	budgetCommunicationCtrl.$inject = ['$rootScope', '$scope', '$stateParams', '$window', '$location', '$state', '$nestable', 'totvs.app-main-view.Service', 'mpd.budgetManagementApp.Factory', 'TOTVSEvent', '$filter', '$timeout'];

	function budgetCommunicationCtrl($rootScope, $scope, $stateParams, $window, $location, $state, $nestable, appViewService, budgetManagementAppResources, TOTVSEvent, $filter, $timeout) {

		var i18n = $filter('i18n');

		var ctrl = this;    
        
        // *********************************************************************************
        // *** Atributos
        // *********************************************************************************
        
        this.model = {}; // mantem o conteudo do registro em edição/inclusão
        this.father = $stateParams.budgetId;
        ctrl.budgetId = $stateParams.budgetId;
        ctrl.budgetCode = $stateParams.budgetCode;
        ctrl.showUnreadLabel = $rootScope.i18n('l-show-unread');
        
        // *********************************************************************************
        // *** Methods
        // *********************************************************************************
        
        // metodo de leitura do regstro
        this.load = function() {
            this.model = {};
            var hraIncl;
            var datIncl;
            var countAux;
            
            budgetManagementAppResources.getBudgetCommunication({budgetId: $stateParams.budgetId}, function(result){
                
                ctrl.listResult = result['ttCommunicationBudget'];
                ctrl.nomeAbrev  = result['REST_nomeAbrev'];
                ctrl.telefone   = result['REST_telefone'];
                ctrl.codEmitente = result['REST_codEmitente'].toString();
                
                angular.forEach(ctrl.listResult, function(value, key) {
                    hraIncl = value['hra-incl'];
                    datIncl = $filter('date')(new Date(value['dat-incl']),'yyyy-MM-dd'); 
                    countAux = hraIncl.search(':');
                    
                    if (countAux == -1){
                        value['hra-incl'] = hraIncl.substring(0,2) + ':' + hraIncl.substring(2,4) + ':' + hraIncl.substring(4,6);
                    }
                    
                    hraIncl = value['hra-incl'];
                    value['order-date'] = Date.parse(datIncl + "T" + hraIncl);
                });
            });
            
            ctrl.new_communication = "";
        }
        
        this.sendNewCommunication = function(){
            
            budgetManagementAppResources.postNewCommunication({budgetId: ctrl.budgetId}, ctrl.new_communication, function(result){
                // notifica o usuario que conseguiu salvar o registro
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'success',
                    title: $rootScope.i18n('l-comunicacao'),
                    detail: $rootScope.i18n('l-comunicacao') + ' ' + $rootScope.i18n('l-success-sent') + '!'
                });
                 ctrl.load();
            });
            
           
        }
        
        this.markAsRead = function(message){
            
            message['log-lido'] = true;
            budgetManagementAppResources.putUpdateCommunication({budgetId: ctrl.budgetId}, message, function(result){
                // não é necessário recarregar a tela ou notificar o usuário
            });
            
        }
        
        this.setShowUnread = function(){
            ctrl.onlyShowUnread = !ctrl.onlyShowUnread;
            if (ctrl.onlyShowUnread){
                ctrl.showUnreadLabel = $rootScope.i18n('l-show-all');
            }
            else{
                ctrl.showUnreadLabel = $rootScope.i18n('l-show-unread');
            }
        }
        
        this.answerCommunication = function(message){
            var texto = "";
            
            texto = ctrl.new_communication + ' ' + $rootScope.i18n('l-answer-to') + ' " ' + message + ' ":';
            ctrl.new_communication = ctrl.new_communication + + $rootScope.i18n('l-answer-to') + ' " ' + message + ' ":';
            
            if(texto.length > 2000) {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    title: $rootScope.i18n('l-warning'),
                    detail: $rootScope.i18n('l-too-large')
                });
            }
            else{
                ctrl.new_communication = texto;
            }
        }
        
        this.copyCommunication = function(message){
            var texto = "";
            
            texto = ctrl.new_communication + ' ' + message;
            
            if(texto.length > 2000) {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    title: $rootScope.i18n('l-warning'),
                    detail: $rootScope.i18n('l-too-large')
                });
            }
            else{
                ctrl.new_communication = texto;
            }
            
        }
        
        this.sortMessages = function(message){
            var date = new Date(message['order-date']);
            return date;
        }
        
        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************

        this.init = function() {

            if (appViewService.startView($rootScope.i18n('l-comunicacao')+' '+$stateParams.budgetId, 'mpd.budgetcommunication.Control', ctrl)) {
                // se é a abertura da tab, implementar aqui inicialização do controller            
            }
            
            $timeout(function () {																		
                budgetManagementAppResources.getBudgetSituation({budgetId: $stateParams.budgetId}, function(result){

                    if (result['REST_budgetSit'] == 3 || result['REST_budgetSit'] == 4){						
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'warning',
                            title: $rootScope.i18n('l-warning'),
                            detail: $rootScope.i18n('l-budget-status' + ' '+ $stateParams.budgetId +' ' + 'l-comm-not-allowed', [], 'dts/mpd/')
                        });
                        var pageActive = appViewService.getPageActive();
                        appViewService.releaseConsume(pageActive);
                        appViewService.removeView(pageActive);									
                   } 
                });       				
            }, 500);
            
            this.load();            
        }

        // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) { this.init(); }

        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************

        // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            ctrl.init();
        });
		
	}

	index.register.controller('salesorder.budgetcommunication.Controller', budgetCommunicationCtrl);
});