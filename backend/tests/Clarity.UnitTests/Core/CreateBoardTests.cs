// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.BoardAggregate.Commands;
using Clarity.Testing.Builders;
using Xunit;


namespace Clarity.UnitTests.Core;

public class CreateBoardTests
{
    private CreateBoardRequestHandler _sut;
    private IClarityDbContext _context;

    [Fact]
    public async Task CanCreateBoard()
    {
        var expectedName = "Test";
        var expectedStates = 3;

        SetUp($"{nameof(CreateBoardTests)}{nameof(CanCreateBoard)}");

        var actual = await _sut.Handle(new() { Name = "Test" }, default);

        Assert.Equal(expectedStates, actual.Board.States.Count);
        Assert.Equal(expectedName, actual.Board.Name);
    }

    private void SetUp(string databaseName = "")
    {
        _context = ClarityDbContextBuilder.WithDefaults(databaseName);
        _sut = new CreateBoardRequestHandler(_context);
    }

    private CreateBoardRequestHandler Create()
        => new CreateBoardRequestHandler(_context);
}


