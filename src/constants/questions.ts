import type { Question } from "@/types";

export type CommonQuestion = Question & {
  chapter: string;
  yearsAppeared: number[];
};

export const mockQuestions: CommonQuestion[] = [
  {
    id: "physics-ohms-law",
    paperId: "fbise-10-class-10-physics-2024-annual",
    subjectId: "class-10-physics",
    classLevel: 10,
    prompt: "State Ohm's law and verify it experimentally.",
    marks: 5,
    section: "B",
    pageNumber: 2,
    chapter: "Electricity",
    yearsAppeared: [2019, 2020, 2022, 2024],
  },
  {
    id: "physics-lenses",
    paperId: "fbise-10-class-10-physics-2023-annual",
    subjectId: "class-10-physics",
    classLevel: 10,
    prompt: "Differentiate between convex and concave lenses with ray diagrams.",
    marks: 4,
    section: "B",
    pageNumber: 3,
    chapter: "Geometrical Optics",
    yearsAppeared: [2019, 2021, 2023],
  },
  {
    id: "chemistry-acids-bases",
    paperId: "fbise-10-class-10-chemistry-2024-annual",
    subjectId: "class-10-chemistry",
    classLevel: 10,
    prompt: "Explain the properties of acids and bases with examples.",
    marks: 5,
    section: "B",
    pageNumber: 2,
    chapter: "Acids, Bases and Salts",
    yearsAppeared: [2020, 2021, 2022, 2023, 2024],
  },
  {
    id: "biology-photosynthesis",
    paperId: "fbise-10-class-10-biology-2024-annual",
    subjectId: "class-10-biology",
    classLevel: 10,
    prompt: "Describe photosynthesis and write the balanced chemical equation.",
    marks: 5,
    section: "C",
    pageNumber: 4,
    chapter: "Bioenergetics",
    yearsAppeared: [2019, 2020, 2023, 2024],
  },
  {
    id: "math-quadratic",
    paperId: "fbise-10-class-10-mathematics-2024-annual",
    subjectId: "class-10-mathematics",
    classLevel: 10,
    prompt: "Solve a quadratic equation by completing the square.",
    marks: 4,
    section: "A",
    pageNumber: 1,
    chapter: "Quadratic Equations",
    yearsAppeared: [2021, 2022, 2023],
  },
];
