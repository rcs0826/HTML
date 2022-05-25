define(['index', 
        '/dts/hgp/html/hvp-beneficiary/beneficiaryFactory.js',
        '/dts/hgp/html/js/util/DateTools.js',
        '/dts/hgp/html/js/util/StringTools.js',
        '/dts/hgp/html/util/customFilters.js',
        '/dts/hgp/html/enumeration/maritalStatusEnumeration.js',
        '/dts/hgp/html/enumeration/cardMovimentTypeEnumeration.js',
        '/dts/hgp/html/enumeration/cardPrintTypeEnumeration.js',
        '/dts/hgp/html/enumeration/contractingPartyTypeEnumeration.js',
        /*'/dts/hgp/html/js/global/healthcare-main.js'*/
    ], function(index) {

	// *************************************************************************************
	// *** CONTROLLER - LIST
	// '/healthcare/html/hvp/beneficiary/beneficiaryDetailController.js'
	// *************************************************************************************

	beneficiaryDetailController.$inject = ['$rootScope', '$scope', '$location', '$stateParams', 
                    'totvs.app-main-view.Service','hvp.beneficiary.Factory'];
	function beneficiaryDetailController($rootScope, $scope, $location, $stateParams, appViewService, beneficiaryFactory) {

		var _self = this;
                
                $scope.MARITAL_STATUS_ENUM     = MARITAL_STATUS_ENUM;
                $scope.CARD_PRINT_TYPE_ENUM    = CARD_PRINT_TYPE_ENUM;
                $scope.CARD_MOVEMENT_TYPE_ENUM = CARD_MOVEMENT_TYPE_ENUM;
                $scope.CONTACTING_PARTY_TYPE_ENUM = CONTACTING_PARTY_TYPE_ENUM;
                $scope.StringTools = StringTools;

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************
		
		this.getBeneficiaryDetails = function(benefCardNumber) {

            beneficiaryFactory.getBeneficiaryDetails( 
                             benefCardNumber, function(result) {
                if (result) {                                               
                    _self.wrapper = result;
                    _self.beneficiary = _self.wrapper.mainBenef;
                    
                    if(angular.isUndefined(_self.beneficiary.pessoaFisica) == false
                    && _self.beneficiary.pessoaFisica.dtNascimento){
                        _self.beneficiary.idade = Date.getAgeLabel(_self.beneficiary.pessoaFisica.dtNascimento);    
                    }
                }
            });				
		};
                
        this.getGracesPerServiceForBenef = function (){                           
            
            if (_self.loadGracesServicesModuleBenef == false
             &&  _self.wrapper.benefModules.length > 0){
                _self.loadGracesServicesModuleBenef =  true;
                                        
                beneficiaryFactory.getGracesPerServiceForBenef(          
                    _self.wrapper.benefModules[0]['cd-modalidade'],
                    _self.wrapper.benefModules[0]['nr-proposta'],
                    _self.wrapper.benefModules[0]['cd-usuario'], 
                    function (result){       
                                                                                                                                   
                        if (result) {
                            angular.forEach(_self.wrapper.benefModules,function(module){                                            
                                angular.forEach(result, function(service){                                                
                                    if (service['cd-modulo'] == module['cd-modulo']){
                                        if (module.gracesPerServiceModule == undefined){
                                            module.gracesPerServiceModule = [];
                                        }
                                        module.gracesPerServiceModule.push(service);
                                    }
                                });
                            });
                         
                            for(var i = 0; i < _self.wrapper.benefModules.length; i++){
                                if (_self.wrapper.benefModules[i].gracesPerServiceModule != undefined){
                                    _self.hasGracesService = true;
                                }
                            }
                        }            
                    });
            }
        };

		this.init = function() {
            appViewService.startView("Dados do Beneficiário",'hvp.benefDetail.Control', _self);
            
            if(appViewService.lastAction != 'newtab'
            && _self.currentUrl == $location.$$path){
                return;
            }
            
            this.loadGracesServicesModuleBenef = false;
            this.hasGracesService = false;

            this.wrapper = {};
            this.beneficary = {}; 
            
            _self.currentUrl = $location.$$path;
            
            if ($stateParams.benefCardNumber) {
                this.getBeneficiaryDetails($stateParams.benefCardNumber);
            }
		};
		
        this.showCidObservation = function(healthConditionCode, cidIndex){
            angular.forEach(this.wrapper.benefHealthConditions,function(healthCondition){
                if(healthConditionCode === healthCondition.code){
                    currentCid = healthCondition.cids[cidIndex];
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    		type: 'success',
                                    		title: 'Observação do Cid ' + currentCid.cidCode 
                                                                        + ' - ' 
                                                                        + currentCid.deseaseDescription,
                                    		detail: currentCid.observation
                    });  
                }
            }, this);
        };
        
        this.onCancel = function(){
            appViewService.removeView({active: true,
                                       name  : 'Dados do Beneficiário',
                                       url   : _self.currentUrl});
        };
                
        this.getRemainingDaysLabel = function(date){                    
            today = new Date();
                                                    
            if (today > date)
            return "Carência Cumprida";                    
                        
            restDays = Math.ceil(((date - today) / 86400000));
                                
            if (restDays == 1)    
            return restDays + " dia restante";
        
            return restDays + " dias restantes";s
        };
        
        this.getEndDateWithoutChange = function(date,days){      
            return date - (86400000 * days);
        };
                
        this.getChangeDaysLabel = function(nrDays){                                       
            
            if (nrDays < 0)
            nrDays = nrDays * -1;
            
            if (nrDays == 1)
            return nrDays + " dia";
            return nrDays + " dias";
        };
                
        this.getGraceTag = function (module){
            
            today = new Date();  

            if ((module['lg-carencia'] == false) || 
                (module['in-ctrl-carencia-proced'] == 0 &&
                 module['in-ctrl-carencia-insumo'] == 0)) // Módulo não pode ter carência, conforme definição na proposta
            return 2;
                                
            if (module['dt-fim-carencia-eletiva'] > today || module['dt-fim-carencia-urgencia'] > today)
            return 1;
                        
            return 3;
            
        };
                
		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************	
                
        $scope.$on('$viewContentLoaded', function(){
            _self.init();
        });
	}
	
	index.register.controller('hvp.benefDetail.Control', beneficiaryDetailController);
	
});


                   
//                    $('#navBar').bind("resize",function(){
//                        var headerHeight = $('#navBar').outerHeight();
//                        $('#pageContent').css("padding-top",headerHeight - 15 + 'px');
//                    });  
//                    
//                    var shortcuts = [];
//                    var offset = 0;
//                    var displacement = 0;
//
//                    //if para verificar se a tela ja foi construida
//                    if ($('#pageContent').length) {
//                        offset = $('#pageContent').offset().top;
//                        $('#scrollSpy').querySelectorAll('ul li a').each(function() {
//                            var section = $($(this).attr('href'))[0];
//                            shortcuts.push({section:section, shortcut: $(this)});
//                            $(this).click(function(event) {
//                                event.preventDefault();
//                                section.scrollIntoView();
//                                //se nao for o ultimo atalho, sobe o scroll com o valor do offset
//                                if($(shortcuts[shortcuts.length-1].shortcut)[0] !== $(this)[0]){
//                                    $('.page-wrapper').scrollTop($('.page-wrapper').scrollTop() - offset);
//                                }
//                                
//                            });
//                        });
//                    };
//                    $('#mainContainer').bind("resize",function(){
//
//                        displacement = $(shortcuts[0].section).position().top;
//
//                        lastSection = $(shortcuts[shortcuts.length - 1].section);
//                        secPosition = lastSection.position().top - offset;
//                        
//                        //para ignorar o espaço do whiteDiv
//                        secPosition += $('#whiteDiv').outerHeight();
//
//                        lastSectionHeight = $('#pageContent').outerHeight() - secPosition - displacement;
//
//                        whiteSpace = $(this).outerHeight() - lastSectionHeight;
//                        whiteSpace -= offset;
//                        $('#whiteDiv').css('height',whiteSpace + 'px');
//                        
//                    });
//                    
//                    $('.page-wrapper').on('scroll', function() {
//                        var currentPos = $(this).scrollTop() + 100;
//                        
//                        var shortcutIndex = 0;
//                        
//                        for (i = 0; i < shortcuts.length; i++) {
//                            sec = $(shortcuts[i].section);
//                            shortcut = $(shortcuts[i].shortcut);    
//                            
//                            secPosition = sec.position().top;
//                            if(i === shortcuts.length - 1){
//                                shortcutIndex = i;
//                                break;
//                            }
//                            
//                            secPosition -= displacement;
//                            
//                            if(currentPos >= secPosition
//                            && currentPos < $(shortcuts[i+1].section).position().top - displacement){
//                                shortcutIndex = i;
//                                break;
//                            }
//                        };
//                        
//                        angular.forEach(shortcuts,function(item){
//                            $(item.shortcut).closest("li").removeClass("active")
//                        });
//                        
//                        $(shortcuts[shortcutIndex].shortcut).closest("li").addClass("active");     
//                        
//                    });
//          

