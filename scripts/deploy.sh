#!/bin/bash

# 一键部署脚本 - 用于学习目的

set -e  # 遇到错误立即退出

echo "🚀 开始部署简单论坛系统..."
echo ""

# 步骤1：打包 Lambda 函数
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 步骤 1/4: 打包 Lambda 函数"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
./scripts/package-lambda.sh
echo ""

# 步骤2：初始化 Terraform
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 步骤 2/4: 初始化 Terraform"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd terraform
terraform init
echo ""

# 步骤3：部署基础设施
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🏗️  步骤 3/4: 部署基础设施"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
terraform apply -auto-approve
echo ""

# 步骤4：获取输出信息
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📤 步骤 4/4: 获取部署信息"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ 部署成功！以下是重要信息："
echo ""
terraform output
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 后续步骤"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. 更新前端 API 地址："
echo "   编辑 s3-website/js/app.js"
echo "   将 YOUR_API_GATEWAY_URL 替换为上方的 api_endpoint"
echo ""
echo "2. 上传前端到 S3："
echo "   aws s3 sync s3-website/ s3://<bucket-name> --delete"
echo ""
echo "3. 访问网站："
echo "   打开上方的 website_url"
echo ""
echo "✨ 部署完成！"
