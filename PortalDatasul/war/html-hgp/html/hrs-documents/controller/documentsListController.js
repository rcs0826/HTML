define(['index',
    '/dts/hgp/html/hrs-documents/documentsFactory.js',
    '/dts/hgp/html/hrs-documents/controller/documentsAdvancedFilterController.js',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/hrs-documents/maintenance/controller/documentsMaintenanceController.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    documentsListController.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service',
                                                  'hrs.documents.Factory','global.userConfigs.Factory',
                                                  '$modal','AbstractAdvancedFilterController','TOTVSEvent'];
    function documentsListController($rootScope, $scope, appViewService,documentsFactory,
                                                userConfigsFactory,$modal,AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;

        $scope.StringTools = StringTools;
        _self.cdProgramaCorrente = 'hrs.documentsList';
        _self.config = [];
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.disclaimers = [];
        _self.listOfDocuments = [];
        _self.listOfDocumentsCount = 0;
        
        this.search = function (isMore, isAdvanced) {
            var startAt = 0;
            _self.listOfDocumentsCount = 0;

            if (isMore) {
                startAt = _self.listOfDocuments.length + 1;
            } else {
                _self.listOfDocuments = [];
            }
            //Testa se foi preenchido o campo de busca
            if (!isAdvanced && (!angular.isUndefined(_self.searchInputText))
                && _self.searchInputText !== ''){

                
                //Remove todos os disclaimers
                _self.disclaimers = [];
                
                var filtro = this.searchInputText;
                if (isNaN(filtro)) {                    
                    _self.disclaimers.push({property: 'nmDocumento',
                                            value: filtro,
                                            title: 'Documento',
                                            priority: 1});
                } else {
                    _self.disclaimers.push({property: 'idImpugdocs',
                                            value: filtro,
                                            title: 'ID Documento',
                                            priority: 1});
                }
            }

            //Limpa o campo de busca 
            _self.searchInputText = '';

            //Busca os periodos com os filtros informados, retornando o numero de registros configurados após o campo startAt
            documentsFactory.getDocumentsByFilter('', startAt, parseInt(_self.config.qtdRegistrosBusca), true, _self.disclaimers, function (result) {
                _self.hasDoneSearch = true;
                //Se encontrou resultados, preenche a lista de periodos com os mesmos.
                if (result) {
                    angular.forEach(result, function (value) {

                        if (value && value.$length) {
                           _self.listOfDocumentsCount = value.$length;
                        }
                        _self.listOfDocuments.push(value);
                    });
                    if (isMore === false) {
                        $('.page-wrapper').scrollTop(0);
                    }
                }
            });
        };        

        this.addEventListeners = function(){
          
            $rootScope.$on('invalidateDocument',function(event, changedNature){
                if(!_self.listOfDocuments 
                || _self.listOfDocuments.length == 0){
                    return;
                }

                for (var i=0; i < _self.listOfDocuments.length; i++) {
                    var document = _self.listOfDocuments[i];
                    var indAux = i;
                    
                    if(document.idImpugdocs == changedNature.idImpugdocs){
                        documentsFactory.getDocumentsByFilter('', 0, 0, false,[
                                {property:'idImpugdocs'           , value: document.idImpugdocs             , priority:1}
                            ],function(result){
                                if(result){
                                    var documentAux = result[0];
                                    documentAux.$selected = document.$selected;
                                    _self.listOfDocuments[indAux] = documentAux;
                                }
                        }, {noCountRequest: true});
                        break;
                    }
                }
            });  
        };

        this.removeDocuments = function (selecteddocuments) {

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
               title: 'Atenção!',
               text: 'Você realmente deseja remover o registro selecionado?',
               cancelLabel: 'Não',
               confirmLabel: 'Sim',
               size: 'md',
               callback: function (hasChoosenYes) {
                   if (hasChoosenYes != true) 
                       return;

                   documentsFactory.removeDocuments(selecteddocuments,
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

        this.openAdvancedSearch = function () {
            var advancedFilter = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrs-documents/ui/documentsAdvancedFilter.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrs.documentsAdvFilter.Control as afController',
                resolve: {
                    disclaimers: function () {
                        return _self.disclaimers;
                    },
                    AbstractAdvancedFilterController : function(){
                        return AbstractAdvancedFilterController;
                    }
                }
            });
            
            advancedFilter.result.then(function (disclaimers) {
                _self.search(false, true);
            });
        };

        this.openConfigWindow = function () {

            var configWindow = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrs-documents/ui/documentsListConfiguration.html',
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
            appViewService.startView("Documentos Comprobatórios", 'hrs.documentsList.Control', _self);
            
            if(appViewService.lastAction != 'newtab'){
                return;
            }

            _self.addEventListeners();
            
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

        if ($rootScope.currentuserLoaded) {
            this.init();
        } else {
            $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
                _self.init();
            });
        }
    }
    index.register.controller('hrs.documentsList.Control', documentsListController);

});


