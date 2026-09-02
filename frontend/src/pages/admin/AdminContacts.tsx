import { useState, useEffect } from 'react'
import { adminApi } from '../../services/api'
import AdminLayout from '../../components/admin/AdminLayout'
import '../../styles/admin.css'

interface ContactSubmission {
  id: number
  name: string
  email: string
  subject: string
  message: string
  read: number
  created_at: string
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const response = await adminApi.contacts.getAll()
      setContacts(response.data)
    } catch (error) {
      console.error('Failed to fetch contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkRead = async (id: number) => {
    try {
      await adminApi.contacts.markRead(id)
      fetchContacts()
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this submission?')) return
    try {
      await adminApi.contacts.delete(id)
      setSelectedContact(null)
      fetchContacts()
    } catch (error) {
      console.error('Failed to delete:', error)
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

  return (
    <AdminLayout>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        {/* Contacts List */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
              Messages ({contacts.length})
            </h2>
          </div>
          <div className="contact-list">
            {contacts.length === 0 ? (
              <div className="empty-state">
                <i className="bi bi-envelope"></i>
                <h3>No messages</h3>
                <p>Contact submissions will appear here.</p>
              </div>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => {
                    setSelectedContact(contact)
                    if (!contact.read) handleMarkRead(contact.id)
                  }}
                  className={`contact-item ${
                    selectedContact?.id === contact.id ? 'active' : ''
                  } ${!contact.read ? 'unread' : ''}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div className="name">{contact.name}</div>
                      <div className="email">{contact.email}</div>
                    </div>
                    {!contact.read && (
                      <span className="badge badge-info">New</span>
                    )}
                  </div>
                  <div className="subject">
                    {contact.subject || 'No subject'}
                  </div>
                  <div className="date">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Contact Detail */}
        <div className="admin-card">
          <div className="admin-card-body">
            {selectedContact ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>{selectedContact.name}</h2>
                    <a
                      href={`mailto:${selectedContact.email}`}
                      style={{ color: 'var(--admin-primary)', textDecoration: 'none' }}
                    >
                      {selectedContact.email}
                    </a>
                  </div>
                  <button
                    onClick={() => handleDelete(selectedContact.id)}
                    className="admin-btn admin-btn-danger admin-btn-sm"
                  >
                    <i className="bi bi-trash"></i>
                    Delete
                  </button>
                </div>

                {selectedContact.subject && (
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontWeight: 500 }}>Subject:</span> {selectedContact.subject}
                  </div>
                )}

                <div style={{ marginBottom: '1rem', color: 'var(--admin-text-muted)' }}>
                  <i className="bi bi-clock"></i>{' '}
                  {new Date(selectedContact.created_at).toLocaleString()}
                </div>

                <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '1rem', marginTop: '1rem' }}>
                  <div style={{ fontWeight: 500, marginBottom: '0.75rem' }}>Message:</div>
                  <p style={{ margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {selectedContact.message}
                  </p>
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  <a
                    href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || 'Your message'}`}
                    className="admin-btn admin-btn-primary"
                  >
                    <i className="bi bi-reply"></i>
                    Reply via Email
                  </a>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <i className="bi bi-envelope"></i>
                <h3>Select a message</h3>
                <p>Choose a message from the list to view details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
