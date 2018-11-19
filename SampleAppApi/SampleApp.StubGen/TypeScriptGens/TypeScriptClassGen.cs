using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using SampleApp.StubGen.Helpers;

namespace SampleApp.StubGen.TypeScriptGens
{
    public class TypeScriptClassGen
    {
        public ClassDeclarationSyntax ClassDeclarationSyntax { get; }
        public string ClassName => ClassDeclarationSyntax.Identifier.Text;

        public PropertyDeclarationSyntax[] PropertyDeclarationSyntaxes =>
            ClassDeclarationSyntax.Members.OfType<PropertyDeclarationSyntax>().ToArray();

        public List<string> ReferencedBaseClasses { get; } = new List<string>();
        public List<string> ReferencedClasses { get; } = new List<string>();
        public List<string> ReferencedEnums { get; } = new List<string>();

        public TypeScriptClassGen(ClassDeclarationSyntax classDeclarationSyntax)
        {
            ClassDeclarationSyntax =
                classDeclarationSyntax ?? throw new ArgumentNullException(nameof(classDeclarationSyntax));
        }

        public string Generate()
        {
            StringBuilder sb = new StringBuilder();

            sb.Append($"export interface {ClassName.ToTsInterfaceName()} ");
            sb.Append(GenerateBaseExtensionsCode());
            sb.AppendLine(" {");

            foreach (PropertyDeclarationSyntax prop in PropertyDeclarationSyntaxes)
            {
                if (prop.Modifiers.Any(s => s.IsKind(SyntaxKind.PrivateKeyword)))
                    continue;

                sb.Append($"  {prop.Identifier.Text.ToJsonPropName()}: ");
                string tsTypeEquivalent = null;
                switch (prop.Type)
                {
                    case PredefinedTypeSyntax predefinedTypeSyntax:
                        tsTypeEquivalent = GetEquivalentTsType(predefinedTypeSyntax);
                        break;
                    case IdentifierNameSyntax identifierNameSyntax:
                        tsTypeEquivalent = GetEquivalentTsType(identifierNameSyntax);
                        break;
                    case GenericNameSyntax genericNameSyntax:
                        tsTypeEquivalent = GetEquivalentTsType(genericNameSyntax);
                        break;
                    case NullableTypeSyntax nullableTypeSyntax:
                        tsTypeEquivalent = GetEquivalentTsType(nullableTypeSyntax);
                        break;
                    case ArrayTypeSyntax arrayTypeSyntax:
                        tsTypeEquivalent = GetEquivalentTsType(arrayTypeSyntax);
                        break;
                    case QualifiedNameSyntax qualifiedNameSyntax:
                    case SimpleNameSyntax simpleNameSyntax:
                    case NameSyntax nameSyntax:
                    default:
                        throw new NotImplementedException($"{prop.Type} is not yet supported.");
                }

                sb.AppendLine($"{tsTypeEquivalent};");
            }

            sb.AppendLine("}");

            return sb.ToString();
        }

        private string GenerateBaseExtensionsCode()
        {
            StringBuilder sb = new StringBuilder();

            if (ClassDeclarationSyntax.BaseList?.Types != null)
            {
                foreach (BaseTypeSyntax baseSyntax in ClassDeclarationSyntax.BaseList.Types)
                {
                    if (baseSyntax is SimpleBaseTypeSyntax baseTypeSyntax)
                    {
                        var baseName = ((IdentifierNameSyntax) baseTypeSyntax.Type).Identifier.Text;

                        // We are only after classes and abstract classes as they may contain properties on their own
                        if (DeclarationManager.Instance.IsAbstractClass(baseName) ||
                            DeclarationManager.Instance.IsClass(baseName))
                        {
                            ReferencedBaseClasses.Add(baseName);
                        }
                    }
                }
            }

            if (ReferencedBaseClasses.Count > 0)
            {
                sb.Append("extends ");
                sb.Append(string.Join(", ", ReferencedBaseClasses.Select(c => c.ToTsInterfaceName())));
            }

            return sb.ToString();
        }

        private string GetEquivalentTsType(PredefinedTypeSyntax predefinedTypeSyntax)
        {
            SyntaxKind returnType = predefinedTypeSyntax.Keyword.Kind();
            switch (returnType)
            {
                case SyntaxKind.IntKeyword:
                case SyntaxKind.DecimalKeyword:
                case SyntaxKind.DoubleKeyword:
                case SyntaxKind.ByteKeyword:
                case SyntaxKind.LongKeyword:
                    return "number";
                case SyntaxKind.StringKeyword:
                    return "string";
                case SyntaxKind.BoolKeyword:
                    return "boolean";
                default:
                    throw new NotImplementedException($"{returnType} is not yet supported.");
            }
        }

        private string GetEquivalentTsType(IdentifierNameSyntax identifierNameSyntax)
        {
            string identifier = identifierNameSyntax.Identifier.Text;

            // if this is enum, then just return number
            if (DeclarationManager.Instance.IsEnum(identifier))
            {
                ReferencedEnums.Add(identifier);
                return "number";
            }
            else if (DeclarationManager.Instance.IsClass(identifier))
            {
                ReferencedClasses.Add(identifier);
                return identifier.ToTsInterfaceName();
            }
            else if (identifier == "DateTime")
            {
                return "Date";
            }
            else if (identifier == "Decimal")
            {
                return "number";
            }
            else
            {
                throw new NotImplementedException($"{identifier} not found.");
            }
        }

        private string GetEquivalentTsType(GenericNameSyntax genericNameSyntax)
        {
            string identifier = genericNameSyntax.Identifier.Text;
            if (identifier == "ICollection")
            {
                string tsTypeEquivalent =
                    GetEquivalentTsTypeFromTypeSyntax(genericNameSyntax.TypeArgumentList.Arguments.First());
                return $"{tsTypeEquivalent}[]";
            }

            throw new NotImplementedException($"{identifier} is not yet supported.");
        }

        private string GetEquivalentTsType(NullableTypeSyntax nullableTypeSyntax)
        {
            string tsTypeEquivalent = GetEquivalentTsTypeFromTypeSyntax(nullableTypeSyntax.ElementType);
            return $"{tsTypeEquivalent} | null";
        }

        private string GetEquivalentTsType(ArrayTypeSyntax arrayTypeSyntax)
        {
            string tsTypeEquivalent = GetEquivalentTsTypeFromTypeSyntax(arrayTypeSyntax.ElementType);
            return $"{tsTypeEquivalent}[]";
        }

        private string GetEquivalentTsTypeFromTypeSyntax(TypeSyntax typeSyntax)
        {
            string tsTypeEquivalent = null;
            switch (typeSyntax)
            {
                case PredefinedTypeSyntax predefinedTypeSyntax:
                    tsTypeEquivalent = GetEquivalentTsType(predefinedTypeSyntax);
                    break;
                case IdentifierNameSyntax identifierNameSyntax:
                    tsTypeEquivalent = GetEquivalentTsType(identifierNameSyntax);
                    break;
                default:
                    throw new NotImplementedException($"{typeSyntax} is not yet supported.");
            }

            return tsTypeEquivalent;
        }
    }
}