import { usePollTimer } from '../../hooks/usePollTimer';

const LiveResults = ({ poll, remainingTime }) => {
  const { timeLeft } = usePollTimer(remainingTime);
  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Live Results</h2>
        <div style={styles.timerBadge}>
          <span>⏱️</span>
          <span style={styles.timerText}>{timeLeft}s remaining</span>
        </div>
      </div>

      <div style={styles.questionBox}>
        <p style={styles.question}>{poll.question}</p>
        <p style={styles.totalVotes}>Total Votes: {totalVotes}</p>
      </div>

      <div style={styles.resultsContainer}>
        {poll.options.map((option, index) => {
          const percentage = totalVotes > 0 
            ? Math.round((option.votes / totalVotes) * 100) 
            : 0;

          return (
            <div key={index} style={styles.resultItem}>
              <div style={styles.resultHeader}>
                <span style={styles.optionText}>{option.text}</span>
                <span style={styles.percentageText}>{percentage}%</span>
              </div>
              
              <div style={styles.progressContainer}>
                <div 
                  style={{
                    ...styles.progressBar,
                    width: `${percentage}%`
                  }}
                />
              </div>
              
              <span style={styles.voteCount}>{option.votes} votes</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2d3748',
    margin: 0
  },
  timerBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#fef5e7',
    padding: '8px 16px',
    borderRadius: '20px',
    border: '2px solid #f9e79f'
  },
  timerText: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#d68910'
  },
  questionBox: {
    background: '#f7fafc',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '24px'
  },
  question: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '8px'
  },
  totalVotes: {
    fontSize: '14px',
    color: '#718096',
    margin: 0
  },
  resultsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
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
  optionText: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2d3748'
  },
  percentageText: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#667eea'
  },
  progressContainer: {
    width: '100%',
    height: '14px',
    background: '#e2e8f0',
    borderRadius: '7px',
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '7px',
    transition: 'width 0.5s ease'
  },
  voteCount: {
    fontSize: '14px',
    color: '#718096'
  }
};

export default LiveResults;