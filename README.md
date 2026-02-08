# Simple Forum - AWS Serverless Application

A full-featured forum application built with AWS serverless technologies including Lambda, API Gateway, DynamoDB, and S3.

## Features

✅ **Complete CRUD Operations** - Create, Read, Update, Delete posts and comments  
✅ **Modern Architecture** - Fully serverless with auto-scaling  
✅ **Cost Effective** - Leverages AWS Free Tier  
✅ **Easy Deployment** - Automated with Terraform and scripts  
✅ **Cross-Origin Support** - Properly configured CORS for web applications  

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | HTML5 + Vanilla JavaScript |
| Backend | AWS Lambda (Node.js 18.x) |
| API | API Gateway HTTP API |
| Database | DynamoDB |
| Storage | S3 Static Website |
| Infrastructure | Terraform |
| SDK | AWS SDK v3 for JavaScript |

## Architecture

```
Users → S3 Static Website → API Gateway → Lambda Functions → DynamoDB
                                   ↓
                            CORS Enabled
```

## Project Structure

```
simple-forum/
├── terraform/              # Infrastructure as Code
│   ├── provider.tf        # AWS Provider configuration
│   ├── variables.tf       # Input variables
│   ├── dynamodb.tf        # DynamoDB tables setup
│   ├── s3.tf              # S3 bucket configuration
│   ├── iam.tf             # IAM roles and policies
│   ├── lambda.tf          # Lambda functions deployment
│   ├── api-gateway.tf     # API Gateway routing
│   └── outputs.tf         # Terraform outputs
├── lambda-functions/      # Lambda function source code
│   ├── posts/            # Posts management (CRUD)
│   │   └── index.js      # Main handler with AWS SDK v3
│   └── comments/         # Comments management
│       └── index.js      # Comment operations
├── s3-website/           # Frontend application
│   ├── index.html        # Main HTML page with styling
│   └── js/app.js         # Client-side JavaScript
├── scripts/              # Automation scripts
│   ├── deploy.sh         # Full deployment script
│   ├── package-lambda.sh # Lambda packaging utility
│   └── upload-website.sh # Website deployment to S3
├── README.md             # This file
└── package.json          # Project metadata
```

## Quick Start

### Prerequisites

- AWS CLI configured with appropriate credentials
- Terraform installed (v1.0+)
- Node.js 18.x or later

### 1. Configure AWS Credentials

```bash
aws configure
```

Set your region to `ap-east-1` (Hong Kong) or your preferred region.

### 2. Deploy Infrastructure

```bash
# Initialize Terraform
cd terraform
terraform init

# Deploy all resources
terraform apply
```

Type `yes` when prompted to confirm deployment.

### 3. Deploy Application

```bash
# Package and deploy Lambda functions
cd ..
./scripts/deploy.sh
```

This script will:
- Package both Lambda functions
- Upload frontend to S3
- Display the website URL

### 4. Access Your Forum

Open the website URL shown in the deployment output in your browser.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/posts` | Retrieve all posts |
| POST | `/posts` | Create a new post |
| DELETE | `/posts/{postId}` | Delete a specific post |
| GET | `/comments/{postId}` | Get comments for a post |
| POST | `/comments` | Create a new comment |

## Available Scripts

### `scripts/deploy.sh`
Full deployment automation:
```bash
./scripts/deploy.sh
```

### `scripts/package-lambda.sh`
Package Lambda functions for deployment:
```bash
./scripts/package-lambda.sh
```

### `scripts/upload-website.sh`
Upload frontend to S3 (requires bucket name):
```bash
./scripts/upload-website.sh <bucket-name>
```

## Current Features

### Post Management
- ✅ Create new posts with title, content, and author
- ✅ View all posts with timestamps
- ✅ Delete any post with confirmation
- ✅ Responsive design for all devices

### Comment System
- ✅ Add comments to specific posts
- ✅ View comments organized by post
- ✅ Real-time comment display

### User Experience
- ✅ Clean, modern interface
- ✅ Instant feedback for all operations
- ✅ Error handling and user notifications
- ✅ Cross-browser compatibility

## Cost Estimation

Based on AWS Free Tier limits:

| Service | Free Tier | Beyond Free Tier |
|---------|-----------|------------------|
| Lambda | 1M requests/month | $0.20/M requests |
| API Gateway | 1M requests/month | $1.00/M requests |
| DynamoDB | 25GB storage | $0.25/GB-month |
| S3 | 5GB storage | $0.023/GB-month |

**Estimated Monthly Cost**: $0 (within free tier limits)

## Cleanup

To remove all AWS resources and avoid charges:

```bash
cd terraform
terraform destroy
```

Confirm with `yes` when prompted.

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure all HTTP methods have corresponding OPTIONS routes
2. **404 Not Found**: Verify API Gateway routes include path parameters
3. **Module Not Found**: Check Lambda function packaging includes all dependencies
4. **Permission Denied**: Confirm IAM policies grant DynamoDB access

### Debugging Steps

1. Check Lambda function logs in CloudWatch
2. Verify API Gateway configuration in AWS Console
3. Test API endpoints directly with curl
4. Review Terraform state and outputs

## Future Enhancements

Planned features for future versions:
- [ ] User authentication and authorization
- [ ] Post editing capabilities
- [ ] Search functionality
- [ ] Pagination for large datasets
- [ ] Image uploads and media support
- [ ] Like/vote system
- [ ] Admin dashboard
- [ ] Email notifications

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Acknowledgments

- Built with AWS Serverless technologies
- Uses modern JavaScript practices
- Infrastructure managed with Terraform
- Inspired by simple, functional web applications