import  { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SERVERIP } from "../config";
const MovieForm = () => {
  const [formData, setFormData] = useState({
    //id: '',
    title: "",
    poster: "",
    description: "",
    releaseDate: "",
    genre: "",
    currentscreening: true, // Default value
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Check userType in local storage on component mount
    const userType = localStorage.getItem("userType");
    if (
      !userType ||
      userType === "standard" ||
      userType === "ticketvolunteer"
    ) {
      // If userType is not found or is "standard", redirect to the home page
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    if (e.target.name === "currentscreening") {
      // Handle dropdown menu change separately
      setFormData({
        ...formData,
        [e.target.name]: e.target.value === "Ongoing",
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${SERVERIP}/movie/add-movies`, formData)
      .then((res) => {
        setFormData({
          title: "",
          poster: "",
          description: "",
          releaseDate: "",
          genre: "",
          currentscreening: true, // Reset to default value
        });
      })
      .catch((err) => console.error(err));
    navigate("/home");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#e5e8f0] font-monts">
      <div className="flex flex-col items-center flex-wrap w-[80%] md:h-[90%] sm:h-[90%] max-sm:h-[90%] max-sm:w-[95%] bg-white rounded-3xl shadow-lg overflow-auto">
        <div className="flex items-center text-2xl font-bold h-[10%]">
          <h2>Add a New Movie</h2>
        </div>
        <div className="flex w-full justify-center overflow-auto h-[90%]">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center w-2/3 max-sm:w-[90%]"
          >
            <div className="flex flex-col w-[80%] max-sm:w-full gap-3 h-full">
              <div className="flex justify-center text-center text-xl font-semibold mt-4">
                Enter Movie Information
              </div>
              <div className="flex h-[30%] items-center justify-between text-lg ">
                <label htmlFor="title" className="form-label">
                  Title:
                </label>
                <input
                  type="text"
                  className="border w-3/4 text-center"
                  placeholder="enter movie title"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex h-[30%] items-center justify-between  text-lg ">
                <label htmlFor="poster" className="form-label">
                  Poster URL:
                </label>
                <input
                  type="text"
                  className="border text-center w-3/4"
                  placeholder="enter poster url"
                  id="poster"
                  name="poster"
                  value={formData.poster}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex h-[30%] items-center justify-between  text-lg ">
                <label htmlFor="description" className="form-label">
                  Description:
                </label>
                <textarea
                  id="description"
                  className="border w-3/4 text-center"
                  placeholder="enter movie description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex h-[30%] items-center justify-between  text-lg ">
                <label htmlFor="releaseDate">Release Date:</label>
                <input
                  type="date"
                  className="border w-3/4"
                  id="releaseDate"
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex h-[30%] items-center justify-between  text-lg ">
                <label htmlFor="genre" className="form-label">
                  Genre:
                </label>
                <input
                  type="text"
                  className="border w-3/4 text-center"
                  placeholder="enter movie genre"
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex h-[30%] items-center justify-between text-lg">
                <label htmlFor="currentscreening" className="form-label">
                  Current Screening:
                </label>
                <select
                  id="currentscreening"
                  className="border w-3/4"
                  name="currentscreening"
                  value={formData.currentscreening ? "Ongoing" : "Upcoming"}
                  onChange={handleChange}
                  required
                >
                  <option value="Ongoing">Ongoing</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
              </div>
            </div>

            <button type="submit" className="bg-success h-[10%] w-[50%] my-4">
              Add Movie
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MovieForm;
