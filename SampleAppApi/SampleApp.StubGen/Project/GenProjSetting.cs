namespace SampleApp.StubGen.Project
{
    public class GenProjSetting
    {
        public string Project { get; set; }
        public string[] Identifiers { get; set; }

        public GenProjSetting(string project, params string[] identifierNames)
        {
            Project = project;
            Identifiers = identifierNames;
        }
    }
}