import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, momentLocalizer, Views } from "react-big-calendar";
import MiniCalendar from "react-calendar";
import moment from "moment";
import BlastForm from "../components/BlastForm";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-calendar/dist/Calendar.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [blasts, setBlasts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [editingBlast, setEditingBlast] = useState(null);
  const [searchParams, setSearchParams] = useState({
    date: "",
    startTime: "",
    endTime: "",
    zone: "",
    status: "",
  });
  const [filteredBlasts, setFilteredBlasts] = useState(blasts);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState(Views.MONTH);

  useEffect(() => {
    fetchBlasts();
  }, []);

  useEffect(() => {
    filterBlasts();
  }, [searchParams, blasts]);

  const fetchBlasts = async () => {
    try {
      const res = await fetch("http://localhost:5002/api/blasts");
      const data = await res.json();
      const events = data.map((blast) => {
        const date = new Date(blast.expDate);
        const [startHour, startMinute] = blast.expStartTime.split(":").map(Number);
        const [endHour, endMinute] = blast.expEndTime.split(":").map(Number);

        const start = new Date(date);
        start.setHours(startHour, startMinute, 0, 0);

        const end = new Date(date);
        end.setHours(endHour, endMinute, 0, 0);

        return {
          title: `${blast.zone} - ${blast.plannedBy}`,
          start,
          end,
          raw: blast,
        };
      });
      setBlasts(events);
    } catch (err) {
      console.error("Error loading blasts:", err);
    }
  };

  const getBlastStatus = (blast) => {
    if (blast.additionalInfo?.toLowerCase().includes("cancel")) return "Cancelled";
    if (blast.additionalInfo?.toLowerCase().includes("misfire")) return "Misfire";
    return "Completed";
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value,
    });
  };

  const handleSearchClick = () => {
    filterBlasts();
  };

  const filterBlasts = () => {
    const filtered = blasts.filter((blast) => {
      const raw = blast.raw;
      const dateMatch = searchParams.date
        ? moment(raw.expDate).format("YYYY-MM-DD") === moment(searchParams.date).format("YYYY-MM-DD")
        : true;
      const startTimeMatch = searchParams.startTime
        ? raw.expStartTime.startsWith(searchParams.startTime)
        : true;
      const endTimeMatch = searchParams.endTime
        ? raw.expEndTime.startsWith(searchParams.endTime)
        : true;
      const zoneMatch = searchParams.zone
        ? raw.zone.toLowerCase().includes(searchParams.zone.toLowerCase())
        : true;
      const statusMatch = searchParams.status
        ? getBlastStatus(raw).toLowerCase() === searchParams.status.toLowerCase()
        : true;

      return dateMatch && startTimeMatch && endTimeMatch && zoneMatch && statusMatch;
    });

    setFilteredBlasts(filtered);
  };

  const generatePDFReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Monthly Blast Report", 14, 20);

    const currentMonth = moment(currentDate).format("MMMM YYYY");
    doc.setFontSize(12);
    doc.text(`Month: ${currentMonth}`, 14, 30);

    const rows = filteredBlasts.map((event, idx) => {
      const raw = event.raw;
      return [
        idx + 1,
        moment(raw.expDate).format("YYYY-MM-DD"),
        raw.expStartTime + " - " + raw.expEndTime,
        raw.zone,
        getBlastStatus(raw),
        raw.explosives,
      ];
    });

    autoTable(doc, {
      startY: 40,
      head: [["#", "Date", "Time", "Zone", "Status", "Explosives"]],
      body: rows,
    });

    const statusCounts = {
      Completed: 0,
      Cancelled: 0,
      Misfire: 0,
    };
    rows.forEach((r) => {
      const status = r[4];
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    doc.text("Summary:", 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Completed: ${statusCounts.Completed}`, 14, doc.lastAutoTable.finalY + 20);
    doc.text(`Cancelled: ${statusCounts.Cancelled}`, 14, doc.lastAutoTable.finalY + 30);
    doc.text(`Misfires: ${statusCounts.Misfire}`, 14, doc.lastAutoTable.finalY + 40);

    doc.save(`blast_report_${currentMonth}.pdf`);
  };

  const handleDateClick = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    setEditingBlast(null);
    setShowForm(true);
  };

  const handleEventClick = (event) => {
    setEditingBlast(event.raw);
    setSelectedDate(new Date(event.raw.expDate));
    setShowForm(true);
  };

  const handleSave = () => {
    fetchBlasts();
    setShowForm(false);
  };

  return (
    <div className="flex p-4 gap-4 relative">
      {/* Search Section */}
      <div className="search-form w-full p-4 border rounded-lg mb-4">
        <h3 className="text-lg font-semibold">Search Blasts</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            name="date"
            value={searchParams.date}
            onChange={handleSearchChange}
            className="border p-2 rounded"
          />
          <input
            type="time"
            name="startTime"
            value={searchParams.startTime}
            onChange={handleSearchChange}
            className="border p-2 rounded"
          />
          <input
            type="time"
            name="endTime"
            value={searchParams.endTime}
            onChange={handleSearchChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="zone"
            placeholder="Zone"
            value={searchParams.zone}
            onChange={handleSearchChange}
            className="border p-2 rounded"
          />
          <select
            name="status"
            value={searchParams.status}
            onChange={handleSearchChange}
            className="border p-2 rounded"
          >
            <option value="">Status</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="misfire">Misfire</option>
          </select>
        </div>
        <button
          onClick={handleSearchClick}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Main Calendar */}
      <div className="flex-grow">
        <h2 className="text-2xl font-bold mb-4">Detonation Calendar</h2>
        <BigCalendar
          localizer={localizer}
          events={filteredBlasts}
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          style={{ height: 600 }}
          selectable
          views={["month", "week", "day"]}
          date={currentDate}
          view={currentView}
          onNavigate={(date) => setCurrentDate(date)}
          onView={(view) => setCurrentView(view)}
          onSelectSlot={handleDateClick}
          onSelectEvent={handleEventClick}
        />
      </div>

      {/* Sidebar Mini Monthly Calendar */}
      <div className="w-72">
        <h3 className="text-lg font-semibold mb-2">Monthly View</h3>
        <MiniCalendar
          value={selectedDate}
          onChange={(date) => handleDateClick({ start: date })}
          calendarType="gregory"
        />
      </div>

      {/* Button to generate PDF Report */}
      <div className="absolute top-5 right-5">
        <button
          onClick={generatePDFReport}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Generate PDF Report
        </button>
      </div>

      {/* Popup Modal for BlastForm */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-[90%] max-w-md relative">
            <button
              className="absolute top-2 right-4 text-2xl text-gray-500 hover:text-red-500 font-bold"
              onClick={() => setShowForm(false)}
            >
              &times;
            </button>

            <BlastForm
              selectedDate={selectedDate}
              blast={editingBlast}
              onClose={() => setShowForm(false)}
              onSave={handleSave}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
