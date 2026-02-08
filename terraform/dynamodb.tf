# DynamoDB for storing forum data
resource "aws_dynamodb_table" "posts" {
  name           = "${var.project_name}-posts"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "postId"
  
  attribute {
    name = "postId"
    type = "S"
  }
  
  tags = {
    Project = var.project_name
  }
}

resource "aws_dynamodb_table" "comments" {
  name           = "${var.project_name}-comments"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "commentId"
  
  attribute {
    name = "commentId"
    type = "S"
  }
  
  attribute {
    name = "postId"
    type = "S"
  }
  
  global_secondary_index {
    name            = "PostIdIndex"
    hash_key        = "postId"
    projection_type = "ALL"
  }
  
  tags = {
    Project = var.project_name
  }
}
