define([
    'index',
    '/dts/mpd/js/portal-factories.js',
    '/dts/mpd/js/mpd-factories.js',
    '/dts/mpd/js/api/fchdis0035api.js'
], function(index) {

    index.stateProvider

    .state('dts/mpd/schedule', {
        abstract: true,
        template: '<ui-view/>'
    })
    .state('dts/mpd/schedule.start', {
        url: '/dts/mpd/schedule',
        controller: 'salesorder.schedule.Controller',
        controllerAs: 'controller',
        templateUrl: '/dts/mpd/html/schedule/schedule.html'
    });

    schedulecontroller.$inject = [
        'totvs.app-main-view.Service',
        'salesorder.schedule.Factory',
        'portal.generic.Controller',
        '$modal',
        '$filter',
        'salesorder.zoomEmitente.Service',
        'portal.getUserData.factory',
        '$rootScope',
        'mpd.companyChange.Factory',
        'TOTVSEvent',
        'mpd.fchdis0035.factory'
    ];

    function schedulecontroller(
        appViewService,
        scheduleResource,
        genericController,
        $modal,
        $filter,
        zoomEmitente,
        userdata,
        $rootScope,
        companyChange,
        TOTVSEvent,
        fchdis0035
    ) {   
        var date = $filter('date');
        var i18n = $filter('i18n');
        var paramVisibleFieldsButtonNewOrder = {cTable: "carteira-cliente-repres-detalhe"};

        this.newOrderInclusionFlow = false;

        // Validacao utilizada somente para o botao de "Novo pedido" (simular a do customer.js).
        fchdis0035.getVisibleFields(paramVisibleFieldsButtonNewOrder, function(result) {
            angular.forEach(result, function(value) {
                if (value.fieldName === "novo-fluxo-inclusao-pedido") {
                    controller.newOrderInclusionFlow = value.fieldEnabled; 
                }

                if (value.fieldName === "btn-new-order") {
                    controller.btnOpenOrder = value.fieldEnabled;
                }
            });
        });
        
        if (appViewService.startView(i18n("l-schedule"))){
			// Busca todas as empresas vinculadas ao usuario logado | M�todo getDataCompany presente na fchdis0035api.js |	
			if (companyChange.checkContextData() === false){
				companyChange.getDataCompany(true);
			}
		
			// busca os dados novamente quando feita a troca de empresa
			$rootScope.$$listeners['mpd.selectCompany.event'] = [];
			$rootScope.$on("mpd.selectCompany.event", function (event, currentcompany) {
				controller.loadData();	
			});
		
		}else {
			// busca os dados novamente quando feita a troca de empresa
			$rootScope.$$listeners['mpd.selectCompany.event'] = [];
			$rootScope.$on("mpd.selectCompany.event", function (event, currentcompany) {
				controller.loadData();	
			});
		
		}
		
        var controller = this;

		genericController.decorate(controller, scheduleResource);
		
        controller.advancedSearch = {model: {}};

        this.addFilters = function() {
            controller.clearFilter();
            if (controller.quickSearchText) {
                controller.addFilter("shortName", controller.quickSearchText, 'Busca', controller.quickSearchText);
            }
            if (controller.advancedSearch.model.dateFirst) {
                controller.addFilter("dateFirst", controller.advancedSearch.model.dateFirst, 'Data Inicial', i18n('l-from') + ': ' + date(controller.advancedSearch.model.dateFirst, 'shortDate'), controller);
            }
            if (controller.advancedSearch.model.dateLast) {
                controller.addFilter("dateLast", controller.advancedSearch.model.dateLast, 'Data final', i18n('l-to') + ': ' + date(controller.advancedSearch.model.dateLast, 'shortDate'), controller);
            }
        };

        this.search = function() {
            this.clearDefaultData(true, this);
            this.addFilters();
            this.loadData();
        };

        this.loadData = function() {
            controller.findRecords(null, controller.filterBy);
        };

        this.loadMore = function() {
            controller.findRecords(controller.listResult.length, controller.filterBy);
        };

        this.setQuickFilter = function(string) {
            if (string === "SCHEDULECOMPLETE") {
                controller.clearDefaultData(true, controller);
                this.addFilters();
                controller.addFilter("performedVisits", "yes", 'Visitas realizadas', i18n("l-visit-done"));
                this.loadData();
            } else if (string === "SCHEDULEINCOMPLETE") {
                controller.clearDefaultData(true, controller);
                this.addFilters();
                controller.addFilter("performedVisits", "no", 'Visitas realizadas', i18n("l-visit-open"));
                this.loadData();
            }
        };

        this.removeSelectedFilter = function(filter) {
        	controller.removeFilter(filter);
			if (filter.property == "shortName") {
				controller.quickSearchText = '';
			}
			delete controller.advancedSearch.model[filter.property];
            controller.loadData();
        }

        this.openAddScheduleModal = function() {
			var modalInstance = $modal.open({
			  templateUrl: '/dts/mpd/html/schedule/schedule-add.html',
			  controller: 'salesorder.modalScheduleAdd.Controller as controller',
			  size: 'lg'
			});

			modalInstance.result.then(function (selectedItem) {
				controller.search();
			});
        };

        this.cancelSchedule = function(schedule) {
			
			var modalInstance = $modal.open({
			  templateUrl: '/dts/mpd/html/schedule/schedule-cancel.html',
			  controller: 'salesorder.modalScheduleCancel.Controller as controller',
			  size: 'lg',
			  resolve: {
				modalParams: function () {
				  return schedule;
				}
			  }
			});

			modalInstance.result.then(function (selectedItem) {
				controller.search();
			});
			
        };

        this.reschedule = function(schedule) {
			var modalInstance = $modal.open({
			  templateUrl: '/dts/mpd/html/schedule/schedule-modify.html',
			  controller: 'salesorder.modalScheduleModify.Controller as controller',
			  size: 'lg',
			  resolve: {
				modalParams: function () {
				  return schedule;
				}
			  }
			});

			modalInstance.result.then(function (selectedItem) {
				controller.search();
			});

        };

        this.completeSchedule = function(schedule) {
            
            if(schedule['dat-visita']){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'alert',
                    title: i18n('l-complete-schedule'),
                    detail: i18n('l-complete-schedule-msg') 
                });
            }else{    
            
			var modalInstance = $modal.open({
			  templateUrl: '/dts/mpd/html/schedule/schedule-complete.html',
			  controller: 'salesorder.modalScheduleComplete.Controller as controller',
			  size: 'lg',
			  resolve: {
				modalParams: function () {
				  return schedule;
				}
			  }
			});

			modalInstance.result.then(function (selectedItem) {
				controller.search();
			});
            }            

        };
		
		controller.openAdvancedSearch = function() {
			var modalInstance = $modal.open({
			  templateUrl: '/dts/mpd/html/schedule/schedule-adv-search.html',
			  controller: 'salesorder.schedule.adv-search.Controller as controller',
			  size: 'lg',
			  resolve: {
				model: function () {
				  return controller.advancedSearch;
				}
			  }
			});

			modalInstance.result.then(function (selectedItem) {
				controller.search();
			});
		}
		

        this.loadData();

    } // function schedulecontroller(loadedModules) 

    modalScheduleAddcontroller.$inject = ['$modalInstance', 'salesorder.schedule.Factory', '$filter', '$rootScope', 'TOTVSEvent'];
    function modalScheduleAddcontroller($modalInstance, scheduleResource, $filter, $rootScope, TOTVSEvent) {

        var controller = this;
		var i18n = $filter('i18n');

        this.close = function() {
            $modalInstance.dismiss();
        };

        this.saveItem = function() {
            if (controller.item.hora) {
                if (controller.item.hora.indexOf(':') === 1)
		            controller.item.hora = "0" + controller.item.hora;

                controller.item.hora = controller.item.hora.replace(":", "");
				
            }
			
			if (controller.item['cdn-emitente'] &&
				controller.item['dat-agenda'] &&
				controller.item['hora'] &&
				controller.item['des-obs']) {
			
				scheduleResource.add(controller.item, function() {
					$modalInstance.close();
				});
			} else {
				if (!controller.item['cdn-emitente']) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'alert',
						title: i18n('l-attention') + ".",
						detail: i18n('l-customer') + " " + i18n('l-required')
					});
				}
				if (!controller.item['dat-agenda']) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'alert',
						title: i18n('l-attention') + ".",
						detail: i18n('l-date') + " " + i18n('l-required')
					});
				}
				if (!controller.item['hora']) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'alert',
						title: i18n('l-attention') + ".",
						detail: i18n('l-time') + " " + i18n('l-required')
					});
				}
				if (!controller.item['des-obs']) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'alert',
						title: i18n('l-attention') + ".",
						detail: i18n('l-observacoes') + " " + i18n('l-required')
					});
				}				
			}
        };
    }
    ;

    modalScheduleModifycontroller.$inject = ['$modalInstance', 'salesorder.schedule.Factory', 'modalParams', 'TOTVSEvent'];
    function modalScheduleModifycontroller($modalInstance, scheduleResource, modalParams, TOTVSEvent) {
        this.item = modalParams;
        if (this.item.hasOwnProperty('$length')) {
            delete this.item.$length;
        }
        var datAgendaBkp = new Date(modalParams['dat-agenda']).getTime();

        this.confirm = function() {
            if (this.item.hora) {
                if (this.item.hora.indexOf(':') === 1)
			        this.item.hora = "0" + this.item.hora;
                this.item.hora = this.item.hora.replace(":", "");
            }
            scheduleResource.updateSchedule({cdnEmitente: modalParams['cdn-emitente'], datAgenda: datAgendaBkp}, this.item, function() {
                $modalInstance.close();
            });
        };

        this.close = function() {
            $modalInstance.dismiss();
        };
    }

    modalScheduleCancelcontroller.$inject = ['$modalInstance', 'salesorder.schedule.Factory', 'modalParams'];
    function modalScheduleCancelcontroller($modalInstance, scheduleResource, modalParams) {
        this.item = modalParams;
        if (this.item.hasOwnProperty('$length')) {
            delete this.item.$length;
        }
        ;
        this.confirm = function() {
            scheduleResource.deleteSchedule({cdnEmitente: modalParams['cdn-emitente'], datAgenda: modalParams['dat-agenda']}, function() {
                $modalInstance.close();
            });
        };

        this.close = function() {
            $modalInstance.dismiss();
        };
    }

    modalScheduleCompletecontroller.$inject = ['$modalInstance', 'salesorder.schedule.Factory', 'modalParams'];
    function modalScheduleCompletecontroller($modalInstance, scheduleResource, modalParams) {
        this.item = modalParams;
        if (this.item.hasOwnProperty('$length')) {
            delete this.item.$length;
        }

        this.confirm = function() {
            if (this.item.hora) {
                if (this.item.hora.indexOf(':') === 1)
			        this.item.hora = "0" + this.item.hora;
                this.item.hora = this.item.hora.replace(":", "");
            }
            scheduleResource.updateSchedule({cdnEmitente: modalParams['cdn-emitente'], datAgenda: modalParams['dat-agenda']}, this.item, function() {
                $modalInstance.close();
            });
        };

        this.close = function() {
            $modalInstance.dismiss();
        };
    }
	
	scheduleAdvSearchController.$inject = ['$modalInstance', 'model'];
	function scheduleAdvSearchController ($modalInstance, model) {
		
		this.advancedSearch = model;
		
		this.search = function () {
			$modalInstance.close();
		}
		
		this.close = function () {
			$modalInstance.dismiss();
		}
	}
	


    index.register.controller('salesorder.schedule.Controller', schedulecontroller);
	index.register.controller('salesorder.schedule.adv-search.Controller', scheduleAdvSearchController);	

    index.register.controller('salesorder.modalScheduleAdd.Controller', modalScheduleAddcontroller);
    index.register.controller('salesorder.modalScheduleModify.Controller', modalScheduleModifycontroller);
    index.register.controller('salesorder.modalScheduleCancel.Controller', modalScheduleCancelcontroller);
    index.register.controller('salesorder.modalScheduleComplete.Controller', modalScheduleCompletecontroller);

});