var movementAssembler = {}; 

movementAssembler.assembleDocument = function(result){

    var assembledResult = {};
    var movementResult = {};
    assembledResult.tmpDocrecon = [];
    assembledResult.tmpMovementProcedure = [];
    assembledResult.tmpMovementInput = [];
    assembledResult.tmpMovementPackage = [];
    movementResult = movementAssembler.newAssebleMovements(result);
    movementResult = movementAssembler.adjustProviderOnMovement(movementResult);
    assembledResult.tmpMovementProcedure = movementResult.tmpMovementProcedure;
    assembledResult.tmpMovementInput = movementResult.tmpMovementInput;

    angular.forEach(result.tmpDocrecon, function(document){
        document.tmpMovementProcedure = [];
        document.tmpMovementInput = [];
        document.tmpMovementPackage = [];
        
        movementResult = movementAssembler.assebleMovements(document,result);

        //Procedimentos
        angular.forEach(movementResult.tmpMovementProcedure, function(object){
            document.tmpMovementProcedure.push(object);
        });

        //Insumos
        angular.forEach(movementResult.tmpMovementInput, function(object){
            document.tmpMovementInput.push(object);
        });

        //Pacote
        angular.forEach(movementResult.tmpMovementPackage, function(object){
            document.tmpMovementPackage.push(object);
        });
    
        assembledResult.tmpDocrecon.push(document);

    });

    return assembledResult;
}

movementAssembler.adjustProviderOnMovement = function(result){

    //Procedimento
    angular.forEach(result.tmpMovementProcedure, function(object){
        object.provider = object.providers[0];
    });

    //Insumo
    angular.forEach(result.tmpMovementInput, function(object){
        object.provider = object.providers[0];
    });

    //Pacote
    angular.forEach(result.tmpMovementPackage, function(object){
        object.provider = object.providers[0];
    });

    return result;
}

movementAssembler.newAssebleMovements = function(result) {
    var movementResult = {};
    movementResult.tmpMovementProvider = result.tmpMovementProvider;
    movementResult.tmpPreserv = result.tmpPreserv;
    movementResult.tmpMovementProcedure = [];
    movementResult.tmpMovementInput = [];
    movementResult.tmpMovementPackage = [];

    //Procedimento
    angular.forEach(result.tmpMovementProcedure, function(object){
        object.document = movementAssembler.getDocument(object,result.tmpDocrecon);
        movementResult.tmpMovementProcedure.push(object);
    });

    //Insumo
    angular.forEach(result.tmpMovementInput, function(object){
        object.document = movementAssembler.getDocument(object,result.tmpDocrecon);
        movementResult.tmpMovementInput.push(object);
    });

    //Pacote
    angular.forEach(result.tmpMovementPackage, function(object){
        object.document = movementAssembler.getDocument(object,result.tmpDocrecon);
        movementResult.tmpMovementPackage.push(object);
    });

    movementAssembler.assembleTmpMovementProcedure(movementResult);
    movementAssembler.assembleTmpMovementInput(movementResult);
    movementAssembler.assembleTmpMovementPackage(movementResult);
    
    return movementResult;
}

movementAssembler.getDocument = function(object,documents){
    let document = {};

    for(var i = 0;i < documents.length;i++){
        if(object.idRegistroDoc == documents[i].urlChave){
            document = documents[i];
            break;
        }
    }

    return document;
}

movementAssembler.assebleMovements = function(document,result){

    var movementResult = {};
    movementResult.tmpMovementProvider = result.tmpMovementProvider;
    movementResult.tmpPreserv = result.tmpPreserv;
    movementResult.tmpMovementProcedure = [];
    movementResult.tmpMovementInput = [];
    movementResult.tmpMovementPackage = [];

    //Procedimento
    angular.forEach(result.tmpMovementProcedure, function(object){
        if(object.idRegistroDoc == document.urlChave){
            movementResult.tmpMovementProcedure.push(object);
        }
    });

    //Insumo
    angular.forEach(result.tmpMovementInput, function(object){
        if(object.idRegistroDoc == document.urlChave){
            movementResult.tmpMovementInput.push(object);
        }
    });

    //Pacote
    angular.forEach(result.tmpMovementPackage, function(object){
        if(object.idRegistroDoc == document.urlChave){
            movementResult.tmpMovementPackage.push(object);
        }
    });

    movementAssembler.assembleTmpMovementProcedure(movementResult);
    movementAssembler.assembleTmpMovementInput(movementResult);
    movementAssembler.assembleTmpMovementPackage(movementResult);
    
    return movementResult;
}

