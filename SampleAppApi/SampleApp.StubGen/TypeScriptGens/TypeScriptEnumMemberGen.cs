using Microsoft.CodeAnalysis.CSharp.Syntax;
using SampleApp.StubGen.Helpers;

namespace SampleApp.StubGen.TypeScriptGens
{
    public class TypeScriptEnumMemberGen
    {
        public EnumMemberDeclarationSyntax EnumMemberDeclarationSyntax { get; }
        public int IntValue { get; }
        public string DisplayName { get; private set; }
        public string ColorName { get; private set; }

        public TypeScriptEnumMemberGen(EnumMemberDeclarationSyntax enumMemberDeclarationSyntax)
        {
            EnumMemberDeclarationSyntax = enumMemberDeclarationSyntax;
            IntValue = int.Parse(((LiteralExpressionSyntax) (EnumMemberDeclarationSyntax.EqualsValue.Value)).Token
                .Text);
            SetProps();
        }

        private void SetProps()
        {
            foreach (AttributeListSyntax attributeList in EnumMemberDeclarationSyntax.AttributeLists)
            {
                var att = attributeList.Attributes.FirstOrDefault();
                var attArg = att.ArgumentList.Arguments.FirstOrDefault();

                var attName = ((IdentifierNameSyntax) att.Name).Identifier.Text;
                if (attName == "Display")
                {
                    DisplayName = ((LiteralExpressionSyntax) (attArg.Expression)).Token.Text;
                }
                else if (attName == "EnumColor")
                {
                    ColorName = $"\"{((MemberAccessExpressionSyntax) (attArg.Expression)).Name.Identifier.Text}\"";
                }
            }

            if (DisplayName == null)
                DisplayName = $"\"{EnumMemberDeclarationSyntax.Identifier.ToSentence()}\"";

            if (ColorName == null)
                ColorName = "\"Black\"";
        }

        public string Generate()
        {
            return $@"{{ value: {IntValue}, display: {DisplayName}, color: {ColorName} }}";
        }
    }
}