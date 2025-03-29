import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

function App() {
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10); // Timer per question

  // Fetch quiz data from mock JSON
  const fetchQuizData = async () => {
    try {
      const response = await axios.get('/mockQuizData.json');
      const quizQuestions = response.data.categories[0].questions || [];
      setQuizData(quizQuestions);
      setLoading(false);
    } catch (err) {
      setError('Error fetching quiz data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizData();
  }, []);

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults) {
      // Move to next question when time runs out
      if (currentQuestionIndex < quizData.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTimeLeft(10);
      } else {
        setShowResults(true);
      }
    }
  }, [timeLeft, currentQuestionIndex, showResults, quizData]);

  // Handle answer selection
  const handleAnswerSelect = (selectedOption) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: selectedOption, // Track answers by question index
    }));

    // Move to next question
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(10); // Reset timer for next question
    } else {
      setShowResults(true); // Show results after last question
    }
  };

  // Calculate score (1 mark per correct answer)
  const calculateScore = () => {
    let total = 0;
    quizData.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        total += 1;
      }
    });
    return total;
  };

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container">{error}</div>;

  if (showResults) {
    const totalScore = calculateScore();
    return (
      <div className="container results">
        <h1>Quiz Results</h1>
        <p>Total Score: {totalScore}/{quizData.length}</p>
        <div className="result-details">
          {quizData.map((question, index) => (
            <div key={index} className="result-item">
              <h3>{question.question}</h3>
              <p>
                Your Answer: <span className={selectedAnswers[index] === question.correctAnswer ? 'correct' : 'wrong'}>
                  {selectedAnswers[index] || 'Not answered'}
                </span>
              </p>
              <p>Correct Answer: {question.correctAnswer}</p>
            </div>
          ))}
        </div>
        <footer className="footer">
          <p>Connect with me:</p>
          <div className="social-links">
            <a href="https://github.com/rahulvarmaviit" className="social-link github">GitHub</a>
            <a href="http://www.linkedin.com/in/rahul-varma-vatsavai-62a051290" className="social-link linkedin">LinkedIn</a>
            <a href="mailto:rahulvarmaviit@gmail.com" className="social-link gmail">Gmail</a>
          </div>
        </footer>
      </div>
    );
  }

  const currentQuestion = quizData[currentQuestionIndex];

  return (
    <div className="container">
      <h1>Quiz App</h1>
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${((currentQuestionIndex + 1) / quizData.length) * 100}%` }}
        ></div>
      </div>
      <p className="timer">Time Left: {timeLeft} seconds</p>
      <h3 className="question">{currentQuestion.question}</h3>
      <ul className="options">
        {currentQuestion.options.map((option, optionIndex) => (
          <li key={optionIndex}>
            <button
              className={`option-btn ${selectedAnswers[currentQuestionIndex] === option ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(option)}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;