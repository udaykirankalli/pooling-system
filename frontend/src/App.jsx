import { useState } from 'react';
import { PollProvider } from './context/usePollContext';
import TeacherDashboard from './components/Teacher/TeacherDashboard';
import StudentDashboard from './components/Student/StudentDashboard';
import './App.css';

function App() {
  const [role, setRole] = useState(null);

  if (!role) {
    return (
      <div style={styles.roleSelection}>
        <div style={styles.roleCard}>
          <h1 style={styles.roleTitle}>Welcome to Live Poll System</h1>
          <p style={styles.roleSubtitle}>Choose your role to continue</p>
          
          <div style={styles.roleButtons}>
            <button
              onClick={() => setRole('teacher')}
              style={{...styles.roleButton, ...styles.teacherButton}}
            >
              <span style={styles.roleIcon}>👨‍🏫</span>
              <span style={styles.roleButtonText}>Teacher</span>
              <span style={styles.roleButtonDesc}>Create and manage polls</span>
            </button>
            
            <button
              onClick={() => setRole('student')}
              style={{...styles.roleButton, ...styles.studentButton}}
            >
              <span style={styles.roleIcon}>👨‍🎓</span>
              <span style={styles.roleButtonText}>Student</span>
              <span style={styles.roleButtonDesc}>Join and vote in polls</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PollProvider>
      {role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />}
    </PollProvider>
  );
}

const styles = {
  roleSelection: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px'
  },
  roleCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '50px 40px',
    maxWidth: '600px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    textAlign: 'center'
  },
  roleTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '12px'
  },
  roleSubtitle: {
    fontSize: '18px',
    color: '#718096',
    marginBottom: '40px'
  },
  roleButtons: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px'
  },
  roleButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    padding: '30px 20px',
    border: 'none',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    fontFamily: 'inherit'
  },
  teacherButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white'
  },
  studentButton: {
    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
    color: 'white'
  },
  roleIcon: {
    fontSize: '48px'
  },
  roleButtonText: {
    fontSize: '20px',
    fontWeight: '700'
  },
  roleButtonDesc: {
    fontSize: '14px',
    opacity: 0.9
  }
};

export default App;