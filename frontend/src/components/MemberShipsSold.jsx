import { useEffect, useState } from 'react';
import axios from 'axios';

const DesignationCounts = () => {
  const [counts, setCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [year, setYear] = useState(new Date().getFullYear()); // Default to current year

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get('http://localhost:27017/designation/designation-counts', {
          params: { month, year }
        });
        setCounts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch designation counts.');
        setLoading(false);
      }
    };

    fetchCounts();
  }, [month, year]); // Re-fetch data when month or year changes

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="designation-counts">
      <h2>Memberships Sold for {month}/{year}</h2>
      <label>
        Month:
        <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </label>
      <label>
        Year:
        <select value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </label>
      <table>
        <thead>
          <tr>
            <th>Designation</th>
            <th>Count</th>
            <th>Total Amount Collected</th>
            <th>Base Members</th>
            <th>Silver Members</th>
            <th>Gold Members</th>
            <th>Diamond Members</th>
          </tr>
        </thead>
        <tbody>
          {counts.map((count) => (
            <tr key={`${count.designation}-${count.month}-${count.year}`}>
              <td>{count.designation}</td>
              <td>{count.count}</td>
              <td>{count.totalAmount}</td>
              <td>{count.memtypeCounts.base}</td>
              <td>{count.memtypeCounts.silver}</td>
              <td>{count.memtypeCounts.gold}</td>
              <td>{count.memtypeCounts.diamond}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DesignationCounts;
