define([
    "index",
    "/dts/kbn/js/factories/mappingErp-factories.js",
    "/dts/kbn/js/helpers.js"
], function(index) {
    extraCardTaskController.$inject = [
        "$rootScope",
        "$state",
        "totvs.app-main-view.Service",
        "$stateParams",
        "kbn.mappingErp.Factory",
        "messageHolder",
        'kbn.helper.Service'
    ];
    function extraCardTaskController(
        $rootScope,
        $state,
        appViewService,
        $stateParams,
        mappingErpFactory,
        messageHolder,
        kbnHelper
    ) {
        var _self = this;

        var init = function() {

            mappingErpFactory.itemDetail({num_id_item_det: $stateParams.itemDetailId},{}, function(result){
                _self.itemDetail = [];
                if(result.length > 0){
                    _self.itemDetail = result;
                    _self.itemDetail.num_id_item_det = $stateParams.itemDetailId;
                    _self.itemDetail.cod_un_med_erp  = result[0].cod_un_med_erp;
                }

            });
            _self.amount = $stateParams.quantity || 0;
            _self.listJustification = [];
            _self.isActive = true;
            _self.justification = {};
            _self.invalidJustificative = false;

            appViewService.startView($rootScope.i18n("l-calc-extra-cards"), "kbn.extracard.TaskCtrl", extraCardTaskController);

            if($stateParams.quantity)
                _self.calc($stateParams.itemDetailId, $stateParams.quantity);

        };

        _self.calc = function(id, amount) {

            amount = amount.replace(",", ".");
            mappingErpFactory.calculaCartaoExtra({
                num_id_item_det: id,
                qtdDeman: amount
            },{},function(result){

                _self.itemDetailChildren = result;

                _self.itemDetailChildren.forEach(function(itemDetailChild){
                    itemDetailChild.itemUnique = {                        
                        codeErp: itemDetailChild.cod_erp_item_pai,
                        description: itemDetailChild.desc_item_pai,
                        expedition: itemDetailChild.log_expedic_item_pai,
                        reference: itemDetailChild.refer_item_pai,
                        unitOfMeasure: itemDetailChild.cod_un_med_erp_pai
                    };

                });
                if (result.length == 0){
                    messageHolder.showNotify({
                        type: 'error',
                        title: $rootScope.i18n('l-item-extra-card-no')
                    });
                }
            });

            var properties = {
                classifiers: "",
                currentPage: 0,
                pageSize: 0,
                properties: ["num_id_categ"],
                restriction: ["EQUALS"],
                values: [4]
            };

            mappingErpFactory.justificatives(properties, {}, function(result) {
                _self.listJustification = result;
            });
        };

        _self.colorTag = function(idColor){
            return kbnHelper.colorTag(idColor);
        };

        _self.clear = function() {
            _self.amount = 0;
            _self.isActive = true;
            _self.itemDetailChildren = [];
        };

        _self.createExtraCards = function() {

            if(typeof _self.justification == "undefined" || typeof _self.justification.num_id_justif == "undefined"){
                _self.invalidJustificative = true;
                return;
            }else{
                _self.invalidJustificative = false;
            }

            var items = _self.itemDetailChildren.filter(function(e) {
                return e.selected;
            });

            if (items.length > 0) {

                mappingErpFactory.aplicarCartaoExtra({justificative:_self.justification.num_id_justif}, items, function(result){
					if(!result.$hasError){
						messageHolder.showNotify({
							type: 'success',
							title: $rootScope.i18n('l-issue-cards-success')
						});

						$state.go('dts/kbn/extracard.task', {
								itemDetailId: $stateParams.itemDetailId,
								quantity: undefined
							});
					}
                });

            } else {
                messageHolder.showNotify({
                    type: 'error',
                    title: $rootScope.i18n('l-not-selected')
                });
            }
        };

        _self.checkChildren = function() {
            var unselectedChildren = _self.itemDetailChildren.filter(function(child) {
                return !child.selected;
            });

            if(unselectedChildren.length === 0) {
                _self.itemDetailChildren.forEach(function(child) {
                    child.selected = false;
                });
            } else {
                _self.itemDetailChildren.forEach(function(child) {
                    child.selected = true;
                });
            }
        };

        init();
    }

    index.register.controller("kbn.extracard.TaskCtrl", extraCardTaskController);
});
