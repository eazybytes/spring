// Comprehensive mock data generator for the job portal

// Job titles by category
const jobTitles = {
  Technology: [
    "Senior Frontend Developer",
    "Backend Engineer",
    "Full Stack Developer",
    "DevOps Engineer",
    "Data Scientist",
    "Machine Learning Engineer",
    "Software Architect",
    "Cloud Engineer",
    "Mobile Developer",
    "QA Engineer",
    "Site Reliability Engineer",
    "Cybersecurity Specialist",
    "Product Manager",
    "Technical Lead",
    "Database Administrator",
    "System Administrator",
    "AI Engineer",
    "Blockchain Developer",
    "Game Developer",
    "Embedded Systems Engineer",
  ],
  Design: [
    "UX/UI Designer",
    "Product Designer",
    "Graphic Designer",
    "Web Designer",
    "Motion Graphics Designer",
    "Brand Designer",
    "Creative Director",
    "Design System Lead",
    "User Researcher",
    "Visual Designer",
    "Interaction Designer",
    "Art Director",
    "Illustrator",
    "3D Designer",
    "Game Designer",
    "Design Operations Manager",
  ],
  Marketing: [
    "Digital Marketing Manager",
    "Content Marketing Specialist",
    "SEO Specialist",
    "PPC Manager",
    "Social Media Manager",
    "Brand Manager",
    "Marketing Director",
    "Growth Hacker",
    "Email Marketing Specialist",
    "Marketing Analyst",
    "Product Marketing Manager",
    "PR Manager",
    "Affiliate Marketing Manager",
    "Marketing Automation Specialist",
    "Influencer Marketing Manager",
  ],
  Sales: [
    "Sales Representative",
    "Account Executive",
    "Sales Manager",
    "Business Development Manager",
    "Inside Sales Representative",
    "Sales Director",
    "Key Account Manager",
    "Sales Engineer",
    "Customer Success Manager",
    "Sales Operations Manager",
    "Regional Sales Manager",
    "Enterprise Sales",
  ],
  Finance: [
    "Financial Analyst",
    "Accountant",
    "Finance Manager",
    "Investment Analyst",
    "Risk Manager",
    "Treasury Analyst",
    "Corporate Finance Manager",
    "Tax Specialist",
    "Audit Manager",
    "Financial Controller",
    "CFO",
    "Compliance Officer",
  ],
  Healthcare: [
    "Registered Nurse",
    "Medical Assistant",
    "Healthcare Administrator",
    "Physical Therapist",
    "Physician",
    "Healthcare Data Analyst",
    "Medical Technician",
    "Pharmacist",
    "Mental Health Counselor",
    "Healthcare IT Specialist",
    "Medical Researcher",
    "Radiologic Technologist",
  ],
  Education: [
    "Software Engineer",
    "Teacher",
    "Professor",
    "Curriculum Designer",
    "Educational Technologist",
    "Academic Advisor",
    "School Administrator",
    "Instructional Designer",
    "Research Scientist",
    "Education Consultant",
    "Learning and Development Specialist",
    "Training Manager",
  ],
  Operations: [
    "Operations Manager",
    "Supply Chain Manager",
    "Logistics Coordinator",
    "Operations Analyst",
    "Process Improvement Specialist",
    "Warehouse Manager",
    "Production Manager",
    "Quality Assurance Manager",
    "Procurement Manager",
    "Operations Director",
    "Facilities Manager",
    "Inventory Manager",
  ],
};

