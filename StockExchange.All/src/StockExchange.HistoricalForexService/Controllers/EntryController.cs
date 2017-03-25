using System;
using System.Collections.Generic;
using System.Globalization;
using Microsoft.AspNetCore.Mvc;
using StockExchange.HistoricalForexService.Models;
using StockExchange.HistoricalForexService.Repositories;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace StockExchange.HistoricalForexService.Controllers
{
    [Route("api/[controller]")]
    public class EntryController : Controller
    {
        /// <summary>
        /// The repository
        /// </summary>
        private readonly IForexEntryRepository repository;

        /// <summary>
        /// Initializes a new instance of the <see cref="EntryController"/> class.
        /// </summary>
        /// <param name="repository">The repository.</param>
        public EntryController(IForexEntryRepository repository)
        {
            this.repository = repository;
        }

        [HttpGet]
        [Route("/api/entries")]
        public IEnumerable<ForexEntry> GetEntries(string conv, string from, string to)
        {
            DateTime fromDate = DateTime.ParseExact(from, "yyyyMMdd HHmmssfff", CultureInfo.InvariantCulture);
            DateTime toDate = DateTime.ParseExact(to, "yyyyMMdd HHmmssfff", CultureInfo.InvariantCulture);

            return this.repository.GetAllBetween(conv, fromDate, toDate);
        }
    }
}
