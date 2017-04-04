using System;
using System.Collections.Generic;
using System.Globalization;
using Microsoft.AspNetCore.Mvc;
using StockExchange.StockForexAnnotationService.Repositories;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace StockExchange.StockForexAnnotationService.Controllers
{
    [Route("api/[controller]")]
    public class EntryController : Controller
    {
        /// <summary>
        /// The repository
        /// </summary>
        private readonly IStockForexRepository repository;

        /// <summary>
        /// Initializes a new instance of the <see cref="EntryController"/> class.
        /// </summary>
        /// <param name="repository">The repository.</param>
        public EntryController(IStockForexRepository repository)
        {
            this.repository = repository;
        }

        [HttpGet]
        [Route("/api/dailyAverage")]
        public IEnumerable<AverageStockForexEntry> GetDailyAverageEntries(string conv, string from, string to)
        {
            DateTime fromDate = DateTime.ParseExact(from, "yyyyMMdd", CultureInfo.InvariantCulture);
            DateTime toDate = DateTime.ParseExact(to, "yyyyMMdd", CultureInfo.InvariantCulture);

            return this.repository.GetAllDailyAverageStockBetween(conv, fromDate, toDate);
        }
    }
}
