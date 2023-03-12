using Clarity.Core.AggregateModel.DigitalAssetAggregate;
using System;

namespace Clarity.Core.AggregateModel
{
    public class DigitalAssetDto
    {
        public Guid DigitalAssetId { get; set; }
        public string Name { get; set; }
        public string RelativePath { get { return $"api/digitalassets/serve/{DigitalAssetId}"; } }
        public byte[] Bytes { get; set; }
        public string ContentType { get; set; }
        public static DigitalAssetDto FromDigitalAsset(DigitalAsset digitalAsset)
            => new()
        {
            DigitalAssetId = digitalAsset.DigitalAssetId,
            Name = digitalAsset.Name,
            Bytes = digitalAsset.Bytes,
            ContentType = digitalAsset.ContentType
        };
    }
}
