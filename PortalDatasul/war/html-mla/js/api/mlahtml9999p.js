define([
	'index'
], function(index) {
	
	// ########################################################
	// ### OBS: A api mlahtml9999p não existe no progress, esta função chama a api conforme o parâmetro 'programcode'
    // ### Ex: programcode = mlahtml0004p -> executa a api laphtml/mlahtml004p.p
	// ########################################################
    mlahtml9999p.$inject = ['$totvsresource'];
    function mlahtml9999p($totvsresource) {        
        var specificResources = {
            /* 
             * Objetivo: buscar a lista de pendências para o tipo de documento selecionado
             * Parâmetros:  -Entrada:   iCodTipDoc: código do tipo do documento
                                        tipoDoc:    -prin: pendentes
                                                    -saida: historico
                                                    -mes: mestre
                                                    -alt: alternativo
                                                    -ambos: principal, mestre e alternativos
                                                    -aprov: aprovados e reaprovados
                                                    -reprov: reprovados                                        
                                                    -programcode: código da api progress que será chamada. Ex: 'mlahtml004p' (chamará a api progress 'laphtml/mlahtml004p.p')
                                        dtIni: Data de início para consideração do histórico
                                        dtFim: Data de término para consideração do histórico
                            -Saída:     ttDados: array com os dados da listagem
             * Observações: As datas somente são utilizadas para o histórico e caso não sejam informadas serão considerados 30 dias 
             */
            'listagemDocumentos': {
                method: 'POST',
                isArray: true,
                params: {'iCodTipDoc':'@iCodTipDoc', 'tipoDoc':'@tipoEntrSai', 'dtIni':'@dtIni', 'dtFim':'@dtFim','programcode':'@programcode'},
                url: '/dts/datasul-rest/resources/api/laphtml/:programcode/listagemDocumentos/'
            },
            /* 
             * Objetivo: buscar a lista de pendências para o tipo de documento selecionado
             * Parâmetros:  -Entrada:  cEpCodigo:   código da empresa
                                       cCodEstabel: código do estabelecimento
                                       iCodTipDoc:  código do tipo do documento
                                       tipoDoc:     -prin: pendentes
                                                    -saida: histórico
                                                    -mes: mestre
                                                    -alt: alternativo
                                                    -ambos: principal, mestre e alternativos
                                                    -aprov: aprovados e reaprovados
                                                    -reprov: reprovados                                        
                                                    -programcode: código da api progress que será chamada. Ex: 'mlahtml004p' (chamará a api progress 'laphtml/mlahtml004p.p')
                                        dtIni: Data de início para consideração do histórico
                                        dtFim: Data de término para consideração do histórico
                            -Saída:     ttDados: array com os dados da listagem
             * Observações: As datas somente são utilizadas para o histórico e caso não sejam informadas serão considerados 30 dias 
             *              Para empresa e estabelecimento, se passado em branco considera todos
             */
            'listagemDocumentosEmpresaEstab': {
                method: 'POST',
                isArray: true,
                params: {'cEpCodigo':'@cEpCodigo','cCodEstabel':'@cCodEstabel','iCodTipDoc':'@iCodTipDoc', 'tipoDoc':'@tipoEntrSai', 'dtIni':'@dtIni', 'dtFim':'@dtFim','programcode':'@programcode'},
                url: '/dts/datasul-rest/resources/api/laphtml/:programcode/listagemDocumentosEmpresaEstab/'
            },
            /* 
             * Objetivo: Retornar os detalhes do documento
             * Parâmetros:  -Entrada:   -p-nr-transacao: número da transação da pendência selecionada
                                        -programcode: código da api progress que será chamada. Ex: 'mlahtml004p' (chamará a api progress 'laphtml/mlahtml004p.p')
                            -Saída: p-situacao: Situação da pendência
                                    ttDados: array com os dados do detalhe da pendência selecionada
             * Observações:
             */
            'detalheDocumento': {
                method: 'POST',
                isArray: false,
                params: {'p-nr-transacao':'@nrTransacao','programcode':'@programcode'},
                url: '/dts/datasul-rest/resources/api/laphtml/:programcode/detalheDocumento/'
            }
        }    

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/lap/:method', {}, specificResources);
        return factory;
    };

	// ########################################################
	// ### Registers
	// ########################################################
	index.register.factory('mla.mlahtml9999p.factory', mlahtml9999p);
});
