var StockQuery = function () {
    var self = this;

    // API shortforms
    var stockQueryAverageApi = 'https://queryService.mybluemix.net/api/average';
    var stockQueryDataApi = 'https://queryService.mybluemix.net/api/query'

    // Widget definitions
    self.stockPriceAverage = (function() {
        var day = ko.observable('');
        var stockPrice = ko.observable('');
        var stockDay = ko.observable('');

        var getStockData = function(day){
            var onSuccess = function (response) {
                if (response.length > 0){
                    var date = new Date(response[0].day);
                    self.stockPriceAverage.stockDay(date.toString('MMMM dS, yyyy'));
                    self.stockPriceAverage.stockPrice('$' + response[0].average / 10000);
                }
            };

            var onError = function () {
                alert('Could not load day average price.');
            };

            var date = Date.parse(day);
            var formattedDate = date.toString('yyyy-MM-dd');
            xhrGet(stockQueryAverageApi + '?day=' + formattedDate, onSuccess, onError);
        }

        var stockPriceAverage = {};
        stockPriceAverage.day = day;
		stockPriceAverage.stockPrice = stockPrice;
        stockPriceAverage.stockDay = stockDay;
        stockPriceAverage.getStockData = getStockData;
        return stockPriceAverage;
    }());

    self.stockDataTable = (function() {
        var dateTime = ko.observable('');
        var stockData = ko.observable('');

        var getStockData = function(dateTime){
            var onSuccess = function (response) {
                if (response.length > 0){
                    var date = new Date(response[0].dateTime);
                    self.stockPriceAverage.stockDay(date.toString('MMMM dS, yyyy'));
                    self.stockPriceAverage.stockPrice('$' + response[0].average / 10000);
                }
            };

            var onError = function () {
                alert('Could not load day average price.');
            };

            var date = Date.parse(dateTime);
            var formattedDate = date.toString('yyyy-MM-dd');
            xhrGet(stockQueryDataApi + '?Time=' + formattedDate, onSuccess, onError);
        }

        var stockDataTable = {};
        stockDataTable.dateTime = dateTime;
		stockDataTable.stockData = stockData;
        stockDataTable.getStockData = getStockData;
        return stockDataTable;
    }());

    return self;
};

ko.applyBindings(new StockQuery());