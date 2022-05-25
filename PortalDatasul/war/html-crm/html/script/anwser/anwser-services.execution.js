/*globals index, $, window, angular, define, TOTVSEvent, CRMEvent, CRMUtil, APP_BASE_URL*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/js/api/fchcrm1068.js',
	'/dts/crm/js/api/fchcrm1078.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var modalAnwserExecution,
		controllerAnwserExecution;

	// *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************

	modalAnwserExecution = function ($rootScope, $modal) {
		this.open = function (params) {

			var scope = $rootScope.$new();

			scope.isModal = true;
			scope.parameters = params;

			scope.$modalInstance = $modal.open({
				templateUrl: '/dts/crm/html/script/anwser/anwser.execution.html',
				controller: 'crm.script-anwser.execution.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				scope: scope,
				resolve: { parameters: function () { return params; } }
			});

			return scope.$modalInstance.result;
		};
	};

	modalAnwserExecution.$inject = ['$rootScope', '$modal'];

	// *************************************************************************************
	// *** CONTROLLER SELECTION
	// *************************************************************************************

	controllerAnwserExecution = function ($rootScope, $scope, $stateParams, TOTVSEvent, appViewService, scriptFactory, scriptHelper, anwserFactory, $location, $window, $state, accessRestrictionFactory) {

		var CRMControlAnwserExecution = this,
			parameters = $scope.parameters || {},
			$modalInstance = $scope.$modalInstance || undefined;

		this.accessRestrictionAnwserDetail = undefined;

		this.model = undefined;
		this.anwser = undefined;
		this.relational = undefined;
		this.relationalType = undefined;

		this.selectedPage = undefined;
		this.previousPage = undefined;

		this.cleanAnwsers = [];
		this.anwserDetailMode = false;

		this.invalidCharacters = "'|'";


		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.hasPreviousPage = function () {
			var model = CRMControlAnwserExecution.model, idx;

			if (CRMControlAnwserExecution.selectedPage === undefined) { return; }

			idx = model.ttQuestionarioPagina.indexOf(CRMControlAnwserExecution.selectedPage);

			if (idx > 0) {
				return true;
			}
			return false;
		};

		this.hasNextPage = function () {

			var model = CRMControlAnwserExecution.model, idx;

			if (!model.ttQuestionarioPagina || !angular.isArray(model.ttQuestionarioPagina)) { return false; }

			if (CRMControlAnwserExecution.selectedPage === undefined) { return; }

			idx = model.ttQuestionarioPagina.indexOf(CRMControlAnwserExecution.selectedPage);

			if (idx === (model.ttQuestionarioPagina.length - 1)) {
				return false;
			}
			return true;
		};

		this.convertToRadio = function (arr) {
			if (!arr || !angular.isArray(arr)) { return; }

			var i, radioArr = [];
			for (i = 0; i < arr.length; i++) {
				radioArr.push({
					value: arr[i].num_id,
					label: arr[i].nom_atrib
				});
			}
			return radioArr;
		};

		this.getMatrixAttributeCols = function (attributes) {
			if (!attributes || !angular.isArray(attributes)) { return; }

			var result = [], i;

			for (i = 0; i < attributes.length; i++) {
				if (attributes[i].log_atrib === true) {
					result.push(attributes[i]);
				}
			}
			return result;
		};

		this.getMatrixAttributeRows = function (attributes) {
			if (!attributes || !angular.isArray(attributes)) { return; }

			var result = [], i;
			for (i = 0; i < attributes.length; i++) {
				if (attributes[i].log_atrib === false) {
					result.push(attributes[i]);
				}
			}
			return result;
		};

		this.hasInvalidAnwsers = function (page) {
			if (page === undefined) { return; }

			if (page.hasOwnProperty("ttQuestionarioQuestao") === false) {
				return;
			}

			var i, j, k,
				cols,
				rows,
				checkboxValidator,
				anwserCount = 0,
				questionCount = 0,
				question,
				checkbox,
				checkboxArr,
				isInvalid = false;

			checkboxValidator = function (key) {
				if (question.ttRespostaQuestao.dsl_respos[key] === true) {
					checkbox++;
				}
				return {num_id: parseInt(key, 10), value: question.ttRespostaQuestao.dsl_respos[key]};

			};

			if (!page.ttQuestionarioQuestao || !angular.isArray(page.ttQuestionarioQuestao)) { return isInvalid; }

			for (i = 0; i < page.ttQuestionarioQuestao.length; i++) {

				question = page.ttQuestionarioQuestao[i];

				if (question.log_obrig === true) {

					if (CRMUtil.isUndefined(question.ttRespostaQuestao) === true || CRMUtil.isUndefined(question.ttRespostaQuestao.dsl_respos) === true || question.ttRespostaQuestao.dsl_respos === '') {

						isInvalid = true;

					} else if (question.ttTipo.num_id === 1 && question.ttRespostaQuestao.dsl_respos.trim().length === 0) {

						isInvalid = true;

					} else if (question.ttTipo.num_id === 2) {

						if (question.ttRespostaQuestao.dsl_respos.length === 0) {

							isInvalid = true;

						} else {

							for (j = 0; j < question.ttRespostaQuestao.dsl_respos.length; j++) {

								if (question.ttRespostaQuestao.dsl_respos[j].log_livre_1 === true) {

									if (question.ttRespostaQuestao.dsl_respos_outro === undefined
												|| question.ttRespostaQuestao.dsl_respos_outro.trim().length <= 0) {

										isInvalid = true;

									}

								}

							}

						}

					} else if (question.ttTipo.num_id === 3) {

						if (question.ttRespostaQuestao.dsl_respos.log_livre_1 === true) {

							if (question.ttRespostaQuestao.dsl_respos_outro === undefined
										|| question.ttRespostaQuestao.dsl_respos_outro.trim().length <= 0) {

								isInvalid = true;

							}

						}

					} else if (question.ttTipo.num_id === 4) {

						for (j = 0; j < question.ttQuestionarioQuestaoAtributo.length; j++) {

							if (question.ttQuestionarioQuestaoAtributo[j].num_id === question.ttRespostaQuestao.dsl_respos) {

								if (question.ttQuestionarioQuestaoAtributo[j].log_livre_1 === true) {

									if (question.ttRespostaQuestao.dsl_respos_outro === undefined
												|| question.ttRespostaQuestao.dsl_respos_outro.trim().length <= 0) {

										isInvalid = true;

									}

								}

							}
						}

					} else if (question.ttTipo.num_id === 5) {

						checkbox = 0;

						checkboxArr = Object.keys(question.ttRespostaQuestao.dsl_respos).map(checkboxValidator);

						if (checkbox <= 0) {

							isInvalid = true;

						} else {

							for (j = 0; j < question.ttQuestionarioQuestaoAtributo.length; j++) {

								for (k = 0; k < checkboxArr.length; k++) {

									if (question.ttQuestionarioQuestaoAtributo[j].num_id === checkboxArr[k].num_id && checkboxArr[k].value === true) {

										if (question.ttQuestionarioQuestaoAtributo[j].log_livre_1 === true) {

											if (question.ttRespostaQuestao.dsl_respos_outro === undefined
														|| question.ttRespostaQuestao.dsl_respos_outro.trim().length <= 0) {

												isInvalid = true;

											}

										}

									}
								}

							}
						}

					} else if (question.ttTipo.num_id === 6 && question.ttRespostaQuestao.dsl_respos.length === 0) {

						isInvalid = true;

					} else if (question.ttTipo.num_id === 8) {

						anwserCount = Object.keys(question.ttRespostaQuestao.dsl_respos).length;
						questionCount = 0;

						for (j = 0; j < question.ttQuestionarioQuestaoAtributo.length; j++) {

							if (question.ttQuestionarioQuestaoAtributo[j].log_atrib === false) {

								questionCount++;
							}
						}

						if (anwserCount !== questionCount) {

							isInvalid = true;
						}
					} else if (question.ttTipo.num_id === 12) {

						rows = CRMControlAnwserExecution.getMatrixAttributeRows(question.ttQuestionarioQuestaoAtributo);
						cols = CRMControlAnwserExecution.getMatrixAttributeCols(question.ttQuestionarioQuestaoAtributo);

						for (j = 0; j < rows.length; j++) {

							for (k = 0; k < cols.length; k++) {

								if (CRMUtil.isUndefined(question.ttRespostaQuestao)
										|| CRMUtil.isUndefined(question.ttRespostaQuestao.dsl_respos[j])
										|| !angular.isNumber(parseInt(question.ttRespostaQuestao.dsl_respos[j][k], 10))
										|| isNaN(parseInt(question.ttRespostaQuestao.dsl_respos[j][k], 10))) {
									isInvalid = true;
									break;
								}
							}

							if (isInvalid.isInvalid) {
								break;
							}
						}

					} else if (question.ttTipo.num_id === 13) {

						rows = CRMControlAnwserExecution.getMatrixAttributeRows(question.ttQuestionarioQuestaoAtributo);
						cols = CRMControlAnwserExecution.getMatrixAttributeCols(question.ttQuestionarioQuestaoAtributo);

						for (j = 0; j < rows.length; j++) {

							for (k = 0; k < cols.length; k++) {

								if (CRMUtil.isUndefined(question.ttRespostaQuestao)
										|| CRMUtil.isUndefined(question.ttRespostaQuestao.dsl_respos[j])
										|| !angular.isNumber(parseFloat(question.ttRespostaQuestao.dsl_respos[j][k]))
										|| isNaN(parseFloat(question.ttRespostaQuestao.dsl_respos[j][k]))) {
									isInvalid = true;
									break;
								}
							}

							if (isInvalid.isInvalid) {
								break;
							}
						}

					} else if (question.ttTipo.num_id === 14) {

						rows = CRMControlAnwserExecution.getMatrixAttributeRows(question.ttQuestionarioQuestaoAtributo);
						cols = CRMControlAnwserExecution.getMatrixAttributeCols(question.ttQuestionarioQuestaoAtributo);

						if (rows && angular.isArray(rows)) {
							for (j = 0; j < rows.length; j++) {

								if (cols && angular.isArray(cols)) {
									for (k = 0; k < cols.length; k++) {

										if (CRMUtil.isUndefined(question.ttRespostaQuestao)
												|| CRMUtil.isUndefined(question.ttRespostaQuestao.dsl_respos[j])
												|| CRMUtil.isUndefined(question.ttRespostaQuestao.dsl_respos[j][k])
												|| question.ttRespostaQuestao.dsl_respos[j][k].trim().length === 0) {
											isInvalid = true;
											break;
										}
									}

									if (isInvalid) {
										break;
									}
								}
							}
						}

					}

				}
			}

			return isInvalid;
		};

		this.hasInvalidCharacters = function (page) {
			if (!page || !page.ttQuestionarioQuestao || !angular.isArray(page.ttQuestionarioQuestao)) { return false; }

			if (page.hasOwnProperty("ttQuestionarioQuestao") === false) {
				return;
			}

			var i, j, k, question, rows, cols, isInvalid = false;

			for (i = 0; i < page.ttQuestionarioQuestao.length; i++) {

				question = page.ttQuestionarioQuestao[i];

				if (question.ttTipo.num_id === 14) {

					rows = CRMControlAnwserExecution.getMatrixAttributeRows(question.ttQuestionarioQuestaoAtributo);
					cols = CRMControlAnwserExecution.getMatrixAttributeCols(question.ttQuestionarioQuestaoAtributo);

					if (rows && angular.isArray(rows)) {
						for (j = 0; j < rows.length; j++) {

							if (cols && angular.isArray(cols)) {

								for (k = 0; k < cols.length; k++) {

									if (CRMUtil.isDefined(question.ttRespostaQuestao)
												&& CRMUtil.isDefined(question.ttRespostaQuestao.dsl_respos[j])
												&& CRMUtil.isDefined(question.ttRespostaQuestao.dsl_respos[j][k])
												&& question.ttRespostaQuestao.dsl_respos[j][k].indexOf("|") !== -1) {
										isInvalid = true;
										break;
									}

								}

								if (isInvalid) {
									break;
								}
							}
						}
					}

				}

			}
			return isInvalid;
		};

		this.isOtherAttribute = function (question, value) {
			var j, i, key;

			if (question === undefined) { return false; }

			if (value === undefined) { return false; }

			if (question.idi_tip_quest === 2) { //multi

				if (!angular.isArray(value)) { return false; }

				for (j = 0; j < value.length; j++) {

					if (value[j].log_livre_1 === true) {
						return true;
					}
				}

			} else if (question.idi_tip_quest === 3) { //combo

				if (value.log_livre_1 === true) {
					return true;
				}

			} else if (question.idi_tip_quest === 4) { //radio

				value = parseInt(value, 10);

				if (question.ttQuestionarioQuestaoAtributo && angular.isArray(question.ttQuestionarioQuestaoAtributo)) {
					for (j = 0; j < question.ttQuestionarioQuestaoAtributo.length; j++) {

						if (question.ttQuestionarioQuestaoAtributo[j].num_id === value) {

							if (question.ttQuestionarioQuestaoAtributo[j].log_livre_1 === true) {
								return true;
							}

						}

					}
				}

			} else if (question.idi_tip_quest === 5) { //checkbox

				for (key in value) {

					if (value[key] === true) {

						if (key.indexOf("|") !== -1) {
							key = key.split("|")[0];
						}

						if (question.ttQuestionarioQuestaoAtributo && angular.isArray(question.ttQuestionarioQuestaoAtributo)) {

							for (j = 0; j < question.ttQuestionarioQuestaoAtributo.length; j++) {

								if (parseInt(key, 10) === question.ttQuestionarioQuestaoAtributo[j].num_id
										&& question.ttQuestionarioQuestaoAtributo[j].log_livre_1 === true) {
									return true;
								}

							}
						}

					}

				}

			}
			return false;
		};

		this.convertToSave = function (model, isPartial) {
			var i,
				j,
				k,
				l,
				key,
				page,
				value,
				arrMap,
				anwser,
				anwserCurrent,
				anwserVO,
				joinObject,
				cols,
				rows,
				values,
				matrixParse,
				vo = {
					ttResposta: [],
					ttPessoa: [],
					ttUsuarioCadastro: [],
					ttRespostaQuestao: [],
					ttQuestionarioQuestao: [],
					ttQuestionario: [],
					ttRemoveResposta: []
				};

			if (model === undefined) { return; }

			// HEADER
			vo.ttResposta[0] = {};
			vo.ttResposta[0].num_id_script = CRMControlAnwserExecution.model.num_id;
			vo.ttResposta[0].num_id_reg = CRMControlAnwserExecution.relational.num_id;
			vo.ttResposta[0].num_id_usuar = $rootScope.currentuser.idCRM;
			vo.ttResposta[0].idi_status = (isPartial === true) ? 2 : 3;
			vo.ttResposta[0].idi_tip_script = CRMControlAnwserExecution.relationalType;

			//QUESTIONS - AWNSER
			arrMap = function (obj) {
				var temp;

				temp = obj.num_id ? obj.num_id.toString() : "";

				if (obj.log_livre_1 === true) {
					temp += "|" + anwser.ttRespostaQuestao.dsl_respos_outro;
				}

				return temp;
			};

			matrixParse = function (key) {
				return anwser.ttRespostaQuestao.dsl_respos[key];
			};

			for (j = 0; CRMControlAnwserExecution.model.ttQuestionarioPagina.length > j; j++) {
				page = CRMControlAnwserExecution.model.ttQuestionarioPagina[j];

				if (page.hasOwnProperty("ttQuestionarioQuestao")) {

					for (i = 0; page.ttQuestionarioQuestao.length > i; i++) {
						anwser = page.ttQuestionarioQuestao[i];

						anwser.ttRespostaQuestao = anwser.ttRespostaQuestao || {};

						anwserVO = {
							num_id_quest: anwser.num_id,
							dsl_respos: undefined
						};

						if (anwser.ttTipo === undefined) {
							continue;
						}

						if (anwser.ttRespostaQuestao.nom_id && anwser.ttRespostaQuestao.nom_id.trim().length > 0) {
							anwserVO.nom_id = anwser.ttRespostaQuestao.nom_id;
						}

						switch (anwser.ttTipo.num_id) {
						case 1:
							if (anwser.ttRespostaQuestao.dsl_respos && anwser.ttRespostaQuestao.dsl_respos.trim().length > 0) {
								anwserVO.dsl_respos = angular.copy(anwser.ttRespostaQuestao.dsl_respos);
							} else {
								anwserVO.dsl_respos = "";
							}
							break;
						case 2:
							if (angular.isArray(anwser.ttRespostaQuestao.dsl_respos) && anwser.ttRespostaQuestao.dsl_respos.length > 0) {
								anwserVO.dsl_respos = anwser.ttRespostaQuestao.dsl_respos.map(arrMap);
								anwserVO.dsl_respos = anwserVO.dsl_respos.join('/#$#/');
							} else {
								anwserVO.dsl_respos = "";
							}

							break;
						case 3:

							if (anwser.ttRespostaQuestao.dsl_respos && anwser.ttRespostaQuestao.dsl_respos.num_id > 0) {

								anwserVO.dsl_respos = anwser.ttRespostaQuestao.dsl_respos.num_id.toString();

								if (anwser.ttRespostaQuestao.dsl_respos.log_livre_1 === true) {

									if (anwser.ttRespostaQuestao.dsl_respos_outro !== undefined) {
										anwserVO.dsl_respos += "|" + anwser.ttRespostaQuestao.dsl_respos_outro;
									}

								}

							} else {

								anwserVO.dsl_respos = "";

							}
							break;
						case 4:
							if (anwser.ttRespostaQuestao.dsl_respos !== undefined) {

								for (k = 0; k < anwser.ttQuestionarioQuestaoAtributo.length; k++) {

									if (parseInt(anwser.ttRespostaQuestao.dsl_respos, 10) === anwser.ttQuestionarioQuestaoAtributo[k].num_id) {
										anwserVO.dsl_respos = anwser.ttRespostaQuestao.dsl_respos.toString();

										if (anwser.ttQuestionarioQuestaoAtributo[k].log_livre_1 === true) {

											if (anwser.ttRespostaQuestao.dsl_respos_outro !== undefined) {

												anwserVO.dsl_respos = anwserVO.dsl_respos + "|" + anwser.ttRespostaQuestao.dsl_respos_outro;

											}

										}

									}

								}

							} else {

								anwserVO.dsl_respos = "";

							}
							break;
						case 5:
							anwserVO.dsl_respos = [];

							for (k = 0; k < anwser.ttQuestionarioQuestaoAtributo.length; k++) {

								if (angular.isObject(anwser.ttRespostaQuestao.dsl_respos) && anwser.ttRespostaQuestao.dsl_respos[anwser.ttQuestionarioQuestaoAtributo[k].num_id] === true) {

									value = anwser.ttQuestionarioQuestaoAtributo[k].num_id.toString();

									if (anwser.ttQuestionarioQuestaoAtributo[k].log_livre_1 === true) {

										if (anwser.ttRespostaQuestao.dsl_respos_outro !== undefined) {

											value += "|" + anwser.ttRespostaQuestao.dsl_respos_outro;

										}

									}
									anwserVO.dsl_respos.push(value);
								}
							}

							anwserVO.dsl_respos = anwserVO.dsl_respos.join('/#$#/');

							break;
						case 6:
							if (anwser.ttRespostaQuestao.dsl_respos > 0) {
								anwserVO.dsl_respos = anwser.ttRespostaQuestao.dsl_respos.toString();
							} else {
								anwserVO.dsl_respos = "";
							}
							break;
						case 7:
							if (anwser.ttRespostaQuestao.dsl_respos && anwser.ttRespostaQuestao.dsl_respos.trim().length > 0) {
								anwserVO.dsl_respos = anwser.ttRespostaQuestao.dsl_respos.toString();
							} else {
								anwserVO.dsl_respos = "";
							}
							break;
						case 8:
							if (angular.isObject(anwser.ttRespostaQuestao.dsl_respos)) {
								anwserVO.dsl_respos = Object.keys(anwser.ttRespostaQuestao.dsl_respos).map(matrixParse);
								anwserVO.dsl_respos = anwserVO.dsl_respos.join(",");
							} else {
								anwserVO.dsl_respos = "";
							}
							break;
						case 10:
							if (anwser.ttRespostaQuestao.dsl_respos && anwser.ttRespostaQuestao.dsl_respos.trim().length > 0) {
								anwserVO.dsl_respos = angular.copy(anwser.ttRespostaQuestao.dsl_respos);
							} else {
								anwserVO.dsl_respos = "";
							}
							break;
						case 11:
							if (anwser.ttRespostaQuestao.dsl_respos && anwser.ttRespostaQuestao.dsl_respos > 0) {
								anwserVO.dsl_respos = angular.copy(anwser.ttRespostaQuestao.dsl_respos);
							} else {
								anwserVO.dsl_respos = "";
							}
							break;
						case 12:
							rows = CRMControlAnwserExecution.getMatrixAttributeRows(anwser.ttQuestionarioQuestaoAtributo);
							cols = CRMControlAnwserExecution.getMatrixAttributeCols(anwser.ttQuestionarioQuestaoAtributo);
							values = [];

							for (k = 0; k < rows.length; k++) {

								for (l = 0; l < cols.length; l++) {

									if (CRMUtil.isUndefined(anwser.ttRespostaQuestao.dsl_respos)
											|| CRMUtil.isUndefined(anwser.ttRespostaQuestao.dsl_respos[k])
											|| CRMUtil.isUndefined(anwser.ttRespostaQuestao.dsl_respos[k][l])) {
										value = '';
									} else {
										value = anwser.ttRespostaQuestao.dsl_respos[k][l];
									}

									values.push(rows[k].num_id + '|' + cols[l].num_id + '|' + value);
								}
							}

							anwserVO.dsl_respos = values.join("/#$#/");

							break;
						case 13:
							rows = CRMControlAnwserExecution.getMatrixAttributeRows(anwser.ttQuestionarioQuestaoAtributo);
							cols = CRMControlAnwserExecution.getMatrixAttributeCols(anwser.ttQuestionarioQuestaoAtributo);
							values = [];

							for (k = 0; k < rows.length; k++) {

								for (l = 0; l < cols.length; l++) {

									if (CRMUtil.isUndefined(anwser.ttRespostaQuestao.dsl_respos)
											|| CRMUtil.isUndefined(anwser.ttRespostaQuestao.dsl_respos[k])
											|| CRMUtil.isUndefined(anwser.ttRespostaQuestao.dsl_respos[k][l])) {
										value = '';
									} else {
										value = anwser.ttRespostaQuestao.dsl_respos[k][l];
									}

									values.push(rows[k].num_id + '|' + cols[l].num_id + '|' + value);
								}
							}

							anwserVO.dsl_respos = values.join("/#$#/");

							break;
						case 14:
							rows = CRMControlAnwserExecution.getMatrixAttributeRows(anwser.ttQuestionarioQuestaoAtributo);
							cols = CRMControlAnwserExecution.getMatrixAttributeCols(anwser.ttQuestionarioQuestaoAtributo);
							values = [];

							for (k = 0; k < rows.length; k++) {

								for (l = 0; l < cols.length; l++) {

									if (CRMUtil.isUndefined(anwser.ttRespostaQuestao.dsl_respos)
											|| CRMUtil.isUndefined(anwser.ttRespostaQuestao.dsl_respos[k])
											|| CRMUtil.isUndefined(anwser.ttRespostaQuestao.dsl_respos[k][l])) {
										value = '';
									} else {
										value = anwser.ttRespostaQuestao.dsl_respos[k][l];
									}

									values.push(rows[k].num_id + '|' + cols[l].num_id + '|' + value);
								}
							}

							anwserVO.dsl_respos = values.join("/#$#/");

							break;
						}

						if ((anwserVO.nom_id && anwserVO.nom_id.trim().length > 0) || anwserVO.dsl_respos !== undefined) {
							vo.ttRespostaQuestao.push(anwserVO);
						}
					}
				}
			}

			if (CRMControlAnwserExecution.cleanAnwsers && CRMControlAnwserExecution.cleanAnwsers.length > 0) {

				for (j = 0; CRMControlAnwserExecution.cleanAnwsers.length > j; j++) {
					if (CRMControlAnwserExecution.cleanAnwsers[j].ttRespostaQuestao
							&& CRMControlAnwserExecution.cleanAnwsers[j].ttRespostaQuestao.nom_id
							   && CRMControlAnwserExecution.cleanAnwsers[j].ttRespostaQuestao.nom_id.trim().length > 0) {

						vo.ttRemoveResposta.push({
							num_id: j,
							nom_id_respos_quest: CRMControlAnwserExecution.cleanAnwsers[j].ttRespostaQuestao.nom_id
						});
					}
				}

			}

			return vo;
		};

		this.isColunmFilter = scriptHelper.isColunmFilter;

		this.isRowFilter = scriptHelper.isRowFilter;

		/* Controls */

		this.compareAnwserToId = function (objectAnwser, id) {
			if (!objectAnwser || !id) { return false; }

			if (objectAnwser.ttRespostaQuestao === undefined || objectAnwser.ttRespostaQuestao.dsl_respos === undefined) {
				return false;
			}

			switch (objectAnwser.ttTipo.num_id) {
			case 3:
				if (objectAnwser.ttRespostaQuestao.dsl_respos.num_id === id) {
					return true;
				}
				break;
			case 4:
				if (parseInt(objectAnwser.ttRespostaQuestao.dsl_respos, 10) === id) {
					return true;
				}
				break;
			case 5:
				if (parseInt(objectAnwser.ttRespostaQuestao.dsl_respos, 10) === id) {
					return true;
				}
				break;
			}
			return false;
		};

		this.next = function () {

			var model = CRMControlAnwserExecution.model,
				question,
				idx,
				i,
				j,
				detour,
				currentPageIdx,
				invalidAnwser,
				invalidCharacters;

			invalidAnwser = CRMControlAnwserExecution.hasInvalidAnwsers(CRMControlAnwserExecution.selectedPage);
			invalidCharacters = CRMControlAnwserExecution.hasInvalidCharacters(CRMControlAnwserExecution.selectedPage);

			if (invalidAnwser === true) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'warning',
					title: $rootScope.i18n('nav-script', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-unanswered-question', [], 'dts/crm')
				});

			}

			if (invalidCharacters === true) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('nav-script', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-invalid-characters', [CRMControlAnwserExecution.invalidCharacters], 'dts/crm')
				});
			}

			if (invalidAnwser || invalidCharacters) {
				return;
			}

			if (CRMControlAnwserExecution.selectedPage.hasOwnProperty("ttQuestionarioQuestao") === true && angular.isArray(CRMControlAnwserExecution.selectedPage.ttQuestionarioQuestao)) {

				for (i = 0; i < CRMControlAnwserExecution.selectedPage.ttQuestionarioQuestao.length; i++) {
					question = CRMControlAnwserExecution.selectedPage.ttQuestionarioQuestao[i];

					if (question.ttTipo.is_allow_detour === true) {

						for (j = 0; j < question.ttQuestionarioQuestaoAtributo.length; j++) {

							if (question.ttQuestionarioQuestaoAtributo[j].num_pag_desvio > 0) {

								if (CRMControlAnwserExecution.compareAnwserToId(question,
																				question.ttQuestionarioQuestaoAtributo[j].num_id)) {

									detour = question.ttQuestionarioQuestaoAtributo[j].num_pag_desvio;
									break;
								}
							}
						}
					}
				}

			}

			if (detour && detour > 0) {

				currentPageIdx = model.ttQuestionarioPagina.indexOf(CRMControlAnwserExecution.selectedPage);

				for (i = 0; i < model.ttQuestionarioPagina.length; i++) {

					if (model.ttQuestionarioPagina[i].num_id === detour) {
						CRMControlAnwserExecution.previousPage = CRMControlAnwserExecution.selectedPage;
						CRMControlAnwserExecution.selectedPage = model.ttQuestionarioPagina[i];

						CRMControlAnwserExecution.addCleanAnwser(currentPageIdx, i);
						break;
					}
				}
			} else {
				idx = model.ttQuestionarioPagina.indexOf(CRMControlAnwserExecution.selectedPage);
				CRMControlAnwserExecution.previousPage = CRMControlAnwserExecution.selectedPage;
				CRMControlAnwserExecution.selectedPage = CRMControlAnwserExecution.model.ttQuestionarioPagina[idx + 1];
			}

			if (CRMControlAnwserExecution.selectedPage.hasOwnProperty("ttQuestionarioQuestao") === true) {

				for (i = 0; i < CRMControlAnwserExecution.selectedPage.ttQuestionarioQuestao.length; i++) {

					scriptHelper.parseScriptQuestType(CRMControlAnwserExecution.selectedPage.ttQuestionarioQuestao[i]);

					if (CRMControlAnwserExecution.anwser !== undefined) {
						CRMControlAnwserExecution.parseAnwserToModel(CRMControlAnwserExecution.selectedPage.ttQuestionarioQuestao[i]);
					}
				}
			}

		};

		this.previous = function () {

			var model = CRMControlAnwserExecution.model, detour, page, currentIdx, destinationIdx, idx, i, newIdx;

			currentIdx = model.ttQuestionarioPagina.indexOf(CRMControlAnwserExecution.selectedPage);
			CRMControlAnwserExecution.selectedPage = CRMControlAnwserExecution.previousPage;

			newIdx = model.ttQuestionarioPagina.indexOf(CRMControlAnwserExecution.selectedPage);
			CRMControlAnwserExecution.previousPage = CRMControlAnwserExecution.model.ttQuestionarioPagina[newIdx - 1];


			if (CRMControlAnwserExecution.model.ttDesvio !== undefined) {

				for (i = 0; i < CRMControlAnwserExecution.model.ttDesvio.length; i++) {
					detour = CRMControlAnwserExecution.model.ttDesvio[i];

					if (detour.num_id_pag_to === CRMControlAnwserExecution.selectedPage.num_id) {
						idx = detour.num_id_pag_from;
						break;
					}
				}
			}

			if (idx && idx > 0) {

				for (i = 0; i < model.ttQuestionarioPagina.length; i++) {

					page = model.ttQuestionarioPagina[i];

					if (page.num_id === idx) {
						CRMControlAnwserExecution.previousPage = page;
					}
				}
			}

			destinationIdx = model.ttQuestionarioPagina.indexOf(CRMControlAnwserExecution.selectedPage);

			CRMControlAnwserExecution.removeCleanAnwser(currentIdx, destinationIdx);
		};

		this.addCleanAnwser = function (currentPageIdx, destinationPageIdx) {
			var i, j,
				model = CRMControlAnwserExecution.model;

			for (i = currentPageIdx + 1; i < destinationPageIdx; i++) {

				if (model.ttQuestionarioPagina[i].ttQuestionarioQuestao && model.ttQuestionarioPagina[i].ttQuestionarioQuestao.length > 0) {

					for (j = 0; j < model.ttQuestionarioPagina[i].ttQuestionarioQuestao.length; j++) {
						CRMControlAnwserExecution.cleanAnwsers.push(model.ttQuestionarioPagina[i].ttQuestionarioQuestao[j]);
					}

				}

			}

		};

		this.removeCleanAnwser = function (currentPageIdx, destinationPageIdx) {

			var model = CRMControlAnwserExecution.model, j, i, auxArr = [];

			for (i = destinationPageIdx + 1; i < currentPageIdx; i++) {

				for (j = 0; j < CRMControlAnwserExecution.cleanAnwsers.length; j++) {

					if (CRMControlAnwserExecution.cleanAnwsers[j].num_id_pag === model.ttQuestionarioPagina[i].num_id) {

						auxArr.push(CRMControlAnwserExecution.cleanAnwsers[j].num_id);

					}

				}

			}

			for (j = 0; j < CRMControlAnwserExecution.cleanAnwsers.length; j++) {

				for (i = 0; i < auxArr.length; i++) {

					if (auxArr[i] === CRMControlAnwserExecution.cleanAnwsers[j].num_id) {

						CRMControlAnwserExecution.cleanAnwsers.splice(j, 1);

					}
				}
			}

		};

		this.save = function (isPartial) {
			var model = CRMControlAnwserExecution.model,
				selectedPage = CRMControlAnwserExecution.selectedPage,
				invalidAnwser,
				invalidCharacters,
				vo;
			invalidCharacters = CRMControlAnwserExecution.hasInvalidCharacters(CRMControlAnwserExecution.selectedPage);

			if (CRMControlAnwserExecution.hasNextPage() === false) {

				invalidAnwser = CRMControlAnwserExecution.hasInvalidAnwsers(CRMControlAnwserExecution.selectedPage);

				if (invalidAnwser === true) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'warning',
						title: $rootScope.i18n('nav-script', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-unanswered-question', [], 'dts/crm')
					});

				}
			}

			if (invalidCharacters === true) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('nav-script', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-invalid-characters', [CRMControlAnwserExecution.invalidCharacters], 'dts/crm')
				});
			}

			if (invalidAnwser || invalidCharacters) {
				return;
			}

			vo = CRMControlAnwserExecution.convertToSave(model, isPartial);

			if (CRMControlAnwserExecution.anwser !== undefined) {
				anwserFactory.update(CRMControlAnwserExecution.anwser.nom_id, vo, function (result) {
					$modalInstance.close({
						anwser: result,
						isNew: false
					});
				});

			} else {
				anwserFactory.save(vo, function (result) {
					$modalInstance.close({
						anwser: result,
						isNew: true
					});
				});
			}

		};

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.parseAnwserToModel = function (question) {

			if (!question || question.$parsed) { return; }

			var i, j, k, attribute, values, col, row, cols, rows, anwser, keys;

			if (question.ttRespostaQuestao === undefined) {
				return;
			}

			if (question.ttTipo.num_id === 12 || question.ttTipo.num_id === 13 ||  question.ttTipo.num_id === 14) {

				anwser = question.ttRespostaQuestao.dsl_respos.split("/#$#/");

				question.ttRespostaQuestao.dsl_respos = [];
				rows = CRMControlAnwserExecution.getMatrixAttributeRows(question.ttQuestionarioQuestaoAtributo);
				cols = CRMControlAnwserExecution.getMatrixAttributeCols(question.ttQuestionarioQuestaoAtributo);

				if (rows && angular.isArray(rows)) {
					for (i = 0; i < rows.length; i++) {
						values = [];

						if (cols && angular.isArray(cols)) {

							for (j = 0; j < cols.length; j++) {

								if (anwser && angular.isArray(anwser)) {
									for (k = 0; k < anwser.length; k++) {
										keys = anwser[k].split('|');
										if ((rows[i].num_id + '|' + cols[j].num_id) === keys[0] + '|' + keys[1]) {
											values.push(keys[2]);
											break;
										}
									}
								}
							}
						}

						question.ttRespostaQuestao.dsl_respos.push(values);

					}
				}

			} else if (question.ttTipo.num_id === 8) {
				anwser = question.ttRespostaQuestao.dsl_respos.split(",");

				cols = [];
				rows = [];

				if (question.ttQuestionarioQuestaoAtributo && angular.isArray(question.ttQuestionarioQuestaoAtributo)) {

					for (i = 0; i < question.ttQuestionarioQuestaoAtributo.length; i++) {
						attribute = question.ttQuestionarioQuestaoAtributo[i];
						if (attribute.log_atrib === false) {
							rows.push(attribute);
						} else {
							cols.push(attribute);
						}
					}
				}

				values = {};

				if (rows && angular.isArray(rows)) {

					for (i = 0; i < rows.length; i++) {
						values[i] = '';
						row = rows[i];

						if (cols && angular.isArray(cols)) {
							for (j = 0; j < cols.length; j++) {
								col = cols[j];

								if (anwser && angular.isArray(anwser)) {
									for (k = 0; k < anwser.length; k++) {
										if ((row.num_id + '|' + col.num_id) === anwser[k]) {
											values[i] = anwser[k];
											break;
										}
									}
								}
							}
						}
					}

				}
				question.ttRespostaQuestao.dsl_respos = values;

			} else if (question.ttTipo.num_id === 6) {
				values = parseInt(question.ttRespostaQuestao.dsl_respos, 10);

				if (values > 0) {
					question.ttRespostaQuestao.dsl_respos = values;
				} else {
					question.ttRespostaQuestao.dsl_respos = undefined;
				}

			} else if (question.ttTipo.num_id === 5) {
				values = {};

				question.ttRespostaQuestao.dsl_respos.split("/#$#/").map(function (item) {
					if (item.indexOf("|") !== -1) {
						item = item.split("|");
						question.ttRespostaQuestao.dsl_respos_outro = item[1];
						item = item[0];
					}
					values[item] = true;
				});

				question.ttRespostaQuestao.dsl_respos = values;

			} else if (question.ttTipo.num_id === 4) {

				values = question.ttRespostaQuestao.dsl_respos.split("|");

				if (question.ttQuestionarioQuestaoAtributo && angular.isArray(question.ttQuestionarioQuestaoAtributo)) {

					for (i = 0; i < question.ttQuestionarioQuestaoAtributo.length; i++) {

						attribute = question.ttQuestionarioQuestaoAtributo[i];

						if (parseInt(values[0], 10) === attribute.num_id) {

							question.ttRespostaQuestao.dsl_respos = attribute.num_id;

						}

						if (attribute.log_livre_1 === true) {

							question.ttRespostaQuestao.dsl_respos_outro = values[1];
						}

					}
				}

			} else if (question.ttTipo.num_id === 3) {

				values = question.ttRespostaQuestao.dsl_respos.split("|");

				if (question.ttQuestionarioQuestaoAtributo && angular.isArray(question.ttQuestionarioQuestaoAtributo)) {

					for (i = 0; i < question.ttQuestionarioQuestaoAtributo.length; i++) {

						attribute = question.ttQuestionarioQuestaoAtributo[i];

						if (parseInt(values[0], 10) === attribute.num_id) {

							question.ttRespostaQuestao.dsl_respos = attribute;
						}

						if (attribute.log_livre_1 === true) {

							question.ttRespostaQuestao.dsl_respos_outro = values[1];
						}

					}
				}

			} else if (question.ttTipo.num_id === 2) {

				values = question.ttRespostaQuestao.dsl_respos.split("/#$#/").map(function (value) {
					if (value.indexOf("|") !== -1) {
						value = value.split("|");
						return { id: parseInt(value[0], 10), other: value[1] };
					}
					return { id: parseInt(value, 10)};
				});

				question.ttRespostaQuestao.dsl_respos = [];

				if (question.ttQuestionarioQuestaoAtributo && angular.isArray(question.ttQuestionarioQuestaoAtributo)) {

					for (i = 0; i < question.ttQuestionarioQuestaoAtributo.length; i++) {

						if (values && angular.isArray(values)) {
							for (j = 0; j < values.length; j++) {

								if (question.ttQuestionarioQuestaoAtributo[i].num_id === values[j].id) {

									question.ttRespostaQuestao.dsl_respos.push(question.ttQuestionarioQuestaoAtributo[i]);

									if (question.ttQuestionarioQuestaoAtributo[i].log_livre_1 === true) {

										question.ttRespostaQuestao.dsl_respos_outro = values[j].other;

									}

								}

							}
						}

					}

				}

			}
			question.$parsed = true;

		};

		/* Initializing */

		this.init = function () {

			var i, j;
			if (!CRMControlAnwserExecution.anwserDetailMode) {
				if (CRMControlAnwserExecution.anwser !== undefined) {

					anwserFactory.getState(CRMControlAnwserExecution.model.num_id, CRMControlAnwserExecution.anwser.nom_id, function (resultAnwser) {

						CRMControlAnwserExecution.model = resultAnwser;

						if (CRMControlAnwserExecution.model.ttQuestionarioPagina && CRMControlAnwserExecution.model.ttQuestionarioPagina.length > 0) {

							CRMControlAnwserExecution.selectedPage = CRMControlAnwserExecution.model.ttQuestionarioPagina[0];

							if (CRMControlAnwserExecution.selectedPage.ttQuestionarioQuestao && angular.isArray(CRMControlAnwserExecution.selectedPage.ttQuestionarioQuestao)) {

								for (i = 0; i < CRMControlAnwserExecution.selectedPage.ttQuestionarioQuestao.length; i++) {
									scriptHelper.parseScriptQuestType(CRMControlAnwserExecution.selectedPage.ttQuestionarioQuestao[i]);
									CRMControlAnwserExecution.parseAnwserToModel(CRMControlAnwserExecution.selectedPage.ttQuestionarioQuestao[i]);
								}
							}
						}
					});
				} else {
					scriptFactory.getRecord(CRMControlAnwserExecution.model.num_id, function (result) {

						CRMControlAnwserExecution.model = result;

						if (CRMControlAnwserExecution.model.ttQuestionarioPagina && CRMControlAnwserExecution.model.ttQuestionarioPagina.length > 0) {

							CRMControlAnwserExecution.selectedPage = CRMControlAnwserExecution.model.ttQuestionarioPagina[0];

							if (CRMControlAnwserExecution.selectedPage.ttQuestionarioQuestao && angular.isArray(CRMControlAnwserExecution.selectedPage.ttQuestionarioQuestao)) {
								for (i = 0; i < CRMControlAnwserExecution.selectedPage.ttQuestionarioQuestao.length; i++) {
									scriptHelper.parseScriptQuestType(CRMControlAnwserExecution.selectedPage.ttQuestionarioQuestao[i]);
								}
							}
						}
					});
				}

			} else {

				appViewService.startView($rootScope.i18n('nav-script', [], 'dts/crm'), 'crm.script-anwser.execution.control', CRMControlAnwserExecution);

				accessRestrictionFactory.getUserRestrictions('anwser.detail', $rootScope.currentuser.login, function (result) {
					CRMControlAnwserExecution.accessRestrictionAnwserDetail = result || {};
				});

				anwserFactory.getState($stateParams.script_id, $stateParams.resposta_id, function (resultAnwser) {
					CRMControlAnwserExecution.model = resultAnwser;

					if (CRMControlAnwserExecution.model.ttQuestionarioPagina && CRMControlAnwserExecution.model.ttQuestionarioPagina.length > 0) {
						for (j = 0; j < CRMControlAnwserExecution.model.ttQuestionarioPagina.length; j++) {
							var page = CRMControlAnwserExecution.model.ttQuestionarioPagina[j];

							if (page && page.ttQuestionarioQuestao && angular.isArray(page.ttQuestionarioQuestao)) {
								for (i = 0; i < page.ttQuestionarioQuestao.length; i++) {
									scriptHelper.parseScriptQuestType(page.ttQuestionarioQuestao[i]);
									CRMControlAnwserExecution.parseAnwserToModel(page.ttQuestionarioQuestao[i]);
								}
							}
						}
					}
				});
			}
		};

		this.print = function (script) {
			anwserFactory.printScript(script.num_id, script.ttResposta.nom_id, script.nom_script, script.ttResposta.num_id_reg);
		};

		this.closeView = function (callback) {
			var view = {
				active: true,
				name: $rootScope.i18n('nav-script', [], 'dts/crm'),
				url: $location.url()
			};

			if (angular.isFunction(appViewService.getPageActive)) {
				view = appViewService.getPageActive();
			}

			appViewService.removeView(view);

			if (callback) {
				callback();
			}
		};

		this.back = function () {
			CRMControlAnwserExecution.closeView(function () {
				var idEntity = $stateParams.entity,
					state;

				if (idEntity === '1') {
					state = 'dts/crm/account.detail';
				} else if (idEntity === '3') {
					state = 'dts/crm/task.detail';
				} else if (idEntity === '4') {
					state = 'dts/crm/history.detail';
				} else if (idEntity === '5') {
					state = 'dts/crm/opportunity.detail';
				} else if (idEntity === '6') {
					state = 'dts/crm/ticket.detail';
				}

				$state.go(state, {id: $stateParams.id});
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************
		if (parameters.script) {
			CRMControlAnwserExecution.model = parameters.script;
			CRMControlAnwserExecution.relationalType = parameters.relationalType;
			CRMControlAnwserExecution.relational = parameters.relational;
			CRMControlAnwserExecution.anwser = parameters.anwser;
			CRMControlAnwserExecution.viewMode = parameters.viewMode;
		} else {
			CRMControlAnwserExecution.anwserDetailMode = true;
		}

		this.init();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlAnwserExecution = undefined;
		});

	};

	controllerAnwserExecution.$inject = ['$rootScope', '$scope', '$stateParams', 'TOTVSEvent', 'totvs.app-main-view.Service', 'crm.crm_script.factory', 'crm.script.helper', 'crm.crm_script_respos.factory', '$location', '$window', '$state', 'crm.crm_acess_portal.factory'];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************


	index.register.service('crm.script-anwser.modal.execution', modalAnwserExecution);
	index.register.controller('crm.script-anwser.execution.control', controllerAnwserExecution);

});
