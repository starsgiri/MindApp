export type UserQuestions = {
  mood: string[];
  healthPrompt: string;
  mcqs: { question: string; options: string[] }[];
  gratitude: boolean;
};

export const questionsByUser: { [key: string]: UserQuestions } = {
  1: {
    mood: ["Happy", "Sad", "Calm", "Anxious"],
    healthPrompt: "How do you feel physically today?",
    mcqs: [
      {
        question: "Did you exercise today?",
        options: ["Yes", "No"],
      },
      {
        question: "How was your appetite?",
        options: ["Poor", "Normal", "Good"],
      },
    ],
    gratitude: true,
  },
  2: {
    mood: ["Excited", "Tired", "Angry", "Calm"],
    healthPrompt: "How is your energy level today?",
    mcqs: [
      {
        question: "Did you sleep well?",
        options: ["Yes", "No"],
      },
      {
        question: "Did you socialize today?",
        options: ["Yes", "No"],
      },
    ],
    gratitude: false,
  },
  3: {
    mood: ["Motivated", "Stressed", "Content", "Worried"],
    healthPrompt: "How is your mental clarity today?",
    mcqs: [
      {
        question: "Did you meditate today?",
        options: ["Yes", "No"],
      },
      {
        question: "Did you take breaks from work?",
        options: ["Yes", "No"],
      },
    ],
    gratitude: true,
  },
}; 