// Company data with more variety
const companies = [
  {
    name: "TechCorp Inc.",
    logo: "/logos/techcorp.png",
    industry: "Technology",
    size: "Large",
    rating: 4.5,
    locations: ["San Francisco", "New York", "Austin"],
    founded: 2010,
  },
  {
    name: "Google",
    logo: "/logos/google.png",
    industry: "Technology",
    size: "Large",
    rating: 4.4,
    locations: ["Mountain View", "New York", "Seattle"],
    founded: 1998,
  },
  {
    name: "Microsoft",
    logo: "/logos/microsoft.png",
    industry: "Technology",
    size: "Large",
    rating: 4.4,
    locations: ["Redmond", "San Francisco", "Austin"],
    founded: 1975,
  },
  {
    name: "Apple",
    logo: "/logos/apple.png",
    industry: "Technology",
    size: "Large",
    rating: 4.6,
    locations: ["Cupertino", "Austin", "Boston"],
    founded: 1976,
  },
  {
    name: "Amazon",
    logo: "/logos/amazon.png",
    industry: "E-commerce",
    size: "Large",
    rating: 4.2,
    locations: ["Seattle", "New York", "Austin"],
    founded: 1994,
  },
  {
    name: "Tesla",
    logo: "/logos/tesla.png",
    industry: "Automotive",
    size: "Large",
    rating: 4.3,
    locations: ["Palo Alto", "Austin", "Berlin"],
    founded: 2003,
  },
  {
    name: "Netflix",
    logo: "/logos/netflix.png",
    industry: "Entertainment",
    size: "Large",
    rating: 4.7,
    locations: ["Los Gatos", "Los Angeles", "New York"],
    founded: 1997,
  },
  {
    name: "Meta",
    logo: "/logos/meta.png",
    industry: "Technology",
    size: "Large",
    rating: 4.1,
    locations: ["Menlo Park", "Austin", "London"],
    founded: 2004,
  },
  {
    name: "Spotify",
    logo: "/logos/spotify.png",
    industry: "Music",
    size: "Medium",
    rating: 4.5,
    locations: ["Stockholm", "New York", "Los Angeles"],
    founded: 2006,
  },
  {
    name: "Airbnb",
    logo: "/logos/airbnb.png",
    industry: "Travel",
    size: "Medium",
    rating: 4.4,
    locations: ["San Francisco", "Portland", "Dublin"],
    founded: 2008,
  },
  {
    name: "Uber",
    logo: "/logos/uber.png",
    industry: "Transportation",
    size: "Large",
    rating: 4.0,
    locations: ["San Francisco", "New York", "Amsterdam"],
    founded: 2009,
  },
  {
    name: "Slack",
    logo: "/logos/slack.png",
    industry: "Technology",
    size: "Medium",
    rating: 4.6,
    locations: ["San Francisco", "New York", "Toronto"],
    founded: 2009,
  },
  {
    name: "Zoom",
    logo: "/logos/zoom.svg",
    industry: "Technology",
    size: "Medium",
    rating: 4.5,
    locations: ["San Jose", "Austin", "Singapore"],
    founded: 2011,
  },
  {
    name: "Shopify",
    logo: "/logos/shopify.png",
    industry: "E-commerce",
    size: "Medium",
    rating: 4.3,
    locations: ["Ottawa", "Toronto", "San Francisco"],
    founded: 2006,
  },
  {
    name: "Square",
    logo: "/logos/square.png",
    industry: "Fintech",
    size: "Medium",
    rating: 4.2,
    locations: ["San Francisco", "Atlanta", "New York"],
    founded: 2009,
  },
  {
    name: "Stripe",
    logo: "/logos/stripe.png",
    industry: "Fintech",
    size: "Medium",
    rating: 4.7,
    locations: ["San Francisco", "New York", "London"],
    founded: 2010,
  },
  {
    name: "Coinbase",
    logo: "/logos/coinbase.png",
    industry: "Cryptocurrency",
    size: "Medium",
    rating: 4.1,
    locations: ["San Francisco", "New York", "London"],
    founded: 2012,
  },
  {
    name: "Twilio",
    logo: "/logos/twilio.png",
    industry: "Technology",
    size: "Medium",
    rating: 4.3,
    locations: ["San Francisco", "Denver", "London"],
    founded: 2008,
  },
  {
    name: "GitHub",
    logo: "/logos/github.png",
    industry: "Technology",
    size: "Medium",
    rating: 4.5,
    locations: ["San Francisco", "Boston", "Tokyo"],
    founded: 2008,
  },
  {
    name: "Adobe",
    logo: "/logos/adobe.svg",
    industry: "Technology",
    size: "Large",
    rating: 4.4,
    locations: ["San Jose", "Seattle", "New York"],
    founded: 1982,
  },
  {
    name: "Salesforce",
    logo: "/logos/salesforce.png",
    industry: "Technology",
    size: "Large",
    rating: 4.3,
    locations: ["San Francisco", "Indianapolis", "London"],
    founded: 1999,
  },
  {
    name: "Oracle",
    logo: "/logos/oracle.png",
    industry: "Technology",
    size: "Large",
    rating: 4.0,
    locations: ["Austin", "Redwood City", "Bangalore"],
    founded: 1977,
  },
  {
    name: "IBM",
    logo: "/logos/ibm.svg",
    industry: "Technology",
    size: "Large",
    rating: 4.1,
    locations: ["Armonk", "Austin", "Bangalore"],
    founded: 1911,
  },
  {
    name: "Intel",
    logo: "/logos/intel.png",
    industry: "Technology",
    size: "Large",
    rating: 4.2,
    locations: ["Santa Clara", "Portland", "Bangalore"],
    founded: 1968,
  },
  {
    name: "NVIDIA",
    logo: "/logos/nvidia.png",
    industry: "Technology",
    size: "Large",
    rating: 4.6,
    locations: ["Santa Clara", "Austin", "Tel Aviv"],
    founded: 1993,
  },
  {
    name: "Palantir",
    logo: "/logos/palantir.png",
    industry: "Technology",
    size: "Medium",
    rating: 4.2,
    locations: ["Palo Alto", "Denver", "London"],
    founded: 2003,
  },
  {
    name: "Snowflake",
    logo: "/logos/snowflake.png",
    industry: "Technology",
    size: "Medium",
    rating: 4.4,
    locations: ["Bozeman", "San Mateo", "Bellevue"],
    founded: 2012,
  },
  {
    name: "Databricks",
    logo: "/logos/databricks.png",
    industry: "Technology",
    size: "Medium",
    rating: 4.5,
    locations: ["San Francisco", "Amsterdam", "Singapore"],
    founded: 2013,
  },
  {
    name: "Canva",
    logo: "/logos/canva.png",
    industry: "Technology",
    size: "Medium",
    rating: 4.6,
    locations: ["Sydney", "San Francisco", "London"],
    founded: 2012,
  },
  {
    name: "Figma",
    logo: "/logos/figma.png",
    industry: "Technology",
    size: "Medium",
    rating: 4.7,
    locations: ["San Francisco", "New York", "London"],
    founded: 2012,
  },
];

