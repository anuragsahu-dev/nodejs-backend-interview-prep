# File Uploading in Node.js Backend

## 1. What is `multipart/form-data`?

`multipart/form-data` is an HTTP content type specifically designed for uploading files along with text fields in a single HTTP request.

### Why is it needed?

Traditional content types like `application/json` cannot handle binary data (images, PDFs, videos, etc.). The `multipart/form-data` encoding allows the browser to split the request body into multiple parts:

- **File part**: Contains the binary data of the uploaded file
- **Field part**: Contains regular text form fields

### How does the backend access it?

Node.js cannot directly parse `multipart/form-data` requests. We need a specialized parser middleware like **Multer** to extract files and fields from the request body.

## 2. Approaches to Handle File Uploads in Backend

There are three major approaches to handle file uploads in a Node.js backend:

### Approach 1: Client → Presigned URL → Cloud Storage (Recommended)

In this approach, the file never goes through your backend server.

**Flow:**

1. Client requests a presigned URL from the backend
2. Backend generates a presigned URL (using AWS S3 or Cloudinary)
3. Client uploads the file directly to cloud storage using the presigned URL
4. Only file metadata (URL, filename, etc.) is sent to the backend for database storage

**Advantages:**

- Fast and efficient
- Secure (temporary, time-limited URLs)
- No load on backend server
- Best for large files (10MB+)
- No server storage required
- Reduces bandwidth costs

**Best for:** Large files, high-traffic applications, and production systems.

### Approach 2: Client → Backend → Cloud Storage (Using Multer)

The backend receives the file first, then uploads it to cloud storage.

#### (A) Using `diskStorage`

The file is temporarily saved to the server's disk, then uploaded to cloud storage.

**Disadvantages:**

- Not recommended for production
- Requires more server resources (disk I/O)
- Must manually delete files after upload
- Slower performance
- Risk of orphaned files if upload fails

**Use case:** Development/testing environments or when you need to process files locally before uploading.

#### (B) Using `memoryStorage` (Buffer-based) - Recommended

The file is stored in RAM as a buffer, then uploaded directly to cloud storage without touching the disk.

**Advantages:**

- Most common approach in production
- No files saved on server disk
- Works perfectly with Cloudinary and AWS S3
- Fast and efficient
- Automatic cleanup (garbage collected)
- No orphaned files

**Best for:** Production applications with moderate file sizes (up to 50MB).

### Approach 3: Direct Server Storage (Not Recommended)

Files are stored directly on the server's file system without cloud storage.

**Disadvantages:**

- Not scalable
- Difficult to manage backups
- No CDN benefits
- Server disk space limitations
- Files lost if server crashes

**Use case:** Only for small internal applications or prototypes.

## 3. How Multer Works

Multer is a Node.js middleware that parses `multipart/form-data` requests. It performs the following operations:

1. Reads the incoming `multipart/form-data` stream
2. Identifies file fields vs text fields
3. Converts file binary data into a buffer (memoryStorage) or saves to disk (diskStorage)
4. Attaches the file information to `req.file` (single file) or `req.files` (multiple files)

### Key Properties of `req.file`

When Multer processes a file, it provides the following information:

```javascript
{
  fieldname: 'avatar',           // Field name from the form
  originalname: 'pic.jpg',       // Original filename
  encoding: '7bit',              // File encoding
  mimetype: 'image/jpeg',        // MIME type
  size: 23232,                   // File size in bytes
  buffer: <Buffer ...>,          // File buffer (only in memoryStorage)
  path: '/uploads/pic.jpg'       // File path (only in diskStorage)
}
```

## 4. `diskStorage` vs `memoryStorage`

### `diskStorage`

- **Storage location**: File is temporarily saved to the server's disk
- **File path**: Provides a file path like `/uploads/img-123.png`
- **Cleanup**: Must manually delete files after uploading to cloud
- **Performance**: Slower due to disk I/O operations
- **Use when**:
  - You need local file processing before upload
  - You want to keep files on the server
  - File size is very large (100MB+) and RAM is limited

### `memoryStorage`

- **Storage location**: File is stored as a buffer in RAM
- **Access**: Provides `req.file.buffer` for direct upload
- **Cleanup**: Automatic (garbage collected after request completes)
- **Performance**: Faster, no disk operations
- **Use when**:
  - Uploading directly to cloud storage
  - File size is moderate (under 50MB)
  - You want production-ready code

**Recommendation**: Use `memoryStorage` for 95% of real-world applications.

## 5. Multer Setup and Configuration

### Basic Multer Setup with `memoryStorage`

```javascript
import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({ storage });
```

**Usage in route:**

```javascript
app.post("/upload", upload.single("avatar"), (req, res) => {
  console.log(req.file); // Contains buffer
  res.send("File received!");
});
```

