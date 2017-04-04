using System;
using System.Collections.Generic;
using StockExchange.StockForexAnnotationService.Controllers;

namespace StockExchange.StockForexAnnotationService.Repositories
{
    public interface IStockForexRepository
    {
        IEnumerable<AverageStockForexEntry> GetAllDailyAverageStockBetween(string exchangeCode, DateTime fromDate, DateTime toDate);
    }
}
