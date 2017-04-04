using System;
using StockExchange.StockForexAnnotationService.Controllers;

namespace StockExchange.StockForexAnnotationService.Repositories
{
    public class CloudantStockForexEntry
    {
        public float ForexLowAverage { get; set; }
        public float ForexHighAverage { get; set; }
        public long Average { get; set; }
        public long Timestamp { get; set; }
        public long TotalSize { get; set; }

        public AverageStockForexEntry ToAverageStockForexEntry()
        {
            return new AverageStockForexEntry
            {
                AverageForexHigh = ForexHighAverage,
                AverageForexLow = ForexLowAverage,
                Timestamp = new DateTime(Timestamp),
                AverageStockPrice = Average / 10000f
            };
        }

        public TotalStockForexEntry ToTotalStockForexEntry()
        {
            return new TotalStockForexEntry
            {
                AverageForexHigh = ForexHighAverage,
                AverageForexLow = ForexLowAverage,
                Timestamp = new DateTime(Timestamp),
                TotalStockSold = TotalSize
            };
        }
    }
}