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

        var pageSize = ko.observable(10);     
        var pageIndex = ko.observable(0);
        var pagedList = ko.dependentObservable(function(){
            var size = pageSize();
            var start = pageIndex() * size;
            return forexEntries().slice(start, start + size);
        });

        var maxPageIndex = ko.dependentObservable(function () {
            return Math.ceil(forexEntries().length/pageSize())-1;
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

        var getDailyAverages = function(from, to){
            var onSuccess = function (response) {
                response.forEach(function(entry){
                    entry.timestamp = Date.parse(entry.timestamp).toString('MMMM dS, yyyy');
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
        dailyAverageTable.pageIndex = pageIndex;
        dailyAverageTable.pageSize = pageSize;
        dailyAverageTable.pagedList = pagedList;
        dailyAverageTable.maxPageIndex = maxPageIndex;
        dailyAverageTable.previousPage = previousPage;
        dailyAverageTable.nextPage = nextPage;
        dailyAverageTable.allPages = allPages;
        dailyAverageTable.moveToPage = moveToPage;
        return dailyAverageTable;
    }());

    self.dailyEntryTable = (function() {
        var day = ko.observable('');
        var forexEntries = ko.observableArray();
        var pageSize = ko.observable(10);     
        var pageIndex = ko.observable(0);
        var pagedList = ko.dependentObservable(function(){
            var size = pageSize();
            var start = pageIndex() * size;
            return forexEntries().slice(start, start + size);
        });

        var maxPageIndex = ko.dependentObservable(function () {
            return Math.ceil(forexEntries().length/pageSize())-1;
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

        var getDailyEntries = function(day){
            var onSuccess = function (response) {
                response.forEach(function(entry){
                    entry.timestamp = Date.parse(entry.timestamp).toString('HH:mm:ss');
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
        dailyEntryTable.pageIndex = pageIndex;
        dailyEntryTable.pageSize = pageSize;
        dailyEntryTable.pagedList = pagedList;
        dailyEntryTable.maxPageIndex = maxPageIndex;
        dailyEntryTable.previousPage = previousPage;
        dailyEntryTable.nextPage = nextPage;
        dailyEntryTable.allPages = allPages;
        dailyEntryTable.moveToPage = moveToPage;
        return dailyEntryTable;
    }());

    self.historicalAverageChart = (function() {
        var from = ko.observable('');
        var to = ko.observable('');

        var getDailyAverages = function(from, to){
            var onSuccess = function (response) {
                var data = [];
                response.forEach(function(entry){
                    data.push({ x: Date.parse(entry.timestamp), y: entry.high });
                });   

                var ctx = document.getElementById("historicalAverageLineChart");

                if (self.historicalAverageChart.lineChart){
                    self.historicalAverageChart.lineChart.destroy();
                }

                self.historicalAverageChart.lineChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        datasets: [{
                            label: "USD-CAD",
                            backgroundColor: "rgba(38, 185, 154, 0.31)",
                            borderColor: "rgba(38, 185, 154, 0.7)",
                            pointBorderColor: "rgba(38, 185, 154, 0.7)",
                            pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                            pointHoverBackgroundColor: "#fff",
                            pointHoverBorderColor: "rgba(220,220,220,1)",
                            pointBorderWidth: 1,
                            data: data
                        }]
                    },
                    options: {
                        scales: {
                            xAxes: [{
                                type: 'time',
                                position: 'bottom'
                            }]
                        }
                    }
                });
            };

            var onError = function () {
                alert('Could not load foreign exchange daily averages.');
            };

            var formattedFromDate = Date.parse(from).toString('yyyyMMdd');
            var formattedToDate = Date.parse(to).toString('yyyyMMdd');
            xhrGet(historicalForexDailyAverageApi + '?conv=usdcad&from=' + formattedFromDate + '&to=' + formattedToDate, onSuccess, onError);
        }

        var historicalAverageChart = {};
        historicalAverageChart.from = from;
        historicalAverageChart.to = to;
        historicalAverageChart.getDailyAverages = getDailyAverages;
        return historicalAverageChart;
    }());

    return self;
};

ko.applyBindings(new HistoricalForex());