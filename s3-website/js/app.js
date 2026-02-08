// API配置 - 部署后需要替换为实际的API端点
const API_URL = 'https://ppd1y6nz79.execute-api.ap-east-1.amazonaws.com/prod';

// 加载帖子
async function loadPosts() {
    const loading = document.getElementById('loading');
    const postsDiv = document.getElementById('posts');

    try {
        loading.style.display = 'block';
        postsDiv.innerHTML = '';

        const response = await fetch(`${API_URL}/posts`);
        const data = await response.json();

        if (data.posts) {
            data.posts.forEach(post => {
                const postElement = createPostElement(post);
                postsDiv.appendChild(postElement);
            });
        }
    } catch (error) {
        console.error('加载帖子错误:', error);
        postsDiv.innerHTML = '<p style="text-align:center;">加载失败，请刷新页面重试</p>';
    } finally {
        loading.style.display = 'none';
    }
}

// 创建帖子元素
function createPostElement(post) {
    const div = document.createElement('div');
    div.className = 'post-card';
    
    const date = new Date(post.createdAt).toLocaleString('zh-CN');

    div.innerHTML = `
        <div class="post-header">
            <span class="post-author">${post.author}</span>
            <span class="post-date">${date}</span>
            <button class="delete-btn" onclick="deletePost('${post.postId}')" title="删除帖子">×</button>
        </div>
        <div class="post-title">${post.title}</div>
        <div class="post-content">${post.content}</div>
        <button class="toggle-comments" onclick="toggleComments('${post.postId}')">
            查看/隐藏评论
        </button>
        <div id="comments-${post.postId}" class="comments-section" style="display:none;">
            <div id="comments-list-${post.postId}"></div>
            <div class="comment-form" style="margin-top: 15px;">
                <input type="text" id="comment-author-${post.postId}" placeholder="你的名字" style="width: 200px; padding: 5px;">
                <textarea id="comment-content-${post.postId}" placeholder="写下你的评论..." style="width: 100%; padding: 5px; min-height: 60px;"></textarea>
                <br><br>
                <button class="btn btn-primary" onclick="addComment('${post.postId}')">发表评论</button>
            </div>
        </div>
    `;

    return div;
}

// 切换评论显示
async function toggleComments(postId) {
    const commentsSection = document.getElementById(`comments-${postId}`);
    
    if (commentsSection.style.display === 'none') {
        commentsSection.style.display = 'block';
        loadComments(postId);
    } else {
        commentsSection.style.display = 'none';
    }
}

// 加载评论
async function loadComments(postId) {
    const commentsList = document.getElementById(`comments-list-${postId}`);

    try {
        const response = await fetch(`${API_URL}/comments/${postId}`);
        const data = await response.json();

        if (data.comments && data.comments.length > 0) {
            commentsList.innerHTML = data.comments.map(comment => {
                const date = new Date(comment.createdAt).toLocaleString('zh-CN');
                return `
                    <div class="comment">
                        <div class="comment-header">
                            <span class="comment-author">${comment.author}</span>
                            <span class="comment-date">${date}</span>
                        </div>
                        <div class="comment-content">${comment.content}</div>
                    </div>
                `;
            }).join('');
        } else {
            commentsList.innerHTML = '<p style="color:#999;">暂无评论</p>';
        }
    } catch (error) {
        console.error('加载评论错误:', error);
        commentsList.innerHTML = '<p style="color:red;">加载评论失败</p>';
    }
}

// 发表帖子
async function createPost() {
    const author = document.getElementById('postAuthor').value.trim();
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();

    if (!author || !title || !content) {
        alert('请填写所有字段');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ author, title, content })
        });

        const data = await response.json();

        if (response.ok) {
            alert('帖子发布成功！');
            document.getElementById('postAuthor').value = '';
            document.getElementById('postTitle').value = '';
            document.getElementById('postContent').value = '';
            loadPosts();
        } else {
            alert(data.error || '发布失败');
        }
    } catch (error) {
        console.error('发布帖子错误:', error);
        alert('发布失败，请稍后重试');
    }
}

// 删除帖子
async function deletePost(postId) {
    if (!confirm('确定要删除这个帖子吗？此操作不可恢复！')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            alert('帖子删除成功！');
            loadPosts(); // 重新加载帖子列表
        } else {
            alert(data.error || '删除失败');
        }
    } catch (error) {
        console.error('删除帖子错误:', error);
        alert('删除失败，请稍后重试');
    }
}

// 发表评论
async function addComment(postId) {
    const authorInput = document.getElementById(`comment-author-${postId}`);
    const contentInput = document.getElementById(`comment-content-${postId}`);
    const author = authorInput.value.trim();
    const content = contentInput.value.trim();

    if (!author || !content) {
        alert('请填写你的名字和评论内容');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ postId, author, content })
        });

        const data = await response.json();

        if (response.ok) {
            alert('评论发表成功！');
            contentInput.value = '';
            loadComments(postId);
        } else {
            alert(data.error || '发表失败');
        }
    } catch (error) {
        console.error('发表评论错误:', error);
        alert('发表失败，请稍后重试');
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
});