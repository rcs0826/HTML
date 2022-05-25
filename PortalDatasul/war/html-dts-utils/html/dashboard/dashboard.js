/*global $, index, angular, define, TOTVSEvent, require*/
/*jslint plusplus: true*/
/*jslint continue: true*/

define(['index',
	'less!/dts/dts-utils/assets/css/dashboardstyle.less',
	'/dts/dts-utils/html/dashboard/ngDraggable.js'
	], function (index) {

	'use strict';

	index.stateProvider

		.state('dts/dts-utils/dashboard', {
			abstract: true,
			template: '<ui-view/>'
		}).state('dts/dts-utils/dashboard.start', {
			url: '/dts/dts-utils/dashboard',
			controller: 'dts-utils.dashboard.Controller',
			controllerAs: 'controller',
			templateUrl: '/dts/dts-utils/html/dashboard/dashboard.html'
		}).state('dts/dts-utils/dashboard.open', {
			url: '/dts/dts-utils/dashboard/:dashboardId',
			controller: 'dts-utils.dashboard.Controller',
			controllerAs: 'controller',
			templateUrl: '/dts/dts-utils/html/dashboard/dashboard.html'
		}).state('dts/dts-utils/dashboard.configure', {
			url: '/dts/dts-utils/dashboard/:dashboardId/settings',
			controller: 'dts-utils.dashboard.EditController',
			controllerAs: 'controller',
			templateUrl: '/dts/dts-utils/html/dashboard/dashboard.settings.html'
		});

	var modalAddWidget,
		dashboardCtrl,
		addDashboardCtrl,
		dashboardEditController;

	dashboardCtrl = function (appViewService, $stateParams, $totvsresource, $rootScope, $state, $http) {

		var controllerDashboard = this,
			dashboardResource = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchutils/fchutils0001/dashboard/:dashboardId', {dashboardId: '@dashboardId'}, {});

		controllerDashboard.dashboardId = $stateParams.dashboardId;

		controllerDashboard.loadData = function (isStartView) {
			var i,
				js,
				jss;

			dashboardResource.TOTVSGet({dashboardId: controllerDashboard.dashboardId}, function (data) {
				controllerDashboard.dashboard = data.ttDashboard[0];

				if (isStartView === true) {
					appViewService.startView(controllerDashboard.dashboard.dashboardName, 'dts-utils.dashboard.Controller');
				}

				jss = [];

				// monta um array com os JS´s do widgets
				for (i = 0; i < data.ttWidgets.length; i++) {
					js = data.ttWidgets[i].widgetSource;
					js = js.substring(0, js.lastIndexOf('.')) + '.js';
					jss.push(js);
				}

				if(jss.length) {
					require(jss, function () {
						controllerDashboard.widgets = data.ttWidgets;
						$rootScope.$apply();
					});
				}

				if (jss.length === 0) {
					controllerDashboard.settings();
				}

			}, {noCountRequest: true });
		};

		controllerDashboard.loadData(true);

		controllerDashboard.settings = function () {
			$state.go('dts/dts-utils/dashboard.configure', {dashboardId: controllerDashboard.dashboardId});
		};

	}; // function dashboardCtrl(appViewService)

	dashboardCtrl.$inject = ['totvs.app-main-view.Service', '$stateParams', '$totvsresource', '$rootScope', '$state', '$http'];

	dashboardEditController = function (appViewService, $stateParams, $totvsresource, $rootScope, $state, $window,
										ngDraggable, TOTVSEvent, addWidgetsModal, $http) {
		var controllerSettings = this,
			dashboardResource = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchutils/fchutils0001/dashboard/:dashboardId', {dashboardId: '@dashboardId'}, {});

		controllerSettings.dashboardId = $stateParams.dashboardId;
		controllerSettings.removedwidgets = [];

		// metodo de leitura do regstro
		this.load = function (id, isStartView) {
			var i,
				js,
				jss;

			dashboardResource.TOTVSGet({dashboardId: controllerSettings.dashboardId}, function (data) {
				controllerSettings.dashboard = data.ttDashboard[0];

				if (isStartView === true) {
					appViewService.startView(controllerSettings.dashboard.dashboardName, 'dts-utils.dashboard.EditController');
				}

				jss = [];

				// monta um array com os JS´s do widgets
				for (i = 0; i < data.ttWidgets.length; i++) {
					js = data.ttWidgets[i].widgetSource;
					js = js.substring(0, js.lastIndexOf('.')) + '.js';
					jss.push(js);
				}

				// carrega os JS de cada widget
				if(jss.length) {
					require(jss, function () {
						$rootScope.$apply(function () {
							controllerSettings.widgets = data.ttWidgets;
						});
					});
				}
				
			}, {
				noCountRequest: true
			});
		};

		// metodo para salvar o registro
		this.save = function () {
			// verificar se o formulario tem dados invalidos
			if (this.isInvalidForm()) {
				return;
			}

			if (controllerSettings.removedwidgets && angular.isArray(controllerSettings.removedwidgets)) {
				if(controllerSettings.widgets) {
					controllerSettings.widgets = controllerSettings.widgets.concat(controllerSettings.removedwidgets);
				}
			}

			var obj = {
				ttDashboard: [controllerSettings.dashboard],
				ttWidgets:  controllerSettings.widgets
			};

			dashboardResource.TOTVSUpdate({dashboardId: controllerSettings.dashboardId}, obj, function (result) {
				controllerSettings.onSaveUpdate(true, result);
			});
		};

		// metodo para notificar o usuario da gravaçao do registro com sucesso
		this.onSaveUpdate = function (isUpdate, result) {
			var i;

			for (i = 0; i < controllerSettings.removedwidgets.length; i++) {
				$rootScope.$broadcast("$killyourself", controllerSettings.removedwidgets);
			}

			// redireciona a tela para a tela de detalhar
			controllerSettings.redirectToDetail();

			// notifica o usuario que conseguiu salvar o registro
			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'success',
				title: $rootScope.i18n('l-dashboard'),
				detail: $rootScope.i18n('l-dashboard') + " " + $rootScope.i18n('l-success-updated') + '!'
			});
		};

		// metodo para a ação de cancelar
		this.cancel = function () {
			// solicita que o usuario confirme o cancelamento da edição/inclusão
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-question',
				text: $rootScope.i18n('l-cancel-operation'),
				cancelLabel: 'l-no',
				confirmLabel: 'l-yes',
				callback: function (isPositiveResult) {
					if (isPositiveResult) { // se confirmou, navega para a pagina anterior
						//$window.history.back();
						$state.go('dts/dts-utils/dashboard.open', {dashboardId: controllerSettings.dashboardId});
					}
				}
			});
		};

		// metodo para verificar se o formulario é invalido
		this.isInvalidForm = function () {

			var messages = [],
				warning = "",
				isInvalidForm = false;

			if (!this.dashboard.dashboardName || this.dashboard.dashboardName.length === 0) {
				isInvalidForm = true;
				messages.push('l-name');
			}

			if (!this.dashboard.dashboardHeader || this.dashboard.dashboardHeader.length === 0) {
				isInvalidForm = true;
				messages.push('l-header');
			}

			// se for invalido, monta e mostra a mensagem
			if (isInvalidForm) {
				
				if (!messages.length) {
					warning = $rootScope.i18n('l-field');
				}

				warning = warning + ' ' + $rootScope.i18n(messages[0]) + ' ' + $rootScope.i18n('l-is-required-field') + '.';

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-attention'),
					detail: warning
				});
			}

			return isInvalidForm;
		};

		// redireciona para a tela de detalhar
		this.redirectToDetail = function () {
			$state.go('dts/dts-utils/dashboard.open', {dashboardId: controllerSettings.dashboardId});
		};

		controllerSettings.remove = function (index) {
			var i,
				positionRemove = index + 1;

			//atualiza posição dos widgets após a posição do que sera removido
			for (i = 0; i < controllerSettings.widgets.length; i++) {
				if (controllerSettings.widgets[i].widgetPosition > positionRemove) {
					controllerSettings.widgets[i].widgetPosition = controllerSettings.widgets[i].widgetPosition - 1;
				}
			}

			controllerSettings.widgets[index].widgetRemoved = true;
			controllerSettings.removedwidgets.push(controllerSettings.widgets[index]);
			controllerSettings.widgets.splice(index, 1);
			controllerSettings.removeDradIZIndex();

		};

		controllerSettings.up = function (index) {
			var o = controllerSettings.widgets[index - 1],
				upPosition = o.widgetPosition,
				downPosition;

			controllerSettings.widgets[index - 1] = controllerSettings.widgets[index];

			downPosition = controllerSettings.widgets[index - 1].widgetPosition;
			controllerSettings.widgets[index - 1].widgetPosition = upPosition;

			o.widgetPosition = downPosition;
			controllerSettings.widgets[index] = o;

			controllerSettings.removeDradIZIndex();
		};

		controllerSettings.down = function (index) {
			var o = controllerSettings.widgets[index + 1],
				upPosition,
				downPosition = o.widgetPosition;

			controllerSettings.widgets[index + 1] = controllerSettings.widgets[index];

			upPosition = controllerSettings.widgets[index + 1].widgetPosition;
			controllerSettings.widgets[index + 1].widgetPosition = downPosition;

			o.widgetPosition = upPosition;
			controllerSettings.widgets[index] = o;

			controllerSettings.removeDradIZIndex();
		};

		controllerSettings.changesize = function (index) {
			var o = controllerSettings.widgets[index];

			if (o.widgetSize === 'half') {
				o.widgetSize = 'full';
			} else {
				o.widgetSize = 'half';
			}

			controllerSettings.removeDradIZIndex();
		};

		controllerSettings.restore = function () {
			dashboardResource.TOTVSRemove({dashboardId: controllerSettings.dashboardId}, function (result) {
				controllerSettings.onSaveUpdate(true, result);
			});
		};

		//modalAddWidget
		controllerSettings.addwidgets = function () {
			addWidgetsModal.open().then(function (result) {
				if (!result) {
					return;
				}

				// se houver parametros na URL
				if (controllerSettings.dashboardId) {
					// refaz a busca de dados
					controllerSettings.load(controllerSettings.dashboardId, false);
				}
			});
		};

		controllerSettings.onDropPortletComplete = function (index, obj, evt) {
			var otherObj = controllerSettings.widgets[index],
				otherIndex = controllerSettings.widgets.indexOf(obj);

			obj.widgetPosition = index + 1;
			controllerSettings.widgets[index] = obj;

			otherObj.widgetPosition = otherIndex + 1;
			controllerSettings.widgets[otherIndex] = otherObj;

			controllerSettings.ondragstyle = false;
			controllerSettings.removeDradIZIndex();
		};

		controllerSettings.onDragPortletComplete = function (index, obj, evt) {
			controllerSettings.removeDradIZIndex();
		};

		// init
		controllerSettings.init = function () {
			// se houver parametros na URL
			if (controllerSettings.dashboardId) {
				// realiza a busca de dados inicial
				this.load(controllerSettings.dashboardId, true);
			}
		};

		controllerSettings.init();

		// listeners

		$rootScope.$on('draggable:move', function (data, obj) {
			var thisElement = obj.element;
			$(thisElement).addClass('dashboard-drag-zindex');
			controllerSettings.ondragstyle = true;
		});

		$rootScope.$on('draggable:end', function (data, obj) {
			controllerSettings.removeDradIZIndex();
		});

		controllerSettings.removeDradIZIndex = function () {
			$('.dashboard-drag-zindex').each(function (index, value) {
				$(this).removeClass('dashboard-drag-zindex');
			});
		};
	};

	dashboardEditController.$inject = ['totvs.app-main-view.Service', '$stateParams', '$totvsresource', '$rootScope',
									   '$state', '$window', 'ngDraggable', 'TOTVSEvent',
									   'dts-utils.dashboard.widget.modal.add', '$http'];

	addDashboardCtrl = function (appViewService, $stateParams, $totvsresource, $rootScope, $state, $modalInstance,
								 $scope, TOTVSEvent) {

		var controllerAdd = this,
			dashboardResource = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchutils/fchutils0001/widgets/:dashboardId/:quickSearchText', {dashboardId: '@dashboardId', quickSearchText: '@quickSearchText'}, {});

		controllerAdd.dashboardId = $stateParams.dashboardId;
		controllerAdd.listOfAdd = undefined;

		controllerAdd.loadData = function (start) {

			if (controllerAdd.quickSearchText === undefined || controllerAdd.quickSearchText === "") {
				controllerAdd.quickSearchText = " ";
			}

			dashboardResource.TOTVSGet({dashboardId: controllerAdd.dashboardId, quickSearchText: controllerAdd.quickSearchText}, function (data) {
				controllerAdd.dashboard = data.ttDashboard[0];
				controllerAdd.widgets = data.ttWidgets;

				if (start) {
					appViewService.startView(controllerAdd.dashboard.dashboardName, 'dts-utils.dashboard.AddController');
				}

			});
		};

		controllerAdd.loadData(true);

		this.back = function () {
			//$modalInstance.dismiss('cancel');
			$modalInstance.close(controllerAdd.listOfAdd);
		};

		controllerAdd.add = function (widget) {
			widget.widgetRemoved = false;

			var obj = {
				ttDashboard: [controllerAdd.dashboard],
				ttWidgets: [widget]
			};

			dashboardResource.TOTVSUpdate({dashboardId: controllerAdd.dashboardId}, obj, function (result) {
				if (result) {
					controllerAdd.afterSave(widget);
				}
			});
		};

		controllerAdd.afterSave = function (widget) {
			controllerAdd.loadData(false);

			if (!controllerAdd.listOfAdd) {
				controllerAdd.listOfAdd = [];
			}

			controllerAdd.listOfAdd.push(widget);

			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'success',
				title: $rootScope.i18n('l-dashboard'),
				detail: $rootScope.i18n('msg-save-related-generic',
						[$rootScope.i18n('l-widget').toLowerCase(), widget.widgetName])
			});
		};

		$scope.$on('$destroy', function () {
			controllerAdd = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});

	}; //function addDashboardCtrl(appViewService)

	addDashboardCtrl.$inject = ['totvs.app-main-view.Service', '$stateParams', '$totvsresource', '$rootScope', '$state',
								'$modalInstance', '$scope', 'TOTVSEvent'];

	// *************************************************************************************
	// *** MODAL ADD
	// *************************************************************************************

	modalAddWidget = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/dts-utils/html/dashboard/dashboard.add.html',
				controller: 'dts-utils.dashboard.AddController as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};

	modalAddWidget.$inject = ['$modal'];

	index.register.service('dts-utils.dashboard.widget.modal.add', modalAddWidget);

	index.register.controller('dts-utils.dashboard.Controller', dashboardCtrl);
	index.register.controller('dts-utils.dashboard.EditController', dashboardEditController);
	index.register.controller('dts-utils.dashboard.AddController', addDashboardCtrl);

});
