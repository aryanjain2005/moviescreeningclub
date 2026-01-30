import { api } from '@/utils/api'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ManageUsers = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [userDetails, setUserDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    newEmail: '',
    designation: '',
    usertype: ''
  })
  const [allUsers, setAllUsers] = useState([])
  const [editingMembership, setEditingMembership] = useState(null)
  const [editingQR, setEditingQR] = useState(null)
  const [membershipForm, setMembershipForm] = useState({
    isValid: false,
    amount: 0,
    availQR: 0
  })
  const [qrForm, setQRForm] = useState({
    isValid: false,
    used: false,
    deleted: false
  })

  useEffect(() => {
    fetchAllUsers()
  }, [])

  const fetchAllUsers = async () => {
    try {
      const response = await api.get('/user/fetchusers')
      setAllUsers(response.data.users)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const query = searchQuery.toLowerCase()
    const results = allUsers.filter(
      (user) =>
        user.email.toLowerCase().includes(query) ||
        user.name.toLowerCase().includes(query) ||
        user.phone.includes(query)
    )
    setSearchResults(results)
  }

  const fetchUserDetails = async (email) => {
    setLoading(true)
    try {
      const response = await api.get(
        `/user/details/${encodeURIComponent(email)}`
      )
      setUserDetails(response.data)
      setSelectedUser(email)
      setEditForm({
        name: response.data.user.name,
        phone: response.data.user.phone,
        newEmail: response.data.user.email,
        designation: response.data.user.designation,
        usertype: response.data.user.usertype
      })
    } catch (error) {
      console.error('Error fetching user details:', error)
      alert('Failed to fetch user details')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUser = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.put(
        `/user/details/${encodeURIComponent(selectedUser)}`,
        editForm
      )
      alert('User details updated successfully!')
      setEditing(false)
      // Refresh user details
      await fetchUserDetails(response.data.user.email)
      await fetchAllUsers()
    } catch (error) {
      console.error('Error updating user:', error)
      alert(error.response?.data?.error || 'Failed to update user details')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    const parsedDate = new Date(date)
    if (isNaN(parsedDate.getTime())) return 'N/A'
    return parsedDate.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleUpdateMembership = async (membershipId) => {
    setLoading(true)
    try {
      await api.put(`/user/membership/${membershipId}`, membershipForm)
      alert('Membership updated successfully!')
      setEditingMembership(null)
      await fetchUserDetails(selectedUser)
    } catch (error) {
      console.error('Error updating membership:', error)
      alert('Failed to update membership')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateQR = async (qrId) => {
    setLoading(true)
    try {
      await api.put(`/user/qr/${qrId}`, qrForm)
      alert('QR code updated successfully!')
      setEditingQR(null)
      await fetchUserDetails(selectedUser)
    } catch (error) {
      console.error('Error updating QR code:', error)
      alert('Failed to update QR code')
    } finally {
      setLoading(false)
    }
  }

  const openEditMembership = (membership) => {
    setEditingMembership(membership._id)
    setMembershipForm({
      isValid: membership.isValid,
      amount: membership.amount,
      availQR: membership.availQR || 0
    })
  }

  const openEditQR = (qr) => {
    setEditingQR(qr._id)
    setQRForm({
      isValid: qr.isValid,
      used: qr.used,
      deleted: qr.deleted
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            User Management
          </h1>
          <p className="text-gray-600">Search and manage user information</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search by email, name, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <h3 className="font-semibold mb-3">Search Results:</h3>
              <div className="space-y-2">
                {searchResults.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => fetchUserDetails(user.email)}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{user.phone}</p>
                        <p className="text-xs text-gray-500">{user.usertype}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Details Section */}
        {loading && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        )}

        {!loading && userDetails && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
              <button
                onClick={() => setEditing(!editing)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editing ? 'Cancel Edit' : 'Edit User'}
              </button>
            </div>

            {/* Edit Form */}
            {editing ? (
              <form onSubmit={handleUpdateUser} className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editForm.newEmail}
                      onChange={(e) =>
                        setEditForm({ ...editForm, newEmail: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Designation
                    </label>
                    <select
                      value={editForm.designation}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          designation: e.target.value
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="btech">B.Tech</option>
                      <option value="mtech/phd">M.Tech/PhD</option>
                      <option value="faculty/staff">Faculty/Staff</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User Type
                    </label>
                    <select
                      value={editForm.usertype}
                      onChange={(e) =>
                        setEditForm({ ...editForm, usertype: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="standard">Standard</option>
                      <option value="ticketvolunteer">Ticket Volunteer</option>
                      <option value="movievolunteer">Movie Volunteer</option>
                      <option value="volunteer">Volunteer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              /* User Info Display */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{userDetails.user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{userDetails.user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{userDetails.user.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Designation</p>
                  <p className="font-medium capitalize">
                    {userDetails.user.designation}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">User Type</p>
                  <p className="font-medium capitalize">
                    {userDetails.user.usertype}
                  </p>
                </div>
              </div>
            )}

            {/* Memberships Section */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Memberships ({userDetails.memberships.length})
              </h3>
              {userDetails.memberships.length > 0 ? (
                <div className="space-y-3">
                  {userDetails.memberships.map((membership) => (
                    <div
                      key={membership._id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      {editingMembership === membership._id ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Amount (₹)
                              </label>
                              <input
                                type="number"
                                value={membershipForm.amount}
                                onChange={(e) =>
                                  setMembershipForm({
                                    ...membershipForm,
                                    amount: parseFloat(e.target.value)
                                  })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Available QR
                              </label>
                              <input
                                type="number"
                                value={membershipForm.availQR}
                                onChange={(e) =>
                                  setMembershipForm({
                                    ...membershipForm,
                                    availQR: parseInt(e.target.value)
                                  })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                              </label>
                              <select
                                value={
                                  membershipForm.isValid ? 'Valid' : 'Expired'
                                }
                                onChange={(e) =>
                                  setMembershipForm({
                                    ...membershipForm,
                                    isValid: e.target.value === 'Valid'
                                  })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="Valid">Valid</option>
                                <option value="Expired">Expired</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleUpdateMembership(membership._id)
                              }
                              disabled={loading}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingMembership(null)}
                              className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div>
                              <p className="text-sm text-gray-600">Type</p>
                              <p className="font-medium capitalize">
                                {membership.memtype}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Amount</p>
                              <p className="font-medium">
                                ₹{membership.amount}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Status</p>
                              <p
                                className={`font-medium ${
                                  membership.isValid
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                }`}
                              >
                                {membership.isValid ? 'Valid' : 'Expired'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Purchase Date
                              </p>
                              <p className="font-medium text-sm">
                                {formatDate(membership.purchasedate)}
                              </p>
                            </div>
                            {membership.availQR !== undefined && (
                              <div>
                                <p className="text-sm text-gray-600">
                                  Available QR
                                </p>
                                <p className="font-medium">
                                  {membership.availQR}
                                </p>
                              </div>
                            )}
                            <div>
                              <p className="text-sm text-gray-600">
                                Transaction ID
                              </p>
                              <p className="font-medium text-sm">
                                {membership.txnId}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => openEditMembership(membership)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            Edit
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No memberships found</p>
              )}
            </div>

            {/* QR Codes Section */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                QR Codes ({userDetails.qrCodes.length})
              </h3>
              {userDetails.qrCodes.length > 0 ? (
                <div className="space-y-3">
                  {userDetails.qrCodes.map((qr) => (
                    <div
                      key={qr._id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      {editingQR === qr._id ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={qrForm.isValid}
                                  onChange={(e) =>
                                    setQRForm({
                                      ...qrForm,
                                      isValid: e.target.checked
                                    })
                                  }
                                  className="w-4 h-4"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                  Is Valid
                                </span>
                              </label>
                            </div>
                            <div>
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={qrForm.used}
                                  onChange={(e) =>
                                    setQRForm({
                                      ...qrForm,
                                      used: e.target.checked
                                    })
                                  }
                                  className="w-4 h-4"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                  Used
                                </span>
                              </label>
                            </div>
                            <div>
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={qrForm.deleted}
                                  onChange={(e) =>
                                    setQRForm({
                                      ...qrForm,
                                      deleted: e.target.checked
                                    })
                                  }
                                  className="w-4 h-4"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                  Deleted
                                </span>
                              </label>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateQR(qr._id)}
                              disabled={loading}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingQR(null)}
                              className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="mb-3 pb-3 border-b border-gray-200">
                            <p className="text-sm text-gray-600">QR Code</p>
                            <p className="font-mono text-xs break-all bg-gray-100 p-2 rounded mt-1">
                              {qr.code ? qr.code : 'N/A'}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
                            <div>
                              <p className="text-sm text-gray-600">QR ID</p>
                              <p className="font-medium text-sm">{qr._id}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Seat</p>
                              <p className="font-medium">{qr.seat || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Transaction ID
                              </p>
                              <p className="font-medium text-sm">
                                {qr.txnId || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Used</p>
                              <p
                                className={`font-medium ${
                                  qr.used ? 'text-red-600' : 'text-green-600'
                                }`}
                              >
                                {qr.used ? 'Yes' : 'No'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Valid</p>
                              <p
                                className={`font-medium ${
                                  qr.isValid ? 'text-green-600' : 'text-red-600'
                                }`}
                              >
                                {qr.isValid ? 'Yes' : 'No'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Free</p>
                              <p className="font-medium">
                                {qr.free ? 'Yes' : 'No'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Registration Date
                              </p>
                              <p className="font-medium text-sm">
                                {formatDate(qr.registrationDate)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Expiration Date
                              </p>
                              <p className="font-medium text-sm">
                                {formatDate(qr.expirationDate)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Deleted</p>
                              <p className="font-medium">
                                {qr.deleted ? 'Yes' : 'No'}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => openEditQR(qr)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            Edit
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No QR codes found</p>
              )}
            </div>

            {/* Food Orders Section */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Food Orders ({userDetails.orders.length})
              </h3>
              {userDetails.orders.length > 0 ? (
                <div className="space-y-3">
                  {userDetails.orders.map((order) => (
                    <div
                      key={order._id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">Order ID</p>
                          <p className="font-medium text-sm">{order._id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Amount</p>
                          <p className="font-medium">₹{order.totalAmount}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          <p className="font-medium capitalize">
                            {order.status}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Date</p>
                          <p className="font-medium text-sm">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      {order.items && order.items.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-sm text-gray-600 mb-2">Items:</p>
                          <div className="space-y-1">
                            {order.items.map((item, idx) => (
                              <p key={idx} className="text-sm">
                                {item.item?.name || 'Unknown'} x {item.quantity}{' '}
                                - ₹{item.price}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No food orders found</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageUsers
