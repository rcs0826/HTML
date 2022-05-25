define(['index', '/dts/kbn/js/factories/mappingErp-factories.js'], function(index) {
    function kanbanStackDirective() {
        return {
            restrict: 'E',
            scope: {
                item: '=',
                itemClick: '=',
                sendItemToQueue: '='
            },
            templateUrl: '/dts/kbn/libs/directives/board.kanban.stack.html'
        };
    }

    function setHeightDirective($window){
        return {
            link: function($scope, element, attrs){

                var watch = $scope.$watch(function() {
                    return element.children().length;
                }, function() {

                    $scope.$evalAsync(function() { });

                });

            }
        };
    }

    function setWidthDirective($window){
        return {
            link: function($scope, element, attrs){

                var watch = $scope.$watch(function() {
                    return element.children().length;
                }, function() {

                    $scope.$evalAsync(function() {

                        totalWidth = element.width() % element.children().length;

                        totalWidth = element.width() - totalWidth;

                        totalWidth = totalWidth - 20;

                        valueForEach = totalWidth/element.children().length;

                        if(valueForEach>300){

                            for(i=0; i < element.children().length; i++){

                                kanbanStack = $(element.children()[i]);
                                kanbanPilha = $(kanbanStack.children()[0]);

                                kanbanPilha.width(valueForEach);

                            }

                        }

                    });

                });

            }
        };
    }

    function fieldAddonDirective($interpolate, $compile, $http, $templateCache) {
        return {
            require: '^form',
            restrict: 'E',
            priority: 200,
            terminal: true,
            compile: function (element, attrs) {

                var validationMsgs = {};
                var validators = element.find('validator');
                angular.forEach(validators, function (validator) {
                    validator = angular.element(validator);
                    validationMsgs[validator.attr('key')] = $interpolate(validator.text());
                });

                var label = attrs.label;

                var labelContent;

                if (label && label.length > 0) {

                    labelContent = label;

                    /*if (attrs.$attr.required) {
                        labelContent = labelContent + ' *';
                    }*/
                }

                var options = [];
                var opts = element.find('options').children();
                angular.forEach(opts, function (opt) {
                    opt = angular.element(opt);
                    options.push({
                        id: opt.attr('value'),
                        text: opt.text()
                    });
                });

                var includeHTML = element.find('include').html();
                var zoomDef = element.find('zoom')[0];

                element.html('');

                return function postLink(scope, element, attrs) {

                    var template = attrs.type || 'input';

                    $http.get("/dts/kbn/libs/directives/" + template + ".addon.html", {
                        cache: $templateCache
                    }).then(function (response) {
                        var templateElement = angular.element(response.data);

                        var childScope = scope.$new();
                        childScope.$validationMessages = angular.copy(validationMsgs);
                        childScope.$options = options;
                        childScope.$fieldId = attrs.ngModel.replace('.', '_').toLowerCase();

                        var inputElement = templateElement.find('[bind]');
                        angular.forEach(attrs.$attr, function (original, normalized) {
                            if (original != 'type' && original != 'class') {
                                var value = element.attr(original);
                                inputElement.attr(original, value);
                            }
                        });

                        inputElement.attr('name', childScope.$fieldId);
                        inputElement.attr('id', childScope.$fieldId);

                        var addon = attrs.addon;

                        if (addon) {

                            var addonElement = templateElement.find('div.input-group-addon');
                            addonElement.html(addon);
                        }

                        if (labelContent) {

                            childScope.$fieldLabel = $interpolate(label)(scope);

                            var labelElement = templateElement.find('label');
                            labelElement.attr('for', childScope.$fieldId);
                            labelElement.html(labelContent);
                            labelElement.attr('tooltip', label);
                            labelElement.attr('tooltip-placement', 'top');

                        } else {

                            templateElement.find('label').remove();
                            templateElement.find('div.col-xs-8').removeClass();
                        }

                        var includeElement = templateElement.find('[include]');
                        if (includeElement.length > 0)
                            includeElement.append(includeHTML);

                        if (zoomDef) {
                            var inputgroup = templateElement.find('.input-group');
                            var inputgroupbtn = inputgroup.find('.input-group-btn');
                            if (inputgroupbtn.length === 0) {
                                inputgroupbtn = angular.element('<span class="input-group-btn"></span>');
                                inputgroup.append(inputgroupbtn);
                                inputgroup.addClass('no-block');
                            }
                            var zoomHTML = angular.element("<zoom></zoom>");
                            zoomHTML.attr("ng-model",attrs.ngModel);
                            zoomHTML.attr("ng-disabled",attrs.ngDisabled);

                            for (i = 0; i < zoomDef.attributes.length; i++)
                            {
                                var a = zoomDef.attributes[i];
                                zoomHTML.attr(a.name, a.value);
                            }
                            inputgroupbtn.append(zoomHTML);

                        }


                        if (attrs.$attr.class) {
                            element.addClass("col-xs-12");
                        } else {
                            element.addClass("col-xs-12 col-md-6");
                        }

                        if (attrs.$attr.canclean) {
                            var inputgroup = templateElement.find('.input-group');
                            var inputgroupbtn = inputgroup.find('.input-group-btn');
                            if (inputgroupbtn.length === 0) {
                                inputgroupbtn = angular.element('<span class="input-group-btn"></span>');
                                inputgroup.append(inputgroupbtn);
                                inputgroup.addClass('no-block');
                            }

                            var btClean = angular.element('<button class="btn btn-default" data-ng-click="cleanValue()">' +
                                '<span class="glyphicon glyphicon-remove"></span></button>');

                            if (attrs.ngDisabled) {
                                btClean.attr('data-ng-disabled', attrs.ngDisabled);
                            }

                            inputgroupbtn.append(btClean);
                        }

                        element.append(templateElement);
                        $compile(templateElement)(childScope);
                        childScope.$field = inputElement.controller('ngModel');
                        childScope.cleanValue = function () {
                            inputElement.controller('ngModel').$setViewValue(undefined);
                            inputElement.controller('ngModel').$render();
                        };

                        childScope.$watch('$field.$dirty && $field.$error', function (errorList) {
                            childScope.$fieldErrors = [];
                            angular.forEach(errorList, function (invalid, key) {
                                if (invalid) {
                                    childScope.$fieldErrors.push(key);
                                }
                            });
                        }, true);

                    }, function (response) {
                        throw new Error('Template not found: ' + template + '.addon.html');
                    });

                };

            }

        };
    }

    function kanbanFloatingDiv() {
        return {
            restrict: 'E',
            templateUrl: '/dts/kbn/libs/directives/kanban.floatingdiv.html',
            transclude: true,
            controller: function() {
                var _self = this;

                _self.init = function() {
                    _self.show = false;
                };

                _self.toggle = function(event) {
                    preventDefault(event);
                    _self.show ^= true;
                };

                var preventDefault = function(event) {
                    if(event) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                };

                _self.init();
            },
            controllerAs: "kanbanFloatingDiv"
        };
    }
	
	function kanbanClassifierSelectAdv() {
        var kanbanClassifierSelectAdvController = [
            'kbn.mappingErp.Factory',
            '$scope',
            'kbn.data.Factory',
            function(mappingErpFactories,$scope, dataFactory, element, attrs) {
                var _self = this;

                var init = function() {
                    _self.displaySubtitle = false;
					var savedClassifiers = $scope.ngModel;
                    savedClassifiers = savedClassifiers.reduce(function(previous, current) {
                        return previous.concat(current);
                    }, []);

                    mappingErpFactories.getCategClassif({},{}, function(result){
                        result.forEach(function(category) {
                            if (category['tt-kbn_clasdor'] === undefined) return;
                            category['tt-kbn_clasdor'] = category['tt-kbn_clasdor'].map(function(classifier) {
                                classifier.checked = false;
                                if(savedClassifiers.indexOf(classifier.num_id_clasdor) != -1) classifier.checked = true;
                                return classifier;
                            });
                        });

                        _self.checkCategories(result);
                        _self.listCategory = result;
                    });

                };

                _self.checkCategories = function(result) {
                    result.forEach(function(category) {
                        category.select = false;

                        if (category['tt-kbn_clasdor'] === undefined) return;
                        category.checked = category['tt-kbn_clasdor'].reduce(function(previous, current) {
                            return previous && current.checked;
                        }, true);

                        category['tt-kbn_clasdor'].forEach(function(obj){
                            if (obj.checked === true) category.select = true;
                        });

                        if (category.select) _self.displaySubtitle = true;
                    });
                };

                _self.toggle = function(category) {
                    if (category.show === undefined)
                        category.show = false;

                    category.show ^= true;
                };

                _self.check = function(classifier) {

                    if(classifier.checked === undefined)
                        classifier.checked = false;

                    classifier.checked = !classifier.checked;

                    _self.callback();
                };

                _self.checkAll = function(category) {

                    category['tt-kbn_clasdor'].forEach( function(classifier){
                        classifier.checked = category.checked;
                    });

                    _self.callback();

                };

                _self.getSelectedClassifiers = function() {
                    categories = angular.copy(_self.listCategory);
                    var categoriesWithClassifiers = categories.filter(function(category) {
                        if (category['tt-kbn_clasdor'] === undefined) return false;
                        return category['tt-kbn_clasdor'].length > 0;
                    });

                    categoriesWithClassifiers.forEach(function(category) {
                        category['tt-kbn_clasdor'] = category['tt-kbn_clasdor'].filter(function(classifier) {
                            return classifier.checked;
                        });
                    });

                    var categoriesWithSelectedClassifiers = categoriesWithClassifiers.filter(function(category) {
                        return category['tt-kbn_clasdor'].length > 0;
                    });

                    selected = categoriesWithSelectedClassifiers.map(function(category) {
                        return category['tt-kbn_clasdor'].map(function(classifier) {
                            return classifier.num_id_clasdor;
                        });
                    });

                    return selected;
                };

                _self.callback = function(){
                    _self.checkCategories(_self.listCategory);
                    $scope.ngModel = _self.getSelectedClassifiers();
                };

                init();
            }
        ];
        return {
            restrict: 'E',
            scope: {
                ngModel: '='
            },
            templateUrl: '/dts/kbn/libs/directives/kanban.classifierselect.adv.html',
            controller: kanbanClassifierSelectAdvController,
            controllerAs: 'kanbanClassifierSelect'
        };
    }

    function kanbanClassifierSelect() {
        var kanbanClassifierSelectController = [
            'kbn.mappingErp.Factory',
            '$scope',
            'kbn.data.Factory',
            function(mappingErpFactories,$scope, dataFactory, element, attrs) {
                var _self = this;

                var init = function() {
                    var savedClassifiers =  JSON.parse(dataFactory.get('kanbanClassifierSelect') || '[]');
                    savedClassifiers = savedClassifiers.reduce(function(previous, current) {
                        return previous.concat(current);
                    }, []);

                    mappingErpFactories.getCategClassif({},{}, function(result){
                        result.forEach(function(category) {
                            if (category['tt-kbn_clasdor'] === undefined) return;
                            category['tt-kbn_clasdor'] = category['tt-kbn_clasdor'].map(function(classifier) {
                                classifier.checked = false;
                                if(savedClassifiers.indexOf(classifier.num_id_clasdor) != -1) classifier.checked = true;
                                return classifier;
                            });
                        });

                        _self.checkCategories(result);
                        _self.listCategory = result;
                    });

                };

                _self.checkCategories = function(result) {
                    result.forEach(function(category) {
                        if (category['tt-kbn_clasdor'] === undefined) return;
                        category.checked = category['tt-kbn_clasdor'].reduce(function(previous, current) {
                            return previous && current.checked;
                        }, true);
                    });
                };

                _self.toggle = function(category) {
                    if (category.show === undefined)
                        category.show = false;

                    category.show ^= true;
                };

                _self.check = function(classifier) {

                    if(classifier.checked === undefined)
                        classifier.checked = false;

                    classifier.checked = !classifier.checked;

                    _self.callback();
                };

                _self.checkAll = function(category) {

                    category['tt-kbn_clasdor'].forEach( function(classifier){
                        classifier.checked = category.checked;
                    });

                    _self.callback();

                };

                _self.getSelectedClassifiers = function() {
                    categories = angular.copy(_self.listCategory);
                    var categoriesWithClassifiers = categories.filter(function(category) {
                        if (category['tt-kbn_clasdor'] === undefined) return false;
                        return category['tt-kbn_clasdor'].length > 0;
                    });

                    categoriesWithClassifiers.forEach(function(category) {
                        category['tt-kbn_clasdor'] = category['tt-kbn_clasdor'].filter(function(classifier) {
                            return classifier.checked;
                        });
                    });

                    var categoriesWithSelectedClassifiers = categoriesWithClassifiers.filter(function(category) {
                        return category['tt-kbn_clasdor'].length > 0;
                    });

                    selected = categoriesWithSelectedClassifiers.map(function(category) {
                        return category['tt-kbn_clasdor'].map(function(classifier) {
                            return classifier.num_id_clasdor;
                        });
                    });

                    return selected;
                };

                _self.callback = function(){
                    _self.checkCategories(_self.listCategory);
                    var selectedClassifiers = _self.getSelectedClassifiers();
                    dataFactory.set('kanbanClassifierSelect',JSON.stringify(selectedClassifiers));
                    $scope.selectedClassifiersCallback(selectedClassifiers);
                };

                init();
            }
        ];
        return {
            restrict: 'E',
            scope: {
                selectedClassifiersCallback: '='
            },
            templateUrl: '/dts/kbn/libs/directives/kanban.classifierselect.html',
            controller: kanbanClassifierSelectController,
            controllerAs: 'kanbanClassifierSelect'
        };
    }

    function establishmentSelectDirective() {
        var establishmentSelectController = [
            'kbn.mappingErp.Factory',
            '$scope',
            'kbn.data.Factory',
            function(mappingErpFactory, $scope, dataFactory) {

                var _self = this;

                _self.init = function() {
                    _self.localModel = $scope.callerModel;
                    _self.preInit();
                    _self.callback = $scope.callback || angular.noop;
                    _self.callbackId = $scope.callbackId || angular.noop;
                    $scope.callbackNoEstablishment = $scope.callbackNoEstablishment || angular.noop;
                    _self.listEstab = mappingErpFactory.getKbnEstablishment(_self.getEstablishmentCallback);
                    $scope.$watch("establishmentSelectController.localModel", _self.estabSelected);
                };

                _self.preInit = $scope.preInit || function() {
                    _self.localModel = dataFactory.getEstablishment() || {};
                };

                _self.getEstablishmentCallback = function(result) {
                    _self.findSelectedEstablishment(result);
                };

                _self.findSelectedEstablishment = function(result) {
                    if (result.length === 0) $scope.callbackNoEstablishment();

                    if (typeof _self.localModel === "object") return;

                    _self.localModel = result.filter(function(e) {
                        return e.cod_estab_erp == _self.localModel;
                    }).pop();
                };

                _self.estabSelected = function(value, oldValue){
                    if (!value) return;
                    if (JSON.stringify(value) === "{}") return;
                    if (value === oldValue) return;

                    _self.preEstabSelected(value, oldValue);
                    $scope.callerModel = _self.localModel.cod_estab_erp;
                    _self.callback(value.cod_estab_erp, (oldValue || {}).cod_estab_erp);
                    _self.callbackId(value.num_id_estab, (oldValue || {}).num_id_estab);
                };

                _self.preEstabSelected = $scope.preEstabSelected || function(value, oldValue) {
                    dataFactory.setEstablishmentDirective(value);
                };

                _self.update =  function() {
                    $scope.callerModel = _self.localModel.cod_estab_erp;
                };

                _self.init();
            }
        ];
        return {
            restrict: 'E',
            scope: {
                callerModel: '=ngModel',
                callback: '=',
                callbackId: '=',
                preInit: '=',
                preEstabSelected: '=',
                callbackNoEstablishment: '='
            },
            templateUrl: '/dts/kbn/libs/directives/establishment.select.html',
            controller: establishmentSelectController,
            controllerAs: 'establishmentSelectController'
        };
    }
    
    function establishmentSelectAdvDirective() {
        var establishmentSelectController = [
            'kbn.mappingErp.Factory',
            '$scope',
            'kbn.data.Factory',
            function(mappingErpFactory, $scope, dataFactory) {

                var _self = this;

                _self.init = function() {
                    _self.localModel = $scope.callerModel;
                    
                    if (!_self.localModel){
                        _self.localModel = dataFactory.getEstablishmentDirective() || {};  
                    }
                    
                    _self.listEstab = mappingErpFactory.getKbnEstablishment(_self.getEstablishmentCallback);
                    $scope.$watch("establishmentSelectController.localModel", _self.estabSelected);
                };

                _self.getEstablishmentCallback = function(result) {
                    _self.findSelectedEstablishment(result);
                };

                _self.findSelectedEstablishment = function(result) {
                    if (result.length === 0) $scope.callbackNoEstablishment();

                    _self.localModel = result.filter(function(e) {
                        return e.cod_estab_erp == _self.localModel.cod_estab_erp;
                    }).pop();
                };

                _self.estabSelected = function(value, oldValue){
                    if (!value) return;
                    if (JSON.stringify(value) === "{}") return;
                    if (value === oldValue) return;

                    $scope.callerModel = _self.localModel;
                };
                
                _self.init();
            }
        ];
        return {
            restrict: 'E',
            scope: {
                callerModel: '=ngModel',
                callback: '=',
                callbackId: '=',
                preInit: '=',
                preEstabSelected: '=',
                callbackNoEstablishment: '='
            },
            templateUrl: '/dts/kbn/libs/directives/establishment.select.html',
            controller: establishmentSelectController,
            controllerAs: 'establishmentSelectController'
        };
    }

    index.register.directive('fieldAddon', fieldAddonDirective);
    index.register.directive('kanbanStack', kanbanStackDirective);
    index.register.directive('setHeight', setHeightDirective);
    index.register.directive('setWidth', setWidthDirective);
    index.register.directive('kanbanFloatingDiv', kanbanFloatingDiv);
    index.register.directive('kanbanClassifierSelect', kanbanClassifierSelect);
    index.register.directive('establishmentSelect', establishmentSelectDirective);
	index.register.directive('establishmentSelectAdv', establishmentSelectAdvDirective);
	index.register.directive('kanbanClassifierSelectAdv', kanbanClassifierSelectAdv);
});
