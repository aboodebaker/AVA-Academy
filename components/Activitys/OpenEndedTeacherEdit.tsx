'use client'
import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import './style.css'
type Props = {
  game: any;
};

const OpenEndedTeacherEdit: React.FC<Props> = ({ game }: Props) => {
  const [questions, setQuestions] = useState(() =>
    game.questions.map((q:any) => q.question)
  );
  const id = game.uniqueId

  const [answers, setAnswers] = useState(() =>
    game.questions.map((q:any) => q.answer)
  );

  const [ca, setCa] = useState(() =>
    game.questions.map((q:any) => q.canAnswer)
  );

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };
  const handleCaChange = (index: number, isChecked: boolean) => {
  const newCa = [...ca];
  newCa[index] = isChecked;
  setCa(newCa);
}


  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    const updatedQuestions = game.questions.map((q:any, index:number) => (
        
        {
        ...q,
        question: questions[index],
        answer: answers[index],
        canAnswer: ca[index]
        }));

    axios.post('/api/updateQuestionsOE', {input: updatedQuestions, id,})
  };
return (
    <div className='scrolling-wrappers'>
    <form onSubmit={handleSubmit} className="max-w-md mx-auto my-8 bg-background p-8 shadow-lg">
      {game.questions.map((question:any, index:number) => (
        <div key={index} className="mb-4">
          <h1 className="text-text text-xl font-semibold mb-2">Question {index + 1}</h1>
          <div className="mb-4">
            <label className="text-text block text-sm font-medium ">Question:</label>
            <input
              type="text"
              value={questions[index]}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
              className="mt-1 p-2 border border-text rounded-md w-full text-text bg-background"
            />
          </div>
          <div className="mb-4">
            <label className="text-text block text-sm font-medium ">Answer:</label>
            <input
              type="text"
              value={answers[index]}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              className="mt-1 p-2 border border-text rounded-md w-full text-text bg-background"
            />
          </div>
          <label>
            <input
            type="checkbox"
            checked={ca[index]}
            onChange={(e) => handleCaChange(index, e.target.checked)}
            />
            Enable Question
        </label>
        </div>
      ))}
      <button type="submit" className="py-2 px-4 rounded-md bg-primary text-white">
        Submit
      </button>
    </form>
    </div>
  );
};

// Function to format questions as per the specified structure
// const formatQuestions = (questions: any[]) => {
//   return questions.map((question, index) => {
//     const { id, question: text, answer } = question;
//     return `Question ${index + 1} (heading, bold, bigger than the others)\n\nQuestion:\n${text}\nAnswer:\n${answer}\n\n`;
//   }).join('\n');
// };

// Function to parse formatted text and convert it back to JSON
// Function to parse formatted text and convert it back to JSON
// Function to parse formatted text and convert it back to JSON
// const parseFormattedQuestions = (formattedText: string, questions: any[]) => {
//   const lines = formattedText.split('\n');
//   const parsedQuestions: any[] = [];

//   let index = -1;

//   for (const line of lines) {
//     if (line.startsWith('Question')) {
//       const match = line.match(/Question (\d+)/);
//       if (match) {
//         index = parseInt(match[1], 10) - 1;

//         if (parsedQuestions[index]) {
//           // If a question with this index already exists, move to the next index
//           index = parsedQuestions.length;
//         }

//         parsedQuestions[index] = {
//           id: questions[index].id,
//           question: '',
//           answer: '',
//           activityId: questions[index].activityId,
//           options: questions[index].options || null,
//           percentageCorrect: questions[index].percentageCorrect || null,
//           isCorrect: questions[index].isCorrect || null,
//           questionType: questions[index].questionType || null,
//           userAnswer: questions[index].userAnswer || null,
//         };
//       }
//     } else if (line.startsWith('Question:')) {
//       parsedQuestions[index].question = lines[lines.indexOf(line) + 1]?.trim() || '';
//     } else if (line.startsWith('Answer:')) {
//       parsedQuestions[index].answer = lines[lines.indexOf(line) + 1]?.trim() || '';
//     }
//   }

//   return parsedQuestions;
// };


export default OpenEndedTeacherEdit;
