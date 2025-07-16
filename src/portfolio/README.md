# Portfolio Module API Documentation

This module handles portfolio CRUD operations.

## Endpoints

### Get all portfolios
- **GET /portfolios**
- Returns: Array of all portfolios

### Get a single portfolio
- **GET /portfolios/:id**
- Params: `id` (string, Portfolio ID)
- Returns: Portfolio object or null if not found

### Create a portfolio
- **POST /portfolios**
- Body: `{ title: string, videos: string[], images: string[], texts: string[] }`
- Returns: Created portfolio object 