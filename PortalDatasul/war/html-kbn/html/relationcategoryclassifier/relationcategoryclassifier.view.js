define(['index',
        '/dts/kbn/html/relationcategoryclassifier/linkitemclassifier.modal.js',
        'ng-load!ui-file-upload',
        '/dts/kbn/js/factories/mappingErp-factories.js',
        '/dts/kbn/js/factories/kbn-factories.js',
        '/dts/kbn/js/helpers.js',
        '/dts/kbn/js/filters.js',
        '/dts/kbn/js/filters-service.js',
        '/dts/kbn/js/directives.js'
], function(index) {

    relationcategoryclassifierViewController.$inject = [
        '$scope',
        '$stateParams',
        'kbn.data.Factory',
        'kbn.mappingErp.Factory',
        'totvs.app-main-view.Service',
        '$rootScope',
        'ekanban.linkitemclassifier.modal',
        'Upload',
        'TOTVSEvent',
        'kbn.helper.Service',
        'kbn.filters.service',
        'messageHolder'];

    function relationcategoryclassifierViewController(
        $scope,
        $stateParams,
        dataFactory,
        mappingErpFactories,
        appViewService,
        $rootScope,
        linkItemClassifierModal,
        Upload,
        TOTVSEvent,
        kbnHelper,
        filtersService,
        messageHolder){

        var _self = this;

        _self.init = function() {

            createTab = appViewService.startView($rootScope.i18n('l-relac-item-clasdor'), 'kbn.relationcategoryclassifier.ViewController', relationcategoryclassifierViewController);
            _self.id = $stateParams.id;

            _self.title = "";

            mappingErpFactories.GetKbnClassif({
                num_id_clasdor: _self.id
            },{},function(result){
                _self.title = result[0]['tt-kbn_categoria2'][0].des_categoria + " / " + result[0].des_clasdor;
            });

            _self.listItem = [];
        };

        _self.establishmentChanged = function(value, oldValue) {
            _self.establishment = value;
            _self.removeFilter({property : "item"});
            _self.getItemsOnClassif();
        };

        _self.getItemsOnClassif = function() {

            mappingErpFactories.getItemsOnClassif({
                cod_estab_erp: _self.establishment,
                num_id_clasdor: _self.id
            },{}, function(result){
                _self.listItem = kbnHelper.sortList(result);
            });
        };

        _self.openLinkItemClassifierModal = function() {
            var params = {
                establishment: _self.establishment,
                num_id_clasdor: _self.id
            };
            linkItemClassifierModal.open(params).then(function(){

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type:   'info',
                    title:  $rootScope.i18n('l-link-success')
                });

                _self.getItemsOnClassif();
            });
        };

        _self.uploadFiles = function($validFiles) {

            if($validFiles && $validFiles.length > 0) {
                _self.doUpload($validFiles);
            }

        };

        _self.doUpload = function(files) {

            _self.barProgress = true;

            return Upload.upload({
                arrayKey: '',
                url: '/dts/datasul-rest/resources/api/fch/fchkb/fchkbmapping/importaItemEstab?cod_estab_erp=' + _self.establishment + '&' + 'num_id_clasdor=' + _self.id,
                headers: {'noCountRequest': 'true'},
                file: files
            }).success(function (result, status, headers, config) {
                _self.barProgress = false;

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type:   'info',
                    title:  $rootScope.i18n('l-import-success')
                });

                _self.getItemsOnClassif();
            });
        };

        _self.removeFilter = function(filter) {
            filtersService.removeFilter('relationItemClassifier',filter.property);
            _self.quickSearchText = '';
            _self.quickSearchTextTemp = '';
        };

        _self.fillDataQuickSearch = function(text) {
            if (text === undefined || text === '') return;
            _self.quickSearchTextTemp = '';
            _self.quickSearchText = text;
            _self.createDisclaimer(_self.quickSearchText || "");
        };

        _self.quickSearchFilter = function(obj) {
            var searchString = _self.quickSearchText || "";
            return _self.stringMatches(obj.cod_chave_erp + " - " + obj.des_item_erp, searchString);
        };

        _self.stringMatches = function(string, search) {
            if (search.trim() === "") return true;

            var src = string.toLowerCase();
            var dst = search.toLowerCase();

            return src.indexOf(dst) != -1;
        };

        _self.createDisclaimer = function(args) {
            if (!(args && args !== "")) return;

            var disclaimer = {
                property: "item",
                restriction: "LIKE",
                title: $rootScope.i18n('l-description') + ': ' + args,
                value: args || ""
            };
            filtersService.addFilter("relationItemClassifier", disclaimer);
            _self.filtersApplied = filtersService.get('relationItemClassifier');
        };

        _self.validateSizeRecords = function(listItem){
            return listItem.reduce(function(previous,current){
                if (_self.quickSearchFilter(current)) {
                    return previous + 1;
                }
                return previous;
            },0);
        };

        _self.selectAllItems = function() {
            var unselectedItem = _self.listItem.filter(function(item) {
                return !item.selected;
            });
            if(unselectedItem.length === 0) {
                _self.listItem.forEach(function(item) {
                    item.selected = false;
                });
            } else {
                _self.listItem.forEach(function(item) {
                    item.selected = true;
                });
            }
        };

        _self.itemsSelected = function() {
            _self.listItemsFiltered = _self.listItem.filter(function(e) {
                return e.selected;
            });

            _self.listItemsFiltered = _self.listItemsFiltered.map(function(e) {
                e.num_id_clasdor = _self.id;
                return e;
            });
        };

        _self.deleteItem = function() {
            _self.itemsSelected();

            if (_self.listItemsFiltered.length > 0) {
                messageHolder.showQuestion(
                $rootScope.i18n('l-remove-link'),
                $rootScope.i18n('msg-item-classif-confirm'),
                function(answer){
                    if(answer) {
                        mappingErpFactories.DeleteKbnRelacItemClassif({}, _self.listItemsFiltered, function(){
                            messageHolder.showNotify({
                                type: 'info',
                                title: $rootScope.i18n('l-delete-items-sucess')
                            });
                            _self.getItemsOnClassif();
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

        _self.init();
    }

    index.register.controller('kbn.relationcategoryclassifier.ViewController', relationcategoryclassifierViewController);
});