// Cities for job locations
const cities = [
  "San Francisco, CA",
  "New York, NY",
  "Seattle, WA",
  "Austin, TX",
  "Boston, MA",
  "Los Angeles, CA",
  "Chicago, IL",
  "Denver, CO",
  "Portland, OR",
  "Atlanta, GA",
  "Miami, FL",
  "Dallas, TX",
  "Phoenix, AZ",
  "San Diego, CA",
  "Philadelphia, PA",
  "Houston, TX",
  "Detroit, MI",
  "Minneapolis, MN",
  "Nashville, TN",
  "Raleigh, NC",
  "Salt Lake City, UT",
  "Orlando, FL",
  "Tampa, FL",
  "Charlotte, NC",
  "Kansas City, MO",
  "London, UK",
  "Berlin, Germany",
  "Paris, France",
  "Amsterdam, Netherlands",
  "Stockholm, Sweden",
  "Toronto, Canada",
  "Vancouver, Canada",
  "Sydney, Australia",
  "Tokyo, Japan",
  "Singapore",
  "Bangalore, India",
  "Tel Aviv, Israel",
  "Dublin, Ireland",
  "Barcelona, Spain",
  "Zurich, Switzerland",
];

// Job types and work arrangements
const jobTypes = ["Full-time", "Part-time", "Contract", "Freelance"];
const workTypes = ["On-site", "Remote", "Hybrid"];
const experienceLevels = [
  "Entry Level",
  "Mid Level",
  "Senior Level",
  "Executive Level",
];

