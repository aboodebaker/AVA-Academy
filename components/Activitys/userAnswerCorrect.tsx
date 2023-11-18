'use client'
import React, { useEffect, useState } from 'react';
import { pusherClient } from '@/lib/pusher';
import axios from 'axios';

type UserAnswer = {
  userId: string;
  answers: Array<{ question: string; correctAnswer: string }>;
};

const UserAnswerCorrect = () => {
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user information from your API
        const response = await axios.get('/api/users'); // Replace with the actual endpoint
        const users = response.data;

        // Subscribe to Pusher channels for each user
        users.forEach((user:any) => {
          const { id, name } = user;
          pusherClient.subscribe(id);

          pusherClient.bind('incoming-student-answers', (stats: { question: string; correctAnswer: string }) => {
            setUserAnswers((prevUserAnswers) => {
              const existingUser = prevUserAnswers.find((user) => user.userId === id);

              if (existingUser) {
                const updatedUser = {
                  ...existingUser,
                  answers: [...existingUser.answers, stats],
                };

                return [...prevUserAnswers.filter((user) => user.userId !== id), updatedUser];
              } else {
                const newUser = {
                  userId: id,
                  answers: [stats],
                };
                return [...prevUserAnswers, newUser];
              }
            });
          });
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching user information:', error);
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      // Unsubscribe from Pusher channels when the component unmounts
      userAnswers.forEach((user) => pusherClient.unsubscribe(user.userId));
    };
  }, []); // Run this effect only once when the component mounts

  const tableHeaders = ['User', 'Question', 'Correct Answer'];

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : userAnswers.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>{tableHeaders[0]}</th>
              <th colSpan={tableHeaders.length - 1}>Answers</th>
            </tr>
          </thead>
          <tbody>
            {userAnswers.map((userAnswer) => (
              <tr key={userAnswer.userId}>
                <td>{userAnswer.userId}</td>
                <td>
                  <table>
                    <thead>
                      <tr>
                        {tableHeaders.slice(1).map((header, index) => (
                          <th key={index}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {userAnswer.answers.map((answer, index) => (
                        <tr key={index}>
                          <td>{answer.question}</td>
                          <td>{answer.correctAnswer}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No user answers yet.</p>
      )}
    </div>
  );
};

export default UserAnswerCorrect;
