using System;

namespace StockExchange.HistoricalForex.Import
{
    public class ForexEntry
    {
        public float Low { get; set; }
        public float High { get; set; }
        public DateTime Timestamp { get; set; }

        public ForexEntry(DateTime timestamp, float low, float high)
        {
            this.Timestamp = timestamp;
            this.Low = low;
            this.High = high;
        }
    }
}