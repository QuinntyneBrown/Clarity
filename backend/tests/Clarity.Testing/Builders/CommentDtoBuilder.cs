// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel;

namespace Clarity.Testing.Builders;

public class CommentDtoBuilder
{
    private CommentDto _commentDto;

    public static CommentDto WithDefaults()
    {
        return new CommentDto();
    }

    public CommentDtoBuilder()
    {
        _commentDto = WithDefaults();
    }

    public CommentDto Build()
    {
        return _commentDto;
    }
}