movementAssembler.assembleTmpMovementProcedure = function(result){

    angular.forEach(result.tmpMovementProcedure, function(proc){
                        
        if(result.tmpAmbproce){
            for(var i = 0; i < result.tmpAmbproce.length; i++){
                var ambproce = result.tmpAmbproce[i];
                if(proc.cdMovimento != ambproce.cdProcedimentoCompleto){
                    continue;
                }
                
                proc.movementObject = ambproce;

                if(result.tmpProPerc){
                    proc.fatoresRedAcres  = result.tmpProPerc;
                }
                
                if (result.tmpGruPro) {
                    for(var j = 0; j < result.tmpGruPro.length; j++){
                        var grupro = result.tmpGruPro[j];
                        if (grupro.cdGrupoProc == ambproce.cdGrupoProc) {
                            proc.movementObject.gruProDAO = grupro;
                        }
                    }
                }
                break;
            };
        }

        movementAssembler.assembleTmpMovementProviderAtMovement(proc, result);
    });
};

movementAssembler.assembleTmpMovementInput = function(result){
    angular.forEach(result.tmpMovementInput, function(input){
                        
        if(result.tmpInsumos){
            for(var i = 0; i < result.tmpInsumos.length; i++){
                var insumo = result.tmpInsumos[i];
                if(input.cdTipoInsumo != insumo.cdTipoInsumo 
                || input.cdMovimento  != insumo.cdInsumoCompleto){
                    continue;
                }
                
                input.movementObject = insumo;
                break;
            };
        }

        movementAssembler.assembleTmpMovementProviderAtMovement(input, result);
    });
};

movementAssembler.assembleTmpMovementProviderAtMovement = function(movto, result){
    movto.providers = [];
    angular.forEach(result.tmpMovementProvider, function(prest){
        if(movto.idRegistro === prest.idRegistroMovto) {
            movto.providers.push(prest);

            if(result.tmpPreserv){
                for(var i = 0; i < result.tmpPreserv.length; i++){
                    var preserv = result.tmpPreserv[i];

                    if(prest.cdUnidade   === preserv.cdUnidade
                    && prest.cdPrestador === preserv.cdPrestador){
                        prest.preserv = preserv;
                        break;
                    }
                }
            }

            if(result.tmpCboEsp){
                prest.cbosSpecialties = [];
                angular.forEach(result.tmpCboEsp, function(cboSpec){
                    if(cboSpec.cdCboEspecialid == prest.cdCboEspecialid){
                        prest.cbosSpecialties.push(cboSpec);                 
                    }
                });
            }

            if(result.tmpCboEsp){
                prest.honoProvCbosSpecialties = [];
                if(angular.isUndefined(prest.cdUnidCdPrestadorHono) === false
                || prest.cdUnidCdPrestadorHono !== '') {
                    angular.forEach(result.tmpCboEsp, function(cboSpec){
                        if(cboSpec.cdCboEspecialid == prest.cdCboEspecialidHono){
                            prest.honoProvCbosSpecialties.push(cboSpec);
                        }
                    });    
                }
            }

            if(result.tmpPortanes){
                prest.portanes = {};
                prest.portanesCob = {};

                angular.forEach(result.tmpPortanes, function(portAnes){
                    if(portAnes.cdPorteAnestesico == prest.cdPorteAnestesico){
                        prest.portanes = portAnes;
                    }
                    if(portAnes.cdPorteAnestesico == prest.cdPorteAnestesicoCob){
                        prest.portanesCob = portAnes;
                    }
                });
            }

            if(prest.preserv && prest.preserv.inTipoPessoa){
                if(prest.preserv.inTipoPessoa === 'J'){
                    var movtoProfessional = {};

                    movtoProfessional.codUfConsMedic    = prest.cdUfConselho;
                    movtoProfessional.codConsMedic      = prest.cdConselho;
                    movtoProfessional.codRegistro       = prest.nrRegistro;
                    movtoProfessional.nomPrestdor       = prest.nmProfissionalExec;
                    movtoProfessional.codCpf            = prest.codCPFProfissionalExec;
                    movtoProfessional.desChave          = prest.preserv.cdUnidade + "-"
                                                        + prest.preserv.cdPrestador + "-"
                                                        + prest.cdUfConselho + "-"
                                                        + prest.cdConselho + "-"
                                                        + prest.nrRegistro;

                    prest.professional = movtoProfessional;
                }
            }
        }
    });
};

