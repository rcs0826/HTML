define(['index',
		'/dts/html-rfimodules/html/fnd/passwordReminder/passwordReminderFactory.js'
		,
        'js/menu/services/LogoutService.js',		
		'js/menu/factories/RFIFactory.js'
		], 
	function (index) {
    'use strict';

    index.register.controller('TemporaryPasswordCtrl', ['$scope','$filter','TemporaryPasswordFactory', '$stateParams', 'rfiFactory', 'ServDoLogout',
							  function($scope,$filter, TemporaryPasswordFactory, $stateParams, rfiFactory, logoutService) 
	{
		var sessionGuid = $stateParams.guid;	
		var ControlUser = this;
		ControlUser.success = false;
		ControlUser.invalid = false;
		ControlUser.email = "N/A";
		rfiFactory.isValidRequest(sessionGuid, function (result) {
			if(result.valid === true)
			{
				TemporaryPasswordFactory.generateTemporaryPassword(sessionGuid, function (passwordData) {				
					if(passwordData)
					{
						ControlUser.email = passwordData.email;
						ControlUser.message = passwordData.message;
						ControlUser.success = true;
						rfiFactory.invalidateRequest(sessionGuid);		
//						logoutService.invalidateOpenSession(true);
					}
				});
			}
			else
			{
				ControlUser.invalid = true;
				ControlUser.message = result.message;						
			}
		});
    }]);

});