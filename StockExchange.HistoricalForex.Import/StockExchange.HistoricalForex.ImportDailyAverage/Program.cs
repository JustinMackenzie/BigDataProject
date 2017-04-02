using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using Newtonsoft.Json;

namespace StockExchange.HistoricalForex.ImportDailyAverage
{
    class Program
    {
        static void Main(string[] args)
        {
            string folderPath = args[0];
            Creds creds = new Creds
            {
                host = "84dc23c9-0d9c-4e8b-a186-079196664732-bluemix.cloudant.com",
                password = "94fa9faea4c787f4ad05ceec3d08494586993f7668b862851e572850242991f2",
                username = "84dc23c9-0d9c-4e8b-a186-079196664732-bluemix"
            };
            CloudantBulkUploader uploader = new CloudantBulkUploader(creds);

            IEnumerable<string> files = Directory.GetFiles(folderPath, "*.csv").OrderBy(s => s);

            Console.WriteLine("Starting file processing...");

            foreach (string file in files)
            {
                Dictionary<DateTime, List<ForexEntry>> monthlyEntries = new Dictionary<DateTime, List<ForexEntry>>();
                Console.WriteLine($"Processing file {file}...");
                using (StreamReader reader = new StreamReader(file))
                {
                    string line;

                    while ((line = reader.ReadLine()) != null)
                    {
                        string[] parts = line.Split(',');
                        DateTime timestamp = DateTime.ParseExact(parts[0], "yyyyMMdd HHmmssfff", CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal);

                        ForexEntry entry = new ForexEntry(timestamp.Ticks, float.Parse(parts[1]), float.Parse(parts[2]));

                        DateTime timestampDate = timestamp.Date;

                        if (monthlyEntries.ContainsKey(timestampDate))
                        {
                            monthlyEntries[timestampDate].Add(entry);
                        }
                        else
                        {
                            monthlyEntries.Add(timestampDate, new List<ForexEntry> { entry });
                        }
                    }

                    List<ForexEntry> monthlyAverages = new List<ForexEntry>();

                    foreach (DateTime date in monthlyEntries.Keys.OrderBy(k => k))
                    {
                        var dayEntries = monthlyEntries[date];
                        monthlyAverages.Add(new ForexEntry
                        (
                            date.Ticks,
                            dayEntries.Average(e => e.Low),
                            dayEntries.Average(e => e.High)
                        ));
                    }
                    uploader.Upload(monthlyAverages);
                }
                Console.WriteLine("Finished proceessing...");
                Console.WriteLine("Uploading results to Cloudant...");
            }
        }
    }

    public class CloudantBulkUpload
    {
        [JsonProperty(PropertyName = "docs")]
        public IEnumerable<ForexEntry> Documents { get; set; }

        public CloudantBulkUpload(IEnumerable<ForexEntry> entries)
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
        public void Upload(List<ForexEntry> entries)
        {
            using (var client = CloudantClient())
            {
                IEnumerable<IEnumerable<ForexEntry>> chunks = entries.Chunk(10000);

                foreach (IEnumerable<ForexEntry> chunk in chunks)
                {
                    CloudantBulkUpload upload = new CloudantBulkUpload(chunk);
                    var response = client.PostAsync("usdcad_daily_avg/_bulk_docs", new StringContent(JsonConvert.SerializeObject(upload), Encoding.UTF8, "application/json")).Result;

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
