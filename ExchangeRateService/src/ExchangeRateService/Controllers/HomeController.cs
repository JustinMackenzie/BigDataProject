using Microsoft.AspNetCore.Mvc;

namespace ExchangeRateService.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}