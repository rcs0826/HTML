var DOCUMENTOS_AVISOS_STATUS_EXP_ENUM = {

    EXPORTED_A520            : 1,
    RETURNED_NOK_A520		 : 3,
    RETURNED_OK_A520         : 2,
    SENDED_RESTRICTION_A530	 : 4,
    SENDED_NOTICES_A530	     : 5,
    RECIVED_A530             : 6,
    EXPORTED_A500            : 7
};

/* ENUMERATION_VALUES */
DOCUMENTOS_AVISOS_STATUS_EXP_ENUM.ENUMERATION_VALUES = [
    {data:DOCUMENTOS_AVISOS_STATUS_EXP_ENUM.EXPORTED_A520            , label:"Exportado A520"},
    {data:DOCUMENTOS_AVISOS_STATUS_EXP_ENUM.RETURNED_NOK_A520        , label:"Retorno com Erro"},
    {data:DOCUMENTOS_AVISOS_STATUS_EXP_ENUM.RETURNED_OK_A520         , label:"Importado Retorno"},
    {data:DOCUMENTOS_AVISOS_STATUS_EXP_ENUM.SENDED_RESTRICTION_A530  , label:"Enviado A530 - Glosa Total"},
    {data:DOCUMENTOS_AVISOS_STATUS_EXP_ENUM.SENDED_NOTICES_A530      , label:"Enviado A530 - Aviso Indevido"},
    {data:DOCUMENTOS_AVISOS_STATUS_EXP_ENUM.RECIVED_A530             , label:"Recebido A530 - Prazo Expirado"},
    {data:DOCUMENTOS_AVISOS_STATUS_EXP_ENUM.EXPORTED_A500            , label:"Exportado A500"}
];

DOCUMENTOS_AVISOS_STATUS_EXP_ENUM.VALUES_WITH_ALL_OPTION = [{data:0, label: 'Todos'}].concat(DOCUMENTOS_AVISOS_STATUS_EXP_ENUM.ENUMERATION_VALUES);

//extende AbstractEnumeration para obter algumas funcoes genericas, como getLabelByKey e getIndexByKey
define(['/dts/hgp/html/js/global/enumeration/AbstractEnumeration.js'],function(){
	$.extend( DOCUMENTOS_AVISOS_STATUS_EXP_ENUM, AbstractEnumeration );
});
