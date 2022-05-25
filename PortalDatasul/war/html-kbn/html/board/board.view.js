define([
    'index',
    '/dts/kbn/js/factories/kbn-factories.js',
    '/dts/kbn/js/filters.js',
    '/dts/kbn/js/helpers.js',
    '/dts/kbn/js/factories/mappingErp-factories.js',
    '/dts/kbn/html/board/board.modal.js',
    '/dts/kbn/html/board/board.manualitems.modal.js',
    '/dts/kbn/html/board/board.itemDetail.modal.js',
    '/dts/kbn/html/board/board.queueLock.modal.js',
    '/dts/kbn/js/factories/board-factory.js',
    '/dts/kbn/js/enumkbn.js'
], function(index) {

    boardViewController.$inject = [
        '$scope',
        '$q',
        '$stateParams',
        'kbn.data.Factory',
        'kbn.board.modal.modal',
        'kbn.boards.Factory',
        'totvs.app-main-view.Service',
        '$rootScope',
        'kbn.board.manualItems.service',
        'kbn.board.itemDetail.service',
        'kbn.board.queueLock.service',
        'kbn.mappingErp.Factory',
        'kbn.helper.Service',
        'messageHolder',
        'enumkbn'
    ];

    function boardViewController(
        $scope,
        $q,
        $stateParams,
        dataFactory,
        modalWorkcenter,
        boardsFactory,
        appViewService,
        $rootScope,
        modalManualItemsService,
        modalItemDetailService,
        modalQueueLockService,
        mappingErpFactory,
        kbnHelper,
        messageHolder,
        enumkbn
    ) {
        var _self = this;

        _self.stopRefreshing = true;
        _self.imRunning = false;

        _self.init = function(byAutoRefresh) {

            _self.worksCenter = [];
            _self.cell = {};
            _self.id = $stateParams.id;
            _self.andonObj = {};
            _self.listKanban = [];
            _self.listRangeFixed = [];
            _self.listRangeBloqued = [];
            _self.listRangeAction = [];
            _self.listLogRangeAction = [];
            _self.listJustificativesLockedCard = [];
            _self.carryingSize = 0;
            _self.blockedSize = 0;
            _self.hasManualItems = false;
            _self.settings = {
                order: "priority",
                selectManualItens: undefined
            };

            createTab = appViewService.startView($rootScope.i18n('l-board'), 'kbn.board.ViewController', boardViewController);

            if(_self.id){

                _self.settings = dataFactory.getBoardSettings(_self.id);

                $scope.$watch('controller.settings', _self.settingsChanged, true);

                _self.loadData();

            }

            if(byAutoRefresh) setTimeout(_self.refresh,600000); //Atualiza a cada 10 minutos

        };

        _self.qtdCartoesSelecionados = function() {
            var cards = _self.selectedCards();
            return cards.length;
        };

        _self.colorCard = function(idColor){
            return kbnHelper.colorCard(idColor);
        };

        _self.shouldShowUnlockCardIcon = function() {

            var cards = _self.selectedCards();

            if(cards.length > 0){

                cards = cards.filter(function(card){
                    return !card.blocked;
                });

                if(cards.length == 0){
                    return true;
                }

            }

            return false;

        };

        _self.shouldShowLockCardIcon = function() {

            var cards = _self.selectedCards();

            if(cards.length > 0){

                cards = cards.filter(function(card){
                    return card.blocked;
                });

                if(cards.length == 0){
                    return true;
                }

            }

            return false;
        };

        _self.UnlockCards = function(event) {

            preventDefault(event);

            var cards = _self.selectedCards();

            var cardsId = cards.map(function(card){
                return {id: card.ttCartoesDs.num_id_cartao};
            });

            mappingErpFactory.desbloquearCartao({}, cardsId, function(){

                messageHolder.showNotify({
                    type: 'info',
                    title: $rootScope.i18n('l-unlock-cards-success')
                });

                _self.init();

            });

        };

        _self.openQueueLock = function(event) {
            preventDefault(event);

            var cards = _self.selectedCards();

            var cardsId = cards.map(function(card){
                return {id: card.ttCartoesDs.num_id_cartao};
            });

            modalQueueLockService.open({
                items: cardsId,
                id: _self.cell.num_id_cel,
                justificatives: _self.listJustificativesLockedCard
            }).then( function(result){
                if(result){
                    _self.init();
                }
            });
        };

        _self.onlyExtraCardsSelected = function(){

            var cards = _self.selectedCards();

            if(cards.length > 0){

                cards = cards.filter(function(card){
                    return !(card.color == 4);
                });

                if(cards.length == 0){
                    return true;
                }

            }

            return false;
        }

        _self.deleteExtraCards = function(event){

            preventDefault(event);

            messageHolder.showQuestion(
                $rootScope.i18n('l-delete-extra-cards'),
                $rootScope.i18n('l-msg-to-delete-extra-cards'),
                function (answer) {

                    if (answer === true) {

                        var cards = _self.selectedCards();

                        var cardsId = cards.map(function(card){
                            return {id: card.num_id_cartao};
                        });

                        mappingErpFactory.deletarCartaoExtra({}, cardsId, function(){

                            messageHolder.showNotify({
                                type: 'info',
                                title: $rootScope.i18n('l-delete-extra-cards-success')
                            });

                            _self.init();

                        });

                    }
                }
            );

        }

        _self.abreModal = function(){

            _self.stopRefreshing = !_self.stopRefreshing;

            if(_self.stopRefreshing)
                $('#refreshButton')[0].style.backgroundColor = '#eee';
            else
                $('#refreshButton')[0].style.backgroundColor = '#8ac';

            if(!_self.imRunning){
                _self.imRunning = true;
                _self.init(true);
            }
        }

        _self.refresh = function(){

            if(!_self.stopRefreshing){
                _self.imRunning = true;
                _self.init(true);
            }else
                _self.imRunning = false;

        }

        resizeDaView = function(boardWidth, qtdChildren){
            $scope.$apply();
            totalWidth = boardWidth % qtdChildren;
            totalWidth = boardWidth - totalWidth;
            totalWidth = totalWidth - 20;
            valueForEach = totalWidth/qtdChildren;


            for(i=0; i < $("#quadro").children().length; i++){

                kanbanStack = $($("#quadro").children()[i]);
                kanbanPilha = $(kanbanStack.children()[0]);

                if(valueForEach>300){
                    kanbanPilha.width(valueForEach);
                } else {
                    kanbanPilha.width(300);
                }

            }

        };

        window.onresize = function(){
            resizeDaView($("#quadro").width(), $("#quadro").children().length);
        };

        var filterSelectedCard = function(card) {
            return card.checked;
        };

        _self.selectedCards = function(){

            var cards = [];

            cards = cards.concat(_self.listRangeAction.filter(filterSelectedCard));
            cards = cards.concat(_self.listRangeBloqued.filter(filterSelectedCard));
            cards = cards.concat(_self.listRangeFixed.filter(filterSelectedCard));

            return cards;
        };

        _self.produceOnCel = function() {

            var cards = _self.selectedCards();

            if(!cards.length){
                cards.push(_self.listRangeFixed[0]);
            }

            cards = cards.map(function(itemQueue) {
                return {id: itemQueue.ttCartoesDs.num_id_cartao};
            });

            if(_self.selected.num_id_ct_mestre){
                mappingErpFactory.ProduceCardsID({id:_self.selected.num_id_ct_mestre},cards,function(){
                    _self.init(false);
                });
            }else{
                messageHolder.showNotify({
                    type: 'error',
                    title: $rootScope.i18n('l-inform-workcenter')
                });
            }

        };

        _self.loadData = function(){
            _self.loadCellItems();
            _self.loadJustificatives();
            _self.loadWorkcenter();
        };

        _self.loadWorkcenter = function(){
            mappingErpFactory.getCtFromMasterCel({num_id_cel_mestre:_self.id},function(result){
                _self.worksCenter = result;
                
                if(!_self.selected){
                    _self.selected = _self.worksCenter[0];
                }
            });
        };

        _self.loadJustificatives = function() {

            cardLock = {
                properties: "num_id_categ",
                restriction: "EQUALS",
                values: enumkbn.justificativeCategory.cardLock
            };

            mappingErpFactory.justificatives(cardLock,function(result){
                _self.listJustificativesLockedCard = result;
            });
        };

        _self.loadCellItems = function() {
            boardsFactory.getCellItems({num_id_cel_mestre : _self.id},
                function(result) {
                    _self.loadCell(result);
                    _self.manualItemKanbanBoard(result[0].itemDetail);
                    _self.loadItems(result[0].itemDetail);
                    _self.carryingSize = result[0].qtd_cartoes_trans;
                    _self.blockedSize = result[0].qtd_cartoes_bloq;

                    _self.loadQueue();

                    boardsFactory.getAndon({celId:_self.id}, function(obj) {
                        if (obj.retorno) {
                            _self.cell.andon = obj.retorno;
                            _self.andonObj = obj;
                        }
                    });
                }
            );
        };

        _self.loadCell = function(result) {
            _self.cell = result[0];
        };

        _self.loadQueue = function() {
            _self.listRangeAction = [];

            boardsFactory.fila({celId: _self.cell.num_id_cel}, function(fila){

                fila.forEach(function(cartao){

                    if(cartao.ttCartoesDs.idi_extra){
                        cor = enumkbn.color.blue
                    }else{
                        cor = enumkbn.color.green;

                        _self.listKanban.forEach(function(item){

                            if(item.itemId == cartao.ttCartoesDs.ttItemDetDs.num_id_item_det){

                                if(item.totalKanbans - item.totalGreenZone - item.totalYellowZone > 0){
                                    cor = enumkbn.color.red;
                                }else if(item.totalKanbans - item.totalGreenZone > 0){
                                    cor = enumkbn.color.yellow;
                                }
                            }
                        });

                    }

                    cartao.frozen = false;
                    cartao.blocked = false;
                    cartao.checked = false;
                    cartao.productionTime = cartao.ttCartoesDs.ttItemDetDs.vli_tempo_ciclo * cartao.ttCartoesDs.ttItemDetDs.qti_tam_kanban;
                    cartao.color = cor;

                    if(cartao.log_etiq_bloq){
                        cartao.blocked = true;
                        _self.listRangeBloqued.push(cartao);
                    }else if(cartao.log_faixa_fixa){
                        _self.listRangeFixed.push(cartao);
                    }else{
                        _self.listRangeAction.push(cartao);
                    }
                });
                
                if(_self.listRangeAction.length == 0 && _self.listRangeFixed.length == 0 && _self.listRangeBloqued.length == 0){

                    _self.listKanban.forEach(function(boardItem){

                        if(!boardItem.itemManual && boardItem.totalKanbans > 0){
                            boardItem.showSendItemToQueue = true;
                        }
                    });
                }

            });

        }

        _self.loadItems = function (result) {

            _self.listKanban = [];

            result.forEach(function(itemDetail) {
                _self.listKanban.push({
                    itemId: itemDetail.num_id_item_det,
                    sku: itemDetail.cod_chave_erp,
                    description: itemDetail.des_item_erp,
                    reference: itemDetail.item.cod_refer,
                    expedition: itemDetail.item.log_expedic,
                    totalRedZone: itemDetail.qti_vermelha_kanban,
                    totalYellowZone: itemDetail.qti_amarela_kanban,
                    totalGreenZone: itemDetail.qti_verde_kanban,
                    totalKanbans: itemDetail.qti_cartoes_quadro,
                    itemManual: itemDetail.log_prog_manual,
                    kanbanSize: itemDetail.qti_tam_kanban,
                    unitOfMeasure: itemDetail.item.cod_un_med_erp,
					tempoCiclo: itemDetail.vli_tempo_ciclo,
					tempoSetup: itemDetail.vli_tempo_setup,
					codeDeposErp: itemDetail.cod_depos_erp,
					codeLocationErp: itemDetail.cod_localiz
                });
            });
        };

        _self.manualItemKanbanBoard = function (result) {
            _self.hasManualItems = result.reduce(function(previousValue, currentValue) {
                return previousValue | currentValue.log_prog_manual;
            }, false);
        };

        _self.showManualIcon = function(select) {
            if (select === undefined) return true;
            if (select === true) return true;
            if (select === false) return false;
        };

        _self.showAutomaticIcon = function(select) {
            if (select === undefined) return true;
            if (select === true) return false;
            if (select === false) return true;
        };

        _self.changeFilter = function(event, ind) {
            preventDefault(event);

            if (ind == 'man' && _self.settings.selectManualItens === undefined) _self.settings.selectManualItens = false;
            else if (ind == 'auto' && _self.settings.selectManualItens === undefined) _self.settings.selectManualItens = true;
            else if (ind == 'man' && _self.settings.selectManualItens === false) _self.settings.selectManualItens = undefined;
            else if (ind == 'auto' && _self.settings.selectManualItens === true) _self.settings.selectManualItens = undefined;

            var items = _self.listKanban.reduce(function(prev, current) {
                if (_self.settings.selectManualItens === undefined) return prev + 1;
                if (current.itemManual == _self.settings.selectManualItens) return prev + 1;
                return prev;
            }, 0);

            resizeDaView($("#quadro").width(), items);
        };

        var preventDefault = function(event) {
            if(event) {
                event.preventDefault();
                event.stopPropagation();
            }
        };

        _self.openManualItems = function(event) {
            preventDefault(event);
            modalManualItemsService.open({
                items: _self.listKanban,
                workcenters: _self.worksCenter
            }).then( function(result){
				_self.init();
            });
        };

        _self.changeOrder = function(event) {
            preventDefault(event);

            if (_self.settings.order !== "name") {
                _self.settings.order = "name";
                return;
            }
            if (_self.settings.order !== "priority") {
                _self.settings.order = "priority";
                return;
            }
        };

        _self.openItemDetail = function(event, itemDetail) {
            preventDefault(event);
            modalItemDetailService.open({
                items: itemDetail,
                id: _self.cell.num_id_cel
            }).then( function(result){
                if(result){
                    _self.init();
                }
            });
        };

        _self.quantifyPriority = function(stack) {
            var totalGreen = Math.min(stack.totalKanbans, stack.totalGreenZone);
            var acc = totalGreen;
            var totalYellow = Math.min(stack.totalKanbans - acc, stack.totalYellowZone);
            totalYellow = Math.max(totalYellow, 0);
            acc += totalYellow;
            var totalRed = Math.min(stack.totalKanbans - acc, stack.totalRedZone);
            totalRed = Math.max(totalRed, 0);

            var greenRatio = totalGreen / stack.totalGreenZone / 3;
            var yellowRatio = totalYellow / stack.totalYellowZone / 3;
            var redRatio = totalRed / stack.totalRedZone / 3;

            return greenRatio + yellowRatio + redRatio;
        };

        _self.settingsChanged = function(value, oldValue) {
            if (!value){
                return;
            }
            dataFactory.setBoardSettings(_self.id, value);
        };

        var setAndonTrue = function() {
            boardsFactory.startAndon({celId:_self.id}, function(obj) {
                if (obj) {
                    _self.cell.andon = true;
                    _self.andonObj = obj;
                }
            });
        };

        var setAndonFalse = function() {
            boardsFactory.stopAndon({celId:_self.id}, function(obj) {
                if (obj) {
                    _self.cell.andon = false;
                    _self.andonObj = {};
                }
            });
        };

        $scope.changeState = function(flag) {
            (flag) ? setAndonTrue() : setAndonFalse();
        };

        _self.getWorkCenterModal = function(workCenter) {

            var params = {
                workcenter : workCenter,
                model : _self.cell,
                type: 'workcenter',
                justificatives: _self.listJustificativesLockedCard,
                itens: _self.listKanban
            };

            modalWorkcenter.open(params).then( function(result){
                if(result){
                    _self.init();
                }
            });

        };

        _self.getTransportSku = function(){

            var params = {
                model : _self.cell,
                type: 'transport',
                justificatives: _self.listJustificativesLockedCard,
                itens: _self.listKanban
            };

            modalWorkcenter.open(params).then( function(result){
                if(result){
                    _self.init();
                }
            });
        };

        _self.getLockedSku = function(){

            var params = {
                model : _self.cell,
                type: 'locked',
                justificatives: _self.listJustificativesLockedCard,
                itens: _self.listKanban
            };

            modalWorkcenter.open(params).then( function(result){
                if(result){
                    _self.init();
                }
            });

        };

        _self.horizonSizeComparator = function(value, index, array) {
            var timeAccumulator = 0;
            var SdoAnterior = 0;

            for(var i = 0; i <= index; ++i) {
            timeAccumulator += array[i].productionTime;
            }
            SdoAnterior = _self.cell.qtd_horiz - timeAccumulator + array[index].productionTime;
            return SdoAnterior > 0;
        };

        _self.sendCardToQueue = function(event,item){
            preventDefault(event);
            
            boardsFactory.sendItemToQueue({num_id_item_det:item.itemId}, function(obj){
                if (obj){
                    _self.init();   
                }                
            });
        };

        _self.checkCard = function(card) {
            card.checked = !card.checked;
        };

        _self.checkEveryCard = function(everyCardInQueue, card) {
            _self.checkCard(card);

            everyCardInQueue.forEach(function(target) {
                if (card.ttCartoesDs.ttItemDetDs.num_id_item_det != target.ttCartoesDs.ttItemDetDs.num_id_item_det) return;
                target.checked = card.checked;
            });
        };

        _self.init();
    }

    index.register.controller('kbn.board.ViewController', boardViewController);
});
