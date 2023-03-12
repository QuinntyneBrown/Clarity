using System;

namespace Clarity.Core.AggregateModel.DigitalAssetAggregate;

public class DigitalAsset
{
    public Guid DigitalAssetId { get; private set; }
    public string Name { get; private set; }
    public byte[] Bytes { get; private set; }
    public string ContentType { get; private set; }
    public DigitalAsset(string name, byte[] bytes, string contentType)
    {
        Name = name;
        Bytes = bytes;
        ContentType = contentType;
    }
    private DigitalAsset()
    {
    }
    public DigitalAsset(string name)
    {
        Name = name;
    }
    public void SetName(string name)
    {
        Name = name;
    }
    public void Update(string name, byte[] bytes, string contentType)
    {
        Name = name;
        Bytes = bytes;
        ContentType = contentType;
    }
}
