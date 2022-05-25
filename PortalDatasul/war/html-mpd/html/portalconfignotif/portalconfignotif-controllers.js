define(['index', // index sempre deve ser injetado para permitir o registro dos controllers.
         // totvs-custom alem das tags de customização de tela, tambem comtêm os serviços de customização
        '/dts/mpd/js/api/fchdis0028.js'
       ], function(index) { 
    
    // **************************************************************************************
	// *** CONTROLLER - EDIT
	// **************************************************************************************
	    
    portalConfigNotifEditController.$inject = ['$rootScope',
                                               '$scope',
                                               '$stateParams',
                                               '$window',
                                               '$location',
                                               '$state',
                                               '$nestable',
                                               'totvs.app-main-view.Service',
                                               'mpd.fchdis0028.FactoryApi', 'TOTVSEvent'];
    function portalConfigNotifEditController($rootScope, $scope, $stateParams, $window, $location, $state, $nestable,
                                             appViewService, portalConfigNotifFactoryApi, TOTVSEvent) {
        var controller = this;
        
        controller.message = {"message_code": 0,
							  "param_name":"",
							  "message_label":"",
							  "send_notification":false,
							  "use_html_model":false,
							  "message_text":""};
        
        //ALTERAR PARA RECEBER A DEFINIÇÃO DE NOME (message_label) E CÓDIGO (param_name) DAS MENSAGENS DO PROGRAMA PDAPI513E PROCEDURE returnTTEventos
		controller.messages = [];

		controller.message.message_code = 1;
		controller.message.message_label = $rootScope.i18n('l-lib-pedido');
		controller.message.param_name = 'liberacao-pedido';
		controller.messages.push(angular.copy(controller.message));

		controller.message.message_code = 2;
		controller.message.message_label = $rootScope.i18n('l-aprov-pedido');
		controller.message.param_name = 'aprovacao-pedido';
		controller.messages.push(angular.copy(controller.message));

		controller.message.message_code = 3;
		controller.message.message_label = $rootScope.i18n('l-reprov-pedido');
		controller.message.param_name = 'reprovacao-pedido';
		controller.messages.push(angular.copy(controller.message));

		controller.message.message_code = 4;
		controller.message.message_label = $rootScope.i18n('l-efetiv-pedido');
		controller.message.param_name = 'efetivacao-pedido';
		controller.messages.push(angular.copy(controller.message));

		/*controller.message.message_code = 5;
		controller.message.message_label = $rootScope.i18n('Alocação do Pedido');
		controller.message.param_name = 'alocacao-pedido';
		controller.messages.push(angular.copy(controller.message));

		controller.message.message_code = 6;
		controller.message.message_label = $rootScope.i18n('Desalocação do Pedido');
		controller.message.param_name = 'desalocacao-pedido';
		controller.messages.push(angular.copy(controller.message));

		controller.message.message_code = 7;
		controller.message.message_label = $rootScope.i18n('Separação do Pedido');
		controller.message.param_name = 'separacao-pedido';
		controller.messages.push(angular.copy(controller.message));*/

		controller.message.message_code = 8;
		controller.message.message_label = $rootScope.i18n('l-fat-pedido');
		controller.message.param_name = 'faturamento-pedido';
		controller.messages.push(angular.copy(controller.message));

		controller.message.message_code = 9;
		controller.message.message_label = $rootScope.i18n('l-canc-nota-pedido');
		controller.message.param_name = 'cancelamento-nota-pedido';
		controller.messages.push(angular.copy(controller.message));

		controller.message.message_code = 10;
		controller.message.message_label = $rootScope.i18n('l-cance-pedido');
		controller.message.param_name = 'cancelamento-pedido';
		controller.messages.push(angular.copy(controller.message));

		controller.message.message_code = 11;
		controller.message.message_label = $rootScope.i18n('l-susp-pedido');
		controller.message.param_name = 'suspensao-pedido';
		controller.messages.push(angular.copy(controller.message));

		controller.message.message_code = 12;
		controller.message.message_label = $rootScope.i18n('l-reativ-pedido');
		controller.message.param_name = 'reativacao-pedido';
		controller.messages.push(angular.copy(controller.message));

		controller.message.message_code = 13;
		controller.message.message_label = $rootScope.i18n('l-aprov-cred-pedido');
		controller.message.param_name = 'aprovacao-credito-pedido';
		controller.messages.push(angular.copy(controller.message));

		controller.message.message_code = 14;
		controller.message.message_label = $rootScope.i18n('l-reprov-cred-pedido');
		controller.message.param_name = 'reprovacao-credito-pedido';
		controller.messages.push(angular.copy(controller.message));

                /*
		controller.message.message_code = 15;
		controller.message.message_label = $rootScope.i18n('Aprovação de Crédito Pendente de Informação');
		controller.message.param_name = 'aprovacao-credito-pendente-informacao';
		controller.messages.push(angular.copy(controller.message));
				
		controller.message.message_code = 16;
		controller.message.message_label = $rootScope.i18n('Aprovação Comercial do Pedido');
		controller.message.param_name = 'aprovacao-comercial-pedido';
		controller.messages.push(angular.copy(controller.message));

		controller.message.message_code = 17;
		controller.message.message_label = $rootScope.i18n('Reprovação Comercial do Pedido');
		controller.message.param_name = 'reprovacao-comercial-pedido';
		controller.messages.push(angular.copy(controller.message));

		controller.message.message_code = 18;
		controller.message.message_label = $rootScope.i18n('Suspensão Comercial do Pedido');
		controller.message.param_name = 'suspencao-comercial-pedido';
		controller.messages.push(angular.copy(controller.message));
		*/
        
        controller.ktools = ["bold",
				"italic",
				"underline",
				"strikethrough",
				"justifyLeft",
				"justifyCenter",
				"justifyRight",
				"justifyFull",
				"insertUnorderedList",
				"insertOrderedList",
				"indent",
				"outdent",
				"createLink",
				"unlink",
				"insertImage",
				"insertFile",
				"tableWizard",
				"createTable",
				"addRowAbove",
				"addRowBelow",
				"addColumnLeft",
				"addColumnRight",
				"deleteRow",
				"deleteColumn",
				"formatting",
				"fontName",
				"fontSize",
				"foreColor",
				"backColor"];
        
        // *********************************************************************************
        // *** Atributos
        // *********************************************************************************

        this.model = {}; // mantem o conteudo do registro em edição/inclusão
        this.father = $stateParams.idPortalConfigur;
                        
        // *********************************************************************************
        // *** Methods
        // *********************************************************************************
        
        // metodo de leitura do regstro
        this.load = function(id) {
            this.model = {};
            
            portalConfigNotifFactoryApi.getConfigNotif({idiSeq: $stateParams.idPortalConfigur},function(result){
                
                controller.listResult = result[0];
                
                angular.forEach(controller.messages, function(message, key) {             
                    switch(message.param_name){
                        case 'liberacao-pedido':
                            message.send_notification = controller.listResult['l_liberacPedido'];
                            message.message_text      = controller.Utf8Decode(controller.listResult['c_liberacPedido'].split('`').join('"'));
                            break;
                        case 'aprovacao-pedido':
                            message.send_notification = controller.listResult['l_aprovacPedido'];
                            message.message_text      = controller.Utf8Decode(controller.listResult['c_aprovacPedido'].split('`').join('"'));
                            break;
                        case 'reprovacao-pedido':
                            message.send_notification = controller.listResult['l_reprovacPedido'];
                            message.message_text      = controller.Utf8Decode(controller.listResult['c_reprovacPedido'].split('`').join('"'));
                            break;
                        case 'efetivacao-pedido':
                            message.send_notification = controller.listResult['l_efetivacPedido'];
                            message.message_text      = controller.Utf8Decode(controller.listResult['c_efetivacPedido'].split('`').join('"'));
                            break;
                        case 'faturamento-pedido':
                            message.send_notification = controller.listResult['l_faturPedido'];
                            message.message_text      = controller.Utf8Decode(controller.listResult['c_faturPedido'].split('`').join('"'));
                            break;
                        case 'cancelamento-nota-pedido':
                            message.send_notification = controller.listResult['l_cancelNotaPedido'];
                            message.message_text      = controller.Utf8Decode(controller.listResult['c_cancelNotaPedido'].split('`').join('"'));
                            break;
                        case 'cancelamento-pedido':
                            message.send_notification = controller.listResult['l_cancelPedido'];
                            message.message_text      = controller.Utf8Decode(controller.listResult['c_cancelPedido'].split('`').join('"'));
                            break;
                        case 'suspensao-pedido':
                            message.send_notification = controller.listResult['l_suspPedido'];
                            message.message_text      = controller.Utf8Decode(controller.listResult['c_suspPedido'].split('`').join('"'));
                            break;
                        case 'reativacao-pedido':
                            message.send_notification = controller.listResult['l_reativacPedido'];
                            message.message_text      = controller.Utf8Decode(controller.listResult['c_reativacPedido'].split('`').join('"'));
                            break;
                        case 'aprovacao-credito-pedido':
                            message.send_notification = controller.listResult['l_aprovacCreditoPedido'];
                            message.message_text      = controller.Utf8Decode(controller.listResult['c_aprovacCreditoPedido'].split('`').join('"'));
                            break;
                        case 'reprovacao-credito-pedido':
                            message.send_notification = controller.listResult['l_reprovacCreditoPedido'];
                            message.message_text      = controller.Utf8Decode(controller.listResult['c_reprovacCreditoPedido'].split('`').join('"'));
                            break;    
                    }
                });
            });
            
            portalConfigNotifFactoryApi.getUseHTMLNotificationProfile({idiSeq: $stateParams.idPortalConfigur}, function(result){
                
                angular.forEach(controller.messages, function(message, key) {             
                    angular.forEach(result, function(param, key2) {               
                        if(message.param_name == param['c-code']){
                            message.use_html_model = param['c-value'];
                        }
                    });
                });    
            });
        }
        
        // metodo para salvar o registro
        this.save = function() {
            
            var icont = 0;
            var table = "";
            ttFields = [];
            
            // verificar se o formulario tem dados invalidos
            if (this.isInvalidForm()) {
                return;
            }
            
            angular.forEach(controller.messages, function(message, key){
                switch(message.param_name){
                    case 'liberacao-pedido':
                        controller.listResult['l_liberacPedido'] = message.send_notification;
                        controller.listResult['c_liberacPedido'] = controller.Utf8Encode(message.message_text.split('"').join('`'));
                        break;
                    case 'aprovacao-pedido':
                        controller.listResult['l_aprovacPedido'] = message.send_notification;
                        controller.listResult['c_aprovacPedido'] = controller.Utf8Encode(message.message_text.split('"').join('`'));
                        break;
                    case 'reprovacao-pedido':
                        controller.listResult['l_reprovacPedido'] = message.send_notification;
                        controller.listResult['c_reprovacPedido'] = controller.Utf8Encode(message.message_text.split('"').join('`'));
                        break;    
                    case 'efetivacao-pedido':
                        controller.listResult['l_efetivacPedido'] = message.send_notification;
                        controller.listResult['c_efetivacPedido'] = controller.Utf8Encode(message.message_text.split('"').join('`'));
                        break;
                    case 'faturamento-pedido':
                        controller.listResult['l_faturPedido'] = message.send_notification;
                        controller.listResult['c_faturPedido'] = controller.Utf8Encode(message.message_text.split('"').join('`'));
                        break;
                    case 'cancelamento-nota-pedido':
                        controller.listResult['l_cancelNotaPedido'] = message.send_notification;
                        controller.listResult['c_cancelNotaPedido'] = controller.Utf8Encode(message.message_text.split('"').join('`'));
                        break;
                    case 'cancelamento-pedido':
                        controller.listResult['l_cancelPedido'] = message.send_notification;
                        controller.listResult['c_cancelPedido'] = controller.Utf8Encode(message.message_text.split('"').join('`'));
                        break;
                    case 'suspensao-pedido':
                        controller.listResult['l_suspPedido'] = message.send_notification;
                        controller.listResult['c_suspPedido'] = controller.Utf8Encode(message.message_text.split('"').join('`'));
                        break;
                    case 'reativacao-pedido':
                        controller.listResult['l_reativacPedido'] = message.send_notification;
                        controller.listResult['c_reativacPedido'] = controller.Utf8Encode(message.message_text.split('"').join('`'));
                        break;
                    case 'aprovacao-credito-pedido':
                        controller.listResult['l_aprovacCreditoPedido'] = message.send_notification;
                        controller.listResult['c_aprovacCreditoPedido'] = controller.Utf8Encode(message.message_text.split('"').join('`'));
                        break;
                    case 'reprovacao-credito-pedido':
                        controller.listResult['l_reprovacCreditoPedido'] = message.send_notification;
                        controller.listResult['c_reprovacCreditoPedido'] = controller.Utf8Encode(message.message_text.split('"').join('`'));
                        break;   
                }
            });
                        
            portalConfigNotifFactoryApi.postConfigNotif({idiSeq: $stateParams.idPortalConfigur},controller.listResult, function(result){
                // notifica o usuario que conseguiu salvar o registro
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'success',
                    title: $rootScope.i18n('l-config-notif'),
                    detail: $rootScope.i18n('l-config-notif') + ' ' + $rootScope.i18n('l-success-created') + '!'
                });
            });
        }       
        
        // metodo para a ação de cancelar
        this.cancel = function() {
            // solicita que o usuario confirme o cancelamento da edição/inclusão
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question',
                text: $rootScope.i18n('l-cancel-operation'),
                cancelLabel: 'l-no',
                confirmLabel: 'l-yes',
                callback: function(isPositiveResult) {
                    if (isPositiveResult) { // se confirmou, navega para a pagina anterior
                        var pageActive = appViewService.getPageActive();
                        appViewService.removeView(pageActive);
                    }
                }
            });
        }

        // metodo para verificar se o formulario é invalido
        this.isInvalidForm = function() {

            var messages = [];
            var isInvalidForm = false;
            
            angular.forEach(controller.messages,function(message,key){
                if(message.send_notification == true && message.message_text == ''){
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        title: $rootScope.i18n('l-warning'),
                        detail: $rootScope.i18n('Informe uma mensagem para a notificação do evento ' + message.message_label)
                    });
                    isInvalidForm = true;
                } 
            });
            
            // se for invalido, monta e mostra a mensagem
            /*if (isInvalidForm) {
                var warning = $rootScope.i18n('l-field');
                if (messages.length > 1) {
                    warning = $rootScope.i18n('l-fields');
                }
                angular.forEach(messages, function(item) {
                    warning = warning + ' ' + $rootScope.i18n(item) + ',';
                });
                if (messages.length > 1) {
                    warning = warning + ' ' + $rootScope.i18n('l-requireds');
                } else {
                    warning = warning + ' ' + $rootScope.i18n('l-required');
                }
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: $rootScope.i18n('l-attention'),
                    detail: warning
                });
            }*/

            return isInvalidForm;
        }
        
        this.Utf8Encode = function(strUni) {
		  return String(strUni).replace(
			/[\u0080-\u07ff]/g,  // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
			function (c) {
			  var cc = c.charCodeAt(0);
			  return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
			}
		  ).replace(
			/[\u0800-\uffff]/g,  // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
			function (c) {
			  var cc = c.charCodeAt(0);
			  return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);
			}
		  );
		}


		this.Utf8Decode = function(strUtf) {
		  return String(strUtf).replace(
			/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,
			function (c) {
			  var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | ( c.charCodeAt(2) & 0x3f);
			  return String.fromCharCode(cc);
			}
		  ).replace(
			/[\u00c0-\u00df][\u0080-\u00bf]/g,
			function (c) {
			  var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
			  return String.fromCharCode(cc);
			}
		  );
		}
        
        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************

        this.init = function() {

            if (appViewService.startView($rootScope.i18n('l-config-notif'), 'mpd.portal-config-notif-edit.Control', controller)) {
                // se é a abertura da tab, implementar aqui inicialização do controller            
            }
            
            this.load();            
        }

        // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) { this.init(); }

        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************

        // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            controller.init();
        });    
    }
 
    // registrar os controllers no angular 
    index.register.controller('mpd.portal-config-notif-edit.Control', portalConfigNotifEditController);    
});