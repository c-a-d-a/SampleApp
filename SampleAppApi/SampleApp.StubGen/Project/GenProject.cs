using System.Linq;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using CSharpExtensions = Microsoft.CodeAnalysis.CSharpExtensions;

namespace SampleApp.StubGen.Project
{
    public class GenProject
    {
        public GenProjSetting GenProjSetting { get; }
        private Microsoft.CodeAnalysis.Project _project;

        public GenProject(GenProjSetting genProjSetting)
        {
            GenProjSetting = genProjSetting;
        }

        public void Compile(Microsoft.CodeAnalysis.Project project)
        {
            _project = project;

            foreach (var document in _project.Documents)
            {
                var tree = document.GetSyntaxTreeAsync().Result;
                foreach (var type in tree.GetRoot().DescendantNodes())
                {
                    switch (type)
                    {
                        case ClassDeclarationSyntax syntax:
                            if (syntax.Modifiers.Any(x => CSharpExtensions.IsKind((SyntaxToken) x, SyntaxKind.AbstractKeyword)))
                                DeclarationManager.Instance.AddAbstractClass(syntax);
                            else
                                DeclarationManager.Instance.AddClass(syntax);

                            break;

                        case InterfaceDeclarationSyntax syntax:
                            DeclarationManager.Instance.AddInterface(syntax);
                            break;

                        case EnumDeclarationSyntax syntax:
                            DeclarationManager.Instance.AddEnum(syntax);
                            break;
                    }
                }
            }
        }
    }
}