import { useState, useEffect } from 'react'
import { adminApi } from '../../services/api'
import AdminLayout from '../../components/admin/AdminLayout'
import '../../styles/admin.css'

interface Settings {
  [key: string]: string
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await adminApi.getSettings()
      setSettings(response.data)
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      await adminApi.updateSettings(settings)
      setMessage('Settings saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Failed to save settings:', error)
      setMessage('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const settingGroups = [
    {
      title: 'Personal Information',
      icon: 'bi-person',
      fields: [
        { key: 'name', label: 'Full Name', type: 'text' },
        { key: 'title', label: 'Job Title', type: 'text' },
        { key: 'bio', label: 'Bio', type: 'textarea' },
        { key: 'email', label: 'Email', type: 'email' },
        { key: 'phone', label: 'Phone', type: 'text' },
        { key: 'location', label: 'Location', type: 'text' },
      ]
    },
    {
      title: 'Social Links',
      icon: 'bi-link-45deg',
      fields: [
        { key: 'github', label: 'GitHub URL', type: 'url' },
        { key: 'linkedin', label: 'LinkedIn URL', type: 'url' },
        { key: 'twitter', label: 'Twitter URL', type: 'url' },
        { key: 'facebook', label: 'Facebook URL', type: 'url' },
        { key: 'instagram', label: 'Instagram URL', type: 'url' },
      ]
    },
    {
      title: 'Site Settings',
      icon: 'bi-gear',
      fields: [
        { key: 'site_title', label: 'Site Title', type: 'text' },
        { key: 'site_description', label: 'Site Description', type: 'textarea' },
        { key: 'footer_text', label: 'Footer Text', type: 'text' },
      ]
    },
  ]

  return (
    <AdminLayout>
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
            <i className="bi bi-sliders" style={{ marginRight: '0.5rem' }}></i>
            Site Settings
          </h2>
        </div>
        <div className="admin-card-body">
          {message && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                marginBottom: '1.5rem',
                background: message.includes('success') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: message.includes('success') ? 'var(--admin-success)' : 'var(--admin-danger)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <i className={`bi ${message.includes('success') ? 'bi-check-circle' : 'bi-exclamation-circle'}`}></i>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {settingGroups.map((group) => (
              <div key={group.title} style={{ marginBottom: '2rem' }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  paddingBottom: '0.5rem',
                  borderBottom: '1px solid var(--admin-border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <i className={`bi ${group.icon}`} style={{ color: 'var(--admin-primary)' }}></i>
                  {group.title}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                  {group.fields.map((field) => (
                    <div key={field.key} className="admin-form-group">
                      <label className="admin-form-label">{field.label}</label>
                      {field.type === 'textarea' ? (
                        <textarea
                          value={settings[field.key] || ''}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          className="admin-form-textarea"
                          rows={3}
                        />
                      ) : (
                        <input
                          type={field.type}
                          value={settings[field.key] || ''}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          className="admin-form-input"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--admin-border)' }}>
              <button
                type="submit"
                disabled={saving}
                className="admin-btn admin-btn-primary"
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg"></i>
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}
