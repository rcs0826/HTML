(function () {
    'use strict';

    var gpsTotvsScheduleConstant = {
        time: {
            pt: 'Tempo',
            en: 'Time',
            es: 'Tiempo'
        },
        and: {
            pt: 'e',
            en: 'and',
            es: 'y'
        },
        dateExecution: {
            pt: 'Data de execução',
            en: 'Date execution',
            es: 'Fecha de ejecución'
        },
        executionToday: {
            pt: 'Executar hoje',
            en: 'Execute today',
            es: 'Correr hoy'
        },
        repeatOccurrence: {
            pt: 'Repetir ocorrência',
            en: 'Repeat occurrence',
            es: 'Repita ocurrencia'
        },
        autoSchedule:{
            pt: 'Utiliza Agenda Automática?',
            en: 'Uses Automatic Schedule?',
            es: '¿Utiliza Agenda Automática?'
        },
        scheduleTheExecution: {
            pt: 'Agendar execução',
            en: 'Scheduler execution',
            es: 'Programa en ejecución'
        },
        scheduleTo: {
            pt: 'Agendar para',
            en: 'Schedule for',
            es: 'Calendario de'
        },
        configuration: {
            pt: 'Configuração',
            en: 'Configuration',
            es: 'Configuración'
        },
        repeatEveryDays: {
            pt: 'Repita todo dia',
            en: 'Repeat every days',
            es: 'Repita todos los días'
        },

        repeatEveryXDays: {
            pt: 'Repita a cada {x} dias',
            en: 'Repeat every {x} days',
            es: 'Repetir cada {x} días'
        },
        repeatEveryWeeks: {
            pt: 'Repita toda semana',
            en: 'Repeat every weeks',
            es: 'Repite cada semana'
        },
        repeatEveryXWeeks: {
            pt: 'Repita a cada {x} semanas',
            en: 'Repeat every {x} weeks',
            es: 'Repetir cada {x} semanas'
        },
        repeatEveryMonths: {
            pt: 'Repita a cada mês',
            en: 'Repeat every month',
            es: 'Repetir cada mes'
        },
        repeatEveryXMonths: {
            pt: 'Repita a cada {x} meses',
            en: 'Repeat every {x} months',
            es: 'Repetir cada {x} meses'
        },

        lastDayEachMonth: {
            pt: 'Último dia de cada mês.',
            en: 'Last day each month.',
            es: 'Ultimo dia de cada mes.'
        },
        onDayOfEachMonthX: {
            pt: 'No {x}º dia de cada mês.',
            en: 'On {x}º day of each month.',
            es: 'El {x}º día de cada mes.'
        },
        prepAt: {
            pt: 'às',
            en: 'at',
            es: 'las'
        },
        prepOnM: {
            pt: 'Nos',
            en: 'At',
            es: 'En'
        },
        prepOnF: {
            pt: 'Nas',
            en: 'At',
            es: 'En'
        },
        dayMondays: {
            pt: 'segundas',
            en: 'modays',
            es: 'los lunes'
        },
        dayMondaySingle: {
            pt: 'Segunda',
            en: 'Moday',
            es: 'Lunes'
        },
        dayWednesdays: {
            pt: 'quartas',
            en: 'wednesdays',
            es: 'miércoles'
        },
        dayFridays: {
            pt: 'sextas',
            en: 'fridays',
            es: 'los viernes'
        },
        forever: {
            pt: 'Para sempre',
            en: 'Forever',
            es: 'Para siempre'
        },
        finishIn: {
            pt: 'Terminar em {x}.',
            en: 'Finish in {x}.',
            es: 'Finalizar en {x}.'
        },
        repeatEvery: {
            pt: 'Repete a cada',
            en: 'Repeat every',
            es: 'Se repite cada'
        },
        daySunday: {
            pt: 'Domingo',
            en: 'Sunday',
            es: 'Domingo'
        },
        daySundays: {
            pt: 'domingos',
            en: 'sundays',
            es: 'domingos'
        },
        dayTuesdaySingle: {
            pt: 'Terça',
            en: 'Tuesday',
            es: 'Tercera'
        },
        dayTuesdays: {
            pt: 'terças',
            en: 'tuesday',
            es: 'martes'
        },
        dayWednesdaySingle: {
            pt: 'Quarta',
            en: 'Wednesday',
            es: 'Cuarto'
        },
        dayThursdaySingle: {
            pt: 'Quinta',
            en: 'Thursday',
            es: 'Granja'
        },
        dayThursdays: {
            pt: 'quintas',
            en: 'thursdays',
            es: 'jueves'
        },
        dayFridaySingle: {
            pt: 'Sexta',
            en: 'Friday',
            es: 'Viernes'
        },
        daySaturday: {
            pt: 'Sabádo',
            en: 'Saturday',
            es: 'Sabádo'
        },
        daySaturdays: {
            pt: 'sabádos',
            en: 'saturday',
            es: 'sabádos'
        },
        week: {
            pt: 'semana',
            en: 'week',
            es: 'semana'
        },
        repeatPattern: {
            pt: 'Padrão de repetição',
            en: 'Repeat pattern',
            es: 'Patrón de repetición'
        },
        repeatDaily: {
            pt: 'Diária',
            en: 'Daily',
            es: 'Tasa diaria'
        },
        repeatWeekly: {
            pt: 'Semanal',
            en: 'Weekly',
            es: 'Semanal'
        },
        repeatMonthly: {
            pt: 'Mensal',
            en: 'Monthly',
            es: 'mensual'
        },
        weeks: {
            pt: 'semanas',
            en: 'weeks',
            es: 'semana'
        },
        day: {
            pt: 'dia',
            en: 'day',
            es: 'día'
        },
        days: {
            pt: 'dias',
            en: 'days',
            es: 'días'
        },
        month: {
            pt: 'mês',
            en: 'month',
            es: 'meses'
        },
        months: {
            pt: 'meses',
            en: 'months',
            es: 'mes'
        },
        untilToDate: {
            pt: 'Até a data',
            en: 'Until to date',
            es: 'hasta la fecha'
        },
        dayOfTheMonth: {
            pt: 'Dia do mês',
            en: 'Day of the month',
            es: 'Día del mes'
        },
        execute: {
            pt: 'Executar',
            en: 'Execute',
            es: 'Ejecutar'
        },
        alwaysOn: {
            pt: 'Sempre no',
            en: 'Always on',
            es: 'Siempre'
        },
        lastDayOfTheMonth: {
            pt: 'Último dia do mês',
            en: 'Last day of the month',
            es: 'Último día del mes'
        },
        btnCancel: {
            pt: 'Cancelar',
            en: 'Cancel',
            es: 'Cancelar'
        },
        btnEdit: {
            pt: 'Editar',
            en: 'Edit',
            es: 'Editar'
        },
        btnSave: {
            pt: 'Salvar',
            en: 'Save',
            es: 'Guardar'
        },
        msgSelectTimeExecutions: {
            pt: 'Selecione Execuções de tempo',
            en: 'Select Time Executions',
            es: 'Seleccione Ejecuciones de tiempo'
        },
        msgSelectLeastOneDayForExecutions: {
            pt: 'Selecione pelo um dia para execuções',
            en: 'Select Least One Day For Executions',
            es: 'Seleccione por un día para las ejecuciones'
        },
        msgSelectDateEndExecutions: {
            pt: 'Selecione as execuções finais da data',
            en: 'Select Least One Day For Executions',
            es: 'Seleccionar ejecuciones finales de fecha'
        },
        msgSelectDateGreaterThanCurrentDateEndExecutions: {
            pt: 'Selecione a data maior que as execuções finais da data final',
            en: 'Select date greater than current date end executions',
            es: 'Seleccione fecha mayor que las ejecuciones finales de fecha actual'
        }
    };

    angular.module('gpsTotvsSchedule', [])
        .constant('gpsTotvsScheduleConstant', gpsTotvsScheduleConstant);

}());



