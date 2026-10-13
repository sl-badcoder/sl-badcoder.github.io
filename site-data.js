const siteData = {
  me: [
    {
      id: "senad",
      name: "Senad-Leandro Lemes Galera",
      location: "Munich, Germany",
      role: "Software engineer and computer science master's student",
      languages: "C/C++, C#, Java, Python, SQL, JavaScript, TypeScript, Scala, Rust",
      summary: "I work on software systems and study computer science at TUM.",
      detail: "I am interested in GPU memory, databases, 3D reconstruction, analytic number theory, and sport."
    }
  ],
  projects: [
    {
      id: "uvm",
      title: "Stabilizing UVM Performance",
      category: "research",
      year: "2026",
      summary: "Memory placement for GPU workloads that exceed device memory.",
      detail: "Keeps frequently used data on the GPU and moves less-used data to CPU memory.",
      outcome: "The evaluation reported up to 10.6× speedup over standard UVM across the tested GPU architectures and workloads.",
      tools: "C++, CUDA, NVIDIA UVM",
      languages: "C++",
      link: "https://arxiv.org/abs/2610.13408"
    },
    {
      id: "shapedream",
      title: "ShapeDream",
      category: "research",
      year: "2025/2026",
      summary: "Completing 3D shapes from partial point clouds.",
      detail: "Uses AI to generate views of a complete object, then combines them into a 3D model.",
      outcome: "It outperformed ShapeFormer across the evaluated object categories while using less task-specific training data.",
      tools: "Python, PyTorch, diffusion, PointNet++, LoRA",
      languages: "Python",
      link: "https://github.com/Benedicit/ShapeDream"
    },
    {
      id: "bitonic-sort",
      title: "Hybrid Bitonic Sort",
      category: "systems",
      year: "2025",
      summary: "Exploring sorting across CPU and GPU hardware.",
      detail: "Splits sorting work between CPU and GPU, accounting for the cost of moving data.",
      outcome: "The main focus was understanding how to divide parallel sorting work between CPU and GPU.",
      tools: "C++, CUDA, parallel computing",
      languages: "C++",
      link: ""
    }
  ],
  experience: [
    {
      id: "lautersee",
      role: "Software Engineer",
      organization: "Lautersee GmbH",
      period: "Apr 2026 – Present",
      summary: "Full-stack .NET applications, automated testing, and CI.",
      detail: "I develop C#/.NET applications for data archiving and VAT-related processes. I built a testing environment from scratch, introduced automated tests, and created Azure DevOps pipelines.",
      outcome: "Test coverage increased from approximately 15% to 64%.",
      tools: "C#, .NET, Azure DevOps, CI/CD"
    },
    {
      id: "tum-management",
      role: "Schülerpate",
      organization: "Grundschule an der Schwanthalerstraße",
      period: "Jan 2024 – Present",
      summary: "Voluntary one-on-one tutoring pupils every week.",
      detail: "",
      outcome: "",
      tools: "Teaching"
    },
    {
      id: "tum-management",
      role: "Student Assistant",
      organization: "Technical University of Munich",
      period: "Jun 2024 – Dec 2024",
      summary: "Credit transfers and internal documentation.",
      detail: "I evaluated credit transfer applications against faculty standards and restructured the internal wiki to improve knowledge transfer.",
      outcome: "",
      tools: "Academic administration, documentation"
    },
    {
      id: "plcm",
      role: "Undergraduate Research Assistant",
      organization: "PLCM, TU Darmstadt",
      period: "Oct 2023 – Jan 2024",
      summary: "MES gamification research, documentation, and a chatbot.",
      detail: "I reviewed research on gamification in Manufacturing Execution Systems, modeled the software, summarized findings, designed and implemented a chatbot, and supported students during internships.",
      outcome: "",
      tools: "Research, software modeling, chatbot"
    },
    {
      id: "software-ag",
      role: "Software Engineer",
      organization: "Software AG",
      period: "May 2020 – May 2022",
      summary: "Test environments, automated reports, and backend migration.",
      detail: "I maintained and expanded testing environments for web and desktop applications, developed an automated test-reporting tool, and contributed to the backend of the NaturalONE desktop-to-web migration.",
      outcome: "",
      tools: "Java, testing, backend development"
    }
  ],
  education: [
    {
      id: "tum-msc",
      degree: "M.Sc.",
      subject: "Computer Science",
      institution: "Technical University of Munich",
      period: "Apr 2024 – Present",
      summary: "Member of TUMuchData; 2nd place at Estimathon and 6th place at HackaTUM."
    },
    {
      id: "tud-bsc",
      degree: "B.Sc.",
      subject: "Computer Science",
      institution: "TU Darmstadt",
      period: "Oct 2020 – Mar 2024",
      summary: "GPA: 1.7. Thesis: Evaluation of NVMe-oF for disaggregated storage (grade: 1.3)."
    }
  ],
  teaching: [
    {
      id: "rechnerorganisation",
      course: "Rechnerorganisation",
      institution: "TU Darmstadt",
      period: "Apr 2023 - Oct 2023",
      summary: "Computer organization tutorials and exam work.",
      detail: "I tutored exercise groups, answered technical questions, created exam questions, and graded submissions."
    },
    {
      id: "digitaltechnik",
      course: "Digitaltechnik",
      institution: "TU Darmstadt",
      period: "Oct 2022 – April 2023",
      summary: "Weekly exercises and exam assessment.",
      detail: "I led weekly exercise sessions, explained lecture concepts in more depth, assessed exam eligibility, and graded exams."
    },
    {
      id: "digitaltechnik",
      course: "Digitaltechnik",
      institution: "TU Darmstadt",
      period: "Oct 2021 – April 2022",
      summary: "Weekly exercises and exam assessment.",
      detail: "I led weekly exercise sessions, explained lecture concepts in more depth, assessed exam eligibility, and graded exams."
    }
  ],
  writing: [
    {
      id: "cxl",
      title: "CXL",
      topic: "memory systems",
      language: "English",
      summary: "Notes on Compute Express Link and data-center memory.",
      detail: "A closer look at Compute Express Link and its role in modern memory systems.",
      link: "blog_pages/cxl.html"
    },
    {
      id: "doctor",
      title: "Lohnt sich ein Doktor?",
      topic: "career",
      language: "German",
      summary: "A reflection on doctoral degrees and career value.",
      detail: "A German-language article about whether pursuing a doctorate is worthwhile.",
      link: "blog_pages/doctoreworthit.html"
    },
    {
      id: "dictionary",
      title: "CS Dictionary",
      topic: "reference",
      language: "English",
      summary: "A searchable collection of computer science terms.",
      detail: "A growing collection of terms and explanations from computer science.",
      link: "blog_pages/dictionary.html"
    }
  ],
  about: [
    {
      id: "bio",
      topic: "bio",
      summary: "Software engineer and computer science master's student at TUM.",
      detail: "I'm Senad-Leandro Lemes Galera, based in Munich. I study computer science at the Technical University of Munich and work as a software engineer. I am interested in systems, GPU memory, databases, and 3D reconstruction."
    },
    {
      id: "interests",
      topic: "interests",
      summary: "Databases, analytic number theory, football, basketball, and tennis.",
      detail: "Outside engineering, I like mathematics, especially analytic number theory, and follow football, basketball, and tennis."
    },
    {
      id: "community",
      topic: "community",
      summary: "Volunteer tutoring in Munich.",
      detail: "Since January 2025 I have volunteered as a tutor at Grundschule Schwanthalerstraße in Munich, supporting pupils with schoolwork and activities."
    }
  ],
  reading: [
    {
      id: "hamming",
      title: "The Art of Doing Science and Engineering",
      author: "Richard W. Hamming",
      status: "reading",
      progress: "35%",
      summary: "A book about how important scientific and engineering work gets done."
    },
    {
      id: "ddia",
      title: "Designing Data-Intensive Applications",
      author: "Martin Kleppmann",
      status: "reading",
      progress: "10%",
      summary: "A book about the ideas and tradeoffs behind reliable data systems."
    },
    {
      id: "paranoid",
      title: "Only the Paranoid Survive",
      author: "Andrew S. Grove",
      status: "finished",
      progress: "100%",
      summary: "A book about strategic inflection points and organizational change."
    },
    {
      id: "habits",
      title: "The 7 Habits of Highly Effective People",
      author: "Stephen R. Covey",
      status: "finished",
      progress: "100%",
      summary: "A book about personal effectiveness and habits."
    }
  ],
  videos: [
    {
      id: "stonebraker",
      title: "Stonebraker Turing Award",
      topic: "databases",
      summary: "Legendary turing award speech, by the legend himself.",
      detail: "Legendary turing award speech, by the legend himself.",
      link: "https://www.youtube.com/watch?v=BbGeKi6T6QI"
    },
    {
      id: "federer",
      title: "Federer Speech",
      topic: "sport",
      summary: "Very inspiring speech on how to perform under high pressure and what good working habits look like.",
      detail: "Very inspiring speech on how to perform under high pressure and what good working habits look like.",
      link: "https://www.youtube.com/watch?v=pqWUuYTcG-o"
    },
    {
      id: "bad-career",
      title: "How to Have a Bad Career",
      topic: "career",
      summary: "Just watch - speaks for itself.",
      detail: "Just watch - speaks for itself.",
      link: "https://www.youtube.com/watch?v=Rn1w4MRHIhc"
    }
  ]
};

for (const table of ["projects", "experience", "education", "teaching", "writing", "about", "reading", "videos"]) {
  siteData[table].forEach(row => { row.person_id = "senad"; });
}

if (typeof window !== "undefined") window.siteData = siteData;
if (typeof module !== "undefined") module.exports = siteData;
