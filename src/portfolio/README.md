# Portfolio Module API Documentation

This module handles portfolio CRUD operations and file uploads.

## Endpoints

### Get all portfolios
- **GET /portfolios**
- Returns: Array of all portfolios

### Get a single portfolio
- **GET /portfolios/:id**
- Params: `id` (string, Portfolio ID)
- Returns: Portfolio object or null if not found

### Create a portfolio (JSON only)
- **POST /portfolios**
- Body: `{ title: string, videos: string[], images: string[], texts: string[] }`
- Returns: Created portfolio object

### Upload images and videos
- **POST /portfolios/upload**
- Form-data fields:
  - `title`: string
  - `texts`: string[] (can be sent as multiple fields or a JSON array)
  - `images`: file[] (multiple image files)
  - `videos`: file[] (multiple video files)
- Returns: Created portfolio object with file paths

#### Example curl request
```sh
curl -X POST http://localhost:3000/portfolios/upload \
  -F "title=My Portfolio" \
  -F "texts[]=Description 1" \
  -F "texts[]=Description 2" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg" \
  -F "videos=@/path/to/video1.mp4"
```

### Access uploaded files
- Uploaded files are served at `/uploads/<filename>`
- Example: `http://localhost:3000/uploads/1699999999999-image1.jpg` 