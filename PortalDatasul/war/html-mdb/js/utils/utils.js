define(['index'], function(index) {

    function utils() {
        return {
            addMonthsToDate: function(date, numMonths) {
                return new Date(date.getFullYear(), date.getMonth() + numMonths, date.getDate());
            }
        };
    }
    
    index.register.factory('fchmdb.utils.Factory', utils);
});