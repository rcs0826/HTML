define([
    'index',
    '/dts/rfimodules/html/fnd/passwordReminder/passwordReminderController.js',
    'css!/dts/rfimodules/html/fnd/passwordReminder/passwordReminder.css'
], function (index) {
    'use strict';

    index.stateProvider
        .state('/dts/rfimodules/fnd/passwordReminder', {
            "abstract": true,
            "template": '<ui-view />'
        })
        .state('/dts/rfimodules/fnd/passwordReminder.start', {
            url: '/dts/rfimodules/fnd/passwordReminder?guid',
            controller: 'TemporaryPasswordCtrl',
            controllerAs: 'controller',
            templateUrl: '/dts/rfimodules/html/fnd/passwordReminder/passwordReminder.view.html'
        });
});
