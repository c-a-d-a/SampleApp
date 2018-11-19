using System;
using System.Collections.Generic;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace SampleApp.StubGen
{
    public class DeclarationManager
    {
        #region Singleton impl

        private static DeclarationManager _instance;

        private DeclarationManager()
        {
        }

        public static DeclarationManager Instance => _instance ?? (_instance = new DeclarationManager());

        #endregion

        private Dictionary<string, ClassDeclarationSyntax> Classes { get; } =
            new Dictionary<string, ClassDeclarationSyntax>();

        private Dictionary<string, ClassDeclarationSyntax> AbstractClasses { get; } =
            new Dictionary<string, ClassDeclarationSyntax>();

        private Dictionary<string, InterfaceDeclarationSyntax> Interfaces { get; } =
            new Dictionary<string, InterfaceDeclarationSyntax>();

        private Dictionary<string, EnumDeclarationSyntax> Enums { get; } =
            new Dictionary<string, EnumDeclarationSyntax>();

        public void AddClass(ClassDeclarationSyntax syntax)
        {
            string className = syntax.Identifier.Text;
            if (Classes.ContainsKey(className))
                throw new ArgumentException($"Class: {className} already exist.");

            Classes.Add(className, syntax);
        }

        public void AddAbstractClass(ClassDeclarationSyntax syntax)
        {
            string className = syntax.Identifier.Text;
            if (AbstractClasses.ContainsKey(className))
                throw new ArgumentException($"Abstract Class: {className} already exist.");

            AbstractClasses.Add(className, syntax);
        }

        public void AddInterface(InterfaceDeclarationSyntax syntax)
        {
            string interfaceName = syntax.Identifier.Text;
            if (Interfaces.ContainsKey(interfaceName))
                throw new ArgumentException($"Interface: {interfaceName} already exist.");

            Interfaces.Add(interfaceName, syntax);
        }

        public void AddEnum(EnumDeclarationSyntax syntax)
        {
            string enumName = syntax.Identifier.Text;
            if (Enums.ContainsKey(enumName))
                throw new ArgumentException($"Enum: {enumName} already exist.");

            Enums.Add(enumName, syntax);
        }

        public bool TryGetClass(string className, out ClassDeclarationSyntax result) =>
            Classes.TryGetValue(className, out result);

        public bool TryGetAbstractClass(string abstractClassName, out ClassDeclarationSyntax result) =>
            AbstractClasses.TryGetValue(abstractClassName, out result);

        public bool TryGetInterface(string interfaceName, out InterfaceDeclarationSyntax result) =>
            Interfaces.TryGetValue(interfaceName, out result);

        public bool TryGetEnum(string enumName, out EnumDeclarationSyntax result) =>
            Enums.TryGetValue(enumName, out result);

        public bool IsClass(string name) => Classes.ContainsKey(name);
        public bool IsAbstractClass(string name) => AbstractClasses.ContainsKey(name);
        public bool IsEnum(string name) => Enums.ContainsKey(name);
        public bool IsInterface(string name) => Interfaces.ContainsKey(name);
    }
}