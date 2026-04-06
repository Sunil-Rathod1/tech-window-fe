import { Component, OnInit } from '@angular/core';

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: number;
  image: string;
  content?: string;
}

interface TrendingTopic {
  id: number;
  title: string;
  description: string;
  icon: string;
  trend: string;
}

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  activeCategory: string = 'all';
  filteredNews: NewsItem[] = [];

  newsData: NewsItem[] = [
    {
      id: 1,
      title: "New Full-Stack Development Course Launched",
      excerpt: "Master modern web development with our comprehensive full-stack course covering React, Node.js, and MongoDB.",
      category: "Course Updates",
      date: "December 14, 2024",
      readTime: 3,
      image: "assets/photos/course-2.jpg"
    },
    {
      id: 2,
      title: "Microsoft's Latest AI Breakthrough in Azure",
      excerpt: "Microsoft announces revolutionary AI capabilities in Azure, transforming cloud computing and machine learning.",
      category: "Industry News",
      date: "December 13, 2024",
      readTime: 5,
      image: "assets/photos/course-3.jpg"
    },
    {
      id: 3,
      title: "Cybersecurity: The Most In-Demand Skill of 2024",
      excerpt: "With rising cyber threats, cybersecurity professionals are in high demand. Learn about the latest security trends.",
      category: "Tech Trends",
      date: "December 12, 2024",
      readTime: 4,
      image: "assets/photos/course-details.jpg"
    },
    {
      id: 4,
      title: "Google's New Cloud Computing Certification",
      excerpt: "Google Cloud Platform introduces new professional certifications for cloud architects and data engineers.",
      category: "Course Updates",
      date: "December 11, 2024",
      readTime: 3,
      image: "assets/photos/home.jpg"
    },
    {
      id: 5,
      title: "The Rise of Low-Code/No-Code Development",
      excerpt: "Discover how low-code platforms are democratizing software development and creating new career opportunities.",
      category: "Tech Trends",
      date: "December 10, 2024",
      readTime: 4,
      image: "assets/photos/sidebar-1.d4b3c417.jpg"
    },
    {
      id: 6,
      title: "Amazon Web Services Expands Global Infrastructure",
      excerpt: "AWS announces new data centers and enhanced services, strengthening its position in cloud computing.",
      category: "Company Updates",
      date: "December 9, 2024",
      readTime: 3,
      image: "assets/photos/sidebar-4.ab008ac3.jpg"
    },
    {
      id: 7,
      title: "Data Science Bootcamp: From Beginner to Expert",
      excerpt: "Our intensive data science bootcamp now includes advanced machine learning and deep learning modules.",
      category: "Course Updates",
      date: "December 8, 2024",
      readTime: 4,
      image: "assets/photos/course-1.jpg"
    },
    {
      id: 8,
      title: "The Future of Remote Work in Tech",
      excerpt: "How technology companies are adapting to hybrid work models and the tools driving this transformation.",
      category: "Industry News",
      date: "December 7, 2024",
      readTime: 5,
      image: "assets/photos/course-2.jpg"
    },
    {
      id: 9,
      title: "Blockchain Technology in Enterprise Applications",
      excerpt: "Explore how blockchain is revolutionizing supply chain management and financial services.",
      category: "Tech Trends",
      date: "December 6, 2024",
      readTime: 4,
      image: "assets/photos/course-3.jpg"
    },
    {
      id: 10,
      title: "Apple's New Developer Tools and Frameworks",
      excerpt: "Apple introduces cutting-edge development tools for iOS and macOS, enhancing the developer experience.",
      category: "Company Updates",
      date: "December 5, 2024",
      readTime: 3,
      image: "assets/photos/course-details.jpg"
    },
    {
      id: 11,
      title: "DevOps Best Practices for Modern Teams",
      excerpt: "Learn the essential DevOps practices that are transforming how teams develop and deploy software.",
      category: "Course Updates",
      date: "December 4, 2024",
      readTime: 4,
      image: "assets/photos/home.jpg"
    },
    {
      id: 12,
      title: "The Impact of 5G on Mobile Development",
      excerpt: "How 5G technology is creating new opportunities for mobile app developers and changing user experiences.",
      category: "Tech Trends",
      date: "December 3, 2024",
      readTime: 3,
      image: "assets/photos/sidebar-1.d4b3c417.jpg"
    }
  ];

  trendingTopics: TrendingTopic[] = [
    {
      id: 1,
      title: "Artificial Intelligence",
      description: "AI and ML are transforming every industry",
      icon: "fas fa-brain",
      trend: "🔥 Trending"
    },
    {
      id: 2,
      title: "Cloud Computing",
      description: "Multi-cloud strategies gaining popularity",
      icon: "fas fa-cloud",
      trend: "📈 Rising"
    },
    {
      id: 3,
      title: "Cybersecurity",
      description: "Zero-trust security models on the rise",
      icon: "fas fa-shield-alt",
      trend: "🔒 Hot"
    },
    {
      id: 4,
      title: "Web3 & Blockchain",
      description: "Decentralized applications growing fast",
      icon: "fas fa-link",
      trend: "⚡ New"
    },
    {
      id: 5,
      title: "DevOps",
      description: "CI/CD pipelines essential for success",
      icon: "fas fa-code-branch",
      trend: "🚀 Popular"
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.filteredNews = this.newsData;
  }

  setActiveCategory(category: string): void {
    this.activeCategory = category;
    this.filterNews();
  }

  filterNews(): void {
    if (this.activeCategory === 'all') {
      this.filteredNews = this.newsData;
    } else {
      this.filteredNews = this.newsData.filter(news => {
        switch (this.activeCategory) {
          case 'courses':
            return news.category === 'Course Updates';
          case 'industry':
            return news.category === 'Industry News';
          case 'trends':
            return news.category === 'Tech Trends';
          case 'companies':
            return news.category === 'Company Updates';
          default:
            return true;
        }
      });
    }
  }

  shareNews(news: NewsItem): void {
    // Implementation for sharing functionality
    const shareText = `Check out this article: ${news.title}`;
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: news.title,
        text: shareText,
        url: shareUrl
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
      window.open(url, '_blank');
    }
  }

  subscribeNewsletter(email: string): void {
    // Implementation for newsletter subscription
    console.log('Newsletter subscription for:', email);
    // Here you would typically make an API call to subscribe the user
  }
}
