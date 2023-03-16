// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel;

namespace Clarity.Testing.Builders;

public class BoardDtoBuilder
{
    private BoardDto _boardDto;

    public static BoardDto WithDefaults()
    {
        return new BoardDto();
    }

    public BoardDtoBuilder()
    {
        _boardDto = WithDefaults();
    }

    public BoardDto Build()
    {
        return _boardDto;
    }
}

