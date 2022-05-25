define([
	'index'
], function(index) {	
    mla0007.$inject = ['$totvsresource'];
    function mla0007($totvsresource) {        
        var specificResources = {            
            /* 
             * Objetivo: Buscar os códigos de rejeições do ERP
             * Parâmetros: -Saída: array com os códigos e descrições das rejeições disponíveis.
             * Observações:
             */
            'getCodRejeita': {
                method: 'POST',
                isArray: true,
                params: {},
                url: '/dts/datasul-rest/resources/api/lap/mla0007/getCodRejeita/'
            },
            /* 
             * Objetivo: Movimentar uma (ou várias) pendência(s) no ERP (aprovação, rejeição ou re-aprovação)
             * Parâmetros:  -Entrada:   p-selecionados: nrTrans das pendências que serão movimentadas (Separador: ,)
                                        p-acao: 1-aprovar, 2-reprovar, 3-reaprovar
                                        p-narrativa: narrativa de aprovação/reprovação
                                        p-senha-usuario: '' (branco)
                                        p-cod-rejeicao: código da rejeição (apenas no caso de reprovação (p-acao=2), para os demais passar 0)
                            - Saída:    p-log-sucesso: true se todas as pendências foram movimentadas com sucesso; false se houve erro na movimentação de alguma pendência
                                        RowErrors: array com os erros ocorridos durante a movimentação da(s) pendência(s)
             * Observações:
             */
            'aprovaPendPortal_2': {
                method: 'POST',
                isArray: false,
                params: {"p-selecionados":"@pSelecionados", "p-acao":"@pAcao", "p-narrativa":"@pNarrativa", "p-senha-usuario":"@pSenhaUsuario", "p-cod-rejeicao":"@pCodRejeicao"},
                url: '/dts/datasul-rest/resources/api/lap/mla0007/aprovaPendPortal_2/'
            }
        }

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/lap/:method', {}, specificResources);
        return factory;
    };

    

	// ########################################################
	// ### Registers
	// ########################################################
	index.register.factory('mla.mla0007.factory', mla0007);	
});
