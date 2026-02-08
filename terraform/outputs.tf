output "website_url" {
  description = "Website URL"
  value       = aws_s3_bucket_website_configuration.website.website_endpoint
}

output "api_endpoint" {
  description = "API Gateway endpoint"
  value       = aws_apigatewayv2_stage.api.invoke_url
}

output "posts_table_name" {
  description = "DynamoDB Posts table name"
  value       = aws_dynamodb_table.posts.name
}

output "comments_table_name" {
  description = "DynamoDB Comments table name"
  value       = aws_dynamodb_table.comments.name
}
