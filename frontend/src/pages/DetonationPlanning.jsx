import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, momentLocalizer, Views } from "react-big-calendar";
import MiniCalendar from "react-calendar";
import moment from "moment";
import BlastForm from "../components/BlastForm";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-calendar/dist/Calendar.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../pages/pageCss/DetonationPlanning.css";
import { Tooltip } from "react-tooltip";
import holidays from "../components/Holidays";
import { toast } from 'sonner';
import { motion } from "framer-motion"; // 🆕 For animation
import { Search } from "lucide-react"; // 🆕 Search Icon


// 🟡 JWT Decode helper
const getCurrentUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.name || payload.username || "unknown_user";
  } catch (err) {
    console.error("Failed to decode token", err);
    return null;
  }
};

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [blasts, setBlasts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [editingBlast, setEditingBlast] = useState(null);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [searchParams, setSearchParams] = useState({
    date: "",
    startTime: "",
    endTime: "",
    zone: "",
    status: "",
  });
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [filteredBlasts, setFilteredBlasts] = useState(blasts);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState(Views.MONTH);

  // 🟡 Setup Calendar: Fetch detonations and render calendar
  async function setupCalendar() {
    const detonations = await fetchDetonations();
    renderCalendar(detonations);
  }

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

      // 🔥 FIXED: Convert holidays object to array of events
    const holidayEvents = Object.entries(holidays).map(([date, name]) => ({
      title: name,
      start: new Date(date),
      end: new Date(date),
      isHoliday: true,
    }));

    return [...events, ...holidayEvents];
  } catch (err) {
    console.error("Error loading detonations:", err);
    return [];
  }
};

  // 🟡 Render calendar after fetching detonations
  const renderCalendar = (detonations) => {
    setBlasts(detonations);
  };

  useEffect(() => {
    setupCalendar(); // Fetch detonations and set up the calendar on component mount
  }, []);

  useEffect(() => {
    filterBlasts();
  }, [searchParams, blasts]);

  const getBlastStatus = (blast) => {
    if (blast.additionalInfo?.toLowerCase().includes("cancel")) return "Cancelled";
    if (blast.additionalInfo?.toLowerCase().includes("misfire")) return "Misfire";
    return "Completed";
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  const handleSearchClick = () => {
    filterBlasts();
    setIsSearchExpanded(false);
  };

  const filterBlasts = () => {
    const filtered = blasts.filter((blast) => {
      if (blast.isHoliday) return true;
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

    const rows = filteredBlasts.filter(e => !e.isHoliday).map((event, idx) => {
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

    doc.save(`blast_report_${currentMonth}.pdf`);
  };

  const handleDateClick = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    setEditingBlast(null);
    setShowForm(true);
  };

  const handleEventClick = (event) => {
    if (event.isHoliday) return;
    setEditingBlast(event.raw);
    setSelectedDate(new Date(event.raw.expDate));
    setShowForm(true);
  };

  const handleSave = async (actionType) => {
    await setupCalendar();  // Refresh calendar events
    setShowForm(false);
    switch (actionType) {
      case 'create':
        toast.success('Blast created successfully! 🚀');
        break;
      case 'update':
        toast.success('Blast updated successfully! ✏️');
        break;
      case 'delete':
        toast.success('Blast deleted successfully! 🗑️');
        break;
      default:
        toast.success('Blast saved successfully! 🚀');
    }
  };
  

  const getMonthDates = () => {
    const current = moment(currentDate);
    return [
      current.clone().subtract(1, "months").toDate(),
      current.toDate(),
      current.clone().add(1, "months").toDate(),
    ];
  };

  const eventPropGetter = (event) => ({
    style: {
      backgroundColor: event.isHoliday ? "#EF4444" : "#2563EB",
      color: "white",
      borderRadius: "0.375rem",
      padding: "0.25rem",
      border: "none",
    },
    "data-tip": event.title,
  });

  return (
    <div className="detonation-planning-container">
      {/* 🔥 New Animated Search Bar */}
      <div className="search-form">
  <motion.div
    initial={{ width: 48 }}
    animate={{ width: isSearchExpanded ? 400 : 48 }}
    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    className="search-bar-wrapper"
  >
    <button
      type="button"
      onClick={() => setIsSearchExpanded(true)}
      className="search-icon-button"
    >
      <Search size={20} />
    </button>

    <input
      type="text"
      name="zone"
      placeholder="Search by Zone..."
      value={searchParams.zone}
      onChange={handleSearchChange}
      onFocus={() => setIsSearchExpanded(true)}
      className={`search-input ${isSearchExpanded ? "visible" : "hidden"}`}
    />
  </motion.div>

  {isSearchExpanded && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
      className="filters-dropdown"
    >
      <div className="filters-grid">
        {[
          { label: "Date", name: "date", type: "date" },
          { label: "Start Time", name: "startTime", type: "time" },
          { label: "End Time", name: "endTime", type: "time" },
        ].map(({ label, name, type }) => (
          <div className="filter-item" key={name}>
            <label className="filter-label">{label}</label>
            <input
              type={type}
              name={name}
              value={searchParams[name]}
              onChange={handleSearchChange}
              className="filter-input"
            />
          </div>
        ))}

        <div className="filter-item">
          <label className="filter-label">Status</label>
          <select
            name="status"
            value={searchParams.status}
            onChange={handleSearchChange}
            className="filter-input"
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="misfire">Misfire</option>
          </select>
        </div>
      </div>

      <div className="filters-action">
        <button type="button" onClick={handleSearchClick} className="search-button">
          Search
        </button>
      </div>
    </motion.div>
  )}
</div>


      {/* Main Calendar */}
      <div className="main-calendar">
        <h2>Detonation Calendar</h2>
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
          onNavigate={(date) => setCurrentDate(date)}
          onView={(view) => setCurrentView(view)}
          onSelectSlot={handleDateClick}
          onSelectEvent={handleEventClick}
        />
        <Tooltip />
      </div>

      {/* Sidebar Monthly View */}
      <div className="sidebar-calendar">
        <h3>Monthly View</h3>
        <div className="mini-calendar-grid">
          {getMonthDates().map((date, idx) => (
            <div key={idx} className="mini-calendar-item">
  <MiniCalendar
  value={date}
  tileContent={({ date, view }) => {
    if (view === 'month') {
      const formatted = moment(date).format('YYYY-MM-DD');
      const events = filteredBlasts.filter(e => moment(e.start).format('YYYY-MM-DD') === formatted);
  
      if (events.length > 0) {
        // 🟡 Build tooltip content
        const eventList = events
          .filter(e => !e.isHoliday)
          .map(e => `- ${e.title}`)
          .join('\n');
        const holidayList = events
          .filter(e => e.isHoliday)
          .map(e => `- ${e.title}`)
          .join('\n');
  
        let tooltipContent = '';
        if (eventList) tooltipContent += '🔔 Events:\n' + eventList + '\n';
        if (holidayList) tooltipContent += '🎉 Holidays:\n' + holidayList;
  
        return (
          <div
            data-tooltip-id="tooltip"
            data-tooltip-content={tooltipContent.trim()}
            style={{ height: '100%', width: '100%' }}
          />
        );
      }
    }
  }}
  
  tileClassName={({ date, view }) => {
    if (view === 'month') {
      const formatted = moment(date).format('YYYY-MM-DD');
      if (filteredBlasts.some(e => moment(e.start).format('YYYY-MM-DD') === formatted)) {
        return 'highlighted-date';
      }
    }
    return '';
  }}
  onClickDay={(date) => handleDateClick({ start: date })}
/>

{/* Place this once at the bottom of your calendar area */}
<Tooltip
  id="tooltip"
  place="top"
  effect="solid"
  delayShow={100}
  delayHide={100}
  float={true}
/>




            </div>
          ))}
        </div>
      </div>

      {/* PDF Button */}
      <div className="absolute top-5 right-5">
        <button onClick={generatePDFReport} className="pdf-button">
          Get monthly Report
        </button>
      </div>

      {/* Blast Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-button" onClick={() => setShowForm(false)}>
              &times;
            </button>
            <BlastForm
              selectedDate={selectedDate}
              blast={editingBlast}
              plannedBy={currentUser}
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
