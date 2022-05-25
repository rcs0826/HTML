/*globals index, define, TOTVSEvent, CRMControl, CRMUtil */
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1068.js',
	'/dts/crm/html/script/page/page-services.edit.js',
	'ng-load!/dts/crm/js/libs/3rdparty/ng-draggable/ng-draggable.js'
], function (index) {

	'use strict';

	var service;

	// *************************************************************************************
	// *** SCRIPT > PAGE TAB SERVICE|CONTROLLER
	// *************************************************************************************

	service = function ($rootScope, TOTVSEvent, factory, modalPageEdit) {

		this.addEditPage = function (page) {

			var i, sequence = 1, CRMControl = this;

			if (CRMControl.model.ttQuestionarioPagina) {
				sequence = CRMControl.model.ttQuestionarioPagina.length + 1;
			}

			modalPageEdit.open({
				script: CRMControl.model.num_id,
				page: page,
				sequence: sequence
			}).then(function (results) {

				results = results || [];

				var j, result;

				for (j = 0; j < results.length; j++) {

					result = results[j];

					if (CRMUtil.isUndefined(result)) { continue; }

					if (page) {
						for (i = 0; i < CRMControl.model.ttQuestionarioPagina.length; i++) {
							if (CRMControl.model.ttQuestionarioPagina[i].num_id === result.num_id) {
								CRMControl.model.ttQuestionarioPagina[i] = result;
								break;
							}
						}
					} else {
						CRMControl.model.ttQuestionarioPagina = CRMControl.model.ttQuestionarioPagina || [];
						CRMControl.model.ttQuestionarioPagina.push(result);
					}
				}
				if (CRMUtil.isDefined(result)) {
					CRMControl.selectPage(result);
				}
			});
		};

		this.removePage = function (page) {

			var	i,
				j,
				msg,
				detour = [],
				detourAux = [],
				CRMControl = this,
				afterRemoveDetour;

			if (CRMControl.model.ttDesvio && CRMControl.model.ttDesvio.length > 0) {

				for (i = 0; i < CRMControl.model.ttDesvio.length; i++) {

					if (page.num_id === CRMControl.model.ttDesvio[i].num_id_pag_from
							|| page.num_id === CRMControl.model.ttDesvio[i].num_id_pag_to) {
						detour.push(CRMControl.model.ttDesvio[i]);
					} else {
						detourAux.push(CRMControl.model.ttDesvio[i]);
					}
				}
			}

			msg = "msg-script-page-confirm-delete";

			if (detour && detour.length > 0) {
				msg = "msg-script-page-confirm-delete-with-detour";
			}

			afterRemoveDetour = function (obj) {
				factory.removeDetour(obj.num_id_atrib_from, function (result) {});
			};

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n(msg, [page.nom_pag], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.removePage(page.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-script', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						var i;

						for (i = 0; i < CRMControl.model.ttQuestionarioPagina.length; i++) {
							if (CRMControl.model.ttQuestionarioPagina[i].num_id === page.num_id) {
								CRMControl.model.ttQuestionarioPagina.splice(i, 1);
								CRMControl.selectPage(CRMControl.model.ttQuestionarioPagina[0]);
								break;
							}
						}

						CRMControl.model.ttDesvio = detourAux;

						if (detour && detour.length > 0) {
							for (i = 0; i < detour.length; i++) {
								afterRemoveDetour(detour[i]);
							}
						}
					});
				}
			});
		};

		this.selectPage = function (page) {

			var CRMControl = this;

			if (page) {

				if (CRMUtil.isUndefined(CRMControl.selectedPage)) {
					CRMControl.selectedPage = page;
				}

				CRMControl.selectedPage.$selected = false;
				CRMControl.selectedPage = page;
				CRMControl.selectedPage.$selected = true;
			} else {
				CRMControl.selectedPage = undefined;
			}
		};

		this.onPageDropComplete = function ($to, $data, $event) {

			var i,
				$from,
				page,
				newOrder = [],
				CRMControl = this,
				detour = [],
				detourAux = [],
				reorderLogic,
				afterRemoveDetour,
				newPage,
				message;

			newPage = CRMControl.model.ttQuestionarioPagina[$to];

			if (CRMUtil.isDefined($data.nom_quest)) {

				if (CRMUtil.isDefined(newPage) && (newPage.num_id === $data.num_id_pag)) {
					return;
				}
				message = 'l-question-has-no-detour';

				if (CRMUtil.isDefined($data.ttQuestionarioQuestaoAtributo)) {
					for (i = 0; i < $data.ttQuestionarioQuestaoAtributo.length; i++) {
						if ($data.ttQuestionarioQuestaoAtributo[i].num_pag_desvio > 0) {
							message = 'l-question-has-detour';

							break;
						}
					}
				}

				$rootScope.$broadcast(TOTVSEvent.showQuestion, {
					title: 'l-confirm-to-update',
					cancelLabel: 'btn-cancel',
					confirmLabel: 'btn-confirm',
					text: $rootScope.i18n(message, $data.nom_quest, 'dts/crm'),
					callback: function (isPositiveResult) {
						if (!isPositiveResult) { return; }


						factory.changeQuestionPage(newPage.num_id, $data.num_id, function () {
							CRMControl.load(CRMControl.model.num_id);
						});
					}
				});

				return;
			}

			if (CRMControl.model.ttDesvio && CRMControl.model.ttDesvio.length > 0) {

				for (i = 0; i < CRMControl.model.ttDesvio.length; i++) {

					if ($data.num_id === CRMControl.model.ttDesvio[i].num_id_pag_from
							|| $data.num_id === CRMControl.model.ttDesvio[i].num_id_pag_to) {
						detour.push(CRMControl.model.ttDesvio[i]);
					} else {
						detourAux.push(CRMControl.model.ttDesvio[i]);
					}
				}
			}

			reorderLogic = function () {
				for (i = 0; i < CRMControl.model.ttQuestionarioPagina.length; i++) {

					page = CRMControl.model.ttQuestionarioPagina[i];

					if ($data.num_id === page.num_id) {
						$from = i;
						break;
					}
				}

				CRMControl.model.ttQuestionarioPagina.move($from, $to);

				for (i = 0; i < CRMControl.model.ttQuestionarioPagina.length; i++) {
					page = CRMControl.model.ttQuestionarioPagina[i];
					page.num_pag = i + 1;
					newOrder.push(page.num_id);
				}

				factory.reorderPages(CRMControl.model.num_id, newOrder);
			};

			afterRemoveDetour = function (obj) {
				factory.removeDetour(obj.num_id_atrib_from, function (result) {});
			};

			if (detour && detour.length > 0) {
				$rootScope.$broadcast(TOTVSEvent.showQuestion, {
					title: 'l-confirm-delete',
					cancelLabel: 'btn-cancel',
					confirmLabel: 'btn-confirm',
					text: $rootScope.i18n('msg-page-with-detour-will-be-removed', [
						$data.nom_pag
					], 'dts/crm'),
					callback: function (isPositiveResult) {
						if (!isPositiveResult) { return; }

						CRMControl.model.ttDesvio = detourAux;

						if (detour && detour.length > 0) {
							for (i = 0; i < detour.length; i++) {
								afterRemoveDetour(detour[i]);
							}
						}

						reorderLogic();
					}

				});
			} else {
				reorderLogic();
			}
		};

	};

	service.$inject = [
		'$rootScope', 'TOTVSEvent', 'crm.crm_script.factory', 'crm.script-page.modal.edit'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.service('crm.script-page.tab.service', service);

});
