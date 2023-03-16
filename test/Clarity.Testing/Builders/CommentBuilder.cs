// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.CommentAggregate;

namespace Clarity.Testing.Builders;

public class CommentBuilder
{
    private Comment _comment;

    public static Comment WithDefaults()
    {
        return new Comment(default, default);
    }

    public CommentBuilder()
    {
        _comment = WithDefaults();
    }

    public Comment Build()
    {
        return _comment;
    }
}

