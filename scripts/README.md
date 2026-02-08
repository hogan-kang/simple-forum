# 脚本使用说明

## 📁 脚本列表

### 1. package-lambda.sh
打包 Lambda 函数代码

**用法：**
```bash
npm run package
# 或
./scripts/package-lambda.sh
```

**功能：**
- 将 `lambda-functions/posts/` 打包为 `posts.zip`
- 将 `lambda-functions/comments/` 打包为 `comments.zip`

---

### 2. deploy.sh
一键部署整个系统

**用法：**
```bash
npm run deploy
# 或
./scripts/deploy.sh
```

**功能：**
1. 打包 Lambda 函数
2. 初始化 Terraform
3. 部署所有 AWS 资源
4. 显示输出信息

**注意：** 会自动确认所有 Terraform 操作（-auto-approve）

---

### 3. upload-website.sh
上传前端文件到 S3

**用法：**
```bash
npm run upload <bucket-name>
# 或
./scripts/upload-website.sh <bucket-name>
```

**示例：**
```bash
npm run upload simple-forum-website-abc123
```

**参数：**
- `bucket-name`: S3 桶名称（从 terraform output 获取）

---

## 🚀 快速开始

### 完整部署流程

```bash
# 1. 一键部署（推荐新手）
npm run deploy

# 2. 手动部署（学习用）
npm run init           # 初始化 Terraform
npm run plan           # 查看部署计划
npm run package        # 打包 Lambda
npm run apply          # 部署到 AWS
terraform output      # 获取部署信息

# 3. 更新前端 API 地址
# 编辑 s3-website/js/app.js

# 4. 上传前端
npm run upload <bucket-name>
```

---

## 📦 package.json 命令

| 命令 | 说明 |
|------|------|
| `npm run init` | 初始化 Terraform |
| `npm run plan` | 查看部署计划 |
| `npm run apply` | 部署到 AWS |
| `npm run package` | 打包 Lambda 函数 |
| `npm run deploy` | 一键部署（所有步骤） |
| `npm run destroy` | 删除所有资源 |
| `npm run upload` | 上传前端到 S3 |

---

## 🔧 手动步骤（学习用）

如果你想了解每个步骤，可以手动执行：

```bash
# 1. 打包 Lambda 函数
cd lambda-functions/posts
zip -r ../../posts.zip *
cd ../comments
zip -r ../../comments.zip *

# 2. 初始化 Terraform
cd terraform
terraform init

# 3. 查看部署计划
terraform plan

# 4. 部署
terraform apply

# 5. 获取输出
terraform output
```

---

## 📝 注意事项

1. **首次使用 deploy.sh**
   - 会自动打包 Lambda
   - 会自动确认部署
   - 确保已配置 AWS CLI

2. **上传前端前**
   - 必须先更新 `s3-website/js/app.js` 中的 `API_URL`
   - 从 `terraform output` 获取 `api_endpoint`

3. **删除资源**
   - 使用 `npm run destroy`
   - 会提示确认删除

---

## 🎯 推荐工作流

**第一次部署：**
```bash
npm run deploy          # 一键部署
# 记录 terraform output 的输出
# 编辑 s3-website/js/app.js
npm run upload <bucket>
```

**后续更新 Lambda 代码：**
```bash
npm run package        # 重新打包
npm run apply          # 重新部署
```

**后续更新前端代码：**
```bash
npm run upload <bucket>  # 直接上传
```
