import React from "react";
import AfterlogNavbar from "../Common/AfterlogNavbar";
import RSidebar from "../Common/RSidebar";
import Footer from "../Common/Footer";
import backIcon from "../../assets/arrow_back_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function BookingForm() {
  // Booking Form States
  const [purpose, setPurpose] = useState("Certificate Collection");
  const [bookDay, setBookDay] = useState(17);
  const [bookTime, setBookTime] = useState("2:00 PM");
  const [officerName, setOfficerName] = useState("Kamal Silva");
  const [contactNumber, setContactNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      <AfterlogNavbar />
      <div className="flex gap-[20px] flex-1">
        <div className="flex bg-[#FFFFFF]">
          {/* Sidebar content */}
          <RSidebar />
        </div>

        <div className="w-full bg-[#FFFFFF] border-l border-[#2D37482D]">
          <div
            className="flex w-[75px] p-[5px] text-[15px] items-center gap-[10px] font-regular text-[#1B365D] mt-[60px] mx-[30px] cursor-pointer border border-[red]"
            onClick={() => navigate("/RAppointment")}
          >
            <img src={backIcon} alt="pendingIcon" className="w-[16px]" />
            Back
          </div>

          <div className="flex text-[24px] font-medium text-[#1B365D] border-b-[1.5px] border-[#2D37482D] pb-3 mb-5 mt-[30px] mx-[30px]">
            Book New Appointment
          </div>

          <form>
            <div className="mx-[50px] gap-5 border border-[#2D37482D] rounded-[15px] p-[20px]">
              <div className="flex flex-col items-start gap-[2px] text-[16px] font-regular text-[#2D3748]">
                <label htmlFor="purposeSelect">Appointment Purpose:</label>
                <div className="flex bg-[#E2E8F0] border border-[#2D37484D] rounded-[5px] p-[5px] cursor-pointer">
                  <select
                    id="purposeSelect"
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
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Floating Help Trigger */}
      <button
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#D69E2E] text-white border-0 text-[20px] font-bold cursor-pointer shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-[#FFAA00]"
        aria-label="Help Trigger"
        onClick={() => console.log("Help clicked")}
      >
        ?
      </button>

      <Footer />
    </div>
  );
}

export default BookingForm;
