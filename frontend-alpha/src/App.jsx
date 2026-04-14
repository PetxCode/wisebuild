import { useState, useEffect } from 'react'
import './index.css'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/data')
      if (!response.ok) throw new Error('Network response was not ok')
      const result = await response.json()
      setData(result)
      setError(null)
    } catch (err) {
      setError('Could not connect to backend server. Make sure it is running on port 5000.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading && !data) {
    return (
      <div className="loading">
        <div className="status-dot"></div>
        <p>Synchronizing with Backend...</p>
      </div>
    )
  }

  return (
    <div className="container">
      <header>
        <div>
          <h1>Alpha Control</h1>
          <p style={{ color: 'var(--text-dim)', margin: '4px 0 0 0' }}>Project One Visualization</p>
        </div>
        <div className="status-badge">
          <div className="status-dot"></div>
          {data ? data.stats.serverStatus : 'Offline'}
        </div>
      </header>

      {error ? (
        <div className="info-card" style={{ borderColor: '#ff4444', color: '#ff4444' }}>
          <h2>Connection Error</h2>
          <p>{error}</p>
          <button className="btn-refresh" onClick={fetchData} style={{ background: '#ff4444' }}>Retry</button>
        </div>
      ) : (
        <div className="main-content">
          <div className="info-card message-box">
            {data?.message}
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '1rem' }}>
              Last Sync: {new Date(data?.timestamp).toLocaleTimeString()}
            </div>
          </div>

          <div className="info-card">
            <h2>System Stats</h2>
            <div className="feature-list">
              <div className="feature-item">
                <span>Active Users</span>
                <span style={{ color: 'var(--accent-color)' }}>{data?.stats.activeUsers}</span>
              </div>
              <div className="feature-item">
                <span>Requests</span>
                <span style={{ color: 'var(--accent-color)' }}>{data?.stats.requestsProcessed}</span>
              </div>
            </div>
          </div>

          <div className="info-card">
            <h2>Core Features</h2>
            <div className="feature-list">
              {data?.features.map(f => (
                <div key={f.id} className="feature-item">
                  <span>{f.name}</span>
                  <span style={{ opacity: 0.7 }}>{f.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!error && (
        <button className="btn-refresh" onClick={fetchData}>
          Refresh Data
        </button>
      )}
    </div>
  )
}

export default App
