# Azure Resources & Monthly Costs

**Subscription:** Pay-As-You-Go (`4a1b5113-89f9-4d27-acfe-581493385536`)
**Resource Group:** Clarity (Central US)
**Estimated Total:** ~$30.27/month

| Resource | SKU | Monthly Cost | Azure Portal |
|----------|-----|-------------|--------------|
| **App Service Plan** (`clarity-dev-plan`) | Basic B1 (Linux, 1 core, 1.75 GB RAM) | ~$13.14 | [View in Portal](https://portal.azure.com/#@/resource/subscriptions/4a1b5113-89f9-4d27-acfe-581493385536/resourceGroups/Clarity/providers/Microsoft.Web/serverFarms/clarity-dev-plan/overview) |
| **App Service** (`clarity-dev-app`) | Included in plan | $0.00 | [View in Portal](https://portal.azure.com/#@/resource/subscriptions/4a1b5113-89f9-4d27-acfe-581493385536/resourceGroups/Clarity/providers/Microsoft.Web/sites/clarity-dev-app/overview) |
| **SQL Server** (`clarity-dev-sql`) | Logical server | $0.00 | [View in Portal](https://portal.azure.com/#@/resource/subscriptions/4a1b5113-89f9-4d27-acfe-581493385536/resourceGroups/Clarity/providers/Microsoft.Sql/servers/clarity-dev-sql/overview) |
| **SQL Database** (`Clarity`) | Basic (5 DTUs, 2 GB max) | ~$4.90 | [View in Portal](https://portal.azure.com/#@/resource/subscriptions/4a1b5113-89f9-4d27-acfe-581493385536/resourceGroups/Clarity/providers/Microsoft.Sql/servers/clarity-dev-sql/databases/Clarity/overview) |
| **Key Vault** (`clarity-dev-kv`) | Standard | ~$0.03/10K ops | [View in Portal](https://portal.azure.com/#@/resource/subscriptions/4a1b5113-89f9-4d27-acfe-581493385536/resourceGroups/Clarity/providers/Microsoft.KeyVault/vaults/clarity-dev-kv/overview) |
| **SQL Database** (`master`) | System database | $0.00 | — |

## Cost Breakdown

### App Service Plan - ~$13.14/mo
- **SKU:** Basic B1 (Linux)
- **Specs:** 1 core, 1.75 GB RAM, 10 GB storage
- Hosts the `clarity-dev-app` web application

### Azure SQL Database - ~$4.90/mo
- **SKU:** Basic (5 DTUs)
- **Storage:** Up to 2 GB included
- Hosts the Clarity application database

### Azure Key Vault - ~$0.03/mo
- **SKU:** Standard
- **Pricing:** $0.03 per 10,000 operations
- Stores connection strings and JWT signing key (2 secrets)
- Minimal cost with low usage

## Resource Group Overview

[View all resources in Azure Portal](https://portal.azure.com/#@/resource/subscriptions/4a1b5113-89f9-4d27-acfe-581493385536/resourceGroups/Clarity/overview)
