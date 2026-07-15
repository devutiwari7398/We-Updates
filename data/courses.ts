export type Course = {
  slug: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  students: number;
  type: 'PDF' | 'Video';
  image: string;
  lessons: number;
  duration: string;
  outcomes: string[];
};

export const categories = ['All', 'Programming', 'Flutter', 'Web Development', 'AI', 'Python', 'JavaScript', 'Data Science', 'Career Skills'];

export const courses: Course[] = [
  { slug:'flutter-notes', title:'Flutter Notes: Build Beautiful Apps', description:'A focused PDF playbook for building fast, polished Flutter applications.', instructor:'Aarav Mehta', category:'Flutter', price:19, originalPrice:29, rating:4.9, students:1240, type:'PDF', image:'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=900&q=80', lessons:14, duration:'82 pages', outcomes:['Understand Flutter widgets deeply','Build responsive app screens','Organize production-ready projects'] },
  { slug:'react-pdf-masterclass', title:'React PDF Masterclass', description:'The practical PDF reference for modern React patterns and architecture.', instructor:'Maya Singh', category:'Web Development', price:24, originalPrice:39, rating:4.8, students:980, type:'PDF', image:'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=900&q=80', lessons:18, duration:'110 pages', outcomes:['Master hooks and composition','Write accessible components','Design maintainable frontends'] },
  { slug:'javascript-handbook', title:'JavaScript Handbook', description:'Your clear guide to the modern JavaScript language and browser APIs.', instructor:'Lucas Martin', category:'JavaScript', price:18, originalPrice:28, rating:4.7, students:2110, type:'PDF', image:'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=900&q=80', lessons:20, duration:'96 pages', outcomes:['Use modern JavaScript confidently','Understand async workflows','Write cleaner JavaScript'] },
  { slug:'python-notes', title:'Python Notes for Problem Solvers', description:'A concise, well-structured guide to Python fundamentals and beyond.', instructor:'Priya Kapoor', category:'Python', price:17, originalPrice:27, rating:4.9, students:1740, type:'PDF', image:'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=900&q=80', lessons:16, duration:'88 pages', outcomes:['Think in Pythonic patterns','Solve real-world problems','Use core data structures'] },
  { slug:'git-guide', title:'Git Guide for Teams', description:'A friendly PDF guide to Git workflows, pull requests, and safe collaboration.', instructor:'Noah Williams', category:'Programming', price:14, originalPrice:22, rating:4.8, students:860, type:'PDF', image:'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=900&q=80', lessons:12, duration:'64 pages', outcomes:['Work with branches safely','Resolve merge conflicts','Ship with confidence'] },
  { slug:'system-design-pdf', title:'System Design Interview PDF', description:'A visual framework for designing reliable, scalable web systems.', instructor:'Ethan Chen', category:'Programming', price:29, originalPrice:45, rating:4.9, students:1560, type:'PDF', image:'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80', lessons:15, duration:'132 pages', outcomes:['Break down complex systems','Know essential tradeoffs','Prepare for interviews'] },
  { slug:'flutter-bootcamp', title:'Flutter Bootcamp: From Zero to App', description:'Build and publish delightful cross-platform mobile experiences.', instructor:'Aarav Mehta', category:'Flutter', price:49, originalPrice:79, rating:4.9, students:3200, type:'Video', image:'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=900&q=80', lessons:42, duration:'12h 30m', outcomes:['Build iOS and Android apps','Connect to REST APIs','Publish your first app'] },
  { slug:'react-complete-course', title:'React Complete Course', description:'A project-led path from component basics to full, production-ready apps.', instructor:'Maya Singh', category:'Web Development', price:59, originalPrice:99, rating:4.9, students:4890, type:'Video', image:'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=900&q=80', lessons:58, duration:'18h 20m', outcomes:['Build with React and Next.js','Manage application state','Deploy production applications'] },
  { slug:'python-beginners', title:'Python for Beginners', description:'Start coding with a calm, practical program built around small wins.', instructor:'Priya Kapoor', category:'Python', price:39, originalPrice:69, rating:4.8, students:5100, type:'Video', image:'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80', lessons:36, duration:'10h 45m', outcomes:['Code your first programs','Automate everyday tasks','Create portfolio projects'] },
  { slug:'ai-fundamentals', title:'AI Fundamentals', description:'Understand the ideas, tools, and workflows shaping the AI-powered world.', instructor:'Zara Ahmed', category:'AI', price:45, originalPrice:75, rating:4.8, students:2700, type:'Video', image:'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80', lessons:30, duration:'8h 10m', outcomes:['Understand machine learning','Use AI tools responsibly','Plan AI-powered products'] },
  { slug:'node-masterclass', title:'Node.js Masterclass', description:'Build robust APIs, real-time services, and a backend you can trust.', instructor:'Ethan Chen', category:'Web Development', price:55, originalPrice:89, rating:4.7, students:1900, type:'Video', image:'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80', lessons:47, duration:'15h 20m', outcomes:['Build RESTful APIs','Work with databases','Secure Node.js services'] },
  { slug:'career-accelerator', title:'Career Accelerator', description:'Create a career story, portfolio, and job search strategy that stands out.', instructor:'Sofia Reyes', category:'Career Skills', price:35, originalPrice:59, rating:4.9, students:1400, type:'Video', image:'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80', lessons:24, duration:'6h 40m', outcomes:['Build a standout portfolio','Interview with clarity','Make a 90-day career plan'] }
];

export const getCourse = (slug: string) => courses.find((course) => course.slug === slug);
