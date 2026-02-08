const { DynamoDBClient, ScanCommand, PutItemCommand, DeleteItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

const client = new DynamoDBClient({});
const TABLE_NAME = process.env.POSTS_TABLE;

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Requested-With',
  'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS,PUT,PATCH'
};

function buildResponse(statusCode, body) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body)
  };
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

async function handler(event) {
  console.log('=== EVENT START ===');
  console.log('Event received:', JSON.stringify(event, null, 2));
  try {
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
      console.log('Handling OPTIONS request');
      return buildResponse(200, '');
    }

    // Get path - remove stage prefix if present
    let path = event.path || event.requestContext?.http?.path || '';
    const method = event.httpMethod || event.requestContext?.http?.method;
    
    console.log(`Original path: "${path}", Method: "${method}"`);
    
    // Extract path without stage name (e.g., /prod/posts -> /posts)
    if (path.startsWith('/prod')) {
      path = path.substring(5); // 修复：从索引5开始截取，跳过"/prod"
    }
    
    console.log(`Processed path: "${path}"`);

    // GET all posts
    if (method === 'GET' && path === '/posts') {
      console.log('Matching GET /posts');
      const command = new ScanCommand({
        TableName: TABLE_NAME,
        Limit: 50
      });
      const result = await client.send(command);
      
      // 将 DynamoDB 格式转换为普通 JS 对象
      const posts = result.Items ? result.Items.map(item => unmarshall(item)) : [];
      
      return buildResponse(200, { posts });
    }

    // POST create new post
    if (method === 'POST' && path === '/posts') {
      const body = JSON.parse(event.body);
      const { title, content, author } = body;

      if (!title || !content || !author) {
        return buildResponse(400, { error: 'Missing required fields' });
      }

      const post = {
        postId: generateId(),
        title,
        content,
        author,
        createdAt: new Date().toISOString()
      };

      const command = new PutItemCommand({
        TableName: TABLE_NAME,
        Item: marshall(post)
      });
      
      await client.send(command);

      return buildResponse(201, { post });
    }

    // DELETE a post
    if (method === 'DELETE' && path.match(/^\/posts\/.+$/)) {
      const postId = path.split('/')[2]; // 获取 /posts/{postId} 中的 postId
      
      console.log(`Deleting post with postId: ${postId}`);
      
      // 先检查帖子是否存在
      const getCommand = new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'postId = :postId',
        ExpressionAttributeValues: marshall({
          ':postId': postId
        })
      });
      
      const getResult = await client.send(getCommand);
      
      if (!getResult.Items || getResult.Items.length === 0) {
        return buildResponse(404, { error: 'Post not found' });
      }

      // 删除帖子
      const deleteCommand = new DeleteItemCommand({
        TableName: TABLE_NAME,
        Key: marshall({
          postId: postId
        })
      });
      
      await client.send(deleteCommand);

      return buildResponse(200, { message: 'Post deleted successfully' });
    }

    return buildResponse(404, { error: 'Not found' });

  } catch (error) {
    console.error('Error:', error);
    return buildResponse(500, { error: 'Internal server error', message: error.message });
  }
}

module.exports = { handler };