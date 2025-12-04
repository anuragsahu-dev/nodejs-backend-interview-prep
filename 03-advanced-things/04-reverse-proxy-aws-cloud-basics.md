# Reverse Proxy, SSL/TLS, Cron Jobs, AWS & Monitoring

## 1. What is a Reverse Proxy?

### Definition

A **reverse proxy** is a server that sits in front of your backend application and handles all incoming client requests before forwarding them to your real server.

**In simple terms:** A reverse proxy acts as a middleman between clients and backend servers, protecting them and improving performance.

### Why Use a Reverse Proxy?

Your application server should **never directly face the public internet**. A reverse proxy provides an additional security and performance layer.

### Benefits

#### 1. Security

- **Hides internal server IPs** - Clients never know your actual server addresses
- **Blocks malicious traffic** - Filters out attacks before they reach your application
- **Request filtering** - Validates and sanitizes incoming requests
- **Additional protection** - Enables rate-limiting, Web Application Firewall (WAF), and bot protection

#### 2. Load Balancing

- **Distributes traffic** across multiple backend servers
- **Prevents overload** on any single server
- **Improves availability** - If one server fails, traffic routes to healthy servers

#### 3. SSL/TLS Termination

- **Handles HTTPS encryption** at the proxy level
- **Backend runs plain HTTP** - Reduces computational overhead on application servers
- **Centralized certificate management** - Easier to maintain and renew certificates

#### 4. Caching

- **Speeds up static content delivery** - Images, CSS, JavaScript files
- **Reduces backend load** - Serves cached responses without hitting the application
- **Improves response times** - Cached content is served instantly

#### 5. Routing

- **Path-based routing** - Different paths go to different services
  - `/api` → Node.js backend
  - `/admin` → Admin service
  - `/images` → S3 or static file server

### Common Reverse Proxy Solutions

| Tool        | Description                         | Best For                              |
| ----------- | ----------------------------------- | ------------------------------------- |
| **Nginx**   | Most popular, high-performance      | Production environments, high traffic |
| **Caddy**   | Automatic HTTPS, easy configuration | Small projects, quick setup           |
| **Traefik** | Dynamic, Docker-native              | Microservices, containerized apps     |
| **HAProxy** | Enterprise-grade load balancer      | Large-scale deployments               |

---

## 2. SSL, TLS & SSL/TLS Termination

### What is SSL/TLS?

**SSL (Secure Sockets Layer)** and **TLS (Transport Layer Security)** are cryptographic protocols that secure data transmission between browser and server.

- **SSL** - Old, deprecated (vulnerable to attacks)
- **TLS** - Modern, secure (current standard)

**Note:** People still say "SSL certificate," but technically it's a TLS certificate.

### What TLS Ensures

1. **Encryption** - Nobody can read the data in transit
2. **Integrity** - Data cannot be modified without detection
3. **Authentication** - Client verifies it's talking to the legitimate server

### What is SSL/TLS Termination?

**Termination** means the reverse proxy decrypts HTTPS traffic and forwards plain HTTP to your backend.

**Flow:**

```
Client (HTTPS) → Reverse Proxy (decrypts) → Backend (HTTP)
```

### Benefits of SSL/TLS Termination

- **Reduced backend load** - Backend doesn't handle expensive encryption/decryption
- **Simpler configuration** - Application code doesn't need to manage certificates
- **Centralized management** - All certificates managed in one place (the reverse proxy)
- **Better performance** - Dedicated hardware/software for SSL processing

### Example Configuration (Nginx)

```nginx
server {
    listen 443 ssl;
    server_name api.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;  # Plain HTTP to backend
    }
}
```

---

## 3. Cron Jobs

### What are Cron Jobs?

**Cron jobs** are time-based scheduled tasks that run automatically on a server at specified intervals.

### Common Use Cases

- **Cleanup tasks** - Delete temporary files, expired sessions, old logs
- **Automated emails** - Send daily reports, notifications
- **Database maintenance** - Backup databases, clean up old records
- **Token management** - Remove expired tokens, refresh access tokens
- **Data synchronization** - Sync data with external APIs
- **Certificate renewal** - Auto-renew SSL/TLS certificates

### Cron Syntax

