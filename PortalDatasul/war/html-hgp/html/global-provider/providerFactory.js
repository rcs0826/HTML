define(['index',
    '/dts/hgp/html/util/dts-utils.js'
], function (index) {

    providerFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
    function providerFactory($totvsresource, dtsUtils) {

        var specificResources = {'postWithArray': {method: 'POST',
                params: {method: '@method'},
                isArray: true}};

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/global/fchsauprovider/:method?:param', {}, specificResources);

        factory.getProviderByFilterTISS = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.TOTVSPost({method: 'getProviderByFilterTISS', simpleFilterValue: simpleFilterValue,
                pageOffset: pageOffset, limit: limit, loadNumRegisters:loadNumRegisters}, 
                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                function(result){
                if(!result && !result.tmpPreserv) {
                    callback(result);
                    return;
                }
                
                angular.forEach(result.tmpPreserv,function(prest){

                    if(prest.inTipoPessoa == 'F'){
                        angular.forEach(result.tmpPessoaFisica,function(pf){
                            if (prest.idPessoa == pf.idPessoa){
                                prest.pessoa = pf;
                            }
                        });
                    }else{
                        angular.forEach(result.tmpPessoaJuridica,function(pj){
                            if (prest.idPessoa == pj.idPessoa){
                                prest.pessoa = pj;
                            }
                        });
                    }

                    if(prest.pessoa){
                        prest.pessoa.contatos   = [];
                        angular.forEach(result.tmpContatoPessoa,function(contatoPessoa){
                            if (prest.idPessoa == contatoPessoa.idPessoa){
                                prest.pessoa.contatos.push(contatoPessoa);
                            }
                        });

                        prest.pessoa.enderecos  = [];
                        angular.forEach(result.tmpEndereco,function(endereco){
                            if (prest.idPessoa == endereco.idPessoa){
                                prest.pessoa.enderecos.push(endereco);
                            }
                        });
                    }
                    
                    prest.especialidades    = [];
                    angular.forEach(result.tmpPreviesp,function(especialidade){
                        if(prest.cdUnidade   == especialidade.cdUnidade
                        && prest.cdPrestador == especialidade.cdPrestador){
                            if(especialidade.lgPrincipal == true){
                                prest.especialidadePrincipal = especialidade;
                            }
                            prest.especialidades.push(especialidade);
                        }
                    });

                    angular.forEach(result.tmpSitprest,function(suspensao){
                        if(prest.cdUnidade   == suspensao.cdUnidade
                        && prest.cdPrestador == suspensao.cdPrestador){
                            prest.suspensao = suspensao;
                        }
                    });
                    
                    prest.clinicasPrestador = [];
                    angular.forEach(result.tmpClinpres,function(clinicasPrest){
                        if(prest.cdUnidade   == clinicasPrest.cdUnidade
                        && prest.cdPrestador == clinicasPrest.cdPrestador){

                            angular.forEach(result.tmpClinicas,function(clinica){
                                if(clinicasPrest.cdClinica   == clinica.cdClinica){
                                    clinicasPrest.clinica = clinica;
                                }
                            });
                            prest.clinicasPrestador.push(clinicasPrest);
                        }
                    });
                });
                
                callback(result.tmpPreserv);
            });
        };

        factory.getProviderByFilterNew = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getProviderByFilter', simpleFilterValue: simpleFilterValue,
                pageOffset: pageOffset, limit: limit, loadNumRegisters:loadNumRegisters}, 
                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                function(result){
                    
                if(result && result.tmpPreserv) {
                    callback(result.tmpPreserv);
                    return;
                }

                callback(result);
			});
        };

        factory.getProviderByKey = function (cdUnidCdPrestador, disclaimers, callback) {
            factory.getProviderByFilterTISS(cdUnidCdPrestador, 0, 1, false,
                disclaimers, function(result){
                    callback(result[0]);
                });
        };

        factory.removeProvider = function (tmpPreserv,  callback) {            
            factory.TOTVSPost({method: 'removeProvider'},{tmpPreserv: tmpPreserv}, 
                function(result){
                    if(result && result.tmpPreserv){
                        result.tmpPreserv.$hasError = result.$hasError;
                        callback(result.tmpPreserv);
                        return;
                    }
                    callback(result);
                });
        }; 

        /*factory.getProviderByFilterNew = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getProviderByFilter', simpleFilterValue: simpleFilterValue,
                pageOffset: pageOffset, limit: limit, loadNumRegisters:loadNumRegisters}, 
                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                function(result){
                    console.log('result', result);

                if(result && result.tmpPreserv) {
                    callback(result.tmpPreserv);
                    return;
                }
                
                angular.forEach(result.tmpPreserv,function(prest){

                    if(prest.inTipoPessoa == 'F'){
                        angular.forEach(result.tmpPessoaFisica,function(pf){
                            if (prest.idPessoa == pf.idPessoa){
                                prest.pessoa = pf;
                            }
                        });
                    }else{
                        angular.forEach(result.tmpPessoaJuridica,function(pj){
                            if (prest.idPessoa == pj.idPessoa){
                                prest.pessoa = pj;
                            }
                        });
                    }

                    if(prest.pessoa){
                        prest.pessoa.contatos   = [];
                        angular.forEach(result.tmpContatoPessoa,function(contatoPessoa){
                            if (prest.idPessoa == contatoPessoa.idPessoa){
                                prest.pessoa.contatos.push(contatoPessoa);
                            }
                        });

                        prest.pessoa.enderecos  = [];
                        angular.forEach(result.tmpEndereco,function(endereco){
                            if (prest.idPessoa == endereco.idPessoa){
                                prest.pessoa.enderecos.push(endereco);
                            }
                        });
                    }
                    
                    prest.especialidades    = [];
                    angular.forEach(result.tmpPreviesp,function(especialidade){
                        if(prest.cdUnidade   == especialidade.cdUnidade
                        && prest.cdPrestador == especialidade.cdPrestador){
                            if(especialidade.lgPrincipal == true){
                                prest.especialidadePrincipal = especialidade;
                            }
                            prest.especialidades.push(especialidade);
                        }
                    });

                    angular.forEach(result.tmpSitprest,function(suspensao){
                        if(prest.cdUnidade   == suspensao.cdUnidade
                        && prest.cdPrestador == suspensao.cdPrestador){
                            prest.suspensao = suspensao;
                        }
                    });
                    
                    prest.clinicasPrestador = [];
                    angular.forEach(result.tmpClinpres,function(clinicasPrest){
                        if(prest.cdUnidade   == clinicasPrest.cdUnidade
                        && prest.cdPrestador == clinicasPrest.cdPrestador){

                            angular.forEach(result.tmpClinicas,function(clinica){
                                if(clinicasPrest.cdClinica   == clinica.cdClinica){
                                    clinicasPrest.clinica = clinica;
                                }
                            });
                            prest.clinicasPrestador.push(clinicasPrest);
                        }
                    });
                
                    prest.enderecosPrestador = [];
                    angular.forEach(result.tmpEndpres,function(endPrest){
                        if(prest.cdUnidade   == endPrest.cdUnidade
                        && prest.cdPrestador == endPrest.cdPrestador){
                            prest.enderecosPrestador.push(endPrest);
                        }
                    });
              });
              callback(result.tmpPreserv);
            });
        };*/

        factory.prepareDataToProviderWindow = function (cdUnidade, cdPrestador, callback) {
            factory.TOTVSGet({method: 'prepareDataToProviderWindow',
                              cdUnidade: cdUnidade, cdPrestador: cdPrestador},
                function(result){
                    callback(result);
                

                    /*beneficiaryAssembler.assembleTmpUsuario(result);*/
                    
                });
        };

        factory.getImportParamProvider = function (cdUnidade, cdPrestador, callback) {
            factory.TOTVSGet({method: 'getImportParamProvider',
                              cdUnidade: cdUnidade, cdPrestador: cdPrestador},                
                            callback);                
        };       

        return factory;
    }

    index.register.factory('global.provider.Factory', providerFactory);
});