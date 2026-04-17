import { useEffect, useState } from 'react'
import { userApi } from '../../api/userApi'

const ROLES = ['USER', 'ADMIN', 'TECHNICIAN']

export default function UserManagementPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    userApi.getAll()
      .then((res) => setUsers(res.data.data || []))
      .finally(() => setLoading(false))
  }, [])

  const changeRole = async (userId, role) => {
    setUpdating(userId)
    try {
      const res = await userApi.updateRole(userId, role)
      setUsers((prev) => prev.map((u) => u.id === userId ? res.data.data : u))
    } finally {
      setUpdating(null)
    }
  }

  const deactivate = async (userId) => {
    if (!window.confirm('Deactivate this user?')) return
    await userApi.deactivate(userId)
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, active: false } : u))
  }

  if (loading) return <div className="p-6 text-gray-500">Loading users...</div>

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">User Management</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className={!user.active ? 'opacity-50' : ''}>
                <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
                <td className="px-4 py-3 text-gray-600">{user.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={[...user.roles][0] ?? 'USER'}
                    disabled={updating === user.id || !user.active}
                    onChange={(e) => changeRole(user.id, e.target.value)}
                    className="border border-gray-200 rounded px-2 py-1 text-xs"
                  >
                    {ROLES.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {user.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {user.active && (
                    <button onClick={() => deactivate(user.id)}
                      className="text-xs text-red-500 hover:underline">
                      Deactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
