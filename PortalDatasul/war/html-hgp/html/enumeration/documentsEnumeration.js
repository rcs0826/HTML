
/*Enumerador de tipo de anexo dos documentos comprobatórios*/
var TP_ANEXO_ENUM = {
    NENHUM		           : 0,
    PADRAO		           : 1,
	CONTRATANTE 		   : 2
};

/* ENUMERATION_VALUES */
TP_ANEXO_ENUM.ENUMERATION_VALUES = [
    {data:TP_ANEXO_ENUM.NENHUM, label:"Nenhum"},
    {data:TP_ANEXO_ENUM.PADRAO, label:"Documento Padrão"},
    {data:TP_ANEXO_ENUM.CONTRATANTE, label:"Documento vinculado ao Contratante"}
];

define(['/dts/hgp/html/js/global/enumeration/AbstractEnumeration.js'],function(){
	$.extend( TP_ANEXO_ENUM, AbstractEnumeration );
});