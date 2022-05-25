var beneficiaryAssembler = {};

beneficiaryAssembler.assembleTmpUsuario = function(result){
    angular.forEach(result.tmpUsuario,function(benef){
        angular.forEach(result.tmpCarIde,function(card){
            if (benef.cdModalidade == card.cdModalidade
            &&  benef.nrTerAdesao  == card.nrTerAdesao
            &&  benef.cdUsuario    == card.cdUsuario) {
                benef.carteiraPrinc = card;
            }
        });

        if (result.tmpPessoaFisica) {
            angular.forEach(result.tmpPessoaFisica,function(person){
                if (benef.idPessoa == person.idPessoa) {
                    benef.pessoaFisica = person;
                    person.enderecos = [];
                    person.contatos = [];

                    angular.forEach(result.tmpEndereco,function(endereco){
                        if(person.idPessoa == endereco.idPessoa){
                            if(endereco.lgPrincipal == true){
                                person.enderecoPrincipal = endereco;
                            }

                            person.enderecos.push(endereco);
                        }
                    });

                    angular.forEach(result.tmpContatoPessoa,function(contato){
                        if(person.idPessoa == contato.idPessoa){
                            person.contatos.push(contato);
                        }
                    });

                }
            });
        }

        if(result.tmpPropost){
            angular.forEach(result.tmpPropost,function(propost){
                if (benef.cdModalidade != propost.cdModalidade
                ||  benef.nrProposta   != propost.nrProposta) 
                    return;

                benef.propost = propost;

                angular.forEach(result.tmpContrat,function(contrat){
                    if (propost.nrInscContratante == contrat.nrInscContratante) {
                        propost.contrat = contrat;
                    }
                });

                angular.forEach(result.tmpFormpaga,function(paymentForm){
                    if (propost.cdFormaPagto == paymentForm.cdFormaPagto) {
                        propost.formpaga = paymentForm;
                    }
                });

                angular.forEach(result.tmpTiPlSa,function(planType){
                    if (propost.cdModalidade != planType.cdModalidade
                    ||  propost.cdPlano      != planType.cdPlano
                    ||  propost.cdTipoPlano  != planType.cdTipoPlano)
                        return;

                    propost.tipoPlano = planType;

                    angular.forEach(result.tmpClashosp,function(hospClass){
                        /* if (planType.cdClaHos != hospClass.cdClaHos)
                            return; */

                        planType.clashosp = hospClass;

                    });

                    angular.forEach(result.tmpPlaSau,function(plan){
                        if (planType.cdModalidade != plan.cdModalidade
                        ||  planType.cdPlano      != plan.cdPlano)
                            return;

                        planType.plasau = plan;

                        angular.forEach(result.tmpModalid,function(mod){
                            if (plan.cdModalidade != mod.cdModalidade)
                                return;

                            plan.modalid = mod;

                        });
                    });
                });                             
            });  
        }
    });
};