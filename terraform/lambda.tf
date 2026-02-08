# Lambda function for posts
data "archive_file" "lambda_posts" {
  type        = "zip"
  source_dir  = "${path.module}/../lambda-functions/posts"
  output_path = "${path.module}/../lambda-functions/posts.zip"
}

resource "aws_lambda_function" "posts" {
  filename         = data.archive_file.lambda_posts.output_path
  function_name    = "${var.project_name}-posts"
  role            = aws_iam_role.lambda_exec_role.arn
  handler         = "index.handler"
  runtime         = "nodejs18.x"
  source_code_hash = data.archive_file.lambda_posts.output_base64sha256
  
  environment {
    variables = {
      POSTS_TABLE     = aws_dynamodb_table.posts.name
      COMMENTS_TABLE  = aws_dynamodb_table.comments.name
    }
  }
}

# Lambda function for comments
data "archive_file" "lambda_comments" {
  type        = "zip"
  source_dir  = "${path.module}/../lambda-functions/comments"
  output_path = "${path.module}/../lambda-functions/comments.zip"
}

resource "aws_lambda_function" "comments" {
  filename         = data.archive_file.lambda_comments.output_path
  function_name    = "${var.project_name}-comments"
  role            = aws_iam_role.lambda_exec_role.arn
  handler         = "index.handler"
  runtime         = "nodejs18.x"
  source_code_hash = data.archive_file.lambda_comments.output_base64sha256
  
  environment {
    variables = {
      POSTS_TABLE     = aws_dynamodb_table.posts.name
      COMMENTS_TABLE  = aws_dynamodb_table.comments.name
    }
  }
}
