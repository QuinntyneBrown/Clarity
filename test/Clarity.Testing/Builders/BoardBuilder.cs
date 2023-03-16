// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.BoardAggregate;

namespace Clarity.Testing.Builders;

public class BoardBuilder
{
    private Board _board;
    
    public static Board WithDefaults()
    {
        return Board.WithDefaults("Test");
    }

    public BoardBuilder()
    {
        _board = WithDefaults();
    }

    public Board Build()
    {
        return _board;
    }
}

