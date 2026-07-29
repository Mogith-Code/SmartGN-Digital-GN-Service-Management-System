// Backend/src/controllers/appointmentController.js
const db = require('../config/database');

// Generate appointment number e.g. APT-20260718-123
const generateAppointmentNumber = () => {
    const date = new Date();
    const dateStr = date.getFullYear() +
        String(date.getMonth() + 1).padStart(2, '0') +
        String(date.getDate()).padStart(2, '0');
    const rand = Math.floor(100 + Math.random() * 900);
    return `APT-${dateStr}-${rand}`;
};

// Convert time to 24-hour format
const convertTo24Hour = (timeStr) => {
    if (!timeStr) return "09:00:00";
    
    timeStr = timeStr.trim();
    
    if (timeStr.match(/^\d{1,2}:\d{2}(:\d{2})?$/)) {
        const parts = timeStr.split(':');
        const hours = parts[0].padStart(2, '0');
        const minutes = parts[1].padStart(2, '0');
        const seconds = parts[2] ? parts[2].padStart(2, '0') : '00';
        return `${hours}:${minutes}:${seconds}`;
    }
    
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match) {
        let hours = parseInt(match[1]);
        const minutes = match[2];
        const period = match[3].toUpperCase();
        
        if (period === 'PM' && hours !== 12) hours += 12;
        else if (period === 'AM' && hours === 12) hours = 0;
        
        return `${String(hours).padStart(2, '0')}:${minutes}:00`;
    }
    
    if (timeStr.match(/^\d{2}:\d{2}:\d{2}$/)) return timeStr;
    
    console.warn('Unrecognized time format:', timeStr);
    return "09:00:00";
};

// ============================================================
// RESIDENT APPOINTMENT COUNTS
// ============================================================
exports.getAppointmentCounts = async (req, res) => {
    const user = req.user;
    
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied. Residents only.' });
    }

    const nic = user.id;

    try {
        const [pendingResult] = await db.query(
            'SELECT COUNT(*) AS count FROM appointment_pending WHERE resident_nic = ?',
            [nic]
        );

        const [approvedResult] = await db.query(
            'SELECT COUNT(*) AS count FROM appointment_approved WHERE resident_nic = ?',
            [nic]
        );

        return res.json({
            pending: pendingResult[0]?.count || 0,
            approved: approvedResult[0]?.count || 0
        });
    } catch (error) {
        console.error('Error fetching appointment counts:', error);
        return res.status(500).json({ error: 'Server error fetching appointment counts.' });
    }
};

// ============================================================
// GET ALL RESIDENT APPOINTMENTS
// ============================================================
exports.getAllResidentAppointments = async (req, res) => {
    const user = req.user;
    
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied. Residents only.' });
    }

    const nic = user.id;

    try {
        const [pending] = await db.query(`
            SELECT 
                appointment_id, 
                appointment_number, 
                date, 
                time, 
                purpose,
                contact_number,
                'Pending' AS status, 
                created_at AS requested_at
            FROM appointment_pending 
            WHERE resident_nic = ?
            ORDER BY date ASC, time ASC
        `, [nic]);

        const [approved] = await db.query(`
            SELECT 
                appointment_id, 
                appointment_number, 
                date, 
                time, 
                purpose,
                contact_number,
                'Approved' AS status, 
                requested_at,
                approved_at
            FROM appointment_approved 
            WHERE resident_nic = ?
            ORDER BY date ASC, time ASC
        `, [nic]);

        const allAppointments = [...pending, ...approved];

        return res.json({
            success: true,
            appointments: allAppointments,
            counts: {
                pending: pending.length,
                approved: approved.length,
                total: allAppointments.length
            }
        });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Server error fetching appointments.'
        });
    }
};

