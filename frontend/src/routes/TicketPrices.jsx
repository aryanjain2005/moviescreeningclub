import { api } from '@/utils/api'
import { useEffect, useState } from 'react'

const TicketPrices = () => {
  const [prices, setPrices] = useState([])
  const [editing, setEditing] = useState(null)
  const [editedData, setEditedData] = useState({})

  useEffect(() => {
    fetchPrices()
  }, [])

  const fetchPrices = async () => {
    try {
      const response = await api.get('/membership/getprices')
      setPrices(response.data)
    } catch (error) {
      console.error('Error fetching ticket prices:', error)
    }
  }

  const handleEdit = (membership, type, price) => {
    setEditing({ membership, type })
    setEditedData({ price })
  }

  const handleSave = async () => {
    try {
      const updatedPrices = prices.map(membership => {
        if (membership.name === editing.membership) {
          return {
            ...membership,
            price: membership.price.map(p =>
              p.type === editing.type ? { ...p, price: editedData.price } : p
            )
          }
        }
        return membership
      })

      setPrices(updatedPrices)
      setEditing(null)
      setEditedData({})

      await api.post(`/membership/getprices`, {
        name: editing.membership,
        price: updatedPrices.find(m => m.name === editing.membership).price,
        validity: updatedPrices.find(m => m.name === editing.membership).validity,
        availQR: updatedPrices.find(m => m.name === editing.membership).availQR,
      })      
    } catch (error) {
      console.error('Error updating ticket price:', error)
    }
  }

  const handleChange = (e) => {
    setEditedData({ ...editedData, price: e.target.value })
  }

  return (
    <div className="w-full min-h-screen p-6 flex flex-col items-center font-monts">
      <p className="text-4xl font-extrabold text-white-800 mb-6">Ticket Prices</p>
      <div className="w-full max-w-5xl overflow-x-auto shadow-lg rounded-lg p-4">
        <table className="w-full border-collapse table-fixed">
          <thead className="text-white-800">
            <tr>
              <th className="border px-4 py-3 w-1/4">Membership</th>
              <th className="border px-4 py-3 w-1/4">Category</th>
              <th className="border px-4 py-3 w-1/4">Price</th>
              <th className="border px-4 py-3 w-1/4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((membership) => (
              membership.price.map((p, index) => (
                <tr key={`${membership.name}-${p.type}`} className="">
                  {index === 0 && (
                    <td rowSpan={membership.price.length} className="border px-4 py-3 font-bold text-center align-middle">{membership.name}</td>
                  )}
                  <td className="border px-4 py-3 text-center">{p.type}</td>
                  <td className="border px-4 py-3 text-center">
                    {editing?.membership === membership.name && editing?.type === p.type ? (
                      <input
                        type="number"
                        value={editedData.price}
                        onChange={handleChange}
                        className="text-center border-b focus:outline-none focus:border-black"
                      />
                    ) : (
                      `₹${p.price}`
                    )}
                  </td>
                  <td className="border px-4 py-3 text-center">
                    {editing?.membership === membership.name && editing?.type === p.type ? (
                      <button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">Save</button>
                    ) : (
                      <button onClick={() => handleEdit(membership.name, p.type, p.price)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">Edit</button>
                    )}
                  </td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TicketPrices
