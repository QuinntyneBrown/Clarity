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

module appServicePlan 'modules/app-service-plan.bicep' = {
  name: 'appServicePlanDeploy'
  params: {
    name: '${namingPrefix}-plan'
    location: location
  }
}

module appService 'modules/app-service.bicep' = {
  name: 'appServiceDeploy'
  params: {
    name: '${namingPrefix}-app'
    location: location
    appServicePlanId: appServicePlan.outputs.id
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
    webAppPrincipalId: appService.outputs.principalId
    connectionString: connectionString
    jwtKey: jwtKey
  }
}

output appServiceUrl string = 'https://${appService.outputs.name}.azurewebsites.net'