// Salary ranges by category and level
const salaryRanges = {
  Technology: {
    "Entry Level": { min: 70, max: 120 },
    "Mid Level": { min: 100, max: 180 },
    "Senior Level": { min: 150, max: 250 },
    "Executive Level": { min: 200, max: 400 },
  },
  Design: {
    "Entry Level": { min: 50, max: 90 },
    "Mid Level": { min: 80, max: 140 },
    "Senior Level": { min: 120, max: 200 },
    "Executive Level": { min: 180, max: 300 },
  },
  Marketing: {
    "Entry Level": { min: 45, max: 75 },
    "Mid Level": { min: 70, max: 120 },
    "Senior Level": { min: 100, max: 180 },
    "Executive Level": { min: 150, max: 280 },
  },
  Sales: {
    "Entry Level": { min: 40, max: 70 },
    "Mid Level": { min: 60, max: 110 },
    "Senior Level": { min: 90, max: 160 },
    "Executive Level": { min: 140, max: 250 },
  },
  Finance: {
    "Entry Level": { min: 55, max: 85 },
    "Mid Level": { min: 80, max: 130 },
    "Senior Level": { min: 120, max: 200 },
    "Executive Level": { min: 180, max: 350 },
  },
  Healthcare: {
    "Entry Level": { min: 50, max: 80 },
    "Mid Level": { min: 70, max: 120 },
    "Senior Level": { min: 100, max: 180 },
    "Executive Level": { min: 150, max: 280 },
  },
  Education: {
    "Entry Level": { min: 35, max: 60 },
    "Mid Level": { min: 50, max: 90 },
    "Senior Level": { min: 70, max: 130 },
    "Executive Level": { min: 100, max: 200 },
  },
  Operations: {
    "Entry Level": { min: 45, max: 75 },
    "Mid Level": { min: 65, max: 110 },
    "Senior Level": { min: 90, max: 150 },
    "Executive Level": { min: 130, max: 220 },
  },
};

// Skills by category
const skillsByCategory = {
  Technology: [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "AWS",
    "Docker",
    "Kubernetes",
    "TypeScript",
    "Java",
    "C++",
    "Go",
    "Rust",
    "SQL",
    "MongoDB",
    "PostgreSQL",
    "Redis",
    "GraphQL",
    "REST APIs",
    "Machine Learning",
    "TensorFlow",
    "PyTorch",
    "Git",
    "CI/CD",
    "Terraform",
    "Jenkins",
  ],
  Design: [
    "Figma",
    "Sketch",
    "Adobe XD",
    "Photoshop",
    "Illustrator",
    "After Effects",
    "Principle",
    "InVision",
    "Zeplin",
    "Framer",
    "Adobe Creative Suite",
    "UI/UX Design",
    "Prototyping",
    "User Research",
    "Wireframing",
    "Design Systems",
    "Accessibility",
    "Motion Design",
    "Brand Design",
  ],
  Marketing: [
    "Google Analytics",
    "SEO",
    "SEM",
    "Social Media Marketing",
    "Content Marketing",
    "Email Marketing",
    "HubSpot",
    "Salesforce",
    "Facebook Ads",
    "Google Ads",
    "LinkedIn Marketing",
    "Mailchimp",
    "Hootsuite",
    "Buffer",
    "Canva",
    "WordPress",
    "Conversion Optimization",
    "A/B Testing",
  ],
  Sales: [
    "Salesforce",
    "HubSpot",
    "Pipedrive",
    "Cold Calling",
    "Lead Generation",
    "Account Management",
    "CRM",
    "Sales Presentations",
    "Negotiation",
    "Customer Relationship Management",
    "B2B Sales",
    "B2C Sales",
    "Sales Analytics",
    "Territory Management",
  ],
  Finance: [
    "Excel",
    "Financial Analysis",
    "Financial Modeling",
    "QuickBooks",
    "SAP",
    "Accounting",
    "Tax Preparation",
    "Budgeting",
    "Forecasting",
    "Risk Analysis",
    "Investment Analysis",
    "Bloomberg Terminal",
    "GAAP",
    "Financial Reporting",
    "Audit",
  ],
  Healthcare: [
    "EMR/EHR",
    "Medical Terminology",
    "Patient Care",
    "Healthcare Administration",
    "HIPAA Compliance",
    "Medical Coding",
    "Clinical Research",
    "Pharmacy Management",
    "Healthcare Analytics",
    "Telemedicine",
    "Medical Device Knowledge",
  ],
  Education: [
    "Curriculum Development",
    "Learning Management Systems",
    "Educational Technology",
    "Student Assessment",
    "Classroom Management",
    "Online Teaching",
    "Educational Research",
    "Instructional Design",
    "Adobe Captivate",
    "Moodle",
    "Canvas",
  ],
  Operations: [
    "Project Management",
    "Process Improvement",
    "Supply Chain Management",
    "Inventory Management",
    "Lean Manufacturing",
    "Six Sigma",
    "Operations Research",
    "Logistics",
    "Quality Assurance",
    "Vendor Management",
    "Cost Analysis",
  ],
};

