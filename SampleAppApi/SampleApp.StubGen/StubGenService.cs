using SampleApp.StubGen.Project;

namespace SampleApp.StubGen
{
    public static class StubGenService
    {
        public static string Generate(string solutionFilePath) =>
            (new GenProjectManager(Program.GetGenProjSettings, solutionFilePath)).Compile().Generate();
    }
}