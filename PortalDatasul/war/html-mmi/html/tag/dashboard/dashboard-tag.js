define(['index',
        '/dts/mmi/js/utils/filters.js',
        '/dts/mmi/js/api/fch/fchmip/fchmiptag.js'
        ], function(index) {
    
	dashboardTagCtrl.$inject = [
		'$rootScope',
		'$scope',
		'$stateParams',
        '$state',
        '$modal',
		'TOTVSEvent',
        'totvs.app-main-view.Service',
        'fchmip.fchmiptag.Factory',
        'helperTag'
	];

	function dashboardTagCtrl(
        $rootScope, 
        $scope, 
        $stateParams, 
        $state,
        $modal,
        TOTVSEvent,
        appViewService,
        fchmiptag,
        helperTag
    ) {

        var _self = this;
        
        _self.init = function() {
            var today  = new Date();
            
            _self.tagSelecionada = false;
            _self.titulo = $rootScope.i18n('l-search-tag');
            _self.dateRange = {
                startDate : new Date().setDate(today.getDate()-30),
                endDate : new Date()
            };
            
            _self.createTab = appViewService.startView($rootScope.i18n('l-tag-relationships'), 'mmi.tag.dashboard.DashboardTagCtrl', dashboardTagCtrl);
            
            if (_self.createTab === false) {

                if(helperTag.data.dateRange){
                    _self.dateRange = helperTag.data.dateRange;
                }

                if(helperTag.data.pagina == 1){
                    _self.pesquisaTag(helperTag.data);
                } else {
                    _self.atualizaTag(helperTag.data);
                    _self.exibirPagina(helperTag.data.pagina);
                }

            } else {
                if(helperTag.data['nr-soli-serv']){
                    _self.pesquisaTag(helperTag.data);
                } else {
                    _self.zeraTag();
                }
            }
        };
            
        _self.zeraTag = function(){
            helperTag.data = {};
            helperTag.data.dateRange = undefined
            helperTag.titulo = $rootScope.i18n('l-search-tag');
        }

        _self.descCriticidade = function(idCriticidade){
            var tipoCriticidade = {
                1: "X",
                2: "Y",
                3: "Z"
            };
            return tipoCriticidade[idCriticidade];
        };
            
        _self.atualizaTag = function(tag){
            _self.tag = tag;
            _self.titulo = _self.tag['cd-tag'] + ' - ' + _self.tag.descricao;
            _self.tagSelecionada = true;
            _self.tag.criticidadeDesc = _self.descCriticidade(_self.tag.criticidade);
            
            helperTag.data = _self.tag;
            helperTag.data.dateRange = _self.dateRange;
        }

        _self.pesquisaTag = function(tag) {
            _self.tagSelecionada = false;
            _self.dados = true;
            _self.historico = false;
            _self.equipamento = false;
            _self.ordem = false;
            _self.solicitacao = false;
            _self.condicao = false;
            _self.zeraDados();
            
            fchmiptag.getTagData((tag)? tag['cd-tag'] : _self.tag['cd-tag'], function(result){
                if(result[0]){
                    _self.atualizaTag(result[0]);
                } else {
                    _self.zeraTag();
                }
            });
        };
            
        _self.zeraDados = function(){
            _self.historyData = undefined;
            _self.equipmentData = undefined;
            _self.orderData = undefined;
            _self.serviceRequestData = undefined;
            _self.operationalConditionData = undefined;
        }

        _self.obterAlturaConteudo = function() {
			return {
				height: window.innerHeight - 160 + 'px'
			};
        };

        _self.obterAlturaConteudoGrid = function() {
			return {
				height: window.innerHeight - 215 + 'px'
			};
		}

        _self.exibirPagina = function(pagina) {
            
            if(!pagina){
                pagina = 1;
            }
            
            _self.dados = false;
            _self.historico = false;
            _self.equipamento = false;
            _self.ordem = false;
            _self.solicitacao = false;
            _self.condicao = false;
            _self.paginaAtual = pagina;
            helperTag.data.pagina = pagina;
            
            switch (pagina){
                case 1:
                    _self.dados = true;
                    
                    break;
                case 2:
                    _self.historico = true;
                    
                    if(!_self.historyData){
                        _self.buscaHistorico();
                    }
                    
                    break;
                case 3:
                    _self.equipamento = true;
                    
                    if(!_self.equipmentData){
                        _self.buscaEquipamento();
                    }
                    
                    break;
                case 4:
                    _self.ordem = true;
                    
                    if(!_self.orderData){
                        _self.buscaOrdem();
                    }
                    
                    break;
                case 5:
                    _self.solicitacao = true;
                    
                    if(!_self.serviceRequestData){
                        _self.buscaSolicitacao();
                    }
                    
                    break;
                case 6:
                    _self.condicao = true;
                    
                    if(!_self.operationalConditionData){
                        _self.buscaCondicao();
                    }
                    
                    break;
            }
        };
            
        _self.buscaHistorico = function(){
            var parameters = {cd_tag: _self.tag['cd-tag'], data_ini: _self.dateRange.startDate, data_fim: _self.dateRange.endDate}
                
            fchmiptag.getHistTag(parameters, function(result){
                if(result) _self.historyData = result;
            });
        }
        
        _self.buscaEquipamento = function(){
            var parameters = {cd_tag: _self.tag['cd-tag'], data_fim: _self.dateRange.endDate}
                
            fchmiptag.getEquipmentTag(parameters, function(result){
                if(result) _self.equipmentData = result;
            });
        }
        
        _self.buscaOrdem = function(){
            var parameters = {cd_tag: _self.tag['cd-tag'], data_ini: _self.dateRange.startDate, data_fim: _self.dateRange.endDate}
                
            fchmiptag.getOrderTag(parameters, function(result){
                if(result) _self.orderData = result;
            });
        }
        
        _self.buscaSolicitacao = function(){
            var parameters = {cd_tag: _self.tag['cd-tag'], data_ini: _self.dateRange.startDate, data_fim: _self.dateRange.endDate}
                
            fchmiptag.getServiceRequestTag(parameters, function(result){
                if(result) _self.serviceRequestData = result;
            });
        }
        
        _self.buscaCondicao = function(){
            var parameters = {cd_tag: _self.tag['cd-tag'], data_ini: _self.dateRange.startDate, data_fim: _self.dateRange.endDate}
                
            fchmiptag.getOperationalConditionTag(parameters, function(result){
                if(result) _self.operationalConditionData = result;
            });
        }

        _self.openAdvancedSearch = function(){
            
            var modalInstance = $modal.open({
                templateUrl: '/dts/mmi/html/tag/dashboard/dashboard.tag.advanced.search.html',
                controller: 'mmi.tagAdvSearch.SearchCtrl as controller',
                size: 'md',
                backdrop: 'static',
                resolve: {
                    dateRange: function () {
                        return _self.dateRange;
                    }
                }
            });

            modalInstance.result.then(function (result) {
                _self.dateRange = result;
                helperTag.data.dateRange = result;
                
                if (_self.tag['cd-tag']){
                    _self.zeraDados();
                    _self.exibirPagina(_self.paginaAtual);                    
                }
            });
        }

        _self.dadosSelecionado = function() {
            if(_self.dados) return _self.paginaSelecionada();
        };

        _self.historicoSelecionado = function(){
            if(_self.historico) return _self.paginaSelecionada();
        }
        
        _self.equipamentoSelecionado = function(){
            if(_self.equipamento) return _self.paginaSelecionada();
        }
        
        _self.ordemSelecionado = function(){
            if(_self.ordem) return _self.paginaSelecionada();
        }
        
        _self.solicitacaoSelecionado = function(){
            if(_self.solicitacao) return _self.paginaSelecionada();
        }
        
        _self.condicaoSelecionado = function(){
            if(_self.condicao) return _self.paginaSelecionada();
        }

        _self.paginaSelecionada = function() {
			return {
				'background-color': '#bfbfbf' 
			}
		};

        if ($rootScope.currentuserLoaded) { 
            _self.init();
        }
    
        $scope.$on('$destroy', function () {
            _self = undefined;
        });

        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            _self.init();
        });
    }

    // *********************************************************************************
    // *** Controller Pesquisa Avançada
    // *********************************************************************************
	
	tagAdvSearchCtrl.$inject = [ 	    
        '$modalInstance', 
        'dateRange'];

    function tagAdvSearchCtrl ($modalInstance,
                               dateRange) {

        this.dateRange = dateRange;
        var today  = new Date();

        this.apply = function () {
            if(this.dateRange.startDate == null){
                this.dateRange.startDate = new Date().setDate(today.getDate()-30);
            }
            
            if(this.dateRange.endDate == null){
                this.dateRange.endDate = new Date();
            }
            
            $modalInstance.close(this.dateRange);
        };

        this.cancel = function () {
            $modalInstance.dismiss();
        }
    }

    index.register.controller('mmi.tag.dashboard.DashboardTagCtrl', dashboardTagCtrl);
    index.register.controller('mmi.tagAdvSearch.SearchCtrl', tagAdvSearchCtrl);
    index.register.service('helperTag', function(){
        return {
            data :{}
        };
    });
});