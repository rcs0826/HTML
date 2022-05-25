var ABI_ANALYSIS_ATTENDANCE_ENUM = {
    IMPORTADA		           : 1,
	EM_ANALISE 		           : 2,
	ENVIADA_PARA_ANS           : 3,
	IMPUGNACAO_ENVIADA         : 4,
	IMPUGNACAO_DEFERIDA        : 5,
	IMPUGNACAO_INDEFERIDA      : 6,
	RECURSO_ENVIADO			   : 7,
	RECURSO_DEFERIDO		   : 8,
	RECURSO_INDEFERIDO		   : 9,
	RECURSO_PARCIAL_ENVIADO	   : 11,
	RECURSO_PARCIAL_INDEFERIDO : 12

};

/* ENUMERATION_VALUES */
ABI_ANALYSIS_ATTENDANCE_ENUM.ENUMERATION_VALUES = [
    {data:ABI_ANALYSIS_ATTENDANCE_ENUM.IMPORTADA                    , label:"Importada"                   },
    {data:ABI_ANALYSIS_ATTENDANCE_ENUM.EM_ANALISE                   , label:"Em Análise"                       },
    {data:ABI_ANALYSIS_ATTENDANCE_ENUM.ENVIADA_PARA_ANS             , label:"Enviada ANS"                 },
    {data:ABI_ANALYSIS_ATTENDANCE_ENUM.IMPUGNACAO_ENVIADA           , label:"Impugnação Enviada"               },    
    {data:ABI_ANALYSIS_ATTENDANCE_ENUM.IMPUGNACAO_DEFERIDA          , label:"Impugnação Deferida"              },
    {data:ABI_ANALYSIS_ATTENDANCE_ENUM.IMPUGNACAO_INDEFERIDA        , label:"Impugnação Indeferida"            },
    {data:ABI_ANALYSIS_ATTENDANCE_ENUM.RECURSO_ENVIADO              , label:"Recurso Enviado"                  },
    {data:ABI_ANALYSIS_ATTENDANCE_ENUM.RECURSO_DEFERIDO             , label:"Recurso Deferido"                 },
    {data:ABI_ANALYSIS_ATTENDANCE_ENUM.RECURSO_INDEFERIDO           , label:"Recurso Indeferido"               },
    {data:ABI_ANALYSIS_ATTENDANCE_ENUM.RECURSO_PARCIAL_ENVIADO      , label:"Recurso Parcial Enviado"          },
    {data:ABI_ANALYSIS_ATTENDANCE_ENUM.RECURSO_PARCIAL_INDEFERIDO   , label:"Recurso Parcial Indeferido"       }
];

//extende AbstractEnumeration para obter algumas funcoes genericas, como getLabelByKey e getIndexByKey
define(['/dts/hgp/html/js/global/enumeration/AbstractEnumeration.js'],function(){
	$.extend( ABI_ANALYSIS_ATTENDANCE_ENUM, AbstractEnumeration );
});
