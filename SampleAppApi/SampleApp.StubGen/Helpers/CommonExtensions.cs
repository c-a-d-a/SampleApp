using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using Microsoft.CodeAnalysis;
using Newtonsoft.Json.Serialization;

namespace SampleApp.StubGen.Helpers
{
    public static class CommonExtensions
    {
        private static readonly CamelCaseNamingStrategy CamelCaseNamingStrategy = new CamelCaseNamingStrategy();
        public static string ToCamelCase(this string pascalCaseName)
        {
            return Char.ToLowerInvariant(pascalCaseName[0]) + pascalCaseName.Substring(1);
        }

        public static string ToJsonPropName(this string propName)
        {
            return CamelCaseNamingStrategy.GetPropertyName(propName, false);
        }

        public static string ToTsInterfaceName(this string className)
        {
            return $"I{className}";
        }

        public static string ToTsInterfaceName(this SyntaxToken token)
        {
            return token.Text.ToTsInterfaceName();
        }

        public static string ToSentence(this SyntaxToken token)
        {
            return Regex.Replace(token.Text, "[a-z][A-Z]", m => $"{m.Value[0]} {char.ToLower(m.Value[1])}");
        }

        public static void AddRange<T>(this HashSet<T> set, IEnumerable<T> col)
        {
            foreach (T item in col)
            {
                set.Add(item);
            }
        }
    }
}
