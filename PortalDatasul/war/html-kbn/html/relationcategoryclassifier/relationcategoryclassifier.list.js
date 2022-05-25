define([
    'index',
    '/dts/kbn/html/relationcategoryclassifier/category.edit.js',
    '/dts/kbn/html/relationcategoryclassifier/classifier.edit.js',
    '/dts/kbn/js/filters.js',
    '/dts/kbn/js/factories/mappingErp-factories.js',
    '/dts/kbn/js/filters-service.js',
    '/dts/kbn/js/factories/kbn-factories.js'
], function(index) {

    relationcategoryclassifierController.$inject = [
        '$scope',
        'kbn.mappingErp.Factory',
        'totvs.app-main-view.Service',
        '$rootScope',
        'ekanban.category.edit.modal',
        'ekanban.classifier.edit.modal',
        'kbn.data.Factory',
        'kbn.filters.service',
        'kbn.helper.Service',
        'TOTVSEvent',
        'messageHolder'
    ];

    function relationcategoryclassifierController(
         $scope,
         mappingErpFactories,
         appViewService,
         $rootScope,
         categoryModalEdit,
         classifierModalEdit,
         dataFactory,
         filtersService,
         kbnHelper,
         TOTVSEvent,
         messageHolder
    ) {
        var _self = this;

        _self.init = function() {
            createTab = appViewService.startView($rootScope.i18n('l-relation-category-classifier'), 'kbn.relationcategoryclassifier.Controller', relationcategoryclassifierController);
            _self.getCategoriesClassifiers();
        };

        _self.getCategoriesClassifiers = function() {
            mappingErpFactories.getCategClassif({},{}, function(result){
                _self.listCategory = result.map(function(e) {
                    e.display = dataFactory.get('kbn.relationcategoryclassifier.display.' + e.num_id_categoria) == "true";
                    return e;
                });
            });
        };

        _self.openCategoryModal = function(action, category) {
            var params = {
                model: category,
                action: action
            };
            categoryModalEdit.open(params).then(function(){

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type:   'info',
                    title:  $rootScope.i18n('l-' + action + '-category-success')
                });

                _self.getCategoriesClassifiers();
            });
        };

        _self.openClassifierModal = function(action, classifier) {
            var params = {
                model: classifier,
                action: action
            };
            classifierModalEdit.open(params).then(function(){

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type:   'info',
                    title:  $rootScope.i18n('l-' + action + '-classifier-success')
                });

                _self.getCategoriesClassifiers();
            });
        };

        _self.displayClassifier = function(onClick) {
            if (onClick.display === undefined)
                onClick.display = false;
            onClick.display = !onClick.display;

            dataFactory.set('kbn.relationcategoryclassifier.display.' + onClick.num_id_categoria, onClick.display);
        };

        _self.deleteCategory = function(idCateg){
            messageHolder.showQuestion(
                $rootScope.i18n('l-remove-category'),
                $rootScope.i18n('msg-category-confirmation'),
                function(answer){
                    if (answer) {
                        mappingErpFactories.deleteCateg({num_id_categoria: idCateg}, function(){
                            _self.mesSuccess('l-remove-category');
                        });
                    }
                }
            );};

        _self.deleteClasdor = function(idClassf){
            messageHolder.showQuestion(
                $rootScope.i18n('l-remove-classif'),
                $rootScope.i18n('msg-classif-confirmation'),
                function(answer){
                    if(answer) {
                        mappingErpFactories.deleteClasdor({num_id_clasdor: idClassf}, function(){
                            _self.mesSuccess('l-remove-classif');
                        });
                    }
                });
        };

        _self.mesSuccess = function(text){
            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                type:   'info',
                title:  $rootScope.i18n(text),
                detail: $rootScope.i18n('l-success-transaction'),
            });
            _self.getCategoriesClassifiers();
        };

        _self.removeFilter = function(filter) {
            filtersService.removeFilter('relationCategoryClassifier',filter.property);
            _self.quickSearchText = '';
            _self.quickSearchTextTemp = '';
        };

        _self.fillDataQuickSearch = function(text) {
            if (text === undefined || text === '') return;
            _self.quickSearchTextTemp = '';
            _self.quickSearchText = text;
            _self.createDisclaimer(_self.quickSearchText || "");
        };

        _self.createDisclaimer = function(args) {
            if (!(args && args !== "")) return;
            filtersService.removeFilter("relationCategoryClassifier", "des_categoria");

            var disclaimer = {
                property: "des_categoria",
                restriction: "LIKE",
                title: $rootScope.i18n('l-description') + ': ' + args,
                value: args || ""
            };
            filtersService.addFilter("relationCategoryClassifier", disclaimer);
            _self.filtersApplied = filtersService.get('relationCategoryClassifier');
        };

        _self.quickSearchFilter = function(obj) {
            var searchString = _self.quickSearchText || "";
            return _self.stringMatches(obj.des_categoria, searchString);
        };

        _self.stringMatches = function(string, search) {
            if (search.trim() === "") return true;

            var src = string.toLowerCase();
            var dst = search.toLowerCase();

            return src.indexOf(dst) != -1;
        };

        _self.validateSizeRecords = function(listCategory){
            return listCategory.reduce(function(previous,current){
                if (_self.quickSearchFilter(current)) {
                    return previous + 1;
                }
                return previous;
            },0);
        };

        _self.init();
    }

    index.register.controller('kbn.relationcategoryclassifier.Controller', relationcategoryclassifierController);
});
