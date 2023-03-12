// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.Data;
using Clarity.Domain.Features;
using Clarity.Testing.Builders;
using System.Threading.Tasks;
using Xunit;

namespace Clarity.UnitTests.Domain
{
    public class CreateBoardTests
    {
        private CreateBoard.Handler _sut;
        private IClarityContext _context;

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
            _context = ClarityContextBuilder.WithDefaults(databaseName);
            _sut = new CreateBoard.Handler(_context);
        }

        private CreateBoard.Handler Create()
            => new CreateBoard.Handler(_context);
    }
}

