define(['index'], function(index) {
    
    AddProgramCtrl.$inject = ['$modalInstance', 
                              '$rootScope',
                              '$http',
                              'model', 
                              'TOTVSEvent', 
                              'fchmcs.fchmcs0001.Factory',
                              'i18nFilter'];
    
    function AddProgramCtrl ($modalInstance, $rootScope, $http, model, TOTVSEvent, fchmcs0001Factory, i18n) {
        
        var controller = this;

        controller.valid = false;

        controller.defaultHeaders = {noCount: true,
                                     noCountRequest: false,
                                     noErrorMessage: true};
        
        var procedimento = "html.costscockpit";

        controller.validateProgram = function() {
            if (controller.program && controller.program !== "") {
                controller.valid = false;
                controller.name = "";

                controller.getProgramData();
            };
        };

        controller.getProgramData = function () {
            fchmcs0001Factory.getProgramCode(controller.program, function(result) {
                if (result && result[0]) {
                    controller.program = result[0].nom_prog_ext;
                    controller.name = result[0].nom_prog_dtsul_menu;
                    controller.proced = result[0].cod_proced;
                    controller.type = result[0].idi_interfac;
                    controller.group = 4;

                    controller.valid = true;
                } else {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error',
                        title: i18n('l-program', [], 'dts/mcs') + " " + i18n('l-not-found', [], 'dts/mcs'),
                        detail: i18n('msg-program-doesnt-exist', [], 'dts/mcs')
                    });
                }
            });
        }

        controller.getProgramSequence = function (callback) {
            fchmcs0001Factory.getLastSequence(procedimento, function(result) {
                if (result && !result.$hasError) {
                    controller.seq = result.num_seq + 1;

                    callback();
                }
            }, controller.defaultHeaders);
        };
        
        controller.save = function () {

            controller.getProgramSequence(function callback() {

                model.program = controller.program;
                model.name = controller.name;
                model.group = controller.group;
                model.proced = controller.proced;
                model.seq = controller.seq;
                model.type = controller.type;

                var record = [{'num_seq': controller.seq,
                               'cod_proced': procedimento,
                               'cod_proced_con': controller.proced,
                               'log_reg_padr': true,
                               'log_visualiz_menu': true}];

                fchmcs0001Factory.saveRelatedProgram(record, function(result) {
                    if (result && !result.$hasError) {

                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'success',
                            title: i18n('msg-success-add', [], 'dts/mcs'),
                            detail: ''
                        });

                        $modalInstance.close(model);
                    }
                });
            });
        };
        
        controller.close = function () {
            $modalInstance.dismiss();
        };
    };
    
    index.register.controller('mcs.costscockpit.AddProgramCtrl', AddProgramCtrl);
});