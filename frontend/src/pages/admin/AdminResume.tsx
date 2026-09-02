import { useState, useEffect } from 'react'
import { adminApi } from '../../services/api'
import AdminLayout from '../../components/admin/AdminLayout'
import '../../styles/admin.css'
import type { ResumeEntry } from '../../types'

export default function AdminResume() {
  const [entries, setEntries] = useState<ResumeEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('experience')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    type: 'experience',
    title: '',
    organization: '',
    date_range: '',
    description: '',
    display_order: 0,
  })

  const tabs = [
    { id: 'experience', label: 'Experience', icon: 'bi-briefcase' },
    { id: 'education', label: 'Education', icon: 'bi-mortarboard' },
    { id: 'certification', label: 'Certifications', icon: 'bi-award' },
    { id: 'training', label: 'Training', icon: 'bi-book' },
  ]

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    try {
      const response = await adminApi.resume.getAll()
      setEntries(response.data)
    } catch (error) {
      console.error('Failed to fetch entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const submitData = {
        ...formData,
        type: formData.type as 'experience' | 'education' | 'certification' | 'training',
      }
      if (editingId) {
        await adminApi.resume.update(editingId, submitData)
      } else {
        await adminApi.resume.create(submitData)
      }
      resetForm()
      fetchEntries()
    } catch (error) {
      console.error('Failed to save entry:', error)
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      type: activeTab,
      title: '',
      organization: '',
      date_range: '',
      description: '',
      display_order: 0,
    })
  }

  const handleEdit = (entry: ResumeEntry) => {
    setEditingId(entry.id)
    setActiveTab(entry.type)
    setFormData({
      type: entry.type,
      title: entry.title,
      organization: entry.organization || '',
      date_range: entry.date_range || '',
      description: entry.description || '',
      display_order: entry.display_order,
    })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this entry?')) return
    try {
      await adminApi.resume.delete(id)
      fetchEntries()
    } catch (error) {
      console.error('Failed to delete entry:', error)
    }
  }

  const filteredEntries = entries.filter((e) => e.type === activeTab)

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

  return (
    <AdminLayout>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id)
              setFormData((prev) => ({ ...prev, type: tab.id }))
            }}
            className={`admin-btn ${activeTab === tab.id ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
          >
            <i className={`bi ${tab.icon}`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Add/Edit Form */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-card-header">
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
            {editingId ? 'Edit Entry' : `Add New ${tabs.find((t) => t.id === activeTab)?.label} Entry`}
          </h2>
        </div>
        <div className="admin-card-body">
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="admin-form-input"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Organization</label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  className="admin-form-input"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Date Range</label>
                <input
                  type="text"
                  name="date_range"
                  value={formData.date_range}
                  onChange={handleChange}
                  placeholder="e.g., 2022 - Present"
                  className="admin-form-input"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Display Order</label>
                <input
                  type="number"
                  name="display_order"
                  value={formData.display_order}
                  onChange={handleChange}
                  className="admin-form-input"
                />
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Description (HTML)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="admin-form-textarea"
                style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="submit" className="admin-btn admin-btn-primary">
                <i className={`bi ${editingId ? 'bi-check-lg' : 'bi-plus-lg'}`}></i>
                {editingId ? 'Update' : 'Add'} Entry
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="admin-btn admin-btn-secondary">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Entries List */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
            {tabs.find((t) => t.id === activeTab)?.label} Entries ({filteredEntries.length})
          </h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Title</th>
                <th>Organization</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <i className="bi bi-file-earmark-text"></i>
                      <h3>No entries yet</h3>
                      <p>Add your first entry to get started.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td style={{ color: 'var(--admin-text-muted)' }}>{entry.display_order}</td>
                    <td style={{ fontWeight: 500 }}>{entry.title}</td>
                    <td>{entry.organization || '-'}</td>
                    <td style={{ color: 'var(--admin-text-muted)' }}>{entry.date_range || '-'}</td>
                    <td>
                      <div className="action-btns" style={{ justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleEdit(entry)}
                          className="action-btn edit"
                          title="Edit"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="action-btn delete"
                          title="Delete"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
