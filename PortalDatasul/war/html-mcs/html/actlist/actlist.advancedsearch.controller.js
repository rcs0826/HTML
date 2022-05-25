define(['index',
        '/dts/mcs/js/zoom/estabelec.js'], function (index) {

    controllerAdvancedSearch.$inject = [ '$rootScope', '$scope', '$modalInstance', 'parameters' ];

    function controllerAdvancedSearch($rootScope, $scope, $modalInstance, parameters) {
        var self = this;

        self.apply = function () {

            self.parseModelToDisclaimers();

            self.prepareParams();

            $modalInstance.close({disclaimers: self.disclaimers,
                                  parametros: self.param}); // fecha modal retornando parametro
        }

        self.parseModelToDisclaimers = function() {
            self.disclaimers = [];

            for (key in self.model) {
                var model = self.model[key];

                if(model == undefined)
                    continue;

                switch(key) {
                    case 'site':
                        self.disclaimers.push({
                            property: 'site',
                            value: self.model[key],
                            title: $rootScope.i18n('l-site', [], 'dts/mcs') + ': ' + self.model[key],
                            fixed: true
                        });
                    break;
                    case 'dtTrans':
                        self.disclaimers.push({
                            property: 'dtTrans',
                            value: self.model[key],
                            title: $rootScope.i18n('l-transaction-date', [], 'dts/mcs') + ': ' + (new Date(self.model[key])).toLocaleDateString('pt-br'),
                            fixed: true
                        });
                    break;
                    case 'itemCodeRange':
                        if ((self.model[key].start != "" && self.model[key].start != undefined) || (self.model[key].end != "ZZZZZZZZZZZZZZZZ")) {
                            self.disclaimers.push({
                                property: 'itemCodeRange',
                                value: self.model[key],
                                title: $rootScope.i18n('l-item', [], 'dts/mcs') + ': ' + (self.model[key].start || "") + ' ' +
                                    $rootScope.i18n('l-to', [], 'dts/mcs') + ' ' + (self.model[key].end || ""),
                                fixed: false
                            });
                        }
                    break;
                }
            };
        }

        self.prepareParams = function() {

            self.param = {siteCode: self.model.site,
                          dtTrans: self.model.dtTrans,
                          itemCodeRange: self.model.itemCodeRange};
        }

        self.setDefaultsParameter = function () {

            self.model.dtTrans = parameters.dtTrans;
            self.model.site = parameters.siteCode;
            self.model.itemCodeRange = parameters.itemCodeRange;
            self.model.closingType = parameters.closingType;
        }

        self.cancel = function () {
            $modalInstance.dismiss('cancel'); // fecha modal sem retornar parametros
        }

        self.init = function () {
            self.model = {};

            self.setDefaultsParameter();
        }

        self.init();

        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
             $modalInstance.dismiss('cancel');
        });
    };

    index.register.controller('mcs.actlist.advancedsearch.controller', controllerAdvancedSearch);
});