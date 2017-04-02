using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using Newtonsoft.Json;

namespace StockExchange.Annotation.Import
{
    class Program
    {
        static void Main(string[] args)
        {
            string filePath = args[0];
            Creds creds = new Creds
            {
                host = "88a7de3d-5188-4295-aa0c-39d4da22f643-bluemix.cloudant.com",
                password = "4d32ed18e4636be102ad77c7d521543932629b88d9971ef5e2e4abf4c1708772",
                username = "88a7de3d-5188-4295-aa0c-39d4da22f643-bluemix"
            };
            CloudantBulkUploader uploader = new CloudantBulkUploader(creds);

            string forexFilePath = Path.Combine(filePath, "forex-avg.json");
            string stockFilePath = Path.Combine(filePath, "stock-avg.json");

            CloudantImport<ForexAverageEntry> forexEntries =
                JsonConvert.DeserializeObject<CloudantImport<ForexAverageEntry>>(File.ReadAllText(forexFilePath));
            CloudantImport<StockAverageEntry> stockEntries =
                JsonConvert.DeserializeObject<CloudantImport<StockAverageEntry>>(File.ReadAllText(stockFilePath));

            IEnumerable<ForexAverageEntry> forex = forexEntries.Documents.Select(d => d.Document);
            IEnumerable<StockAverageEntry> stock = stockEntries.Documents.Select(d => d.Document);

            List<StockForexEntry> entries = new List<StockForexEntry>();

            foreach (StockAverageEntry stockAverageEntry in stock.OrderBy(s => s.Date))
            {
                ForexAverageEntry forexEntry = forex.FirstOrDefault(f => f.Date == stockAverageEntry.Date);

                if (forexEntry == null)
                    continue;

                entries.Add(new StockForexEntry
                {
                    Timestamp = forexEntry.Timestamp,
                    ForexLowAverage = forexEntry.Low,
                    ForexHighAverage = forexEntry.High,
                    TotalSize = stockAverageEntry.TotalNumber,
                    Average = stockAverageEntry.Average,
                    TotalPrice = stockAverageEntry.TotalPrice                   
                });
            }

            uploader.Upload(entries);
        }
    }

    public class StockForexEntry
    {
        public float ForexLowAverage { get; set; }
        public float ForexHighAverage { get; set; }
        public long Timestamp { get; set; }
        public long TotalPrice { get; set; }
        public int Average { get; set; }
        public int TotalSize { get; set; }
    }

    public class CloudantImport<T>
    {
        [JsonProperty(PropertyName = "rows")]
        public List<CloudantRow<T>> Documents { get; set; }
    }

    public class CloudantRow<T>
    {
        [JsonProperty(PropertyName = "doc")]
        public T Document { get; set; }
    }

    public class ForexAverageEntry
    {
        public float High { get; set; }
        public float Low { get; set; }
        public long Timestamp { get; set; }

        public DateTime Date => new DateTime(Timestamp);
    }

    public class StockAverageEntry
    {
        [JsonProperty(PropertyName = "totalprize")]
        public long TotalPrice { get; set; }

        [JsonProperty(PropertyName = "totalnumber")]
        public int TotalNumber { get; set; }

        [JsonProperty(PropertyName = "average")]
        public int Average { get; set; }

        [JsonProperty(PropertyName = "day")]
        public string Day { get; set; }

        public DateTime Date => DateTime.ParseExact(Day, "yyyy-MM-dd", CultureInfo.InvariantCulture);
    }

    public class CloudantBulkUpload<T>
    {
        [JsonProperty(PropertyName = "docs")]
        public IEnumerable<T> Documents { get; set; }

        public CloudantBulkUpload(IEnumerable<T> entries)
        {
            Documents = entries;
        }
    }

    public class Creds
    {
        public string username { get; set; }
        public string password { get; set; }
        public string host { get; set; }
    }

    public class CloudantBulkUploader
    {
        private readonly Creds cloudantCreds;

        /// <summary>
        /// Initializes a new instance of the <see cref="CloudantBulkUploader"/> class.
        /// </summary>
        /// <param name="cloudantCreds">The cloudant creds.</param>
        public CloudantBulkUploader(Creds cloudantCreds)
        {
            this.cloudantCreds = cloudantCreds;
        }

        /// <summary>
        /// Uploads the specified upload.
        /// </summary>
        /// <param name="entries">The entries.</param>
        public void Upload<T>(List<T> entries)
        {
            using (var client = CloudantClient())
            {
                IEnumerable<IEnumerable<T>> chunks = entries.Chunk(10000);

                foreach (IEnumerable<T> chunk in chunks)
                {
                    CloudantBulkUpload<T> upload = new CloudantBulkUpload<T>(chunk);
                    var response = client.PostAsync("stock_forex_daily/_bulk_docs", new StringContent(JsonConvert.SerializeObject(upload), Encoding.UTF8, "application/json")).Result;

                    if (response.IsSuccessStatusCode)
                    {
                        continue;
                    }

                    string msg = "Failure to GET. Status Code: " + response.StatusCode + ". Reason: " + response.ReasonPhrase;
                    throw new Exception(msg);
                }
            }
        }

        private HttpClient CloudantClient()
        {
            if (cloudantCreds.username == null || cloudantCreds.password == null || cloudantCreds.host == null)
            {
                throw new Exception("Missing Cloudant NoSQL DB service credentials");
            }

            var auth = Convert.ToBase64String(Encoding.ASCII.GetBytes(cloudantCreds.username + ":" + cloudantCreds.password));

            HttpClient client = new HttpClient { BaseAddress = new Uri("https://" + cloudantCreds.host) };
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", auth);
            return client;
        }
    }

    public static class IEnumerableExtensions
    {
        public static IEnumerable<IEnumerable<T>> Chunk<T>(this IEnumerable<T> source, int chunksize)
        {
            while (source.Any())
            {
                yield return source.Take(chunksize);
                source = source.Skip(chunksize);
            }
        }
    }
}
