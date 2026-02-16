// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using CSharpFunctionalExtensions;
using Ganss.Xss;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace Clarity.Core.ValueObjects;

public class Html : ValueObject
{
    [JsonIgnore]
    public string Value { get; private set; }

    protected Html() { }

    private Html(string value)
    {
        if (IsBase64String(value))
        {
            byte[] data = Convert.FromBase64String(value);
            value = Encoding.UTF8.GetString(data);
        }

        Value = new HtmlSanitizer().Sanitize(value);
    }

    public static Result<Html> Create(string value)
    {
        value = (value ?? string.Empty).Trim();

        return Result.Success(new Html(value));
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
    }

    public static implicit operator string(Html html)
    {
        return html.Value;
    }

    public static explicit operator Html(string html)
    {
        return Create(html).Value;
    }

    private static bool IsBase64String(string base64)
    {
        Span<byte> buffer = new Span<byte>(new byte[base64.Length]);
        return Convert.TryFromBase64String(base64, buffer, out int bytesParsed);
    }
}
