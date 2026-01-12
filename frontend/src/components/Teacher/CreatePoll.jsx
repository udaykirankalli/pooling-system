import { useState } from 'react';
import { pollAPI } from '../../services/api';

const CreatePoll = ({ onPollCreated }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [duration, setDuration] = useState(60);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    const filledOptions = options.filter(opt => opt.trim());
    if (filledOptions.length < 2) {
      setError('Please provide at least 2 options');
      return;
    }

    setIsCreating(true);

    try {
      const poll = await pollAPI.createPoll(question, filledOptions, duration);
      onPollCreated(poll);
      
      // Reset form
      setQuestion('');
      setOptions(['', '']);
      setDuration(60);
    } catch (error) {
      setError(error.message || 'Failed to create poll');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create New Poll</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question"
            style={styles.input}
            maxLength={200}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Options</label>
          {options.map((option, index) => (
            <div key={index} style={styles.optionRow}>
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                style={styles.input}
                maxLength={100}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  style={styles.removeButton}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          
          {options.length < 6 && (
            <button
              type="button"
              onClick={addOption}
              style={styles.addButton}
            >
              + Add Option
            </button>
          )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Duration (seconds)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            min="10"
            max="300"
            style={styles.input}
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button
          type="submit"
          disabled={isCreating}
          style={{
            ...styles.submitButton,
            ...(isCreating ? styles.submitButtonDisabled : {})
          }}
        >
          {isCreating ? 'Creating...' : 'Create Poll'}
        </button>
      </form>
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
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '24px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4a5568'
  },
  input: {
    padding: '12px 14px',
    fontSize: '15px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit'
  },
  optionRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  },
  removeButton: {
    padding: '8px 12px',
    background: '#fed7d7',
    color: '#c53030',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    flexShrink: 0
  },
  addButton: {
    padding: '10px',
    background: '#e6fffa',
    color: '#319795',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    marginTop: '8px'
  },
  error: {
    color: '#e53e3e',
    fontSize: '14px',
    margin: '0'
  },
  submitButton: {
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    fontFamily: 'inherit'
  },
  submitButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed'
  }
};

export default CreatePoll;