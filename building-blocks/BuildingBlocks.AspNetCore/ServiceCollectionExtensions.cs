using BuildingBlocks.Core;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace BuildingBlocks.AspNetCore
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddValidation(this IServiceCollection services, Type type)
        {
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

            foreach (var requestType in GetAllTypesImplementingOpenGenericType(typeof(IRequest<>), type.Assembly))
            {
                var validatorType = typeof(IValidator<>).MakeGenericType(requestType);

                foreach (var validatorImpl in Assembly.GetExecutingAssembly().GetTypes().Where(v => validatorType.IsAssignableFrom(v)))
                {
                    services.AddTransient(validatorType, validatorImpl);
                }
            }
            return services;
        }

        public static IEnumerable<Type> GetAllTypesImplementingOpenGenericType(Type openGenericType, Assembly assembly)
        {
            return from types in assembly.GetTypes()
                   from interfaces in types.GetInterfaces()
                   let baseType = types.BaseType
                   where
                   (baseType != null && baseType.IsGenericType &&
                   openGenericType.IsAssignableFrom(baseType.GetGenericTypeDefinition())) ||
                   (interfaces.IsGenericType &&
                   openGenericType.IsAssignableFrom(interfaces.GetGenericTypeDefinition()))
                   select types;
        }
    }
}
