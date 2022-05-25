/*globals index, define, angular, TOTVSEvent, CRMControl, CRMUtil */
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1068.js',
	'/dts/crm/html/script/page/question/question-services.edit.js',
	'ng-load!/dts/crm/js/libs/3rdparty/ng-draggable/ng-draggable.js'
], function (index) {

	'use strict';

	var service;

	// *************************************************************************************
	// *** SCRIPT > PAGE TAB SERVICE|CONTROLLER
	// *************************************************************************************

	service = function ($rootScope, TOTVSEvent, factory, modalQuestionEdit, scriptHelper) {

		this.addEditQuestion = function (control, question) {

			var i, sequence = 1;

			var selectedPage = control.selectedPage;
			var ttDesvio = undefined;

			if (control && control.model && control.model.ttDesvio) {
				ttDesvio = control.model.ttDesvio;
			}

			if (selectedPage.ttQuestionarioQuestao) {
				sequence = selectedPage.ttQuestionarioQuestao.length + 1;
			}

			modalQuestionEdit.open({
				page: selectedPage.num_id,
				question: question,
				sequence: sequence,
				detour: ttDesvio
			}).then(function (results) {

				results = results || [];

				var j, result, ttDesvioAux = [];

				for (j = 0; j < results.length; j++) {

					result = results[j];

					if (CRMUtil.isUndefined(result)) { continue; }

					if (question) {
						for (i = 0; i < selectedPage.ttQuestionarioQuestao.length; i++) {
							if (selectedPage.ttQuestionarioQuestao[i].num_id === result.num_id) {
								selectedPage.ttQuestionarioQuestao[i] = result;
								break;
							}
						}

						if (ttDesvio && ttDesvio.length > 0 && result.ttRemoveAttr && result.ttRemoveAttr.length > 0) {
							for (i = 0; i < ttDesvio.length; i++) {
								for(var y = 0; y < result.ttRemoveAttr.length; y++){
									if(ttDesvio[i] && result.ttRemoveAttr[y].num_id == ttDesvio[i].num_id_atrib_from) {
										control.model.ttDesvio.splice(i, 1);
									}
								}
							}
						}

					} else {
						selectedPage.ttQuestionarioQuestao = selectedPage.ttQuestionarioQuestao || [];
						selectedPage.ttQuestionarioQuestao.push(result);
					}
				}
			});
		};

		this.removeQuestion = function (control, question, $index) {

			var i,
				ttDesvio,
				ttDesvioAux = [],
				afterRemoveQuestion,
				selectedPage = (control && control.selectedPage) ? control.selectedPage : undefined,
				msg = 'msg-confirm-delete-question';

			if (control && control.model && control.model.ttDesvio) {
				ttDesvio = control.model.ttDesvio;
			}

			if (ttDesvio && ttDesvio.length > 0) {
				for (i = 0; i < ttDesvio.length; i++) {
					if (question.num_id === ttDesvio[i].num_id_quest_from) {
						msg = 'msg-confirm-delete-question-with-detour';
						break;
					}
				}
			}

			afterRemoveQuestion = function () {
				if (selectedPage && selectedPage.ttQuestionarioQuestao) {
					selectedPage.ttQuestionarioQuestao.splice($index, 1);
				}

				if (ttDesvio && ttDesvio.length > 0) {
					for (i = 0; i < ttDesvio.length; i++) {
						if (question.num_id !== ttDesvio[i].num_id_quest_from) {
							ttDesvioAux.push(ttDesvio[i]);
						}
					}

					control.model.ttDesvio = ttDesvioAux;
				}
			};

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n(msg, [question.nom_quest], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.removeQuestion(question.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-script', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						afterRemoveQuestion();
					});
				}
			});
		};

		this.onQuestionDropComplete = function (selectedPage, $to, $data, $event) {

			var i,
				$from,
				question,
				newOrder = [];

			for (i = 0; i < selectedPage.ttQuestionarioQuestao.length; i++) {

				question = selectedPage.ttQuestionarioQuestao[i];

				if ($data.num_id === question.num_id) {
					$from = i;
					break;
				}
			}

			selectedPage.ttQuestionarioQuestao.move($from, $to);

			for (i = 0; i < selectedPage.ttQuestionarioQuestao.length; i++) {
				question = selectedPage.ttQuestionarioQuestao[i];
				question.num_quest = i + 1;
				newOrder.push(question.num_id);
			}

			factory.reorderQuestions(selectedPage.num_id, newOrder);

		};

		this.convertToRadio = function (question) {

			var i,
				radios = [],
				attrs = question.ttQuestionarioQuestaoAtributo;

			if (!attrs || !angular.isArray(attrs)) { return; }

			for (i = 0; i < attrs.length; i++) {
				radios.push({
					value: attrs[i].num_id,
					label: attrs[i].nom_atrib
				});
			}

			question.options = radios;
		};

		this.isRowFilter = scriptHelper.isRowFilter;

		this.isColunmFilter = scriptHelper.isColunmFilter;
	};

	service.$inject = [
		'$rootScope', 'TOTVSEvent', 'crm.crm_script.factory', 'crm.script-page-question.modal.edit',
		'crm.script.helper'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.service('crm.script-page-question.tab.service', service);

});
