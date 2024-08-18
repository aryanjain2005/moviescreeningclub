import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import './AdminFoodCorner.css';

const AdminFood = () => {
    const [foodItems, setFoodItems] = useState([]);
    const [foodName, setFoodName] = useState('');
    const [vendor, setVendor] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [poster, setPoster] = useState('');
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/api/adminfood/food-items')
            .then(res => res.json())
            .then(data => setFoodItems(data))
            .catch(error => console.error('Error fetching food items:', error));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newFoodItem = { foodName, vendor, price, description, poster };

        if (editingId) {
            // Update food item
            try {
                const response = await fetch(`http://localhost:8000/api/adminfood/food-items/${editingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newFoodItem)
                });
                if (response.ok) {
                    // alert('Food item updated successfully!');
                    Swal.fire({ title: 'Success', text: 'Food item updated successfully', icon: 'success' })
                    resetForm();
                    setEditingId(null);
                } else {
                    // alert('Failed to update food item');
                    Swal.fire({ title: 'Error', text: 'failed to update food item', icon: 'error' })
                }
            } catch (error) {
                console.error('Error updating food item:', error);
            }
        } else {
            // Add new food item
            try {
                const response = await fetch('http://localhost:8000/api/adminfood/food-items', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newFoodItem)
                });
                if (response.ok) {
                    // alert('Food item added successfully!');
                    Swal.fire({ title: 'Success', text: 'Food item added successfully', icon: 'success' })
                    resetForm();
                } else {
                    // alert('Failed to add food item');
                    Swal.fire({ title: 'Error', text: 'Failed to add food item', icon: 'error' })
                }
            } catch (error) {
                console.error('Error adding food item:', error);
            }
        }

        // Refresh the food items list
        fetch('http://localhost:8000/api/adminfood/food-items')
            .then(res => res.json())
            .then(data => setFoodItems(data))
            .catch(error => console.error('Error fetching food items:', error));
    };

    const resetForm = () => {
        setFoodName('');
        setVendor('');
        setPrice('');
        setDescription('');
        setPoster('');
    };

    const handleEdit = (item) => {
        setFoodName(item.foodName);
        setVendor(item.vendor);
        setPrice(item.price);
        setDescription(item.description);
        setPoster(item.poster);
        setEditingId(item._id);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/adminfood/food-items/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                // alert('Food item deleted successfully!');
                Swal.fire({ title: 'Success', text: 'Food item deleted successfully', icon: 'success' })
                setFoodItems(foodItems.filter(item => item._id !== id));
            } else {
                // alert('Failed to delete food item');
                Swal.fire({ title: 'Error', text: 'Failed to delete food item', icon: 'error' })
            }
        } catch (error) {
            console.error('Error deleting food item:', error);
        }
    };

    return (
        <div className="admin-food-container">
            <div className="add-food-form">
                <h2>{editingId ? 'Edit Food Item' : 'Add Food Item'}</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Food Name:</label>
                        <input
                            type="text"
                            value={foodName}
                            onChange={(e) => setFoodName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Vendor:</label>
                        <input
                            type="text"
                            value={vendor}
                            onChange={(e) => setVendor(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Price:</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Image URL:</label>
                        <input
                            type="text"
                            value={poster}
                            onChange={(e) => setPoster(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" style={{ backgroundColor: 'yellow',color:"red",fontWeight:"bold" }}>
                        {editingId ? 'Update Food Item' : 'Add Food Item'}
                    </button>
                </form>
            </div>
            <div className="food-list">
                <h3>Food Items List</h3>
                {foodItems.length > 0 ? (
                    <ul>
                        {foodItems.map(food => (
                            <li key={food._id} className="food-item">
                                <img src={food.poster} alt={food.foodName} />
                                <h4 style={{marginBottom:"auto",fontWeight:"bold"}}>{food.foodName}</h4>
                                <ul>
                                    <p style={{marginLeft:"-70px",color:"green"}}>{food.description}</p>
                                    <p style={{color:"black",marginLeft:"-70px"}}>Rs. {food.price}</p>
                                    <p style={{marginLeft:"-70px"}}>{food.vendor}</p>
                                </ul>
                                <div>
                                    <button onClick={() => handleEdit(food)}>Edit</button>
                                    <button onClick={() => handleDelete(food._id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No food items found.</p>
                )}
            </div>
        </div>
    );
};

export default AdminFood;