### Multer Setup with `diskStorage`

```javascript
import multer from "multer";
import { ApiError } from "../middlewares/error.middleware.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Directory must exist
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1000);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/mkv",
    "video/webm",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, "Only images and videos are allowed"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 * 1024 }, // 3 GB
});
```

### Multer File Filters (Security)

File filters allow you to validate files before they are processed:

```javascript
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    // Only allow images
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});
```

**Important**: Always validate `mimetype`, not just the file extension, as extensions can be easily spoofed.

## 6. Buffer-Based Uploads

When using `memoryStorage`, Multer provides the file as a binary buffer:

```javascript
req.file.buffer;
```

This buffer can be uploaded directly to:

### AWS S3

- Using `PutObjectCommand` from `@aws-sdk/client-s3`
- Using `Upload` from `@aws-sdk/lib-storage` (for large files)

### Cloudinary

- Using `cloudinary.uploader.upload_stream()`

**Why buffer-based uploads are best:**

- Fastest method (no disk I/O)
- Most secure (no files left on server)
- Production-ready approach

## 7. Uploading to AWS S3

### What is an S3 Bucket?

An **S3 bucket** is a container in AWS S3 where you store files (called objects). Unlike traditional folders:

- Globally accessible via URLs
- Infinitely scalable
- Designed for object storage (not file system)
- Supports versioning, encryption, and access control

### Object Storage vs File Storage

| Feature        | Object Storage (S3)         | File Storage               |
| -------------- | --------------------------- | -------------------------- |
| Structure      | Flat namespace with objects | Hierarchical folders/files |
| Scalability    | Infinite                    | Limited by disk size       |
| Access         | HTTP/HTTPS URLs             | File system paths          |
| Use case       | Images, videos, backups     | Operating system files     |
| Metadata       | Rich metadata support       | Limited metadata           |
| Presigned URLs | Supported                   | Not applicable             |

**Conclusion**: S3 (object storage) is superior for backend applications.

### Uploading to S3 using Buffer

```javascript
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

app.post("/upload", upload.single("file"), async (req, res) => {
  const params = {
    Bucket: "my-bucket",
    Key: `uploads/${Date.now()}-${req.file.originalname}`,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  await s3.send(new PutObjectCommand(params));

  res.json({ url: `https://my-bucket.s3.amazonaws.com/${params.Key}` });
});
```

## 8. Presigned URLs (Direct Upload Approach)

A **presigned URL** is a temporary, time-limited URL that grants permission to upload or download a file from S3 without exposing your AWS credentials.

### How Presigned URLs Work

1. Client requests an upload URL from the backend
2. Backend generates a presigned URL with specific permissions and expiration time
3. Client uploads the file directly to S3 using a PUT request to the presigned URL
4. Client sends the file metadata (URL, filename) to the backend for database storage

### Advantages

- No file passes through backend (saves bandwidth)
- Secure (temporary, scoped permissions)
- Scalable (offloads upload to S3)
- Fast (direct upload to cloud)

### Implementation Example

```javascript
import express from "express";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { configDotenv } from "dotenv";
import { v4 as uuidv4 } from "uuid";

configDotenv();

const app = express();
const PORT = 5000;

app.use(express.json());

// Initialize S3 client once (not per request)
const client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const createPresignedUrlWithClient = ({ bucket, key }) => {
  const command = new PutObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn: 3600 }); // 1 hour
};

