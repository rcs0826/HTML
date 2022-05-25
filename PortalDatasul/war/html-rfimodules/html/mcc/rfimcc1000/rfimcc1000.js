/******************************************************************************* */
/* A estrutura do RFI é diferente entre o framework novo e o 
   antigo sendo necessário o tratamento abaixo. 
   IMPORTANTE: Cada programa RFI criado deve conter essas definições, pois no 
   framework antigo esse será o primeiro JS executado visto que, na integração 
   contínua há uma rotina que copia o conteúdo de html-rfimodules/html(NovoFrame) para 
   a pasta datasul-rfi/modules (Antigo) afim de manter um único fonte. */

//lNewFrame: identifica se é NovoFrame ou não com base na URL
var lNewFrame = (window.location.href.indexOf('datasul-rfi') <= 0);
//rfiRestDir: Caminho base para os serviços REST do RFI
var rfiRestDir = (lNewFrame) ? '/dts/datasul-rest' : '/datasul-rfi';
//rfiBaseDir: Caminho físico da estrutura do RFI
var rfiBaseDir = (lNewFrame) ? '/dts/rfimodules/html' : '/datasul-rfi/modules';
//rfiBaseUrl: URL para acessar os programas do RFI
var rfiBaseUrl = (lNewFrame) ? '/dts/rfimodules' : '/datasul-rfi';
//i18nContext: Caminho do arquivo de tradução que deve ser utilizado. 
//Obs.: No Frame Antigo o arquivo é buscado automaticamente na estrutura criada.
//As literais foram cadastradas no módulo RFIMCC.
var i18nContext = (lNewFrame) ?'dts/rfimodules/html/mcc':'';
/****************************************************************************** */

/*globals index, define */
define([
    'index',
	rfiBaseDir + '/mcc/i18n/translations.js',
	rfiBaseDir + '/mcc/rfimcc1000/home/rfi.home.ctrl.js',
	rfiBaseDir + '/mcc/rfimcc1000/answer/rfi.answer.ctrl.js',
	rfiBaseDir + '/mcc/rfimcc1000/quotation/rfi.view.ctrl.js',
	rfiBaseDir + '/mcc/rfimcc1000/finished/rfi.finished.ctrl.js'
], function (index) {
    
	index.stateProvider
	// Estado pai, a hierarquia de states é feita através do '.', e todo estado novo
    // tem que ter um estado pai, que nesse caso é abstrato. Este status precisa
    // apenas de uma template com o elemento <ui-view> para conter os estados filhos.
	.state('rfi/mcc/rfimcc1000', {
		abstract: true,
		template: '<ui-view/>'
	})
	
	// Estado inicial da tela deve ser o estado pai com o sufixo '.start' este estado
	// será ativado automaticamente quando a tela for carregada.
	//
	// A URL deve ser compatível com a tela inicial.
	//
	// No estado também definimos o controller usado na template do estado, e definimos
	// o nome do controller em 'controllerAs' para ser utilizado na view.
	// também definimos a template ou templateUrl com o HTML da tela da view.
	.state('rfi/mcc/rfimcc1000.start', {
		url: (rfiBaseUrl + '/mcc/rfimcc1000?guid'),
		controller: 'rfi.mcc.home.ctrl',
		controllerAs: 'controller',
		templateUrl: (rfiBaseDir + '/mcc/rfimcc1000/home/rfi.home.html')
	})
	.state('rfi/mcc/rfimcc1000.answer', {
		url: (rfiBaseUrl +'/mcc/rfimcc1000/answer/:client/:guid'),
		controller: 'rfi.mcc.answer.ctrl',
		controllerAs: 'controller',
		templateUrl: (rfiBaseDir +'/mcc/rfimcc1000/answer/rfi.answer.html')
	}).state('rfi/mcc/rfimcc1000.quotation', {
		url: (rfiBaseUrl +'/mcc/rfimcc1000/quotation/:item/:descItem/:quantity/:unitMetric/:guid/:orderNumber/:codEstab'),
		controller: 'rfi.mcc.quotation.view.ctrl',
		controllerAs: 'controller',
		templateUrl: (rfiBaseDir +'/mcc/rfimcc1000/quotation/rfi.view.html')
	}).state('rfi/mcc/rfimcc1000.finished', {
		url: (rfiBaseUrl +'/mcc/rfimcc1000/finished/:guid'),
		controller: 'rfi.mcc.finished.ctrl',
		controllerAs: 'controller',
		templateUrl: (rfiBaseDir + '/mcc/rfimcc1000/finished/rfi.finished.html')
    });
    
});
