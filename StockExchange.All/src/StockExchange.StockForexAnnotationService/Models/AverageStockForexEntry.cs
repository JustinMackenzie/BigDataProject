using System;

namespace StockExchange.StockForexAnnotationService.Controllers
{
    public class AverageStockForexEntry
    {
        public DateTime Timestamp { get; set; }
        public float AverageForexLow { get; set; }
        public float AverageForexHigh { get; set; }
        public float AverageStockPrice { get; set; }
    }
}