var WOMAN_DEATH_ENUM = {

	PREGNANT                            : 1,
	UNTIL_42_DAYS_AFTER_PREGNANCY       : 2,
	_43_DAYS_UNTIL_YEAR_AFTER_PREGNANCY : 3,
	NOT_OCCURRED                        : 4
};

/* ENUMERATION_VALUES */
WOMAN_DEATH_ENUM.ENUMERATION_VALUES = [
    {data:WOMAN_DEATH_ENUM.PREGNANT                             , label:"1 - Gravida"},
    {data:WOMAN_DEATH_ENUM.UNTIL_42_DAYS_AFTER_PREGNANCY        , label:"2 - Ate 42 Dias Apos Termino da Gestacao"},
    {data:WOMAN_DEATH_ENUM._43_DAYS_UNTIL_YEAR_AFTER_PREGNANCY 	, label:"3 - De 43 Dias Ate 12 Meses Apos Termino da Gestacao"},
    {data:WOMAN_DEATH_ENUM.NOT_OCCURRED    			, label:"4 - Nao Ocorrido"}
];

//extende AbstractEnumeration para obter algumas funcoes genericas, como getLabelByKey e getIndexByKey
define(['/dts/hgp/html/js/global/enumeration/AbstractEnumeration.js'],function(){
    $.extend( WOMAN_DEATH_ENUM, AbstractEnumeration );
});