movementAssembler.assembleTmpMovementPackage = function(result){
    
    angular.forEach(result.tmpMovementPackage, function(pack){
    
        for(var i = 0; i < result.tmpPaproins.length; i++){
            var paproins = result.tmpPaproins[i];
            if(paproins.idRegistro == pack.idRegistro){
                pack.movementObject = paproins;
                pack.lgPacoteIntercambio = paproins.lgPacoteIntercambio;
                break;
            }
        };

        pack.packageProcedures = [];
        for(var i = 0; i < result.tmpMovementPackageProc.length; i++){
            var packageProc = result.tmpMovementPackageProc[i];
            if(packageProc.idRegistroPacote == pack.idRegistro){
               pack.packageProcedures.push(packageProc);
            }
        };   
        
        pack.packageInputs = [];
        for(var i = 0; i < result.tmpMovementPackageInput.length; i++){
            var packageInput = result.tmpMovementPackageInput[i];
            if(packageInput.idRegistroPacote == pack.idRegistro){
                pack.packageInputs.push(packageInput);
            }
        };
        
        var minProviderStatus = 99;
        var lgTemGlosaAux = false;
        
        angular.forEach(pack.packageProcedures, function(proc){
                        
            for(var i = 0; i < result.tmpAmbproce.length; i++){
                var ambproce = result.tmpAmbproce[i];
                if(proc.cdMovimento != ambproce.cdProcedimentoCompleto){
                    continue;
                }

                proc.movementObject = ambproce;

                if (result.tmpGruPro) {
                    for(var j = 0; j < result.tmpGruPro.length; j++){
                        var grupro = result.tmpGruPro[j];
                        if (grupro.cdGrupoProc == ambproce.cdGrupoProc) {
                            proc.movementObject.gruProDAO = grupro;
                        }
                    }
                }
                break;
            };

            movementAssembler.assembleTmpMovementProviderAtMovement(proc, result);
            
            angular.forEach(proc.providers,function(prov){
                if (minProviderStatus > prov.inStatus) {
                    minProviderStatus = prov.inStatus;
                }
                
                if(prov.lgTemGlosa == true){
                    lgTemGlosaAux = true;
                }
            });
        });
        
        angular.forEach(pack.packageInputs, function(input){
                        
            for(var i = 0; i < result.tmpInsumos.length; i++){
                var insumo = result.tmpInsumos[i];
                if(input.cdTipoInsumo == insumo.cdTipoInsumo 
                && input.cdMovimento  == insumo.cdInsumoCompleto){
                    input.movementObject = insumo;
                    break;
                }
            };

            movementAssembler.assembleTmpMovementProviderAtMovement(input, result);
            
            angular.forEach(input.providers,function(prov){                
                if (minProviderStatus > prov.inStatus) {
                    minProviderStatus = prov.inStatus;
                }
                
                if(prov.lgTemGlosa == true){
                    lgTemGlosaAux = true;
                }
            });
        });
 
        //copia os prestadores do primeiro movimento para o pacote
        try{
            pack.providers = angular.copy(pack.packageProcedures[0].providers);
        }catch(e){ 
            //caso o pacote nao tenha procedimentos, copia os prestadores do insumo
            pack.providers = angular.copy(pack.packageInputs[0].providers);
        }

        angular.forEach(pack.providers,function(prov){
            prov.inStatus      = minProviderStatus;
            prov.vlCobrado     = pack.vlCobrado;
            prov.vlMovimento   = pack.vlMovimento;
            prov.vlGlosado     = pack.vlGlosado;
            prov.lgTemGlosa    = lgTemGlosaAux;
        });
    });
};