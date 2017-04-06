using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Newtonsoft.Json;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using StockExchange.StockForexAnnotationService.Repositories;

namespace CloudantDotNet
{
    public class Startup
    {
        public IConfiguration Configuration { get; set; }

        public Startup(IHostingEnvironment env)
        {
            var configBuilder = new ConfigurationBuilder()
                .AddJsonFile("vcap-local.json", optional: true);
            Configuration = configBuilder.Build();

            string vcapServices = System.Environment.GetEnvironmentVariable("VCAP_SERVICES");
            if (vcapServices != null)
            {
                dynamic json = JsonConvert.DeserializeObject(vcapServices);
                foreach (dynamic obj in json.Children())
                {
                    if (((string)obj.Name).ToLowerInvariant().Contains("cloudant"))
                    {
                        dynamic credentials = (((JProperty)obj).Value[0] as dynamic).credentials;
                        if (credentials != null)
                        {
                            string host = credentials.host;
                            string username = credentials.username;
                            string password = credentials.password;
                            Configuration["cloudantNoSQLDB:0:credentials:username"] = username;
                            Configuration["cloudantNoSQLDB:0:credentials:password"] = password;
                            Configuration["cloudantNoSQLDB:0:credentials:host"] = host;
                            break;
                        }
                    }
                }
            }
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    p => p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader().AllowCredentials());
            });

            // works with VCAP_SERVICES JSON value added to vcap-local.json when running locally,
            // and works with actual VCAP_SERVICES env var based on configuration set above when running in CF
            var creds = new CloudantDotNet.Models.Creds()
            {
                username = Configuration["cloudantNoSQLDB:0:credentials:username"],
                password = Configuration["cloudantNoSQLDB:0:credentials:password"],
                host = Configuration["cloudantNoSQLDB:0:credentials:host"]
            };
            services.AddSingleton(typeof(CloudantDotNet.Models.Creds), creds);
            services.AddTransient<IStockForexRepository, StockForexRepository>();
        }

        public void Configure(IApplicationBuilder app, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole();
            app.UseCors("AllowAll");
            app.UseDeveloperExceptionPage();
            app.UseStaticFiles();
            app.UseMvcWithDefaultRoute();
        }

        public static void Main(string[] args)
        {
            var config = new ConfigurationBuilder()
                .AddCommandLine(args)
                .Build();

            var host = new WebHostBuilder()
                        .UseKestrel()
                        .UseConfiguration(config)
                        .UseStartup<Startup>()
                        .Build();

            host.Run();
        }
    }
}