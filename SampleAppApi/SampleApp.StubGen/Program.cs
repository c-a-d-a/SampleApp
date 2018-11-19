using System;
using System.IO;
using SampleApp.DataAccess.Dtos.Security;
using SampleApp.StubGen.Project;

//using CodeAnalysisProject = Microsoft.CodeAnalysis.Project;
//https://msdn.microsoft.com/en-us/magazine/mt790203.aspx
//https://github.com/daveaglick/Buildalyzer

namespace SampleApp.StubGen
{
    class Program
    {
        public static GenProjSetting[] GetGenProjSettings = new[]
        {
            new GenProjSetting(
                "SampleApp.DataAccess"
                , nameof(AppUserDto)
                , nameof(ApiErrorDto)
            ),
        };

        static void Main(string[] args)
        {
            File.WriteAllText("clientStub.ts", StubGenService.Generate(args[0]));
            Console.WriteLine("Done.");
            Console.WriteLine("Press any key to exit.");
            Console.ReadKey();
        }
    }
}