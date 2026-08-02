import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { translations, useLanguage } from "../utils/translate";
import { getAuthHeaders } from "../utils/api";
import OfficerNavbar from "../Components/Common/OfficerNavbar";
import OSidebar from "../Components/Common/OSidebar";
import Footer from "../Components/Common/Footer";

function OfficerDisasterReports({ onOpenHelp }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();
  const t = translations[lang];

  const successUser =
    location.state?.successUser ||
    localStorage.getItem("smartgn_user_name") ||
    "Kamal Perera";
  const officerIdVal =
    location.state?.officerId ||
    localStorage.getItem("smartgn_user_id") ||
    "GN-BORELLA";

  const [disasters, setDisasters] = useState([]);
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSeverity, setModalSeverity] = useState("MEDIUM");
  const [modalStatus, setModalStatus] = useState("Pending");
  const [modalRemarks, setModalRemarks] = useState("");
  const [modalReliefProvided, setModalReliefProvided] = useState("");
  const [modalRejectionReason, setModalRejectionReason] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadDisasters = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/disasters/officer", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to load disasters.");
      }
      const data = await response.json();
      const formatted = data.map((item) => ({
        id: item.disaster_request_id,
        type: item.disaster_type,
        severity: item.severity,
        location: item.location,
        reporter: item.resident_name || "Resident",
        date: item.request_date ? item.request_date.split("T")[0] : "",
        description: item.description,
        contact: item.contact_number,
        aidRequested: item.aid_requested || "None specified",
        status: item.status,
        remarks: item.officer_remarks || "",
        rejectionReason: item.rejection_reason || "",
        reliefProvided: item.relief_provided || "",
        residentNic: item.resident_nic,
        imagePath: item.image_path || item.damageImage || null,
      }));
      setDisasters(formatted);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error loading disasters.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDisasters();
  }, []);

  const handleOpenActionModal = (disaster) => {
    setSelectedDisaster(disaster);
    setModalSeverity(disaster.severity);
    setModalStatus(disaster.status || "Pending");
    setModalRemarks(disaster.remarks || "");
    setModalReliefProvided(disaster.reliefProvided || "");
    setModalRejectionReason(disaster.rejectionReason || "");
    setIsModalOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedDisaster) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/disasters/officer/${selectedDisaster.id}/approve`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            officerRemarks: modalRemarks || "Approved for relief assistance.",
            reliefProvided:
              modalReliefProvided || "Relief assistance approved.",
            estimatedDamage: 0,
          }),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to approve disaster report.");
      }

      setIsModalOpen(false);
      setSelectedDisaster(null);
      await loadDisasters();
      alert(
        "Disaster report approved successfully! Relief coordination initiated.",
      );
    } catch (err) {
      alert(err.message || "Error approving report.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedDisaster) return;

    setIsLoading(true);
    try {
      const rejectionReason =
        modalRejectionReason || "Does not meet disaster relief criteria.";

      const response = await fetch(
        `/api/disasters/officer/${selectedDisaster.id}/reject`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            rejectionReason: rejectionReason,
            officerRemarks: modalRemarks || "Report rejected.",
          }),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to reject disaster report.");
      }

      setIsModalOpen(false);
      setSelectedDisaster(null);
      await loadDisasters();
      alert("Disaster report rejected.");
    } catch (err) {
      alert(err.message || "Error rejecting report.");
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityDisplay = (severity) => {
    const map = {
      LOW: "low severity",
      MEDIUM: "medium severity",
      HIGH: "high severity",
      CRITICAL: "critical severity",
    };
    return map[severity] || severity?.toLowerCase() || "medium severity";
  };

  const getSeverityBadgeClass = (severity) => {
    if (severity === "HIGH" || severity === "CRITICAL") {
      return "bg-rose-100 text-rose-800";
    } else if (severity === "MEDIUM") {
      return "bg-amber-100 text-amber-800";
    }
    return "bg-slate-100 text-slate-800";
  };

  const getStatusBadgeClass = (status) => {
    if (status === "Resolved" || status === "Approved") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    } else if (status === "Pending") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    } else if (status === "Rejected") {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    return "bg-sky-50 text-sky-700 border-sky-200";
  };

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] text-[#2D3748] flex flex-col">
      <OfficerNavbar />

      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-[20px]">
        <div className="hidden md:block bg-white">
          <OSidebar />
        </div>

        <div className="w-full bg-white border-l-0 md:border-l border-[#2D37482D] p-4 sm:p-6 md:p-8 lg:p-[30px] flex flex-col">
          <div className="text-left mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[24px] font-bold text-[#1B365D] m-0">
              Disaster Management Queue
            </h2>
            <p className="text-sm text-[#64748b] mt-1">
              Monitor disaster reports, evaluate damage severity, and dispatch
              emergency relief aid.
            </p>
            {error && (
              <div className="mt-2 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm">
                {error}
              </div>
            )}
          </div>

          {isLoading && !disasters.length ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005BBD]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {disasters.length === 0 ? (
                <div className="md:col-span-2 py-12 text-center bg-white border border-gray-200 rounded-2xl text-gray-500 font-medium">
                  No disaster reports filed in your division currently.
                </div>
              ) : (
                disasters.map((disaster) => {
                  const severityDisplay = getSeverityDisplay(disaster.severity);
                  const isHigh =
                    disaster.severity === "HIGH" ||
                    disaster.severity === "CRITICAL";

                  return (
                    <div
                      key={disaster.id}
                      className={`border rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-4 transition-all shadow-xs ${
                        isHigh
                          ? "border-rose-300 bg-rose-50/20 hover:border-rose-400"
                          : disaster.severity === "MEDIUM"
                            ? "border-amber-300 bg-amber-50/20 hover:border-amber-400"
                            : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-3">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center 
                              ${
                                isHigh
                                  ? "bg-rose-100 text-rose-700"
                                  : disaster.severity === "MEDIUM"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                              >
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                              </svg>
                            </div>
                            <h3 className="text-base font-bold text-[#1B365D] m-0">
                              {disaster.type}
                            </h3>
                          </div>

                          <span
                            className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${getSeverityBadgeClass(disaster.severity)}`}
                          >
                            {severityDisplay}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-gray-500 font-semibold mb-2">
                          <div className="flex items-center gap-2">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              className="text-gray-400"
                            >
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                              <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            <span className="truncate">
                              {disaster.location}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              className="text-gray-400"
                            >
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span className="truncate">
                              {disaster.reporter}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              className="text-gray-400"
                            >
                              <rect
                                x="3"
                                y="4"
                                width="18"
                                height="18"
                                rx="2"
                                ry="2"
                              ></rect>
                              <line x1="16" y1="2" x2="16" y2="6"></line>
                              <line x1="8" y1="2" x2="8" y2="6"></line>
                              <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <span>{disaster.date}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadgeClass(disaster.status)}`}
                            >
                              {disaster.status || "Pending"}
                            </span>
                          </div>
                        </div>

                        {disaster.status === "Rejected" &&
                          disaster.rejectionReason && (
                            <div className="mt-2 p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs">
                              <strong>Rejection Reason:</strong>{" "}
                              {disaster.rejectionReason}
                            </div>
                          )}
                      </div>

                      {disaster.status === "Pending" ? (
                        <button
                          onClick={() => handleOpenActionModal(disaster)}
                          className="w-full bg-[#005BBD] hover:bg-[#1B365D] text-white border-0 py-2.5 px-4 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-2"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          Review & Take Action
                        </button>
                      ) : (
                        <div className="w-full bg-gray-100 text-gray-600 py-2.5 px-4 rounded-xl text-xs font-semibold text-center">
                          {disaster.status} - No further action required
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Modal */}
      {isModalOpen && selectedDisaster && (
        <div className="fixed inset-0 bg-[#0f172a]/65 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl flex flex-col my-8 relative text-left">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-[#1B365D]">
                Disaster Damage Report Review
              </h3>
              <button
                className="bg-transparent border-0 text-gray-400 hover:text-gray-600 text-2xl cursor-pointer"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close Modal"
              >
                &times;
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-5 text-left">
              {/* Report Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-gray-400">
                    Disaster Type
                  </span>
                  <span className="font-semibold text-gray-800">
                    {selectedDisaster.type}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-gray-400">
                    Report Date
                  </span>
                  <span className="font-semibold text-gray-800">
                    {selectedDisaster.date}
                  </span>
                </div>

                <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
                  <span className="text-xs font-bold text-gray-400">
                    Location / Area
                  </span>
                  <span className="font-semibold text-gray-800">
                    {selectedDisaster.location}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-gray-400">
                    Reporter Name
                  </span>
                  <span className="font-semibold text-gray-800">
                    {selectedDisaster.reporter}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-gray-400">
                    Contact Number
                  </span>
                  <span className="font-semibold text-gray-800">
                    {selectedDisaster.contact}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-gray-400">
                    Resident NIC
                  </span>
                  <span className="font-semibold text-gray-800">
                    {selectedDisaster.residentNic}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-gray-400">
                    Current Severity
                  </span>
                  <span className="font-semibold text-amber-600 capitalize">
                    {getSeverityDisplay(selectedDisaster.severity)}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <span className="text-xs font-bold text-gray-400">
                    Damage Description
                  </span>
                  <span className="bg-[#F8FAFC] border border-gray-200 rounded-xl p-3.5 text-xs text-gray-700 leading-relaxed font-normal">
                    {selectedDisaster.description}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <span className="text-xs font-bold text-gray-400">
                    Relief Assistance Requested
                  </span>
                  <span className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3.5 text-xs font-normal leading-relaxed">
                    {selectedDisaster.aidRequested ||
                      "No specific relief packs requested. Assessment needed."}
                  </span>
                </div>

                {/* Affected Area Proof Photo Verification */}
                <div className="flex flex-col gap-2 sm:col-span-2 border-t border-b border-gray-100 py-4 my-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1B365D] uppercase tracking-wider">
                      📸 Affected Area Damage Proof (Resident Verification)
                    </span>
                    {selectedDisaster.imagePath && (
                      <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                        ✓ Photo Attached
                      </span>
                    )}
                  </div>

                  {selectedDisaster.imagePath ? (
                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#F8FAFC] border border-slate-200 rounded-xl p-4">
                      <img
                        src={selectedDisaster.imagePath}
                        alt="Affected area damage proof"
                        className="w-full sm:w-48 h-36 object-cover rounded-xl border border-slate-300 shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setPreviewImage(selectedDisaster.imagePath)}
                        title="Click to view full screen"
                      />
                      <div className="flex flex-col gap-2 text-left w-full">
                        <span className="text-xs font-bold text-gray-700">
                          Inspection Instructions for GN Officer:
                        </span>
                        <p className="text-xs text-gray-600 m-0 leading-relaxed">
                          Inspect the photo to verify damage severity to the resident's house, land, or crops before approving emergency relief.
                        </p>
                        <button
                          type="button"
                          onClick={() => setPreviewImage(selectedDisaster.imagePath)}
                          className="w-fit bg-[#005BBD]/10 hover:bg-[#005BBD]/20 text-[#005BBD] font-bold text-xs px-3.5 py-1.5 rounded-lg border-0 cursor-pointer transition-colors flex items-center gap-1.5"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          Zoom & Inspect Proof Photo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-800 font-medium text-left flex items-center gap-2">
                      <span>⚠️ No affected area photo was uploaded with this report. Physical site inspection recommended.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* GN Officer Action Panel */}
              <div className="border-t border-gray-100 pt-4 mt-2">
                <h4 className="text-sm font-bold text-[#1B365D] mb-4">
                  GN Officer Action Panel
                </h4>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="modalRemarksInput"
                    className="text-xs font-bold text-[#475569]"
                  >
                    Officer Remarks & Actions Taken
                  </label>
                  <textarea
                    id="modalRemarksInput"
                    className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all resize-none"
                    rows="2"
                    placeholder="Enter official remarks, dispatch instructions, or relief status details..."
                    value={modalRemarks}
                    onChange={(e) => setModalRemarks(e.target.value)}
                  ></textarea>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="modalReliefInput"
                    className="text-xs font-bold text-[#475569]"
                  >
                    Relief Provided / Aid Dispatched
                  </label>
                  <input
                    id="modalReliefInput"
                    type="text"
                    className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all"
                    placeholder="Specify relief items or aid dispatched..."
                    value={modalReliefProvided}
                    onChange={(e) => setModalReliefProvided(e.target.value)}
                  />
                </div>

                {selectedDisaster.status === "Pending" && (
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="modalRejectReason"
                      className="text-xs font-bold text-[#475569]"
                    >
                      Rejection Reason (if rejecting)
                    </label>
                    <input
                      id="modalRejectReason"
                      type="text"
                      className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BBD] focus:border-transparent transition-all"
                      placeholder="e.g., Does not meet criteria, insufficient evidence..."
                      value={modalRejectionReason}
                      onChange={(e) => setModalRejectionReason(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4 mt-2">
                <button
                  type="button"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-5 rounded-xl border-0 cursor-pointer text-sm transition-colors"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>

                {selectedDisaster.status === "Pending" && (
                  <>
                    <button
                      onClick={handleReject}
                      disabled={isLoading}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 px-5 rounded-xl border-0 cursor-pointer text-sm transition-colors shadow-xs disabled:opacity-50"
                    >
                      {isLoading ? "Processing..." : "Reject"}
                    </button>
                    <button
                      onClick={handleApprove}
                      disabled={isLoading}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-xl border-0 cursor-pointer text-sm transition-colors shadow-xs disabled:opacity-50"
                    >
                      {isLoading ? "Processing..." : "Approve & Dispatch"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Help Trigger */}
      <button
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#D69E2E] text-white border-0 text-[20px] font-bold cursor-pointer shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-[#FFAA00]"
        aria-label="Help Trigger"
        onClick={onOpenHelp}
      >
        ?
      </button>

      <Footer />
      {/* Fullscreen Photo Inspection Lightbox */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 bg-white/20 hover:bg-white/40 text-white rounded-full w-9 h-9 flex items-center justify-center border-0 cursor-pointer text-xl transition-colors"
            >
              &times;
            </button>
            <img
              src={previewImage}
              alt="Full resolution proof photo"
              className="max-h-[80vh] w-auto object-contain rounded-xl border border-white/20 shadow-2xl"
            />
            <div className="mt-3 text-white text-xs font-semibold bg-black/60 px-4 py-1.5 rounded-full">
              SmartGN Affected Area Verification • Click outside to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OfficerDisasterReports;
