/**
 * Integração do Lodash (https://lodash.com/) com Angular no THF
 */
define(['index', '/dts/dts-utils/js/lodash.js'], function (index, lodash) {

	'use strict';

    /**
     * Disponibiliza a referencia do lodash para o Angular atraves de uma constante, 
     * permite utilizar as funções do Lodash em controllers, diretivas, etc... 
     */
    index.register.constant('lodash', lodash);


    /**
     * diretiva totvsLodashTemplate
     * 
     * Permite que um template seja pré-processado pelo lodash antes de ser incluido no DOM e
     * tratado pelo Angular.
     * A ideia é permitir que trechos do template só sejam considerados baseado em uma logica.
     * Por exemplo: controle de acesso.
     * Podemos ter varios campos no template, mas podemos tirar estes campos antes do Angular
     * fazer os bindings e watchers, ou troca-los de ordem baseado no negócio.
     * 
     * Atributos da TAG <totvs-lodash-template>:
     * - src = endereço do template que será carregado, processado, adicionado no DOM e 
     *         compilado pelo angular.  
     * - template-data = objeto que será passado para a função gerada pelo lodash a
     *         partir da template.
     * 
     * Obs: src é opcional, se não for passado, o conteudo da tag será utilizado como template.
     */
	index.register.directive('totvsLodashTemplate', ['lodash', '$compile', '$templateRequest', '$rootScope', 
    function (lodash, $compile, $templateRequest, $rootScope) {
        return {
            restrict: 'E',
            priority: -400, // a priority garante que será executado antes do angular compilar 
                            // outras diretivas
            compile: function (element, attrs) {
                // busca o template do conteudo da diretiva e elimina do DOM.
                var template = element.html();
                element.empty();

                return function (scope, element, attrs) {

                    var templatefn;

                    // funcão para renderizar a template na tela
                    var renderFn = function(value) {
                        if (templatefn && value != undefined) {
                            var html = templatefn({data: value});
                            element.html(html);
                            $(element).hide(); // evitar flicker durante a compilação do HTML
                            $compile(element.contents())(scope);
                            $(element).show();
							$rootScope.$emit('afterCompileLodashTemplate', attrs.src);
                        }
                    }

                    // se tiver SRC, irá utilizar o $templateRequest para buscar o conteudo da template 
                    if (attrs.src) {
                        $templateRequest(attrs.src, true).then(function (response) {
                            templatefn = lodash.template(response);
                            scope.$watch(attrs.templateData, function (value) {
                                renderFn(value);
                            })
                        });
                    } else {
                        // quando o template vem do conteudo da diretiva, o innerHTML faz 'escape' de alguns caracteres
                        // é o caso do < e > que viram &lt; e &gt; 
                        var options = {
                            evaluate    : /&lt;%([\s\S]+?)%&gt;/g,
                            interpolate : /&lt;%=([\s\S]+?)%&gt;/g,
                            escape      : /&lt;%-([\s\S]+?)%&gt;/g 
                        }
                        templatefn = lodash.template(template,options);
                        scope.$watch(attrs.templateData, function (value) {
                            renderFn(value);
                        })
                    }

                }
            }
        }

    }]);

});


/*

<totvs-page-detail-info-group>Teste 1</totvs-page-detail-info-group>
<totvs-lodash-template template-data="'Teste de template com template in-line'">

	TESTE com template - <%= data  %> - TESTE
	
</totvs-lodash-template>

<totvs-page-detail-info-group>Teste 2</totvs-page-detail-info-group>


<totvs-lodash-template src="/dts/html/teste.tmpl" template-data="'Teste de template com template externo'"></totvs-lodash-template>




 */ 
