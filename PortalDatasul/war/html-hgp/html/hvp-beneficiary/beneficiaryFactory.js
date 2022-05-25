define(['index',
    '/dts/hgp/html/hvp-beneficiary/beneficiaryAssembler.js'
], function (index) {

    beneficiaryFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
    function beneficiaryFactory($totvsresource, dtsUtils) {

        var specificResources = {'postWithArray': {method: 'POST',
                params: {method: '@method'},
                isArray: true}};

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hvp/fchsaubeneficiary/:method/:benefCardNumber', {}, specificResources);

        factory.getBenefsByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {            
            factory.TOTVSPost({method: 'getBenefsByFilter',
                simpleFilterValue: simpleFilterValue, pageOffset: pageOffset,
                limit: limit, loadNumRegisters: loadNumRegisters}, 
                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},            
            function(result){
                if(!result && !result.tmpUsuario) {
                    callback(result);
                    return;
                }
                
                beneficiaryAssembler.assembleTmpUsuario(result);
                
                callback(result.tmpUsuario);
            });
        };
        
        factory.getBenefByCard = function (completeCardNumber, disclaimers, callback) {
            factory.getBenefsByFilter(completeCardNumber, 0, 1, false,
                disclaimers, function(result){
                    callback(result[0]);
                });
        };
        
        factory.getBeneficiaryDetails = function (cdCarteiraInteira, callback) {
            
            this.TOTVSGet({method: 'getBeneficiaryDetails', 
                cdCarteiraInteira: cdCarteiraInteira}, 
                       
                function(result){   
                    if(!result && !result.tmpUsuario) {
                        callback(result);
                        return;
                    }

                    beneficiaryAssembler.assembleTmpUsuario(result);
                    
                    var benefWrapper = {};
                                        
                    benefWrapper.mainBenef               = result.tmpUsuario[0];
                    benefWrapper.benefFamily             = result.tmpUsuarioAux;                    
                    benefWrapper.benefHealthConditions   = result.tmpHealthCondition;
                    benefWrapper.benefRepasses           = result.tmpBenefRepasses;                                                          
                    benefWrapper.benefModules            = result.tmpBenefModuleAndGrace;
                    
                    if (result.tmpContractualInfo.length > 0){
                        benefWrapper.planTypeContractualInfo = result.tmpContractualInfo[0].planTypeContractualInfo;
                        benefWrapper.contractContractualInfo = result.tmpContractualInfo[0].contractContractualInfo;
                        benefWrapper.benefContractualInfo    = result.tmpContractualInfo[0].benefContractualInfo;   
                    }
                    
                    angular.forEach(benefWrapper.benefFamily,function(benef){

                        /* CARD ID */
                        angular.forEach(result.tmpCarIde,function(card){
                            if (card.cdModalidade     == benef.cdModalidade
                                &&  card.nrTerAdesao  == benef.nrTerAdesao
                                &&  card.cdUsuario    == benef.cdUsuario) {
                                    benef.carteiraPrinc = card;
                            }
                        });
                                                
                    });
                                        
                    /* BENEFHEALTHDECLARATION */
                    angular.forEach(benefWrapper.benefHealthConditions,function(healthCondition){
                            
                        healthCondition.cids      = [];
                        healthCondition.providers = [];
                     
                        angular.forEach(result.tmpBenefHealthDeclaration,function(healthDeclaration){
                                 
                            if (healthDeclaration['cd-condicao-saude'] == healthCondition['cd-condicao-saude']) {
                                healthCondition.cids.push(healthDeclaration);
                            }
                                
                        });
  
                        angular.forEach(result.tmpHealthDeclarationProvider,function(healthDeclarationProvider){ 
                            if (healthDeclarationProvider['cd-condicao-saude'] == healthCondition['cd-condicao-saude']) {
                                healthCondition.providers.push(healthDeclarationProvider);
                            }                                                                   
                        }); 
                        
                     });
                     
                     /* BENEFS REPASS  */
                     angular.forEach(benefWrapper.benefRepasses,function(repass){
                         
                         repass.unidadesAtendimento = [];
                         
                         angular.forEach(result.tmpBenefRepasUnidAten,function(unidAtenRepass){
                             if (unidAtenRepass.cdUnidadeDestino == repass.cdUnidadeDestino
                             &&  unidAtenRepass.dtIntercambi     == repass.dtIntercambioAtendimento) {
                                repass.unidadesAtendimento.push(unidAtenRepass);
                             }       
                         });
         
                     });

                    callback(benefWrapper);
                
                }
                        
            );            
                                                                        
        };
        
        factory.saveBeneficiaryOtherUnit = function (beneficiary, callback) {
            this.TOTVSSave({method: 'saveBeneficiaryOtherUnit'},
                           {beneficiary: beneficiary}, callback);
	};
        
        factory.getGracesPerServiceForBenef = function (cdModalidade, nrProposta, cdUsuario, callback) {
            this.postWithArray({method: 'getGracesPerServiceForBenef',
                                cdModalidade: cdModalidade,
                                nrProposta: nrProposta,
                                cdUsuario: cdUsuario},
                               {},
              callback);
        };    
        
        return factory;
    }

    index.register.factory('hvp.beneficiary.Factory', beneficiaryFactory);
});
