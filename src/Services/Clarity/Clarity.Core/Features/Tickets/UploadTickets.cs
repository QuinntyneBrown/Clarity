/*using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Net.Http.Headers;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using System.Threading;
using System.Linq;
using Clarity.Core;
using Kernel;
using Clarity.Core.Models;


namespace Clarity.Domain.Features
{
    public class UploadTickets
    {
        public class Request : IRequest<Response> { }

        public class Response
        {
            public List<Guid> TicketIds { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly IClarityContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(IClarityContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {

                var httpContext = _httpContextAccessor.HttpContext;
                var defaultFormOptions = new FormOptions();
                var tickets = new List<Ticket>();

                if (!MultipartRequestHelper.IsMultipartContentType(httpContext.Request.ContentType))
                    throw new Exception($"Expected a multipart request, but got {httpContext.Request.ContentType}");

                var mediaTypeHeaderValue = MediaTypeHeaderValue.Parse(httpContext.Request.ContentType);

                var boundary = MultipartRequestHelper.GetBoundary(
                    mediaTypeHeaderValue,
                    defaultFormOptions.MultipartBoundaryLengthLimit);

                var reader = new MultipartReader(boundary, httpContext.Request.Body);

                var section = await reader.ReadNextSectionAsync();

                while (section != null)
                {

                    //var ticket = new Ticket();

                    var hasContentDispositionHeader = ContentDispositionHeaderValue.TryParse(section.ContentDisposition, out ContentDispositionHeaderValue contentDisposition);

                    if (hasContentDispositionHeader)
                    {
                        if (MultipartRequestHelper.HasFileContentDisposition(contentDisposition))
                        {
                            using (var targetStream = new MemoryStream())
                            {
                                await section.Body.CopyToAsync(targetStream);
                                //ticket.Name = $"{contentDisposition.FileName}".Trim(new char[] { '"' }).Replace("&", "and");
                                *//*                                digitalAsset.Bytes = StreamHelper.ReadToEnd(targetStream);
                                                                digitalAsset.ContentType = section.ContentType;*//*
                            }
                        }
                    }

                    //_context.Tickets.Add(ticket);

                    //tickets.Add(ticket);

                    section = await reader.ReadNextSectionAsync();
                }

                await _context.SaveChangesAsync(cancellationToken);

                return new()
                {
                    TicketIds = tickets.Select(x => x.TicketId).ToList()
                };
            }
        }
    }
}
*/