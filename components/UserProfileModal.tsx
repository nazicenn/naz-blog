"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faCalendar, faTimes } from "@fortawesome/free-solid-svg-icons";

interface UserProfile {
  id: string;
  email: string;
  user_metadata: {
    username?: string;
    full_name?: string;
    bio?: string;
  };
  created_at: string;
}

interface UserProfileModalProps {
  userId: string;
  userName: string;
  onClose: () => void;
}

export default function UserProfileModal({ userId, userName, onClose }: UserProfileModalProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      
      const { data: commentUser, error: commentError } = await supabase
        .from("comments")
        .select("user_name, user_email")
        .eq("user_id", userId)
        .limit(1)
        .single();

      let userMetadata: { full_name?: string; bio?: string } = {};
      let userEmail = "";
      let createdAt = new Date().toISOString();
      
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      const isOwnProfile = currentUser?.id === userId;
      
      if (isOwnProfile && currentUser) {
        userMetadata = (currentUser.user_metadata as { full_name?: string; bio?: string }) || {};
        userEmail = currentUser.email || "";
        createdAt = currentUser.created_at;
      } else if (!commentError && commentUser) {
        userEmail = commentUser.user_email || "";
      }

      setUser({
        id: userId,
        email: userEmail,
        user_metadata: {
          username: commentError ? userName : commentUser?.user_name || userName,
          full_name: userMetadata.full_name || "",
          bio: userMetadata.bio || "",
        },
        created_at: createdAt,
      });
      
      setLoading(false);
    };
    fetchUserData();
  }, [userId, userName, supabase]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Ortak taşma engelleme stili
  const textStyle = {
    wordWrap: "break-word" as const,
    whiteSpace: "pre-wrap" as const,
    overflowWrap: "break-word" as const,
    wordBreak: "break-word" as const,
    maxWidth: "100%"
  };

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(8px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: "24px",
          padding: "32px",
          maxWidth: "400px",
          width: "90%",
          border: "1px solid var(--border-light)",
          position: "relative",
          animation: "modalFadeIn 0.2s ease",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            fontSize: "20px",
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <div className="loading__spinner" style={{ width: "32px", height: "32px" }}></div>
          </div>
        ) : user ? (
          <>
            <div
              style={{
                width: "80px",
                height: "80px",
                background: "linear-gradient(135deg, var(--accent-primary), var(--accent-primary-dark))",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: "36px",
              }}
            >
              <FontAwesomeIcon icon={faUser} style={{ color: "#000" }} />
            </div>

            <h3 style={{ textAlign: "center", fontSize: "22px", marginBottom: "8px", ...textStyle }}>
              {user.user_metadata?.username || userName}
            </h3>
            
            {user.user_metadata?.full_name && (
              <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: "16px", fontSize: "14px", ...textStyle }}>
                {user.user_metadata.full_name}
              </p>
            )}

            {user.user_metadata?.bio && (
              <div
                style={{
                  background: "rgba(45,212,191,0.05)",
                  padding: "12px",
                  borderRadius: "12px",
                  marginBottom: "20px",
                  ...textStyle
                }}
              >
                <p style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: "1.5", margin: 0, ...textStyle }}>
                  {user.user_metadata.bio}
                </p>
              </div>
            )}

            {user.email && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginBottom: "12px",
                  color: "var(--text-muted)",
                  fontSize: "12px",
                  ...textStyle
                }}
              >
                <FontAwesomeIcon icon={faEnvelope} style={{ color: "var(--accent-primary)", flexShrink: 0 }} />
                <span style={textStyle}>{user.email}</span>
              </div>
            )}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                color: "var(--text-muted)",
                fontSize: "12px",
              }}
            >
              <FontAwesomeIcon icon={faCalendar} style={{ color: "var(--accent-primary)" }} />
              <span>Katılım: {new Date(user.created_at).toLocaleDateString("tr-TR")}</span>
            </div>
          </>
        ) : (
          <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>
            Kullanıcı bilgileri bulunamadı.
          </p>
        )}
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}