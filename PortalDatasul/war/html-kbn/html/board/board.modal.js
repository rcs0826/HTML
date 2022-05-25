define([
    'index',
    '/dts/kbn/js/helpers.js',    
    '/dts/kbn/js/factories/card-factory.js',
    '/dts/kbn/js/enumkbn.js',
], function (index) {

    modalCellEdit.$inject = ['$modal'];
    function modalCellEdit($modal) {

        this.open = function (params) {

            var instance = $modal.open({
                templateUrl: '/dts/kbn/html/board/board.modal.html',
                controller: 'kbn.board.modal.ctrl as controller',
                backdrop: 'static',
                keyboard: true,
                size: 'lg',
                resolve: { parameters: function () { return params; } }
            });

            return instance.result;

        }

    }

    cellEditCtrl.$inject = [
        '$q',
        '$scope',
        '$rootScope',
        'parameters',
        '$modalInstance',
        '$controller',
        'kbn.helper.Service',
        'kbn.cards.Factory',
        'enumkbn'
    ];
    function cellEditCtrl(
        $q,
        $scope,
        $rootScope, 
        parameters, 
        $modalInstance,
        $controller,
        kbnHelper,
        cardsFactory,
        enumkbn
    ){

        var _self = this;

        _self.preencheValuePadrao = function(){

            _self.myParams.model.tags.forEach(function(obj){
                obj.lock = false;
                obj.shopping = false;
                obj.move = false;
                obj.desktop = false;

                obj.justification = {
                    num_id_justif: 0,
                    des_jutif: "",
                    num_id_categ: 0
                };

                if(obj.idi_extra){
                    obj.color = enumkbn.color.blue;
                }else{

                    obj.color = enumkbn.color.green;

                    _self.myParams.itens.forEach(function(item){

                        if(item.itemId == obj.num_id_item_det){

                            if(item.totalKanbans - item.totalGreenZone - item.totalYellowZone > 0){
                                obj.color = enumkbn.color.red;
                            }else if(item.totalKanbans - item.totalGreenZone > 0){
                                obj.color = enumkbn.color.yellow;
                            }
                        }
                    });

                }

            }); 

        };

        _self.init = function(){

            _self.myParams = angular.copy(parameters);
            _self.titleModal = "";

            _self.listJustification = _self.myParams.justificatives;

            if(_self.myParams.type=="transport"){

                _self.titleModal = $rootScope.i18n('l-cards-transport')

                filtros = {
                    properties: ["idi_status","num_id_cel"],
                    restriction: ["EQUALS","EQUALS","EQUALS"],
                    values: [4,_self.myParams.model.num_id_cel]
                }

                cardsFactory.getCards(filtros,function(result){
                    _self.myParams.model.tags = result;
                    _self.preencheValuePadrao();
                });

            }else if(_self.myParams.type=="locked"){

                _self.titleModal = $rootScope.i18n('l-cards-lock')

                filtros = {
                    properties: ["idi_status","num_id_cel"],
                    restriction: ["EQUALS","EQUALS","EQUALS"],
                    values: [5,_self.myParams.model.num_id_cel]
                }

                cardsFactory.getCards(filtros,function(result){
                    _self.myParams.model.tags = result;
                    _self.preencheValuePadrao();
                });

            }else if(_self.myParams.type=="workcenter"){

                _self.titleModal = _self.myParams.workcenter.cod_chave_erp + " - " + _self.myParams.workcenter.des_ct_erp;

                filtros = {
                    properties: ["idi_status","num_id_cel","num_id_ct_mestre"],
                    restriction: ["EQUALS","EQUALS","EQUALS"],
                    values: [3,_self.myParams.model.num_id_cel,_self.myParams.workcenter.num_id_ct_mestre]
                }

                cardsFactory.getCards(filtros,function(result){
                    _self.myParams.model.tags = result;
                    _self.preencheValuePadrao();
                });

            }else{
                console.info("Modal exige o parametro type.");
                return;
            }

            _self.model = {};

        };


        _self.colorTag = function(idColor){
            return kbnHelper.colorTag(idColor);
        };

        _self.cancel = function(){
            $modalInstance.dismiss('cancel');
        };

        _self.transportSku = function(card,espValue){
            
            if(espValue===undefined){
                card.move = !card.move;
            }else{
                card.move = espValue;
            }

            if(card.move){
                card.shopping = false;
                card.lock = false;
                card.desktop = false;
            }

        };

        _self.transportAllSku = function(){

            value = !(_self.myParams.model.tags.map(function(e) { return e.move; }).indexOf(false) == -1);

            _self.myParams.model.tags.forEach(function(obj){

                _self.transportSku(obj,value);

            });

        };

        _self.openLockDivGen = function(){

            if(_self.myParams.model.tags.map(function(e) { return e.lock; }).indexOf(false) == -1){
                _self.lockAllSku();
            }else{
                _self.flagJustifyLock = true;
            }

        }

        _self.closeLockDivGen = function(){
            _self.flagJustifyLock = false;
        }

        _self.openLockDivCard = function(card){

            if(card.lock){
                _self.lockSku(card);
            }else{
                card.flagJustifyLock = true;
            }
        }

        _self.closeLockDivCard = function(card){
            card.flagJustifyLock = false;
        }

        _self.lockSku = function(card,espValue,justification){

            if (justification !== undefined){
                card.justification = justification;
            }

            if(card.justification.num_id_justif){
                
                card.num_id_justif = card.justification.num_id_justif;
                card.ttJustifModalDs = card.justification;

                if(espValue===undefined){
                    card.lock = !card.lock;
                }else{
                    card.lock = espValue;
                }

                if(card.lock){
                    card.move = false;
                    card.shopping = false;
                    card.desktop = false;
                }
                
                _self.closeLockDivCard(card);

            }

        };

        _self.lockAllSku = function(card){

            if(_self.model.justification){

                value = !(_self.myParams.model.tags.map(function(e) { return e.lock; }).indexOf(false) == -1);

                _self.myParams.model.tags.forEach(function(obj){

                    _self.lockSku(obj,value,_self.model.justification);

                });

                _self.closeLockDivGen();
            }

        };

        _self.storeSku = function(card,espValue){

            if(espValue===undefined){
                card.shopping = !card.shopping;
            }else{
                card.shopping = espValue;
            }

            if(card.shopping){
                card.move = false;
                card.lock = false;
                card.desktop = false;
            }

        };

        _self.storeAllSku = function(){

            value = !(_self.myParams.model.tags.map(function(e) { return e.shopping; }).indexOf(false) == -1);

            _self.myParams.model.tags.forEach(function(obj){

                _self.storeSku(obj,value);

            });

        };

        _self.boardSku = function(card,espValue){

            if(espValue===undefined){
                card.desktop = !card.desktop;
            }else{
                card.desktop = espValue;
            }

            if(card.desktop){
                card.move = false;
                card.lock = false;
                card.shopping = false;
            }

        };

        _self.boardAllSku = function(){

            value = !(_self.myParams.model.tags.map(function(e) { return e.desktop; }).indexOf(false) == -1);

            _self.myParams.model.tags.forEach(function(obj){

                _self.boardSku(obj,value);

            });

        };

        _self.save = function(){
            
            cardsFactory.cardMovement(_self.myParams.model.tags, function(result){
                $modalInstance.close(true);
            })

        }

        _self.init();

    };

    index.register.controller('kbn.board.modal.ctrl', cellEditCtrl);
    index.register.service('kbn.board.modal.modal', modalCellEdit);

});
