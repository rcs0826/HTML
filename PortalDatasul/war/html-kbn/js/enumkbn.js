define(['index'], function(index) {
    enumkbn.$inject = [];
    function enumkbn() {
        return {
            itemType:{
                process: 0,
                final: 1,
                both: 2
            },
            justificativeCategory:{
                cardLock: 1,
                cardReorder: 2,
                balanceAdjustment: 3,
                extraCardEmission: 4
            },
            color:{
                green: 1,
                yellow: 2,
                red: 3,
                blue: 4
            }
        };
    }
    index.register.service('enumkbn', enumkbn);
});
