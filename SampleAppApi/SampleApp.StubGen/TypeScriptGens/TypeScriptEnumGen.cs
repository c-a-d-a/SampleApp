using System.Linq;
using System.Text;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using SampleApp.StubGen.Helpers;

namespace SampleApp.StubGen.TypeScriptGens
{
    public class TypeScriptEnumGen
    {
        public EnumDeclarationSyntax EnumDeclarationSyntax { get; }
        public string EnumName => EnumDeclarationSyntax.Identifier.Text.ToCamelCase();

        public EnumMemberDeclarationSyntax[] Fields => EnumDeclarationSyntax.Members.ToArray();

        public TypeScriptEnumGen(EnumDeclarationSyntax enumDeclarationSyntax)
        {
            EnumDeclarationSyntax = enumDeclarationSyntax;
        }

        public string Generate()
        {
            StringBuilder sb = new StringBuilder();

            sb.AppendLine($"  static get {EnumName}(): IEnumDefinition[] {{"); // getter
            sb.AppendLine("    return [");

            foreach (EnumMemberDeclarationSyntax field in Fields)
            {
                var enumMemberGen = new TypeScriptEnumMemberGen(field);
                sb.AppendLine($"      {enumMemberGen.Generate()},");
            }

            sb.AppendLine("    ];");
            sb.AppendLine("  }"); // end of getter

            return sb.ToString();
        }
    }
}