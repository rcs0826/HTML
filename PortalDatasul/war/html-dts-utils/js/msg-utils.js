/*jslint plusplus: true, devel: false, forin: true, indent: 4, maxerr: 50 */
/*global define, angular, $, TOTVSEvent */
define(['index'], function (index) {
    
    'use strict';

    /*####################################### Serviços #########################################*/
    function messageUtils($modal, notificationConstant) {         
        return {

            question: function(question) {

                question.size = /(lg|md|sm)/.exec(question.size) ? question.size : 'lg';

                modalInstanceControl.$inject = ['$scope', '$modalInstance', '$timeout', 'questionObject'];

                function modalInstanceControl($scope, $modalInstance, $timeout, questionObject) {

                    $scope.questionForm = true;

                    $scope.title = questionObject.title;
                    $scope.text = questionObject.text;

                    $scope.cancel = cancel;
                    $scope.confirm = confirm;

                    // Verifica se foi informado uma label customizada para cancelamento.
                    if (questionObject.cancelLabel) {
                        $scope.cancelLabel = questionObject.cancelLabel;
                    } else {
                        $scope.cancelLabel = 'btn-cancel';
                    }

                    // Verifica se foi informado uma label customizada para confirmação.
                    if (questionObject.confirmLabel) {
                        $scope.confirmLabel = questionObject.confirmLabel;
                    } else {
                        $scope.confirmLabel = 'btn-ok';
                    }

                    function cancel() {
                        $modalInstance.close('cancel');
                    }

                    function confirm() {
                        $modalInstance.close('confirm');
                    }

                    function focusdefault() {
                        if (questionObject.defaultCancel) {
                            angular.element('div.modal-footer button[ng-click="cancel()"]').focus();
                        } else {
                            angular.element('div.modal-footer button[ng-click="confirm()"]').focus();
                        }
                        
                    }

                    $modalInstance.rendered.then(function () {
                        $scope.$watch("pendingRequests", function(newValue) {
                            if (newValue == 0) {
                                $timeout(function () {
                                    focusdefault();
                                },200);
                            }
                        });                        
                    });
                }

                $modal.open({
                    template: notificationConstant.templateMessage,
                    controller: modalInstanceControl,
                    size: question.size,
                    resolve: {
                        questionObject: function () {
                            return question;
                        }
                    }
                }).result.then(function (answerModal) {
                    if (question.callback) {
                        question.callback((answerModal === 'confirm'));
                    }
                });

            }
        };
    }

    messageUtils.$inject = ['$modal','notificationConstant'];
    index.register.service('dts-utils.message.Service', messageUtils);

});

