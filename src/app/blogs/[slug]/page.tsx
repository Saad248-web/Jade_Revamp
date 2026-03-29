import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getPublishedPosts } from "@/data/blogs";
import PostContent from "./PostContent";
import JsonLd from "@/components/seo/JsonLd";

// Configure Incremental Static Regeneration (ISR)
export const revalidate = 3600; // Revalidate every hour

interface Props {
  params: { slug: string };
}

/**
 * Generate static paths for all published blog posts at build time
 */
export async function generateStaticParams() {
  const posts = getPublishedPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

/**
 * Dynamically generate metadata for each blog post
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found | Jade Hospitainment",
    };
  }

  const description =
    post.description ||
    post.sections.find((s) => s.type === "text")?.content?.slice(0, 160) ||
    "Read the latest from Jade Hospitainment Journal.";

  return {
    title: post.title,
    description,
    alternates: {
      canonical: `https://jadehospitainment.com/blogs/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description,
      url: `https://jadehospitainment.com/blogs/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.dateModified || post.date,
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [post.image],
    },
  };
}

export default function BlogPage({ params }: Props) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Get related posts (excluding current)
  const allPosts = getPublishedPosts();
  const relatedPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  // Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: [post.image],
    datePublished: post.date,
    dateModified: post.dateModified || post.date,
    author: {
      "@type": "Organization",
      name: "Jade Hospitainment",
      url: "https://jadehospitainment.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Jade Hospitainment",
      logo: {
        "@type": "ImageObject",
        url: "https://jadehospitainment.com/logo.png", // Ensure actual logo exists
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://jadehospitainment.com/blogs/${post.slug}`,
    },
  };

  // FAQ Schema if present
  const faqSection = post.sections.find((s) => s.type === "faq");
  const faqSchema = faqSection?.faqs
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqSection.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }
    : null;

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://jadehospitainment.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://jadehospitainment.com/blogs",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://jadehospitainment.com/blogs/${post.slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd schema={articleSchema} />
      <JsonLd schema={breadcrumbSchema} />
      {faqSchema && <JsonLd schema={faqSchema} />}
      <PostContent post={post} relatedPosts={relatedPosts} />
    </>
  );
}
