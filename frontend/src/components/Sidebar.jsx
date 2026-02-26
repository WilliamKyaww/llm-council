import { useState, useRef, useEffect } from 'react';
import './Sidebar.css';

export default function Sidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onRenameConversation,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const editInputRef = useRef(null);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  const handleEditStart = (conv, e) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditTitle(conv.title || 'New Conversation');
  };

  const handleEditSubmit = (id) => {
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleEditKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      handleEditSubmit(id);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>LLM Council</h1>
        <button className="new-conversation-btn" onClick={onNewConversation}>
          + New Conversation
        </button>
      </div>

      <div className="conversation-list">
        {conversations.length === 0 ? (
          <div className="no-conversations">No conversations yet</div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={`conversation-item ${conv.id === currentConversationId ? 'active' : ''
                }`}
              onClick={() => onSelectConversation(conv.id)}
            >
              <div className="conversation-content">
                {editingId === conv.id ? (
                  <input
                    ref={editInputRef}
                    className="conversation-title-input"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={() => handleEditSubmit(conv.id)}
                    onKeyDown={(e) => handleEditKeyDown(e, conv.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <div className="conversation-title" title={conv.title || 'New Conversation'}>
                    {conv.title || 'New Conversation'}
                  </div>
                )}
                <div className="conversation-meta">
                  {conv.message_count} messages
                </div>
              </div>
              <div className="conversation-actions">
                <button
                  className="action-btn"
                  onClick={(e) => handleEditStart(conv, e)}
                  title="Rename conversation"
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.2322 5.23223L18.7678 8.76777M16.7322 3.73223C17.7085 2.75592 19.2915 2.75592 20.2678 3.73223C21.2441 4.70854 21.2441 6.29146 20.2678 7.26777L6.5 21.0355H3V17.5L16.7322 3.73223Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={(e) => onDeleteConversation(conv.id, e)}
                  title="Delete conversation"
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
