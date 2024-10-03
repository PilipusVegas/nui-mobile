import { useEffect, useState } from "react";
import "sweetalert2/dist/sweetalert2.min.css";
import { useNavigate } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DataLembur = () => {
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const navigate = useNavigate();
  const [lemburData, setLemburData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleBackClick = () => navigate("/home");

  const filteredLembur = lemburData.filter((lembur) => {
    const matchesSearch = lembur.id_user.toString().includes(searchQuery);
    const lemburDate = new Date(lembur.tanggal);
    const matchesDate =
      (selectedDay ? lemburDate.getDate() === Number(selectedDay) : true) &&
      (selectedMonth ? lemburDate.getMonth() + 1 === Number(selectedMonth) : true) &&
      (selectedYear ? lemburDate.getFullYear() === Number(selectedYear) : true);
    return matchesSearch && matchesDate; // Combine both filters
  });

  useEffect(() => {
    const fetchLemburData = async () => {
      try {
        const response = await fetch(`${apiUrl}/overtime/`);
        const result = await response.json();
        console.log("API Response:", result);
        if (Array.isArray(result)) {
          setLemburData(result);
        } else {
          setErrorMessage("Unexpected response format.");
        }
      } catch (error) {
        setErrorMessage("Kesalahan saat mengambil data lembur.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLemburData();
  }, [apiUrl]);

  // Generate options for day, month, and year
  const generateOptions = (count, offset = 1) => {
    return Array.from({ length: count }, (_, i) => (
      <option key={i + offset} value={i + offset}>
        {i + offset}
      </option>
    ));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faArrowLeft}
              title="Back to Home"
              onClick={handleBackClick}
              className="mr-2 cursor-pointer text-white bg-green-600 hover:bg-green-700 transition duration-150 ease-in-out rounded-full p-3 shadow-lg"
            />
            <h1 className="text-4xl font-bold text-gray-800 pb-1">Overview Data Lembur</h1>
          </div>
          {/* Filter by date using selects */}
          <div className="flex mb-4 items-center space-x-4">
            <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} className="border p-2 rounded-md">
              <option value="">Hari</option>
              {generateOptions(31)}
            </select>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border p-2 rounded-md"
            >
              <option value="">Bulan</option>
              {generateOptions(12)}
            </select>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="border p-2 rounded-md">
              <option value="">Tahun</option>
              {generateOptions(5, new Date().getFullYear() - 4)} {/* Last 5 years */}
            </select>
          </div>
        </div>

        <input
          type="text"
          value={searchQuery}
          placeholder="Cari Karyawan..."
          className="border p-2 mb-4 w-full rounded-md"
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {isLoading ? (
          <div className="flex justify-center items-center h-64">Loading...</div>
        ) : errorMessage ? (
          <p className="text-red-500 text-center">{errorMessage}</p>
        ) : (
          <div className="mb-8">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
              <thead className="bg-green-800 text-white uppercase text-sm leading-normal sticky top-0">
                <tr>
                  <th className="py-3 pl-3 text-center">No.</th>
                  <th className="py-3 pl-6 pr-6 text-center">ID User</th>
                  <th className="py-3 pl-6 text-center">Tanggal</th>
                  <th className="py-3 pl-6 text-center">Lokasi ID</th>
                  <th className="py-3 pl-6 text-center">Deskripsi</th>
                  <th className="py-3 pl-6 text-center">Jam Mulai</th>
                  <th className="py-3 pl-6 text-center">Jam Selesai</th>
                  <th className="py-3 pl-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {filteredLembur.length > 0 ? (
                  filteredLembur.map((lembur, index) => (
                    <tr key={lembur.id} className="border-b border-gray-300 hover:bg-gray-100">
                      <td className="py-3 pl-6 text-center">{index + 1}</td>
                      <td className="py-3 pl-6 pr-6 text-center">{lembur.nama}</td>
                      <td className="py-3 pl-6 text-center">{new Date(lembur.tanggal).toLocaleDateString()}</td>
                      <td className="py-3 pl-6 text-center">{lembur.lokasi}</td>
                      <td className="py-3 pl-6 text-center">{lembur.deskripsi}</td>
                      <td className="py-3 pl-6 text-center">{lembur.jam_mulai}</td>
                      <td className="py-3 pl-6 text-center">{lembur.jam_selesai}</td>
                      <td className="py-3 pl-6 text-center">
                        <span className={`font-bold ${lembur.status === 1 ? "text-green-600" : "text-red-600"}`}>
                          {lembur.status === 1 ? "Disetujui" : "Belum Disetujui"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-3 text-center">
                      Tidak ada data lembur ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataLembur;
