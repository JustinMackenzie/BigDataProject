var HistoricalForex = function () {
    var self = this;

    // API shortforms
    var historicalForexDailyAverageApi = 'https://historical-forex-service.mybluemix.net/api/dailyAverage';
    var historicalForexApi = 'https://historical-forex-service.mybluemix.net/api/entries'

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
            xhrGet(historicalForexDailyAverageApi + '?conv=usdcad&from=' + formattedFromDate + '&to=' + formattedToDate, onSuccess, onError);
        }

        var dailyAverageTable = {};
        dailyAverageTable.from = from;
		dailyAverageTable.to = to;
        dailyAverageTable.forexEntries = forexEntries;
        dailyAverageTable.getDailyAverages = getDailyAverages;
        return dailyAverageTable;
    }());

    self.dailyEntryTable = (function() {
        var day = ko.observable('');
        var forexEntries = ko.observableArray();

        var getDailyEntries = function(day){
            var onSuccess = function (response) {
                response.forEach(function(entry){
                    entry.timestamp = Date.parse(entry.timestamp).toString('HH:mm:ss')
                });
                self.dailyEntryTable.forexEntries(response);
            };

            var onError = function () {
                alert('Could not load foreign exchange daily averages.');
            };
            var date = Date.parse(day);
            var formattedFromDate = date.toString('yyyyMMdd 000000000');
            var formattedToDate = date.addDays(1) .toString('yyyyMMdd 000000000');
            xhrGet(historicalForexApi + '?conv=usdcad&from=' + formattedFromDate + '&to=' + formattedToDate, onSuccess, onError);
        }

        var dailyEntryTable = {};
        dailyEntryTable.day = day;
        dailyEntryTable.forexEntries = forexEntries;
        dailyEntryTable.getDailyEntries = getDailyEntries;
        return dailyEntryTable;
    }());

    return self;
};

ko.applyBindings(new HistoricalForex());