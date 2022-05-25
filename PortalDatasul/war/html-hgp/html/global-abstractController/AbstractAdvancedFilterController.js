define(['index',
    '/dts/hgp/html/js/util/DateTools.js'
    ], function (index) {

    AbstractAdvancedFilterController.$inject = [];
    function AbstractAdvancedFilterController(){
        
        this.hasValidConfigurations = false;
        this.model= {};
        
        // initialize
        this.initialize = function () {
            if (angular.isUndefined(this.filtersConfig)
            || this.filtersConfig.length === 0){
                return;
            }
            

            if (angular.isUndefined(this.disclaimers)){
                this.disclaimers = [];
            }

            this.hasValidConfigurations = true;

            var _self = this;

            angular.forEach(_self.filtersConfig, function (conf) {
                if (angular.isUndefined(conf.defaultValue)) {
                    if(conf.isDate === true
                    || conf.isZoom === true){
                        _self.model[conf.modelVar] = undefined;
                    }else{
                        _self.model[conf.modelVar] = '';
                    }
                } else {
                    _self.model[conf.modelVar] = conf.defaultValue;
                }

                angular.forEach(_self.disclaimers, function (disclaimer) {
                    if (disclaimer.property === conf.property) {
                        _self.model[conf.modelVar] = disclaimer.value;
                    }
                });
            });

        };
        
        this.generateLabel = function (conf, value) {
            if(angular.isUndefined(conf.labelFunction) == false){
                return conf.labelFunction(value);
            } else if (typeof value === "object"){
                if (conf.isDate === true) {
                    return (new Date(value.startDate).toString('dd/MM/yyyy')) +
                            " até " +
                            new Date(value.endDate).toString('dd/MM/yyyy') ;
                } else if (!angular.isUndefined(value.start)) {
                    return value.start + " a " + value.end;
                } else if(conf.isZoom
                       && !angular.isUndefined(conf.objectId)){
                    return value[conf.objectId];
                } else {
                    return value;
                }
            }else if(conf.isDate === true){
                return new Date(value).toString('dd/MM/yyyy');
            } else {
               return value;
            }
        }

        // constructDisclaimers
        this.constructDisclaimers = function () {
            if (this.hasValidConfigurations === false)
                return;

            var _self = this;
            var hasFoundFilter = false;
            var value = '';
            
            angular.forEach(this.filtersConfig, function (conf) {
                hasFoundFilter = false;
                value = _self.model[conf.modelVar];

                for (var i = 0; i < _self.disclaimers.length; ++i) {
                    if (_self.disclaimers[i].property === conf.property) {
                        if (angular.isUndefined(value)
                        || value == '' || value == null) {
                            _self.disclaimers.splice(i, 1);
                        } else {
                            hasFoundFilter = true;
                            _self.disclaimers[i].value = value;
                            _self.disclaimers[i].title = conf.title + ': ' + _self.generateLabel(conf,value);
                        }
                    }
                }

                //não cria filtro ja existente, ou sem valor
                if (!hasFoundFilter
                && !angular.isUndefined(value)
                && value != '' 
                && value != null) {
                    //não cria filtro com valor default
                    if (angular.isUndefined(conf.defaultValue)
                    || value !== conf.defaultValue){
                        var titleAux = conf.title + ': ' + _self.generateLabel(conf,value);

                        var disclaimerAux = {property: conf.property,
                                                value: value,
                                             title: titleAux};

                        if(conf.isZoom
                        && !angular.isUndefined(conf.objectId)){
                            disclaimerAux.value = value[conf.objectId];
                        }

                        _self.disclaimers.push(disclaimerAux);
                    }

                }
            });
        };
        
        // cleanFields
        this.cleanFields = function () {
            var _self = this;
            angular.forEach(this.filtersConfig, function (conf) {
                if (angular.isUndefined(conf.defaultValue) == true) {
                    if(conf.isDate == true){
                        _self.model[conf.modelVar] = undefined;
                    }else{
                        _self.model[conf.modelVar] = '';
                    }
                } else {
                    _self.model[conf.modelVar] = conf.defaultValue;
                }
            });
        };

        return this;
        
    };
    
    index.register.factory('AbstractAdvancedFilterController', AbstractAdvancedFilterController);

});
