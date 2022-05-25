var DOCUMENTOS_AVISOS_STATUS_IMP_ENUM = {

    IMPORTED_A520            : 8,
    IMPORTED_ERROR           : 13,
    IMPORTED_A500            : 9,
    RECIVED_RESTRICTION_A530 : 10,
    RECIVED_NOTICES_A530	 : 11,
    SENDED_A530	             : 12
};

/* ENUMERATION_VALUES */
DOCUMENTOS_AVISOS_STATUS_IMP_ENUM.ENUMERATION_VALUES = [
    {data:DOCUMENTOS_AVISOS_STATUS_IMP_ENUM.IMPORTED_A520            , label:"Importado A520"},
    {data:DOCUMENTOS_AVISOS_STATUS_IMP_ENUM.IMPORTED_ERROR           , label:"Importado com Erro"},
    {data:DOCUMENTOS_AVISOS_STATUS_IMP_ENUM.IMPORTED_A500            , label:"Importado A500"},
    {data:DOCUMENTOS_AVISOS_STATUS_IMP_ENUM.RECIVED_RESTRICTION_A530 , label:"Recebido A530 - Glosa Total"},
    {data:DOCUMENTOS_AVISOS_STATUS_IMP_ENUM.RECIVED_NOTICES_A530     , label:"Recebido A530 - Aviso Indevido"},
    {data:DOCUMENTOS_AVISOS_STATUS_IMP_ENUM.SENDED_A530              , label:"Enviado A530 - Prazo Expirado"}
];

DOCUMENTOS_AVISOS_STATUS_IMP_ENUM.VALUES_WITH_ALL_OPTION = [{data:0, label: 'Todos'}].concat(DOCUMENTOS_AVISOS_STATUS_IMP_ENUM.ENUMERATION_VALUES);

//extende AbstractEnumeration para obter algumas funcoes genericas, como getLabelByKey e getIndexByKey
define(['/dts/hgp/html/js/global/enumeration/AbstractEnumeration.js'],function(){
	$.extend( DOCUMENTOS_AVISOS_STATUS_IMP_ENUM, AbstractEnumeration );
});
