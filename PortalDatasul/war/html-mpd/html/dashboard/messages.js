define(['index',  '/dts/mpd/js/portal-factories.js'], function (index) {

	messagesCtrl.$inject = ['totvs.app-main-view.Service', 'salesorder.message.Factory'];

	function messagesCtrl(appViewService, userMessages) {
	
		var view = null;
		
		if (appViewService.getPageActive) {
			view = appViewService.getPageActive();
		} else {
			view = appViewService.getActiveView();
		}
		
		if (view === null) return;
		
		var moduleName = angular.lowercase(view.url.split('/')[3]);

		var messageList = this;
		
		userMessages.getMessages(moduleName, function (messages){
			
			var mess = new Array();

			angular.forEach(messages, function (value, key){
				mess.push(value['user-message']);
			});
			
			messageList.userMessagesData = mess;
			
		});
		
	}//function messagesCtrl(appViewService, userMessages)

	index.register.controller('salesorder.dashboard.messages.Controller', messagesCtrl);
});