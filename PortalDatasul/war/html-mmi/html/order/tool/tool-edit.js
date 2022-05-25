    define(['index',
            '/dts/mmi/js/zoom/tp-ferr.js'], function(index) {
    /**
     * ToolEditCtrl
     */
    toolEditController.$inject = [                                 
        '$rootScope',            
        '$scope',
        '$modalInstance',
        'model',
        '$filter',
        'TOTVSEvent',
        'mmi.bomn132.Service',
        '$timeout'];

    function toolEditController($rootScope, 
                                $scope,
                                $modalInstance,
                                model,
                                $filter,
                                TOTVSEvent,
                                bomn132Service,
                                $timeout) {
        
        /**
         * toolEditCtrl
         */ 
        var toolEditCtrl = this;
        
        this.tool = model;         
        
        this.headerTitle;
        
        // *********************************************************************************
        // *** Funções
        // *********************************************************************************

        /**
         * Salva ferramenta
         */
        this.save = function(again) {
            model.isSaveNew = again;
            //valida campos obrigatórios
            if (toolEditCtrl.isInvalidToolForm()) {
                return;
            }
                      
            if (toolEditCtrl.tool.isNew) {

                toolEditCtrl.saveRecord();
            } else {
                toolEditCtrl.updateRecord();
            }
            
        }

        /**
         * Criação de ferramenta
         */
      
        this.saveRecord = function() {

            toolEditCtrl.tool['nr-ord-produ'] = detailOrderCtrl.model['nr-ord-produ'];
            var tempo = String(toolEditCtrl.tool['tempo']);
            toolEditCtrl.tool['tempo'] = tempo.replace(",",".");
            toolEditCtrl.tool['cd-tp-ferr'] = toolEditCtrl.tool.ferramenta['cd-tp-ferr'];
            toolEditCtrl.tool['desc-ferr'] = toolEditCtrl.tool.ferramenta['descricao'];
                
            //chama BO para criação do registro
            bomn132Service.saveRecord(toolEditCtrl.tool, function(result) {
                if (!result.$hasError) {
                    toolEditCtrl.tool.refresh = true;
                    toolEditCtrl.sucessNotify();

                    if (model.isSaveNew){
                          toolEditCtrl.tool.ferramenta = undefined;
                          toolEditCtrl.tool['tempo'] = 0;          
                          $('#cd-tp-ferr').find('*').filter(':input:visible:first').focus();
                    }else                  
                        toolEditCtrl.close(); 
                }
            });
        }
         
        /**
         * Alteração da ferramenta
         */
               
        this.updateRecord = function() {
        	var toolId = {pNrOrdProdu: toolEditCtrl.tool['nr-ord-produ'], pCdTarefa: toolEditCtrl.tool['cd-tarefa'], pCdTpFerr: toolEditCtrl.tool['cd-tp-ferr']};
            toolEditCtrl.tool.tempo = String(toolEditCtrl.tool.tempo).replace(",",".");            
                       
            var params = {
                    tempo: toolEditCtrl.tool.tempo
                };
          
            bomn132Service.updateRecord(toolId, params, function(result) {
                if (!result.$hasError) {
                	toolEditCtrl.tool.refresh = true;
                    toolEditCtrl.sucessNotify(true);
                    toolEditCtrl.close();
                }
            });
        }
        
        /**
         * Notifica criação e alteração do registro
         */
        this.sucessNotify = function(isUpdate) {
            // notifica o usuario que conseguiu salvar o registro
            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                type: 'success',
                title: (isUpdate ? $rootScope.i18n('msg-tool-updated') : $rootScope.i18n('msg-tool-created')),
                detail: (isUpdate ? $rootScope.i18n('msg-success-tool-updated') : $rootScope.i18n('msg-success-tool-created'))
            });
        }

        /**
         * Método para verificar se o formulario é invalido
         */
        this.isInvalidToolForm = function() {
            var messages = [];
            var isInvalidForm = false;
            
            // verifica se a tarefa foi informado
            if (!this.tool['cd-tarefa'] || this.tool['cd-tarefa'].length === 0) {
                isInvalidForm = true;
                messages.push('l-task');
            }

            // verifica se a ferramenta foi informada
            if (!this.tool.ferramenta) {
                isInvalidForm = true;
                messages.push('l-tool');
            }
            
            // verifica se o tempo foi informado
            if (!this.tool['tempo'] || this.tool['tempo'].length === 0) {
                isInvalidForm = true;
                messages.push('l-time-2');
            }            


            // se for invalido, monta e mostra a mensagem
            if (isInvalidForm) {
                var warning = $rootScope.i18n('l-field');
                if (messages.length > 1) {
                    warning = $rootScope.i18n('l-fields');
                }
                angular.forEach(messages, function(item) {
                    warning = warning + ' ' + $rootScope.i18n(item) + ',';
                });
                if (messages.length > 1) {
                    warning = warning + ' ' + $rootScope.i18n('l-requireds-2');
                } else {
                    warning = warning + ' ' + $rootScope.i18n('l-required-2');
                }
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: $rootScope.i18n('l-attention'),
                    detail: warning
                });
            }

            return isInvalidForm;
        }

        /**
         * Fechar janela
         */
        /**
         * Fechar janela
         */
         toolEditCtrl.close = function () {
            
            $modalInstance.close();
         }

         toolEditCtrl.cancel = function () {
        	        	
            if (toolEditCtrl.isSaveNew)
                toolEditCtrl.close();
            else
                $modalInstance.dismiss();// dismiss é o fechamento quando cancela ou quando clicar fora do modal (ESC)
        }
        
        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************
         
        this.init = function() {
        	
        	 model.isSaveNew = false;
        	
        	if (toolEditCtrl.tool.isNew) {
               toolEditCtrl.headerTitle = $rootScope.i18n('l-add');
               $timeout(function() {
           		$('#cd-tarefa').find('*').filter(':input:visible:first').focus();
               },500);
            } else {
              toolEditCtrl.tool.ferramenta = {};
        	  toolEditCtrl.tool.ferramenta['cd-tp-ferr'] = toolEditCtrl.tool['cd-tp-ferr'];
        	  toolEditCtrl.tool.tempo = String(toolEditCtrl.tool.tempo).replace(/\./g, "");
              toolEditCtrl.headerTitle = $rootScope.i18n('l-edit');
              $timeout(function() {
          		$('#tempo').find('*').filter(':input:visible:first').focus();
              },500);
            }
        }
         
        // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) { this.init(); }
        
        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {         
            $modalInstance.dismiss('cancel');
        });
         
        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************
         
        // cria um listerner de evento para inicializar o toolEditCtrl somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            toolEditCtrl.init();
        });
            
    }
        index.register.controller('mmi.order.toolEditCtrl', toolEditController);
});
