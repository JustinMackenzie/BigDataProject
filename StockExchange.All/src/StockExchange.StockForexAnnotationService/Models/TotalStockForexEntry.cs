using System;

namespace StockExchange.StockForexAnnotationService.Controllers
{
    public class TotalStockForexEntry
    {
        public DateTime Timestamp { get; set; }
        public float AverageForexLow { get; set; }
        public float AverageForexHigh { get; set; }
        public long TotalStockSold { get; set; }
    }
}