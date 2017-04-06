var StockForexAnnotation = function () {
    var self = this;

    // API shortforms
    var stockForexAnnotationDailyAverageApi = 'https://stock-forex-annotation-service.mybluemix.net/api/dailyAverage';
    var stockForexAnnotationDailyTotalApi = 'https://stock-forex-annotation-service.mybluemix.net/api/dailyTotalPrice';

    // Widget definitions
    self.dailyAverageTable = (function() {
        var from = ko.observable('');
        var to = ko.observable('');
        var forexEntries = ko.observableArray();

        var getDailyAverages = function(from, to){
            var onSuccess = function (response) {
                response.forEach(function(entry){
                    entry.timestamp = Date.parse(entry.timestamp).toString('MMMM dS, yyyy')
                });
                self.dailyAverageTable.forexEntries(response);
            };

            var onError = function () {
                alert('Could not load foreign exchange daily averages.');
            };

            var formattedFromDate = Date.parse(from).toString('yyyyMMdd');
            var formattedToDate = Date.parse(to).toString('yyyyMMdd');
            xhrGet(stockForexAnnotationDailyAverageApi + '?conv=usdcad&from=' + formattedFromDate + '&to=' + formattedToDate, onSuccess, onError);
        }

        var dailyAverageTable = {};
        dailyAverageTable.from = from;
		dailyAverageTable.to = to;
        dailyAverageTable.forexEntries = forexEntries;
        dailyAverageTable.getDailyAverages = getDailyAverages;
        return dailyAverageTable;
    }());

    self.dailyTotalStock = (function() {
        var from = ko.observable('');
        var to = ko.observable('');
        var forexEntries = ko.observableArray();

        var getDailyTotal = function(from, to){
            var onSuccess = function (response) {
                response.forEach(function(entry){
                    entry.timestamp = Date.parse(entry.timestamp).toString('MMMM dS, yyyy')
                });
                self.dailyTotalStock.forexEntries(response);
            };

            var onError = function () {
                alert('Could not load foreign exchange daily averages.');
            };

            var formattedFromDate = Date.parse(from).toString('yyyyMMdd');
            var formattedToDate = Date.parse(to).toString('yyyyMMdd');
            xhrGet(stockForexAnnotationDailyTotalApi + '?conv=usdcad&from=' + formattedFromDate + '&to=' + formattedToDate, onSuccess, onError);
        }

        var dailyTotalStock = {};
        dailyTotalStock.from = from;
		dailyTotalStock.to = to;
        dailyTotalStock.forexEntries = forexEntries;
        dailyTotalStock.getDailyTotal = getDailyTotal;
        return dailyTotalStock;
    }());

    return self;
};

ko.applyBindings(new StockForexAnnotation());