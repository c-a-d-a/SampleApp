using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Buildalyzer;
using Buildalyzer.Workspaces;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using SampleApp.StubGen.Helpers;
using SampleApp.StubGen.TypeScriptGens;

namespace SampleApp.StubGen.Project
{
    // TODO: Add support for namespace, currently same name of class wont work here
    public class GenProjectManager
    {
        private readonly GenProject[] _genProjects;
        private AnalyzerManager _analyzerManager;
        private AdhocWorkspace _workspace;

        public GenProjSetting[] GenProjSettings { get; }
        public string SolutionFilePath { get; }

        public HashSet<string> Generated { get; } = new HashSet<string>();
        public HashSet<string> RefBasedClasses { get; } = new HashSet<string>();
        public HashSet<string> RefClasses { get; } = new HashSet<string>();
        public HashSet<string> RefEnums { get; } = new HashSet<string>();

        public GenProjectManager(GenProjSetting[] genProjSettings, string solutionFilePath)
        {
            GenProjSettings = genProjSettings;
            SolutionFilePath = solutionFilePath;
            _genProjects = GenProjSettings.Select(p => new GenProject(p)).ToArray();
        }

        public GenProjectManager Compile()
        {
            _analyzerManager = new AnalyzerManager(SolutionFilePath);
            _workspace = new AdhocWorkspace();

            foreach (GenProject genProject in _genProjects)
            {
                genProject.Compile(GetRoslynProject(genProject));
            }

            return this;
        }

        private Microsoft.CodeAnalysis.Project GetRoslynProject(GenProject genProject)
        {
            string proj = genProject.GenProjSetting.Project;
            var analyzerKey = _analyzerManager.Projects.Keys
                .FirstOrDefault(key => key.Contains($"{proj}.csproj"));

            if (analyzerKey == null)
                throw new InvalidOperationException($"Project: {proj} not found.");

            ProjectAnalyzer analyzer = _analyzerManager.Projects[analyzerKey];
            Microsoft.CodeAnalysis.Project roslynProject = analyzer.AddToWorkspace(_workspace);
            return roslynProject;
        }

        public string Generate()
        {
            var sb = new StringBuilder();
            foreach (GenProject genProject in _genProjects)
            {
                foreach (string identifier in genProject.GenProjSetting.Identifiers)
                {
                    if (DeclarationManager.Instance.TryGetClass(identifier, out var syntax) &&
                        !Generated.Contains(identifier))
                    {
                        sb.AppendLine(GenerateTsClass(syntax));
                        sb.AppendLine();
                    }
                }
            }

            while (true)
            {
                var refBaseClassToGenerate = RefBasedClasses.Except(Generated).ToArray();
                if (refBaseClassToGenerate.Length == 0)
                    break;

                foreach (string abstractClassName in refBaseClassToGenerate)
                {
                    DeclarationManager.Instance.TryGetAbstractClass(abstractClassName, out var syntax);
                    if (!Generated.Contains(abstractClassName))
                    {
                        sb.AppendLine(GenerateTsClass(syntax));
                        sb.AppendLine();
                    }
                }
            }

            while (true)
            {
                var refClassToGenerate = RefClasses.Except(Generated).ToArray();
                if (refClassToGenerate.Length == 0)
                    break;

                foreach (string className in refClassToGenerate)
                {
                    DeclarationManager.Instance.TryGetClass(className, out var syntax);
                    if (!Generated.Contains(className))
                    {
                        sb.AppendLine(GenerateTsClass(syntax));
                        sb.AppendLine();
                    }
                }
            }

            sb.AppendLine(
                @"export interface IEnumDefinition {
  value: number;
  display: string;
  color: string;
}
");
            sb.AppendLine("export class Enums {");

            foreach (string refEnum in RefEnums)
            {
                DeclarationManager.Instance.TryGetEnum(refEnum, out var syntax);
                if (!Generated.Contains(refEnum))
                {
                    sb.AppendLine(GenerateTsEnum(refEnum, syntax));
                }
            }

            sb.AppendLine("}"); // end of class
            // TODO: Generate enums with colors for SASS

            return sb.ToString();
        }

        private string GenerateTsClass(ClassDeclarationSyntax classSyntax)
        {
            var tsClassGen = new TypeScriptClassGen(classSyntax);
            string generatedClass = tsClassGen.Generate();

            Generated.Add(tsClassGen.ClassName);
            RefBasedClasses.AddRange(tsClassGen.ReferencedBaseClasses);
            RefClasses.AddRange(tsClassGen.ReferencedClasses);
            RefEnums.AddRange(tsClassGen.ReferencedEnums);

            return generatedClass;
        }

        private string GenerateTsEnum(string enumName, EnumDeclarationSyntax syntax)
        {
            var enumGen = new TypeScriptEnumGen(syntax);
            string generatedEnum = enumGen.Generate();

            Generated.Add(enumName);

            return generatedEnum;
        }
    }
}