import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { 
  Header, 
  PostForm, 
  PostCard, 
  PostList, 
  Archive, 
  CharacterCard, 
  CharacterList,
  CommentList
} from './components';
import { PostFormData } from './components';
import MyPosts from './components/MyPosts/MyPosts';
import { Post, Character, CreatePostRequest, UpdatePostRequest } from './api/types';
import { api } from './api';
import { useSession } from './hooks/useSession';
import { ThemeProvider } from './theme';
import { PAGINATION, getOffsetFromPage } from './constants/pagination';


// Main Posts Component (Catalog)
const PostsCatalog: React.FC = () => {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [totalPosts, setTotalPosts] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [selectedPost, setSelectedPost] = React.useState<Post | null>(null);
  const [viewMode, setViewMode] = React.useState<'list' | 'create' | 'view'>('list');
  const { userId, userName, session } = useSession();

  React.useEffect(() => {
    loadPosts(currentPage);
  }, [currentPage]);

  const loadPosts = async (page: number = 1) => {
    setLoading(true);
    try {
      // Get all posts with a high limit to ensure we capture everything
      const allPosts = await api.getPosts(PAGINATION.TOTAL_POSTS_LIMIT, 0);
      const totalCount = allPosts?.length || 0;
      setTotalPosts(totalCount);
      
      // Apply pagination to the fetched posts
      const offset = getOffsetFromPage(page, PAGINATION.POSTS_PER_PAGE);
      const paginatedPosts = allPosts?.slice(offset, offset + PAGINATION.POSTS_PER_PAGE) || [];
      setPosts(paginatedPosts);
      
      console.log(`Loaded ${totalCount} total posts, showing page ${page} with ${paginatedPosts.length} posts`);
    } catch (error) {
      console.error('Failed to load posts:', error);
      setPosts([]);
      setTotalPosts(0);
    }
    setLoading(false);
  };

  const handleCreatePost = async (data: PostFormData) => {
    console.log('Creating post with data:', data);
    console.log('Current userId:', userId);
    console.log('Current userName:', userName);
    
    try {
      const createRequest: CreatePostRequest = {
        title: data.title,
        content: data.content,
        image: data.image,
        author_id: userId,
        author_name: userName
      };
      
      console.log('Create request:', createRequest);
      const newPost = await api.createPost(createRequest);
      console.log('Created post:', newPost);
      
      setPosts(prev => [newPost, ...prev]);
      setShowCreateForm(false);
      setViewMode('list');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleViewPost = async (postId: number) => {
    try {
      const post = await api.getPost(postId);
      if (post) {
        setSelectedPost(post);
        setViewMode('view');
      }
    } catch (error) {
      console.error('Failed to view post:', error);
    }
  };

  const handleEditPost = (post: Post) => {
    setSelectedPost(post);
    setViewMode('create');
  };

  const handleDeletePost = async (postId: number) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await api.deletePost(postId);
        setPosts(prev => prev.filter(p => p.id !== postId));
        if (selectedPost?.id === postId) {
          setSelectedPost(null);
          setViewMode('list');
        }
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  const handleArchivePost = async (postId: number) => {
    if (window.confirm('Are you sure you want to archive this post? It will be moved to the Archive tab.')) {
      try {
        console.log('Archiving post:', postId);
        await api.archivePost(postId);
        console.log('Post archived successfully, updating local state');
        
        // Remove the post from local state immediately
        setPosts(prev => {
          const updatedPosts = prev.filter(p => p.id !== postId);
          console.log('Updated posts count:', updatedPosts.length);
          return updatedPosts;
        });
        
        // If the archived post was being viewed, go back to list
        if (selectedPost?.id === postId) {
          setSelectedPost(null);
          setViewMode('list');
        }
        
        console.log('Post successfully archived and removed from catalog');
      } catch (error) {
        console.error('Failed to archive post:', error);
        alert('Failed to archive post. Please try again.');
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleUpdatePost = async (data: PostFormData) => {
    if (selectedPost) {
      try {
        const updateRequest: UpdatePostRequest = {
          id: selectedPost.id,
          title: data.title,
          content: data.content,
          image: data.image,
          author_id: userId,
          author_name: userName
        };
        
        const updatedPost = await api.updatePost(updateRequest);
        setPosts(prev => prev.map(p => p.id === selectedPost.id ? updatedPost : p));
        setSelectedPost(null);
        setViewMode('list');
      } catch (error) {
        console.error('Failed to update post:', error);
      }
    }
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'create':
        return (
          <div className="content-section">
            <div className="section-header">
              <h2>{selectedPost ? 'Edit Post' : 'Create New Post'}</h2>
              <button 
                className="back-btn"
                onClick={() => {
                  setViewMode('list');
                  setSelectedPost(null);
                }}
              >
                ← Back to Posts
              </button>
            </div>
            <PostForm
              onSubmit={selectedPost ? handleUpdatePost : handleCreatePost}
              submitButtonText={selectedPost ? 'Update Post' : 'Create Post'}
              initialData={selectedPost || {}}
              mode={selectedPost ? 'edit' : 'create'}
            />
          </div>
        );

      case 'view':
        return selectedPost ? (
          <div className="content-section">
            <div className="section-header">
              <h2>View Post</h2>
              <button 
                className="back-btn"
                onClick={() => setViewMode('list')}
              >
                ← Back to Posts
              </button>
            </div>
            <PostCard
              post={selectedPost}
              showActions={true}
              onEdit={() => setViewMode('create')}
              onDelete={handleDeletePost}
              onArchive={handleArchivePost}
            />
            <CommentList
              postId={selectedPost.id}
              currentUserId={userId}
              onCommentUpdate={() => {
                // Optionally refresh the post to update comment count
                console.log('Comment updated');
              }}
            />
            {/* Debug info */}
            <div style={{ marginTop: '10px', padding: '10px', background: '#333', color: '#fff', fontSize: '12px' }}>
              Debug: userId = {userId || 'undefined'}, postId = {selectedPost.id}
            </div>
          </div>
        ) : null;

      default:
        return (
          <div className="content-section">
            <div className="section-header">
              <h2>🌌 Posts from the Multiverse</h2>
              <button 
                className="create-btn"
                onClick={() => setViewMode('create')}
              >
                Create New Post
              </button>
            </div>
            <PostList
              posts={posts}
              onViewPost={handleViewPost}
              onEditPost={handleEditPost}
              onDeletePost={handleDeletePost}
              onArchivePost={handleArchivePost}
              loading={loading}
              showActions={true}
              compact={true}
              currentUserId={userId}
              // Pagination props
              currentPage={currentPage}
              totalItems={totalPosts}
              onPageChange={handlePageChange}
              showPagination={true}
            />
          </div>
        );
    }
  };

  return (
    <div className="posts-catalog">
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

// Home Component Props Interface
interface HomeProps {
  characters: Character[];
  allCharacters: Character[];
  loading: boolean;
  onLoadMore: (newCharacters: Character[]) => void;
}

// Home Component
const Home: React.FC<HomeProps> = ({ characters, allCharacters, loading, onLoadMore }) => {
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const charactersPerPage = 6;
  
  // Calculate if there are more characters to load
  const hasMore = characters.length < allCharacters.length;

  const loadMoreCharacters = () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    const nextPage = currentPage + 1;
    const startIndex = nextPage * charactersPerPage;
    const endIndex = startIndex + charactersPerPage;
    
    // Use the already loaded characters instead of making a new API call
    const newCharacters = allCharacters.slice(startIndex, endIndex);
    
    if (newCharacters.length > 0) {
      const updatedCharacters = [...characters, ...newCharacters];
      onLoadMore(updatedCharacters);
      setCurrentPage(nextPage);
    }
    
    setLoadingMore(false);
  };

  return (
    <div className="home">
      <main className="main-content">
        <div className="content-section">
          <div className="section-header">
            <h2>🌌 Welcome to 1337b04rd</h2>
          </div>
          
          <div className="welcome-content">
            <p>Welcome to the multiverse of posts! Explore posts from across dimensions or create your own.</p>
          </div>

          <div className="characters-section">
            <h3>👥 Characters from the Multiverse</h3>
            <CharacterList 
              characters={characters}
              loading={loading}
              loadingMore={loadingMore}
              onLoadMore={hasMore ? loadMoreCharacters : undefined}
              hasMore={hasMore}
            />
          </div>
        </div>
      </main>
    </div>
  );
};



function App() {
  // Character state moved to App level to persist across tab switches
  const [characters, setCharacters] = useState<Character[]>([]);
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [charactersLoading, setCharactersLoading] = useState(true);
  const [charactersLoaded, setCharactersLoaded] = useState(false);

  // Load characters once when app starts
  useEffect(() => {
    if (!charactersLoaded) {
      loadCharacters();
    }
  }, [charactersLoaded]);

  const loadCharacters = useCallback(async () => {
    try {
      setCharactersLoading(true);
      const fetchedCharacters = await api.getAllCharacters();
      setAllCharacters(fetchedCharacters);
      setCharacters(fetchedCharacters.slice(0, 6)); // Show first 6 characters
      setCharactersLoaded(true);
    } catch (error) {
      console.error('Failed to load characters:', error);
    } finally {
      setCharactersLoading(false);
    }
  }, []);

  const handleLoadMore = useCallback((newCharacters: Character[]) => {
    setCharacters(newCharacters);
  }, []);

  return (
    <Router>
      <ThemeProvider>
        <div className="app">
          <Header />
          
          <Routes>
            <Route path="/" element={
              <Home 
                characters={characters}
                allCharacters={allCharacters}
                loading={charactersLoading}
                onLoadMore={handleLoadMore}
              />
            } />
            <Route path="/posts" element={<PostsCatalog />} />
            <Route path="/my-posts" element={<MyPosts />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <footer className="footer">
            <p>🧬 Built by a Rick who got tired of Reddit. No warranties. Not even existential.</p>
          </footer>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
