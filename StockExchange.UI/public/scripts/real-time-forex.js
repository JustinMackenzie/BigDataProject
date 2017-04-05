var HistoricalForex = function () {
    var self = this;

    // API shortforms
    var realTimeForexApi = 'https://exchange-rate.mybluemix.net';

    // Widget definitions
    self.realTimeTable = (function() {
        var exchangeRates = ko.observableArray([]);

        var connectToRealTimeService = function() {
            var socket = io(realTimeForexApi);

            socket.on('data', function(data)
            {
                self.realTimeTable.exchangeRates(data);
            });
        };

        var realTimeTable = {};
		realTimeTable.exchangeRates = exchangeRates;
        realTimeTable.connectToRealTimeService = connectToRealTimeService;
        return realTimeTable;
    }());

    self.realTimeTable.connectToRealTimeService();

    return self;
};

ko.applyBindings(new HistoricalForex());