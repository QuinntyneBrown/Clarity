using Clarity.Core.AggregateModel.BoardStateAggregate;
using System;
using System.Collections.Generic;

namespace Clarity.Core.AggregateModel;

 public class BoardStateDto
 {
     public Guid StateId { get; set; }
     public string Name { get; set; }
     public int Order { get; set; }
     public StateType Type { get; set; }
     public List<TicketDto> Tickets { get; set; } = new();
 }
