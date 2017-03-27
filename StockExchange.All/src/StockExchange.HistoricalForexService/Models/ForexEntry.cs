using System;

namespace StockExchange.HistoricalForexService.Models
{
    public class ForexEntry
    {
        public ForexEntry(DateTime timestamp, float low, float high)
        {
            Timestamp = timestamp;
            Low = low;
            High = high;
        }

        public float Low { get; set; }
        public float High { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
