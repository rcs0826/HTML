define(['index',
    '/dts/mcc/js/api/ccapi362.js',
    '/dts/mpd/js/zoom/mensagem.js'
	], function(index){

		configEmailController.$inject = ['$rootScope', '$scope', '$modalInstance', 'parameters', 'TOTVSEvent', 'mcc.ccapi362.Factory', 'mcc.utils.Service', 'mpd.mensagem.zoom', '$totvsprofile'];		
		function configEmailController($rootScope, $scope, $modalInstance, parameters, TOTVSEvent, ccapi362, serviceUtils, serviceMessage, $totvsprofile ){

			var ctrl = this;	
            ctrl.model = {};
            ctrl.model.processQuotation = 0;
            ctrl.model.infoSend = [];
            ctrl.model.dateSend = null;
            ctrl.model.timeSend = null;
            ctrl.model.dataSendFrom = null;
            ctrl.model.timeSendFrom = null;
            ctrl.model.currentMessage;
			
			/* 
			 * Objetivo: método de inicialização da tela
			 * Parâmetros: 
			 */
			ctrl.init = function() {	 
                ctrl.model.processQuotation = parameters.cddSolicit;
                
                ccapi362.getQuotationProcessHeader({'pQuotationProcessNumber' : ctrl.model.processQuotation}, function(result){
                    ctrl.afterGetData(result);
                });
            }
            
            /* 
             * Objetivo: Método executado após a busca das informações
             * Parâmetros: result: Dados retornados dos métodos de busca
             */
            ctrl.afterGetData = function(result){
                if(result){ 
                    ctrl.model.infoSend = result[0];
                    ctrl.model.dateSendComplete = new Date(ctrl.model.infoSend['dtm-expirac']);
                    ctrl.model.dateSendFromComplete = new Date(ctrl.model.infoSend['dtm-liber']);
                    
                    ctrl.model.dateSend = new Date(Date.UTC(ctrl.model.dateSendComplete.getFullYear(),
                                                            ctrl.model.dateSendComplete.getMonth(), 
                                                            ctrl.model.dateSendComplete.getDate()));
                    ctrl.model.timeSend = ctrl.model.dateSendComplete.getHours() + ":" + ctrl.model.dateSendComplete.getMinutes();

                    ctrl.model.dateSendFrom = new Date(Date.UTC(ctrl.model.dateSendFromComplete.getFullYear(),
                                                                 ctrl.model.dateSendFromComplete.getMonth(), 
                                                                 ctrl.model.dateSendFromComplete.getDate()));
                    ctrl.model.timeSendFrom = ctrl.model.dateSendFromComplete.getHours() + ":" + ctrl.model.dateSendFromComplete.getMinutes();

					ctrl.model.infoSend['dtm-liber'] = serviceUtils.millisToUTCDate(ctrl.model.infoSend['dtm-liber']);
					ctrl.model.infoSend['dtm-criac'] = serviceUtils.millisToUTCDate(ctrl.model.infoSend['dtm-criac']);
                }
            }

            /* 
			 * Objetivo: Salva as informações de tela
			 * Parâmetros: action: all - Aplica a todos
             *                     new - Aplica somente aos novos
			 */
			ctrl.apply = function(action){	
                // verificar se o formulario tem dados invalidos
	            if (this.isInvalidForm()) { return; }
                
                var applyToAll = false;
                
                if (action == 'all') {
                    applyToAll = true;
                } 
                
                var quotationValidDate = new Date(ctrl.model.dateSend);
                
                if (ctrl.model.timeSend.length <= 4) {
                    ctrl.model.timeSend = "0" + ctrl.model.timeSend;
                }
                
                if (ctrl.model.infoSend['log-responde-via-web']) {
                    var validDatdFrom = new Date(ctrl.model.dateSendFrom);
                    
                    if (ctrl.model.timeSendFrom.length <= 4) {
                        ctrl.model.timeSendFrom = "0" + ctrl.model.timeSendFrom;
                    }
                    
                    validDatdFrom.setUTCHours(ctrl.model.timeSendFrom.substr(0,2));
                    validDatdFrom.setUTCMinutes(ctrl.model.timeSendFrom.substr(3,2));
                    ctrl.model.infoSend['dtm-liber'] = validDatdFrom;
                } else {
                    ctrl.model.infoSend['dtm-liber'] = null;
                }

                quotationValidDate.setUTCHours(ctrl.model.timeSend.substr(0,2));
                quotationValidDate.setUTCMinutes(ctrl.model.timeSend.substr(3,2));
                ctrl.model.infoSend['dtm-expirac'] = quotationValidDate;
                
                ccapi362.saveQuotationProcessConfigEmail({},{
                                                        'ttQuotationProcess' : ctrl.model.infoSend,
                                                        'applyToAll' : applyToAll}, function(result){
                    if(!result['$hasError']){
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'success',
                            title: $rootScope.i18n('l-quotation-process', [], 'dts/mcc'),
                        detail: $rootScope.i18n('l-quotation-process', [], 'dts/mcc') + ': ' + ctrl.model.processQuotation + ', ' +
                            $rootScope.i18n('l-success-updated', [], 'dts/mcc') + '!'
                        });
                        $modalInstance.close();
                    }
                });	
                
                ctrl.saveUsuarConfig();
			}
            
            /* 
             * Objetivo: Verificar se o formulario é válido
             * Parâmetros: 
			 */
            ctrl.isInvalidForm = function() {            
                var messages = [];
                var isInvalidForm = false;

                var requireLabels = {
                    'dateFrom' : 'l-valid-date-from',
                    'hourFrom' : 'l-valid-hour-from',
                    'dateUntil' : 'l-valid-date-until',
                    'hourUntil' : 'l-valid-hour-until'
                }
                
                if (!ctrl.model.timeSend || ctrl.model.timeSend.length == 0) {
                    isInvalidForm = true;
                    messages.push(requireLabels['hourUntil']);
                }
                
                if (!ctrl.model.dateSend || ctrl.model.dateSend == null) {
                    isInvalidForm = true;
                    messages.push(requireLabels['dateUntil']);
                }

                if (!ctrl.model.timeSendFrom || ctrl.model.timeSendFrom.length == 0) {
                    isInvalidForm = true;
                    messages.push(requireLabels['hourFrom']);
                }
                
                if (!ctrl.model.dateSendFrom || ctrl.model.dateSendFrom == null) {
                    isInvalidForm = true;
                    messages.push(requireLabels['dateFrom']);
                }

                // se for invalido, monta e mostra a mensagem
                if (isInvalidForm) {
                    var warning = $rootScope.i18n('l-field', [], 'dts/mcc');
                    if (messages.length > 1) {
                        warning = $rootScope.i18n('l-fields', [], 'dts/mcc');
                    }
                    angular.forEach(messages, function(item) {
                        warning = warning + ' ' + $rootScope.i18n(item) + ((messages.length > 1)?',':'');
                    });
                    if (messages.length > 1) {
                        warning = warning + ' ' + $rootScope.i18n('l-requireds', [], 'dts/mcc');
                    } else {
                        warning = warning + ' ' + $rootScope.i18n('l-required', [], 'dts/mcc');
                    }
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error',
                        title: $rootScope.i18n('l-attention', [], 'dts/mcc'),
                        detail: warning
                    });
                }            
                return isInvalidForm;
            }
            
            /* 
			 * Objetivo: Salvar as configurações de e-mail por usuário
			 * Parâmetros: 
			 */
            ctrl.saveUsuarConfig = function() {
                var profileDataArray = [];
                var profileData;
                profileData = {dataCode:'EmailTitle', dataValue: ctrl.model.infoSend['assunto-email']};
                profileDataArray[0] = profileData;
                profileData = {dataCode:'EmailMsg', dataValue: ctrl.model.infoSend['cdn-mensagem']};
                profileDataArray[1] = profileData;
                profileData = {dataCode:'EmailText', dataValue: ctrl.model.infoSend['dsl-texto']};
                profileDataArray[2] = profileData;
                profileData = {dataCode:'sendSpreadsheet', dataValue: ctrl.model.infoSend['log-planilha-envda']};
                profileDataArray[3] = profileData;
                profileData = {dataCode:'answerByWeb', dataValue: ctrl.model.infoSend['log-responde-via-web']};
                profileDataArray[4] = profileData;

                $totvsprofile.remote.set('/dts/mcc/requestquotation',profileDataArray, function(result){});
			}
            
			/* 
			 * Objetivo: Cancelar alterações feitas e fechar o modal 
			 * Parâmetros: 
			 */
			ctrl.cancel = function() {
				$modalInstance.dismiss('cancel');
			}						

            /* 
			 * Objetivo: Quando alterada a mensagem busca o texto
			 * Parâmetros: 
			 */
            ctrl.onChangeMessage = function(){
                if(ctrl.model.infoSend['cdn-mensagem'] !== undefined && ctrl.model.infoSend['cdn-mensagem'] != ctrl.model.currentMessage){
                   var promiseMessage = serviceMessage.getMensagem(ctrl.model.infoSend['cdn-mensagem']);
                    if(promiseMessage){
                        if(promiseMessage.then){
                            promiseMessage.then(function(message){
                                ctrl.model.infoSend['dsl-texto'] = message[0]['texto-mensag'];
                            });
                        }
                    }
                    ctrl.model.currentMessage = ctrl.model.infoSend['cdn-mensagem'];
                }
            }

			ctrl.init();
		}

		index.register.controller('mcc.requestquotation.modal.ConfigEmailCtrl', configEmailController);
        
	});
