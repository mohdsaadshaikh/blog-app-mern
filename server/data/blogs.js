import mongoose from "mongoose";
import { Blog } from "../src/models/blog.model.js";
const { ObjectId } = mongoose.Types;

// Example Dummy Data
const dummyBlogs = [
  {
    _id: new ObjectId(),
    title: "Understanding Artificial Intelligence and Its Future",
    content:
      "Artificial Intelligence (AI) is rapidly evolving, with applications spanning across various industries...",
    slug: "understanding-artificial-intelligence",
    coverImage: {
      public_id: "ai_cover_img_123",
      url: "https://example.com/images/ai_cover_img_123.jpg",
    },
    images: [
      {
        public_id: "ai_img_1",
        url: "https://example.com/images/ai_img_1.jpg",
      },
      {
        public_id: "ai_img_2",
        url: "https://example.com/images/ai_img_2.jpg",
      },
    ],
    likes: [new ObjectId(), new ObjectId()], // Correct ObjectIds
    dislikes: [], // No dislikes
    views: 100,
    viewedBy: ["user1@example.com", "user2@example.com"],
    publishedAt: new Date("2023-08-24"),
    tags: ["Artificial Intelligence", "Data Science", "Machine Learning"],
    author: new ObjectId(), // Correct ObjectId
  },
  {
    _id: new ObjectId(),
    title: "The Rise of Blockchain Technology",
    content:
      "Blockchain technology has revolutionized the way we think about digital transactions and data security...",
    slug: "the-rise-of-blockchain-technology",
    coverImage: {
      public_id: "blockchain_cover_img_123",
      url: "https://example.com/images/blockchain_cover_img_123.jpg",
    },
    images: [
      {
        public_id: "blockchain_img_1",
        url: "https://example.com/images/blockchain_img_1.jpg",
      },
    ],
    likes: [new ObjectId()], // Correct ObjectIds
    dislikes: [new ObjectId()], // Correct ObjectIds
    views: 75,
    viewedBy: ["user3@example.com"],
    publishedAt: new Date("2023-09-10"),
    tags: ["Blockchain", "Cybersecurity", "Data Science"],
    author: new ObjectId(), // Correct ObjectId
  },
  {
    _id: new ObjectId(),
    title: "Getting Started with Web Development",
    content:
      "Web development is a crucial skill in today's technology-driven world. This article covers the basics...",
    slug: "getting-started-with-web-development",
    coverImage: {
      public_id: "webdev_cover_img_123",
      url: "https://example.com/images/webdev_cover_img_123.jpg",
    },
    images: [],
    likes: [new ObjectId(), new ObjectId(), new ObjectId()], // Correct ObjectIds
    dislikes: [], // No dislikes
    views: 250,
    viewedBy: ["user4@example.com", "user5@example.com", "user6@example.com"],
    publishedAt: new Date("2023-07-15"),
    tags: ["Web Development", "JavaScript", "HTML/CSS"],
    author: new ObjectId(), // Correct ObjectId
  },
  {
    _id: new ObjectId(),
    title: "Introduction to Machine Learning",
    content:
      "Machine learning is a subfield of artificial intelligence (AI) that focuses on developing algorithms...",
    slug: "introduction-to-machine-learning",
    coverImage: {
      public_id: "ml_cover_img_123",
      url: "https://example.com/images/ml_cover_img_123.jpg",
    },
    images: [
      {
        public_id: "ml_img_1",
        url: "https://example.com/images/ml_img_1.jpg",
      },
      {
        public_id: "ml_img_2",
        url: "https://example.com/images/ml_img_2.jpg",
      },
    ],
    likes: [], // No likes yet
    dislikes: [new ObjectId()], // Correct ObjectIds
    views: 30,
    viewedBy: ["user7@example.com"],
    publishedAt: new Date("2023-10-05"),
    tags: ["Machine Learning", "Artificial Intelligence", "Data Science"],
    author: new ObjectId(), // Correct ObjectId
  },
];

const createDummyBlogs = async () => {
  try {
    mongoose.connect(
      "mongodb+srv://SaadShaikh:mohd12Saad@cluster0.dp83awe.mongodb.net/blogApi"
    );

    await Blog.deleteMany(); // Optionally clear the collection before adding dummy data
    await Blog.insertMany(dummyBlogs);

    console.log("Dummy blogs inserted successfully!");
  } catch (error) {
    console.error("Error inserting dummy blogs:", error);
  } finally {
    await mongoose.disconnect();
  }
};

createDummyBlogs();
