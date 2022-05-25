/**
 * Permite que uma parte da tela seja redimencionada automaticamente conforme o tamanho do browser
 */
define(['index'], function (index, lodash) {

	'use strict';


    function resizeService($timeout, $window) {

        var service = {
            doResize: function () {
                $timeout(function () {
                    $(window).resize();
                },50);
            },
            resize: function (selector) {
                var element = $(selector);

                var scope = angular.element(element).scope();

                var wrapper = element.parents('div.page-wrapper');
                var parent = element.parent();

                wrapper.css('min-height', '100%');
                
                var doResize = function () {

                    // não deve ser chamado se o grid não estiver na tela.
                    // se necessário chamar manualmente: $(window).trigger("resize");
                    if (!$(element).is(":visible")) return;

                    var scroll = 0;
                    
                    $(element).parents().each(function () {
                        if (this.scrollHeight == this.clientHeight) return;
                        if (this.clientHeight == 0) return;
                        scroll = scroll + this.scrollHeight - this.clientHeight;
                    })

                    var size = wrapper.height() + element.height() - scroll;

                    wrapper.children().each(function () {
                        size = size - $(this).height();
                    });

                    size = size < 200 ? 200 : size;

                    if (size < 40) return;

                    element.height(size - 1); // não sei de onde vem esse 1!!?!?!?!?!

                };

                var resizeEvent = function () {
                    
                    $timeout(function () {
                        doResize();

                        // faz a segunda vez por causa do IE.
                        // o IE so dispara  no resize da janela fisica, o chrome e FF
                        // disparam quando o conteudo da janela tem resize (inclui quando
                        // os parametros de scrool mudam)
                        if ($window.navigator.userAgent.indexOf("MSIE") > 0
                        || $window.navigator.userAgent.indexOf("Trident") > 0) {
                            doResize();

                        }
                    });
                };

                // adiciona listener para redimencionar quando a window for redimensionada
                $(window).on('resize',resizeEvent);

                // remove o listener para evitar memory leak.
                scope.$on('$destroy', function () {
                    $(window).off('resize', resizeEvent);
                });

                $timeout(function () {
                    resizeEvent();
                },50);
                
            }
        }

        return service;
        
    }

    resizeService.$inject = ['$timeout','$window'];
    index.register.service('dts-utils.Resize.Service', resizeService);

});

