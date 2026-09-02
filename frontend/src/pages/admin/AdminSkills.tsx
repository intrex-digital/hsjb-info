import { useState, useEffect } from 'react'
import { adminApi } from '../../services/api'
import AdminLayout from '../../components/admin/AdminLayout'
import '../../styles/admin.css'
import type { Skill } from '../../types'

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    percentage: 80,
    category: '',
    display_order: 0,
  })

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const response = await adminApi.skills.getAll()
      setSkills(response.data)
    } catch (error) {
      console.error('Failed to fetch skills:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await adminApi.skills.update(editingId, formData)
      } else {
        await adminApi.skills.create(formData)
      }
      setFormData({ name: '', percentage: 80, category: '', display_order: 0 })
      setEditingId(null)
      fetchSkills()
    } catch (error) {
      console.error('Failed to save skill:', error)
    }
  }

  const handleEdit = (skill: Skill) => {
    setEditingId(skill.id)
    setFormData({
      name: skill.name,
      percentage: skill.percentage,
      category: skill.category || '',
      display_order: skill.display_order,
    })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this skill?')) return
    try {
      await adminApi.skills.delete(id)
      fetchSkills()
    } catch (error) {
      console.error('Failed to delete skill:', error)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({ name: '', percentage: 80, category: '', display_order: 0 })
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

  return (
    <AdminLayout>
      {/* Add/Edit Form */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-card-header">
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
            {editingId ? 'Edit Skill' : 'Add New Skill'}
          </h2>
        </div>
        <div className="admin-card-body">
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="admin-form-input"
                  placeholder="e.g., Python"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Percentage *</label>
                <input
                  type="number"
                  name="percentage"
                  value={formData.percentage}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="admin-form-input"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="admin-form-input"
                  placeholder="e.g., Backend"
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
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="submit" className="admin-btn admin-btn-primary">
                <i className={`bi ${editingId ? 'bi-check-lg' : 'bi-plus-lg'}`}></i>
                {editingId ? 'Update' : 'Add'} Skill
              </button>
              {editingId && (
                <button type="button" onClick={handleCancel} className="admin-btn admin-btn-secondary">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Skills List */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>All Skills ({skills.length})</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Name</th>
                <th>Progress</th>
                <th>Category</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <i className="bi bi-gear"></i>
                      <h3>No skills yet</h3>
                      <p>Add your first skill to get started.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                skills.map((skill) => (
                  <tr key={skill.id}>
                    <td style={{ color: 'var(--admin-text-muted)' }}>{skill.display_order}</td>
                    <td style={{ fontWeight: 500 }}>{skill.name}</td>
                    <td>
                      <div className="progress-wrapper">
                        <div className="progress-bar">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${skill.percentage}%` }}
                          ></div>
                        </div>
                        <span className="progress-text">{skill.percentage}%</span>
                      </div>
                    </td>
                    <td>
                      {skill.category ? (
                        <span className="badge badge-primary">{skill.category}</span>
                      ) : (
                        <span style={{ color: 'var(--admin-text-muted)' }}>-</span>
                      )}
                    </td>
                    <td>
                      <div className="action-btns" style={{ justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleEdit(skill)}
                          className="action-btn edit"
                          title="Edit"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
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
