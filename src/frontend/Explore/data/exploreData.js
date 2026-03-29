import { T } from "../utils/designTokens";

export const CATEGORIES = [
  { id:"web",    label:"Web Dev",              short:"Web",    icon:"💻", count:248, color:T.cats.web,    glow:"rgba(79,110,247,0.25)",  g:"linear-gradient(135deg,#0a1830,#0d1a48)", desc:"React, Vue, Node, TypeScript" },
  { id:"ai",     label:"AI & Machine Learning",short:"AI/ML",  icon:"🤖", count:186, color:T.cats.ai,     glow:"rgba(168,85,247,0.25)",   g:"linear-gradient(135deg,#120828,#1a0a38)", desc:"PyTorch, TensorFlow, LLMs" },
  { id:"cloud",  label:"Cloud & DevOps",       short:"Cloud",  icon:"☁️", count:134, color:T.cats.cloud,  glow:"rgba(56,189,248,0.25)",   g:"linear-gradient(135deg,#041824,#082028)", desc:"AWS, GCP, Kubernetes" },
  { id:"design", label:"UI/UX Design",         short:"Design", icon:"🎨", count:112, color:T.cats.design, glow:"rgba(244,114,182,0.25)",  g:"linear-gradient(135deg,#280c17,#200828)", desc:"Figma, Prototyping, Design Systems" },
  { id:"dsa",    label:"DSA & Algorithms",     short:"DSA",    icon:"🧮", count:98,  color:T.cats.dsa,    glow:"rgba(52,211,153,0.25)",   g:"linear-gradient(135deg,#041a14,#081e28)", desc:"LeetCode, Interview Prep" },
  { id:"data",   label:"Data Science",         short:"Data",   icon:"📊", count:143, color:T.cats.data,   glow:"rgba(251,191,36,0.25)",   g:"linear-gradient(135deg,#1a1000,#261800)", desc:"Python, Pandas, SQL, Tableau" },
  { id:"mobile", label:"Mobile Dev",           short:"Mobile", icon:"📱", count:89,  color:T.cats.mobile, glow:"rgba(96,165,250,0.25)",   g:"linear-gradient(135deg,#041824,#082028)", desc:"Flutter, React Native, Swift" },
  { id:"sec",    label:"Cybersecurity",        short:"Sec",    icon:"🔒", count:67,  color:T.cats.sec,    glow:"rgba(248,113,113,0.25)",  g:"linear-gradient(135deg,#1a0404,#200808)", desc:"Ethical Hacking, Pen Testing" },
];

export const PATHS = [
  {
    id:1, name:"Full Stack Engineer", icon:"🚀", dur:"6 months", n:12, lvl:"Intermediate",
    enr:28400, c:T.cats.web,
    desc:"Master React, Node.js, databases & cloud. Build and ship production-grade full stack apps.",
    tags:["React","Node.js","MongoDB","AWS","TypeScript"],
    steps:["HTML/CSS/JS","React","Node & Express","Databases","Auth & Security","Deploy & Cloud"],
  },
  {
    id:2, name:"AI / ML Engineer", icon:"🤖", dur:"8 months", n:16, lvl:"Advanced",
    enr:19200, c:T.cats.ai,
    desc:"Build ML systems, train neural networks and deploy LLMs at scale using Python.",
    tags:["Python","PyTorch","ML","LLMs","MLOps"],
    steps:["Python & Math","Classical ML","Deep Learning","NLP","Computer Vision","MLOps"],
  },
  {
    id:3, name:"UI/UX Designer", icon:"🎨", dur:"4 months", n:8, lvl:"Beginner",
    enr:14800, c:T.cats.design,
    desc:"From wireframes to polished interfaces. Build a portfolio that lands your first design job.",
    tags:["Figma","UX Research","Prototyping","Design Systems"],
    steps:["Design Thinking","UX Research","Visual Design","Figma","Prototyping","Portfolio"],
  },
  {
    id:4, name:"Cloud Architect", icon:"☁️", dur:"5 months", n:10, lvl:"Intermediate",
    enr:22100, c:T.cats.cloud,
    desc:"Design & deploy scalable AWS infrastructure. Prep for the Solutions Architect exam.",
    tags:["AWS","Terraform","Kubernetes","Networking"],
    steps:["AWS Fundamentals","Compute & Storage","Networking","Serverless","Containers","Capstone"],
  },
];

export const INSTRUCTORS = [
  { id:1, av:"PN", name:"Dr. Priya Nair",   role:"Ex-Google · ML",         students:84200, courses:8, r:4.9, c:T.cats.ai     },
  { id:2, av:"VI", name:"Vikram Iyer",       role:"Ex-Amazon · Cloud",      students:51000, courses:6, r:4.8, c:T.cats.cloud  },
  { id:3, av:"SK", name:"Sneha Kulkarni",    role:"Lead Designer · Swiggy", students:38400, courses:5, r:4.9, c:T.cats.design },
  { id:4, av:"AM", name:"Arjun Mehta",       role:"SDE III · Flipkart",     students:62100, courses:7, r:4.7, c:T.cats.web    },
  { id:5, av:"PR", name:"Pooja Reddy",       role:"Staff Eng · Microsoft",  students:46800, courses:4, r:4.9, c:T.cats.dsa    },
  { id:6, av:"AS", name:"Aditya Shah",       role:"DevOps Lead · Razorpay", students:29300, courses:5, r:4.8, c:T.cats.cloud  },
];

export const TRENDING_TOPICS = [
  { t:"Large Language Models", e:"🤖" },
  { t:"React 19",              e:"⚛️" },
  { t:"Kubernetes",            e:"☁️" },
  { t:"Generative AI",         e:"✨" },
  { t:"System Design",         e:"🏗️" },
  { t:"Rust",                  e:"🦀" },
  { t:"MLOps",                 e:"⚙️" },
  { t:"Vector Databases",      e:"🗄️" },
];