Cron expressions consist of 5 fields:

```
*  *  *  *  *
│  │  │  │  │
│  │  │  │  └── Day of week (0-6, Sunday = 0)
│  │  │  └──── Month (1-12)
│  │  └─────── Day of month (1-31)
│  └────────── Hour (0-23)
└───────────── Minute (0-59)
```

### Common Cron Examples

| Expression    | Description                          |
| ------------- | ------------------------------------ |
| `0 0 * * *`   | Every day at midnight                |
| `*/5 * * * *` | Every 5 minutes                      |
| `0 */1 * * *` | Every hour                           |
| `0 9 * * 1`   | Every Monday at 9 AM                 |
| `0 0 1 * *`   | First day of every month at midnight |
| `30 2 * * 0`  | Every Sunday at 2:30 AM              |

### Implementation in Node.js

#### Using node-cron Library

```javascript
const cron = require("node-cron");

// Run every day at midnight
cron.schedule("0 0 * * *", () => {
  console.log("Running daily cleanup task");
  cleanupExpiredTokens();
});

// Run every 5 minutes
cron.schedule("*/5 * * * *", () => {
  console.log("Checking system health");
  performHealthCheck();
});
```

#### Using OS-level Cron (Linux)

```bash
# Edit crontab
crontab -e

# Add job
0 0 * * * /usr/bin/node /path/to/cleanup-script.js
```

### Typical Server Background Tasks

- **Database cleanup** - Remove old or expired records
- **Disk cleanup** - Delete temporary files, old logs
- **Log rotation** - Archive and compress old log files
- **Report generation** - Create daily/weekly reports
- **Retry failed operations** - Retry failed email sends, API calls
- **Certificate renewal** - Auto-renew Let's Encrypt certificates
- **API synchronization** - Fetch data from external services
- **Cache warming** - Pre-populate caches with frequently accessed data

---

## 4. AWS Cloud Basics

### Overview

Amazon Web Services (AWS) is the world's most comprehensive cloud platform, offering over 200 services. For backend development, you'll primarily use a few core services.

### 1. EC2 (Elastic Compute Cloud)

**What is EC2?**

EC2 provides **virtual machines (instances)** in the cloud that you can configure and control completely.

**Think of EC2 as:** A Linux or Windows server running in AWS data centers that you can access remotely.

**Common Use Cases:**

- **Host backend applications** - Node.js, Python, Java servers
- **Run Docker containers** - Deploy containerized applications
- **Microservices** - Each service on its own EC2 instance
- **Development/staging environments** - Test environments before production

**Key Features:**

- **Multiple instance types** - Choose CPU, memory, storage based on needs
- **Auto-scaling** - Automatically add/remove instances based on traffic
- **Elastic IPs** - Static IP addresses that don't change
- **Security groups** - Firewall rules to control inbound/outbound traffic
- **Key-based SSH access** - Secure login using SSH keys

**Instance Types (Common):**

- **t2.micro** - Free tier eligible, good for small apps (1 vCPU, 1GB RAM)
- **t3.medium** - General purpose (2 vCPU, 4GB RAM)
- **c5.large** - Compute optimized (2 vCPU, 4GB RAM, better CPU)
- **m5.large** - Balanced (2 vCPU, 8GB RAM)

**Pricing Model:**

- **On-Demand** - Pay per hour/second
- **Reserved** - Commit for 1-3 years, get discount (up to 75%)
- **Spot** - Bid for unused capacity, cheapest but can be terminated

**Why not run databases on EC2?**

- Manual backups and maintenance
- No automatic failover
- More complex to scale
- **Better alternative:** Use RDS (Relational Database Service)

---

### 2. S3 (Simple Storage Service)

**What is S3?**

S3 is **object storage** for storing and retrieving any amount of data from anywhere on the web.

**Think of S3 as:** Unlimited cloud storage for files, like Dropbox but for applications.

**Common Use Cases:**

- **User uploads** - Profile pictures, documents, videos
- **Static website hosting** - HTML, CSS, JavaScript files
- **Backup and archiving** - Database backups, log archives
- **Data lakes** - Store large amounts of raw data for analytics
- **CDN origin** - Serve files through CloudFront CDN

**Key Features:**

