using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using CloudantDotNet.Models;
using Newtonsoft.Json;
using StockExchange.StockForexAnnotationService.Controllers;

namespace StockExchange.StockForexAnnotationService.Repositories
{
    public class StockForexRepository : IStockForexRepository
    {
        /// <summary>
        /// The cloudant creds
        /// </summary>
        private readonly Creds cloudantCreds;

        /// <summary>
        /// Gets all daily average stock between.
        /// </summary>
        /// <param name="exchangeCode">The exchange code.</param>
        /// <param name="fromDate">From date.</param>
        /// <param name="toDate">To date.</param>
        /// <returns></returns>
        /// <exception cref="System.Exception"></exception>
        public IEnumerable<AverageStockForexEntry> GetAllDailyAverageStockBetween(string exchangeCode, DateTime fromDate, DateTime toDate)
        {
            using (var client = CloudantClient())
            {
                string selector = BuildSelectorString(fromDate, toDate);
                var response = client.PostAsync("stock_forex_daily/_find", new StringContent(selector, Encoding.UTF8, "application/json")).Result;

                if (response.IsSuccessStatusCode)
                {
                    CloudantQueryResponse cloundantResponse =
                        JsonConvert.DeserializeObject<CloudantQueryResponse>(
                            response.Content.ReadAsStringAsync().Result);
                    return cloundantResponse.Documents.Select(d => d.ToAverageStockForexEntry());
                }

                string msg = "Failure to GET. Status Code: " + response.StatusCode + ". Reason: " + response.ReasonPhrase;
                throw new Exception(msg);
            }
        }

        public IEnumerable<TotalStockForexEntry> GetAllTotalStockForexEntries(string exchangeCode, DateTime fromDate, DateTime toDate)
        {
            using (var client = CloudantClient())
            {
                string selector = BuildSelectorString(fromDate, toDate);
                var response = client.PostAsync("stock_forex_daily/_find", new StringContent(selector, Encoding.UTF8, "application/json")).Result;

                if (response.IsSuccessStatusCode)
                {
                    CloudantQueryResponse cloundantResponse =
                        JsonConvert.DeserializeObject<CloudantQueryResponse>(
                            response.Content.ReadAsStringAsync().Result);
                    return cloundantResponse.Documents.Select(d => d.ToTotalStockForexEntry());
                }

                string msg = "Failure to GET. Status Code: " + response.StatusCode + ". Reason: " + response.ReasonPhrase;
                throw new Exception(msg);
            }
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="ForexEntryRepository"/> class.
        /// </summary>
        /// <param name="cloudantCreds">The cloudant creds.</param>
        public StockForexRepository(Creds cloudantCreds)
        {
            this.cloudantCreds = cloudantCreds;
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
            return "{\"selector\": {\"Timestamp\": {\"$gte\": " + from.Ticks + ", \"$lte\": " + to.Ticks + "}}, \"sort\": [{\"Timestamp\": \"asc\"}]}";
        }
    }
}
