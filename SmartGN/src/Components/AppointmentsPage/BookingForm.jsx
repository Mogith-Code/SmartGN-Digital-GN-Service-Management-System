import React, { useState } from "react";

function BookingForm() {
  // Booking Form States
  const [purpose, setPurpose] = useState("Certificate Collection");
  const [bookDay, setBookDay] = useState(17);
  const [bookTime, setBookTime] = useState("2:00 PM");
  const [officerName, setOfficerName] = useState("Kamal Silva");
  const [contactNumber, setContactNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <>
      <div className="flex border-b-[1.5px] border-[#2D37482D] pb-[10px] text-[#2D3748] text-[24px] font-medium">
        Request New Appointment
      </div>

      <form>
        <div className="gap-4">
          <div className="form-group">
            <label htmlFor="purposeSelect">Appointment Purpose</label>
            <div className="select-wrapper">
              <select
                id="purposeSelect"
                className="register-control register-select"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                required
              >
                <option value="Certificate Collection">
                  Certificate Collection
                </option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Family Details Verification">
                  Family Details Verification
                </option>
                <option value="Allowance Inquiry">Allowance Inquiry</option>
                <option value="Land Dispute Negotiation">
                  Land Dispute Negotiation
                </option>
              </select>
              <span className="select-arrow">▼</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="daySelect">Date in May 2026</label>
            <div className="select-wrapper">
              <select
                id="daySelect"
                className="register-control register-select"
                value={bookDay}
                onChange={(e) => setBookDay(parseInt(e.target.value))}
                required
              >
                {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    May {d < 10 ? "0" + d : d}, 2026
                  </option>
                ))}
              </select>
              <span className="select-arrow">▼</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="timeSelect">Preferred Time Slot</label>
            <div className="select-wrapper">
              <select
                id="timeSelect"
                className="register-control register-select"
                value={bookTime}
                onChange={(e) => setBookTime(e.target.value)}
                required
              >
                <option value="9:00 AM">9:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="1:00 PM">1:00 PM</option>
                <option value="2:00 PM">2:00 PM</option>
                <option value="3:00 PM">3:00 PM</option>
              </select>
              <span className="select-arrow">▼</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="officerSelect">Assigned Officer</label>
            <div className="select-wrapper">
              <select
                id="officerSelect"
                className="register-control register-select"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                required
              >
                <option value="Kamal Silva">Grama Niladhari Kamal Silva</option>
                <option value="Kamala Silva">
                  Assistant Officer Kamala Silva
                </option>
                <option value="Nimal Perera">Officer Nimal Perera</option>
              </select>
              <span className="select-arrow">▼</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="contactPhone">Your Phone Number</label>
            <input
              type="text"
              id="contactPhone"
              className="register-control"
              placeholder="07XXXXXXXX"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
            />
          </div>
        </div>

        {errorMessage && (
          <p
            style={{
              color: "#ef4444",
              fontSize: "13px",
              margin: "12px 0",
              textAlign: "left",
            }}
          >
            {errorMessage}
          </p>
        )}

        <div className="form-action-row" style={{ marginTop: "24px" }}>
          <button
            type="button"
            className="btn-form-reset"
            onClick={() => console.log("setIsBookingMode(false)")}
          >
            Cancel
          </button>
          <button type="submit" className="btn-form-submit">
            Confirm Appointment Booking
          </button>
        </div>
      </form>
    </>
  );
}

export default BookingForm;
