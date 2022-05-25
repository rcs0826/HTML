define(['index'], function(index) {

    /**
     * timeListController
     */
	timeListController.$inject = [	                              
        '$rootScope', 
		'$scope', 
        'totvs.app-main-view.Service',
        'mmi.bomn00306.Service',
        '$modal',
		'TOTVSEvent'
    ];

    function timeListController($rootScope,
                                $scope,
                                appViewService,
                                bomn00306Service,
                                $modal,
                                TOTVSEvent) {

        var timeListCtrl = this;
        timeListCtrl.model = {};

        // *************************************************************************************
		// *** Functions
		// *************************************************************************************
		
        timeListCtrl.init = function() {

            timeListCtrl.listResult = [];

			appViewService.startView($rootScope.i18n('l-hour-type'), 'mmi.time.ListCtrl', timeListCtrl);
			var previousView = appViewService.previousView;
			
			if (previousView.timeListCtrl === "mmi.time.DetailCtrl" && !timeListCtrl.isNew){
				return;
			} else {
				timeListCtrl.loadData();
			 } 
        }

        timeListCtrl.loadData = function(isMore) {
			var parameters = {};
			var startAt;
			var where = "";
			
			if (!isMore) {
	            timeListCtrl.listResult = [];
		        timeListCtrl.totalRecords = 0;
			}

			parameters.order = "cod-tip-hora";
						
			startAt = timeListCtrl.listResult.length;
			
			if (timeListCtrl.quickSearchText) {
				where = "cod-tip-hora matches '*" + timeListCtrl.quickSearchText + "*'";
				where = where + " OR ";
	            where = where + "des-tip-hora matches '*" + timeListCtrl.quickSearchText + "*'";
				parameters.where = where;
            }            
			bomn00306Service.findRecords(startAt, undefined, parameters, loadDataCallback);	  			      
        }
        
        var loadDataCallback = function(result) {
			if (result) {
                angular.forEach(result, function (value) {
                    if (value && value.$length) {
						timeListCtrl.totalRecords = value.$length;						
					}					
                    timeListCtrl.listResult.push(value);
				});   
            }
		}

		timeListCtrl.delete = function(record) {
	        $rootScope.$broadcast(TOTVSEvent.showQuestion, {
	            title: 'l-question', 
	            text: $rootScope.i18n('l-confirm-delete-record', record['cod-tip-hora']),
	            cancelLabel: 'l-no', 
	            confirmLabel: 'l-yes', 	            
	            callback: function(isPositiveResult) { 
	                if (isPositiveResult) { 
	                     
	                    bomn00306Service.deleteRecord(record['cod-tip-hora'], function(result) {
	                    	
	                    	if (!result.$hasError) {
	                    		
	                            var index = timeListCtrl.listResult.indexOf(record);
	                            
	                            if (index != -1) {
	                                 
	                                timeListCtrl.listResult.splice(index, 1);	                                 
	                                timeListCtrl.totalRecords--;
	                                 
	                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
	                                	type: 'success', 
		                                title: $rootScope.i18n('msg-record-deleted'), 
		                                detail: $rootScope.i18n('msg-record-success-deleted') 
	                                });
	                            }
	                        }
	                    });
	                }
	            }
	        });
	    }

        if ($rootScope.currentuserLoaded) { this.init(); }

        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            controller.init();
        });
    }

    index.register.controller('mmi.time.ListCtrl', timeListController);

});
