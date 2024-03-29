// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;
using System.Collections.Generic;
using System.Linq;
using Clarity.Core.AggregateModel.BoardStateAggregate;

namespace Clarity.Core.AggregateModel.BoardAggregate;

public class Board
{
    public Guid BoardId { get; private set; }
    public string Name { get; private set; }
    public List<BoardState> BoardStates { get; private set; } = new();
    public static Board WithDefaults(string name)
    {
        int order = 1;
        Board board = new(name);
        foreach (var state in Enum.GetValues<StateType>().Select(x => new BoardState(x, order++, board.BoardId)).ToList())
        {
            board.BoardStates.Add(state);
        };
        return board;
    }
    public Board(string name)
    {
        Name = name;
    }
    private Board() { }
}

