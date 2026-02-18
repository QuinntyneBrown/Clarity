targetScope = 'resourceGroup'

@description('Environment name (e.g. dev, staging, prod)')
param environment string

@description('Azure region for resources')
param location string = resourceGroup().location

@description('SQL Server administrator login')
@secure()
param sqlAdminLogin string

@description('SQL Server administrator password')
@secure()
param sqlAdminPassword string

@description('JWT signing key')
@secure()
param jwtKey string

var namingPrefix = 'clarity-${environment}'
// Container registry names must be alphanumeric only
var acrName = 'clarity${replace(environment, '-', '')}acr'
var containerAppName = '${namingPrefix}-api'

module containerRegistry 'modules/container-registry.bicep' = {
  name: 'containerRegistryDeploy'
  params: {
    name: acrName
    location: location
  }
}

module logAnalytics 'modules/log-analytics.bicep' = {
  name: 'logAnalyticsDeploy'
  params: {
    name: '${namingPrefix}-logs'
    location: location
  }
}

module containerAppsEnvironment 'modules/container-apps-environment.bicep' = {
  name: 'containerAppsEnvDeploy'
  params: {
    name: '${namingPrefix}-env'
    location: location
    logAnalyticsCustomerId: logAnalytics.outputs.customerId
    logAnalyticsSharedKey: logAnalytics.outputs.sharedKey
  }
}

module containerApp 'modules/container-app.bicep' = {
  name: 'containerAppDeploy'
  params: {
    name: containerAppName
    location: location
    environmentId: containerAppsEnvironment.outputs.id
    containerRegistryLoginServer: containerRegistry.outputs.loginServer
    containerRegistryName: containerRegistry.outputs.name
    keyVaultName: '${namingPrefix}-kv'
  }
}

module sqlServer 'modules/sql-server.bicep' = {
  name: 'sqlServerDeploy'
  params: {
    name: '${namingPrefix}-sql'
    location: location
    databaseName: 'Clarity'
    administratorLogin: sqlAdminLogin
    administratorLoginPassword: sqlAdminPassword
  }
}

var connectionString = 'Server=tcp:${sqlServer.outputs.serverFqdn},1433;Initial Catalog=${sqlServer.outputs.databaseName};Persist Security Info=False;User ID=${sqlAdminLogin};Password=${sqlAdminPassword};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;'

module keyVault 'modules/key-vault.bicep' = {
  name: 'keyVaultDeploy'
  params: {
    name: '${namingPrefix}-kv'
    location: location
    webAppPrincipalId: containerApp.outputs.principalId
    connectionString: connectionString
    jwtKey: jwtKey
  }
}

output appUrl string = 'https://${containerApp.outputs.fqdn}'
output AZURE_CONTAINER_REGISTRY_ENDPOINT string = containerRegistry.outputs.loginServer
output AZURE_CONTAINER_REGISTRY_NAME string = containerRegistry.outputs.name
output AZURE_CONTAINER_APP_NAME string = containerApp.outputs.name
output AZURE_CONTAINER_APPS_ENVIRONMENT_NAME string = containerAppsEnvironment.outputs.name
