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
                data.forEach(function(entry){
                    entry.timestamp = new Date(parseFloat(entry.timestamp)).toString("HH:mm:ss");
                    entry.bid = parseFloat(entry.bidBig + entry.bidPips);
                    entry.offer = parseFloat(entry.offerBig + entry.offerPips);
                });
                self.realTimeTable.exchangeRates(data);
            });
        };

        var realTimeTable = {};
		realTimeTable.exchangeRates = exchangeRates;
        realTimeTable.connectToRealTimeService = connectToRealTimeService;
        return realTimeTable;
    }());

    self.realTimeChart = (function() {
        var connectToRealTimeService = function() {
            var socket = io(realTimeForexApi);

            socket.on('data', function(data)
            {
                var usdcad = data[7];
                var point = { x: new Date(parseFloat(usdcad.timestamp)), y: parseFloat(usdcad.bidBig + usdcad.bidPips)};
                var ctx = document.getElementById("realtimeLineChart");

                if (self.realTimeChart.lineChart){
                    self.realTimeChart.lineChart.data.datasets[0].data.push(point);
                    self.realTimeChart.lineChart.update();             
                } else{
                    self.realTimeChart.lineChart = new Chart(ctx, {
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
                                data: [point]
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
                }               
            });
        };

        var realTimeChart = {};
        realTimeChart.connectToRealTimeService = connectToRealTimeService;
        return realTimeChart;
    }());

    self.realTimeTable.connectToRealTimeService();
    self.realTimeChart.connectToRealTimeService();

    return self;
};

ko.applyBindings(new HistoricalForex());