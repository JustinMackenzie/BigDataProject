using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StockExchange.HistoricalForexService.Models;

namespace StockExchange.HistoricalForexService.Repositories
{
    public interface IForexEntryRepository
    {
        /// <summary>
        /// Gets all between date times given.
        /// </summary>
        /// <param name="exchangeCode"></param>
        /// <param name="from">From.</param>
        /// <param name="to">To.</param>
        /// <returns></returns>
        IEnumerable<ForexEntry> GetAllBetween(string exchangeCode, DateTime from, DateTime to);

        /// <summary>
        /// Gets all daily averages between.
        /// </summary>
        /// <param name="exchangeCode">The exchange code.</param>
        /// <param name="from">From.</param>
        /// <param name="to">To.</param>
        /// <returns></returns>
        IEnumerable<ForexEntry> GetAllDailyAveragesBetween(string exchangeCode, DateTime from, DateTime to);
    }
}