// Benefits array
const benefits = [
  "Health Insurance",
  "Dental Insurance",
  "Vision Insurance",
  "401(k)",
  "Paid Time Off",
  "Remote Work",
  "Flexible Schedule",
  "Professional Development",
  "Gym Membership",
  "Free Meals",
  "Stock Options",
  "Bonus Opportunities",
  "Parental Leave",
  "Mental Health Support",
  "Education Assistance",
  "Transportation Benefits",
  "Life Insurance",
  "Disability Insurance",
  "Employee Discounts",
  "Wellness Programs",
  "Conference Attendance",
  "Home Office Stipend",
];

// Job descriptions templates
const jobDescriptionTemplates = {
  Technology: [
    "We are looking for a skilled {title} to join our dynamic team. You will be responsible for developing high-quality software solutions, collaborating with cross-functional teams, and contributing to our technical architecture decisions.",
    "Join our innovative team as a {title}! You'll work on cutting-edge projects, implement best practices, and help scale our technology infrastructure to support millions of users worldwide.",
    "We're seeking a passionate {title} to help build the future of our platform. You'll work with modern technologies, participate in code reviews, and mentor junior developers.",
  ],
  Design: [
    "We are seeking a creative {title} to join our design team. You will be responsible for creating intuitive user experiences, collaborating with product managers and engineers, and maintaining our design system.",
    "Join our design team as a {title}! You'll work on user-centered design solutions, conduct user research, and create beautiful interfaces that delight our customers.",
    "We're looking for a talented {title} to help shape the visual identity of our products. You'll work closely with stakeholders to understand requirements and translate them into compelling designs.",
  ],
  Marketing: [
    "We are looking for a results-driven {title} to join our marketing team. You will be responsible for developing and executing marketing campaigns, analyzing performance metrics, and driving customer acquisition.",
    "Join our marketing team as a {title}! You'll work on brand strategy, content creation, and digital marketing initiatives to increase our market presence and engage with our target audience.",
    "We're seeking an experienced {title} to help grow our business. You'll manage marketing channels, optimize conversion rates, and collaborate with sales teams to generate qualified leads.",
  ],
};

// Random utility functions
const getRandomItem = (array) =>
  array[Math.floor(Math.random() * array.length)];
const getRandomItems = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomSalary = (category, level) => {
  const range = salaryRanges[category][level];
  const min = range.min + getRandomNumber(-10, 10);
  const max = range.max + getRandomNumber(-10, 10);
  return { min: Math.max(min * 1000, 30000), max: max * 1000 };
};

