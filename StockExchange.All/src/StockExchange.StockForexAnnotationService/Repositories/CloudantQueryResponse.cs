using System.Collections.Generic;
using Newtonsoft.Json;

namespace StockExchange.StockForexAnnotationService.Repositories
{
    public class CloudantQueryResponse
    {
        [JsonProperty(PropertyName = "docs")]
        public List<CloudantStockForexEntry> Documents { get; set; }
    }
}