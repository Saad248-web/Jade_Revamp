import BlogsPageClient from "./BlogsPageClient";
import { getMergedPublishedPosts } from "@/lib/cms/blogStore";

export const revalidate = 60;

export default async function BlogsPage() {
  const posts = await getMergedPublishedPosts();
  return <BlogsPageClient posts={posts} />;
}
