import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { translations, useLanguage } from "../utils/translate";
import LanguageSelector from "../Components/Common/LanguageSelector";
import { authenticatedFetch } from "../utils/api";
import { addNotification } from "../utils/notifications";
import logoImage from "../assets/logo.png";
import Footer from "../Components/Common/Footer";
import ChatbotButton from "../Components/Common/ChatbotButton";
import NotificationsDropdown from "../Components/Common/NotificationsDropdown";
import notificationIcon from "../assets/notifications_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import accountIcon from "../assets/account_circle_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";

import dashboardIcon from "../assets/team_dashboard_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import dashboardIconActive from "../assets/team_dashboard_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import officersIcon from "../assets/person_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import officersIconActive from "../assets/person_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import residentsIcon from "../assets/home_and_garden_24dp_2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import residentsIconActive from "../assets/home_and_garden_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";
import troubleshootIcon from "../assets/edit_document_24dp_F2D3748_FILL0_wght400_GRAD0_opsz24.svg";
import troubleshootIconActive from "../assets/edit_document_24dp_F7FAFC_FILL0_wght400_GRAD0_opsz24.svg";

// SearchableDropdown Component - Styled like Register page
function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder,
  required,
  label,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter options based on search term - CASE INSENSITIVE
  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.value.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSelect = (option) => {
    onChange(option.value);
    setSearchTerm("");
    setIsOpen(false);
  };

  // Get current selected label
  const getSelectedLabel = () => {
    const selected = options.find((opt) => opt.value === value);
    return selected ? selected.label : "";
  };


  return (
    <div className="flex flex-col gap-2 relative" ref={dropdownRef}>
      {label && (
        <label className="text-[14px] font-medium text-[#2D3748] text-left">
          {label}
        </label>
      )}
      <div className="relative">
        <input
      type="text"
      className="w-full px-4 py-3 bg-[#EBF1F6] border border-[#2D37482D] rounded-[8px] text-[15px] text-[#2D3748] placeholder-gray-400 focus:outline-none focus:border-[#005BBD] focus:bg-white transition-all duration-200"
      placeholder={placeholder || "Search GN division name..."}
      value={isOpen ? searchTerm : value ? getSelectedLabel() : ""}
      onFocus={() => {
        setIsOpen(true);
        setSearchTerm("");
      }}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        setIsOpen(true);
        if (e.target.value === "") {
          onChange("");
        }
      }}
      required={required}
      autoComplete="off"
    />
    <div className="absolute inset-y-0 right-0 flex items-center px-3.5 pointer-events-none text-gray-400 text-xs">
      ▼
    </div>
  </div>

  {
    isOpen && (
      <div className="absolute top-[100%] left-0 right-0 mt-1 bg-white border border-[#005BBD]/30 rounded-[8px] shadow-lg max-h-48 overflow-y-auto z-50 text-left divide-y divide-gray-100">
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <div
              key={option.value}
              className={`px-4 py-2.5 hover:bg-[#EBF1F6] cursor-pointer text-[14px] text-[#2D3748] font-medium transition-colors flex justify-between items-center ${option.value === value ? "bg-[#EBF1F6]" : ""
                }`}
              onClick={() => handleSelect(option)}
            >
              <span>{option.label}</span>
              {option.value === value && (
                <span className="text-[#005BBD] font-bold text-xs">
                  ✓ Selected
                </span>
              )}
            </div>
          ))
        ) : (
          <div className="px-4 py-3 text-xs text-gray-400 italic">
              No matching GN division found
            </div >
          )
  }
        </div >
      )
}
    </div >
  );
}

