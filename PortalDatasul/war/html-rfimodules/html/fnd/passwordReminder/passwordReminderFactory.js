define(['index'], 
		function (index) {
		'use strict';
			tempPwdFactory.$inject = ['$totvsresource'];
			function tempPwdFactory($totvsresource)
			{
				var factory = $totvsresource.REST('/dts/datasul-rest/resources/prg/fwk/v1/temporaryPassword/:method/:sessionId');
				factory.generateTemporaryPassword = function (sessionGuid, callback) {
					return this.TOTVSPost({method: 'generateTemporaryPassword'}, {sessionId: sessionGuid}, callback);
				};
				return factory;
			};
			index.register.factory('TemporaryPasswordFactory', tempPwdFactory);
});