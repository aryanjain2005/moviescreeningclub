import { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../utils/getToken";
import { Link, useNavigate } from "react-router-dom";
import { SERVERIP } from "../config";
import bg from '../images/bg.png'

const Home = () => {
  const token = getToken();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [showMoreUpcoming, setShowMoreUpcoming] = useState(false);
  const [showMoreOngoing, setShowMoreOngoing] = useState(false);

  useEffect(() => {
    axios
      .get(`${SERVERIP}/movie/movies`)
      .then((response) => {
        setMovies(response.data);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
      });
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  });

  const ongoingMovies = showMoreOngoing
    ? movies.filter((movie) => movie.currentscreening)
    : movies.filter((movie) => movie.currentscreening).slice(0, 4);

  const upcomingMovies = showMoreUpcoming
    ? movies.filter((movie) => !movie.currentscreening)
    : movies.filter((movie) => !movie.currentscreening).slice(0, 4);

  const toggleShowMoreUpcoming = () => {
    setShowMoreUpcoming(!showMoreUpcoming);
  };

  const toggleShowMoreOngoing = () => {
    setShowMoreOngoing(!showMoreOngoing);
  };

  // Function to encode the poster URL as a string
  const encodePosterUrl = (url) => {
    return encodeURIComponent(url);
  };

  return (
    <div>
      <div className="bg-gray-200 flex flex-col items-center font-monts" style={{backgroundColor:"#0C0C0C"}}>
      <div className="flex justify-center ">
          <img src={bg} alt="not found" style={{marginTop:"-160px"}}/>

          <div className="text-block" 
          style={{position:"absolute",
                  bottom:"450px",
                  color:"white",
                  marginBottom:"-130px",
                  marginLeft:"-680px",
                  fontSize:"2.5rem",
                  fontStyle:"italic"
          }}>
            <h1>Welcome to 
              <br />
              IIT Mandi’s 
              <br />
              Film Screening Cell</h1>
          </div>  
        </div>

        <div className="popcorn popcorn-1"></div>
        <div className="popcorn popcorn-2"></div>
        <div className="popcorn popcorn-3"></div>
        <div className="popcorn popcorn-4"></div>
        <div className="popcorn popcorn-5"></div>
        <div className="popcorn popcorn-6"></div>
        <div className="popcorn popcorn-7"></div>

        <div>
              <h2 className="text-xl font-semibold" style={{color:"#E40C2B",fontFamily:'Bebas Neue',marginRight:'900px',marginBottom:'-30px',marginTop:'20px',fontSize:'35px'}}>ONGOING MOVIES</h2>
        </div>
        <div className="flex flex-col items-between justify-center bg-black h-1/2 w-4/5 max-sm:w-[95%] my-10 rounded-xl shadow-lg">
          <div className="flex justify-between my-3 mx-5 max-sm:mx-2" style={{backgroundColor:'#212121'}}>
            {/* <div>
              <h2 className="text-xl font-semibold" style={{color:"#E40C2B",fontFamily:'Bebas Neue'}}>ONGOING MOVIES</h2>
            </div> */}
            {ongoingMovies.length > 4 && (
            <div className="flex justify-end">
              <p
                className="font-inter text-sm cursor-pointer"
                onClick={toggleShowMoreOngoing}
              >
                {showMoreOngoing ? "Show Less" : "Show More"}
              </p>
            </div>)}
          </div>
          <div className="grid gap-6 max-sm:gap-2 mb-8 max-sm:mb-4 max-sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mx-5 max-sm:mx-2">
            {ongoingMovies.map((movie) => (
              <Link
                to={`/showtime?movieId=${movie._id}&poster=${encodeURIComponent(movie.poster)}`}
                key={movie._id}
                className="flex items-center justify-center"
              >
                <div className="w-full h-full object-cover">
                  <div className="w-full h-4/5 max-sm:h-2/3">
                    <img
                      className="object-cover w-full h-full rounded-md"
                      src={movie.poster}
                      alt={movie.title}
                    />
                  </div>
                  <div className="flex flex-col mt-1">
                    <p className="font-semibold text-2xl max-sm:text-lg">
                      {movie.title}
                    </p>
                    <p className="max-sm:text-sm">{movie.genre}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold" style={{color:"#E40C2B",fontFamily:'Bebas Neue',marginRight:'885px',marginBottom:'-30px',marginTop:'20px',fontSize:'35px'}}>UPCOMING MOVIES</h2>
        </div>
        {upcomingMovies.length > 0 && (
          <div className="flex flex-col bg-black h-1/2 w-4/5 max-sm:w-[95%] my-10 rounded-xl shadow-lg">
            <div className="flex justify-between my-3 mx-5 max-sm:mx-2">
              {/* <div>
                <h2 className="text-xl font-semibold" style={{color:"#E40C2B",fontFamily:'Bebas Neue',marginRight:'900px',marginBottom:'-30px',marginTop:'20px',fontSize:'35px'}}>UPCOMING MOVIES</h2>
              </div> */}
              <div className="flex justify-end">
                <p
                  className="font-inter text-sm cursor-pointer"
                  onClick={toggleShowMoreUpcoming}
                  style={{color:"white"}}
                >
                  {showMoreUpcoming ? "Show Less" : "Show More"}
                </p>
              </div>
            </div>
            <div className="grid gap-6 max-sm:gap-2 mb-8 max-sm:mb-4 max-sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mx-5 max-sm:mx-2">
              {upcomingMovies.map((movie) => (
                <Link
                  to={`/showtime/${movie._id}/${encodePosterUrl(movie.poster)}`}
                  key={movie._id}
                  className="flex items-center justify-center"
                >
                  <div className="w-full h-full object-cover">
                    <div className="w-full h-4/5 max-sm:h-2/3">
                      <img
                        className="object-cover w-full h-full rounded-md"
                        src={movie.poster}
                        alt={movie.title}
                      />
                    </div>
                    <div className="flex flex-col mt-1">
                      <p className="font-semibold text-2xl max-sm:text-lg">
                        {movie.title}
                      </p>
                      <p className="max-sm:text-sm">{movie.genre}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
