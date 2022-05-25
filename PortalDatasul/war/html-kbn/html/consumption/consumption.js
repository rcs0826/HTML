define([
	"index",
	"/dts/kbn/html/consumption/consumption.task.js"
], function(index) {
	index.stateProvider
		.state("dts/kbn/consumption", {
			abstract: true,
			template: "<ui-view/>"
		})
		.state("dts/kbn/consumption.start", {
			url:"/dts/kbn/consumption",
			controller:"kbn.consumption.taskCtrl",
			controllerAs: "controller",
			templateUrl:"/dts/kbn/html/consumption/consumption.task.html"
		});
});
