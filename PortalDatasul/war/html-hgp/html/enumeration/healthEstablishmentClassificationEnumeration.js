var HEALTH_ESTABLISHMENT_CLASSIFICATION_ENUM = {

	NOT_INFORMED             : 0, //Não Informado
    HOSPITAL_CARE            : 1, //Assistência Hospitalar
    HIGH_COMPLEXITY_SERVICES : 2, //Serviços de Alta Complexidade
    OTHER_ESTABLISHMENTS     : 3  //Demais Estabelecimentos

};

/* ENUMERATION_VALUES */
HEALTH_ESTABLISHMENT_CLASSIFICATION_ENUM.ENUMERATION_VALUES = [
    {data:HEALTH_ESTABLISHMENT_CLASSIFICATION_ENUM.NOT_INFORMED, label:"Não Informado"},       
    {data:HEALTH_ESTABLISHMENT_CLASSIFICATION_ENUM.HOSPITAL_CARE, label:"Assistência Hospitalar"},   
    {data:HEALTH_ESTABLISHMENT_CLASSIFICATION_ENUM.HIGH_COMPLEXITY_SERVICES, label:"Serviços de Alta Complexidade"},
    {data:HEALTH_ESTABLISHMENT_CLASSIFICATION_ENUM.OTHER_ESTABLISHMENTS, label:"Demais Estabelecimentos"}

];

//extende AbstractEnumeration para obter algumas funcoes genericas, como getLabelByKey e getIndexByKey
define(['/dts/hgp/html/js/global/enumeration/AbstractEnumeration.js'],function(){
	$.extend( HEALTH_ESTABLISHMENT_CLASSIFICATION_ENUM, AbstractEnumeration );
});