import MenuSidebar from "../layouts/menuSidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomeDesktop = ({ username, handleLogout, roleId, GetNamaDivisi }) => {
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [localTime, setLocalTime] = useState("");
  const [totalAbsences, setTotalAbsences] = useState(0);
  const [totalOvertime, setTotalOvertime] = useState(0);
  const [totalApprovals, setTotalApprovals] = useState(0);

  const handleAbsenceCardClick = () => {
    navigate("/data-absensi");
  };
  const handleOvertimeCardClick = () => {
    navigate("/data-lembur");
  };
  const handleEmployeeCardClick = () => {
    navigate("/data-karyawan");
  };
  const handleApprovalCardClick = () => {
    navigate("/data-approval");
  };
  const handleRequestCardClick = () => {
    navigate("/data-request");
  };

  useEffect(() => {
    updateLocalTime();
    const intervalId = setInterval(updateLocalTime, 1000);

    if (roleId === "4") {
      fetchEmployees();
      fetchAbsences();
      fetchOvertime();
    }
    if (roleId === "5") {
      fetchApprovals();
    }

    return () => clearInterval(intervalId);
  }, [roleId]);

  const updateLocalTime = () => {
    const time = new Date().toLocaleString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
    setLocalTime(time);
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${apiUrl}/profil/`);
      const result = await response.json();
      setEmployees(result.data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchAbsences = async () => {
    try {
      const response = await fetch(`${apiUrl}/absen/`);
      const result = await response.json();
      setTotalAbsences(Array.isArray(result) ? result.length : 0);
    } catch (error) {
      console.error("Error fetching absences:", error);
    }
  };

  const fetchOvertime = async () => {
    try {
      const response = await fetch(`${apiUrl}/overtime/`);
      const result = await response.json();
      setTotalOvertime(Array.isArray(result) ? result.length : 0);
    } catch (error) {
      console.error("Error fetching overtime:", error);
    }
  };
  const fetchApprovals = async () => {
    try {
      const response = await fetch(`${apiUrl}/overtime/`); // Pastikan endpoint benar
      const result = await response.json();

      // Filter data overtime yang statusnya 0 (pending approval)
      const filteredApprovals = Array.isArray(result) ? result.filter((request) => request.status === 0) : [];

      setTotalApprovals(filteredApprovals.length); // Set jumlah approval lembur dengan status 0
    } catch (error) {
      console.error("Error fetching approvals:", error);
    }
  };

  return (
    <div className="desktop-layout flex min-h-screen bg-gray-100">
      <MenuSidebar handleLogout={handleLogout} roleId={roleId} />
      <div className="flex-1 px-8 bg-white shadow-lg rounded-lg transition-all duration-300 ease-in-out">
        <div className="mt-6 p-8 bg-gradient-to-br from-green-700 via-green-700 to-green-700 text-white rounded-lg shadow-md relative">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">Selamat Datang,</h2>
            <h3 className="text-4xl font-extrabold">{username || "User"}</h3>
            <p className="text-gray-200 text-lg mt-2">{localTime}</p>
          </div>
          <div className="absolute top-10 right-8 text-white text-l px-2 py-1 font-bold rounded-lg bg-opacity-30">
            {GetNamaDivisi(roleId)} • Kantor Palem
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4">
          {roleId === "4" && (
            <>
              <div
                onClick={handleEmployeeCardClick}
                className="p-4 bg-white rounded-lg shadow-md text-center transition-transform transform hover:shadow-xl cursor-pointer"
              >
                <h4 className="text-5xl font-bold text-green-600 mb-3">{employees.length}</h4>
                <p className="text-xl font-semibold text-gray-700">Total Karyawan</p>
              </div>

              <div
                onClick={handleAbsenceCardClick}
                className="p-4 bg-white rounded-lg shadow-md text-center transition-transform transform hover:shadow-xl cursor-pointer"
              >
                <h4 className="text-5xl font-bold text-red-600 mb-3">{totalAbsences}</h4>
                <p className="text-xl font-semibold text-gray-700">Total Absen</p>
              </div>

              <div
                onClick={handleOvertimeCardClick}
                className="p-4 bg-white rounded-lg shadow-md text-center transition-transform transform hover:shadow-xl cursor-pointer"
              >
                <h4 className="text-5xl font-bold text-blue-600 mb-3">{totalOvertime}</h4>
                <p className="text-xl font-semibold text-gray-700">Total Lembur</p>
              </div>
            </>
          )}

          {roleId === "5" && (
            <div
              onClick={handleApprovalCardClick}
              className="p-4 bg-white rounded-lg shadow-md text-center transition-transform transform hover:shadow-xl cursor-pointer"
            >
              <h4 className="text-5xl font-bold text-green-600 mb-3">{totalApprovals}</h4>
              <p className="text-xl font-semibold text-gray-700">Approval Lembur</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeDesktop;
