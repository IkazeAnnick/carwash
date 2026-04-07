import { useEffect, useState } from 'react'
import './App.css'

const API_URL = 'http://localhost:4000'
// PlateNumber,CarType, CarSize,DriverName,PhoneNumber 

const initialForm = {
  PlateNumber: '',
  CarType: '',
  CarSize: '',
  DriverName: '',
  PhoneNumber: '',
}

function getRecordId(record) {
  return record?.PlateNumber ?? null
}

function normalizeRecords(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload?.data)) {
    return payload.data
  }

  if (Array.isArray(payload?.users)) {
    return payload.users
  }

  return []
}

function App() {
  const [form, setForm] = useState(initialForm)
  const [users, setUsers] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  async function fetchUsers() {
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/car`)

      if (!response.ok) {
        throw new Error('Failed to load records from the endpoint.')
      }

      const data = await response.json()
      setUsers(normalizeRecords(data))
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to load ucars.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  function resetForm() {
    setForm(initialForm)
    setEditingId(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccessMessage('')
    setIsSubmitting(true)

    const method = editingId ? 'PUT' : 'POST'
    const targetUrl = editingId ? `${API_URL}/car/${editingId}` : `${API_URL}/car`

    try {
      const response = await fetch(targetUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${editingId ? 'update' : 'create'} record.`)
      }

      await response.json().catch(() => null)

      setSuccessMessage(
        editingId ? 'Record updated successfully.' : 'Record created successfully.',
      )
      
      resetForm()
      await fetchUsers()
    } catch (submitError) {
      setError(submitError.message || 'Unable to submit the form.')
    } finally {
      setIsSubmitting(false)
    }
  }
  // PlateNumber,CarType, CarSize,DriverName,PhoneNumber 

  function handleEdit(user) {
    setEditingId(getRecordId(user))
    setForm({
      PlateNumber: user.PlateNumber ?? '',
      CarType: user.CarType ?? '',
      CarSize: String(user.CarSize ?? ''),
      DriverName: user.DriverName ?? '',
      PhoneNumber: user.PhoneNumber  ?? '',
    })
    setError('')
    setSuccessMessage('')
  }

  async function handleDelete(user) {
    const id = getRecordId(user)

    if (!id) {
      setError('This record cannot be deleted because it has no id.')
      return
    }

    setError('')
    setSuccessMessage('')

    try {
      const response = await fetch(`${API_URL}/car/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete record.')
      }

      setSuccessMessage('Record deleted successfully.')

      if (editingId === id) {
        resetForm()
      }

      await fetchUsers()
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete this record.')
    }
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">SOS Material Frontend</p>
          <h1>Car wash Manager</h1>
          <p className="hero-copy">
            Create, retrieve, update, and delete car records from your backend
            endpoint.
          </p>
        </div>
        <button className="secondary-button" type="button" onClick={fetchUsers}>
          Refresh Data
        </button>
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">{editingId ? 'Update mode' : 'New record'}</p>
              <h2>{editingId ? 'Edit Car' : 'Add Car'}</h2>
            </div>
          </div>

          <form className="student-form" onSubmit={handleSubmit}>
            <label>
              <span>PlateNumber</span>
              <input
                name="PlateNumber"
                type="text"
                value={form.PlateNumber}
                onChange={handleChange}
                disabled={editingId !== null}
                placeholder="Enter PlateNumber"
                required
              />
            </label>

            <label>
              <span>CarType</span>
              <input
                name="CarType"
                type="text"
                value={form.CarType}
                onChange={handleChange}
                placeholder="Enter CarType"
                required
              />
            </label>

            <label>
              <span>CarSize</span>
              <input
                name="CarSize"
                type="text"
                min="1"
                value={form.CarSize}
                onChange={handleChange}
                placeholder="Enter CarSize"
                required
              />
            </label>

            <label>
              <span>DriverName</span>
              <input
                name="DriverName"
                type="text"
                value={form.DriverName}
                onChange={handleChange}
                placeholder="Enter DriverName"
                required
              />
            </label>
            <label>
              <span>PhoneNumber</span>
              <input
                name="PhoneNumber"
                type="number"
                value={form.PhoneNumber}
                onChange={handleChange}
                placeholder="Enter PhoneNumber"
                required
              />
            </label>

            <div className="form-actions">
              <button className="primary-button" type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? 'Saving...'
                  : editingId
                    ? 'Update Record'
                    : 'Create Record'}
              </button>

              {editingId ? (
                <button
                  className="ghost-button"
                  type="button"
                  onClick={resetForm}
                  disabled={isSubmitting}
                >
                  Cancel Edit
                </button>
              ) : null}
            </div>
          </form>

          {error ? <p className="status-message error">{error}</p> : null}
          {successMessage ? <p className="status-message success">{successMessage}</p> : null}
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Endpoint records</p>
              <h2>Stored Cars</h2>
            </div>
            <span className="count-badge">{users.length}</span>
          </div>

          {isLoading ? <p className="empty-state">Loading records...</p> : null}

          {!isLoading && !users.length ? (
            <p className="empty-state">
              No records were returned from <code>{API_URL}</code>.
            </p>
          ) : null}

          {!isLoading && users.length ? (
            <div className="records-list">
              {users.map((user, index) => {
                const id = getRecordId(user)
{/* PlateNumber,CarType, CarSize,DriverName,PhoneNumber */}
                return (
                  <div className="record-card" key={id ?? `${user.username}-${index}`}>
                    <div className="record-main">
                      <h3>{user.PlateNumber || 'Unnamed car'}</h3>
                      <p>@{user.CarType || 'unknown-user'}</p>
                    </div>

                    <dl className="record-meta">
                      <div>
                        <dt>CarSize</dt>
                        <dd>{user.CarSize ?? 'N/A'}</dd>
                      </div>
                      <div>
                        <dt>DriverName</dt>
                        <dd>{user.DriverName ?? 'N/A'}</dd>
                      </div>
                      <div>
                        <dt>PhoneNumber</dt>
                        <dd>{user.PhoneNumber ?? 'N/A'}</dd>
                      </div>
                      <div>
                        <dt>Id</dt>
                        <dd>{id ?? 'Missing id'}</dd>
                      </div>
                    </dl>

                    <div className="record-actions">
                      <button className="secondary-button" type="button" onClick={() => handleEdit(user)}>
                        Edit
                      </button>
                      <button className="danger-button" type="button" onClick={() => handleDelete(user)}>
                        Delete
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : null}
        </article>
      </section>
    </main>
  )
}

export default App