function AdminDashboard({ onOpenHelp }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();
  const t = translations[lang];

  // Session user details
  const successUser = location.state?.successUser || "System Admin";

  const adminDict = {
    EN: {
      consoleTitle: "Divisional System Admin Console",
      overview: "Dashboard Overview",
      officers: "GN Officer Accounts",
      divisions: "GN Divisions",
      residents: "Resident Profiles",
      troubleshoot: "Troubleshoot Node",
      logout: "Log Out Admin",
      systemOverview: "System Overview",
      totalGN: "Total GN Officers",
      regResidents: "Registered Residents",
      rtgsTransfers: "RTGS Money Transfers",
      serverNode: "System Server Node",
      healthy: "Healthy",
      cleared: "Cleared Gateway",
      recentLogs: "Recent System Auditing Logs",
      officerRegistry: "GN Officer Profile Registry",
      officerSub:
        "Temporarily deactivate or suspend divisional officers if they cause policy troubles.",
      divisionRegistry: "GN Division Management Registry",
      divisionSub:
        "Add, edit, or configure divisional boundaries and population metrics across the district.",
      addDivision: "Register GN Division",
      residentRegistry: "Resident Account Registry",
      residentSub:
        "Block or suspend residential profiles if they make troubles in household applications.",
      thName: "Officer Name",
      thID: "Officer ID",
      thOffice: "Divisional Office",
      thStatus: "Registry Status",
      thAction: "Actions Control",
      thDivCode: "Division Code",
      thDivName: "Division Name",
      thDistrict: "District",
      thProvince: "Province",
      thDS: "DS Division",
      thPopulation: "Population",
      thHouseholds: "Households",
      thResName: "Resident Name",
      thNIC: "NIC Number",
      thResOffice: "Household Division",
      thResStatus: "Active Status",
      troubleshootSub:
        "Flush operational caches, secure registries pipelines, and correct data inconsistencies.",
      diagnosticCenter: "Diagnostic Diagnostics Center",
      diagnosticDesc:
        "If residents experience latency or data mismatches during allowance applications or certificate requests, run the system optimization tool. This optimizes RTGS clearing queues and flushes temporary server assets.",
      runDiagnostic: "Run Diagnostics & Flush Cache",
      optimizing: "Optimizing Local Nodes...",
      diagnosticsSuccessAlert:
        "Diagnostics Sweep & Cache optimization completed successfully!",
    },
    SI: {
      consoleTitle: "කොට්ඨාස පද්ධති පරිපාලන කොන්සෝලය",
      overview: "පාලන පුවරුව",
      officers: "ග්‍රාම නිලධාරී ගිණුම්",
      divisions: "ග්‍රාම නිලධාරී කොට්ඨාස",
      residents: "ගම්වැසි ගිණුම්",
      troubleshoot: "නෝඩය දෝෂාවේක්ෂණය",
      logout: "පරිපාලක පිටවීම",
      systemOverview: "පද්ධති දළ විශ්ලේෂණය",
      totalGN: "මුළු ග්‍රාම නිලධාරීන්",
      regResidents: "ලියාපදිංචි ගම්වැසියන්",
      rtgsTransfers: "RTGS මුදල් බැර කිරීම්",
      serverNode: "පද්ධති සේවා නෝඩය",
      healthy: "නිරෝගී",
      cleared: "සම්පූර්ණයි",
      recentLogs: "මෑත කාලීන පද්ධති විගණන ලඝු-සටහන්",
      officerRegistry: "ග්‍රාම නිලධාරී පැතිකඩ ලේඛනය",
      officerSub:
        "ප්‍රතිපත්තිමය ගැටළු ඇති කරන්නේ නම් කොට්ඨාස නිලධාරීන් තාවකාලිකව අත්හිටුවන්න.",
      divisionRegistry: "ග්‍රාම නිලධාරී කොට්ඨාස කළමනාකරණ ලේඛනය",
      divisionSub:
        "කොට්ඨාස සීමාවන් සහ ජනගහන දත්ත එකතු කිරීම, සංස්කරණය කිරීම හෝ වින්‍යාස කිරීම.",
      addDivision: "ග්‍රාම නිලධාරී කොට්ඨාසයක් ලියාපදිංචි කරන්න",
      residentRegistry: "ගම්වැසි ගිණුම් ලේඛනය",
      residentSub:
        "නිවාස අයදුම්පත් වලදී ගැටළු ඇති කරන්නේ නම් ගම්වැසියන් තාවකාලිකව අත්හිටුවන්න.",
      thName: "නිලධාරී නම",
      thID: "නිලධාරී හැඳුනුම්පත",
      thOffice: "කොට්ඨාස කාර්යාලය",
      thStatus: "ලේඛන තත්ත්වය",
      thAction: "ක්‍රියාමාර්ග පාලනය",
      thDivCode: "කොට්ඨාස කේතය",
      thDivName: "කොට්ඨාසයේ නම",
      thDistrict: "දිස්ත්‍රික්කය",
      thProvince: "පළාත",
      thDS: "ප්‍රාදේශීය ලේකම් කොට්ඨාසය",
      thPopulation: "ජනගහනය",
      thHouseholds: "පවුල් ගණන",
      thResName: "ගම්වැසියාගේ නම",
      thNIC: "ජාතික හැඳුනුම්පත් අංකය",
      thResOffice: "නිවාස කොට්ඨාසය",
      thResStatus: "ක්‍රියාකාරී තත්ත්වය",
      troubleshootSub:
        "සේවා හැඹිලි මකා දමා, ලේඛන නල මාර්ග සුරක්ෂිත කර දත්ත දෝෂ නිවැරදි කරන්න.",
      diagnosticCenter: "රෝග විනිශ්චය මධ්‍යස්ථානය",
      diagnosticDesc:
        "දීමනා අයදුම්පත් හෝ සහතික ඉල්ලීම් වලදී ගම්වැසියන්ට ප්‍රමාදයක් හෝ දත්ත නොගැලපීමක් සිදුවුවහොත්, පද්ධති ප්‍රශස්තකරණ මෙවලම ක්‍රියාත්මක කරන්න.",
      runDiagnostic: "රෝග විනිශ්චය ධාවනය කර හැඹිලිය මකන්න",
      optimizing: "දේශීය නෝඩ් ප්‍රශස්තකරණය...",
      diagnosticsSuccessAlert:
        "දේශීය නෝඩ් ප්‍රශස්තකරණය සහ හැඹිලිය සාර්ථකව මකා දමන ලදී!",
    },
    TA: {
      consoleTitle: "பிரிவு கணினி நிர்வாக கன்சோல்",
      overview: "டாஷ்போர்டு மேலோட்டம்",
      officers: "கிராம நிலதாரி கணக்குகள்",
      divisions: "கிராம நிலதாரி பிரிவுகள்",
      residents: "குடியிருப்பாளர் சுயவிவரங்கள்",
      troubleshoot: "முனையைச் சரிசெய்யவும்",
      logout: "நிர்வாகி வெளியேறு",
      systemOverview: "கணினி மேலோட்டம்",
      totalGN: "மொத்த கிராம நிலதாரிகள்",
      regResidents: "பதிவு செய்யப்பட்ட குடியிருப்பாளர்கள்",
      rtgsTransfers: "RTGS பண பரிமாற்றங்கள்",
      serverNode: "கணினி சேவையக முனை",
      healthy: "ஆரோக்கியமானது",
      cleared: "பரிமாற்றம் முடிந்தது",
      recentLogs: "சமீபத்திய கணினி தணிக்கை பதிவுகள்",
      officerRegistry: "கிராம நிலதாரி சுயவிவர பதிவேடு",
      officerSub:
        "கொள்கை சிக்கல்களை ஏற்படுத்தினால் தற்காலிகமாக அதிகாரிகளை இடைநிறுத்துங்கள்.",
      divisionRegistry: "கிராம நிலதாரி பிரிவு மேலாண்மை பதிவேடு",
      divisionSub:
        "பிரிவு எல்லைகள் மற்றும் மக்கள் தொகை அளவீடுகளைச் சேர்க்கவும், திருத்தவும்.",
      addDivision: "கிராம நிலதாரி பிரிவை பதிவு செய்க",
      residentRegistry: "குடியிருப்பாளர் கணக்கு பதிவேடு",
      residentSub:
        "வீட்டு விண்ணப்பங்களில் சிக்கல்களை ஏற்படுத்தினால் குடியிருப்பாளர்களை இடைநிறுத்துங்கள்.",
      thName: "அதிகாரி பெயர்",
      thID: "அதிகாரி ஐடி",
      thOffice: "பிரிவு அலுவலகம்",
      thStatus: "பதிவேடு நிலை",
      thAction: "நடவடிக்கை கட்டுப்பாடு",
      thDivCode: "பிரிவு குறியீடு",
      thDivName: "பிரிவு பெயர்",
      thDistrict: "மாவட்டம்",
      thProvince: "மாகாணம்",
      thDS: "பிரதேச செயலக பிரிவு",
      thPopulation: "மக்கள் தொகை",
      thHouseholds: "வீடுகள்",
      thResName: "குடியிருப்பாளர் பெயர்",
      thNIC: "NIC எண்",
      thResOffice: "வீட்டுப் பிரிவு",
      thResStatus: "செயலில் உள்ள நிலை",
      troubleshootSub:
        "இயக்க தற்காலிக சேமிப்புகளை அழித்து, தரவு முரண்பாடுகளை சரிசெய்யவும்.",
      diagnosticCenter: "நோயறிதல் மையம்",
      diagnosticDesc:
        "குடியிருப்பாளர்கள் கொடுப்பனவு அல்லது சான்றிதழ் விண்ணப்பங்களின் போது தாமதத்தை எதிர்கொண்டால், கணினி மேம்படுத்தல் கருவியை இயக்கவும்.",
      runDiagnostic: "நோயறிதலை இயக்கி தற்காலிக சேமிப்பை அழிக்கவும்",
      optimizing: "உள்ளூர் முனைகளை மேம்படுத்துகிறது...",
      diagnosticsSuccessAlert:
        "நோயறிதல் மற்றும் தற்காலிக சேமிப்பு வெற்றிகரமாக அழிக்கப்பட்டது!",
    },
  };

  const dA = adminDict[lang] || adminDict.EN;

  // Tabs state: 'overview' | 'officers' | 'residents' | 'troubleshoot'
  const [activeTab, setActiveTab] = useState("overview");

  // DB list states
  const [officers, setOfficers] = useState([]);
  const [residents, setResidents] = useState([]);
  const [divisions, setDivisions] = useState([]);


  // Divisions pagination states
  const [divisionsPage, setDivisionsPage] = useState(1);
  const [divisionsLimit] = useState(20);
  const [divisionsTotal, setDivisionsTotal] = useState(0);
  const [divisionsSearch, setDivisionsSearch] = useState("");
  const [isLoadingDivisions, setIsLoadingDivisions] = useState(false);

  // Default mock seeds
  const defaultMockDivisions = [
    {
      division_id: "DIV-001",
      division_code: "GN-001A",
      name: "Maharagama",
      district: "Colombo",
      province: "Western",
      divisional_secretariat: "Maharagama DS",
      population: 15400,
      household_count: 3850,
      is_active: true,
    },
    {
      division_id: "DIV-002",
      division_code: "GN-002B",
      name: "Colombo Central",
      district: "Colombo",
      province: "Western",
      divisional_secretariat: "Colombo DS",
      population: 22100,
      household_count: 5120,
      is_active: true,
    },
  ];

  const defaultMockOfficers = [
    {
      gn_id: "GN-001",
      username: "kamal_officer",
      name: "Kamal Perera",
      email: "kamal@smartgn.gov.lk",
      mobile: "0771234567",
      division_name: "Maharagama",
      status: "Active",
    },
    {
      gn_id: "GN-002",
      username: "saman_officer",
      name: "Saman Kumara",
      email: "saman@smartgn.gov.lk",
      mobile: "0719876543",
      division_name: "Colombo Central",
      status: "Active",
    },
  ];

  const defaultMockResidents = [
    {
      r_nic: "197812345678V",
      name: "Kamala Silva",
      email: "kamala@gmail.com",
      mobile_no: "0723456789",
      division_name: "Maharagama",
      status: "Active",
      occupation: "Teacher",
      household_number: "HH-908",
    },
    {
      r_nic: "199598765432V",
      name: "Ranasinghe Banda",
      email: "ranasinghe@gmail.com",
      mobile_no: "0765432109",
      division_name: "Colombo Central",
      status: "Active",
      occupation: "Farmer",
      household_number: "HH-341",
    },
  ];

  // Helper functions to get/set from localStorage
  const getStoredDivisions = () => {
    const data = localStorage.getItem("smartgn_mock_divisions");
    if (!data) {
      localStorage.setItem(
        "smartgn_mock_divisions",
        JSON.stringify(defaultMockDivisions),
      );
      return defaultMockDivisions;
    }
    return JSON.parse(data);
  };

  const getStoredOfficers = () => {
    const data = localStorage.getItem("smartgn_mock_officers");
    if (!data) {
      localStorage.setItem(
        "smartgn_mock_officers",
        JSON.stringify(defaultMockOfficers),
      );
      return defaultMockOfficers;
    }
    return JSON.parse(data);
  };

  const getStoredResidents = () => {
    const data = localStorage.getItem("smartgn_mock_residents");
    if (!data) {
      localStorage.setItem(
        "smartgn_mock_residents",
        JSON.stringify(defaultMockResidents),
      );
      return defaultMockResidents;
    }
    return JSON.parse(data);
  };

  const saveStoredDivisions = (list) => {
    localStorage.setItem("smartgn_mock_divisions", JSON.stringify(list));
  };

  const saveStoredOfficers = (list) => {
    localStorage.setItem("smartgn_mock_officers", JSON.stringify(list));
  };

  const saveStoredResidents = (list) => {
    localStorage.setItem("smartgn_mock_residents", JSON.stringify(list));
  };

  // Modal display states
  const [showAddOfficerModal, setShowAddOfficerModal] = useState(false);
  const [showEditOfficerModal, setShowEditOfficerModal] = useState(false);
  const [showEditResidentModal, setShowEditResidentModal] = useState(false);

  const [showAddDivisionModal, setShowAddDivisionModal] = useState(false);
  const [showEditDivisionModal, setShowEditDivisionModal] = useState(false);

  const [showViewOfficerModal, setShowViewOfficerModal] = useState(false);
  const [viewOfficerData, setViewOfficerData] = useState(null);

  const handleViewOfficer = async (officer) => {
    setViewOfficerData(officer);
    setShowViewOfficerModal(true);
    try {
      const res = await authenticatedFetch(`/api/auth/admin/officers/${officer.gn_id || officer.id}`);
      if (res.ok) {
        const data = await res.json();
        setViewOfficerData((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.warn("Backend offline or error fetching officer details", err);
    }
  };

  // Form states
  const [newOfficer, setNewOfficer] = useState({
    username: "",
    name: "",
    email: "",
    mobile: "",
    division: "",
    password: "",
  });
  const [editOfficer, setEditOfficer] = useState({
    id: "",
    username: "",
    name: "",
    email: "",
    mobile: "",
    division: "",
    status: "Active",
  });
  const [editResident, setEditResident] = useState({
    nic: "",
    name: "",
    email: "",
    mobile_no: "",
    status: "Active",
    occupation: "",
    household_number: "",
  });

  const [newDivision, setNewDivision] = useState({
    division_code: "",
    name: "",
    district: "Colombo",
    province: "Western",
    divisional_secretariat: "",
    population: "",
    household_count: "",
  });
  const [editDivision, setEditDivision] = useState({
    division_id: "",
    division_code: "",
    name: "",
    district: "",
    province: "",
    divisional_secretariat: "",
    population: "",
    household_count: "",
    is_active: true,
  });

  // Diagnostic states
  const [runningDiagnostic, setRunningDiagnostic] = useState(false);
  const [diagnosticProgress, setDiagnosticProgress] = useState(0);
  const [diagnosticLogs, setDiagnosticLogs] = useState([]);

  // Convert divisions to dropdown options
  const divisionOptions = divisions.map((d) => ({
    value: d.name,
    label: `${d.name} (${d.division_code || d.name})`,
  }));

  // ============================================================
  // LOAD FUNCTIONS
  // ============================================================

  const loadDivisions = async (page = 1, search = "") => {
    setIsLoadingDivisions(true);
    try {
      const url = `/api/auth/divisions/all?page=${page}&limit=${divisionsLimit}&search=${encodeURIComponent(search)}`;
      const res = await authenticatedFetch(url);
      if (res.ok) {
        const data = await res.json();
        setDivisions(data.data || []);
        setDivisionsTotal(data.pagination?.total || 0);
        setDivisionsPage(data.pagination?.page || 1);
      } else {
        setDivisions(getStoredDivisions());
      }
    } catch (err) {
      console.warn("Backend offline. Loading local mock divisions.", err);
      setDivisions(getStoredDivisions());
    } finally {
      setIsLoadingDivisions(false);
    }
  };


  const loadOfficers = async () => {
    try {
      const res = await authenticatedFetch("/api/auth/admin/officers");
      if (res.ok) {
        const data = await res.json();
        setOfficers(data);
        saveStoredOfficers(data);
      } else {
        setOfficers(getStoredOfficers());
      }
    } catch (err) {
      console.warn("Backend offline. Loading local mock officers.", err);
      setOfficers(getStoredOfficers());
    }
  };

  const loadResidents = async () => {
    try {
      const res = await authenticatedFetch("/api/auth/admin/residents");
      if (res.ok) {
        const data = await res.json();
        setResidents(data);
        saveStoredResidents(data);
      } else {
        setResidents(getStoredResidents());
      }
    } catch (err) {
      console.warn("Backend offline. Loading local mock residents.", err);
      setResidents(getStoredResidents());
    }
  };

  // Search handler for divisions with debounce
  const openAddOfficerModal = () => {
    setNewOfficer({
      username: "",
      name: "",
      email: "",
      mobile: "",
      division: "",
      password: "",
    });
    setShowAddOfficerModal(true);
  };

  const handleDivisionsSearch = (e) => {
    const value = e.target.value;
    setDivisionsSearch(value);
    clearTimeout(window.divisionsSearchTimeout);
    window.divisionsSearchTimeout = setTimeout(() => {
      loadDivisions(1, value);
    }, 500);
  };

  useEffect(() => {
    loadDivisions(1, "");
    loadOfficers();
    loadResidents();

  }, []);

  // GN Division Handlers
  const handleCreateDivision = async (e) => {
    e.preventDefault();
    try {
      const res = await authenticatedFetch("/api/auth/admin/divisions", {
        method: "POST",
        body: JSON.stringify(newDivision),
      });
      if (res.ok) {
        alert("GN Division created successfully.");
        setShowAddDivisionModal(false);
        setNewDivision({
          division_code: "",
          name: "",
          district: "Colombo",
          province: "Western",
          divisional_secretariat: "",
          population: "",
          household_count: "",
        });
        loadDivisions(1, divisionsSearch);

        return;
      }
    } catch (error) {
      console.warn("Backend error. Simulating division creation locally.");
    }
    // Local fallback
    const list = getStoredDivisions();
    const added = {
      division_id: `DIV-${Math.floor(100 + Math.random() * 900)}`,
      division_code: newDivision.division_code,
      name: newDivision.name,
      district: newDivision.district,
      province: newDivision.province,
      divisional_secretariat: newDivision.divisional_secretariat,
      population: parseInt(newDivision.population, 10) || 0,
      household_count: parseInt(newDivision.household_count, 10) || 0,
      is_active: true,
    };
    const updated = [added, ...list];
    saveStoredDivisions(updated);
    setDivisions(updated);
    setShowAddDivisionModal(false);
    setNewDivision({
      division_code: "",
      name: "",
      district: "Colombo",
      province: "Western",
      divisional_secretariat: "",
      population: "",
      household_count: "",
    });
    alert("GN Division registered successfully (Local Simulator).");
  };

  const handleUpdateDivision = async (e) => {
    e.preventDefault();
    try {
      const res = await authenticatedFetch(
        `/api/auth/admin/divisions/${editDivision.division_id}`,
        {
          method: "PUT",
          body: JSON.stringify(editDivision),
        },
      );
      if (res.ok) {
        alert("GN Division updated successfully.");
        setShowEditDivisionModal(false);
        loadDivisions(divisionsPage, divisionsSearch);

        return;
      }
    } catch (error) {
      console.warn("Backend error. Simulating division update locally.");
    }
    // Local fallback
    const list = getStoredDivisions();
    const updated = list.map((d) =>
      d.division_id === editDivision.division_id ? { ...editDivision } : d,
    );
    saveStoredDivisions(updated);
    setDivisions(updated);
    setShowEditDivisionModal(false);
    alert("GN Division updated successfully (Local Simulator).");
  };

  const toggleDivisionStatus = async (id, currentActive) => {
    const nextActive = !currentActive;
    try {
      const res = await authenticatedFetch(
        `/api/auth/admin/divisions/${id}/status`,
        {
          method: "PUT",
          body: JSON.stringify({ is_active: nextActive }),
        },
      );
      if (res.ok) {
        alert(
          `GN Division status updated to ${nextActive ? "Active" : "Inactive"}.`,
        );
        loadDivisions(divisionsPage, divisionsSearch);

        return;
      }
    } catch (error) {
      console.warn("Backend error. Simulating toggle status locally.");
    }
    const list = getStoredDivisions();
    const updated = list.map((d) =>
      d.division_id === id ? { ...d, is_active: nextActive } : d,
    );
    saveStoredDivisions(updated);
    setDivisions(updated);
    alert(
      `GN Division status updated to ${nextActive ? "Active" : "Inactive"} (Local Simulator).`,
    );
  };

  const handleDeleteDivision = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this GN Division? This action cannot be undone.",
      )
    )
      return;
    try {
      const res = await authenticatedFetch(`/api/auth/admin/divisions/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("GN Division deleted successfully.");
        loadDivisions(divisionsPage, divisionsSearch);

        return;
      } else {
        const errData = await res.json();
        if (errData.error) {
          alert(`Error: ${errData.error}`);
          return;
        }
      }
    } catch (error) {
      console.warn("Backend error. Simulating division deletion locally.");
    }
    const list = getStoredDivisions();
    const updated = list.filter((d) => d.division_id !== id);
    saveStoredDivisions(updated);
    setDivisions(updated);
    alert("GN Division deleted successfully (Local Simulator).");
  };

  // Toggle Officer status
  const toggleOfficerStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "Active" ? "Suspended" : "Active";
    try {
      const res = await authenticatedFetch(
        `/api/auth/admin/officers/${id}/status`,
        {
          method: "PUT",
          body: JSON.stringify({ status: nextStatus }),
        },
      );
      if (res.ok) {
        alert(
          `Grama Niladhari Officer has been successfully ${nextStatus === "Active" ? "Activated" : "Deactivated & Suspended"}.`,
        );
        loadOfficers();
        return;
      }
    } catch (error) {
      console.warn("Backend error. Simulating toggle status locally.");
    }
    // Local simulation fallback
    const list = getStoredOfficers();
    const updated = list.map((o) =>
      o.gn_id === id ? { ...o, status: nextStatus } : o,
    );
    saveStoredOfficers(updated);
    setOfficers(updated);
    alert(
      `Grama Niladhari Officer has been successfully ${nextStatus === "Active" ? "Activated" : "Deactivated & Suspended"} (Local Simulator).`,
    );
  };

  // Toggle Resident status
  const toggleResidentStatus = async (nic, currentStatus) => {
    const nextStatus = currentStatus === "Active" ? "Suspended" : "Active";
    try {
      const res = await authenticatedFetch(
        `/api/auth/admin/residents/${nic}/status`,
        {
          method: "PUT",
          body: JSON.stringify({ status: nextStatus }),
        },
      );
      if (res.ok) {
        alert(
          `Resident profile has been successfully ${nextStatus === "Active" ? "Activated" : "Deactivated & Suspended"}.`,
        );
        loadResidents();
        return;
      }
    } catch (error) {
      console.warn("Backend error. Simulating toggle status locally.");
    }
    // Local simulation fallback
    const list = getStoredResidents();
    const updated = list.map((r) =>
      r.r_nic === nic ? { ...r, status: nextStatus } : r,
    );
    saveStoredResidents(updated);
    setResidents(updated);
    alert(
      `Resident profile has been successfully ${nextStatus === "Active" ? "Activated" : "Deactivated & Suspended"} (Local Simulator).`,
    );
  };

  // Delete GN Officer
  const handleDeleteOfficer = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this GN Officer account? This action cannot be undone.",
      )
    )
      return;
    try {
      const res = await authenticatedFetch(`/api/auth/admin/officers/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("GN Officer account deleted successfully.");
        loadOfficers();
        return;
      }
    } catch (error) {
      console.warn("Backend error. Simulating deletion locally.");
    }
    // Local simulation fallback
    const list = getStoredOfficers();
    const updated = list.filter((o) => o.gn_id !== id);
    saveStoredOfficers(updated);
    setOfficers(updated);
    alert("GN Officer account deleted successfully (Local Simulator).");
  };

  // Delete Resident
  const handleDeleteResident = async (nic) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this Resident account? This action cannot be undone.",
      )
    )
      return;
    try {
      const res = await authenticatedFetch(`/api/auth/admin/residents/${nic}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Resident account deleted successfully.");
        loadResidents();
        return;
      }
    } catch (error) {
      console.warn("Backend error. Simulating deletion locally.");
    }
    // Local simulation fallback
    const list = getStoredResidents();
    const updated = list.filter((r) => r.r_nic !== nic);
    saveStoredResidents(updated);
    setResidents(updated);
    alert("Resident account deleted successfully (Local Simulator).");
  };

  // Create GN Officer
  const handleCreateOfficer = async (e) => {
    e.preventDefault();
    try {
      const res = await authenticatedFetch("/api/auth/register/officer", {
        method: "POST",
        body: JSON.stringify(newOfficer),
      });
      if (res.ok) {
        addNotification("admin", {
          type: "officer",
          title: "GN Officer Registered",
          message: `Officer ${newOfficer.name} registered for ${newOfficer.division || 'system division'}.`,
          link: "/admin",
        });
        addNotification("officer", {
          type: "officer",
          title: "Welcome to SmartGN Portal",
          message: `Your GN Officer account (${newOfficer.username}) is active for ${newOfficer.division || 'assigned division'}.`,
          link: "/dashboard/officer",
        });

        alert("GN Officer account registered successfully.");
        setShowAddOfficerModal(false);
        setNewOfficer({
          username: "",
          name: "",
          email: "",
          mobile: "",
          division: "",
          password: "",
        });
        loadOfficers();
        return;
      }
    } catch (error) {
      console.warn("Backend error. Simulating officer registration locally.");
    }
    // Local simulation fallback
    const list = getStoredOfficers();
    const addedOfficer = {
      gn_id: `GN-${Math.floor(100 + Math.random() * 900)}`,
      username: newOfficer.username,
      name: newOfficer.name,
      email: newOfficer.email,
      mobile: newOfficer.mobile,
      division_name: newOfficer.division,
      status: "Active",
    };
    const updated = [...list, addedOfficer];
    saveStoredOfficers(updated);
    setOfficers(updated);
    setShowAddOfficerModal(false);
    setNewOfficer({
      username: "",
      name: "",
      email: "",
      mobile: "",
      division: "",
      password: "",
    });
    alert("GN Officer account registered successfully (Local Simulator).");
  };

  // Update GN Officer Details
  const handleUpdateOfficer = async (e) => {
    e.preventDefault();
    try {
      const res = await authenticatedFetch(
        `/api/auth/admin/officers/${editOfficer.id}`,
        {
          method: "PUT",
          body: JSON.stringify(editOfficer),
        },
      );
      if (res.ok) {
        alert("GN Officer updated successfully.");
        setShowEditOfficerModal(false);
        loadOfficers();
        return;
      }
    } catch (error) {
      console.warn("Backend error. Simulating officer update locally.");
    }
    // Local simulation fallback
    const list = getStoredOfficers();
    const updated = list.map((o) =>
      o.gn_id === editOfficer.id
        ? {
          ...o,
          username: editOfficer.username,
          name: editOfficer.name,
          email: editOfficer.email,
          mobile: editOfficer.mobile,
          division_name: editOfficer.division,
          status: editOfficer.status,
        }
        : o,
    );
    saveStoredOfficers(updated);
    setOfficers(updated);
    setShowEditOfficerModal(false);
    alert("GN Officer updated successfully (Local Simulator).");
  };

  // Update Resident Details
  const handleUpdateResident = async (e) => {
    e.preventDefault();
    try {
      const res = await authenticatedFetch(
        `/api/auth/admin/residents/${editResident.nic}`,
        {
          method: "PUT",
          body: JSON.stringify(editResident),
        },
      );
      if (res.ok) {
        alert("Resident updated successfully.");
        setShowEditResidentModal(false);
        loadResidents();
        return;
      }
    } catch (error) {
      console.warn("Backend error. Simulating resident update locally.");
    }
    // Local simulation fallback
    const list = getStoredResidents();
    const updated = list.map((r) =>
      r.r_nic === editResident.nic
        ? {
          ...r,
          name: editResident.name,
          email: editResident.email,
          mobile_no: editResident.mobile_no,
          status: editResident.status,
          occupation: editResident.occupation,
          household_number: editResident.household_number,
        }
        : r,
    );
    saveStoredResidents(updated);
    setResidents(updated);
    setShowEditResidentModal(false);
    alert("Resident updated successfully (Local Simulator).");
  };

  // Troubleshooter Diagnostic simulation
  const startTroubleshoot = () => {
    setRunningDiagnostic(true);
    setDiagnosticProgress(0);
    setDiagnosticLogs([]);

    const logSteps = [
      "RTGS-Gateway: Connecting secure fund settlement clearing nodes...",
      "Registry Audit: Fetching National Voter registries for Division Mahargama & Colombo...",
      "System Audit: Scanning active Gramaseva certifications indices...",
      "Troubleshoot: Cleaning redundant cache logs and flushed DB memory blocks...",
      "Security Sweep: Verifying signature hashes match records... No issues found.",
      "System Diagnostics: Flush Cache Success! All nodes returned clean status 200 OK.",
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < logSteps.length) {
        setDiagnosticLogs((prev) => [...prev, `[INFO] ${logSteps[step]}`]);
        setDiagnosticProgress((prev) => Math.min(prev + 18, 100));
        step++;
      } else {
        clearInterval(interval);
        setDiagnosticProgress(100);
        setRunningDiagnostic(false);
        alert("Diagnostics Sweep & Cache optimization completed successfully!");
      }
    }, 600);
  };
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#F7FAFC] text-[#2D3748]">
        {/* 1. Header */}
        <header className="flex justify-between items-center py-3 lg:py-[20px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 bg-[#EBF8FF] sticky top-0 z-[100] shadow-[0_5px_25px_rgba(0,0,0,0.12)]">
          <div className="flex w-full justify-between items-center">
            <div
              className="w-28 sm:w-32 md:w-40 lg:w-48 xl:w-56 2xl:w-64 cursor-pointer flex-shrink-0"
              onClick={() => navigate("/")}
            >
              <img src={logoImage} alt="SmartGN Logo" className="w-full h-auto" />
            </div>

            <div className="hidden md:block bg-[#1B365D]/10 text-[#1B365D] font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
              {dA.consoleTitle} - ROOT Mode
            </div>

            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-[20px]">
              <LanguageSelector />
              <NotificationsDropdown role="admin" />
              <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-[10px]">
                <div className="hidden xs:flex flex-col text-right">
                  <span className="text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-semibold text-[#D69E2E] uppercase">
                    ADMIN
                  </span>
                  <span className="text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-[16px] font-medium text-[#2D3748]">
                    {successUser}
                  </span>
                </div>
                <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-[50px] xl:h-[50px] rounded-full bg-slate-200 flex items-center justify-center border-[1.5px] border-slate-300 overflow-hidden flex-shrink-0">
                  <img
                    src={accountIcon}
                    alt="User Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

      {/* 2. Main Layout Container */}
  <div className="flex flex-1 w-full">
    <aside className="w-56 sm:w-60 md:w-68 lg:w-72 xl:w-[280px] bg-white border-r border-[#2D37482D] pt-10 pr-2 h-[calc(100vh-80px)] sticky top-[80px] overflow-y-auto flex-shrink-0">
      <nav className="flex flex-col gap-0.5 sm:gap-1 md:gap-1.5 lg:gap-2 xl:gap-[5px]">
        {/* Overview Tab */}
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 xl:gap-[10px] w-full border-none py-1.5 sm:py-2 md:py-2.5 lg:py-3 xl:py-[10px] px-3 sm:px-4 md:px-5 lg:px-6 xl:px-[30px] cursor-pointer text-[11px] sm:text-xs md:text-sm lg:text-base xl:text-[16px] font-regular text-left transition-all duration-200 rounded-r-full hover:translate-x-1 ${activeTab === "overview"
              ? "bg-[#005BBD] text-[#F7FAFC] shadow-md"
              : "bg-transparent text-[#2D3748] hover:bg-gray-50 hover:text-gray-900"
            }`}
        >
          <img
            src={
              activeTab === "overview" ? dashboardIconActive : dashboardIcon
            }
            alt="Overview Icon"
            className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-[18px] lg:h-[18px] xl:w-[20px] xl:h-[20px] object-contain flex-shrink-0"
          />
          <span className="truncate">{dA.overview}</span>
        </button>

        {/* Officers Tab */}
        <button
          onClick={() => setActiveTab("officers")}
          className={`flex items-center gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 xl:gap-[10px] w-full border-none py-1.5 sm:py-2 md:py-2.5 lg:py-3 xl:py-[10px] px-3 sm:px-4 md:px-5 lg:px-6 xl:px-[30px] cursor-pointer text-[11px] sm:text-xs md:text-sm lg:text-base xl:text-[16px] font-regular text-left transition-all duration-200 rounded-r-full hover:translate-x-1 ${activeTab === "officers"
              ? "bg-[#005BBD] text-[#F7FAFC] shadow-md"
              : "bg-transparent text-[#2D3748] hover:bg-gray-50 hover:text-gray-900"
            }`}
        >
          <img
            src={
              activeTab === "officers" ? officersIconActive : officersIcon
            }
            alt="Officers Icon"
            className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-[18px] lg:h-[18px] xl:w-[20px] xl:h-[20px] object-contain flex-shrink-0"
          />
          <span className="truncate">{dA.officers}</span>
        </button>

        {/* Divisions Tab */}
        <button
          onClick={() => setActiveTab("divisions")}
          className={`flex items-center gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 xl:gap-[10px] w-full border-none py-1.5 sm:py-2 md:py-2.5 lg:py-3 xl:py-[10px] px-3 sm:px-4 md:px-5 lg:px-6 xl:px-[30px] cursor-pointer text-[11px] sm:text-xs md:text-sm lg:text-base xl:text-[16px] font-regular text-left transition-all duration-200 rounded-r-full hover:translate-x-1 ${activeTab === "divisions"
              ? "bg-[#005BBD] text-[#F7FAFC] shadow-md"
              : "bg-transparent text-[#2D3748] hover:bg-gray-50 hover:text-gray-900"
            }`}
        >
          <span className="w-4 sm:w-4.5 md:w-5 lg:w-[18px] xl:w-[20px] text-center flex-shrink-0 font-bold">
            🏛️
          </span>
          <span className="truncate">{dA.divisions}</span>
        </button>

        {/* Residents Tab */}
        <button
          onClick={() => setActiveTab("residents")}
          className={`flex items-center gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 xl:gap-[10px] w-full border-none py-1.5 sm:py-2 md:py-2.5 lg:py-3 xl:py-[10px] px-3 sm:px-4 md:px-5 lg:px-6 xl:px-[30px] cursor-pointer text-[11px] sm:text-xs md:text-sm lg:text-base xl:text-[16px] font-regular text-left transition-all duration-200 rounded-r-full hover:translate-x-1 ${activeTab === "residents"
              ? "bg-[#005BBD] text-[#F7FAFC] shadow-md"
              : "bg-transparent text-[#2D3748] hover:bg-gray-50 hover:text-gray-900"
            }`}
        >
          <img
            src={
              activeTab === "residents"
                ? residentsIconActive
                : residentsIcon
            }
            alt="Residents Icon"
            className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-[18px] lg:h-[18px] xl:w-[20px] xl:h-[20px] object-contain flex-shrink-0"
          />
          <span className="truncate">{dA.residents}</span>
        </button>

        {/* Troubleshoot Tab */}
        <button
          onClick={() => setActiveTab("troubleshoot")}
          className={`flex items-center gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 xl:gap-[10px] w-full border-none py-1.5 sm:py-2 md:py-2.5 lg:py-3 xl:py-[10px] px-3 sm:px-4 md:px-5 lg:px-6 xl:px-[30px] cursor-pointer text-[11px] sm:text-xs md:text-sm lg:text-base xl:text-[16px] font-regular text-left transition-all duration-200 rounded-r-full hover:translate-x-1 ${activeTab === "troubleshoot"
              ? "bg-[#005BBD] text-[#F7FAFC] shadow-md"
              : "bg-transparent text-[#2D3748] hover:bg-gray-50 hover:text-gray-900"
            }`}
        >
          <img
            src={
              activeTab === "troubleshoot"
                ? troubleshootIconActive
                : troubleshootIcon
            }
            alt="Troubleshoot Icon"
            className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-[18px] lg:h-[18px] xl:w-[20px] xl:h-[20px] object-contain flex-shrink-0"
          />
          <span className="truncate">{dA.troubleshoot}</span>
        </button>

        {/* Logout */}
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 xl:gap-[10px] w-full border-none py-1.5 sm:py-2 md:py-2.5 lg:py-3 xl:py-[10px] px-3 sm:px-4 md:px-5 lg:px-6 xl:px-[30px] cursor-pointer text-[11px] sm:text-xs md:text-sm lg:text-base xl:text-[16px] font-semibold text-red-600 transition-all duration-200 rounded-r-full hover:translate-x-1 hover:bg-red-50 hover:text-red-700 mt-8"
        >
          <span className="w-5 text-center flex-shrink-0">➔</span>
          <span className="truncate">{dA.logout}</span>
        </button>
      </nav>
    </aside>

    {/* Main Content */}
    <main className="flex-1 p-10 bg-[#F7FAFC] overflow-y-auto">
      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="animate-zoom-in">
          <h2 className="text-[24px] font-bold text-[#1B365D] text-left mb-6">
            {dA.systemOverview}
          </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div className="bg-white border border-[#cbd5e1] rounded-2xl shadow-sm p-6 flex flex-col items-start text-left">
      <span className="text-sm font-semibold text-gray-500 mb-1">
        {dA.totalGN}
      </span>
      <span className="text-3xl font-extrabold text-[#1B365D]">
        2 Active
      </span>
      <span className="text-xs text-green-600 font-semibold mt-2 bg-green-50 px-2.5 py-1 rounded-full">
        Colombo, Maharagama
      </span>
    </div>
    <div className="bg-white border border-[#cbd5e1] rounded-2xl shadow-sm p-6 flex flex-col items-start text-left">
      <span className="text-sm font-semibold text-gray-500 mb-1">
        {dA.regResidents}
      </span>
      <span className="text-3xl font-extrabold text-[#1B365D]">
        1,240
      </span>
      <span className="text-xs text-green-600 font-semibold mt-2 bg-green-50 px-2.5 py-1 rounded-full">
        +12 New submissions
      </span>
    </div>
    <div className="bg-white border border-[#cbd5e1] rounded-2xl shadow-sm p-6 flex flex-col items-start text-left">
      <span className="text-sm font-semibold text-gray-500 mb-1">
        {dA.rtgsTransfers}
      </span>
      <span className="text-3xl font-extrabold text-[#1B365D]">
        Rs. 17,500
      </span>
      <span className="text-xs text-green-600 font-semibold mt-2 bg-green-50 px-2.5 py-1 rounded-full">
        {dA.cleared}
      </span>
    </div>
    <div className="bg-white border border-[#cbd5e1] rounded-2xl shadow-sm p-6 flex flex-col items-start text-left">
      <span className="text-sm font-semibold text-gray-500 mb-1">
        {dA.serverNode}
      </span>
      <span className="text-3xl font-extrabold text-green-600">
        {dA.healthy}
      </span>
      <span className="text-xs text-gray-500 font-semibold mt-2 bg-gray-50 px-2.5 py-1 rounded-full">
        DB latency: 2ms
      </span>
    </div>
  </div>

  <div className="bg-white border border-[#cbd5e1] rounded-2xl shadow-sm p-6 text-left">
    <h3 className="text-lg font-bold text-[#1B365D] border-b border-[#cbd5e1] pb-3 mb-4">
      {dA.recentLogs}
    </h3>
    <div className="font-mono text-sm text-gray-600 flex flex-col gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
      <div className="flex items-start gap-2">
        <span className="text-green-600 font-bold">[INFO]</span>
        <span>
                      [2026-06-01 12:44:02] ADMIN logged in successfully from
                      secure clearing terminal node.
                    </span >
                  </div >
    <div className="flex items-start gap-2">
      <span className="text-green-600 font-bold">[INFO]</span>
      <span>
                      [2026-06-01 12:38:15] RTGS clearing gateway disburse
                      request dished out reference ID TXN-902847120.
                    </span >
                  </div >
    <div className="flex items-start gap-2">
      <span className="text-green-600 font-bold">[INFO]</span>
      <span>
                      [2026-06-01 12:35:10] DRP API successfully authenticated
                      resident Kamala Silva (789456123V) registry checks.
                    </span >
                  </div >
                </div >
              </div >
            </div >
          )
}

          {/* TAB 2: GN OFFICERS */}
{
  activeTab === "officers" && (
    <div className="animate-zoom-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="text-left">
          <h2 className="text-[24px] font-bold text-[#1B365D] m-0">
            {dA.officerRegistry}
          </h2>
          <span className="text-sm text-gray-500 mt-1 block">
            {dA.officerSub}
          </span>
        </div>
        <button
          onClick={openAddOfficerModal}
          className="bg-[#D69E2E] hover:bg-[#b88523] text-white border-none py-2.5 px-6 rounded-full text-sm font-bold cursor-pointer transition-all shadow-md flex items-center gap-1.5"
        >
          <span>➕</span> Register GN Officer
        </button>
      </div>
      {/* Officers table */}
      <div className="bg-white border border-[#cbd5e1] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[#EBF8FF] border-b border-[#cbd5e1] text-[#1B365D] font-bold">
                <th className="p-4 sm:p-5">{dA.thName}</th>
                <th className="p-4 sm:p-5">Username</th>
                <th className="p-4 sm:p-5">{dA.thOffice}</th>
                <th className="p-4 sm:p-5">{dA.thStatus}</th>
                <th className="p-4 sm:p-5 text-right">{dA.thAction}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#cbd5e1]">
              {officers.length > 0 ? (
                officers.map((officer, idx) => (
                  <tr
                    key={officer.gn_id || idx}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4 sm:p-5 font-bold text-[#1B365D]">
                      <div
                        onClick={() => handleViewOfficer(officer)}
                        className="flex items-center gap-3 cursor-pointer hover:text-[#005BBD] transition-colors group"
                        title="Click to view officer profile"
                      >
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center border border-slate-300 overflow-hidden flex-shrink-0 group-hover:border-[#005BBD]">
                          {officer.profile_photo_path || officer.profilePhoto ? (
                            <img
                              src={officer.profile_photo_path || officer.profilePhoto}
                              alt={officer.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={accountIcon}
                              alt={officer.name || "Officer Profile"}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <span className="underline-offset-2 group-hover:underline">
                            {officer.name || `${officer.first_name || ''} ${officer.last_name || ''}`}
                          </span>
                          <div className="text-xs text-gray-500 font-normal mt-0.5">
                            {officer.email} | {officer.mobile}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 text-gray-600">
                      {officer.username}
                    </td>
                    <td className="p-4 sm:p-5 text-[#2D3748]">
                      {officer.division_name || "Not Assigned"}
                    </td>
                    <td className="p-4 sm:p-5">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full text-center ${officer.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {officer.status === "Active"
                                  ? lang === "EN"
                                    ? "Active"
                                    : lang === "SI"
                                      ? "ක්‍රියාකාරී"
                                      : "செயலில் உள்ளது"
                                  : lang === "EN"
                                    ? "Suspended"
                                    : lang === "SI"
                                      ? "අත්හිටුවා ඇත"
                                      : "இடைநிறுத்தப்பட்டுள்ளது"}
                      </span>
                    </td>
                    <td className="p-4 sm:p-5 text-right">
                      <div className="flex justify-end gap-2 items-center flex-wrap">
                        <button
                          onClick={() => handleViewOfficer(officer)}
                          className="bg-transparent border-[1.5px] border-[#005BBD] text-[#005BBD] hover:bg-blue-50 py-1.5 px-4 rounded-full text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
                          title="View officer full profile details"
                        >
                          👁️ View Profile
                        </button>
                        <button
                          onClick={() =>
                            toggleOfficerStatus(
                              officer.gn_id,
                              officer.status,
                            )
                          }
                          className={`bg-transparent border-[1.5px] py-1.5 px-4 rounded-full text-xs font-bold cursor-pointer transition-colors ${officer.status === "Active"
                              ? "border-red-500 text-red-500 hover:bg-red-50"
                              : "border-green-600 text-green-600 hover:bg-green-50"
                            }`}
                        >
                          {officer.status === "Active"
                            ? "Suspend"
                            : "Activate"}
                        </button>
                        <button
                                  onClick={() => {
                                    setEditOfficer({
                                      id: officer.gn_id,
                                      username: officer.username,
                                      name: officer.name,
                                      email: officer.email,
                                      mobile: officer.mobile,
                                      division: officer.division_name || "",
                                      status: officer.status,
                                    });
                                    setShowEditOfficerModal(true);
                                  }}
                          className="bg-transparent border-[1.5px] border-blue-500 text-blue-500 hover:bg-blue-50 py-1.5 px-4 rounded-full text-xs font-bold cursor-pointer transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteOfficer(officer.gn_id)
                          }
                          className="bg-transparent border-[1.5px] border-red-600 text-red-600 hover:bg-red-50 py-1.5 px-4 rounded-full text-xs font-bold cursor-pointer transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="p-8 text-center text-gray-500"
                  >
                    No Grama Niladhari Officers found in the system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

          {/* TAB: GN DIVISIONS - OPTIMIZED WITH PAGINATION */}
{
  activeTab === "divisions" && (
    <div className="animate-zoom-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="text-left">
          <h2 className="text-[24px] font-bold text-[#1B365D] m-0">
            {dA.divisionRegistry}
          </h2>
          <span className="text-sm text-gray-500 mt-1 block">
            {dA.divisionSub} ({divisionsTotal} total)
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search divisions..."
              value={divisionsSearch}
              onChange={handleDivisionsSearch}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800 text-sm"
            />
            <svg
              className="absolute right-3 top-2.5 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            onClick={() => setShowAddDivisionModal(true)}
            className="bg-[#D69E2E] hover:bg-[#b88523] text-white border-none py-2.5 px-6 rounded-full text-sm font-bold cursor-pointer transition-all shadow-md flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>➕</span> {dA.addDivision}
          </button>
        </div>
      </div>

      {isLoadingDivisions ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D69E2E]"></div>
          <span className="ml-3 text-gray-500">
            Loading divisions...
          </span>
        </div>
      ) : (
        <>
          <div className="bg-white border border-[#cbd5e1] rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-[#EBF8FF] border-b border-[#cbd5e1] text-[#1B365D] font-bold">
                    <th className="p-3 sm:p-4">{dA.thDivCode}</th>
                    <th className="p-3 sm:p-4">{dA.thDivName}</th>
                    <th className="p-3 sm:p-4 hidden md:table-cell">
                      {dA.thDistrict}
                    </th>
                    <th className="p-3 sm:p-4 hidden lg:table-cell">
                      {dA.thProvince}
                    </th>
                    <th className="p-3 sm:p-4 hidden xl:table-cell">
                      {dA.thDS}
                    </th>
                    <th className="p-3 sm:p-4">{dA.thPopulation}</th>
                    <th className="p-3 sm:p-4">{dA.thStatus}</th>
                    <th className="p-3 sm:p-4 text-right">
                      {dA.thAction}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#cbd5e1]">
                  {divisions.length > 0 ? (
                    divisions.map((div, idx) => {
                      const isActive =
                        div.is_active === true ||
                        div.is_active === 1 ||
                        div.is_active === "1" ||
                        div.status === "Active";
                      return (
                        <tr
                          key={
                            div.division_id || div.division_code || idx
                          }
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="p-3 sm:p-4 font-mono font-bold text-[#005BBD] text-sm">
                            {div.division_code}
                          </td>
                          <td className="p-3 sm:p-4 font-bold text-[#1B365D] text-sm">
                            {div.name}
                          </td>
                          <td className="p-3 sm:p-4 text-gray-700 text-sm hidden md:table-cell">
                            {div.district}
                          </td>
                          <td className="p-3 sm:p-4 text-gray-700 text-sm hidden lg:table-cell">
                            {div.province}
                          </td>
                          <td className="p-3 sm:p-4 text-gray-700 text-sm hidden xl:table-cell">
                            {div.divisional_secretariat}
                          </td>
                          <td className="p-3 sm:p-4 text-gray-700 font-medium text-sm">
                            {Number(
                              div.population || 0,
                            ).toLocaleString()}
                          </td>
                          <td className="p-3 sm:p-4">
                            <span
                              className={`text-xs font-bold px-2 py-1 rounded-full text-center ${isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                                }`}
                            >
                                      {isActive
                                        ? lang === "EN"
                                          ? "Active"
                                          : lang === "SI"
                                            ? "ක්‍රියාකාරී"
                                            : "செயலில் உள்ளது"
                                        : lang === "EN"
                                          ? "Inactive"
                                          : lang === "SI"
                                            ? "අක්‍රියයි"
                                            : "செயலற்றது"}
                                    </span >
                                  </td >
    <td className="p-3 sm:p-4 text-right">
      <div className="flex justify-end gap-1.5 items-center flex-wrap">
        <button
          onClick={() =>
            toggleDivisionStatus(
              div.division_id ||
              div.division_code,
              isActive,
            )
          }
          className={`bg-transparent border-[1.5px] py-1 px-3 rounded-full text-xs font-bold cursor-pointer transition-colors ${isActive
              ? "border-red-500 text-red-500 hover:bg-red-50"
              : "border-green-600 text-green-600 hover:bg-green-50"
            }`}
        >
          {isActive ? "Deactivate" : "Activate"}
        </button>
        <button
          onClick={() => {
            setEditDivision({
              division_id: div.division_id,
              division_code: div.division_code,
              name: div.name,
              district: div.district,
              province: div.province,
              divisional_secretariat:
                div.divisional_secretariat,
              population: div.population || "",
              household_count:
                div.household_count || "",
              is_active: isActive,
            });
            setShowEditDivisionModal(true);
          }}
          className="bg-transparent border-[1.5px] border-blue-500 text-blue-500 hover:bg-blue-50 py-1 px-3 rounded-full text-xs font-bold cursor-pointer transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() =>
            handleDeleteDivision(
              div.division_id ||
              div.division_code,
            )
          }
          className="bg-transparent border-[1.5px] border-red-600 text-red-600 hover:bg-red-50 py-1 px-3 rounded-full text-xs font-bold cursor-pointer transition-colors"
        >
          Delete
        </button>
      </div>
    </td>
                                </tr >
                              );
})
                          ) : (
  <tr>
    <td
      colSpan="8"
      className="p-8 text-center text-gray-500"
    >
      {divisionsSearch
        ? "No GN Divisions match your search."
        : "No GN Divisions configured in the system."}
    </td>
  </tr>
)}
                        </tbody >
                      </table >
                    </div >
                  </div >
                  {/* Pagination Controls */}
{
  divisionsTotal > divisionsLimit && (
    <div className="flex justify-between items-center mt-4 px-2">
      <span className="text-sm text-gray-500">
        Showing {(divisionsPage - 1) * divisionsLimit + 1} -{" "}
        {Math.min(
          divisionsPage * divisionsLimit,
          divisionsTotal,
        )}{" "}
        of {divisionsTotal}
      </span>
      <div className="flex gap-2">
        <button
          onClick={() =>
            loadDivisions(divisionsPage - 1, divisionsSearch)
          }
          disabled={divisionsPage <= 1}
          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${divisionsPage <= 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
        >
          Previous
        </button>
        <button
          onClick={() =>
            loadDivisions(divisionsPage + 1, divisionsSearch)
          }
          disabled={
            divisionsPage >=
            Math.ceil(divisionsTotal / divisionsLimit)
          }
          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${divisionsPage >=
              Math.ceil(divisionsTotal / divisionsLimit)
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
        >
          Next
        </button>
      </div>
    </div>
  )
}
                </>
              )}
            </div >
          )}

{/* TAB 3: RESIDENTS */ }
{
  activeTab === "residents" && (
    <div className="animate-zoom-in">
      <div className="text-left mb-6">
        <h2 className="text-[24px] font-bold text-[#1B365D] m-0">
          {dA.residentRegistry}
        </h2>
        <span className="text-sm text-gray-500 mt-1 block">
          {dA.residentSub}
        </span>
      </div>
      {/* Residents table */}
      <div className="bg-white border border-[#cbd5e1] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[#EBF8FF] border-b border-[#cbd5e1] text-[#1B365D] font-bold">
                <th className="p-4 sm:p-5">{dA.thResName}</th>
                <th className="p-4 sm:p-5">{dA.thNIC}</th>
                <th className="p-4 sm:p-5">{dA.thResOffice}</th>
                <th className="p-4 sm:p-5">{dA.thResStatus}</th>
                <th className="p-4 sm:p-5 text-right">{dA.thAction}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#cbd5e1]">
              {residents.length > 0 ? (
                residents.map((resident, idx) => (
                  <tr
                    key={resident.r_nic || idx}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4 sm:p-5 font-bold text-[#1B365D]">
                      <div>{resident.name}</div>
                      <div className="text-xs text-gray-500 font-normal mt-0.5">
                        {resident.email} | {resident.mobile_no}
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 text-gray-600">
                      {resident.r_nic}
                    </td>
                    <td className="p-4 sm:p-5 text-[#2D3748]">
                      {resident.division_name || "Not Specified"}
                    </td>
                    <td className="p-4 sm:p-5">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full text-center ${resident.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {resident.status === "Active"
                                  ? lang === "EN"
                                    ? "Active"
                                    : lang === "SI"
                                      ? "ක්‍රියාකාරී"
                                      : "செயலில் உள்ளது"
                                  : lang === "EN"
                                    ? "Suspended"
                                    : lang === "SI"
                                      ? "අත්හිටුවා ඇත"
                                      : "இடைநிறுத்தப்பட்டுள்ளது"}
                      </span>
                    </td>
                    <td className="p-4 sm:p-5 text-right">
                      <div className="flex justify-end gap-2 items-center flex-wrap">
                        <button
                          onClick={() =>
                            toggleResidentStatus(
                              resident.r_nic,
                              resident.status,
                            )
                          }
                          className={`bg-transparent border-[1.5px] py-1.5 px-4 rounded-full text-xs font-bold cursor-pointer transition-colors ${resident.status === "Active"
                              ? "border-red-500 text-red-500 hover:bg-red-50"
                              : "border-green-600 text-green-600 hover:bg-green-50"
                            }`}
                        >
                          {resident.status === "Active"
                            ? "Suspend"
                            : "Activate"}
                        </button>
                        <button
                          onClick={() => {
                            setEditResident({
                              nic: resident.r_nic,
                              name: resident.name,
                              email: resident.email,
                              mobile_no: resident.mobile_no,
                              status: resident.status,
                              occupation: resident.occupation || "",
                              household_number:
                                resident.household_number || "",
                            });
                            setShowEditResidentModal(true);
                          }}
                          className="bg-transparent border-[1.5px] border-blue-500 text-blue-500 hover:bg-blue-50 py-1.5 px-4 rounded-full text-xs font-bold cursor-pointer transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteResident(resident.r_nic)
                          }
                          className="bg-transparent border-[1.5px] border-red-600 text-red-600 hover:bg-red-50 py-1.5 px-4 rounded-full text-xs font-bold cursor-pointer transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="p-8 text-center text-gray-500"
                  >
                    No Registered Residents found in the system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

{/* TAB 4: TROUBLESHOOT */ }
{
  activeTab === "troubleshoot" && (
    <div className="animate-zoom-in">
      <div className="text-left mb-6">
        <h2 className="text-[24px] font-bold text-[#1B365D] m-0">
          {dA.troubleshoot}
        </h2>
        <span className="text-sm text-gray-500 mt-1 block">
          {dA.troubleshootSub}
        </span>
      </div>

      <div className="bg-white border border-[#cbd5e1] rounded-2xl shadow-sm p-8 text-left">
        <h3 className="text-lg font-bold text-[#1B365D] mb-3">
          {dA.diagnosticCenter}
        </h3>

        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          {dA.diagnosticDesc}
        </p>

        {runningDiagnostic && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-[#D69E2E] font-bold mb-2">
              <span>
                {lang === "EN"
                  ? "Running Security Diagnostics & Flush cache..."
                          : lang === "SI"
                            ? "ආරක්ෂක රෝග විනිශ්චය ධාවනය වේ..."
                            : "பாதுகாப்பு நோயறிதல் இயங்குகிறது..."}
              </span>
              <span>{diagnosticProgress}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
              <div
                className="h-full bg-[#D69E2E] transition-all duration-300 rounded-full"
                style={{ width: `${diagnosticProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {diagnosticLogs.length > 0 && (
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 font-mono text-xs text-sky-400 h-44 overflow-y-auto mb-6 flex flex-col gap-1.5 shadow-inner">
            {diagnosticLogs.map((log, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="text-slate-500">[{idx + 1}]</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={startTroubleshoot}
          disabled={runningDiagnostic}
          className={`border-none py-3 px-8 rounded-full text-sm font-bold text-white transition-all shadow-md flex items-center gap-1.5 ${runningDiagnostic
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#D69E2E] hover:bg-[#b88523] cursor-pointer"
            }`}
        >
          {runningDiagnostic ? dA.optimizing : `🔧 ${dA.runDiagnostic}`}
        </button>
      </div>
    </div>
  )
}

{/* Floating Help Trigger */}
<ChatbotButton onOpenHelp={onOpenHelp} />
        </main >
      </div >

  {/* Footer */ }
  < Footer />

  {/* MODALS */ }
{
  showAddOfficerModal && (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex justify-center items-center p-4">
      <div className="bg-white border border-[#cbd5e1] rounded-3xl p-8 max-w-lg w-full shadow-2xl text-left animate-zoom-in">
        <h3 className="margin-0 text-xl font-bold text-[#1B365D] mb-4">
          Register GN Officer
        </h3>
        <form onSubmit={handleCreateOfficer}>
          <div className="flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">
                Username
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800"
                value={newOfficer.username}
                onChange={(e) =>
                  setNewOfficer({ ...newOfficer, username: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">
                Name
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800"
                value={newOfficer.name}
                onChange={(e) =>
                  setNewOfficer({ ...newOfficer, name: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800"
                value={newOfficer.email}
                onChange={(e) =>
                  setNewOfficer({ ...newOfficer, email: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">
                Mobile
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800"
                value={newOfficer.mobile}
                onChange={(e) =>
                  setNewOfficer({ ...newOfficer, mobile: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[14px] font-medium text-[#2D3748] text-left">
                GN Division
              </label>
              <SearchableDropdown
                options={divisionOptions}
                value={newOfficer.division}
                onChange={(value) =>
                  setNewOfficer({ ...newOfficer, division: value })
                }
                placeholder="Search GN division name..."
                required={true}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800"
                value={newOfficer.password}
                onChange={(e) =>
                  setNewOfficer({ ...newOfficer, password: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setShowAddOfficerModal(false)}
              className="px-5 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 cursor-pointer font-bold transition-all text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full border-none bg-[#D69E2E] hover:bg-[#b88523] text-white cursor-pointer font-bold transition-all text-xs"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

{
  showEditOfficerModal && (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex justify-center items-center p-4">
      <div className="bg-white border border-[#cbd5e1] rounded-3xl p-8 max-w-lg w-full shadow-2xl text-left animate-zoom-in">
        <h3 className="margin-0 text-xl font-bold text-[#1B365D] mb-4">
          Edit GN Officer
        </h3>
        <form onSubmit={handleUpdateOfficer}>
          <div className="flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">
                Username
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800"
                value={editOfficer.username}
                onChange={(e) =>
                  setEditOfficer({
                    ...editOfficer,
                    username: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">
                Name
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800"
                value={editOfficer.name}
                onChange={(e) =>
                  setEditOfficer({ ...editOfficer, name: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800"
                value={editOfficer.email}
                onChange={(e) =>
                  setEditOfficer({ ...editOfficer, email: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">
                Mobile
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800"
                value={editOfficer.mobile}
                onChange={(e) =>
                  setEditOfficer({ ...editOfficer, mobile: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[14px] font-medium text-[#2D3748] text-left">
                GN Division
              </label>
              <SearchableDropdown
                options={divisionOptions}
                value={editOfficer.division}
                onChange={(value) =>
                  setEditOfficer({ ...editOfficer, division: value })
                }
                placeholder="Search GN division name..."
                required={true}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">
                Status
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800 h-10"
                value={editOfficer.status}
                onChange={(e) =>
                  setEditOfficer({ ...editOfficer, status: e.target.value })
                }
              >
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setShowEditOfficerModal(false)}
              className="px-5 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 cursor-pointer font-bold transition-all text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full border-none bg-[#D69E2E] hover:bg-[#b88523] text-white cursor-pointer font-bold transition-all text-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

{/* REGISTER GN DIVISION MODAL */ }
{
  showAddDivisionModal && (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex justify-center items-center p-4">
      <div className="bg-white border border-[#cbd5e1] rounded-3xl p-8 max-w-lg w-full shadow-2xl text-left animate-zoom-in">
        <h3 className="margin-0 text-xl font-bold text-[#1B365D] mb-4">
          Register GN Division
        </h3>
        <form onSubmit={handleCreateDivision}>
          <div className="flex flex-col gap-4 text-left">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500">
                  Division Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GN-003C"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800"
                  value={newDivision.division_code}
                  onChange={(e) =>
                    setNewDivision({
                      ...newDivision,
                      division_code: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500">
                  Division Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dehiwala North"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800"
                  value={newDivision.name}
                  onChange={(e) =>
                    setNewDivision({ ...newDivision, name: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500">
                  District
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800"
                  value={newDivision.district}
                  onChange={(e) =>
                    setNewDivision({
                      ...newDivision,
                      district: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500">
                  Province
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800"
                  value={newDivision.province}
                  onChange={(e) =>
                    setNewDivision({
                      ...newDivision,
                      province: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">
                Divisional Secretariat (DS Division)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dehiwala DS Office"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800"
                value={newDivision.divisional_secretariat}
                onChange={(e) =>
                  setNewDivision({
                    ...newDivision,
                    divisional_secretariat: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500">
                  Est. Population
                </label>
                <input
                  type="number"
                  placeholder="e.g. 12500"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800"
                  value={newDivision.population}
                  onChange={(e) =>
                    setNewDivision({
                      ...newDivision,
                      population: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500">
                  Household Count
                </label>
                <input
                  type="number"
                  placeholder="e.g. 3100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800"
                  value={newDivision.household_count}
                  onChange={(e) =>
                    setNewDivision({
                      ...newDivision,
                      household_count: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setShowAddDivisionModal(false)}
              className="px-5 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 cursor-pointer font-bold transition-all text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full border-none bg-[#D69E2E] hover:bg-[#b88523] text-white cursor-pointer font-bold transition-all text-xs"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

{/* EDIT GN DIVISION MODAL */ }
{
  showEditDivisionModal && (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex justify-center items-center p-4">
      <div className="bg-white border border-[#cbd5e1] rounded-3xl p-8 max-w-lg w-full shadow-2xl text-left animate-zoom-in">
        <h3 className="margin-0 text-xl font-bold text-[#1B365D] mb-4">
          Edit GN Division
        </h3>
        <form onSubmit={handleUpdateDivision}>
          <div className="flex flex-col gap-4 text-left">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500">
                  Division Code
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800"
                  value={editDivision.division_code}
                  onChange={(e) =>
                    setEditDivision({
                      ...editDivision,
                      division_code: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500">
                  Division Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800"
                  value={editDivision.name}
                  onChange={(e) =>
                    setEditDivision({
                      ...editDivision,
                      name: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500">
                  District
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800"
                  value={editDivision.district}
                  onChange={(e) =>
                    setEditDivision({
                      ...editDivision,
                      district: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500">
                  Province
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800"
                  value={editDivision.province}
                  onChange={(e) =>
                    setEditDivision({
                      ...editDivision,
                      province: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">
                Divisional Secretariat (DS Division)
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800"
                value={editDivision.divisional_secretariat}
                onChange={(e) =>
                  setEditDivision({
                    ...editDivision,
                    divisional_secretariat: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500">
                  Est. Population
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800"
                  value={editDivision.population}
                  onChange={(e) =>
                    setEditDivision({
                      ...editDivision,
                      population: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500">
                  Household Count
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800"
                  value={editDivision.household_count}
                  onChange={(e) =>
                    setEditDivision({
                      ...editDivision,
                      household_count: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">
                Status
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800 h-10"
                value={editDivision.is_active ? "Active" : "Inactive"}
                onChange={(e) =>
                  setEditDivision({
                    ...editDivision,
                    is_active: e.target.value === "Active",
                  })
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setShowEditDivisionModal(false)}
              className="px-5 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 cursor-pointer font-bold transition-all text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full border-none bg-[#D69E2E] hover:bg-[#b88523] text-white cursor-pointer font-bold transition-all text-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

{
  showEditResidentModal && (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex justify-center items-center p-4">
      <div className="bg-white border border-[#cbd5e1] rounded-3xl p-8 max-w-lg w-full shadow-2xl text-left animate-zoom-in">
        <h3 className="margin-0 text-xl font-bold text-[#1B365D] mb-4">
          Edit Resident Account
        </h3>
        <form onSubmit={handleUpdateResident}>
          <div className="flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">
                NIC Number (ReadOnly)
              </label>
              <input
                type="text"
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                value={editResident.nic}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">
                Name
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800"
                value={editResident.name}
                onChange={(e) =>
                  setEditResident({ ...editResident, name: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800"
                value={editResident.email}
                onChange={(e) =>
                  setEditResident({
                    ...editResident,
                    email: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">
                Mobile
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800"
                value={editResident.mobile_no}
                onChange={(e) =>
                  setEditResident({
                    ...editResident,
                    mobile_no: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">
                Occupation
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800"
                value={editResident.occupation}
                onChange={(e) =>
                  setEditResident({
                    ...editResident,
                    occupation: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">
                Household Number
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800"
                value={editResident.household_number}
                onChange={(e) =>
                  setEditResident({
                    ...editResident,
                    household_number: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">
                Status
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005BBD] bg-white text-gray-800 h-10"
                value={editResident.status}
                onChange={(e) =>
                  setEditResident({
                    ...editResident,
                    status: e.target.value,
                  })
                }
              >
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setShowEditResidentModal(false)}
              className="px-5 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 cursor-pointer font-bold transition-all text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full border-none bg-[#D69E2E] hover:bg-[#b88523] text-white cursor-pointer font-bold transition-all text-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
{
  showViewOfficerModal && viewOfficerData && (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#cbd5e1] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-left animate-zoom-in my-8">
        {/* Modal Header */}
        <div className="flex justify-between items-start border-b border-gray-100 pb-4 mb-5">
          <div>
            <span className="text-xs font-bold text-[#D69E2E] uppercase tracking-wider">
              Grama Niladhari Profile
            </span>
            <h3 className="text-xl font-extrabold text-[#1B365D] m-0">
              {viewOfficerData.name || `${viewOfficerData.first_name || ""} ${viewOfficerData.last_name || ""}`}
            </h3>
          </div>
          <button
            onClick={() => setShowViewOfficerModal(false)}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold border-0 cursor-pointer text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-[#EBF8FF] border border-[#005BBD]/20 rounded-2xl p-5 mb-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white border-2 border-[#005BBD] overflow-hidden flex-shrink-0 shadow-sm flex items-center justify-center">
            {viewOfficerData.profile_photo_path || viewOfficerData.profilePhoto ? (
              <img
                src={viewOfficerData.profile_photo_path || viewOfficerData.profilePhoto}
                alt="Officer Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={accountIcon}
                alt="Officer Profile"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4 className="font-bold text-base text-[#1B365D] truncate m-0">
                {viewOfficerData.name || viewOfficerData.full_name || "GN Officer"}
              </h4>
              <span
                className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  viewOfficerData.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {viewOfficerData.status || "Active"}
              </span>
            </div>
            <p className="text-xs text-gray-600 m-0">
              Officer ID: <span className="font-semibold text-slate-800">{viewOfficerData.gn_id || viewOfficerData.id || "GN-OFFICER"}</span>
            </p>
            <p className="text-xs text-[#005BBD] font-semibold m-0 mt-0.5">
              🏛️ {viewOfficerData.division_name || viewOfficerData.division || "Divisional Office"}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col gap-1">
            <span className="text-gray-400 font-semibold uppercase text-[10px]">Username</span>
            <span className="font-bold text-slate-800 text-sm">{viewOfficerData.username || "N/A"}</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col gap-1">
            <span className="text-gray-400 font-semibold uppercase text-[10px]">Mobile Contact</span>
            <span className="font-bold text-slate-800 text-sm">{viewOfficerData.mobile || "N/A"}</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col gap-1 sm:col-span-2">
            <span className="text-gray-400 font-semibold uppercase text-[10px]">Email Address</span>
            <span className="font-bold text-slate-800 text-sm break-all">{viewOfficerData.email || "N/A"}</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col gap-1">
            <span className="text-gray-400 font-semibold uppercase text-[10px]">Divisional Office</span>
            <span className="font-bold text-slate-800 text-sm">{viewOfficerData.division_name || viewOfficerData.division || "Not Assigned"}</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col gap-1">
            <span className="text-gray-400 font-semibold uppercase text-[10px]">Account Registered</span>
            <span className="font-bold text-slate-800 text-sm">
              {viewOfficerData.created_at
                ? new Date(viewOfficerData.created_at).toLocaleDateString()
                : "Active Record"}
            </span>
          </div>
        </div>

        {/* Verification status */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-800">
            <span className="font-semibold flex items-center gap-1.5">
              <span>✅</span> Verified Divisional Grama Niladhari Officer
            </span>
            <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
              Verified
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => {
              setShowViewOfficerModal(false);
              setEditOfficer({
                id: viewOfficerData.gn_id || viewOfficerData.id,
                username: viewOfficerData.username,
                name: viewOfficerData.name || `${viewOfficerData.first_name || ""} ${viewOfficerData.last_name || ""}`,
                email: viewOfficerData.email,
                mobile: viewOfficerData.mobile,
                division: viewOfficerData.division_name || viewOfficerData.division || "",
                status: viewOfficerData.status || "Active",
              });
              setShowEditOfficerModal(true);
            }}
            className="px-5 py-2 rounded-full border border-blue-500 text-blue-600 bg-white hover:bg-blue-50 cursor-pointer font-bold transition-all text-xs"
          >
            ✏️ Edit Profile
          </button>
          <button
            type="button"
            onClick={() => setShowViewOfficerModal(false)}
            className="px-6 py-2 rounded-full border-none bg-[#1B365D] hover:bg-[#005BBD] text-white cursor-pointer font-bold transition-all text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
    </div >
  );
}

export default AdminDashboard;
