/*jslint plusplus: true, devel: false, forin: true, indent: 4, maxerr: 50 */
/*global define, angular, $, TOTVSEvent */
define(['index', 'angularAMD', '/dts/cmg/js/api/importbankstatement.js', '/dts/cmg/js/zoom/cta-corren.js', '/dts/cmg/js/zoom/banco.js', '/dts/cmg/js/zoom/layout-extrat.js', '/dts/cmg/js/dbo/cmg900wc.js'], function(index) {

    'use strict';

    function ImpBankStatemEditCtrl($rootScope, $scope, $stateParams, $window, $location, $filter, appViewService, customizationService, cmgUtilsAux, utbUtilsAux, serviceCheckingAcctAux, /* Zoom Conta Corrente (cta_corren) */
    serviceBankAux, /* Zoom Banco (banco) */
    serviceStmntLayoutAux, /* Zoom Layout Extrato (layout_extrat) */
    cmg900wcFactoryAux, /* DBO Layout Extrato (layout_extrat) */
    importbankstatementFactory, TOTVSEvent) {

        var thisImpBankStatemEditCtrl = this;

        this.listFiles = [];
        this.model = {};
        this.cmgUtils = cmgUtilsAux;
        this.utbUtils = utbUtilsAux;
        this.serviceCheckingAcct = serviceCheckingAcctAux;
        this.serviceBank = serviceBankAux;
        this.serviceStmntLayout = serviceStmntLayoutAux;
        this.cmg900wcFactory = cmg900wcFactoryAux;
        this.disabledCheckingAcct = true;
        this.isUpdate = false;
        this.ruleUpdate = undefined;
        this.removeAllFiles = false;

        /* Filtros para o campo Conta Corrente (Select e Zoom) */
        this.listCheckingAcctInit = {
            filters: {
                ind_tip_cta_corren: "Bancária",
                cod_banco: (this.model.bank ? this.model.bank.cod_banco : "")
            }
        };

        /*######################################### Watch ##########################################*/

        /* Watch.....: listResult
			Descrição.: quando a lista principal for alterada, o grid é atualizado
			Parâmetros: value
		*/
        $scope.$watch('controller.model.bank', function(value) {

            /* Classe MultipleSelectResult utilizada para montagem do objeto de múltipla seleção
				quando no modo de Alteração existir duas ou mais Contas Correntes para a regra */
            function MultipleSelectResult() {}
            MultipleSelectResult.prototype.toString = function() {
                return this.objSelected.length + ' - ' + $rootScope.i18n('l-selecteds', undefined, 'dts/utb');
            }
            ;

            /* Sempre limpa o campo Conta Corrente */
            thisImpBankStatemEditCtrl.model.listCheckingAcct = undefined;

            /* Caso o campo Banco esteja em branco, deve desabilitar o campo Conta Corrente e
				limpar o filtro pelo Banco */
            if (value === undefined || value === null) {
                thisImpBankStatemEditCtrl.disabledCheckingAcct = true;
                thisImpBankStatemEditCtrl.listCheckingAcctInit.filters.cod_banco = "";
            } else {

                /* Caso o campo Banco esteja informado */

                /* Habilita campo Conta Corrente e define o filtro pelo Banco */
                thisImpBankStatemEditCtrl.disabledCheckingAcct = false;
                thisImpBankStatemEditCtrl.listCheckingAcctInit.filters.cod_banco = thisImpBankStatemEditCtrl.model.bank.cod_banco;

                /* Caso o campo Layout Extrato não esteja informado, sugere o Layout do Banco */
                if (thisImpBankStatemEditCtrl.model.bankStatementLayout === undefined || thisImpBankStatemEditCtrl.model.bankStatementLayout === null) {

                    /* Somente irá sugerir, caso exista um layout extrato informado para o Banco */
                    if (thisImpBankStatemEditCtrl.model.bank.cod_layout_extrat !== undefined && thisImpBankStatemEditCtrl.model.bank.cod_layout_extrat !== null && thisImpBankStatemEditCtrl.model.bank.cod_layout_extrat !== "") {

                        /* Utiliza o método get da DBO para obter o objeto Layout Extrato e atribui
							o mesmo ao componente Select */
                        thisImpBankStatemEditCtrl.cmg900wcFactory.getRecord({
                            id: thisImpBankStatemEditCtrl.model.bank.cod_layout_extrat
                        }, function(result) {
                            if (result && angular.isObject(result)) {
                                thisImpBankStatemEditCtrl.model.bankStatementLayout = result;
                            }
                        });
                    }
                }
            }

            /* Invoca o método do serviço de Zoom para popular a lista do componente Select filtrando
				pelo Banco informado em tela */
            thisImpBankStatemEditCtrl.serviceCheckingAcct.getSelectResultList("", thisImpBankStatemEditCtrl.listCheckingAcctInit, function(result) {

                /* Evento de callback disparado após carregar a lista para tratamento no modo alteração:
						deve carregar o valor do campo Conta Corrente somente após carregar a lista filtrada
						pelo Banco informado*/
                if (thisImpBankStatemEditCtrl.isUpdate) {

                    thisImpBankStatemEditCtrl.isUpdate = false;

                    var chkAccount;

                    if (thisImpBankStatemEditCtrl.ruleUpdate.ttChkAccount.length === 1) {
                        chkAccount = thisImpBankStatemEditCtrl.ruleUpdate.ttChkAccount[0];
                    } else {

                        chkAccount = new MultipleSelectResult();
                        chkAccount.objSelected = thisImpBankStatemEditCtrl.ruleUpdate.ttChkAccount;

                    }

                    thisImpBankStatemEditCtrl.model.listCheckingAcct = chkAccount;

                }
            });
        });

        /* Função....: getParametersSaveUpdate
			Descrição.: retorna os parâmetros para serem passados as funções de inclusão e alteração
			Parâmetros: <não há>
		*/
        this.getParametersSaveUpdate = function() {
            //console.log("impBankStatemEditCtrl", "function: getParametersSaveUpdate", thisImpBankStatemEditCtrl.model);

            var ttRuleBankStmnt, ttRuleBankStmntRow, ttChkAccount, iAcc, ttChkAccountRow, parameters;

            /******************************************************************************************
			TEMP-TABLE ttRuleBankStmnt
			******************************************************************************************/

            /* Objeto que representa a temp-table ttRuleBankStmnt */
            ttRuleBankStmnt = [];

            /* Objeto que representa um registro da temp-table ttRuleBankStmnt */
            ttRuleBankStmntRow = {};

            /* Criando um registro para a temp-table ttRuleBankStmnt */
            ttRuleBankStmntRow.num_id_regra_extrat = thisImpBankStatemEditCtrl.model.num_id_regra_extrat || 0;
            ttRuleBankStmntRow.des_regra_extrat = thisImpBankStatemEditCtrl.model.des_regra_extrat || "";
            ttRuleBankStmntRow.cod_banco = (thisImpBankStatemEditCtrl.model.bank) ? thisImpBankStatemEditCtrl.model.bank.cod_banco : "";
            ttRuleBankStmntRow.cod_layout_extrat = (thisImpBankStatemEditCtrl.model.bankStatementLayout) ? thisImpBankStatemEditCtrl.model.bankStatementLayout.cod_layout_extrat : "";
            ttRuleBankStmntRow.dsl_dir_transf = thisImpBankStatemEditCtrl.model.dsl_dir_transf || "";
            ttRuleBankStmntRow.dsl_arq_import = thisImpBankStatemEditCtrl.model.dsl_arq_import || "";
            ttRuleBankStmntRow.log_upload = thisImpBankStatemEditCtrl.model.log_upload || false;
            ttRuleBankStmntRow.log_transf_arq = thisImpBankStatemEditCtrl.model.log_transf_arq || false;

            /* Adicionando registro ao objeto que representa a temp-table ttRuleBankStmnt */
            ttRuleBankStmnt.push(ttRuleBankStmntRow);

            /******************************************************************************************
			TEMP-TABLE ttChkAccount
			******************************************************************************************/

            /* Objeto que representa a temp-table ttChkAccount */
            ttChkAccount = [];

            if (thisImpBankStatemEditCtrl.model.listCheckingAcct) {

                if (thisImpBankStatemEditCtrl.model.listCheckingAcct.hasOwnProperty("objSelected")) {

                    for (iAcc = 0; iAcc < thisImpBankStatemEditCtrl.model.listCheckingAcct.objSelected.length; iAcc++) {

                        ttChkAccountRow = {};
                        ttChkAccountRow.cod_cta_corren = thisImpBankStatemEditCtrl.model.listCheckingAcct.objSelected[iAcc].cod_cta_corren;
                        ttChkAccountRow.nom_abrev = thisImpBankStatemEditCtrl.model.listCheckingAcct.objSelected[iAcc].nom_abrev;

                        ttChkAccount.push(ttChkAccountRow);
                    }

                } else {

                    ttChkAccountRow = {};
                    ttChkAccountRow.cod_cta_corren = thisImpBankStatemEditCtrl.model.listCheckingAcct.cod_cta_corren;
                    ttChkAccountRow.nom_abrev = thisImpBankStatemEditCtrl.model.listCheckingAcct.nom_abrev;

                    ttChkAccount.push(ttChkAccountRow);

                }
            }

            /******************************************************************************************
			PARÂMETROS
			******************************************************************************************/

            /* Objeto que representa o conjunto de parâmetros INPUT */
            parameters = {};
            parameters.ttRuleBankStmnt = ttRuleBankStmnt;
            parameters.ttChkAccount = ttChkAccount;

            return angular.toJson(parameters);

        }
        ;

        /* Função....: upload
			Descrição.: realiza o upload do arquivo
			Parâmetros: id
		*/
        this.upload = function(countFilesUpload, afterSuccess, errorUpload) {
            //console.log("impBankStatemEditCtrl", "function: upload", countFilesUpload);

            var error = false;

            if (countFilesUpload > 0) {

                /* Percorre os arquivos que devem ser transferidos */
                angular.forEach(thisImpBankStatemEditCtrl.listFiles, function(fileRuleBankStmnt) {

                    /* Somente arquivos não processados e não removidos */
                    if (fileRuleBankStmnt.status !== 4 && !fileRuleBankStmnt.remove) {

                        fileRuleBankStmnt.promise = importbankstatementFactory.upload(fileRuleBankStmnt, function(result) {
                            //console.log("Upload", "function: Success", result);

                            fileRuleBankStmnt.status = 4;
                            fileRuleBankStmnt.progress = '100%';
                            fileRuleBankStmnt.exist = true;

                            countFilesUpload--;
                            if (countFilesUpload <= 0) {
                                if (error) {
                                    errorUpload(fileRuleBankStmnt.idRuleBankStmnt);
                                } else {
                                    afterSuccess(fileRuleBankStmnt.idRuleBankStmnt);
                                }
                            }

                        }, function(progress, event) {
                            //console.log("Upload", "function: Progress", progress, event);

                            fileRuleBankStmnt.status = 1;
                            fileRuleBankStmnt.progress = progress;
                            fileRuleBankStmnt.exist = false;

                        }, function(result, status, headers, config) {
                            //console.log("Upload", "function: Error", result, status, headers, config);

                            fileRuleBankStmnt.status = 3;
                            fileRuleBankStmnt.progress = '0%';
                            fileRuleBankStmnt.exist = false;

                            countFilesUpload--;
                            error = true;
                            if (countFilesUpload <= 0) {
                                errorUpload(fileRuleBankStmnt.idRuleBankStmnt);
                            }
                        });
                    }
                });
            } else {

                afterSuccess(undefined);

            }
        }
        ;

        /* Função....: uploadFiles
			Descrição.: efetua os tratamentos para a realização do upload
			Parâmetros: id
		*/
        this.uploadFiles = function(idRuleBankStmnt, afterSuccess, errorUpload) {

            var seqFile = 0
              , countFilesUpload = 0
              , countFilesRemove = 0;

            /* Tratamento para geração das sequencias dos arquivos */

            /* 1 - Identifica a maior sequencia */
            angular.forEach(thisImpBankStatemEditCtrl.listFiles, function(fileRuleBankStmnt) {
                if (seqFile < fileRuleBankStmnt.seq) {
                    seqFile = fileRuleBankStmnt.seq;
                }
            });

            /* 2 - Atualiza objetos equivalentes aos arquivos */
            angular.forEach(thisImpBankStatemEditCtrl.listFiles, function(fileRuleBankStmnt) {

                /* Alimenta o campo regra */
                fileRuleBankStmnt.idRuleBankStmnt = idRuleBankStmnt;

                /* Somente arquivos não processados e não removidos */
                if (fileRuleBankStmnt.status !== 4 && !fileRuleBankStmnt.remove) {

                    /* Alimenta o campo sequencia */
                    seqFile++;
                    fileRuleBankStmnt.seq = seqFile;

                    /* Quantidade de arquivos para Upload (apenas os arquivos com sequencia atualizada) */
                    countFilesUpload++;
                }

                /* Somente arquivos marcados para serem removidos */
                if (fileRuleBankStmnt.remove) {

                    /* Quantidade de arquivos para Remoção */
                    countFilesRemove++;

                }
            });

            /* 3 - Remove os arquivos (apenas para o modo alteração) */
            if (countFilesRemove > 0) {

                angular.forEach(thisImpBankStatemEditCtrl.listFiles, function(fileRuleBankStmnt) {

                    /* Somente arquivos marcados para serem removidos */
                    if (fileRuleBankStmnt.remove) {

                        /* Remove arquivo */
                        importbankstatementFactory.deleteFileUserRule(fileRuleBankStmnt.idRuleBankStmnt, fileRuleBankStmnt.seq, function(result) {

                            if (result && result.$hasError) {
                                return;
                            }

                            /* Remove o arquivo da lista */
                            var index = thisImpBankStatemEditCtrl.listFiles.indexOf(fileRuleBankStmnt);
                            if (index !== -1) {
                                thisImpBankStatemEditCtrl.listFiles.splice(index, 1);
                            }

                            countFilesRemove--;
                            if (countFilesRemove <= 0) {

                                /* Após a eliminação de todos os arquivos marcados para serem removidos,
										dispara o processo de Upload */
                                thisImpBankStatemEditCtrl.upload(countFilesUpload, afterSuccess, errorUpload);

                            }
                        });
                    }
                });
            } else {

                /* Dispara o processo de Upload */
                thisImpBankStatemEditCtrl.upload(countFilesUpload, afterSuccess, errorUpload);

            }
        }
        ;

        /* Função....: createRecord
			Descrição.: responsável por incluir um registro
			Parâmetros: afterSuccess (evento)
		*/
        this.createRecord = function(afterSuccess, errorUpload) {
            //console.log("impBankStatemEditCtrl", "function: createRecord");

            importbankstatementFactory.save(undefined, thisImpBankStatemEditCtrl.getParametersSaveUpdate(), function(result) {

                if (result && result.$hasError) {
                    return;
                }

                var idRuleBankStmnt = result.idRuleBankStmnt || undefined;

                /* Após gravar o registro, caso seja para fazer Upload, realiza o mesmo */
                if (thisImpBankStatemEditCtrl.model.log_upload) {

                    thisImpBankStatemEditCtrl.uploadFiles(idRuleBankStmnt, afterSuccess, errorUpload);

                } else {

                    afterSuccess(idRuleBankStmnt);
                }
            });
        }
        ;

        /* Função....: updateRecord
			Descrição.: responsável por alterar um registro
			Parâmetros: afterSuccess (evento)
		*/
        this.updateRecord = function(afterSuccess, errorUpload) {
            //console.log("impBankStatemEditCtrl", "function: updateRecord");

            importbankstatementFactory.update(thisImpBankStatemEditCtrl.getParametersSaveUpdate(), function(result) {

                if (result && result.$hasError) {
                    return;
                }

                var idRuleBankStmnt = thisImpBankStatemEditCtrl.model.num_id_regra_extrat;

                /* Após alterar o registro, caso seja para fazer Upload, realiza o mesmo */
                if (thisImpBankStatemEditCtrl.model.log_upload) {

                    thisImpBankStatemEditCtrl.uploadFiles(idRuleBankStmnt, afterSuccess, errorUpload);

                } else {

                    afterSuccess(idRuleBankStmnt);
                }
            });
        }
        ;

        /* Função....: save
			Descrição.: função disparado no clique do botão Salvar
			Parâmetros: <não há>
		*/
        this.save = function(isSaveNew) {
            //console.log("impBankStatemEditCtrl", "function: save", isSaveNew);

            /* Valida formulário */
            if (thisImpBankStatemEditCtrl.isInvalidForm()) {
                return;
            }

            /* Alteração */
            if (thisImpBankStatemEditCtrl.model.num_id_regra_extrat) {

                thisImpBankStatemEditCtrl.updateRecord(function(idRuleBankStmnt) {
                    //console.log("impBankStatemEditCtrl", "function: updateRecord - success");

                    if (idRuleBankStmnt === undefined) {
                        idRuleBankStmnt = thisImpBankStatemEditCtrl.model.num_id_regra_extrat;
                    }

                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success',
                        title: $rootScope.i18n('l-import-bank-statement', undefined, 'dts/cmg'),
                        detail: $rootScope.i18n('l-rule', undefined, 'dts/cmg') + ' ' + idRuleBankStmnt + ' ' + $rootScope.i18n('l-success-updated', undefined, 'dts/cmg') + '!'
                    });

                    /* Redireciona para a tela base */
                    thisImpBankStatemEditCtrl.redirectToBase();

                }, function(idRuleBankStmnt) {
                    //console.log("impBankStatemEditCtrl", "function: updateRecord - error");

                    if (idRuleBankStmnt === undefined) {
                        idRuleBankStmnt = thisImpBankStatemEditCtrl.model.num_id_regra_extrat;
                    }

                    /* Notifica o usuario que ocorreu erro durante o upload */
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error',
                        title: $rootScope.i18n('l-error-upload', undefined, 'dts/cmg'),
                        detail: $rootScope.i18n('msg-error-upload', undefined, 'dts/cmg')
                    });
                });

                /* Inclusão */
            } else {

                thisImpBankStatemEditCtrl.createRecord(function(idRuleBankStmnt) {
                    //console.log("impBankStatemEditCtrl", "function: createRecord - success");

                    if (idRuleBankStmnt === undefined) {
                        idRuleBankStmnt = thisImpBankStatemEditCtrl.model.num_id_regra_extrat;
                    }

                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success',
                        title: $rootScope.i18n('l-import-bank-statement', undefined, 'dts/cmg'),
                        detail: $rootScope.i18n('l-rule', undefined, 'dts/cmg') + ' ' + idRuleBankStmnt + ' ' + $rootScope.i18n('l-success-created', undefined, 'dts/cmg') + '!'
                    });

                    if (isSaveNew) {
                        /* Carrega defaults */
                        thisImpBankStatemEditCtrl.loadDefaults();
                    } else {
                        /* Redireciona para a tela base */
                        thisImpBankStatemEditCtrl.redirectToBase();
                    }
                }, function(idRuleBankStmnt) {
                    //console.log("impBankStatemEditCtrl", "function: createRecord - error");

                    if (idRuleBankStmnt === undefined) {
                        idRuleBankStmnt = thisImpBankStatemEditCtrl.model.num_id_regra_extrat;
                    }

                    /* Erro durante o upload ! Remove o registro criado */
                    importbankstatementFactory.deleteUserRule(idRuleBankStmnt, function(result) {});

                    /* Notifica o usuario que ocorreu erro durante o upload */
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error',
                        title: $rootScope.i18n('l-error-upload', undefined, 'dts/cmg'),
                        detail: $rootScope.i18n('msg-error-upload', undefined, 'dts/cmg')
                    });
                });
            }
        }
        ;

        /* Função....: saveNew
			Descrição.: função disparado no clique do botão Salvar e novo
			Parâmetros: <não há>
		*/
        this.saveNew = function() {
            //console.log("impBankStatemEditCtrl", "function: saveNew");

            thisImpBankStatemEditCtrl.save(true);
        }
        ;

        /* Função....: redirectToBase
			Descrição.: Retorna a tela principal da rotina
			Parâmetros: <não há>
		*/
        this.redirectToBase = function() {
            //console.log("impBankStatemEditCtrl", "function: redirectToBase");

            $location.path('dts/cmg/importbankstatement/');
        }
        ;

        /* Função....: cancel
			Descrição.: Evento do botão Cancelar
			Parâmetros: <não há>
		*/
        this.cancel = function() {
            //console.log("impBankStatemEditCtrl", "function: cancel");

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: $rootScope.i18n('l-question', undefined, 'dts/cmg'),
                text: $rootScope.i18n('msg-question-cancel-operation', undefined, 'dts/cmg'),
                cancelLabel: $rootScope.i18n('l-no', undefined, 'dts/cmg'),
                confirmLabel: $rootScope.i18n('l-yes', undefined, 'dts/cmg'),
                callback: function(isPositiveResult) {
                    if (isPositiveResult) {
                        thisImpBankStatemEditCtrl.redirectToBase();
                    }
                }
            });
        }
        ;

        /* Função....: isInvalidForm
			Descrição.: Valida os campos do formulário
			Parâmetros: <não há>
		*/
        this.isInvalidForm = function() {
            //console.log("impBankStatemEditCtrl", "function: isInvalidForm");

            var messages = [], isInvalidForm = false, warning, countFiles;

            if (!thisImpBankStatemEditCtrl.model.des_regra_extrat || thisImpBankStatemEditCtrl.model.des_regra_extrat === "") {
                isInvalidForm = true;
                messages.push({
                    literal: 'l-description',
                    context: 'dts/cmg'
                });
            }

            if (!thisImpBankStatemEditCtrl.model.bank || thisImpBankStatemEditCtrl.model.bank.length === 0) {
                isInvalidForm = true;
                messages.push({
                    literal: 'l-bank',
                    context: 'dts/cmg'
                });
            }

            if (!thisImpBankStatemEditCtrl.model.listCheckingAcct || thisImpBankStatemEditCtrl.model.listCheckingAcct.length === 0) {
                isInvalidForm = true;
                messages.push({
                    literal: 'l-checking-account',
                    context: 'dts/cmg'
                });
            }

            if (!thisImpBankStatemEditCtrl.model.bankStatementLayout || thisImpBankStatemEditCtrl.model.bankStatementLayout.length === 0) {
                isInvalidForm = true;
                messages.push({
                    literal: 'l-stmnt-layout',
                    context: 'dts/cmg'
                });
            }

            if (thisImpBankStatemEditCtrl.model.log_upload) {

                countFiles = 0;
                angular.forEach(thisImpBankStatemEditCtrl.listFiles, function(file) {
                    if (!file.remove) {
                        countFiles++;
                    }
                });

                if (countFiles === 0) {
                    isInvalidForm = true;
                    messages.push({
                        literal: 'l-file',
                        context: 'dts/cmg'
                    });
                }

            } else {

                if (!thisImpBankStatemEditCtrl.model.dsl_arq_import || thisImpBankStatemEditCtrl.model.dsl_arq_import === "") {
                    isInvalidForm = true;
                    messages.push({
                        literal: 'l-file',
                        context: 'dts/cmg'
                    });
                }
            }

            // Se for invalido, monta e mostra a mensagem
            if (isInvalidForm) {

                warning = $rootScope.i18n('l-field', undefined, 'dts/utb') + ":";

                if (messages.length > 1) {
                    warning = $rootScope.i18n('l-fields', undefined, 'dts/utb') + ":";
                }

                angular.forEach(messages, function(item) {
                    warning = warning + ' ' + $rootScope.i18n(item.literal, undefined, item.context) + ', ';
                });

                if (messages.length > 1) {
                    warning = warning + ' ' + $rootScope.i18n('l-requireds', undefined, 'dts/utb');
                } else {
                    warning = warning + ' ' + $rootScope.i18n('l-required', undefined, 'dts/utb');
                }

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: $rootScope.i18n('l-attention', undefined, 'dts/cmg'),
                    detail: warning
                });
            }

            return isInvalidForm;
        }
        ;

        /* Função....: onClickFileRemove
			Descrição.: Remove o arquivo selecionado para Upload
			Parâmetros: <não há>
		*/
        this.onClickFileRemove = function(file) {
            //console.log("impBankStatemEditCtrl", "function: onClickFileRemove", file);

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: $rootScope.i18n('l-question', undefined, 'dts/cmg'),
                cancelLabel: $rootScope.i18n('l-no', undefined, 'dts/cmg'),
                confirmLabel: $rootScope.i18n('l-yes', undefined, 'dts/cmg'),
                text: $rootScope.i18n('msg-question-remove-selected-file', undefined, 'dts/cmg'),
                callback: function(isPositiveResult) {

                    if (isPositiveResult) {

                        var index = thisImpBankStatemEditCtrl.listFiles.indexOf(file)
                          , existFile = false;

                        if (index !== -1) {
                            if (file.status === 4) {
                                thisImpBankStatemEditCtrl.listFiles[index].remove = true;
                            } else {
                                thisImpBankStatemEditCtrl.listFiles.splice(index, 1);
                            }
                        }

                        angular.forEach(thisImpBankStatemEditCtrl.listFiles, function(file) {
                            if (!file.remove) {
                                existFile = true;
                            }
                        });

                        if (!existFile) {
                            thisImpBankStatemEditCtrl.removeAllFiles = true;
                        }
                    }
                }
            });
        }
        ;

        /* Função....: fileAlreadyExist
			Descrição.: evento que verifica se o arquivo selecionado já existe
			Parâmetros: fileName
		*/
        this.fileAlreadyExist = function(fileName) {

            var inList = false, j, fileUpload;

            for (j = 0; j < thisImpBankStatemEditCtrl.listFiles.length; j++) {

                fileUpload = thisImpBankStatemEditCtrl.listFiles[j];

                if (fileName === fileUpload.file.name && !fileUpload.remove) {

                    inList = true;

                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'warning',
                        title: $rootScope.i18n('l-file', undefined, 'dts/cmg') + ': ' + fileName,
                        detail: $rootScope.i18n('msg-file-already-informed', undefined, 'dts/cmg')
                    });

                    break;
                }
            }

            return inList;

        }
        ;

        /* Função....: onChangeUpload
			Descrição.: evento de ng-change do botão Selecionar arquivo...
			Parâmetros: $files, onProgress
		*/
        this.onChangeUpload = function($files, onProgress) {
            //console.log('impBankStatemEditCtrl', 'function: onChangeUpload', $files, onProgress);

            var i, file;

            if ($files.length < 1) {
                return;
            }

            for (i = 0; i < $files.length; i++) {

                file = $files[i];

                if (!thisImpBankStatemEditCtrl.fileAlreadyExist(file.name)) {

                    /* Cria objeto arquivo com status 0 (Em espera) */
                    thisImpBankStatemEditCtrl.listFiles.unshift({
                        file: file,
                        seq: 0,
                        status: 0,
                        progress: '0%',
                        exist: false
                    });

                    thisImpBankStatemEditCtrl.removeAllFiles = false;
                }
            }
        }
        ;

        /* Função....: onChangeIsUpload
			Descrição.: evento de ng-change do checkbox Upload
			Parâmetros: <não há>
		*/
        this.onChangeIsUpload = function() {
            //console.log('impBankStatemEditCtrl', 'function: onChangeIsUpload');

            if (thisImpBankStatemEditCtrl.model.log_upload) {
                thisImpBankStatemEditCtrl.model.dsl_arq_import = undefined;
            }
        }
        ;

        /* Função....: onChangeIsTransfer
			Descrição.: evento de ng-change do checkbox Transfere
			Parâmetros: <não há>
		*/
        this.onChangeIsTransfer = function() {
            //console.log('impBankStatemEditCtrl', 'function: onChangeIsTransfer');

            if (!thisImpBankStatemEditCtrl.model.log_transf_arq) {
                thisImpBankStatemEditCtrl.model.dsl_dir_transf = undefined;
            }

        }
        ;

        /* Função....: load
			Descrição.: responsável por buscar/apresentar os dados do registro a ser alterado
			Parâmetros: id
		*/
        this.load = function(id) {
            //console.log('impBankStatemEditCtrl', 'function: load', id);

            thisImpBankStatemEditCtrl.model = {};
            thisImpBankStatemEditCtrl.listFiles = [];

            importbankstatementFactory.getUserRule(id, function(result) {
                //console.log('impBankStatemEditCtrl', 'function: getUserRule', result);

                if ((result && result.$hasError) || result.length === 0) {
                    thisImpBankStatemEditCtrl.loadDefaults();
                    return;
                }

                thisImpBankStatemEditCtrl.model.num_id_regra_extrat = id;

                thisImpBankStatemEditCtrl.ruleUpdate = result[0];
                thisImpBankStatemEditCtrl.isUpdate = true;

                var bank = thisImpBankStatemEditCtrl.ruleUpdate.ttBank[0]
                  , bankStatementLayout = thisImpBankStatemEditCtrl.ruleUpdate.ttBankStatementLayout[0];

                thisImpBankStatemEditCtrl.model.bank = bank;
                thisImpBankStatemEditCtrl.model.bankStatementLayout = bankStatementLayout;
                thisImpBankStatemEditCtrl.model.des_regra_extrat = thisImpBankStatemEditCtrl.ruleUpdate.des_regra_extrat;
                thisImpBankStatemEditCtrl.model.log_transf_arq = thisImpBankStatemEditCtrl.ruleUpdate.log_transf_arq;
                thisImpBankStatemEditCtrl.model.dsl_dir_transf = thisImpBankStatemEditCtrl.ruleUpdate.dsl_dir_transf;
                thisImpBankStatemEditCtrl.model.log_upload = thisImpBankStatemEditCtrl.ruleUpdate.log_upload;

                if (thisImpBankStatemEditCtrl.model.log_upload) {

                    thisImpBankStatemEditCtrl.listFiles = [];
                    angular.forEach(thisImpBankStatemEditCtrl.ruleUpdate.ttFileRuleBankStmnt, function(fileRuleBankStmnt) {

                        thisImpBankStatemEditCtrl.listFiles.unshift({
                            file: {
                                name: fileRuleBankStmnt.nom_arq_regra,
                                size: fileRuleBankStmnt.val_tam_arq,
                                lastModifiedDate: fileRuleBankStmnt.dat_ult_alter
                            },
                            seq: fileRuleBankStmnt.num_seq_arq_regra,
                            status: 4,
                            progress: '100%',
                            exist: true,
                            urlDownload: '/dts/datasul-rest/resources/api/fch/fchcmg/importbankstatement/download/' + fileRuleBankStmnt.num_id_regra_extrat + '/' + fileRuleBankStmnt.num_seq_arq_regra
                        });
                    });
                } else {

                    thisImpBankStatemEditCtrl.model.dsl_arq_import = thisImpBankStatemEditCtrl.ruleUpdate.dsl_arq_import;

                }
            });
        }
        ;

        /* Função....: loadDefaults
			Descrição.: efetua tratamentos padrões para abertura da tela (Inclusão)
			Parâmetros: <não há>
		*/
        this.loadDefaults = function() {
            //console.log('impBankStatemEditCtrl', 'function: loadDefaults');

            thisImpBankStatemEditCtrl.model = {};
            thisImpBankStatemEditCtrl.listFiles = [];

        }
        ;

        /* Função....: init
			Descrição.: responsável por inicializar o controller principal
			Parâmetros: <não há>
		*/
        this.init = function() {
            //console.log('impBankStatemEditCtrl', 'function: init', $stateParams);

            var id;

            appViewService.startView($rootScope.i18n('l-import-bank-statement', undefined, 'dts/cmg'), 'cmg.importbankstatement.EditCtrl', thisImpBankStatemEditCtrl);

            // Se houver parametros na URL (Alteração)
            if ($stateParams && $stateParams.id) {
                id = parseInt($stateParams.id, 10);
            }

            if (id && !isNaN(id)) {

                thisImpBankStatemEditCtrl.load(id);

            } else {
                // (Inclusão)

                thisImpBankStatemEditCtrl.loadDefaults();

            }
        }
        ;

        /*####################################### Principal ########################################*/

        if ($rootScope.currentuserLoaded) {
            thisImpBankStatemEditCtrl.init();
        }

        $scope.$on(TOTVSEvent.rootScopeInitialize, function() {
            thisImpBankStatemEditCtrl.init();
        });

        /*##########################################################################################*/

    }

    ImpBankStatemEditCtrl.$inject = ['$rootScope', '$scope', '$stateParams', '$window', '$location', '$filter', 'totvs.app-main-view.Service', 'customization.generic.Factory', 'cmg.utils.Service', 'utb.utils.Service', 'cmg.cta-corren.zoom', /* Zoom Conta Corrente (cta_corren) */
    'cmg.banco.zoom', /* Zoom Banco (banco) */
    'cmg.layout-extrat.zoom', /* Zoom Layout Extrato (layout_extrat) */
    'cmg.cmg900wc.Factory', /* DBO Layout Extrato (layout_extrat) */
    'cmg.importbankstatement.Factory', 'TOTVSEvent'];

    index.register.controller('cmg.importbankstatement.EditCtrl', ImpBankStatemEditCtrl);

});
