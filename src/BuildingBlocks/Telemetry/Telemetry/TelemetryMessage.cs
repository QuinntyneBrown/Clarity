// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Telemetry;

public class TelemetryMessage
{
    public TelemetryMessage()
    {
        Created = DateTime.UtcNow;
        Service = AppDomain.CurrentDomain.FriendlyName.Split('.').First();
    }

    public DateTime Created { get; set; }
    public string Service { get; set; }
}


