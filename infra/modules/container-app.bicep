param name string
param location string
param environmentId string
param containerRegistryLoginServer string
param containerRegistryName string
param keyVaultName string
param imageName string = ''

resource acr 'Microsoft.ContainerRegistry/registries@2023-07-01' existing = {
  name: containerRegistryName
}

resource containerApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: name
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    managedEnvironmentId: environmentId
    configuration: {
      activeRevisionsMode: 'Single'
      ingress: {
        external: true
        targetPort: 8080
        transport: 'auto'
        allowInsecure: false
      }
      registries: [
        {
          server: containerRegistryLoginServer
          username: acr.listCredentials().username
          passwordSecretRef: 'acr-password'
        }
      ]
      secrets: [
        {
          name: 'acr-password'
          value: acr.listCredentials().passwords[0].value
        }
      ]
    }
    template: {
      containers: [
        {
          name: 'api'
          image: !empty(imageName) ? imageName : 'mcr.microsoft.com/dotnet/samples:aspnetapp'
          resources: {
            cpu: json('0.5')
            memory: '1Gi'
          }
          args: [
            'migratedb'
            'seeddb'
          ]
          env: [
            {
              name: 'KeyVaultName'
              value: keyVaultName
            }
            {
              name: 'ASPNETCORE_URLS'
              value: 'http://+:8080'
            }
          ]
        }
      ]
      scale: {
        minReplicas: 0
        maxReplicas: 2
        rules: [
          {
            name: 'http-scaler'
            http: {
              metadata: {
                concurrentRequests: '100'
              }
            }
          }
        ]
      }
    }
  }
}

output id string = containerApp.id
output name string = containerApp.name
output fqdn string = containerApp.properties.configuration.ingress.fqdn
output principalId string = containerApp.identity.principalId
