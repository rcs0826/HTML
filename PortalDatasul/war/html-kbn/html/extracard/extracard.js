define(["index",
        "/dts/kbn/html/extracard/extracard.list.js",
        "/dts/kbn/html/extracard/extracard.task.js"
], function(index) {

    var stateProvider = index.stateProvider;
    stateProvider.state("dts/kbn/extracard", {
        abstract: true,
        template: "<br><ui-view/>"
    });

    stateProvider.state("dts/kbn/extracard.start", {
        url: "/dts/kbn/extracard",
        controller: "kbn.extracard.ListCtrl",
        controllerAs: "controller",
        templateUrl: "/dts/kbn/html/extracard/extracard.list.html"
    });

    stateProvider.state("dts/kbn/extracard.task", {
        url: "/dts/kbn/extracard/:itemDetailId?quantity",
        controller: "kbn.extracard.TaskCtrl",
        controllerAs: "controller",
        templateUrl: "/dts/kbn/html/extracard/extracard.task.html"
    });
});
