define(['index',
	    '/dts/mpd/js/api/fchdis0058.js',
		'/dts/dts-utils/js/msg-utils.js',
       ], function(index) {

	notificationOrderConfig.$inject = ['$rootScope',
		'$scope',
		'$compile',
		'$stateParams',
		'$window',
		'$location',
		'$state',
		'totvs.app-main-view.Service',
		'mpd.fchdis0058.Factory',
		'TOTVSEvent',
		'orderByFilter',
		'$http',
		'dts-utils.message.Service'];
	function notificationOrderConfig($rootScope,
									 $scope,
									 $compile,
									 $stateParams,
									 $window,
									 $location,
									 $state,
									 appViewService,
									 fchdis0058,
									 TOTVSEvent,
									 orderByFilter,
									 $http,
									 messageUtils) {

		var controller = this;
		var usaApp = false;

		controller.message = {"message_code": 0,
							  "param_name":"",
							  "message_label":"",
							  "send_notification":false,
							  "use_html_model":false,
							  "message_text":"",
							  "message_model_text":"",
							  "template":"",
							  "send_print_order":false};

		controller.link_order_detail = '';
		controller.rpw_server_name = '';
		controller.send_notifications_to_portal = false;
		controller.send_notificatioins_to_internal_order = false;
		controller.paramEmail = [];
		
		controller.expandMessages = $rootScope.i18n('l-show-details');
		controller.resumedMessages = $rootScope.i18n('l-hidden-details');
		controller.sendNotificationIcon = $rootScope.i18n('l-send-email-notif');
		controller.noSendNotificationIcon = $rootScope.i18n('l-not-send-email-notif');
		controller.useMessageModel = $rootScope.i18n('l-carries-model-html');


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


		this.setEdit = function(message){
			message.messagesBack = angular.copy(message);

			message.edit_message = true;
			message.expandeddetail = true;
		}

		this.setCancel = function(message){

			message['send_notification'] = message.messagesBack['send_notification'];
			message['use_html_model'] = message.messagesBack['use_html_model'];
			message['send_print_order'] = message.messagesBack['send_print_order'];
			message['message_text'] = message.messagesBack['message_text'];
			message['message_model_text'] = message.messagesBack['message_model_text'];

			message.edit_message = false;
			message.expandeddetail = false;
		}

		this.setSave = function(message){

			controller.paramEmailToSave = [];

			if(!controller.validateMaxLenghtMessage(message.message_text)){
				return;
			}

			controller.message.messagesBack = angular.copy(controller.message);

			message.edit_message = false;
			message.expandeddetail = false;

			angular.forEach(orderByFilter(controller.messages, 'message_code', true), function(message, key) {
				angular.forEach(orderByFilter(controller.paramEmail, 'cod-param', true), function(param, key2) {

					if(message.message_code == param['num-livre-1']){

						var codParam = param['cod-param'];

						//Leitura do campo de mensagem
						if (codParam.toLowerCase().indexOf("email.text.") >= 0){
							param['cod-val-param'] = message.message_text;
						}else{
							//Leitura do campo mensagem no formato html
							if (codParam.toLowerCase().indexOf("email.html.") >= 0){
								param['cod-val-param'] = message.use_html_model;
							}else{
								//Leitura do campo envia anexo
								if (codParam.toLowerCase().indexOf("email.anexo.") >= 0){
									param['cod-val-param'] = message.send_print_order;
								}else{
									if (codParam.toLowerCase().indexOf("email.") >= 0){
										param['cod-val-param']  = message.send_notification;
									}
								}
							}
						}
					}
				});

				/*Quebra o modelo (template) html da mensagem em parametros com no maximo 500 caracteres*/
				controller.breakTextMessage(message);
			});

			for (m = 0; m < controller.paramEmail.length; m++) {
				if(controller.paramEmail[m]['num-livre-1'] == message.message_code){
					controller.paramEmailToSave.push(controller.paramEmail[m]);
				}
			}

			fchdis0058.putMessageNotifications(controller.paramEmailToSave, function(result){
				if(!result.$hasError == true){
					controller.load();
				}
			});
		}

		controller.splitString = function (string, size) {

			var stringClean = controller.Utf8Encode(string.split('"').join('`'));

			var re = new RegExp('.{1,' + size + '}', 'g');
			return stringClean.match(re);
		}

		controller.breakTextMessage = function(message){

			var messageModelText = message.message_model_text;

			//Cria um array com o modelo  (template) html quebrado por 500 caracteres
			var arrayMessageModelText = controller.splitString(messageModelText, 500);

			if(arrayMessageModelText){

				var icount = 0;
				var icountName = '';

				for (i = 0; i < arrayMessageModelText.length; i++) {

					if(arrayMessageModelText[i]){

						icount = icount + 1;

						if(icount <= 9){
							icountName = '000000' + icount;
						}else{
							if(icount <= 99){
								icountName = '00000' + icount;
							}else{
								if(icount <= 999){
									icountName = '0000' + icount;
								}else{
									if(icount <= 9999){
										icountName = '000' + icount;
									}else{
										if(icount <= 99999){
											icountName = '00' + icount;
										}else{
											if(icount <= 999999){
												icountName = '0' + icount;
											}else{
												icountName = icount;
											}
										}
									}
								}
							}
						}


						controller.paramEmail.push({'cod-param': 'notification.model.' + message.param_name  +  icountName,
													'cod-val-param': arrayMessageModelText[i],
													'num-livre-1': message.message_code,
													'num-livre-2': icount});
					}
				}

				message.message_model_text = "";
			}

		}


		this.cancelEditModelHTML = function(message){
			message.message_model_text = message.old_message_model_text;
			message.show_html_editor_code = false;
		}


		this.confirmEditModeHtml = function(message){			
			if (usaApp){
				$http.get("../dts/mpd/html/notificationorderconfig/modelappinformation.html").then(function(responseApp) {
					message.message_model_app = responseApp.data;
					
					message.message_model_text = message.message_model_text.replace("[[link-dowload-app]]", message.message_model_app);
				});
			} else {
				message.message_model_text = message.message_model_text.replace("[[link-dowload-app]]", "");
			}
		}


		this.editModelHTML = function(message){
			message.old_message_model_text = message.message_model_text;
			message.show_html_editor_code = false;

			$('#modalEditHTML' + message.message_code).modal({
				show: 'true'
			});
		}


		this.getTemplateHTML = function(message){

			$http.get("../dts/mpd/html/notificationorderconfig/modelmessage.html").then(function(response) {
				message.message_model_text = response.data;				

				if (usaApp){
					$http.get("../dts/mpd/html/notificationorderconfig/modelappinformation.html").then(function(responseApp) {
						message.message_model_app = responseApp.data;
						
						message.message_model_text = message.message_model_text.replace("[[link-dowload-app]]", message.message_model_app);
						controller.compileHtmlTemplate(message);
					});					
				} else {
					message.message_model_text = message.message_model_text.replace("[[link-dowload-app]]", "");
					controller.compileHtmlTemplate(message);
				}				
			});
		}

		this.validateMaxLenghtMessage = function(value){
			if(value){
				if (value.length > 2000){
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
					   title: $rootScope.i18n('l-warning'),
					   detail: $rootScope.i18n('l-limit-msg')
					});

					return false;
				}else{
					return true;
				}
			}else{
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					title: $rootScope.i18n('l-warning'),
					detail: $rootScope.i18n('l-notif-msg')
				});
				return false;
			}
		}

		this.confirmLoadTemplate = function(message){

			message.old_message_model_text = message.message_model_text;

			if(message.message_model_text){
				messageUtils.question( {
					title: 'l-load-default-html',
					text: $rootScope.i18n('l-change-default-model'),
					cancelLabel: 'Não',
					confirmLabel: 'Sim',
					callback: function(isPositiveResult) {
						if (isPositiveResult) {
							controller.getTemplateHTML(message);

							$('#modalEditHTML' + message.message_code).modal({
								show: 'true'
							});
						}
					}
				});
			}else{
				controller.getTemplateHTML(message);

				$('#modalMessageShow' + message.message_code).modal({
					show: 'true'
				});
			}

		}

		this.saveParams = function(){

			var paramsToSave = [];

			for (u = 0; u < controller.paramEmail.length; u++) {

				if(controller.paramEmail[u]['num-livre-1'] == 19){
					controller.paramEmail[u]['cod-val-param'] = controller.link_order_detail;
					paramsToSave.push(controller.paramEmail[u]);
				}
				if(controller.paramEmail[u]['num-livre-1'] == 20){
					controller.paramEmail[u]['cod-val-param'] = controller.rpw_server_name;
					paramsToSave.push(controller.paramEmail[u]);
				}

				if(controller.paramEmail[u]['num-livre-1'] == 21){
					controller.paramEmail[u]['cod-val-param'] = controller.send_notifications_to_portal;
					paramsToSave.push(controller.paramEmail[u]);
				}
				if(controller.paramEmail[u]['num-livre-1'] == 22){
					controller.paramEmail[u]['cod-val-param'] = controller.send_notificatioins_to_internal_order;
					paramsToSave.push(controller.paramEmail[u]);
				}

			};

			fchdis0058.putParamNotifications(paramsToSave, function(result){
				if(!result.$hasError == true){
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
					   title: $rootScope.i18n('l-warning'),
					   detail: $rootScope.i18n('l-parameters-save')
					});
					controller.load();
				}
			});

		}

		this.showMessage = function(message){

			if(!message.use_html_model && !message.message_text){
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						title: $rootScope.i18n('l-warning'),
						detail: $rootScope.i18n('l-without-msg-notif')
					});
			}else{

				if(message.use_html_model && !message.message_model_text){
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						title: $rootScope.i18n('l-warning'),
						detail: $rootScope.i18n('l-without-model-html')
					});
				}else{

					controller.compileHtmlTemplate(message);

					$('#modalMessageShow' + message.message_code).modal({
						show: 'true'
					});
				}
			}
		}

		this.compileHtmlTemplate = function(messageToCompile){

			var message = angular.copy(messageToCompile);

			message.message_model_text = message.message_model_text.replace("[[nome-evento-pedido]]", message.message_label);
			message.message_model_text = message.message_model_text.replace("[[mensagem-evento-pedido]]", message.message_text);
			message.message_model_text = message.message_model_text.replace("[[endereco-visualizacao-pedido]]", controller.link_order_detail);

			var modalContentId = '#modalContentMessageShow' + message.message_code;

			var modalContent = angular.element(document).find(modalContentId);

			if(messageToCompile.use_html_model == true){

				message.message_model_text = '<html><div style="margin: 10px">' + message.message_model_text + '<div></html>';

				var template = angular.element(message.message_model_text);

				var templateCompiled = $compile(template);

				var elementTemplate = templateCompiled($scope);

				modalContent.html(elementTemplate);
			}else{
				modalContent.text(message.message_text);
			}
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


		this.load = function(){

			fchdis0058.getParamNotifications(function(data){

				controller.paramEmail = [];

				for (i = 0; i < data.length; i++) {

					if(data[i]['cod-param'] == "portal-app"){
						if (data[i]['cod-val-param'] == 'yes' || data[i]['cod-val-param'] == 'true'){
							usaApp = true;
						} else {
							usaApp = false;
						}
					}				

					stringJson = angular.toJson(data[i]);
					controller.paramEmail.push(JSON.parse(stringJson));
				};

				for (y = 0; y < controller.messages.length; y++) {
					for (z = 0; z < controller.paramEmail.length; z++) {

						if(controller.messages[y].message_code == controller.paramEmail[z]['num-livre-1']){

							var codParam = controller.paramEmail[z]['cod-param'];

							//Leitura do campo de mensagem
							if (codParam.toLowerCase().indexOf("email.text.") >= 0){
								controller.messages[y].message_text = controller.paramEmail[z]['cod-val-param'];
							}else{
								//Leitura do campo mensagem no formato html
								if (codParam.toLowerCase().indexOf("email.html.") >= 0){
									if(controller.paramEmail[z]['cod-val-param'] == "yes" || controller.paramEmail[z]['cod-val-param'] == "true"){
										controller.messages[y].use_html_model = true;
									}else{
										controller.messages[y].use_html_model = false;
									}

								}else{
									//Leitura do campo envia anexo
									if (codParam.toLowerCase().indexOf("email.anexo.") >= 0){
										if(controller.paramEmail[z]['cod-val-param'] == "yes" || controller.paramEmail[z]['cod-val-param'] == "true"){
											controller.messages[y].send_print_order = true;
										}else{
											controller.messages[y].send_print_order = false;
										}
									}else{
										if (codParam.toLowerCase().indexOf("email.") >= 0){
											//Leitura do campo envia notificação para o evento
											if(controller.paramEmail[z]['cod-val-param'] == "yes" || controller.paramEmail[z]['cod-val-param'] == "true"){
												controller.messages[y].send_notification = true;
											}else{
												controller.messages[y].send_notification = false;
											}
										}
									}
								}
							}

							//Monta o modelo (template) html com varios registros
							if ((codParam.toLowerCase().indexOf("notification.model.") >= 0) && (controller.paramEmail[z]['num-livre-2'] > 0)){
								controller.messages[y].message_model_text = controller.messages[y].message_model_text + controller.Utf8Decode(controller.paramEmail[z]['cod-val-param'].split('`').join('"'));
							}

						}

					};

				};


				for (w = 0; w < controller.paramEmail.length; w++) {
					if(controller.paramEmail[w]['num-livre-1'] == 19){
						controller.link_order_detail = controller.paramEmail[w]['cod-val-param'];
					}

					if(controller.paramEmail[w]['num-livre-1'] == 20){
						controller.rpw_server_name = controller.paramEmail[w]['cod-val-param'];
					}

					if(controller.paramEmail[w]['num-livre-1'] == 21){
						if(controller.paramEmail[w]['cod-val-param'] == "yes" || controller.paramEmail[w]['cod-val-param'] == "true"){
							controller.send_notifications_to_portal = true;
						}else{
							controller.send_notifications_to_portal = false;
						}
					}

					if(controller.paramEmail[w]['num-livre-1'] == 22){
						if(controller.paramEmail[w]['cod-val-param'] == "yes" || controller.paramEmail[w]['cod-val-param'] == "true"){
							controller.send_notificatioins_to_internal_order = true;
						}else{
							controller.send_notificatioins_to_internal_order = false;
						}
					}

				};

				//Remove os modelos (template) após monta-los na mensagem em tela (message.message_model_text)
				controller.removeModelText();

			})

		}


		this.removeModelText = function(){
			var arrayToDelete = [];

			for (i = 0; i < controller.paramEmail.length; i++) {
				if(controller.paramEmail[i]['num-livre-2'] > 0){
					arrayToDelete.push(controller.paramEmail[i]);
				}
			}

			for (i = 0; i < controller.paramEmail.length; i++) {
				for (x = 0; x < arrayToDelete.length; x++) {
					if(controller.paramEmail[i]['cod-param'] == arrayToDelete[x]['cod-param']){
						controller.paramEmail.splice(i, 1);
					}
				}
			}
		};


		this.init = function() {
			if (appViewService.startView($rootScope.i18n('l-order-email-notif'), 'mpd.notificationorderconfig.controller', controller)) {
				// se é a abertura da tab, implementar aqui inicialização do controller     		
				this.startMessages();
			}else{
				this.startMessages();
			}

			this.load();
		}

		this.changeShowHTML = function(message, change){
			message.show_html_editor_code = change;
		}

		this.startMessages = function(){

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
			controller.message.param_name = 'suspensao-comercial-pedido';
			controller.messages.push(angular.copy(controller.message));
			*/


		}

		// se o contexto da aplicação já carregou, inicializa a tela.
		if ($rootScope.currentuserLoaded) {
			this.init();
		}

	};

	// registrar os controllers no angular
	index.register.controller('mpd.notificationorderconfig.controller', notificationOrderConfig);
});
