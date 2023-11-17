// @ts-nocheck
'use client'
import React, { useState } from 'react';
import axios from 'axios';
import './style.css';

type Props = {
  game: any;
};

const MCQTeacherEdit: React.FC<Props> = ({ game }: Props) => {
  const [questions, setQuestions] = useState(() =>
    game.questions.map((q: any) => q.question)
  );
  const [answers, setAnswers] = useState(() =>
    game.questions.map((q: any) => q.answer)
  );
  const [ca, setCa] = useState(() =>
    game.questions.map((q: any) => q.canAnswer)
  );
  const [options, setOptions] = useState(() =>
    game.questions.map((q: any) => JSON.parse(q.options))
  );

  const handleQuestionChange = (index: number, value: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, i) => (i === index ? value : q))
    );
  };

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers((prevAnswers) =>
      prevAnswers.map((a, i) => (i === index ? value : a))
    );
  };

  const handleOptionChange = (index: number, optionIndex: number, value: string) => {
    setOptions((prevOptions) =>
      prevOptions.map((opts, i) =>
        i === index ? [...opts.slice(0, optionIndex), value, ...opts.slice(optionIndex + 1)] : opts
      )
    );
  };

  const handleCaChange = (index: number, isChecked: boolean) => {
    setCa((prevCa) =>
      prevCa.map((c, i) => (i === index ? isChecked : c))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedQuestions = game.questions.map((q: any, index: number) => ({
      ...q,
      question: questions[index],
      answer: answers[index],
      canAnswer: ca[index],
      options: JSON.stringify(options[index]), // stringify options before sending
    }));

    axios.post('/api/updateQuestionsOE', { input: updatedQuestions, id: game.uniqueId });
  };

  return (
    <div className='scrolling-wrappers'>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto my-8 bg-background p-8 shadow-lg">
        {game.questions.map((question: any, index: number) => (
          <div key={index} className="mb-4">
            <h1 className="text-text text-xl font-semibold mb-2">Question {index + 1}</h1>
            <div className="mb-4">
              <label className="text-text block text-sm font-medium">Question:</label>
              <input
                type="text"
                value={questions[index]}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                className="mt-1 p-2 border border-text rounded-md w-full text-text bg-background"
              />
            </div>
            <div className="mb-4">
              <label className="text-text block text-sm font-medium">Correct Answer:</label>
              <input
                type="text"
                value={answers[index]}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className="mt-1 p-2 border border-text rounded-md w-full text-text bg-background"
              />
            </div>
            {[1, 2, 3, 4].map((optionIndex) => (
              <div key={optionIndex} className="mb-4">
                <label className="text-text block text-sm font-medium">{`Option ${optionIndex}:`}</label>
                <input
                  type="text"
                  value={options[index][optionIndex - 1]}
                  onChange={(e) => handleOptionChange(index, optionIndex - 1, e.target.value)}
                  className="mt-1 p-2 border border-text rounded-md w-full text-text bg-background"
                />
              </div>
            ))}
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
        <button type="submit" className="py-2 px-4 rounded bg-blue-700 text-white">
          Submit
        </button>
      </form>
    </div>
  );
};

export default MCQTeacherEdit;
