var StockQuery = function () {
    var self = this;

    // API shortforms
    var stockQueryAverageApi = 'https://queryService.mybluemix.net/api/average';
    var stockQueryDataApi = 'https://queryService.mybluemix.net/api/entries'

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

    self.stockMinuteDataTable = (function() {
        var day = ko.observable('');
        var time = ko.observable('');
        var stockData = ko.observable('');
        var pageSize = ko.observable(10);     
        var pageIndex = ko.observable(0);
        var pagedList = ko.dependentObservable(function(){
            var size = pageSize();
            var start = pageIndex() * size;
            return stockData().slice(start, start + size);
        });

        var maxPageIndex = ko.dependentObservable(function () {
            return Math.ceil(stockData().length/pageSize())-1;
        });

        var previousPage = function () {
            if (pageIndex() > 0) {
                pageIndex(pageIndex() - 1);
            }
        };
        var nextPage = function () {
            if (pageIndex() < maxPageIndex()) {
                pageIndex(pageIndex() + 1);
            }
        };
        var allPages = ko.dependentObservable(function () {
            var pages = [];
            for (i = 0; i <= maxPageIndex() ; i++) {
                pages.push({ pageNumber: (i + 1) });
            }
            return pages;
        });

        var moveToPage = function (index) {
            pageIndex(index);
        };

        var getStockData = function(day, time){
            var onSuccess = function (response) {
                self.stockMinuteDataTable.stockData([]);
                if (response.length > 0){
                    response.forEach(function(entry){
                        entry.price = parseFloat(entry.Price) / 10000;
                        entry.timestamp = new Date(parseFloat(entry.Time) * 1000).toString('HH:mm:ss'); 
                    });

                    self.stockMinuteDataTable.stockData(response);
                }
            };

            var onError = function () {
                alert('Could not load day average price.');
            };
            var fromDate = Date.parse(day);
            var dateTimeString = fromDate.toString('MM-dd-yyyy') + "T" + time;
            var fromDateTime = Date.parse(fromDate.toString('yyyy-MM-dd') + "T" + time);
            var toDateTime = Date.parse(fromDate.toString('yyyy-MM-dd') + "T" + time).add(1).minute();

            xhrGet(stockQueryDataApi + '?from=' + fromDateTime.getTime() / 1000 + "&to=" + toDateTime.getTime() / 1000, onSuccess, onError);
        }

        var stockMinuteDataTable = {};
        stockMinuteDataTable.day = day;
        stockMinuteDataTable.time = time;
		stockMinuteDataTable.stockData = stockData;
        stockMinuteDataTable.getStockData = getStockData;
        stockMinuteDataTable.pageIndex = pageIndex;
        stockMinuteDataTable.pageSize = pageSize;
        stockMinuteDataTable.pagedList = pagedList;
        stockMinuteDataTable.maxPageIndex = maxPageIndex;
        stockMinuteDataTable.previousPage = previousPage;
        stockMinuteDataTable.nextPage = nextPage;
        stockMinuteDataTable.allPages = allPages;
        stockMinuteDataTable.moveToPage = moveToPage;
        return stockMinuteDataTable;
    }());

    return self;
};

ko.applyBindings(new StockQuery());