// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.Extensions.Logging;
using System.Net;
using System.Net.Sockets;

namespace Messaging.Udp;

public class UdpClientFactory : IUdpClientFactory
{
    private readonly ILogger<UdpClientFactory> _logger;

    public static readonly string MultiCastGroupIp = "224.0.0.1";
    public const int BroadcastPort = 4681;

    public UdpClientFactory(ILogger<UdpClientFactory> logger)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public UdpClient Create()
    {
        UdpClient udpClient = default;

        int i = 1;

        while (udpClient?.Client?.IsBound == null || udpClient.Client.IsBound == false)
        {
            try
            {
                udpClient = new UdpClient();

                udpClient.Client.Bind(IPEndPoint.Parse($"127.0.0.{i}:{BroadcastPort}"));

                udpClient.JoinMulticastGroup(IPAddress.Parse(MultiCastGroupIp), IPAddress.Parse($"127.0.0.{i}"));
            }
            catch (SocketException)
            {
                i++;
            }
        }

        return udpClient;
    }

}


