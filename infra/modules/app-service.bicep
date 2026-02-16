param name string
param location string
param appServicePlanId string
param keyVaultName string

resource webApp 'Microsoft.Web/sites@2023-01-01' = {
  name: name
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlanId
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'DOTNETCORE|8.0'
      appSettings: [
        {
          name: 'KeyVaultName'
          value: keyVaultName
        }
      ]
    }
  }
}

output id string = webApp.id
output principalId string = webApp.identity.principalId
output name string = webApp.name