app.post("/get-presigned-url", async (req, res) => {
  const { mime } = req.body;

  const filename = uuidv4();
  const finalname = `${filename}.${mime}`;

  const url = await createPresignedUrlWithClient({
    bucket: process.env.S3_BUCKET_NAME,
    key: finalname,
  });

  // Return the presigned URL to client
  // Store finalname in database for future reference
  res.json({ url, finalname });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

**Client-side usage:**

```javascript
// 1. Get presigned URL from backend
const response = await fetch("/get-presigned-url", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ mime: "jpg" }),
});

const { url, finalname } = await response.json();

// 2. Upload file directly to S3
await fetch(url, {
  method: "PUT",
  body: fileBlob,
  headers: { "Content-Type": "image/jpeg" },
});

// 3. Send metadata to backend
await fetch("/save-file-metadata", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ filename: finalname }),
});
```

## 9. Public vs Private Buckets

### Public Bucket

- **Access**: Anyone can view files via direct URL
- **Use cases**:
  - Profile pictures
  - Product images
  - Public banners
  - Marketing assets
- **Security**: Low (anyone with URL can access)

### Private Bucket

- **Access**: Files cannot be accessed directly via URL
- **Access methods**:
  - Generate presigned URLs for temporary access
  - Use CloudFront signed URLs
  - Use IAM roles for programmatic access
- **Use cases**:
  - Invoices
  - Certificates
  - Medical records
  - Sensitive documents
  - User-uploaded private content

**Best practice**: Always use private buckets by default and generate presigned URLs when access is needed.

## 10. Cloudinary Basics

**Cloudinary** is a cloud-based media management platform that provides storage, optimization, and transformation services for images and videos.

### Upload Preset

An **upload preset** is a predefined configuration that defines:

- Allowed file formats (JPEG, PNG, MP4, etc.)
- Maximum file size
- Target folder
- Automatic transformations (resize, crop, format conversion)
- Access control rules (public/private)

### Common Transformations

Cloudinary can automatically transform media:

- **Resize**: Change width/height
- **Crop**: Smart cropping, face detection
- **Compress**: Reduce file size
- **Format conversion**: Convert to WebP for better compression
- **Filters**: Apply artistic effects, blur, sharpen
- **Quality adjustment**: Optimize for web delivery

### Cloudinary Upload Implementation

```javascript
import fs from "node:fs/promises";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { ApiError } from "../middlewares/error.middleware.js";

dotenv.config();

cloudinary.config({
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  cloud_name: process.env.CLOUD_NAME,
});

export const uploadMedia = async (filePath) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto", // Automatically detect file type
    });

    // Delete local file after successful upload
    await fs.unlink(filePath);

    return uploadResponse;
  } catch (error) {
    // Cleanup: Delete file even if upload fails
    await fs.unlink(filePath).catch(() => {});
    throw new ApiError(500, "Error occurred while uploading file");
  }
};
```

**Usage in route:**

```javascript
import { upload } from "./middleware/multer.middleware.js";
import { uploadMedia } from "./utils/cloudinary.js";

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const result = await uploadMedia(req.file.path);

    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Why Cloudinary?

- Automatic image optimization
- Built-in CDN for fast delivery
- On-the-fly transformations via URL parameters
- Video transcoding support
- Facial recognition and smart cropping
- Easier to use than raw S3 for media files

## 11. File Upload Security Best Practices

Implementing proper security measures is critical when handling file uploads:

### 1. Validate File Type

Always check the `mimetype`, not just the file extension:

```javascript
const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

if (!allowedMimeTypes.includes(file.mimetype)) {
  throw new Error("Invalid file type");
}
```

### 2. Validate File Size

Set appropriate file size limits:

```javascript
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});
```

### 3. Never Trust File Extensions

Attackers can rename `malicious.exe` to `malicious.jpg`. Always validate the actual file content.

### 4. Use `memoryStorage` in Production

Avoid `diskStorage` to prevent orphaned files and disk space issues.

### 5. Use Private Buckets for Sensitive Files

Never store sensitive documents in public buckets.

### 6. Sanitize Filenames

Remove special characters and prevent path traversal attacks:

```javascript
const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
```

### 7. Rate Limit Upload Routes

Prevent abuse by limiting upload frequency:

```javascript
import rateLimit from "express-rate-limit";

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 uploads per 15 minutes
});

app.post("/upload", uploadLimiter, upload.single("file"), handler);
```

### 8. Disable Public Write Access in S3

Never allow public write permissions on S3 buckets. Use presigned URLs for uploads.

### 9. Always Use HTTPS

Ensure all file uploads happen over HTTPS to prevent man-in-the-middle attacks.

### 10. Use Presigned URLs for Large Files

For files larger than 10MB, use presigned URLs to avoid backend bottlenecks.

### 11. Scan for Malware

For production systems, integrate virus scanning services like ClamAV or cloud-based scanners.

### 12. Set CORS Policies

Configure proper CORS policies on S3 buckets to prevent unauthorized access.

## Summary

### `multipart/form-data`

An HTTP content type used to send binary files and text fields together. Backend uses Multer to parse it.

### File Upload Approaches

1. **Presigned URL** → Client uploads directly to cloud (best for large files)
2. **Backend proxy** → File goes through backend, then to cloud (Multer `memoryStorage`)
3. **Direct storage** → Store on server (not recommended)

### Multer

A middleware that parses `multipart/form-data` and provides file information in `req.file`:

- **`diskStorage`**: Saves files to server disk
- **`memoryStorage`**: Provides file as buffer in RAM (recommended)

### AWS S3

Object storage service. Upload files using:

- `PutObjectCommand` (for buffer uploads)
- Presigned URLs (for direct client uploads)

### Cloudinary

Cloud media platform with automatic optimization and transformations. Easier than S3 for image/video handling.

### Buffer Uploads

The fastest approach: `req.file.buffer` → directly upload to S3/Cloudinary without disk I/O.

### Security

- Validate file type and size
- Use private buckets for sensitive data
- Rate limit upload endpoints
- Always use HTTPS
- Sanitize filenames
- Use presigned URLs for large files
