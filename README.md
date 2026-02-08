# 简单论坛系统 - 精简版

基于 AWS Lambda、API Gateway、DynamoDB 和 S3 的最简无服务器论坛系统。

## 特点

✅ 无需任何认证系统  
✅ 最小化资源使用  
✅ 适合 AWS 免费试用  
✅ 简单易部署  

## 技术栈

| 组件 | 技术 |
|------|------|
| 前端 | HTML5 + JavaScript |
| 后端 | AWS Lambda (Node.js 18.x) |
| API | API Gateway HTTP API |
| 数据库 | DynamoDB |
| 存储 | S3 |
| 基础设施 | Terraform |

## 架构

```
用户 → S3 静态网站 → API Gateway → Lambda → DynamoDB
```

## 项目结构

```
simple-forum/
├── terraform/              # Terraform配置
│   ├── provider.tf        # AWS Provider
│   ├── variables.tf       # 变量
│   ├── dynamodb.tf        # DynamoDB表
│   ├── s3.tf              # S3桶
│   ├── iam.tf             # IAM角色
│   ├── lambda.tf          # Lambda函数
│   ├── api-gateway.tf     # API Gateway
│   └── outputs.tf         # 输出
├── lambda-functions/      # Lambda函数代码
│   ├── posts/            # 帖子功能
│   └── comments/         # 评论功能
├── s3-website/           # 前端网站
│   ├── index.html
│   └── js/app.js
├── README.md
└── package.json
```

## 部署步骤

### 1. 配置 AWS CLI

```bash
aws configure
```

输入你的 AWS Access Key、Secret Key、Region（建议使用 `us-east-1`）

### 2. 初始化 Terraform

```bash
cd terraform
terraform init
```

### 3. 部署基础设施

```bash
terraform apply
```

输入 `yes` 确认部署

### 4. 打包 Lambda 函数

```bash
cd lambda-functions/posts
zip -r ../../posts.zip *
cd ../comments
zip -r ../../comments.zip *
```

### 5. 重新部署 Lambda

```bash
cd terraform
terraform apply
```

### 6. 获取输出信息

```bash
terraform output
```

记下 `website_url` 和 `api_endpoint`

### 7. 更新前端 API 地址

编辑 `s3-website/js/app.js`，将 `YOUR_API_GATEWAY_URL` 替换为实际的 API 端点：

```javascript
const API_URL = 'https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com';
```

### 8. 上传前端到 S3

```bash
aws s3 sync s3-website/ s3://YOUR_BUCKET_NAME --delete
```

桶名称可以从 Terraform 输出中获取

### 9. 访问论坛

在浏览器中打开 Terraform 输出的 `website_url`

## API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /posts | 获取所有帖子 |
| POST | /posts | 创建帖子 |
| GET | /comments/{postId} | 获取帖子的评论 |
| POST | /comments | 创建评论 |

## 功能

- ✅ 发表帖子（只需要输入名字）
- ✅ 查看帖子列表
- ✅ 发表评论
- ✅ 查看帖子评论
- ✅ 完全匿名（无需注册登录）

## 成本估算

基于 AWS 免费套餐：

| 服务 | 免费额度 | 超出费用 |
|------|----------|----------|
| Lambda | 100万次请求/月 | $0.20/百万次 |
| API Gateway | 100万次请求/月 | $1.00/百万次 |
| DynamoDB | 25GB存储 | $0.25/GB |
| S3 | 5GB存储 | $0.023/GB |

**预计月费用**: $0（在免费额度内）

## 清理资源

删除所有 AWS 资源：

```bash
cd terraform
terraform destroy
```

## 注意事项

1. 确保在 `s3-website/js/app.js` 中更新正确的 API_URL
2. 首次部署需要打包 Lambda 函数
3. 免费试用期间建议选择 `us-east-1` 区域
4. 记得定期清理资源以避免费用

## 扩展建议

未来可以添加的功能：
- 帖子搜索
- 分页加载
- 图片上传
- 点赞功能
- 管理后台

## 许可证

ISC
