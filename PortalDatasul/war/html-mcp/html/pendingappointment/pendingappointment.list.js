define(["index"], function (index) {
  pendingappointmentListCtrl.$inject = [
    "$rootScope",
    "$scope",
    "$location",
    "totvs.app-main-view.Service",
    "fchman.fchmanpendingappointment.Factory",
    "TOTVSEvent",
  ];

  function pendingappointmentListCtrl(
    $rootScope,
    $scope,
    $location,
    appViewService,
    fchmanpendingappointmentFactory,
    TOTVSEvent
  ) {
    var controller = this;
    var createTab;
    var previousView;

    isMenuUpdated = false;

    /**
     * Metodo de busca se menu esta atualizado
     */
    controller.loadData = function () {
      fchmanpendingappointmentFactory.verificaAtualizacaoMenu(
        {},
        function (result) {
          if (result) {
            console.log(result);
            controller.isMenuUpdated = result.isUpdated;
          }
        }
      );
    };

    controller.openNewLocation = function () {
      var path = "totvs-menu/program-html/html.pendingappointmentPO/";
      $location.path(path);
    };

    this.init = function () {
      createTab = appViewService.startView(
        $rootScope.i18n("l-pending-appointment"),
        "mcp.pendingappointment.ListCtrl",
        controller
      );
      previousView = appViewService.previousView;

      controller.loadData();
    };

    if ($rootScope.currentuserLoaded) {
      this.init();
    }

    $scope.$on("$destroy", function () {
      controller = undefined;
    });

    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
      controller.init();
    });
  }

  index.register.controller(
    "mcp.pendingappointment.ListCtrl",
    pendingappointmentListCtrl
  );
});