define(['index', 
        '/dts/hgp/html/global/sharedGlobalFactory.js',
       ],function (index) {

    angular
        .module('gpsTotvsSchedule')
        .directive('gpsTotvsSchedule', gpsTotvsSchedule);
           

    gpsTotvsSchedule.$inject = ['$rootScope', '$modal', '$filter', 'TotvsKendoCulture',
        'gpsTotvsScheduleConstant','totvs.utils.Service', '$compile', 'shared.global.Factory'];

    function gpsTotvsSchedule($rootScope, $modal, $filter, TotvsKendoCulture, gpsTotvsScheduleConstant,
         totvsUtils, compile, sharedGlobalFactory) {

        var translations = totvsUtils.configI18n(gpsTotvsScheduleConstant),

            template =
                '<div class="schedule-panel form-inline row container">' +

                    '<field type="checkbox" class="col-md-3" ng-model="config.repeat" ' +
                            'ng-change="changeRepeat()" ng-disabled = "config.autoSchedule" ng-if="hideRepeat !== \'true\'">' +
                        '<label>' + translations.repeatOccurrence + '</label>' +
                    '</field>' +

                    '<field type="checkbox" class="col-md-3" ng-model="config.autoSchedule" ng-disabled = "config.canAutoSchedule"' +
                            'ng-change="changeAutoSchedule()" ng-if="hideSchedule !== \'true\'">' +
                        '<label>' + translations.autoSchedule + '</label>' +
                    '</field>' +
                '</div>';


            var templateModal =
                '<totvs-modal-header>' + translations.repeatOccurrence + '</totvs-modal-header>' +
                '<totvs-modal-body>' +
                    '<div class="row">' +
                        '<field type="radio" class="container" ng-model="scheduleController.config.repeatType" ' +
                                'label="' + translations.repeatPattern + '" ' +
                                'ng-change="scheduleController.changeRepeatCycle(' +
                                    'scheduleController.config.repeatType, true)">' +
                            '<totvs-options>' +
                                '<totvs-option value="D">' + translations.repeatDaily + '</totvs-option>' +
                                '<totvs-option value="W">' + translations.repeatWeekly + '</totvs-option>' +
                                '<totvs-option value="M">' + translations.repeatMonthly + '</totvs-option>' +
                            '</totvs-options>' +
                        '</field>' +

                        '<field type="combo" class="col-md-6" ng-model="scheduleController.config.repeatCycle" ' +
                            'label="' + translations.repeatEvery + '" ' +
                            'ng-options="item.index as item.description ' +
                                'for item in scheduleController.repeatCycleItems">' +
                        '</field>' +

                        '<field type="time" class="col-md-6" ng-model="scheduleController.config.repeatTime" ' +
                            'label="' + translations.time + '"></field>' +

                        '<div class="field-container" ' +
                            'ng-if="scheduleController.config.repeatType === \'W\'">' +
                            '<div class="seven-cols">' +
                                '<field type="checkbox" class="col-md-1" ' +
                                    'label="' + translations.daySunday + '" ' +
                                    'ng-model="scheduleController.config.repeatWeekDays.sunday"></field>' +
                                '<field type="checkbox" class="col-md-1" ' +
                                    'label="' + translations.dayMondaySingle + '"' +
                                    'ng-model="scheduleController.config.repeatWeekDays.monday"></field>' +
                                '<field type="checkbox" class="col-md-1" ' +
                                    'label="' + translations.dayTuesdaySingle + '"' +
                                    'ng-model="scheduleController.config.repeatWeekDays.tuesday"></field>' +
                                '<field type="checkbox" class="col-md-1" ' +
                                    'label="' + translations.dayWednesdaySingle + '"' +
                                    'ng-model="scheduleController.config.repeatWeekDays.wednesday"></field>' +
                                '<field type="checkbox" class="col-md-1" ' +
                                    'label="' + translations.dayThursdaySingle + '"' +
                                    'ng-model="scheduleController.config.repeatWeekDays.thursday"></field>' +
                                '<field type="checkbox" class="col-md-1" ' +
                                    'label="' + translations.dayFridaySingle + '"' +
                                    'ng-model="scheduleController.config.repeatWeekDays.friday"></field>' +
                                '<field type="checkbox" class="col-md-1" ' +
                                    'label="' + translations.daySaturday + '"' +
                                    'ng-model="scheduleController.config.repeatWeekDays.saturday"></field>' +
                            '</div>' +
                        '</div>' +

                        '<div ng-if="scheduleController.config.repeatType === \'M\'">' +
                            '<field type="radio" class="col-md-3" label="' + translations.alwaysOn + '" ' +
                                'ng-model="scheduleController.config.repeatMonthDay.last">' +
                                '<totvs-options>' +
                                    '<totvs-option value=false>' + translations.dayOfTheMonth + '' +
                                    '</totvs-option>' +
                                '</totvs-options>' +
                            '</field>' +
                            '<field type="combo" class="col-md-3" ' +
                                'ng-model="scheduleController.config.repeatMonthDay.day" ' +
                                'ng-disabled="scheduleController.config.repeatMonthDay.last === \'true\'"  ' +
                                'ng-options="item for item in ' +
                                    '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,' +
                                    '16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]">' +
                                '<label>&nbsp;</label>' +
                            '</field>' +
                            '<field type="radio" class="col-md-6" ' +
                                'ng-model="scheduleController.config.repeatMonthDay.last">' +
                                '<label>&nbsp;</label>' +
                                '<totvs-options>' +
                                    '<totvs-option value=true>' + translations.lastDayOfTheMonth + '' +
                                    '</totvs-option>' +
                                '</totvs-options>' +
                            '</field>' +
                        '</div>' +


                        '<field type="date" class="col-md-6" ng-model="scheduleController.config.repeatFinishDate" ' +
                            ' canclean>' +
                            '<label>Até o dia:</label>' +
                        '</field>' +
                    '</div>' +
                '</totvs-modal-body>' +

                '<totvs-modal-footer>' +
                    '<button type="button" class="btn btn-default" data-ng-click="scheduleController.close();">' +
                        '' + translations.btnCancel + '</button>' +
                    '<button type="button" class="btn btn-primary" data-ng-click="scheduleController.save();">' +
                        '' + translations.btnSave + '</button>' +
                '</totvs-modal-footer>',
                directive = {
                    restrict: 'E',
                    require: 'ng-model',
                    replace: true,
                    transclude: false,
                    scope: {
                        hideRepeat: '@',
                        programName: '@'
                    },
                    link: link
                };

        return directive;

        function link (scope, element, attrs, ngModel) {
            
            var today = new Date();


            /* função que chama o método do factory SHARED GLOBAL para buscar os dados no progress */
            sharedGlobalFactory.getFoundationAutoSchedule(scope.programName,
                function (result) {
                    scope.config.canAutoSchedule = !result[0].logPermissao;   
                    scope.config.autoScheduleDate = new Date(result[0].datProxExec).toString('dd/MM/yyyy');
                    scope.config.autoScheduleTime = result[0].horProxExec;
            })

            // ******************************************************
            // Manipulação do ng-model
            // ******************************************************

            // Inicia a diretiva com valores passados pelo controller
            ngModel.$render = ngModelRender;

            scope.properties = {};

            // Atualiza o ngModel a cada alteração
            scope.$watch('config', watchConfig, true);

            // ******************************************************
            // Modal de configuração
            // ******************************************************


            scope.changeRepeat = changeRepeat;

            scope.changeConfig = changeConfig;

            element.append(template);

            var scheduleTemplate = element.find('div.schedule-panel');

            compile(scheduleTemplate)(scope);

            // ******************************************************
            // Functions
            // ******************************************************

            function ngModelRender() {
                /*jshint maxcomplexity:20 */

                if (!ngModel.$viewValue) {
                    ngModel.$viewValue = {};
                }
                scope.config = {
                    type: ngModel.$viewValue.type || 'TODAY',
                    repeat: ngModel.$viewValue.repeat || false,
                    repeatType: ngModel.$viewValue.repeatType || 'D',
                    repeatTime: ngModel.$viewValue.repeatTime || '00:00',
                    repeatCycle: ngModel.$viewValue.repeatCycle || 1,
                    repeatWeekDays: ngModel.$viewValue.repeatWeekDays || {},
                    repeatMonthDay: ngModel.$viewValue.repeatMonthDay || {'day': 1, last: 'false'},
                    repeatFinish: ngModel.$viewValue.repeatForever || 'FOREVER',
                    repeatFinishDate: ngModel.$viewValue.repeatFinishDate || today,
                    autoSchedule: ngModel.$viewValue.autoSchedule || false,
                    autoScheduleDate: new Date(),
                    autoScheduleTime: "00:00"
                };
            }
 
            function watchConfig(config) {
                ngModel.$setViewValue({
                    repeat: config.repeat,
                    repeatType: config.repeatType,
                    repeatTime: config.repeatTime,
                    repeatCycle: config.repeatCycle,
                    repeatWeekDays: config.repeatWeekDays,
                    repeatMonthDay: config.repeatMonthDay,
                    repeatFinish: config.repeatFinish,
                    repeatFinishDate: config.repeatFinishDate,
                    autoSchedule: config.autoSchedule,
                    autoScheduleDate: config.autoScheduleDate,
                    autoScheduleTime: config.autoScheduleTime
                });

                fnUpdateDescription(scope.config);
            }


            function changeRepeat() {
                if (scope.config.repeat === true) {
                    scope.changeConfig(true);
                } else {
                    scope.config.repeatType = 'D';
                    scope.config.repeatTime = undefined;
                    scope.config.repeatCycle = 1;
                    scope.config.repeatWeekDays = {};
                    scope.config.repeatMonthDay = {'day': 1, last: 'false'};
                    scope.config.repeatFinish = 'FOREVER';
                    scope.config.repeatFinishDate = today;
                    scope.config.autoSchedule = false;
                }
            }

            function changeAutoSchedule(){

                if (scope.config.autoSchedule == true){

                }

                scope.changeConfig(true);

            }

            function changeConfig(reload) {
                var configModalInstance,
                    cloneConfig,
                    cloneTranslations;

                configModalInstance = $modal.open({
                    template: templateModal,
                    controller: 'TotvsScheduleController as scheduleController',
                    size: 'md',
                    resolve: {
                        config: function () {
                            // passa o objeto com os dados da pesquisa avançada para o modal
                            cloneConfig = angular.copy(scope.config);

                            return cloneConfig;
                        },
                        translations: function () {
                            // passa o objeto com os dados da pesquisa avançada para o modal
                            cloneTranslations = angular.copy(translations);

                            return cloneTranslations;
                        }
                    }
                });

                configModalInstance.result.then(function () {
                    scope.config = angular.copy(cloneConfig);
                }, function () {
                    if (reload) {
                        scope.config.repeat = false;
                    }
                });
            }

            function fnUpdateDescription (config) {

                if (!config.repeat) {
                    scope.description = undefined;
                    return;
                }

                scope.description =
                    fnDescriptionType() +
                    fnDescriptionTime() +
                    fnDescriptionDay() + ' ' +
                    fnDescriptionFinish();

                function fnDescriptionType() {
                    switch (config.repeatType) {
                        case 'D':
                            return config.repeatCycle === 1 ? translations.repeatEveryDays :
                                translations.repeatEveryXDays.replace('{x}', config.repeatCycle);
                        case 'W':
                            return config.repeatCycle === 1 ? translations.repeatEveryWeeks :
                                    translations.repeatEveryXWeeks.replace('{x}', config.repeatCycle);
                        case 'M':
                            return config.repeatCycle === 1 ? translations.repeatEveryMonths :
                                    translations.repeatEveryXMonths.replace('{x}', config.repeatCycle);
                        default:
                            return '';
                    }
                }

                function fnDescriptionTime() {
                    if (config.repeatTime) {
                        return ' ' + translations.prepAt + ' ' + config.repeatTime + '. ';
                    } else {
                        return '. ';
                    }
                }

                function validateBusinessDays(businessDays, daysOfWeek, description) {
                    if (businessDays) {
                        daysOfWeek += (!daysOfWeek ? translations.prepOnF + ' ' : ', ') +
                            description;
                    }
                    return daysOfWeek;
                }

                function fnDescriptionDay() {
                    var daysOfWeek = '',
                        index;

                    if (config.repeatType === 'W') {

                        if (!config.repeatWeekDays) {
                            return '';
                        }

                        if (config.repeatWeekDays.sunday) {
                            daysOfWeek = translations.prepOnM + ' ' + translations.daySundays;
                        }

                        daysOfWeek = validateBusinessDays(config.repeatWeekDays.monday, daysOfWeek,
                            translations.dayMondays);
                        daysOfWeek = validateBusinessDays(config.repeatWeekDays.tuesday, daysOfWeek,
                            translations.dayTuesdays);
                        daysOfWeek = validateBusinessDays(config.repeatWeekDays.wednesday, daysOfWeek,
                            translations.dayWednesdays);
                        daysOfWeek = validateBusinessDays(config.repeatWeekDays.thursday, daysOfWeek,
                            translations.dayThursdays);
                        daysOfWeek = validateBusinessDays(config.repeatWeekDays.friday, daysOfWeek,
                            translations.dayFridays);

                        if (config.repeatWeekDays.saturday) {
                            daysOfWeek += (!daysOfWeek ? translations.prepOnM + ' ' : ', ') +
                                translations.daySaturdays;
                        }

                        // Procura a última ',' para substituir por um 'e'
                        index = daysOfWeek.lastIndexOf(',');

                        return daysOfWeek.slice(0, index) +
                            daysOfWeek.slice(index).replace(',', ' ' + translations.and) + '. ';

                    } else if (config.repeatType === 'M') {
                        if (config.repeatMonthDay.last === 'true') {
                            return translations.lastDayEachMonth;
                        } else {
                            return translations.onDayOfEachMonthX.replace('{x}', config.repeatMonthDay.day);
                        }
                    } else {
                        return '';
                    }
                }

                function fnDescriptionFinish() {
                    if (config.repeatFinish === 'FOREVER') {
                        return translations.forever + '. ';
                    } else {
                        return translations.finishIn.
                                    replace('{x}', $filter('date')(config.repeatFinishDate, 'dd/MM/yyyy'));
                    }
                }

            }
        }
    }

}());

