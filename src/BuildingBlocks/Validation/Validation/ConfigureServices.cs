// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using MediatR;
using Validation;

namespace Microsoft.Extensions.DependencyInjection;

public static class ConfigureServices
{
    public static void AddValidation(this IServiceCollection services, Type type)
    {
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

        services.AddValidatorsFromAssemblyContaining(type);
    }
}

