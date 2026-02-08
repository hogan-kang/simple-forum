# API Gateway
resource "aws_apigatewayv2_api" "api" {
  name          = "${var.project_name}-api"
  protocol_type = "HTTP"
}

# API Gateway integration for posts
resource "aws_apigatewayv2_integration" "posts" {
  api_id           = aws_apigatewayv2_api.api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.posts.invoke_arn
}

# API Gateway routes for posts
resource "aws_apigatewayv2_route" "posts_get" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /posts"
  target    = "integrations/${aws_apigatewayv2_integration.posts.id}"
}

resource "aws_apigatewayv2_route" "posts_post" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /posts"
  target    = "integrations/${aws_apigatewayv2_integration.posts.id}"
}

resource "aws_apigatewayv2_route" "posts_delete" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "DELETE /posts/{postId}"
  target    = "integrations/${aws_apigatewayv2_integration.posts.id}"
}

resource "aws_apigatewayv2_route" "posts_options" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "OPTIONS /posts"
  target    = "integrations/${aws_apigatewayv2_integration.posts.id}"
}

resource "aws_apigatewayv2_route" "posts_delete_options" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "OPTIONS /posts/{postId}"
  target    = "integrations/${aws_apigatewayv2_integration.posts.id}"
}

# API Gateway integration for comments
resource "aws_apigatewayv2_integration" "comments" {
  api_id           = aws_apigatewayv2_api.api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.comments.invoke_arn
}

# API Gateway routes for comments
resource "aws_apigatewayv2_route" "comments_get" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /comments/{postId}"
  target    = "integrations/${aws_apigatewayv2_integration.comments.id}"
}

resource "aws_apigatewayv2_route" "comments_post" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /comments"
  target    = "integrations/${aws_apigatewayv2_integration.comments.id}"
}

resource "aws_apigatewayv2_route" "comments_options" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "OPTIONS /comments"
  target    = "integrations/${aws_apigatewayv2_integration.comments.id}"
}

resource "aws_apigatewayv2_route" "comments_options_with_param" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "OPTIONS /comments/{postId}"
  target    = "integrations/${aws_apigatewayv2_integration.comments.id}"
}

# API Gateway deployment
resource "aws_apigatewayv2_deployment" "api" {
  api_id      = aws_apigatewayv2_api.api.id
  description = "Initial deployment"
  
  depends_on = [
    aws_apigatewayv2_route.posts_get,
    aws_apigatewayv2_route.posts_post,
    aws_apigatewayv2_route.posts_delete,
    aws_apigatewayv2_route.posts_options,
    aws_apigatewayv2_route.posts_delete_options,
    aws_apigatewayv2_route.comments_get,
    aws_apigatewayv2_route.comments_post,
    aws_apigatewayv2_route.comments_options,
    aws_apigatewayv2_route.comments_options_with_param
  ]
}

resource "aws_apigatewayv2_stage" "api" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "prod"
  auto_deploy = true
}

# Lambda permissions
resource "aws_lambda_permission" "posts" {
  statement_id  = "AllowAPIGatewayInvokePosts"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.posts.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "comments" {
  statement_id  = "AllowAPIGatewayInvokeComments"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.comments.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}