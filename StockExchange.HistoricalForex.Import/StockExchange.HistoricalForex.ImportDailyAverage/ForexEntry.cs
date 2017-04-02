namespace StockExchange.HistoricalForex.ImportDailyAverage
{
    public class ForexEntry
    {
        public float Low { get; set; }
        public float High { get; set; }
        public long Timestamp { get; set; }

        public ForexEntry(long timestamp, float low, float high)
        {
            this.Timestamp = timestamp;
            this.Low = low;
            this.High = high;
        }
    }
}