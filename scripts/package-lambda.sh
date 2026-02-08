#!/bin/bash

# Lambda 函数打包脚本

echo "📦 开始打包 Lambda 函数..."

# 获取脚本所在目录的父目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "📂 项目目录: $PROJECT_DIR"

# 打包 posts 函数
echo "🔨 打包 posts 函数..."
cd "$PROJECT_DIR/lambda-functions/posts"

# 安装依赖
if [ -f "package.json" ]; then
    echo "📥 安装 posts 依赖..."
    npm install --production
    if [ $? -ne 0 ]; then
        echo "❌ posts 依赖安装失败"
        exit 1
    fi
fi

# 打包（排除不必要的文件）
zip -r "$PROJECT_DIR/posts.zip" index.js package.json node_modules/* -q
if [ $? -eq 0 ]; then
    echo "✅ posts.zip 打包成功"
else
    echo "❌ posts.zip 打包失败"
    exit 1
fi

# 打包 comments 函数
echo "🔨 打包 comments 函数..."
cd "$PROJECT_DIR/lambda-functions/comments"

# 安装依赖
if [ -f "package.json" ]; then
    echo "📥 安装 comments 依赖..."
    npm install --production
    if [ $? -ne 0 ]; then
        echo "❌ comments 依赖安装失败"
        exit 1
    fi
fi

# 打包（排除不必要的文件）
zip -r "$PROJECT_DIR/comments.zip" index.js package.json node_modules/* -q
if [ $? -eq 0 ]; then
    echo "✅ comments.zip 打包成功"
else
    echo "❌ comments.zip 打包失败"
    exit 1
fi

# 显示文件信息
echo ""
echo "📦 打包完成！文件信息："
ls -lh "$PROJECT_DIR"/*.zip | awk '{print $9, $5}'

echo ""
echo "✨ 所有 Lambda 函数已打包完成！"
