"use client";

import { useState } from 'react';
import { quizzes } from '@/lib/data';
import type { Question } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle } from 'lucide-react';

type AnswerState = {
  [questionId: string]: string;
};

export function QuizView() {
  const [selectedQuiz, setSelectedQuiz] = useState(quizzes[0]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100;

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsFinished(false);
  };
  
  const calculateScore = () => {
    return selectedQuiz.questions.reduce((score, question) => {
      return answers[question.id] === question.correctAnswer ? score + 1 : score;
    }, 0);
  };
  
  if (isFinished) {
    const score = calculateScore();
    const total = selectedQuiz.questions.length;
    return (
        <Card>
            <CardHeader>
                <CardTitle>Quiz Complete!</CardTitle>
                <CardDescription>You scored {score} out of {total}.</CardDescription>
            </CardHeader>
            <CardContent>
                {selectedQuiz.questions.map(q => (
                    <div key={q.id} className="mb-4 p-3 rounded-lg border">
                        <p className="font-medium">{q.text}</p>
                        <div className="flex items-center mt-2">
                        {answers[q.id] === q.correctAnswer ? 
                            <CheckCircle className="text-green-500 mr-2" /> :
                            <XCircle className="text-red-500 mr-2" />
                        }
                        <p className={answers[q.id] === q.correctAnswer ? 'text-green-700' : 'text-red-700'}>
                            Your answer: {answers[q.id] || "No answer"}
                        </p>
                        </div>
                        {answers[q.id] !== q.correctAnswer && <p className="text-sm text-muted-foreground mt-1">Correct answer: {q.correctAnswer}</p>}
                    </div>
                ))}
            </CardContent>
            <CardFooter>
                <Button onClick={restartQuiz}>Try Again</Button>
            </CardFooter>
        </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{selectedQuiz.title}</CardTitle>
        <CardDescription>Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}</CardDescription>
        <Progress value={progress} className="mt-2"/>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-lg font-semibold">{currentQuestion.text}</p>
          <RadioGroup
            value={answers[currentQuestion.id] || ''}
            onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
            className="space-y-2"
          >
            {currentQuestion.options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${currentQuestion.id}-${option}`} />
                <Label htmlFor={`${currentQuestion.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleNext} disabled={!answers[currentQuestion.id]}>
          {currentQuestionIndex < selectedQuiz.questions.length - 1 ? 'Next' : 'Finish'}
        </Button>
      </CardFooter>
    </Card>
  );
}