// ============================================================
// BOOK APPOINTMENT
// ============================================================
exports.bookAppointment = async (req, res) => {
    const user = req.user;
    
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied. Residents only.' });
    }

    const residentNic = user.id;
    const { purpose, date, time, contactNumber } = req.body;

    if (!purpose || !date || !time || !contactNumber) {
        return res.status(400).json({ 
            error: 'All fields are required: purpose, date, time, and contactNumber.' 
        });
    }

    try {
        const [residentRows] = await db.query(`
            SELECT h.division_id
            FROM resident r
            JOIN household h ON r.household_number = h.household_number
            WHERE r.r_nic = ?
        `, [residentNic]);

        if (residentRows.length === 0) {
            return res.status(404).json({ error: 'Resident household not found.' });
        }

        const divisionId = residentRows[0].division_id;

        const [officerRows] = await db.query(`
            SELECT gn_id 
            FROM grama_niladhari 
            WHERE division_id = ? AND status = 'Active' 
            LIMIT 1
        `, [divisionId]);

        if (officerRows.length === 0) {
            return res.status(404).json({ 
                error: 'No active GN Officer found for your division.' 
            });
        }

        const gnId = officerRows[0].gn_id;
        const appointmentNumber = generateAppointmentNumber();
        const formattedTime = convertTo24Hour(time);

        await db.query(`
            INSERT INTO appointment_pending (
                appointment_number,
                date,
                time,
                purpose,
                contact_number,
                resident_nic,
                gn_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            appointmentNumber,
            date,
            formattedTime,
            purpose,
            contactNumber,
            residentNic,
            gnId
        ]);

        return res.status(201).json({
            success: true,
            message: 'Appointment booked successfully! Awaiting officer confirmation.',
            data: {
                appointmentNumber,
                date,
                time: formattedTime,
                purpose,
                contactNumber,
                status: 'Pending'
            }
        });
    } catch (error) {
        console.error('Error booking appointment:', error);
        return res.status(500).json({ 
            error: 'Server error booking appointment. Please try again later.' 
        });
    }
};

// ============================================================
// UPDATE APPOINTMENT
// ============================================================
exports.updateAppointment = async (req, res) => {
    const user = req.user;
    
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied. Residents only.' });
    }

    const { id } = req.params;
    const nic = user.id;
    const { purpose, date, time, contactNumber } = req.body;

    if (!purpose || !date || !time || !contactNumber) {
        return res.status(400).json({ 
            error: 'All fields are required: purpose, date, time, and contactNumber.' 
        });
    }

    try {
        const [pending] = await db.query(
            'SELECT * FROM appointment_pending WHERE appointment_id = ? AND resident_nic = ?',
            [id, nic]
        );

        if (pending.length === 0) {
            return res.status(404).json({ 
                error: 'Appointment not found or you do not have permission to edit it.' 
            });
        }

        const formattedTime = convertTo24Hour(time);

        await db.query(`
            UPDATE appointment_pending 
            SET purpose = ?, date = ?, time = ?, contact_number = ?
            WHERE appointment_id = ? AND resident_nic = ?
        `, [purpose, date, formattedTime, contactNumber, id, nic]);

        return res.json({
            success: true,
            message: 'Appointment updated successfully.',
            data: {
                appointment_id: id,
                purpose,
                date,
                time: formattedTime,
                contactNumber
            }
        });
    } catch (error) {
        console.error('Error updating appointment:', error);
        return res.status(500).json({ 
            error: 'Server error updating appointment.' 
        });
    }
};

// ============================================================
// CANCEL APPOINTMENT
// ============================================================
exports.cancelAppointment = async (req, res) => {
    const user = req.user;
    
    if (!user || user.role !== 'RESIDENT') {
        return res.status(403).json({ error: 'Access denied. Residents only.' });
    }

    const { id } = req.params;
    const nic = user.id;

    try {
        const [pending] = await db.query(
            'SELECT * FROM appointment_pending WHERE appointment_id = ? AND resident_nic = ?',
            [id, nic]
        );

        if (pending.length === 0) {
            return res.status(404).json({ 
                error: 'Appointment not found or already processed.' 
            });
        }

        await db.query(
            'DELETE FROM appointment_pending WHERE appointment_id = ?',
            [id]
        );

        return res.json({
            success: true,
            message: 'Appointment cancelled successfully.'
        });
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        return res.status(500).json({ 
            error: 'Server error cancelling appointment.' 
        });
    }
};

// ============================================================
// OFFICER APPOINTMENT COUNTS (Including Tomorrow)
// ============================================================
exports.getOfficerAppointmentCounts = async (req, res) => {
    const user = req.user;
    
    if (!user || (user.role !== 'OFFICER' && user.role !== 'ADMIN')) {
        return res.status(403).json({ error: 'Access denied. Officers only.' });
    }

    try {
        let gnId = null;
        
        if (user.role === 'OFFICER') {
            const [officer] = await db.query(
                'SELECT gn_id, division_id FROM grama_niladhari WHERE gn_id = ? OR email = ? OR username = ?',
                [user.id, user.email || user.id, user.id]
            );
            
            if (officer.length === 0) {
                return res.status(404).json({ error: 'Officer not found in database.' });
            }
            
            gnId = officer[0].gn_id;
        } else {
            // ADMIN - use their ID as gn_id
            gnId = user.id;
        }

        let pendingCount = 0;
        let approvedCount = 0;
        let tomorrowCount = 0;

        if (gnId) {
            // Get pending appointments count
            const [pendingResult] = await db.query(`
                SELECT COUNT(*) AS count 
                FROM appointment_pending ap
                WHERE ap.gn_id = ?
            `, [gnId]);
            pendingCount = pendingResult[0]?.count || 0;

            // Get approved appointments count
            const [approvedResult] = await db.query(`
                SELECT COUNT(*) AS count 
                FROM appointment_approved aa
                WHERE aa.gn_id = ?
            `, [gnId]);
            approvedCount = approvedResult[0]?.count || 0;

            // Get tomorrow's appointments (Pending + Approved)
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split('T')[0];

            // Get pending appointments for tomorrow
            const [pendingTomorrow] = await db.query(`
                SELECT COUNT(*) AS count 
                FROM appointment_pending ap
                WHERE ap.gn_id = ? AND ap.date = ?
            `, [gnId, tomorrowStr]);

            // Get approved appointments for tomorrow
            const [approvedTomorrow] = await db.query(`
                SELECT COUNT(*) AS count 
                FROM appointment_approved aa
                WHERE aa.gn_id = ? AND aa.date = ?
            `, [gnId, tomorrowStr]);

            // Combine both counts
            tomorrowCount = (pendingTomorrow[0]?.count || 0) + (approvedTomorrow[0]?.count || 0);
        }

        return res.json({
            success: true,
            pending: pendingCount,
            approved: approvedCount,
            tomorrow: tomorrowCount,
            total: pendingCount + approvedCount
        });
    } catch (error) {
        console.error('Error fetching officer appointment counts:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Server error fetching appointment counts.',
            details: error.message 
        });
    }
};

// src/Pages/OfficerAppointment.jsx
import React, { useState, useEffect } from "react";
import OfficerNavbar from "../Components/Common/OfficerNavbar";
import OSidebar from "../Components/Common/OSidebar";
import Footer from "../Components/Common/Footer";
import OfficerAppointmentsLayoutPage from "../Components/AppointmentsPage/OfficerAppointmentsLayoutPage";

function OfficerAppointment({ onOpenHelp }) {
  // State for appointment counts
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [tomorrowCount, setTomorrowCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get token from localStorage
  const token = localStorage.getItem("smartgn_token");
  const gnId = localStorage.getItem("smartgn_user_id");

  // Fetch appointment counts
  useEffect(() => {
    const fetchAppointmentCounts = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await fetch("/api/appointments/officercounts", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error("Authentication failed. Please login again.");
          }
          throw new Error("Failed to fetch appointment counts");
        }

        const data = await response.json();

        if (data.success) {
          setPendingCount(data.pending || 0);
          setApprovedCount(data.approved || 0);
          setTomorrowCount(data.tomorrow || 0);

          console.log("Officer appointment counts:", {
            pending: data.pending,
            approved: data.approved,
            tomorrow: data.tomorrow,
            total: data.total,
          });
        } else {
          throw new Error(data.error || "Failed to fetch counts");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching appointment counts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentCounts();
  }, [token, gnId]);

  // Show loading state
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
        <OfficerNavbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D69E2E] mx-auto"></div>
            <p className="mt-4 text-[#1B365D]">Loading appointments...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
        <OfficerNavbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
              <p className="text-red-600 font-semibold mb-2">
                Error loading appointments
              </p>
              <p className="text-red-500 text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-[#D69E2E] text-white rounded-lg hover:bg-[#B8860B] transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      <OfficerNavbar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        <div className="flex flex-1 w-full">
          <OSidebar />
        </div>

        {/* Main Content - Pass counts as props */}
        <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D]">
          <OfficerAppointmentsLayoutPage
            pendingCount={pendingCount}
            approvedCount={approvedCount}
            tomorrowCount={tomorrowCount}
          />
        </div>
      </div>

      {/* Floating Help Trigger */}
      <button
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#D69E2E] text-white border-0 text-[20px] font-bold cursor-pointer shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-[#FFAA00]"
        aria-label="Help Trigger"
        onClick={onOpenHelp}
      >
        ?
      </button>

      <Footer />
    </div>
  );
}

export default OfficerAppointment;
