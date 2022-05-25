var ABI_STATUS_ENUM = {
    AGUARDANDO_IMPORTACAO           :1,
    IMPORTACAO_COM_ERRO             :2,
    ANALISE_IMPUGNACAO              :3,
    AGUARDANDO_DECISAO_IMPUGNACAO   :4,
    ANALISE_RECURSO                 :5,
    AGUARDANDO_DECISAO_RECURSO      :6,
    ENCERRADA                       :7
};


/* ENUMERATION_VALUES */
ABI_STATUS_ENUM.ENUMERATION_VALUES = [
    {data:ABI_STATUS_ENUM.AGUARDANDO_IMPORTACAO           , label:"Aguardando Importação"},
    {data:ABI_STATUS_ENUM.IMPORTACAO_COM_ERRO             , label:"Importação com Erro"},
    {data:ABI_STATUS_ENUM.ANALISE_IMPUGNACAO              , label:"Análise de Impugnação"},
    {data:ABI_STATUS_ENUM.AGUARDANDO_DECISAO_IMPUGNACAO   , label:"Aguardando Decisão da Impugnação"},
    {data:ABI_STATUS_ENUM.ANALISE_RECURSO                 , label:"Análise do Recurso"},
    {data:ABI_STATUS_ENUM.AGUARDANDO_DECISAO_RECURSO      , label:"Aguardando Decisão do Recurso"},
    {data:ABI_STATUS_ENUM.ENCERRADA                       , label:"Encerrado"}
];

/* ENUMERATION_VALUES */
ABI_STATUS_ENUM.DETAILED_ENUMERATION_VALUES = [
    {data:ABI_STATUS_ENUM.AGUARDANDO_IMPORTACAO           , label:"1 - Aguardando Importação"},
    {data:ABI_STATUS_ENUM.IMPORTACAO_COM_ERRO             , label:"2 - Importação com Erro"},
    {data:ABI_STATUS_ENUM.ANALISE_IMPUGNACAO              , label:"3 - Análise de Impugnação"},
    {data:ABI_STATUS_ENUM.AGUARDANDO_DECISAO_IMPUGNACAO   , label:"4 - Aguardando Decisão da Impugnação"},
    {data:ABI_STATUS_ENUM.ANALISE_RECURSO                 , label:"5 - Análise do Recurso"},
    {data:ABI_STATUS_ENUM.AGUARDANDO_DECISAO_RECURSO      , label:"6 - Aguardando Decisão do Recurso"},
    {data:ABI_STATUS_ENUM.ENCERRADA                       , label:"7 - Encerrado"}
];

/* ENUMERATION_VALUES */
ABI_STATUS_ENUM.DETAILED_ENUMERATION_VALUES_STATUS_MODAL = [
    {data:ABI_STATUS_ENUM.AGUARDANDO_DECISAO_IMPUGNACAO   , label:"4 - Aguardando Decisão da Impugnação"},
    {data:ABI_STATUS_ENUM.ANALISE_RECURSO                 , label:"5 - Análise do Recurso"},
    {data:ABI_STATUS_ENUM.AGUARDANDO_DECISAO_RECURSO      , label:"6 - Aguardando Decisão do Recurso"},
    {data:ABI_STATUS_ENUM.ENCERRADA                       , label:"7 - Encerrado"}
];

//extende AbstractEnumeration para obter algumas funcoes genericas, como getLabelByKey e getIndexByKey
define(['/dts/hgp/html/js/global/enumeration/AbstractEnumeration.js'],function(){
	$.extend( ABI_STATUS_ENUM, AbstractEnumeration );
});