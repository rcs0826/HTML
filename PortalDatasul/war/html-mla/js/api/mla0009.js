define([
	'index'
], function(index) {
	
	// ########################################################
	// ### Services
	// ########################################################

    mla0009.$inject = ['$totvsresource'];
    function mla0009($totvsresource) {        
        var specificResources = {
            /* 
             * Objetivo: Retorna para cada documento do usuário o número de pendências como principal e o número de pendências alternativo
             * Parâmetros:  -Entrada:   i-tipo: 1: Principal e alternativo; 2: Histórico
                                        dtIni: Data de início para consideração do histórico
                                        dtFim: Data de término para consideração do histórico
                            -Saída:     ttDocuments: array com a lista de documentos do usuário com a quantidade de pendência como principal e 
                                                     como alternativo ou do histórico de aprovações
             * Observações:
             */
            'getTotalizadoresPorDocumento': {
                method: 'GET',
                isArray: true,
                params: {"iTipo":"@iTipo", "dtIni":"@dtIni", "dtFim":"@dtFim"},
                url: '/dts/datasul-rest/resources/api/lap/mla0009/getTotalizadoresPorDocumento/'
            },
			/* 
             * Objetivo: Retorna para cada documento do usuário o número de pendências como 
                         principal, como mestre e o número de pendências como alternativo
             * Parâmetros:  -Entrada:   epCodigo: Código da empresa
			                            codEstabel: Código do estabelimento
						                i-tipo: 1: Principal, mestre e alternativo; 2: Histórico
                                        dtIni: Data de início para consideração do histórico
                                        dtFim: Data de término para consideração do histórico
                            -Saída:     ttDocuments: array com a lista de documentos do usuário com a quantidade de pendência como                                                        principal e como alternativo ou do histórico de aprovações
             * Observações:
             */
            'getTotalizadoresPorDocumentoEmpresaEstab': {
                method: 'GET',
                isArray: true,
                params: {"epCodigo":"@epCodigo", "codEstabel":"@codEstabel", "iTipo":"@iTipo", "dtIni":"@dtIni", "dtFim":"@dtFim"},
                url: '/dts/datasul-rest/resources/api/lap/mla0009/getTotalizadoresPorDocumentoEmpresaEstab/'
            },
            /* 
             * Objetivo: Retorna os documentos do usuário
             * Parâmetros:  Saída: ttDocs: array com a lista de documentos do usuário
             * Observações:
             */
            'getDocumentosDoUsuario': {
                method: 'GET',
                isArray: true,
                params: {"epCodigo":"@epCodigo"},
                url: '/dts/datasul-rest/resources/api/lap/mla0009/getDocumentosDoUsuario/'
            },
            /* 
             * Objetivo: Retorna o histórico de aprovações do documento
             * Parâmetros:  Entrada: p-nr-transacao: número da transação da pendência selecionada
                            Saída: array com os dados do histórico das aprovações da pendência selecionada
             * Observações:
             */
            'getHistoricoAprovacoes': {
                method: 'GET',
                isArray: true,
                params: {"nrTransacao":"@nrTransacao"},
                url: '/dts/datasul-rest/resources/api/lap/mla0009/getHistoricoAprovacoes/'
            },
            /* 
             * Objetivo: Retorna a ordenação padrão usada na listagem dos documentos 
             * Parâmetros:  Saída: i-ordering: tipo de ordenação
                                        1 - Mais recentes
                                        2 - Mais antigas
                                        3 - Maior valor
                                        4 - Menor valor
             * Observações:
             */
            'getSortDefault': {
                method: 'GET',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/api/lap/mla0009/getSortDefault/'  
            },
			/* 
             * Objetivo: Busca as informações padrões do usuário, como ordenação a ser utilizada e forma
                         de visualizar as pendências
             * Parâmetros:  
             * Observações: 
             */
            'getUsuarInformation': {
                method: 'GET',
                isArray: true,
                params: {},
                url: '/dts/datasul-rest/resources/api/lap/mla0009/getUsuarInformation/'  
            },
            /* 
             * Objetivo: Retorna informações da empresa logada e lista de empresas do usuário
             * Parâmetros:  Saída:  ttEmpresasUsuar: lista de empresas do usuário
                                    p-cod-empresa: código da empresa logada
                                    p-razao-social: razão social da empresa logada
             * Observações:
             */
            'getDadosEmpresa':{
                method: 'GET',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/api/lap/mla0009/getDadosEmpresa/'
            },
            /* 
             * Objetivo: Retorna o detalhe da pendência
             * Parâmetros:  Entrada: p-nr-transacao: número da transação da pendência selecionada
                            Saída:  tt-detalhe-pendencia: temp-table com os dados detalhados da pendência
                                    tt-chave: chave do documento (formatada)
             * Observações:
             */
            'getDetalhePendencia':{
                method: 'GET',
                isArray: false,
                params: {"nrTransacao":"@nrTransacao"},
                url: '/dts/datasul-rest/resources/api/lap/mla0009/getDetalhePendencia/'
            }
        }

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/lap/:method', {}, specificResources);
        return factory;
    };
	

	// ########################################################
	// ### Registers
	// ########################################################
	index.register.factory('mla.mla0009.factory', mla0009);
});