// Generate comprehensive job data
export const generateJobs = (count = 1000) => {
  const jobs = [];

  for (let i = 1; i <= count; i++) {
    const category = getRandomItem(Object.keys(jobTitles));
    const title = getRandomItem(jobTitles[category]);
    const company = getRandomItem(companies);
    const level = getRandomItem(experienceLevels);
    const salary = getRandomSalary(category, level);
    const workType = getRandomItem(workTypes);
    const isRemote =
      workType === "Remote" || (workType === "Hybrid" && Math.random() > 0.5);

    const job = {
      id: i,
      title,
      company: company.name,
      companyLogo: company.logo,
      location: isRemote ? "Remote" : getRandomItem(cities),
      workType,
      jobType: getRandomItem(jobTypes),
      category,
      experienceLevel: level,
      salary: {
        min: salary.min,
        max: salary.max,
        currency: "USD",
        period: "year",
      },
      description: getRandomItem(
        jobDescriptionTemplates[category] || jobDescriptionTemplates.Technology
      ).replace("{title}", title),
      requirements: getRandomItems(
        skillsByCategory[category] || skillsByCategory.Technology,
        getRandomNumber(3, 8)
      ),
      benefits: getRandomItems(benefits, getRandomNumber(4, 12)),
      postedDate: new Date(
        Date.now() - getRandomNumber(1, 720) * 60 * 60 * 1000
      ).toISOString(),
      applicationDeadline: new Date(
        Date.now() + getRandomNumber(7, 60) * 24 * 60 * 60 * 1000
      ).toISOString(),
      applicationsCount: getRandomNumber(0, 500),
      featured: Math.random() > 0.85,
      urgent: Math.random() > 0.9,
      remote: isRemote,
      companyId: companies.findIndex((c) => c.name === company.name) + 1,
    };

    jobs.push(job);
  }

  return jobs.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
};

// Generate company data with job counts
export const generateCompanies = (jobsData = []) => {
  return companies.map((company, index) => {
    const companyJobs = jobsData.filter((job) => job.company === company.name);

    return {
      id: index + 1,
      ...company,
      description: `${
        company.name
      } is a leading ${company.industry.toLowerCase()} company founded in ${
        company.founded
      }. We're committed to innovation and creating exceptional experiences for our customers and employees.`,
      employees:
        company.size === "Large"
          ? getRandomNumber(1000, 50000)
          : company.size === "Medium"
          ? getRandomNumber(100, 999)
          : getRandomNumber(10, 99),
      jobsCount: companyJobs.length,
      benefits: getRandomItems(benefits, getRandomNumber(6, 15)),
      culture: [
        "Innovation-driven",
        "Collaborative",
        "Fast-paced",
        "Results-oriented",
        "Employee-focused",
        "Diverse & Inclusive",
        "Learning-focused",
        "Flexible",
      ].slice(0, getRandomNumber(3, 6)),
      website: `https://www.${company.name
        .toLowerCase()
        .replace(/\s+/g, "")}.com`,
      socialMedia: {
        linkedin: `https://linkedin.com/company/${company.name
          .toLowerCase()
          .replace(/\s+/g, "")}`,
        twitter: `https://twitter.com/${company.name
          .toLowerCase()
          .replace(/\s+/g, "")}`,
        facebook: `https://facebook.com/${company.name
          .toLowerCase()
          .replace(/\s+/g, "")}`,
      },
    };
  });
};

// Generate salary data
export const generateSalaryData = (jobsData = []) => {
  const salaryData = {};

  Object.keys(jobTitles).forEach((category) => {
    const categoryJobs = jobsData.filter((job) => job.category === category);
    if (categoryJobs.length === 0) return;

    const avgSalary =
      categoryJobs.reduce(
        (sum, job) => sum + (job.salary.min + job.salary.max) / 2,
        0
      ) / categoryJobs.length;
    const minSalary = Math.min(...categoryJobs.map((job) => job.salary.min));
    const maxSalary = Math.max(...categoryJobs.map((job) => job.salary.max));

    salaryData[category] = {
      average: Math.round(avgSalary),
      min: minSalary,
      max: maxSalary,
      jobCount: categoryJobs.length,
      byLevel: experienceLevels.reduce((acc, level) => {
        const levelJobs = categoryJobs.filter(
          (job) => job.experienceLevel === level
        );
        if (levelJobs.length > 0) {
          acc[level] = Math.round(
            levelJobs.reduce(
              (sum, job) => sum + (job.salary.min + job.salary.max) / 2,
              0
            ) / levelJobs.length
          );
        }
        return acc;
      }, {}),
    };
  });

  return salaryData;
};

// Export all data
const jobs = generateJobs(1000);
const companiesData = generateCompanies(jobs);
const salaryData = generateSalaryData(jobs);

export {
  jobs,
  companiesData,
  salaryData,
  jobTitles,
  cities,
  experienceLevels,
  benefits,
};
