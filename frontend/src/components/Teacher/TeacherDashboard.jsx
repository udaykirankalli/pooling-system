import { useState, useEffect } from 'react';
import { usePoll } from '../../context/usePollContext';
import CreatePoll from './CreatePoll';
import LiveResults from './LiveResults';
import { pollAPI } from '../../services/api';

const TeacherDashboard = () => {
  const { socket, activePoll, remainingTime } = usePoll();
  const [pollHistory, setPollHistory] = useState([]);
  const [createdPoll, setCreatedPoll] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPollHistory();
  }, []);

  const fetchPollHistory = async () => {
    setIsLoading(true);
    try {
      const history = await pollAPI.getPollHistory();
      setPollHistory(history);
    } catch (error) {
      console.error('Failed to fetch poll history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePollCreated = (poll) => {
    setCreatedPoll(poll);
  };

  const handleStartPoll = () => {
    if (!createdPoll || !socket) return;
    
    socket.emit('teacher:start-poll', createdPoll._id);
    setCreatedPoll(null);
  };

  const canCreateNewPoll = !activePoll && !createdPoll;

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h1 style={styles.logo}>📊 Live Poll</h1>
        
        <nav style={styles.nav}>
          <button
            onClick={() => setShowHistory(false)}
            style={{
              ...styles.navButton,
              ...((!showHistory) ? styles.navButtonActive : {})
            }}
          >
            Current Poll
          </button>
          <button
            onClick={() => {
              setShowHistory(true);
              fetchPollHistory();
            }}
            style={{
              ...styles.navButton,
              ...(showHistory ? styles.navButtonActive : {})
            }}
          >
            History
          </button>
        </nav>
      </div>

      <div style={styles.main}>
        {!showHistory ? (
          <>
            {canCreateNewPoll && (
              <CreatePoll onPollCreated={handlePollCreated} />
            )}

            {createdPoll && !activePoll && (
              <div style={styles.readyCard}>
                <h2 style={styles.readyTitle}>Poll Ready to Start</h2>
                <p style={styles.readyQuestion}>{createdPoll.question}</p>
                <div style={styles.readyOptions}>
                  {createdPoll.options.map((opt, idx) => (
                    <div key={idx} style={styles.readyOption}>
                      {opt.text}
                    </div>
                  ))}
                </div>
                <p style={styles.readyDuration}>Duration: {createdPoll.duration}s</p>
                <button onClick={handleStartPoll} style={styles.startButton}>
                  Start Poll Now
                </button>
              </div>
            )}

            {activePoll && (
              <LiveResults poll={activePoll} remainingTime={remainingTime} />
            )}

            {!activePoll && !createdPoll && (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📝</div>
                <h2 style={styles.emptyTitle}>No Active Poll</h2>
                <p style={styles.emptyText}>Create a new poll to get started</p>
              </div>
            )}
          </>
        ) : (
          <div style={styles.historyContainer}>
            <h2 style={styles.historyTitle}>Poll History</h2>
            
            {isLoading ? (
              <div style={styles.loader}></div>
            ) : pollHistory.length === 0 ? (
              <div style={styles.emptyHistory}>
                <p style={styles.emptyHistoryText}>No completed polls yet</p>
              </div>
            ) : (
              <div style={styles.historyList}>
                {pollHistory.map((poll) => {
                  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
                  
                  return (
                    <div key={poll._id} style={styles.historyItem}>
                      <div style={styles.historyHeader}>
                        <h3 style={styles.historyQuestion}>{poll.question}</h3>
                        <span style={styles.historyDate}>
                          {new Date(poll.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div style={styles.historyResults}>
                        {poll.options.map((option, idx) => {
                          const percentage = totalVotes > 0 
                            ? Math.round((option.votes / totalVotes) * 100) 
                            : 0;
                          
                          return (
                            <div key={idx} style={styles.historyResultItem}>
                              <div style={styles.historyResultHeader}>
                                <span>{option.text}</span>
                                <span style={styles.historyPercentage}>{percentage}%</span>
                              </div>
                              <div style={styles.historyProgressContainer}>
                                <div 
                                  style={{
                                    ...styles.historyProgressBar,
                                    width: `${percentage}%`
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div style={styles.historyFooter}>
                        <span style={styles.historyTotalVotes}>
                          Total Votes: {totalVotes}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: '#f7fafc'
  },
  sidebar: {
    width: '260px',
    background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
    padding: '30px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '30px'
  },
  logo: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'white',
    margin: 0
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  navButton: {
    padding: '12px 16px',
    background: 'transparent',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background 0.2s',
    fontFamily: 'inherit'
  },
  navButtonActive: {
    background: 'rgba(255,255,255,0.2)'
  },
  main: {
    flex: 1,
    padding: '40px',
    overflowY: 'auto'
  },
  readyCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  },
  readyTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '16px'
  },
  readyQuestion: {
    fontSize: '18px',
    color: '#4a5568',
    marginBottom: '20px',
    fontWeight: '500'
  },
  readyOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px'
  },
  readyOption: {
    padding: '12px 16px',
    background: '#f7fafc',
    borderRadius: '8px',
    fontSize: '15px',
    color: '#2d3748'
  },
  readyDuration: {
    fontSize: '14px',
    color: '#718096',
    marginBottom: '20px'
  },
  startButton: {
    padding: '14px 28px',
    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    fontFamily: 'inherit'
  },
  emptyState: {
    background: 'white',
    borderRadius: '12px',
    padding: '60px 40px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '20px'
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '10px'
  },
  emptyText: {
    fontSize: '16px',
    color: '#718096'
  },
  historyContainer: {
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  historyTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '24px'
  },
  loader: {
    width: '50px',
    height: '50px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    margin: '40px auto',
    animation: 'spin 1s linear infinite'
  },
  emptyHistory: {
    padding: '40px',
    textAlign: 'center'
  },
  emptyHistoryText: {
    fontSize: '16px',
    color: '#718096'
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  historyItem: {
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    padding: '20px',
    transition: 'border-color 0.2s'
  },
  historyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
    gap: '16px'
  },
  historyQuestion: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2d3748',
    margin: 0,
    flex: 1
  },
  historyDate: {
    fontSize: '14px',
    color: '#718096',
    flexShrink: 0
  },
  historyResults: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '16px'
  },
  historyResultItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  historyResultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#4a5568'
  },
  historyPercentage: {
    fontWeight: '700',
    color: '#667eea'
  },
  historyProgressContainer: {
    width: '100%',
    height: '8px',
    background: '#e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  historyProgressBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '4px',
    transition: 'width 0.5s ease'
  },
  historyFooter: {
    paddingTop: '12px',
    borderTop: '1px solid #e2e8f0'
  },
  historyTotalVotes: {
    fontSize: '14px',
    color: '#718096',
    fontWeight: '500'
  }
};

export default TeacherDashboard;