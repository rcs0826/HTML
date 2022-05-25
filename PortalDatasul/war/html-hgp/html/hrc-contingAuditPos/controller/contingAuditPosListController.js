define(['index',
    '/dts/hgp/html/hrc-contingAuditPos/contingAuditPosFactory.js',
    '/dts/hgp/html/hrc-contingAuditPos/controller/contingAuditPosAdvancedFilterController.js',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    contingAuditPosListController.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service',
                                                  'hrc.contingAuditPos.Factory','global.userConfigs.Factory',
                                                  '$modal','AbstractAdvancedFilterController','TOTVSEvent'];
    function contingAuditPosListController($rootScope, $scope, appViewService,contingAuditPosFactory,
                                                userConfigsFactory,$modal,AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;
        $scope.StringTools = StringTools;

        _self.cdProgramaCorrente = 'hrc.contingAuditPosList';
        _self.config = [];
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.disclaimers = [];
        _self.listOfContingAuditPos = [];
        _self.listOfContingAuditPosCount = 0;        
        
        this.search = function (isMore) {

            var startAt = 0;
            _self.listOfContingAuditPosCount = 0;

            if (isMore) {
                startAt = _self.listOfContingAuditPos.length + 1;
            } else {
                _self.listOfContingAuditPos = [];
            }
            
            //Testa se foi preenchido o campo de busca
            if ((!angular.isUndefined(_self.searchInputText))
                && _self.searchInputText !== ''){

                //Remove todos os disclaimers
                var arrayLength = _self.disclaimers.length - 1;
                for (var i = arrayLength ; i >= 0 ; i--) {
                    _self.disclaimers.splice(i, 1);
                }   
            }

            //Limpa o campo de busca 
            _self.searchInputText = '';

            //Caso não possua disclaimers não realiza a busca
            if(_self.disclaimers.length == 0){
                return;
            }
           
            //Busca os periodos com os filtros informados, retornando o numero de registros configurados após o campo startAt
            contingAuditPosFactory.getContingAuditPosByFilter('', startAt, parseInt(_self.config.qtdRegistrosBusca), true, _self.disclaimers, function (result) {
                _self.hasDoneSearch = true;
                //Se encontrou resultados, preenche a lista de periodos com os mesmos.
                if (result) {
                    angular.forEach(result, function (value) {
                        _self.listOfContingAuditPos.push(value);

                        if (value && value.$length) {
                            _self.listOfContingAuditPosCount = value.$length;
                        }

                    });
                    
                    if (isMore === false) {
                        $('.page-wrapper').scrollTop(0);
                    }
                }
            });

            /* seta botao selecionar todos para false */ 
            _self.bsswitch = false;
        };

        this.retronaSelecionados = function (){

            var selecionados = [];

            _self.listOfContingAuditPos.forEach(
                function (item) { 
                    if (item.$selected) { 
                        check = {};
                        check.nmPropriedade = item.$$hashKey;
                        check.valorCampo = _self.idRegistro(item);
    
                        selecionados.push(check);
                    }
                }
            );

            return selecionados;
        }

        this.removeContingAuditPos = function () {

            var selecionados = this.retronaSelecionados();

            if (selecionados.length==0){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title:  'Nenhum registro selecionado'
                });
                return;
            }

            else{
                $('#justificativaModal').modal();
                $('#justificativaModal').show();
                $('.modal-backdrop').show();
            }
        };   

        this.sendContingAuditPos = function () {

            var selecionados = this.retronaSelecionados();

            if (selecionados.length == 0){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Nenhum registro selecionado!'
                });
                return;
            }

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Atenção!',
                text: 'Deseja enviar/reenviar o(s) registro(s) selecionados(s)?',
                cancelLabel: 'Não',
                confirmLabel: 'Sim',
                size: 'md',
                callback: function (hasChooseYes) {
                    if (hasChooseYes != true) 
                        return;
                    else{
						contingAuditPosFactory.sendContingAuditPos(selecionados, function (result) {
                            try{
								if (result[0].ErrorSubType == "ERROR"){
									$rootScope.$broadcast(TOTVSEvent.showNotification, {
										type: 'error', title:  result[0].ErrorDescription
									});
								
                                	return;
                            	}
							}
							catch(error){}							
							
                        	$rootScope.$broadcast(TOTVSEvent.showNotification, {
                            	type: 'success', title: 'Registro enviado do com sucesso, relatório foi enviado para a central de documentos.'
                        	});

                        	_self.search(false);
							
                        });
                    }
                }
            }); 
        };   

        this.cancel = function () {
            $('#justificativaModal').hide();
            $('.modal-backdrop').hide();
            this.valueTextarea = "";
        };

        this.libera = function () {

            if ((angular.isUndefined(this.valueTextarea)) || (
                (!angular.isUndefined(this.valueTextarea)) && (this.valueTextarea.trim() == ""))) {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title:  'Justificativa não foi informada'
                });
                return;
            }

            else{
                /* coloca os registros selecionados na temp que sera enviada ao progress */ 
                var selecionados = this.retronaSelecionados();

                selecionados.push({
                    nmPropriedade : "justificativa",
                    valorCampo : this.valueTextarea
                });
                                
                contingAuditPosFactory.removeContingAuditPos(selecionados, function (result) {
                    
                    if(result.$hasError == true){
                        return;
                    }

                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'Registro liberado do com sucesso, relatório foi enviado para a central de documentos.'
                    });
                    _self.search(false);
                });
            }
            
            this.cancel();
        };

        this.openAdvancedSearch = function (tipoSelecao) {            

            if(_self.selecaoBkpAux != tipoSelecao){
                _self.disclaimers = [];
            }

            _self.selecaoBkpAux = tipoSelecao;

            var advancedFilter = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrc-contingAuditPos/ui/contingAuditPosAdvancedFilter.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrc.contingAuditPosAdvFilter.Control as afController',
                resolve: {
                    disclaimers: function () {
                        return _self.disclaimers;
                    },
                    AbstractAdvancedFilterController : function(){
                        return AbstractAdvancedFilterController;
                    },
                    parametros: function () {
                        tipo = {'selecao': tipoSelecao};                    
                        return tipo;
                    }
                }
            });
            
            /* verifica o tipo de processo selecionado e habilita botoes */ 
            advancedFilter.result.then(function (disclaimers) {
                vetorFiltrado = disclaimers.filter( function(item) { 
                                                    if (item.property == "inTipoProcesso") 
                                                        return item
                                                });
                if (vetorFiltrado && vetorFiltrado.length == 1)
                    _self.botaoTipoProcesso(vetorFiltrado[0].value);

                _self.search(false);

            });
        };

        this.botaoTipoProcesso = function (tipoBotao) {

            if (tipoBotao == "contingencia"){
                $("#btnEnviar").hide();
                $("#btnLiberar").show();
            } else 
            {
                $("#btnEnviar").show();
                $("#btnLiberar").hide();
            }

        };

        this.openConfigWindow = function () {

            var configWindow = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrc-contingAuditPos/ui/contingAuditPosListConfiguration.html',
                size: 'sm',
                backdrop: 'static',
                controller: 'global.genericConfigController as controller',
                resolve: {
                    config: function () {
                        return angular.copy(_self.config);
                    },
                    programName: function(){
                        return _self.cdProgramaCorrente;
                    },
                    extensionFunctions: function(){
                        var funcs = {};
                        funcs.setCurrentFilterAsDefault = function(){
                            this.config.disclaimers = angular.copy(_self.disclaimers);
                        };     
                        return funcs;
                    }
                }
            });

            configWindow.result.then(function (config) {
                _self.config = angular.copy(config);
            });
        };

        this.init = function(){

            appViewService.startView("Contigencia/Envio Auditoria POS", 'hrc.contingAuditPosList.Control', _self);
                        
            if(appViewService.lastAction != 'newtab'){
                return;
            }

            _self.selecaoBkpAux = "";

            userConfigsFactory.getConfigByKey(
                $rootScope.currentuser.login, 
                _self.cdProgramaCorrente,
            function(result){
               if(angular.isUndefined(result) == true){
                    _self.config = {lgBuscarAoAbrirTela : true,
                                    qtdRegistrosBusca   : "20"};
                    _self.search(false);            
               }else{
                    _self.config = result.desConfig;
                    
                    if(_self.config.disclaimers){
                        _self.disclaimers = angular.copy(_self.config.disclaimers);
                    }
                    
                    if(_self.config.lgBuscarAoAbrirTela == true){
                        _self.search(false);
                   }
               }
               /* Esconde modal da justificativa */ 
               $('#justificativaModal').hide();
               $('.modal-backdrop').hide();
            });         
        };

        this.selecionaTodos = function() {
            _self.listOfContingAuditPos.forEach( 
                function(item) {
                    _self.selecionaItem(item, document.getElementById("selecionaTodos").getElementsByClassName("bootstrap-switch-on").length);
                }
            );
        }

        this.selecionaItem = function (chave, obriga ) {
            linha = document.getElementById(chave.$$hashKey);
            check = document.getElementById("select-" + chave.$$hashKey);
            if (((obriga === 3) && check.checked) || obriga === 0) {
                $(linha).removeClass("linhaVerde");
                check.checked = false;
                chave.$selected = false;
            } else if ((obriga === 1) || ((obriga === 3) && !check.checked)) {
                $(linha).addClass("linhaVerde");
                check.checked = true;
                chave.$selected = true;
            }
        }

        this.idRegistro = function (contingAuditPos) {
            return contingAuditPos.cd_unidade+";"+contingAuditPos.cd_unidade_prestadora+";"+contingAuditPos.cd_transacao+";"+contingAuditPos.nr_serie_doc_original+";"+contingAuditPos.nr_doc_original+";"+contingAuditPos.nr_doc_sistema;
        }

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

        if ($rootScope.currentuserLoaded) {
            this.init();
        } else {
            $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
                _self.init();
            });
        }
    }
    index.register.controller('hrc.contingAuditPosList.Control', contingAuditPosListController);

});


