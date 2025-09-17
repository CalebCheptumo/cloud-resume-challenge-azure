# Cloud Resume Challenge - Azure Backend

This is the backend component for the Cloud Resume Challenge project, deployed on Azure. It provides API endpoints to support the resume website, such as visitor count and other dynamic features.

## Features

- Serverless backend (Azure Functions)
- Visitor counter API
- Integration with Azure Cosmos DB or Table Storage
- CORS support for frontend integration

## Prerequisites

- [Node.js](https://nodejs.org/) (if using JavaScript/TypeScript)
- [Azure Functions Core Tools](https://docs.microsoft.com/azure/azure-functions/functions-run-local)
- Azure Subscription

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/calebcheptumo/cloud-resume-challenge-azure.git
   cd cloud-resume-challenge-azure/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env` and update with your Azure credentials and settings.

4. Run locally:
   ```bash
   func start
   ```

## Deployment

Deploy to Azure Functions using the Azure CLI or VS Code Azure Functions extension:

```bash
func azure functionapp publish <YourFunctionAppName>
```

## API Endpoints

- `GET /api/visitors` - Get current visitor count
- `POST /api/visitors` - Increment visitor count

## License

MIT License

## Acknowledgements

Inspired by the [Cloud Resume Challenge](https://cloudresumechallenge.dev/).
