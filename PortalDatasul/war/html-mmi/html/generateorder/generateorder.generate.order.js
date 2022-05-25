define(['index',
        '/dts/mmi/js/api/fch/fchmip/fchmipservicerequest.js',
        '/dts/mmi/js/zoom/plano-orig.js',
        '/dts/mmi/js/zoom/equipto.js',
        '/dts/mmi/js/zoom/mnt-planejador.js',
        '/dts/mmi/js/zoom/tipo-manut.js'
], function(index) {

    generateOrderGenerateCtrl.$inject = [ '$modalInstance',
                                          'model',
                                          '$rootScope',
                                          'TOTVSEvent',
                                          'fchmip.fchmipservicerequest.Factory',
                                          'helperPlanoOrigZoom'
    ];

    function generateOrderGenerateCtrl ($modalInstance,
                                        model,
                                        $rootScope,
                                        TOTVSEvent,
                                        fchmipservicerequest,
                                        helperPlanoOrigZoom){

        var controller = this;

        controller.init = function(){
            controller.lLoadModal = false;
            controller.list = model.listSS;
            controller.ttSolicServ = [];
            controller.ttListOM = [];
            controller.iFormaAgrup = parseInt(model.agrupamento);
            controller.refreshPage = false;
            
            controller.getSolicServOrdem();
        }

        controller.getSolicServOrdem = function() {
            controller.list.forEach(function(servico){
                
                controller.ttSolicServ.push({'nr-soli-serv' : servico['nr-soli-serv'],
                                             'cd-equipto'   : servico['cd-equipto'],
                                             'prioridade'   : servico['prioridade']});
                
                if(controller.iFormaAgrup === 3){
                    controller.addListOM(servico);
                } else{ /* 1 ou 2*/
                    var lEncontrouList = false;
                    controller.ttListOM.forEach(function (ordem) {
                        if(ordem['cd-equipto'] === servico['cd-equipto']){
                            lEncontrouList = true;
                            ordem.nrSoliServ = ordem.nrSoliServ + "; " + servico.nrSoliServ
                            if (ordem.prioridade > servico.prioridade){
                                ordem.prioridade = servico.prioridade;
                            }
                        }
                    })
                    if (lEncontrouList === false){
                        controller.addListOM(servico);
                    }
                }
            });

            if (controller.ttListOM.length > 0) controller.ttListOM[0].isOpen = true;
        }

        controller.addListOM = function(servico){
            controller.ttListOM.push({'nrSoliServ'      : servico.nrSoliServ,
                                      'nr-ord-produ'    : servico['nr-ord-produ'],
                                      'descricao'       : servico['descricao'],
                                      'cd-equipto'      : servico['cd-equipto'] === "" ? undefined : servico['cd-equipto'],
                                      'disable-equipto' : servico['cd-equipto'] === "" ? false : true,
                                      'cd-manut'        : servico['cd-manut'] === "" ? undefined : servico['cd-manut'],
                                      'cd-tipo'         : undefined, 
                                      'da-manut'        : servico['da-manut'],
                                      'cd-tag'          : servico['cd-tag'],
                                      'plano-orig'      : servico['plano-orig'],
                                      'des-plano-orig'  : servico['des-plano-orig'],
                                      'cd-planejado'    : servico['cd-planejado'] === "" ? undefined : servico['cd-planejado'],
                                      'cd-equip-res'    : servico['cd-equip-res'] === "" ? undefined : servico['cd-equip-res'],
                                      'prioridade'      : servico['prioridade'],
                                      'nr-soli-pai'     : servico['nr-soli-serv']});
        }

        controller.generating = function() {

            var param = {
                iFormaAgrup : controller.iFormaAgrup,
                ttSolicServOrdem : controller.ttSolicServ,
                ttOrdemSolic : []
            } 

            controller.ttListOM.forEach(function(ordem)  {
                param.ttOrdemSolic.push({'nrSoliServ'   : ordem.nrSoliServ,
                                         'nr-ord-produ' : ordem['nr-ord-produ'],
                                         'descricao'    : ordem['descricao'],
                                         'cd-equipto'   : ordem['cd-equipto'] === undefined ? "" : ordem['cd-equipto']['cd-equipto'],
                                         'cd-manut'     : ordem['cd-manut'] === undefined ? "" : ordem['cd-manut'].cdManut,
                                         'cd-tipo'      : ordem['cd-tipo'] === undefined ? 0 : ordem['cd-tipo']['cd-tipo'] ,
                                         'da-manut'     : ordem['da-manut'],
                                         'plano-orig'   : ordem['plano-orig'],
                                         'cd-planejado' : ordem['cd-planejado'] === undefined ? "" : ordem['cd-planejado'],
                                         'cd-equip-res' : ordem['cd-equip-res'] === undefined ? "" : ordem['cd-equip-res']['cd-equipe'],
                                         'prioridade'   : ordem['prioridade'] === "" ? 0 : ordem['prioridade'],
                                         'nr-soli-pai'  : ordem['nr-soli-pai']});
            }); 

            fchmipservicerequest.gerarOM(param, function(result){
                var lSuccess = true;
                if(result) {
                    result.forEach(function (ordem) {
                        if (ordem.lSuccess){
                            controller.refreshPage = true;
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'success',
                                title: ($rootScope.i18n('l-service-request') + ": " + ordem.nrSoliServ),
                                detail: $rootScope.i18n('msg-success-order-created-number',ordem.nrOrdProdu)
                            });
                            controller.limparList(ordem);
                        }else {
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'error',
                                title: ($rootScope.i18n('l-service-request') + ": " + ordem.nrSoliServ),
                                detail: ordem.descricao
                            });
                            lSuccess = false;
                        }
                    })

                    if (lSuccess == true){
                        $modalInstance.close();
                    }
                }
            });
        }

        controller.limparList = function (ordemSolic) {
            if(controller.iFormaAgrup === 3){
                controller.ttListOM = controller.ttListOM.filter(function(ordem){
                    return ordem['nr-soli-pai'] !== ordemSolic.nrSolicPai;
                })
                controller.ttSolicServ = controller.ttSolicServ.filter(function(ordem){
                    return ordem['nr-soli-serv'] !== ordemSolic.nrSolicPai;
                })
            }else{
                controller.ttListOM = controller.ttListOM.filter(function(ordem){
                    return ordem['cd-equipto'] !== ordemSolic.cdEquipto;
                })
                controller.ttSolicServ = controller.ttSolicServ.filter(function(ordem){
                    return ordem['cd-equipto'] !== ordemSolic.cdEquipto;
                })
            }
        }

        controller.setLoadModal = function(){
            controller.lLoadModal = true;
        }

        /**
         * Leave Equipamento
         */
        controller.leaveCdEquipto = function(ordem) {
            controller.calculaPrioridade(ordem);
        }

        /**
         * Leave Cod Manut
         */
        controller.leaveCdManut = function(ordem) {
            if(ordem['cd-tipo'] === undefined &&
               ordem['cd-manut'] !== undefined){
                ordem['cd-tipo'] = ordem['cd-manut'].cdTipo;
            }
            controller.calculaPrioridade(ordem)
        }

        /**
         * Leave Tipo Manut
         */
        controller.leaveCdTipo = function(ordem){
            controller.calculaPrioridade(ordem);
        }

        /**
         * Calcula prioridade da ordem
         */
        controller.calculaPrioridade = function(ordem) {
            if (controller.lLoadModal === true){
                params = [];
                params.push({ 
                    'cdEquipto': ordem['cd-equipto'] === undefined ? "" : ordem['cd-equipto']['cd-equipto'],
                    'cdManut': ordem['cd-manut'] === undefined ? "" : ordem['cd-manut'].cdManut, 
                    'cdTag': ordem['cd-tag'] === undefined ? "" : ordem['cd-tag'],
                    'cdTipo': ordem['cd-tipo'] === undefined ? 0: ordem['cd-tipo']['cd-tipo']
                })
                
                fchmipservicerequest.getPriority(params, function(result){
                    if(result){
                        ordem.prioridade        = result[0].prioridade;
                        ordem['cd-equip-res'] = result[0].cdEquipRes;
                        ordem['cd-planejado'] = !ordem['cd-planejado'] ? result[0].cdPlanejado : ordem['cd-planejado'];

                        if (ordem['cd-manut']) {
                            ordem['plano-orig']     = ordem['cd-manut'].planoOrig;
                            ordem['des-plano-orig'] = controller.setLegPlano(ordem['cd-manut'].planoOrig);    
                        } else {
                            ordem['plano-orig']     = "";
                            ordem['des-plano-orig'] = "";        
                        }
                    }
                });
            }
        }
        
        /**
         * Legenda do plano origem
         */
        controller.setLegPlano = function(plano) {	    	
            if (plano === 'manut')
                return $rootScope.i18n('l-standard-maintenance');
            else if(plano === 'man-eq-tag')
                return $rootScope.i18n('l-equipment-plan-tag');
            else if(plano === 'man-equip')
                return $rootScope.i18n('l-equipment-plan');
            else if(plano === 'man-fam')
                return $rootScope.i18n('l-family-plan');
            else if(plano === 'man-tag-fam')
                return $rootScope.i18n('l-family-plan-tag');
            
        }

        controller.init();

        controller.close = function () {
            if(controller.refreshPage == true){
                $modalInstance.close();
            }else{
                $modalInstance.dismiss();
            }
        }
    }

    index.register.service('helperPlanoOrigZoom', function(){
		return {
			data :{}
		};
	});

    index.register.controller('mmi.generateorder.GenerateCtrl', generateOrderGenerateCtrl);
});