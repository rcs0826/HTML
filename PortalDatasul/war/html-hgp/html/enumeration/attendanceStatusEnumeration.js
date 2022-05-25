var ATTENDANCE_STATUS_ENUM = {
    AGUARDANDO_IMPORTACAO           :1,
    IMPORTACAO_COM_ERRO             :2,
    EM_ANALISE                      :3,
    ANALISE_CONCLUIDA               :4,
    ENVIADA                         :5,
    AGUARDANDO_GRU                  :6,
    AGUARDANDO_PAGAMENTO            :7,
    ENCERRADO                       :8
};


/* ENUMERATION_VALUES */
ATTENDANCE_STATUS_ENUM.ENUMERATION_VALUES = [
    {data:ATTENDANCE_STATUS_ENUM.AGUARDANDO_IMPORTACAO           , label:"Aguardando Importação"},
    {data:ATTENDANCE_STATUS_ENUM.IMPORTACAO_COM_ERRO             , label:"Importação com Erro"},
    {data:ATTENDANCE_STATUS_ENUM.EM_ANALISE                      , label:"Análise"},
    {data:ATTENDANCE_STATUS_ENUM.ANALISE_CONCLUIDA               , label:"Análise Concluída"},
    {data:ATTENDANCE_STATUS_ENUM.ENVIADA                         , label:"Enviado(a)"},
    {data:ATTENDANCE_STATUS_ENUM.AGUARDANDO_GRU                  , label:"Aguardando GRU"},
    {data:ATTENDANCE_STATUS_ENUM.AGUARDANDO_PAGAMENTO            , label:"Aguardando Pagamento"},
    {data:ATTENDANCE_STATUS_ENUM.ENCERRADO                       , label:"Encerrado"}
];

/* ENUMERATION_VALUES */
ATTENDANCE_STATUS_ENUM.DETAILED_ENUMERATION_VALUES = [
    {data:ATTENDANCE_STATUS_ENUM.AGUARDANDO_IMPORTACAO           , label:"1 - Aguardando Importação"},
    {data:ATTENDANCE_STATUS_ENUM.IMPORTACAO_COM_ERRO             , label:"2 - Importação com Erro"},
    {data:ATTENDANCE_STATUS_ENUM.EM_ANALISE                      , label:"3 - Em Análise"},
    {data:ATTENDANCE_STATUS_ENUM.ANALISE_CONCLUIDA               , label:"4 - Análise Concluída"},
    {data:ATTENDANCE_STATUS_ENUM.ENVIADA                         , label:"5 - Enviado(a)"},
    {data:ATTENDANCE_STATUS_ENUM.AGUARDANDO_GRU                  , label:"6 - Aguardando GRU"},
    {data:ATTENDANCE_STATUS_ENUM.AGUARDANDO_PAGAMENTO            , label:"7 - Aguardando Pagamento"},
    {data:ATTENDANCE_STATUS_ENUM.ENCERRADO                       , label:"8 - Encerrado"}
];

//extende AbstractEnumeration para obter algumas funcoes genericas, como getLabelByKey e getIndexByKey
define(['/dts/hgp/html/js/global/enumeration/AbstractEnumeration.js'],function(){
	$.extend( ATTENDANCE_STATUS_ENUM, AbstractEnumeration );
});



