#!/bin/bash

# 上传前端到 S3 的脚本

if [ -z "$1" ]; then
    echo "❌ 错误: 请提供 S3 桶名称"
    echo ""
    echo "用法: ./scripts/upload-website.sh <bucket-name>"
    echo ""
    echo "示例: ./scripts/upload-website.sh simple-forum-website-abc123"
    exit 1
fi

BUCKET_NAME=$1

echo "🚀 开始上传前端到 S3..."
echo "📦 桶名称: $BUCKET_NAME"
echo ""

# 上传文件
echo "📤 正在上传文件..."
aws s3 sync s3-website/ "s3://$BUCKET_NAME/" --delete --exclude "*.zip"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 上传成功！"
    echo ""
    echo "📝 可以通过以下方式访问："
    echo "   http://$BUCKET_NAME.s3-website.ap-east-1.amazonaws.com"
    echo ""
else
    echo ""
    echo "❌ 上传失败，请检查错误信息"
    exit 1
fi
