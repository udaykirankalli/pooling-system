import { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import { pollAPI } from '../services/api';

const PollContext = createContext();

export const usePoll = () => {
  const context = useContext(PollContext);
  if (!context) {
    throw new Error('usePoll must be used within PollProvider');
  }
  return context;
};

export const PollProvider = ({ children }) => {
  const { socket, connected } = useSocket();
  const [activePoll, setActivePoll] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);

  // Fetch active poll on mount and reconnect
  useEffect(() => {
    const fetchActivePoll = async () => {
      const data = await pollAPI.getActivePoll();
      if (data.poll) {
        setActivePoll(data.poll);
        setRemainingTime(data.remainingTime || 0);
      }
    };

    fetchActivePoll();
  }, [connected]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('poll:started', (data) => {
      setActivePoll(data.poll);
      setRemainingTime(data.remainingTime);
      setHasVoted(false);
    });

    socket.on('poll:update', (poll) => {
      setActivePoll(poll);
    });

    socket.on('poll:ended', (poll) => {
      setActivePoll(poll);
      setRemainingTime(0);
    });

    socket.on('poll:state', (data) => {
      setActivePoll(data.poll);
      setRemainingTime(data.remainingTime);
    });

    return () => {
      socket.off('poll:started');
      socket.off('poll:update');
      socket.off('poll:ended');
      socket.off('poll:state');
    };
  }, [socket]);

  const value = {
    socket,
    connected,
    activePoll,
    remainingTime,
    hasVoted,
    setHasVoted,
    setActivePoll
  };

  return <PollContext.Provider value={value}>{children}</PollContext.Provider>;
};