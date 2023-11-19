'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { pusherClient } from '@/lib/pusher';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';


type UserAnswer = {
  userId: string;
  answers: Array<{ question: string; correctAnswer: any }>;
  userName: string;
};

type Props = {
  uniqueId: string;
};



const UserAnswerCorrect = ({ uniqueId }: Props) => {
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('/api/users', { uniqueId });
        const users = response.data.users;

        users.forEach((user: any) => {
          const { id, name } = user;
          pusherClient.subscribe(id);

          const handleIncomingAnswers = (stats: UserAnswer) => {
            setUserAnswers((prevUserAnswers) => {
              const existingUser = prevUserAnswers.find((user) => user.userId === id);

              if (existingUser) {
                const updatedUser = {
                  ...existingUser,
                  answers: [...existingUser.answers, ...stats.answers],
                };

                return [...prevUserAnswers.filter((user) => user.userId !== id), updatedUser];
              } else {
                return [...prevUserAnswers, { userId: id, userName: name, answers: stats.answers }];
              }
            });
          };

          pusherClient.bind(`incoming-student-answers-${id}`, handleIncomingAnswers);
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching user information:', error);
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      userAnswers.forEach((user) => pusherClient.unsubscribe(user.userId));
    };
  }, [uniqueId, userAnswers]);

  const tableHeaders = ['User', 'Question', 'Correct Answer'];

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : userAnswers.length > 0 ? (
        <Table>
          <TableCaption>User Answers</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead colSpan={userAnswers.length}>Answers</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userAnswers.map((userAnswer) => (
              <TableRow key={userAnswer.userId}>
                <TableCell>{userAnswer.userName}</TableCell>
                <TableCell>
                  <Table>
                    <TableBody>
                      {userAnswer.answers.map((answer, index) => (
                        <TableRow key={index + 1}>
                          <TableCell>{answer.question}</TableCell>
                          <TableCell>{answer.correctAnswer ? 'Correct' : 'Incorrect'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {userAnswers.length > 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={userAnswers.length}>Total</TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      ) : (
        <p>No user answers yet.</p>
      )}
    </div>
  );
};

export default UserAnswerCorrect;
