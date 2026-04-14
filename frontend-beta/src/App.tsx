import { useState, useEffect } from 'react'
import './index.css'

interface SharedData {
  message: string;
  timestamp: string;
  stats: {
    activeUsers: number;
    requestsProcessed: number;
    serverStatus: string;
  };
  features: Array<{
    id: number;
    name: string;
    status: string;
  }>;
}

function App() {
  const [data, setData] = useState<SharedData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStream = async () => {
    setLoading(true)
    try {
      const resp = await fetch('/api/data')
      const json = await resp.json()
      setData(json)
    } catch (err) {
      console.error('Backend synergy failure', err)
    } finally {
      setTimeout(() => setLoading(false), 500) // Aesthetic delay
    }
  }

  useEffect(() => {
    fetchStream()
  }, [])

  if (loading) {
    return <div className="loading-screen">Optimizing Data Streams...</div>
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-purple)' }}>BETA</div>
        <nav>
          <div className="nav-item active">Dashboard</div>
          <div className="nav-item">Analytics</div>
          <div className="nav-item">Security</div>
          <div className="nav-item">Logs</div>
        </nav>
        <div style={{ marginTop: 'auto' }}>
           <button className="btn-sync" onClick={fetchStream}>Manual Sync</button>
        </div>
      </aside>

      <main className="main-view">
        <header>
          <h1>Intelligence Overview</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Central Backend Connectivity: {data?.stats.serverStatus}</p>
        </header>

        <div className="dashboard-grid">
          <div className="card">
            <div className="nav-item" style={{ padding: 0 }}>Active Nodes</div>
            <div className="stat-value">{data?.stats.activeUsers}</div>
          </div>
          <div className="card">
            <div className="nav-item" style={{ padding: 0 }}>Ingestion Rate</div>
            <div className="stat-value">{data?.stats.requestsProcessed}</div>
          </div>
          <div className="card">
            <div className="nav-item" style={{ padding: 0 }}>Heartbeat</div>
            <div className="stat-value" style={{ fontSize: '1.2rem' }}>{new Date(data?.timestamp || '').toLocaleTimeString()}</div>
          </div>
        </div>

        <div className="data-section">
          <h2>Feature Propagation</h2>
          <div className="timeline">
            {data?.features.map(f => (
              <div key={f.id} className="timeline-item">
                <div className="dot"></div>
                <div className="item-content">
                  <div className="item-title">{f.name}</div>
                  <div className="item-desc">Status confirmed: {f.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(191, 90, 242, 0.05)', borderRadius: '16px', border: '1px solid rgba(191, 90, 242, 0.2)' }}>
          <div style={{ color: 'var(--accent-purple)', fontWeight: 600, marginBottom: '0.5rem' }}>Broadcast Message</div>
          <div style={{ fontSize: '1.1rem' }}>{data?.message}</div>
        </div>
      </main>
    </div>
  )
}

export default App
