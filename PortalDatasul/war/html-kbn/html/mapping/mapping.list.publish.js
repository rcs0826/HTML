define(['index',
        '/dts/kbn/js/helpers.js',
        '/dts/kbn/js/factories/mappingErp-factories.js'
], function(index) {

    mappingModalPublishService.$inject = ["$modal"];
    function mappingModalPublishService($modal) {
        var _self = this;

        _self.open = function(params) {
            var instance = $modal.open({
                templateUrl: "/dts/kbn/html/mapping/mapping.list.publish.html",
                controller: "ekanban.mapping.publish.ctrl as controller",
                backdrop: "static",
                keyboard: true,
                size: "lg",
                resolve: {
                    parameters: function () { return params; }
                }
            });

            return instance.result;
        };
    }

    mappingModalPublishController.$inject = [
        "parameters",
        "$modalInstance",
        "messageHolder",
        "$rootScope"
    ];
    function mappingModalPublishController(
        parameters,
        $modalInstance,
        messageHolder,
        $rootScope
    ){
        var _self = this;

        function init() {
            _self.checklist = parameters;
        }

        _self.close = function() {
            $modalInstance.dismiss();
        };

        _self.save = function() {
            $modalInstance.close();
        };

        init();
    }

    index.register.controller("ekanban.mapping.publish.ctrl", mappingModalPublishController);    index.register.service("ekanban.mapping.publish.service", mappingModalPublishService);
});
