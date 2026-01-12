import { useState, useEffect } from 'react';
import { usePoll } from '../../context/usePollContext';
import NameEntry from './nameEntry';
import PollView from './pollView';
import { pollAPI } from '../../services/api';

const StudentDashboard = () => {
  const [studentName, setStudentName] = useState('');
  const [sessionId, setSessionId] = useState('');
  const { socket, activePoll, remainingTime, hasVoted, setHasVoted } = usePoll();

  useEffect(() => {
    // Check if name exists in session storage
    const savedName = sessionStorage.getItem('studentName');
    const savedSessionId = sessionStorage.getItem('sessionId');
    
    if (savedName && savedSessionId) {
      setStudentName(savedName);
      setSessionId(savedSessionId);
    } else {
      // Generate unique session ID
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
      sessionStorage.setItem('sessionId', newSessionId);
    }
  }, []);

  useEffect(() => {
    if (socket && studentName) {
      socket.emit('student:join');
    }
  }, [socket, studentName]);

  const handleNameSubmit = (name) => {
    setStudentName(name);
    sessionStorage.setItem('studentName', name);
  };

  const handleVote = (optionIndex) => {
  if (!activePoll || hasVoted) return;

  return new Promise((resolve, reject) => {
    socket.emit("student:vote", {
      pollId: activePoll._id,
      optionIndex,
      studentName,
      sessionId
    });

    socket.once("vote:success", () => {
      setHasVoted(true); // ✅ set only after server confirms
      resolve();
    });

    socket.once("vote:error", (err) => {
      reject(err);
    });
  });
};
  if (!studentName) {
    return <NameEntry onNameSubmit={handleNameSubmit} />;
  }

  if (!activePoll) {
    return (
      <div style={styles.waitingContainer}>
        <div style={styles.waitingCard}>
          <div style={styles.loader}></div>
          <h2 style={styles.waitingTitle}>Hi, {studentName}!</h2>
          <p style={styles.waitingText}>Waiting for teacher to start a poll...</p>
        </div>
      </div>
    );
  }

  return (
    <PollView
      poll={activePoll}
      remainingTime={remainingTime}
      onVote={handleVote}
      hasVoted={hasVoted}
    />
  );
};

const styles = {
  waitingContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px'
  },
  waitingCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '60px 40px',
    textAlign: 'center',
    maxWidth: '400px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
  },
  loader: {
    width: '50px',
    height: '50px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    margin: '0 auto 30px',
    animation: 'spin 1s linear infinite'
  },
  waitingTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '12px'
  },
  waitingText: {
    fontSize: '16px',
    color: '#718096'
  }
};

export default StudentDashboard;