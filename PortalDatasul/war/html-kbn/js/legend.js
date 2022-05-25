define(['index'], function(index) {
    legend.$inject = ['messageHolder', '$rootScope'];
    function legend(legendMessage, $rootScope) {
        return {
            colorRange: {
                ENUM: {
                    GREEN: {id: 1, desc: $rootScope.i18n('l-green', [], 'dts/kbn'), color:"#41a85f"},
                    YELLOW: {id: 2, desc: $rootScope.i18n('l-yellow', [], 'dts/kbn'), color:"#fac51c"},
                    RED: {id:3, desc: $rootScope.i18n('l-red', [], 'dts/kbn'), color: "#b8312f"}
                },
                getObjColor: function(key)
                {
                    for (var prop in this.ENUM) {
                        if (this.ENUM[prop].id === key) {
                            return this.ENUM[prop];
                        }
                    }               
                },
                getDescById: function(key) {
                    return this.getObjColor(key).desc;
                },
                getColorById: function(key) {
                    return this.getObjColor(key).color;                    
                },
                getAllAsArray: function()
                {
                    var array = $.map(this.ENUM, function(value, index) {
                        return [value.desc];
                    });               
                    return array;     
                }
            },
            itemType: {
                OPTIONS: [
                    {
                        desc: $rootScope.i18n('l-expedition', [], 'dts/kbn'),
                        value: 1
                    }, 
                    {
                        desc: $rootScope.i18n('l-process', [], 'dts/kbn'),
                        value : 0
                    },
                    {
                        desc: $rootScope.i18n('l-both', [], 'dts/kbn'),
                        value : 2
                    }
                ],
                DESC: function(key) {
                    var found = this.OPTIONS.filter(function(option) {
                        return (option.value === JSON.parse(key));
                    });
                    return found[0].desc;
                }
            },
            motive: {
                ID : {
                    'BLOQUEIO_CARTAO'              : 1,
                    'REORDENAMENTO_DE_CARTAO'      : 2,
                    'AJUSTE_DE_SALDO'              : 3
                },
                NAME : function (id) {
                    var sentence = '';
                    switch (id) {
                    case 1:
                        sentence = 'l-card-lock';
                        break;
                    case 2:
                        sentence = 'l-card-reorder';
                        break;
                    case 3:
                        sentence = 'l-balance-adjust';
                        break;
                    case 4:
                        sentence = 'l-extra-card-emission';
                        break;
                    default:
                        sentence = '';
                    }

                    return $rootScope.i18n(sentence);
                }
            }
        };
    }

    index.register.service('kbn.legend', legend);
});
