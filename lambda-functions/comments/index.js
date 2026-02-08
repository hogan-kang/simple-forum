const { DynamoDBClient, QueryCommand, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');

const client = new DynamoDBClient({});
const TABLE_NAME = process.env.COMMENTS_TABLE;

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
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
  console.log('=== COMMENTS EVENT START ===');
  console.log('Event received:', JSON.stringify(event, null, 2));
  try {
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
      console.log('Handling OPTIONS request for comments');
      return buildResponse(200, '');
    }

    // Get path - remove stage prefix if present
    let path = event.path || event.requestContext?.http?.path || '';
    const method = event.httpMethod || event.requestContext?.http?.method;
    
    console.log(`Original path: "${path}", Method: "${method}"`);
    
    // Extract path without stage name (e.g., /prod/comments -> /comments)
    if (path.startsWith('/prod')) {
      path = path.substring(5); // 修复：从索引5开始截取，跳过"/prod"
    }
    
    console.log(`Processed path: "${path}"`);

    // GET comments for a post
    if (method === 'GET' && path.match(/^\/comments\/.+$/)) {
      const postId = path.split('/')[2]; // 获取 /comments/{postId} 中的 postId
      
      console.log(`Getting comments for postId: ${postId}`);
      
      const command = new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'PostIdIndex',
        KeyConditionExpression: 'postId = :postId',
        ExpressionAttributeValues: marshall({
          ':postId': postId
        })
      });

      const result = await client.send(command);
      
      // 将 DynamoDB 格式转换为普通 JS 对象
      const comments = result.Items ? result.Items.map(item => {
        const comment = {};
        for (const [key, value] of Object.entries(item)) {
          comment[key] = value.S || value.N || value.BOOL || value.L || value.M || value.NULL;
        }
        return comment;
      }) : [];

      return buildResponse(200, { comments });
    }

    // POST create new comment
    if (method === 'POST' && path === '/comments') {
      const body = JSON.parse(event.body);
      const { postId, content, author } = body;

      if (!postId || !content || !author) {
        return buildResponse(400, { error: 'Missing required fields' });
      }

      const comment = {
        commentId: generateId(),
        postId,
        content,
        author,
        createdAt: new Date().toISOString()
      };

      const command = new PutItemCommand({
        TableName: TABLE_NAME,
        Item: marshall(comment)
      });
      
      await client.send(command);

      return buildResponse(201, { comment });
    }

    return buildResponse(404, { error: 'Not found' });

  } catch (error) {
    console.error('Error:', error);
    return buildResponse(500, { error: 'Internal server error', message: error.message });
  }
}

module.exports = { handler };