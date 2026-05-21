// Shared StructuredResume interface used by all resume templates

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
}

export interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  gpa?: string;
}

export interface Project {
  name: string;
  description: string;
  tech: string[];
  url?: string;
}

export interface Skills {
  technical: string[];
  soft: string[];
}

export interface StructuredResume {
  personal: PersonalInfo;
  summary: string;
  skills: Skills;
  experience: Experience[];
  education: Education[];
  certifications: string[];
  projects: Project[];
  targetRole: string;
  atsScore?: number;
}

// Empty template for initialization
export const emptyResume: StructuredResume = {
  personal: {
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
  },
  summary: "",
  skills: {
    technical: [],
    soft: [],
  },
  experience: [],
  education: [],
  certifications: [],
  projects: [],
  targetRole: "",
  atsScore: undefined,
};