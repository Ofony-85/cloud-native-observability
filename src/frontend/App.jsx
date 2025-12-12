import { useState, useEffect } from 'react'

function App() {
  const [items, setItems] = useState([])
  const [serverInfo, setServerInfo] = useState(null)
  const [health, setHealth] = useState(null)
  const [newItem, setNewItem] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Backend URL - Kubernetes LoadBalancer
  const API_URL = 'http://ae0de86ca641c4fb7a608940d32df610-641845635.us-east-1.elb.amazonaws.com:8000'

  // Fetch health status
  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(err => {
        console.error('Health check failed:', err)
        setError('Failed to connect to backend')
      })
  }, [])

  // Fetch server info
  useEffect(() => {
    fetch(`${API_URL}/api/info`)
      .then(res => res.json())
      .then(data => setServerInfo(data))
      .catch(err => console.error('Failed to fetch server info:', err))
  }, [])

  // Fetch items
  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await fetch(`${API_URL}/api/items`)
      if (response.ok) {
        const data = await response.json()
        setItems(data)
        setError(null)
      }
    } catch (err) {
      console.error('Failed to fetch items:', err)
      setError('Failed to fetch items')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/api/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      })

      if (response.ok) {
        setNewItem({ name: '', description: '' })
        fetchItems()
      } else {
        setError('Failed to create item')
      }
    } catch (err) {
      console.error('Failed to create item:', err)
      setError('Failed to create item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ padding: '2rem' }}>
        <header style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '2.5rem' }}>☁️</span>
            <h1 style={{ color: 'white', margin: 0 }}>Cloud Observability Platform</h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0 }}>Production-Ready Microservices on Kubernetes</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Health Status Card */}
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#667eea', marginTop: 0 }}>
              🏥 Health Status
            </h2>
            {health ? (
              <div>
                <p><strong>Status:</strong> <span style={{ color: '#10b981' }}>{health.status}</span></p>
                <p><strong>App:</strong> {health.app}</p>
                <p><strong>Version:</strong> {health.version}</p>
                <p><strong>Environment:</strong> {health.environment}</p>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>

          {/* Server Info Card */}
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#667eea', marginTop: 0 }}>
              💻 Server Info
            </h2>
            {serverInfo ? (
              <div>
                <p><strong>Hostname:</strong> {serverInfo.hostname}</p>
                <p><strong>DB Host:</strong> {serverInfo.database?.host}</p>
                <p><strong>DB Name:</strong> {serverInfo.database?.database}</p>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>

          {/* Database Items Card */}
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#667eea', marginTop: 0 }}>
              📊 Database Items
            </h2>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#667eea', textAlign: 'center' }}>
              {items.length}
            </div>
            <p style={{ textAlign: 'center', color: '#6b7280', margin: 0 }}>Total items stored</p>
          </div>
        </div>

        {/* Create Item Form */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#667eea', marginTop: 0 }}>
            ➕ Create New Item
          </h2>
          
          {error && (
            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Name <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                required
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1rem' }}
                placeholder="Enter item name"
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Description</label>
              <textarea
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                rows="3"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1rem' }}
                placeholder="Enter item description"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '0.75rem 2rem',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => !loading && (e.target.style.transform = 'scale(1.05)')}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              {loading ? 'Creating...' : 'Create Item'}
            </button>
          </form>

          {/* Items List */}
          {items.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>Stored Items:</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {items.map((item) => (
                  <div key={item.id} style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#667eea' }}>{item.name}</h4>
                    {item.description && <p style={{ margin: 0, color: '#6b7280' }}>{item.description}</p>}
                    <small style={{ color: '#9ca3af' }}>Created: {new Date(item.created_at).toLocaleString()}</small>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
