/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown, faReply, faTrash, faEdit, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import UserProfileModal from "./UserProfileModal";

interface Comment {
  id: string;
  slug: string;
  user_id: string;
  user_name: string;
  user_avatar: string | null;
  content: string;
  likes: number;
  dislikes: number;
  reply_count: number;
  parent_id: string | null;
  depth: number;
  is_approved: boolean;
  is_deleted: boolean;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

interface CommentsProps {
  postSlug: string;
}

export default function Comments({ postSlug }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [replies, setReplies] = useState<Record<string, Comment[]>>({});
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [collapsedReplies, setCollapsedReplies] = useState<Record<string, boolean>>({});
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});
  
  // Profil modal için state'ler
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState("");

  const supabase = createClient();
  const MAX_CHARS = 1000;

  // Kullanıcı adına tıklama
  const handleUserClick = (userId: string, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
  };

  // Kullanıcının oylarını getir
  async function fetchUserVotes() {
    if (!user) return;
    
    const { data } = await supabase
      .from("comment_likes")
      .select("comment_id, like_type")
      .eq("user_id", user.id);
    
    if (data) {
      const votesMap: Record<string, number> = {};
      data.forEach((vote: { comment_id: string; like_type: number }) => {
        votesMap[vote.comment_id] = vote.like_type;
      });
      setUserVotes(votesMap);
    }
  }

  // Yorumları getir
  async function fetchComments() {
    setLoading(true);
    
    const { data: mainComments, error: mainError } = await supabase
      .from("comments")
      .select("*")
      .eq("slug", postSlug)
      .eq("is_deleted", false)
      .is("parent_id", null)
      .order("is_pinned", { ascending: false })
      .order("likes", { ascending: false })
      .order("created_at", { ascending: false });

    if (!mainError && mainComments) {
      setComments(mainComments);
      
      const repliesMap: Record<string, Comment[]> = {};
      for (const comment of mainComments) {
        const { data: commentReplies } = await supabase
          .from("comments")
          .select("*")
          .eq("slug", postSlug)
          .eq("parent_id", comment.id)
          .eq("is_deleted", false)
          .order("created_at", { ascending: true });
        
        if (commentReplies) {
          repliesMap[comment.id] = commentReplies;
        }
      }
      setReplies(repliesMap);
    }
    setLoading(false);
  }

  // Kullanıcıyı al
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        fetchUserVotes();
      }
    });
  }, []);

  // Yorumları yükle
  useEffect(() => {
    fetchComments();
  }, [postSlug]);

  // Yorum gönder (ana yorum)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const textarea = form.querySelector('textarea[name="mainComment"]') as HTMLTextAreaElement;
    const content = textarea?.value || "";
    
    if (!user || !content.trim()) return;
    if (content.length > MAX_CHARS) {
      alert(`Yorum ${MAX_CHARS} karakterden uzun olamaz!`);
      return;
    }

    setSubmitting(true);
    
    const { error } = await supabase.from("comments").insert({
      slug: postSlug,
      user_id: user.id,
      user_name: user.user_metadata?.username || user.email?.split("@")[0],
      user_email: user.email,
      content: content.trim(),
    });

    if (!error) {
      textarea.value = "";
      await fetchComments();
    }
    setSubmitting(false);
  }

  // Yanıt gönder
  async function handleReplySubmit(commentId: string) {
    if (!user || !replyContent.trim()) return;
    if (replyContent.length > MAX_CHARS) {
      alert(`Yorum ${MAX_CHARS} karakterden uzun olamaz!`);
      return;
    }

    setSubmitting(true);
    
    const { error } = await supabase.from("comments").insert({
      slug: postSlug,
      user_id: user.id,
      user_name: user.user_metadata?.username || user.email?.split("@")[0],
      user_email: user.email,
      content: replyContent.trim(),
      parent_id: commentId,
      depth: 1,
    });

    if (!error) {
      setReplyContent("");
      setReplyTo(null);
      await fetchComments();
    }
    setSubmitting(false);
  }

  // Düzenlemeyi kaydet
  async function handleEditSave(commentId: string) {
    if (!editContent.trim()) return;
    if (editContent.length > MAX_CHARS) {
      alert(`Yorum ${MAX_CHARS} karakterden uzun olamaz!`);
      return;
    }

    const { error } = await supabase
      .from("comments")
      .update({ content: editContent.trim(), is_edited: true })
      .eq("id", commentId);

    if (!error) {
      setEditingComment(null);
      setEditContent("");
      await fetchComments();
    }
  }

  // Yorum sil
  async function handleDelete(commentId: string) {
    if (!confirm("Bu yorumu silmek istediğine emin misin?")) return;

    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      alert("Yorum silinirken bir hata oluştu: " + error.message);
    } else {
      await fetchComments();
    }
  }

  // Beğen/Beğenme işlemi
  async function handleVote(commentId: string, voteType: number) {
    if (!user) {
      alert("Oy vermek için giriş yapın!");
      return;
    }

    const currentVote = userVotes[commentId];
    
    if (currentVote === voteType) {
      const { error } = await supabase
        .from("comment_likes")
        .delete()
        .eq("comment_id", commentId)
        .eq("user_id", user.id);
      
      if (!error) {
        await fetchComments();
        await fetchUserVotes();
      }
    } else {
      if (currentVote) {
        await supabase
          .from("comment_likes")
          .delete()
          .eq("comment_id", commentId)
          .eq("user_id", user.id);
      }
      
      const { error } = await supabase.from("comment_likes").insert({
        comment_id: commentId,
        user_id: user.id,
        like_type: voteType
      });
      
      if (!error) {
        await fetchComments();
        await fetchUserVotes();
      }
    }
  }

  // Zaman formatı
  function formatTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
    
    if (diff < 1) return "az önce";
    if (diff < 60) return `${diff} dakika önce`;
    if (diff < 1440) return `${Math.floor(diff / 60)} saat önce`;
    return date.toLocaleDateString("tr-TR");
  }

  // Cevapları daralt/genişlet
  const toggleReplies = (commentId: string) => {
    setCollapsedReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const commentTextStyle = {
    color: "var(--text-secondary)",
    marginBottom: "12px",
    lineHeight: "1.6",
    wordWrap: "break-word" as const,
    whiteSpace: "pre-wrap" as const,
    overflowWrap: "break-word" as const,
    wordBreak: "break-word" as const,
    maxWidth: "100%"
  };

  return (
    <div style={{ marginTop: "48px", paddingTop: "32px", borderTop: "1px solid var(--border-light)" }}>
      <h3 style={{ fontSize: "24px", marginBottom: "24px" }}>
        Yorumlar ({comments.length})
      </h3>

      {/* Yorum Formu */}
      {user ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: "32px" }}>
          <textarea
            name="mainComment"
            placeholder={`Yorumunu yaz... (Maksimum ${MAX_CHARS} karakter)`}
            rows={4}
            className="auth-input"
            style={{ width: "100%", marginBottom: "8px" }}
            required
          />
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? "Gönderiliyor..." : "Yorum Yap"}
          </button>
        </form>
      ) : (
        <div style={{ marginBottom: "32px", textAlign: "center" }}>
          <p style={{ color: "var(--text-secondary)", marginBottom: "12px" }}>
            Yorum yapmak için giriş yapmalısın.
          </p>
          <a href="/login" className="btn btn--primary" style={{ padding: "8px 24px", fontSize: "14px" }}>
            Giriş Yap
          </a>
        </div>
      )}

      {/* Yorum Listesi */}
      {loading ? (
        <p>Yorumlar yükleniyor...</p>
      ) : comments.length === 0 ? (
        <p style={{ color: "var(--text-muted)" }}>Henüz yorum yok. İlk yorumu sen yap!</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {comments.map((comment) => {
            const hasReplies = replies[comment.id] && replies[comment.id].length > 0;
            const isEdited = comment.updated_at !== comment.created_at;
            const userVote = userVotes[comment.id];
            const isCollapsed = collapsedReplies[comment.id];
            
            return (
              <div key={comment.id}>
                {/* Ana Yorum */}
                <div style={{ background: "var(--bg-card)", padding: "16px", borderRadius: "12px", borderLeft: comment.is_pinned ? "3px solid var(--accent-primary)" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                      {/* Kullanıcı Adı - TIKLANABİLİR BUTON OLARAK */}
                      <button
                        onClick={() => handleUserClick(comment.user_id, comment.user_name)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--accent-primary)",
                          fontWeight: "600",
                          cursor: "pointer",
                          fontSize: "inherit",
                          padding: 0,
                        }}
                      >
                        {comment.user_name}
                      </button>
                      {comment.is_pinned && <span style={{ fontSize: "10px", color: "var(--accent-primary)" }}>📌 Sabitlendi</span>}
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{formatTime(comment.created_at)}</span>
                      {isEdited && !comment.is_deleted && (
                        <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>(düzenlendi)</span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {user?.id === comment.user_id && !comment.is_deleted && (
                        <>
                          <button onClick={() => {
                            setEditingComment(comment.id);
                            setEditContent(comment.content);
                          }} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                            <FontAwesomeIcon icon={faEdit} size="sm" />
                          </button>
                          <button onClick={() => handleDelete(comment.id)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                            <FontAwesomeIcon icon={faTrash} size="sm" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Düzenleme modu */}
                  {editingComment === comment.id ? (
                    <div>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                        className="auth-input"
                        style={{ width: "100%", marginBottom: "8px" }}
                      />
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => handleEditSave(comment.id)} className="btn btn--primary" style={{ padding: "6px 16px" }}>
                          Kaydet
                        </button>
                        <button onClick={() => setEditingComment(null)} className="btn btn--secondary" style={{ padding: "6px 16px" }}>
                          İptal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p style={commentTextStyle}>{comment.content}</p>
                  )}
                  
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: editingComment === comment.id ? "12px" : "0" }}>
                    <button 
                      onClick={() => handleVote(comment.id, 1)} 
                      style={{ 
                        background: "none", 
                        border: "none", 
                        color: userVote === 1 ? "var(--accent-primary)" : "var(--text-muted)", 
                        fontSize: "12px", 
                        cursor: "pointer", 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "4px" 
                      }}
                    >
                      <FontAwesomeIcon icon={faThumbsUp} /> {comment.likes || 0}
                    </button>
                    <button 
                      onClick={() => handleVote(comment.id, -1)} 
                      style={{ 
                        background: "none", 
                        border: "none", 
                        color: userVote === -1 ? "var(--accent-primary)" : "var(--text-muted)", 
                        fontSize: "12px", 
                        cursor: "pointer", 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "4px" 
                      }}
                    >
                      <FontAwesomeIcon icon={faThumbsDown} /> {comment.dislikes || 0}
                    </button>
                    <button 
                      onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)} 
                      style={{ background: "none", border: "none", color: "var(--accent-primary)", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                    >
                      <FontAwesomeIcon icon={faReply} /> Cevapla {hasReplies && `(${replies[comment.id].length})`}
                    </button>
                    {hasReplies && (
                      <button 
                        onClick={() => toggleReplies(comment.id)}
                        style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                      >
                        <FontAwesomeIcon icon={isCollapsed ? faChevronDown : faChevronUp} />
                        {isCollapsed ? " Cevapları göster" : " Cevapları gizle"}
                      </button>
                    )}
                  </div>

                  {/* Yanıt Formu */}
                  {replyTo === comment.id && (
                    <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid var(--border-light)" }}>
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder={`${comment.user_name} yanıtlıyorsun...`}
                        rows={3}
                        className="auth-input"
                        style={{ width: "100%", marginBottom: "8px" }}
                      />
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => handleReplySubmit(comment.id)} className="btn btn--primary" style={{ padding: "6px 16px" }} disabled={submitting}>
                          Yanıtla
                        </button>
                        <button onClick={() => setReplyTo(null)} className="btn btn--secondary" style={{ padding: "6px 16px" }}>
                          İptal
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cevaplar */}
                {hasReplies && !isCollapsed && (
                  <div style={{ marginLeft: "40px", marginTop: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    {replies[comment.id].map((reply) => {
                      const isReplyEdited = reply.updated_at !== reply.created_at;
                      const replyVote = userVotes[reply.id];
                      const isReplyEditing = editingComment === reply.id;
                      
                      return (
                        <div key={reply.id} style={{ background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "10px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", flexWrap: "wrap" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                              {/* Cevap Kullanıcı Adı - TIKLANABİLİR */}
                              <button
                                onClick={() => handleUserClick(reply.user_id, reply.user_name)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: "var(--accent-primary)",
                                  fontWeight: "600",
                                  cursor: "pointer",
                                  fontSize: "13px",
                                  padding: 0,
                                }}
                              >
                                {reply.user_name}
                              </button>
                              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{formatTime(reply.created_at)}</span>
                              {isReplyEdited && !reply.is_deleted && (
                                <span style={{ fontSize: "9px", color: "var(--text-muted)" }}>(düzenlendi)</span>
                              )}
                            </div>
                            <div style={{ display: "flex", gap: "8px" }}>
                              {user?.id === reply.user_id && !reply.is_deleted && (
                                <>
                                  <button onClick={() => {
                                    setEditingComment(reply.id);
                                    setEditContent(reply.content);
                                  }} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                                    <FontAwesomeIcon icon={faEdit} size="xs" />
                                  </button>
                                  <button onClick={() => handleDelete(reply.id)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                                    <FontAwesomeIcon icon={faTrash} size="xs" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                          
                          {/* Cevap düzenleme */}
                          {isReplyEditing ? (
                            <div>
                              <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                rows={2}
                                className="auth-input"
                                style={{ width: "100%", marginBottom: "8px" }}
                              />
                              <div style={{ display: "flex", gap: "8px" }}>
                                <button onClick={() => handleEditSave(reply.id)} className="btn btn--primary" style={{ padding: "4px 12px", fontSize: "12px" }}>
                                  Kaydet
                                </button>
                                <button onClick={() => setEditingComment(null)} className="btn btn--secondary" style={{ padding: "4px 12px", fontSize: "12px" }}>
                                  İptal
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p style={{ ...commentTextStyle, fontSize: "14px", marginBottom: "8px" }}>{reply.content}</p>
                          )}
                          
                          <div style={{ display: "flex", gap: "12px", marginTop: isReplyEditing ? "8px" : "0" }}>
                            <button 
                              onClick={() => handleVote(reply.id, 1)} 
                              style={{ 
                                background: "none", 
                                border: "none", 
                                color: replyVote === 1 ? "var(--accent-primary)" : "var(--text-muted)", 
                                fontSize: "11px", 
                                cursor: "pointer", 
                                display: "flex", 
                                alignItems: "center", 
                                gap: "4px" 
                              }}
                            >
                              <FontAwesomeIcon icon={faThumbsUp} /> {reply.likes || 0}
                            </button>
                            <button 
                              onClick={() => handleVote(reply.id, -1)} 
                              style={{ 
                                background: "none", 
                                border: "none", 
                                color: replyVote === -1 ? "var(--accent-primary)" : "var(--text-muted)", 
                                fontSize: "11px", 
                                cursor: "pointer", 
                                display: "flex", 
                                alignItems: "center", 
                                gap: "4px" 
                              }}
                            >
                              <FontAwesomeIcon icon={faThumbsDown} /> {reply.dislikes || 0}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Profil Modal */}
      {selectedUserId && (
        <UserProfileModal
          userId={selectedUserId}
          userName={selectedUserName}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </div>
  );
}