- **Unlimited storage** - No capacity limits
- **99.999999999% durability** - Data is extremely safe (11 nines)
- **Versioning** - Keep multiple versions of files
- **Lifecycle policies** - Automatically move old files to cheaper storage
- **Access control** - Fine-grained permissions using IAM policies
- **Event notifications** - Trigger Lambda functions on file upload

**Storage Classes:**

- **S3 Standard** - Frequently accessed data
- **S3 Intelligent-Tiering** - Automatically moves data between tiers
- **S3 Glacier** - Long-term archival (retrieval takes minutes to hours)
- **S3 Glacier Deep Archive** - Lowest cost, retrieval takes 12+ hours

**Pricing:**

- **Storage** - $0.023 per GB/month (Standard)
- **Requests** - $0.0004 per 1,000 GET requests
- **Data transfer** - Free inbound, outbound charged

**Best Practices:**

- Use **presigned URLs** for temporary access
- Enable **versioning** for important data
- Use **lifecycle policies** to reduce costs
- Combine with **CloudFront** for faster delivery

---

### 3. RDS (Relational Database Service)

**What is RDS?**

RDS is a **managed database service** that makes it easy to set up, operate, and scale relational databases in the cloud.

**Supported Databases:**

- PostgreSQL
- MySQL
- MariaDB
- Oracle
- Microsoft SQL Server
- Amazon Aurora (AWS's own, MySQL/PostgreSQL compatible)

**Why Use RDS Instead of EC2?**

| Feature               | RDS                         | Database on EC2          |
| --------------------- | --------------------------- | ------------------------ |
| **Backups**           | Automatic daily             | Manual setup required    |
| **Updates**           | Automatic patches           | Manual updates           |
| **Scaling**           | Easy vertical/horizontal    | Complex manual process   |
| **High Availability** | Multi-AZ with one click     | Manual replication setup |
| **Monitoring**        | Built-in CloudWatch metrics | Manual setup             |
| **Maintenance**       | AWS handles it              | You handle everything    |

**Key Features:**

- **Automated backups** - Daily snapshots, point-in-time recovery
- **Multi-AZ deployment** - Automatic failover to standby instance
- **Read replicas** - Scale read-heavy workloads
- **Encryption** - At rest and in transit
- **Performance Insights** - Identify database bottlenecks

**Common Use Cases:**

- **Production databases** - Main application database
- **Read replicas** - Offload read queries from primary
- **Disaster recovery** - Multi-region replication

---

### 4. SES (Simple Email Service)

**What is SES?**

SES is a **cloud-based email sending service** designed for bulk and transactional emails.

**Common Use Cases:**

- **Transactional emails** - Order confirmations, password resets, OTPs
- **Marketing emails** - Newsletters, promotional campaigns
- **Notification emails** - System alerts, user notifications
- **Bulk emails** - Mass communications to users

**Key Benefits:**

- **High deliverability** - AWS maintains good sender reputation
- **Cost-effective** - $0.10 per 1,000 emails
- **Scalable** - Send millions of emails
- **Bounce/complaint handling** - Automatic feedback loops
- **Email analytics** - Track opens, clicks, bounces

**Integration:**

- Works with **IAM** for access control
- Triggers **Lambda** functions on email events
- Integrates with **SNS** for notifications

**Example Use Case:**

```javascript
const AWS = require("aws-sdk");
const ses = new AWS.SES({ region: "us-east-1" });

const params = {
  Source: "noreply@example.com",
  Destination: { ToAddresses: ["user@example.com"] },
  Message: {
    Subject: { Data: "Password Reset" },
    Body: { Text: { Data: "Your OTP is: 123456" } },
  },
};

await ses.sendEmail(params).promise();
```

**Sandbox vs Production:**

- **Sandbox** - Can only send to verified emails (for testing)
- **Production** - Request approval to send to any email

---

### 5. IAM (Identity and Access Management)

**What is IAM?**

IAM is AWS's **permission and access control system** that manages who can access what resources.

**Core Concepts:**

#### IAM Users

- **Individual accounts** for people or applications
- **Long-term credentials** - Access keys, passwords
- **Use case:** Developers, CI/CD systems

#### IAM Roles

- **Temporary credentials** assumed by AWS services or users
- **No long-term keys** - More secure
- **Use case:** EC2 accessing S3, Lambda accessing DynamoDB

#### IAM Policies

- **JSON documents** that define permissions
- **Attached to** users, groups, or roles

**Example Policy:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-bucket/*"
    }
  ]
}
```

#### IAM Groups

- **Collection of users** with shared permissions
- **Use case:** All developers get same permissions

### Least Privilege Principle

**Definition:** Give only the **minimum permissions** required to perform a task.

**Bad Example:**

```json
{
  "Effect": "Allow",
  "Action": "s3:*",
  "Resource": "*"
}
```

This gives full S3 access to all buckets - too broad!

**Good Example:**

```json
{
  "Effect": "Allow",
  "Action": ["s3:GetObject", "s3:PutObject"],
  "Resource": "arn:aws:s3:::my-app-uploads/*"
}
```

This only allows read/write to a specific bucket - minimal permissions.

### Real-World IAM Example

**Scenario:** EC2 instance needs to upload files to S3

**Solution:**

1. Create IAM role with S3 write permissions
2. Attach role to EC2 instance
3. Application code uses AWS SDK (no hardcoded keys needed)

**Benefits:**

- No credentials in code
- Automatic credential rotation
- Easy to audit and revoke

---

### 6. CloudFront (Content Delivery Network)

**What is CloudFront?**

CloudFront is AWS's **CDN service** that caches content at edge locations worldwide for faster delivery.

**How it Works:**

1. User requests file from your domain
2. Request goes to nearest edge location
3. If cached, serves immediately
4. If not cached, fetches from origin (S3/EC2), caches, then serves

**Use Cases:**

- **Static assets** - Images, CSS, JavaScript
- **Video streaming** - On-demand and live streaming
- **API acceleration** - Cache API responses
- **Website hosting** - Serve entire static websites

**Benefits:**

- **Low latency** - Content served from nearest location
- **DDoS protection** - Built-in protection against attacks
- **HTTPS** - Free SSL/TLS certificates
- **Cost savings** - Reduces load on origin servers

---

### 7. Lambda (Serverless Functions)

**What is Lambda?**

Lambda lets you **run code without managing servers**. You pay only for compute time used.

**How it Works:**

- Upload your code
- Configure triggers (API Gateway, S3 events, etc.)
- Lambda automatically runs code when triggered
- Scales automatically

**Use Cases:**

- **API backends** - Serverless REST APIs
- **File processing** - Resize images on S3 upload
- **Scheduled tasks** - Cron jobs without servers
- **Event processing** - Process queue messages

**Pricing:**

- **Free tier:** 1M requests/month, 400,000 GB-seconds compute
- **After free tier:** $0.20 per 1M requests

**Limitations:**

- **Timeout:** Max 15 minutes
- **Memory:** Max 10GB
- **Cold starts:** First invocation can be slow

---

## 5. Monitoring Basics

### What is Monitoring?

**Monitoring** is the practice of observing and tracking the health, performance, and behavior of your applications and infrastructure in real-time.

**Why Monitor?**

- **Detect issues early** - Know about problems before users complain
- **Performance optimization** - Identify bottlenecks and slow queries
- **Capacity planning** - Understand when to scale resources
- **Debugging** - Trace errors and understand system behavior
- **Business insights** - Track user behavior and key metrics

---

### Types of Monitoring

#### 1. Infrastructure Monitoring

**What it tracks:** Server health and resource usage

**Metrics:**

- CPU usage
- Memory usage
- Disk space
- Network traffic
- Server uptime

**Tools:** AWS CloudWatch, Datadog, New Relic

---

#### 2. Application Performance Monitoring (APM)

**What it tracks:** Application behavior and performance

**Metrics:**

- Request rate (requests per second)
- Response time (latency)
- Error rate
- Database query performance
- API endpoint performance

**Tools:** New Relic, Datadog APM, Dynatrace

---

#### 3. Log Monitoring

**What it tracks:** Application and system logs

**Use cases:**

- Error tracking
- Debugging issues
- Security audits
- User activity tracking

**Tools:** ELK Stack (Elasticsearch, Logstash, Kibana), Splunk, CloudWatch Logs

---

#### 4. Synthetic Monitoring

**What it tracks:** Simulated user interactions

**How it works:**

- Automated scripts test your application
- Runs from different locations
- Checks if services are accessible

**Use cases:**

- Uptime monitoring
- API availability
- User flow testing

**Tools:** Pingdom, UptimeRobot, AWS CloudWatch Synthetics

---

### What is Prometheus?

**Prometheus** is an open-source **monitoring and alerting system** that collects and stores metrics as time-series data.

**How Prometheus Works (Pull Model):**

```
Your Application exposes /metrics endpoint
    ↓
Prometheus scrapes /metrics every 15 seconds (configurable)
    ↓
Stores metrics in time-series database
    ↓
Query metrics using PromQL
    ↓
Set up alerts based on thresholds
```

**Example Metrics:**

- `http_requests_total` - Total number of HTTP requests
- `http_request_duration_seconds` - Request latency
- `node_cpu_usage` - CPU usage percentage
- `node_memory_usage` - Memory usage
- `database_connections_active` - Active DB connections

**Key Features:**

- **Pull-based scraping** - Prometheus pulls metrics from applications
- **Time-series database** - Efficient storage for metrics over time
- **PromQL** - Powerful query language for metrics
- **Alerting** - Define rules to trigger alerts

**Why Pull Model is Good:**

- **Centralized control** - Prometheus controls when to scrape
- **Service discovery** - Automatically discovers new services
- **Easier debugging** - Can manually check `/metrics` endpoint

---

### What is Grafana?

**Grafana** is an open-source **visualization and analytics platform** that creates dashboards from monitoring data.

**What Grafana Does:**

- **Creates graphs and charts** - Visualize metrics over time
- **Real-time dashboards** - Live updates as data changes
- **Alerts** - Send notifications when thresholds are breached
- **Multiple data sources** - Connects to Prometheus, CloudWatch, MySQL, etc.

**Common Use Cases:**

- **API performance monitoring** - Request rates, latency, errors
- **Infrastructure monitoring** - CPU, memory, disk usage graphs
- **Business metrics** - User signups, revenue, conversions
- **Error tracking** - Visualize error rates and types

**Prometheus + Grafana Stack:**

```
Application → Exposes /metrics
    ↓
Prometheus → Scrapes and stores metrics
    ↓
Grafana → Queries Prometheus and visualizes data
    ↓
Dashboard → Real-time graphs and alerts
```

**Why This Combo is Popular:**

- **Open-source** - Free to use
- **Powerful** - Handles millions of metrics
- **Flexible** - Highly customizable dashboards
- **Industry standard** - Used by most tech companies

---

## 6. Interview Summary

### Reverse Proxy

A middle server that provides **security, load balancing, SSL termination, caching, and routing** between clients and backend servers.

### SSL/TLS

**Encryption protocols** that secure data in transit. TLS is the modern standard. Reverse proxies perform **TLS termination** to offload encryption from backend servers.

### Cron Jobs

**Time-based scheduled tasks** that automate server operations like backups, cleanup, and data synchronization.

### AWS Core Services

| Service        | Purpose              | Key Use Case                                |
| -------------- | -------------------- | ------------------------------------------- |
| **EC2**        | Virtual servers      | Host backend applications                   |
| **S3**         | Object storage       | Store files, images, backups                |
| **RDS**        | Managed databases    | Production databases with automatic backups |
| **SES**        | Email service        | Send transactional and marketing emails     |
| **IAM**        | Access control       | Manage permissions with roles and policies  |
| **CloudFront** | CDN                  | Fast content delivery worldwide             |
| **Lambda**     | Serverless functions | Run code without managing servers           |

### IAM Key Concepts

- **Roles** - Temporary credentials for AWS services
- **Policies** - JSON documents defining permissions
- **Least Privilege** - Give minimum required permissions

### Monitoring Overview

- **Purpose** - Track health, performance, and behavior of systems
- **Types** - Infrastructure, Application, Logs, Synthetic
- **Prometheus** - Scrapes metrics from `/metrics` endpoints, stores in time-series DB
- **Grafana** - Visualizes Prometheus data with dashboards and alerts
- **Common Stack** - Prometheus + Grafana for monitoring backend applications
