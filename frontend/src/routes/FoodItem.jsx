import  { useState, useEffect } from 'react';
import Swal from 'sweetalert2'

const OrderPage = () => {
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const [foodItems, setFoodItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        // Fetch movies from backend
        fetch('http://localhost:8000/api/movie')
            .then(res => res.json())
            .then(data => setMovies(data))
            .catch(error => console.error('Error fetching movies:', error));

        // Fetch food items from backend
        fetch('http://localhost:8000/api/adminfood/food-items')
            .then(res => res.json())
            .then(data => setFoodItems(data))
            .catch(error => console.error('Error fetching food items:', error));
    }, []);

    const handleMovieChange = (e) => {
        const movie = movies.find(m => m._id === e.target.value);
        setSelectedMovie(movie);
        setSelectedShowtime(null); // Reset showtime selection
    };

    const handleShowtimeChange = (e) => {
        const showtime = selectedMovie.showtimes.find(st => st._id === e.target.value);
        setSelectedShowtime(showtime);
    };

    const handleIncrease = (food) => {
        const existingItem = selectedItems.find(item => item.foodName === food.foodName && item.vendor === food.vendor);
        if (existingItem) {
            setSelectedItems(selectedItems.map(item =>
                item.foodName === food.foodName && item.vendor === food.vendor
                    ? { ...item, quantity: item.quantity + 1, price: (item.quantity + 1) * food.price }
                    : item
            ));
        } else {
            setSelectedItems([...selectedItems, { foodName: food.foodName, quantity: 1, price: food.price, vendor: food.vendor }]);
        }
    };

    const handleDecrease = (food) => {
        const existingItem = selectedItems.find(item => item.foodName === food.foodName && item.vendor === food.vendor);
        if (existingItem && existingItem.quantity > 1) {
            setSelectedItems(selectedItems.map(item =>
                item.foodName === food.foodName && item.vendor === food.vendor
                    ? { ...item, quantity: item.quantity - 1, price: (item.quantity - 1) * food.price }
                    : item
            ));
        } else {
            setSelectedItems(selectedItems.filter(item => !(item.foodName === food.foodName && item.vendor === food.vendor)));
        }
    };

    const handleSubmitOrder = async () => {
        if (!selectedMovie || !selectedShowtime) {
            Swal.fire({ title: 'Error', text: 'Please select a movie and showtime', icon: 'error' })
            return;
        }

        const totalPrice = selectedItems.reduce((total, item) => total + item.price, 0);
        const orderData = {
            movie: {
                movieId: selectedMovie._id,
                title: selectedMovie.title,
                showtimeId: selectedShowtime._id,
                showtimeDate: selectedShowtime.date
            },
            items: selectedItems,
            totalPrice
        };

        try {
            const response = await fetch('http://localhost:8000/api/food/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });
            console.log(orderData);
            if (response.ok) {
                Swal.fire({ title: 'Success', text: 'Order placed successfully', icon: 'success' })
                setSelectedItems([]);
                setSelectedMovie(null);
                setSelectedShowtime(null);
            } else {
                Swal.fire({ title: 'Error', text: 'Failed to place order', icon: 'error' })
            }
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    return (
        <div className="order-page">
            <h2 style={{fontSize:"28px",color:"red"}}>Order Food</h2>

            <h3>Select Movie</h3>
            <select onChange={handleMovieChange} value={selectedMovie?._id || ''}>
                <option value="" disabled>Select Movie</option>
                {movies.map(movie => (
                    <option key={movie._id} value={movie._id}>{movie.title}</option>
                ))}
            </select>

            {selectedMovie && (
                <>
                    <h3>Select Showtime</h3>
                    <select onChange={handleShowtimeChange} value={selectedShowtime?._id || ''}>
                        <option value="" disabled>Select Showtime</option>
                        {selectedMovie.showtimes.map(showtime => (
                            <option key={showtime._id} value={showtime._id}>
                                {new Date(showtime.date).toLocaleString()}
                            </option>
                        ))}
                    </select>
                </>
            )}

            <h3>Select Food</h3>
            <div className="food-list">
                {foodItems.map(food => (
                    <div key={food._id} className="food-item">
                        <img src={food.poster} alt={food.foodName} />
                        <h2 className='content'>{food.foodName}</h2>
                        <ul>
                            <p className='content' style={{marginLeft:"-70px",color:"green"}}>{food.description}</p>
                            <p className='content' style={{color:"black",marginLeft:"-70px"}}>Rs. {food.price}</p>
                            <p className='content' style={{marginLeft:"-70px"}}>Vendor - {food.vendor}</p>
                        </ul>
                        
                        <div>
                            <button onClick={() => handleDecrease(food)}>-</button>
                            <span>
                                {selectedItems.find(item => item.foodName === food.foodName && item.vendor === food.vendor)?.quantity || 0}
                            </span>
                            <button onClick={() => handleIncrease(food)}>+</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="order-summary">
                <h3>Order Summary</h3>
                <ul>
                    {selectedItems.map(item => (
                        <li key={`${item.foodName}-${item.vendor}`}>
                            {item.foodName} (Vendor: {item.vendor}) - {item.quantity} x Rs. {item.price / item.quantity} = Rs. {item.price}
                        </li>
                    ))}
                </ul>
                <p>Total Price: Rs. {selectedItems.reduce((total, item) => total + item.price, 0)}</p>
                <button onClick={handleSubmitOrder} style={{color:"red"}}>Place Order</button>
            </div>
        </div>
    );
};

export default OrderPage;
