/*global angular */
define(['index', '/dts/mpd/js/userpreference.js', '/dts/mpd/js/portal-factories.js', '/dts/mpd/js/mpd-factories.js'], function(index) {

	messagesCtrl.$inject = ['totvs.app-main-view.Service', 'salesorder.message.Factory', 'userPreference'];

	function messagesCtrl(appViewService, userMessages, userPreference) {

		var view = null;

		if (appViewService.getPageActive) {
			view = appViewService.getPageActive();
		} else {
			view = appViewService.getActiveView();
		}

		if (view === null) return;

		var moduleName = angular.lowercase(view.url.split('/')[3]);

		var vm = this;

		vm.hasMessage = true;

		userMessages.getMessages(moduleName, function (messages){

			var mess = new Array();

			angular.forEach(messages, function (value, key){
				mess.push(value['user-message']);
			});

			vm.userMessagesData = mess;

			if(vm.userMessagesData.length > 0){
				vm.hasMessage = true;
			}else{
				vm.hasMessage = false;
			}

		});

	}//function messagesCtrl(appViewService, userMessages)

	index.register.controller('salesorder.dashboard.messagecustomer.Controller', messagesCtrl);

});
