using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using Newtonsoft.Json;

namespace StockExchange.HistoricalForex.Import
{
    class Program
    {
        static void Main(string[] args)
        {
            string folderPath = args[0];

            IEnumerable<string> files = Directory.GetFiles(folderPath, "*.csv").OrderBy(s => s);

            Console.WriteLine("Starting file processing...");

            foreach (string file in files)
            {
                FileInfo fileInfo = new FileInfo(file);
                List<ForexEntry> entries = new List<ForexEntry>();
                Console.WriteLine($"Processing file {file}...");
                using (StreamReader reader = new StreamReader(file))
                {
                    string line;

                    while ((line = reader.ReadLine()) != null)
                    {
                        string[] parts = line.Split(',');
                        DateTime timestamp = DateTime.ParseExact(parts[0], "yyyyMMdd HHmmssfff", CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal);
                        entries.Add(new ForexEntry(timestamp, float.Parse(parts[1]), float.Parse(parts[2])));
                    }
                }

                Console.WriteLine("Finished proceessing...");
                Console.WriteLine("Outputting JSON file...");
                string json = JsonConvert.SerializeObject(entries);
                File.WriteAllText($"{fileInfo.Name.Replace(fileInfo.Extension, string.Empty)}.json", json);
            }
        }
    }
}
