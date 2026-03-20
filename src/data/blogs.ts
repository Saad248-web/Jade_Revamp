export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  link: string;
  date: string;
  category: string;
  readTime: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "The Art of Slow Living: A Guide to Disconnecting",
    excerpt:
      "Welcome to Jade Hospitainment, where hospitality meets entertainment. Discover our unique approach to hosting and why taking time to disconnect is essential for modern wellbeing.",
    image: "/assets/casual_stays.png",
    link: "/blogs/the-art-of-slow-living",
    date: "March 15, 2024",
    category: "WELLNESS",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Designing for Connection: Architecture at Jade",
    excerpt:
      "Creating spaces that inspire connection and creativity. How we design our villas for maximum impact and meaningful interactions.",
    image: "/assets/casual_stays.png",
    link: "/blogs/designing-for-connection",
    date: "March 10, 2024",
    category: "ARCHITECTURE",
    readTime: "4 min read",
  },
  {
    id: 3,
    title: "The Perfect Corporate Offsite: Beyond the Boardroom",
    excerpt:
      "From intimate gatherings to grand celebrations. A guide to hosting the perfect corporate event that fosters teamwork and innovation.",
    image: "/assets/casual_stays.png",
    link: "/blogs/perfect-corporate-offsite",
    date: "March 05, 2024",
    category: "CORPORATE",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "Celebracying milestones: Private Villa Edition",
    excerpt:
      "Birthdays, poolside parties, or bachelor parties. Discover why a private villa is the ultimate canvas for your next big celebration.",
    image: "/assets/casual_stays.png",
    link: "/blogs/celebrating-milestones",
    date: "February 28, 2024",
    category: "CELEBRATIONS",
    readTime: "5 min read",
  },
];
