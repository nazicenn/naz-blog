import fs from "fs";
import path from "path";

export interface Post {
  slug: string;
  title: string;
  date: string;
  author: string;
  category: string;
  summary: string;
  coverImage: string;
  content: string;
}

interface BlogPostData {
  id: string;
  slug: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  author: string;
  date: string;
  coverImage: string;
}

const postsPath = path.join(process.cwd(), "data/blog-posts.json");

function readPosts(): BlogPostData[] {
  if (!fs.existsSync(postsPath)) {
    return [];
  }
  const data = fs.readFileSync(postsPath, "utf8");
  return JSON.parse(data);
}

function writePosts(posts: BlogPostData[]): void {
  fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2), "utf8");
}

export function getAllPosts(): Post[] {
  const posts = readPosts();
  return posts.map((post: BlogPostData) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    author: post.author,
    category: post.category,
    summary: post.summary,
    coverImage: post.coverImage,
    content: post.content,
  }));
}

export function getPostBySlug(slug: string): Post | null {
  const posts = readPosts();
  const post = posts.find((p: BlogPostData) => p.slug === slug);
  if (!post) return null;
  
  return {
    slug: post.slug,
    title: post.title,
    date: post.date,
    author: post.author,
    category: post.category,
    summary: post.summary,
    coverImage: post.coverImage,
    content: post.content,
  };
}

export function addPost(post: Post): void {
  const posts = readPosts();
  const newPost: BlogPostData = {
    id: Date.now().toString(),
    slug: post.slug,
    title: post.title,
    content: post.content,
    summary: post.summary,
    category: post.category,
    author: post.author,
    date: post.date,
    coverImage: post.coverImage,
  };
  posts.push(newPost);
  writePosts(posts);
}

export function deletePost(slug: string): void {
  const posts = readPosts();
  const filtered = posts.filter((post: BlogPostData) => post.slug !== slug);
  writePosts(filtered);
}