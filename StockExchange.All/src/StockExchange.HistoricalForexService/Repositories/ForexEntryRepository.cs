using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Encodings.Web;
using CloudantDotNet.Models;
using Newtonsoft.Json;
using StockExchange.HistoricalForexService.Models;

namespace StockExchange.HistoricalForexService.Repositories
{
    public class ForexEntryRepository : IForexEntryRepository
    {
        /// <summary>
        /// The cloudant creds
        /// </summary>
        private readonly Creds cloudantCreds;

        /// <summary>
        /// Initializes a new instance of the <see cref="ForexEntryRepository"/> class.
        /// </summary>
        /// <param name="cloudantCreds">The cloudant creds.</param>
        public ForexEntryRepository(Creds cloudantCreds)
        {
            this.cloudantCreds = cloudantCreds;
        }

        /// <summary>
        /// Gets all between.
        /// </summary>
        /// <param name="exchangeCode">The exchange code.</param>
        /// <param name="from">From.</param>
        /// <param name="to">To.</param>
        /// <returns></returns>
        public IEnumerable<ForexEntry> GetAllBetween(string exchangeCode, DateTime @from, DateTime to)
        {
            using (var client = CloudantClient())
            {
                string selector = BuildSelectorString(from, to);
                var response = client.PostAsync($"{exchangeCode}/_find", new StringContent(selector, Encoding.UTF8, "application/json")).Result;

                if (response.IsSuccessStatusCode)
                {
                    CloudantQueryResponse cloundantResponse =
                        JsonConvert.DeserializeObject<CloudantQueryResponse>(
                            response.Content.ReadAsStringAsync().Result);
                    return cloundantResponse.Documents.Select(d => d.ToForexEntry());
                }

                string msg = "Failure to GET. Status Code: " + response.StatusCode + ". Reason: " + response.ReasonPhrase;
                throw new Exception(msg);
            }
        }

        public IEnumerable<ForexEntry> GetAllDailyAveragesBetween(string exchangeCode, DateTime @from, DateTime to)
        {
            using (var client = CloudantClient())
            {
                string selector = BuildSelectorString(from, to);
                var response = client.PostAsync($"{exchangeCode}_daily_avg/_find", new StringContent(selector, Encoding.UTF8, "application/json")).Result;

                if (response.IsSuccessStatusCode)
                {
                    CloudantQueryResponse cloundantResponse =
                        JsonConvert.DeserializeObject<CloudantQueryResponse>(
                            response.Content.ReadAsStringAsync().Result);
                    return cloundantResponse.Documents.Select(d => d.ToForexEntry());
                }

                string msg = "Failure to GET. Status Code: " + response.StatusCode + ". Reason: " + response.ReasonPhrase;
                throw new Exception(msg);
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

        private string BuildSelectorString(DateTime from, DateTime to)
        {
            return "{\"selector\": {\"Timestamp\": {\"$gt\": " + from.Ticks + ", \"$lt\": " + to.Ticks + "}}, \"sort\": [{\"Timestamp\": \"asc\"}]}";
        }
    }

    public class CloudantQueryResponse
    {
        [JsonProperty(PropertyName = "docs")]
        public List<CloudantForexEntry> Documents { get; set; }
    }

    public class CloudantForexEntry
    {
        public float Low { get; set; }
        public float High { get; set; }
        public long Timestamp { get; set; }

        public ForexEntry ToForexEntry()
        {
            return new ForexEntry(new DateTime(Timestamp), Low, High);
        }
    }
}
