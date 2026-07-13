import React from "react";
import AfterlogNavbar from "../Common/AfterlogNavbar";
import RSidebar from "../Common/RSidebar";
import backIcon from "../../assets/arrow_back_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import { useLanguage } from "../../utils/translate";
import { useNavigate } from "react-router-dom";
import Footer from "../Common/Footer";

function ProfileDetails() {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const ProfileTranslations = {
    EN: {
      back: "Back",
      Title: "Profile Details",
    },

    SI: { back: "ආපසු", Title: "ප්‍රිෆයිල් විස්තර" },

    TA: { back: "பின்னால்", Title: "சுயவிவர விபரங்கள்" },
  };

  const t = ProfileTranslations[lang] || ProfileTranslations.EN;

  const profileData = {
    id: 1,
    name: "John Doe",
    nic: "123456789V",
    dob: "1990-01-01",
    gender: "Male",
    address: "123 Main Street, City, Country",
    contact: "0771234567",
  };

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      <AfterlogNavbar />

      <div className="flex gap-[20px] flex-1">
        <div className="flex bg-[#FFFFFF]">
          <RSidebar />
        </div>

        <div className="w-full bg-[#FFFFFF] border-l border-[#2D37482D]">
          {/* Back Button */}
          <div
            className="flex w-[75px] p-[5px] text-[15px] items-center gap-[10px] font-regular text-[#1B365D] mt-[60px] mx-[30px] cursor-pointer"
            onClick={() => navigate("/OfficerDashboard/ResidentsDetails")}
          >
            <img src={backIcon} alt="backIcon" className="w-[16px]" />
            {t.back}
          </div>

          <div className="flex text-[24px] font-medium text-[#1B365D] border-b border-[#2D37482D] pb-[10px]  mt-[30px] mx-[30px]">
            {t.Title}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ProfileDetails;
