import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, momentLocalizer, Views } from "react-big-calendar";
import MiniCalendar from "react-calendar";
import moment from "moment";
import BlastForm from "../components/BlastForm";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-calendar/dist/Calendar.css";
import { Tooltip } from "react-tooltip";
import holidays from "../components/Holidays";
import { toast } from 'sonner';
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const getCurrentUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.name || payload.username || "unknown_user";
  } catch {
    return null;
  }
};

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [blasts, setBlasts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [editingBlast, setEditingBlast] = useState(null);
  const [currentUser] = useState(getCurrentUser());
  const [searchParams, setSearchParams] = useState({
    date: "",
    startTime: "",
    endTime: "",
    zone: "",
    status: "",
  });
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [filteredBlasts, setFilteredBlasts] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState(Views.MONTH);

  const fetchDetonations = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/blasts");
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

      const holidayEvents = Object.entries(holidays).map(([date, name]) => ({
        title: name,
        start: new Date(date),
        end: new Date(date),
        isHoliday: true,
      }));

      return [...events, ...holidayEvents];
    } catch {
      return [];
    }
  };

  const renderCalendar = (detonations) => setBlasts(detonations);

  useEffect(() => {
    fetchDetonations().then(renderCalendar);
  }, []);

  useEffect(() => {
    filterBlasts();
  }, [searchParams, blasts]);

  const getBlastStatus = (blast) => {
    const info = blast.additionalInfo?.toLowerCase() || "";
    if (info.includes("cancel")) return "Cancelled";
    if (info.includes("misfire")) return "Misfire";
    return "Completed";
  };

  const filterBlasts = () => {
    const filtered = blasts.filter((blast) => {
      if (blast.isHoliday) return true;

      const raw = blast.raw;
      const dateMatch = searchParams.date ? moment(raw.expDate).format("YYYY-MM-DD") === moment(searchParams.date).format("YYYY-MM-DD") : true;
      const startTimeMatch = searchParams.startTime ? raw.expStartTime.startsWith(searchParams.startTime) : true;
      const endTimeMatch = searchParams.endTime ? raw.expEndTime.startsWith(searchParams.endTime) : true;
      const zoneMatch = searchParams.zone ? raw.zone.toLowerCase().includes(searchParams.zone.toLowerCase()) : true;
      const statusMatch = searchParams.status ? getBlastStatus(raw).toLowerCase() === searchParams.status.toLowerCase() : true;

      return dateMatch && startTimeMatch && endTimeMatch && zoneMatch && statusMatch;
    });

    setFilteredBlasts(filtered);
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  const handleSave = async (actionType) => {
    await fetchDetonations().then(renderCalendar);
    setShowForm(false);
    const actions = {
      create: 'Blast created successfully!',
      update: 'Blast updated successfully!',
      delete: 'Blast deleted successfully!',
    };
    toast.success(actions[actionType] || 'Blast saved successfully!');
  };

  const generatePDFReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Monthly Blast Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Month: ${moment(currentDate).format("MMMM YYYY")}`, 14, 30);

    const rows = filteredBlasts.filter(e => !e.isHoliday).map((event, idx) => {
      const raw = event.raw;
      return [
        idx + 1,
        moment(raw.expDate).format("YYYY-MM-DD"),
        `${raw.expStartTime} - ${raw.expEndTime}`,
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

    doc.save(`blast_report_${moment(currentDate).format("MMMM_YYYY")}.pdf`);
  };

  const eventPropGetter = (event) => ({
    style: {
      backgroundColor: event.isHoliday ? "#EF4444" : "#2563EB",
      color: "white",
      borderRadius: "0.375rem",
      padding: "0.25rem",
      border: "none",
    },
  });

  const getMonthDates = () => [
    moment(currentDate).subtract(1, "months").toDate(),
    currentDate,
    moment(currentDate).add(1, "months").toDate(),
  ];

  return (

    <>
      <Header />
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", padding: "1.5rem", backgroundColor: "#dbe1eb" }}>
      {/* Search Bar */}
      <div style={{ width: "100%", background: "#f9fafb", padding: "1.25rem", borderRadius: "1rem", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
      <motion.div
  initial={{ width: 200 }}
  animate={{ width: isSearchExpanded ? 400 : 400 }}
  style={{
    display: "flex",
    alignItems: "center",
    background: isSearchExpanded ? "#1f2937" : "#374151",
    borderRadius: "9999px",
    padding: "0.5rem 0.75rem",
    color: "#fff",
    cursor: "pointer"
  }}
  onClick={() => setIsSearchExpanded(true)}
>
  <Search size={20} style={{ color: "#38bdf8" }} />
  <input
    type="text"
    name="zone"
    placeholder="Search by "
    value={searchParams.zone}
    onChange={handleSearchChange}
    onFocus={() => setIsSearchExpanded(true)}
    style={{
      flexGrow: 1,
      background: "transparent",
      color: "#ffffff",
      border: "none",
      paddingLeft: "0.75rem",
      opacity: isSearchExpanded ? 1 : 0.5,
      pointerEvents: isSearchExpanded ? "auto" : "none"
    }}
  />
</motion.div>

        {isSearchExpanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} style={{ marginTop: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "1rem" }}>
              <label>
                Date:
                <input type="date" name="date" value={searchParams.date} onChange={handleSearchChange} style={{ width: "100%" }} />
              </label>
              <label>
                Start Time:
                <input type="time" name="startTime" value={searchParams.startTime} onChange={handleSearchChange} style={{ width: "100%" }} />
              </label>
              <label>
                End Time:
                <input type="time" name="endTime" value={searchParams.endTime} onChange={handleSearchChange} style={{ width: "100%" }} />
              </label>
              <label>
                Status:
                <select name="status" value={searchParams.status} onChange={handleSearchChange} style={{ width: "100%" }}>
                  <option value="">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="misfire">Misfire</option>
                </select>
              </label>
            </div>
            <button onClick={filterBlasts} style={{ marginTop: "1rem", backgroundColor: "#2563eb", color: "white", padding: "0.5rem 1rem", borderRadius: "0.5rem", border: "none" }}>Search</button>
          </motion.div>
        )}
      </div>

      {/* Main Calendar */}
      <div style={{ flexGrow: 1, minWidth: "350px" }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: "800" }}>Detonation Calendar</h2>
        <BigCalendar
          localizer={localizer}
          events={filteredBlasts}
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          eventPropGetter={eventPropGetter}
          style={{ height: 600 }}
          selectable
          views={["month", "week", "day"]}
          date={currentDate}
          view={currentView}
          onNavigate={setCurrentDate}
          onView={setCurrentView}
          onSelectSlot={(slot) => { setSelectedDate(slot.start); setEditingBlast(null); setShowForm(true); }}
          onSelectEvent={(event) => { if (!event.isHoliday) { setSelectedDate(new Date(event.raw.expDate)); setEditingBlast(event.raw); setShowForm(true); } }}
        />
        <Tooltip />
        <button onClick={generatePDFReport} style={{ marginTop: "1rem", backgroundColor: "#18266d", color: "white", padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "none" }}>
          Get Monthly Report
        </button>
      </div>

      {/* Sidebar Calendar */}
      <div style={{ width: "20rem", minWidth: "280px" }}>
        <h3 style={{ fontSize: "1.25rem", fontWeight: "700", textAlign: "center" }}>Monthly View</h3>
        {getMonthDates().map((date, idx) => (
          <MiniCalendar
            key={idx}
            value={date}
            onClickDay={(d) => setSelectedDate(d)}
            tileContent={({ date, view }) => {
              if (view === "month") {
                const formatted = moment(date).format("YYYY-MM-DD");
                const events = filteredBlasts.filter(e => moment(e.start).format("YYYY-MM-DD") === formatted);
                return events.length > 0 ? <div style={{ backgroundColor: "#f09737", width: "100%", height: "5px", borderRadius: "5px" }} /> : null;
              }
              return null;
            }}
          />
        ))}
      </div>

      {showForm && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 50, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ backgroundColor: "#fff", padding: "2rem", borderRadius: "1rem", maxWidth: "600px", width: "100%" }}>
            <button onClick={() => setShowForm(false)} style={{ position: "absolute", top: "1rem", right: "1rem", fontSize: "2rem", background: "none", border: "none", cursor: "pointer" }}>&times;</button>
            <BlastForm selectedDate={selectedDate} blast={editingBlast} plannedBy={currentUser} onClose={() => setShowForm(false)} onSave={handleSave} />
          </div>
        </div>
      )}
    </div>
    <Footer />
    </>
  );
};

export default CalendarPage;