import { useState, useEffect } from 'react';
import { usePollTimer } from '../../hooks/usePollTimer';

const PollView = ({ poll, remainingTime, onVote, hasVoted }) => {
  const { timeLeft } = usePollTimer(remainingTime);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = async () => {
    if (selectedOption === null || isSubmitting || hasVoted) return;

    setIsSubmitting(true);
    try {
      await onVote(selectedOption);
    } catch (error) {
      console.error('Vote failed:', error);
      alert(error.message || 'Failed to submit vote');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
  const showResults = hasVoted || timeLeft === 0;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.timerBadge}>
            <span style={styles.timerIcon}>⏱️</span>
            <span style={styles.timerText}>{timeLeft}s</span>
          </div>
        </div>

        <h2 style={styles.question}>{poll.question}</h2>

        {!showResults ? (
          <div style={styles.optionsContainer}>
            {poll.options.map((option, index) => (
              <div
                key={index}
                onClick={() => !hasVoted && setSelectedOption(index)}
                style={{
                  ...styles.option,
                  ...(selectedOption === index ? styles.optionSelected : {})
                }}
              >
                <div style={styles.optionRadio}>
                  {selectedOption === index && <div style={styles.optionRadioInner} />}
                </div>
                <span style={styles.optionText}>{option.text}</span>
              </div>
            ))}

            <button
              onClick={handleVote}
              disabled={selectedOption === null || isSubmitting || hasVoted}
              style={{
                ...styles.submitButton,
                ...(selectedOption === null || isSubmitting || hasVoted ? styles.submitButtonDisabled : {})
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Vote'}
            </button>
          </div>
        ) : (
          <div style={styles.resultsContainer}>
            <h3 style={styles.resultsTitle}>Results</h3>
            {poll.options.map((option, index) => {
              const percentage = totalVotes > 0 
                ? Math.round((option.votes / totalVotes) * 100) 
                : 0;

              return (
                <div key={index} style={styles.resultItem}>
                  <div style={styles.resultHeader}>
                    <span style={styles.resultLabel}>{option.text}</span>
                    <span style={styles.resultPercentage}>{percentage}%</span>
                  </div>
                  <div style={styles.progressBarContainer}>
                    <div 
                      style={{
                        ...styles.progressBar,
                        width: `${percentage}%`
                      }}
                    />
                  </div>
                  <span style={styles.resultVotes}>{option.votes} votes</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px'
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    width: '100%',
    maxWidth: '600px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '20px'
  },
  timerBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#f7fafc',
    padding: '8px 16px',
    borderRadius: '20px',
    border: '2px solid #e2e8f0'
  },
  timerIcon: {
    fontSize: '18px'
  },
  timerText: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#2d3748'
  },
  question: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '30px',
    lineHeight: '1.4'
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '16px 20px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: 'white'
  },
  optionSelected: {
    border: '2px solid #667eea',
    background: '#f7faff'
  },
  optionRadio: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    border: '2px solid #cbd5e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  optionRadioInner: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: '#667eea'
  },
  optionText: {
    fontSize: '16px',
    color: '#2d3748',
    fontWeight: '500'
  },
  submitButton: {
    marginTop: '16px',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    fontFamily: 'inherit'
  },
  submitButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  resultsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  resultsTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '10px'
  },
  resultItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  resultLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2d3748'
  },
  resultPercentage: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#667eea'
  },
  progressBarContainer: {
    width: '100%',
    height: '12px',
    background: '#e2e8f0',
    borderRadius: '6px',
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '6px',
    transition: 'width 0.5s ease'
  },
  resultVotes: {
    fontSize: '14px',
    color: '#718096'
  }
};

export default PollView;