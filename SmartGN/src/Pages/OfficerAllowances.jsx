import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import { getAuthHeaders } from '../utils/api'
import OfficerNavbar from '../Components/Common/OfficerNavbar'
import OSidebar from '../Components/Common/OSidebar'

function OfficerAllowances({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLanguage()
  const t = translations[lang]

  // Session user defaults
  const successUser = location.state?.successUser || localStorage.getItem('smartgn_user_name') || 'Kamal Perera'
  const officerIdVal = location.state?.officerId || localStorage.getItem('smartgn_user_id') || '200324511540'

  // States
  const [requests, setRequests] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [expandedId, setExpandedId] = useState(null)
  
  // Bank transfer simulation states
  const [verifyingBankId, setVerifyingBankId] = useState(null)
  const [bankVerifiedMap, setBankVerifiedMap] = useState({})
  const [transferringId, setTransferringId] = useState(null)
  const [transferStep, setTransferStep] = useState(0) // 0: Idle, 1: Connecting, 2: clearing, 3: Completed
  const [transferAmount, setTransferAmount] = useState('5000')

  // Receipt Modal State
  const [showReceiptId, setShowReceiptId] = useState(null)
  const [receiptRequest, setReceiptRequest] = useState(null)

  const loadRequests = async () => {
    try {
      const response = await fetch('/api/allowances/officer', {
        headers: getAuthHeaders()
      })
      if (!response.ok) throw new Error('Failed to load allowance requests queue.')
      const data = await response.json()
      const formatted = data.map(item => {
        let bankDetailsObj = null;
        try {
          bankDetailsObj = typeof item.bank_details === 'string' ? JSON.parse(item.bank_details) : item.bank_details;
        } catch (e) {
          bankDetailsObj = item.bank_details;
        }
        return {
          id: item.allowance_id,
          program: item.allowance_type,
          purpose: item.income_details ? item.income_details.substring(0, 100) : '',
          status: item.status === 'PENDING' ? 'Pending' : item.status === 'APPROVED' ? 'Approved' : 'Rejected',
          bankDetails: bankDetailsObj,
          paymentStatus: item.payment_status === 'PAID' ? 'Paid' : 'Unpaid',
          paymentAmount: item.cleared_amount,
          paymentTransferredAt: item.cleared_time ? new Date(item.cleared_time).toLocaleString() : '',
          paymentTransactionRef: item.txn_reference,
          applicantName: item.resident_name || 'Resident',
          nic: item.resident_nic,
          income: item.income_details || '',
          submittedDate: item.application_date ? new Date(item.application_date).toISOString().split('T')[0] : '2026-05-15'
        }
      })
      setRequests(formatted)
    } catch (err) {
      console.error(err)
      const saved = localStorage.getItem('smartgn_allowance_requests')
      if (saved) setRequests(JSON.parse(saved))
    }
  }

  useEffect(() => {
    loadRequests()
  }, [])

  // Approve action
  const handleApprove = async (id, e) => {
    e.stopPropagation()
    try {
      const response = await fetch(`/api/allowances/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'APPROVED' })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to approve allowance request.')
      }

      alert(`Allowance request ${id} has been Approved.`)
      loadRequests()
    } catch (err) {
      alert(err.message || 'Error approving allowance request.')
    }
  }

  // Reject action
  const handleReject = async (id, e) => {
    e.stopPropagation()
    const confirmReject = window.confirm("Are you sure you want to reject this allowance request?")
    if (confirmReject) {
      try {
        const response = await fetch(`/api/allowances/${id}/status`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ status: 'REJECTED' })
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to reject allowance request.')
        }

        alert(`Allowance request ${id} has been Rejected.`)
        loadRequests()
      } catch (err) {
        alert(err.message || 'Error rejecting allowance request.')
      }
    }
  }

  // Mock Bank Account Verification
  const handleVerifyBank = (id, applicantName, e) => {
    e.stopPropagation()
    setVerifyingBankId(id)
    setTimeout(() => {
      setBankVerifiedMap(prev => ({ ...prev, [id]: true }))
      setVerifyingBankId(null)
      alert(`Bank Account Registry matched and verified successfully for ${applicantName}!`)
    }, 1000)
  }

  // Secure cleared transfer simulation
  const handleSecureTransfer = (id, item, e) => {
    e.stopPropagation()
    if (!bankVerifiedMap[id]) {
      alert("Please verify the bank account registry with the Central Bank registry first.")
      return
    }

    setTransferringId(id)
    setTransferStep(1) // Connecting

    setTimeout(() => {
      setTransferStep(2) // clearing

      setTimeout(() => {
        setTransferStep(3) // Completed

        setTimeout(async () => {
          try {
            const response = await fetch(`/api/allowances/${id}/disburse`, {
              method: 'POST',
              headers: getAuthHeaders(),
              body: JSON.stringify({
                disburseAmount: parseFloat(transferAmount)
              })
            })

            if (!response.ok) {
              const data = await response.json()
              throw new Error(data.error || 'Failed to disburse funds.')
            }

            const resData = await response.json()
            await loadRequests()
            setTransferringId(null)
            setTransferStep(0)
            alert('RTGS Secure Funds Disbursed successfully.')

            const completedItem = {
              id: id,
              program: item.program,
              status: 'Approved',
              paymentStatus: 'Paid',
              paymentAmount: resData.transaction.amount,
              paymentTransferredAt: new Date(resData.transaction.timestamp).toLocaleString(),
              paymentTransactionRef: resData.transaction.txnRef,
              applicantName: item.applicantName,
              bankDetails: item.bankDetails
            }
            setReceiptRequest(completedItem)
            setShowReceiptId(id)
          } catch (err) {
            alert(err.message || 'Error disbursing allowance funds.')
            setTransferringId(null)
            setTransferStep(0)
          }
        }, 800)
      }, 1000)
    }, 800)
  }

  // View existing receipt
  const viewReceipt = (item, e) => {
    e.stopPropagation()
    setReceiptRequest(item)
    setShowReceiptId(item.id)
  }

  // Filter & Search logic
  const filteredRequests = requests.filter(r => {
    const applicant = r.applicantName || r.bankDetails?.accountHolderName || 'Resident'
    const matchesSearch = applicant.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          String(r.id).includes(searchQuery)
    
    if (filterStatus === 'All') return matchesSearch
    return matchesSearch && r.status === filterStatus
  })

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#F7FAFC]">
      
      {/* 1. Header */}
      <OfficerNavbar />

      {/* 2. Main Dashboard Layout */}
      <div className="flex flex-1 w-full">
        
        {/* Sidebar Nav */}
        <OSidebar />

        {/* Main Panel Content */}
        <main className="flex-1 p-10 bg-[#F7FAFC] overflow-y-auto">
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ textAlign: 'left' }}>
              <h2 className="content-greeting" style={{ margin: 0, fontSize: '24px', fontWeight: '800' }}>Allowance Programs</h2>
              <span style={{ fontSize: '14.5px', color: '#64748b' }}>Analyze, verify and securely disburse funds to registered allowance applications.</span>
            </div>

            {/* Filter Buttons */}
            <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  style={{
                    padding: '6px 14px',
                    fontSize: '13px',
                    fontWeight: '700',
                    borderRadius: '6px',
                    border: 'none',
                    background: filterStatus === status ? '#ffffff' : 'transparent',
                    color: filterStatus === status ? '#1a2e56' : '#64748b',
                    cursor: 'pointer',
                    boxShadow: filterStatus === status ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <input
              type="text"
              placeholder="Search by resident name, program (e.g. Aswesuma) or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 42px',
                fontSize: '14px',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                background: '#ffffff',
                color: '#1e293b',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" style={{ position: 'absolute', left: '14px', top: '14px' }}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>

          {/* List of Applications */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredRequests.map((item) => {
              const applicant = item.applicantName || item.bankDetails?.accountHolderName || 'Resident'
              const isExpanded = expandedId === item.id

              return (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: isExpanded ? '1.5px solid #fedc9b' : '1px solid #cbd5e1',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
                    transition: 'border-color 0.15s ease'
                  }}
                >
                  {/* Collapsed Row Header */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    style={{
                      padding: '24px 32px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <span style={{ fontSize: '24px' }}>★</span>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                          <h4 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#1a2e56' }}>
                            {item.program}
                          </h4>
                          <span
                            className={`badge-status ${item.status.toLowerCase()}`}
                            style={{
                              fontSize: '11px',
                              fontWeight: '800',
                              padding: '2px 8px',
                              borderRadius: '50px',
                              textTransform: 'uppercase'
                            }}
                          >
                            {item.status}
                          </span>
                          
                          {item.status === 'Approved' && (
                            <span
                              className={`badge-status ${item.paymentStatus === 'Paid' ? 'approved' : 'pending'}`}
                              style={{
                                fontSize: '11px',
                                fontWeight: '800',
                                padding: '2px 8px',
                                borderRadius: '50px',
                                textTransform: 'uppercase'
                              }}
                            >
                              {item.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid'}
                            </span>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#64748b' }}>
                          <span>Applicant: <strong>{applicant}</strong></span>
                          <span>NIC: <strong>{item.nic || '200324511540'}</strong></span>
                          <span>Submitted: <strong>{item.submittedDate || '2024-03-28'}</strong></span>
                        </div>
                      </div>
                    </div>

                    <span style={{ fontSize: '18px', color: '#64748b' }}>
                      {isExpanded ? '▲' : '▼'}
                    </span>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div style={{ padding: '0 32px 32px 32px', borderTop: '1px solid #cbd5e1', textAlign: 'left', backgroundColor: '#f8fafc' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', paddingTop: '24px' }}>
                        
                        {/* Left column details */}
                        <div>
                          <h4 style={{ margin: '0 0 16px 0', fontSize: '14.5px', color: '#1a2e56', fontWeight: '800' }}>Application details</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px', color: '#334155' }}>
                            <div>
                              <span style={{ color: '#64748b', fontWeight: '600' }}>Purpose:</span> {item.purpose}
                            </div>
                            <div>
                              <span style={{ color: '#64748b', fontWeight: '600' }}>Monthly Household Income:</span> Rs. {parseFloat(item.income || '20000').toLocaleString()}.00
                            </div>
                            <div>
                              <span style={{ color: '#64748b', fontWeight: '600' }}>Remarks:</span> {item.remarks || 'No remarks provided.'}
                            </div>
                            
                            {/* NEW: Interactive Mock PDF Document Viewer Card */}
                            <div style={{ marginTop: '16px' }}>
                              <span style={{ display: 'block', color: '#64748b', fontWeight: '750', marginBottom: '8px', fontSize: '13px' }}>Submitted PDF Document:</span>
                              <div 
                                style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '14px 18px', cursor: 'pointer', transition: 'all 0.15s ease' }} 
                                onClick={() => alert(`Simulating secure document viewer for SmartGN-AL-${item.id}... Loading 'Proof_of_Income_Cert.pdf' (1.4MB)... Verified CBSL Signature.`)}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#1a2e56'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
                              >
                                <div style={{ width: '40px', height: '40px', backgroundColor: '#fee2e2', color: '#ef4444', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '900' }}>
                                  PDF
                                </div>
                                <div style={{ flex: 1, fontSize: '13px', textAlign: 'left' }}>
                                  <span style={{ display: 'block', fontWeight: '750', color: '#1e293b' }}>Proof_of_Income_Cert.pdf</span>
                                  <span style={{ color: '#64748b', fontSize: '11.5px' }}>1.4 MB • Utility bill & Income Statement</span>
                                </div>
                                <span style={{ color: '#1a2e56', fontWeight: '800', fontSize: '12px' }}>View PDF ➔</span>
                              </div>
                            </div>
                          </div>

                          {/* Quick Reject/Approve Controls */}
                          {item.status === 'Pending' && (
                            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                              <button
                                onClick={(e) => handleReject(item.id, e)}
                                style={{
                                  background: '#ffffff',
                                  color: '#ef4444',
                                  border: '1.5px solid #ef4444',
                                  padding: '8px 24px',
                                  borderRadius: '50px',
                                  fontSize: '13px',
                                  fontWeight: '800',
                                  cursor: 'pointer'
                                }}
                              >
                                Reject Application
                              </button>
                              <button
                                onClick={(e) => handleApprove(item.id, e)}
                                style={{
                                  background: '#10b981',
                                  color: '#ffffff',
                                  border: 'none',
                                  padding: '10px 24px',
                                  borderRadius: '50px',
                                  fontSize: '13px',
                                  fontWeight: '800',
                                  cursor: 'pointer'
                                }}
                              >
                                Approve Application
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Right column secure bank details & payment clearance */}
                        <div style={{ borderLeft: '1.5px solid #e2e8f0', paddingLeft: '40px' }}>
                          <h4 style={{ margin: '0 0 16px 0', fontSize: '14.5px', color: '#1a2e56', fontWeight: '800' }}>Payment & Transfer Console</h4>
                          
                          {item.bankDetails ? (
                            /* HIGHLY STYLED PREMIUM BANK CARD */
                            <div style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: '16px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(16, 185, 129, 0.02)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <span style={{ display: 'block', fontSize: '11px', color: '#047857', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Verified Payment Account</span>
                                <span style={{ fontSize: '11px', background: '#34d399', color: '#064e3b', fontWeight: '850', padding: '2px 8px', borderRadius: '50px' }}>CBSL matched</span>
                              </div>
                              <div style={{ fontSize: '13.5px', color: '#1e293b', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#065f46', fontWeight: '600' }}>Bank Name:</span> <strong>{item.bankDetails.bankName}</strong></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#065f46', fontWeight: '600' }}>Branch:</span> <strong>{item.bankDetails.branch}</strong></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#065f46', fontWeight: '600' }}>A/C Number:</span> <strong style={{ fontFamily: 'monospace', fontSize: '14px' }}>{item.bankDetails.accountNumber}</strong></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #c6f6d5', paddingTop: '8px', marginTop: '2px' }}><span style={{ color: '#065f46', fontWeight: '600' }}>Account Holder:</span> <strong>{item.bankDetails.accountHolderName}</strong></div>
                              </div>
                            </div>
                          ) : (
                            <div style={{ padding: '16px', color: '#e11d48', fontSize: '13px', background: '#fff1f2', borderRadius: '8px', border: '1px solid #fda4af', marginBottom: '20px' }}>
                              Resident has not provided bank account details yet. Money cannot be transferred.
                            </div>
                          )}

                          {/* Bank Actions */}
                          {item.status === 'Approved' && item.bankDetails && (
                            <div>
                              {item.paymentStatus === 'Unpaid' ? (
                                <>
                                  {/* Not verified state */}
                                  {!bankVerifiedMap[item.id] ? (
                                    <button
                                      onClick={(e) => handleVerifyBank(item.id, applicant, e)}
                                      disabled={verifyingBankId === item.id}
                                      style={{
                                        width: '100%',
                                        padding: '12px',
                                        fontSize: '13.5px',
                                        fontWeight: '800',
                                        borderRadius: '8px',
                                        background: '#1a2e56',
                                        color: '#ffffff',
                                        border: 'none',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      {verifyingBankId === item.id ? 'Connecting Central Registry...' : '🔍 Verify Bank Account Registry'}
                                    </button>
                                  ) : (
                                    /* Verified state & Disburse panel */
                                    <div style={{ textAlign: 'left' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#047857', fontSize: '13.5px', fontWeight: '800', marginBottom: '14px' }}>
                                        <span>✓ Account Registry Status: verified</span>
                                      </div>

                                      {/* Amount select input */}
                                      <div style={{ marginBottom: '16px' }}>
                                        <label htmlFor={`amount-${item.id}`} style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: '#475569', marginBottom: '6px' }}>Transfer Amount (LKR) :</label>
                                        <input
                                          type="number"
                                          id={`amount-${item.id}`}
                                          className="register-control"
                                          value={transferAmount}
                                          onChange={(e) => setTransferAmount(e.target.value)}
                                          style={{ padding: '8px 12px', width: '100%', boxSizing: 'border-box' }}
                                        />
                                      </div>

                                      {/* Secure Disburse button */}
                                      <button
                                        onClick={(e) => handleSecureTransfer(item.id, item, e)}
                                        disabled={transferringId === item.id}
                                        style={{
                                          width: '100%',
                                          padding: '12px',
                                          fontSize: '13.5px',
                                          fontWeight: '800',
                                          borderRadius: '8px',
                                          background: '#10b981',
                                          color: '#ffffff',
                                          border: 'none',
                                          cursor: 'pointer',
                                          boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)'
                                        }}
                                      >
                                        {transferringId === item.id ? (
                                          <span>
                                            {transferStep === 1 && 'RTGS: Handshaking clearing gateway...'}
                                            {transferStep === 2 && 'RTGS: Disbursing secure cleared funds...'}
                                            {transferStep === 3 && 'RTGS: Finalizing transaction records...'}
                                          </span>
                                        ) : (
                                          '🔒 Securely Transfer Funds via RTGS'
                                        )}
                                      </button>
                                    </div>
                                  )}
                                </>
                              ) : (
                                /* Paid state logs & view receipt trigger */
                                <div style={{ background: '#ecfdf5', border: '1.5px solid #10b981', borderRadius: '12px', padding: '16px', color: '#065f46' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '800', fontSize: '13.5px' }}>
                                    <span>✓ Funds successfully Disbursed</span>
                                  </div>
                                  <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                                    <div><span style={{ color: '#047857' }}>Transferred:</span> <strong>Rs. {item.paymentAmount}.00</strong></div>
                                    <div><span style={{ color: '#047857' }}>Cleared Date:</span> <strong>{item.paymentTransferredAt}</strong></div>
                                    <div><span style={{ color: '#047857' }}>Secure Ref:</span> <code>{item.paymentTransactionRef}</code></div>
                                  </div>
                                  
                                  {/* VIEW SECURED RECEIPT LINK */}
                                  <button
                                    onClick={(e) => viewReceipt(item, e)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#047857',
                                      fontWeight: '800',
                                      fontSize: '12.5px',
                                      cursor: 'pointer',
                                      padding: 0,
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                  >
                                    🧾 View Payment Receipt
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          {item.status !== 'Approved' && (
                            <span style={{ fontSize: '12.5px', color: '#64748b' }}>Approved requests can clearing secure money transfers instantly.</span>
                          )}

                        </div>

                      </div>
                    </div>
                  )}

                </div>
              )
            })}

            {filteredRequests.length === 0 && (
              <div style={{ padding: '48px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #cbd5e1', color: '#64748b', fontSize: '15px' }}>
                No allowance applications match the selected filters.
              </div>
            )}
          </div>

          {/* Floating Help Trigger */}
          <button className="floating-dashboard-help" aria-label="Help Trigger" onClick={onOpenHelp}>
            ?
          </button>
        </main>
      </div>

      {/* 3. Footer */}
      <footer className="landing-footer" style={{ padding: '16px 64px', borderTop: 'none' }}>
        <div className="footer-copyright">
          <p>© 2026 SmartGN. All rights reserved.</p>
        </div>
      </footer>

      {/* 4. Payment Portal Secure Transfer Receipt Modal */}
      {showReceiptId && receiptRequest && (
        <div className="modal-backdrop-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-form-card animate-zoom-in" style={{ maxWidth: '460px', width: '90%', padding: '32px', borderRadius: '24px', border: '1.5px solid #10b981', backgroundColor: '#ffffff', color: '#1e293b', boxShadow: '0 20px 40px rgba(16, 185, 129, 0.12)' }}>
            
            {/* Header: CBSL Seal */}
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2.5px solid #d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', backgroundColor: '#fdf8f0', color: '#d97706', fontSize: '24px', fontWeight: '800' }}>
                🇱🇰
              </div>
              <h3 style={{ margin: 0, fontSize: '16.5px', fontWeight: '850', color: '#1a2e56', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Central Bank of Sri Lanka
              </h3>
              <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '750', display: 'block', marginTop: '3px', letterSpacing: '0.2px' }}>
                RTGS SECURED CLEARING SYSTEM • SYSTEM RECEIPT
              </span>
            </div>

            {/* Receipt Details Box */}
            <div style={{ borderTop: '2px dashed #cbd5e1', borderBottom: '2px dashed #cbd5e1', padding: '16px 0', margin: '16px 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontWeight: '600' }}>Transaction Status:</span>
                <span style={{ color: '#047857', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  ● Cleared & Settled
                </span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontWeight: '600' }}>Transaction Ref:</span>
                <strong style={{ fontFamily: 'monospace', fontSize: '13.5px', color: '#1e293b' }}>
                  {receiptRequest.paymentTransactionRef}
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontWeight: '600' }}>Disbursed Date:</span>
                <strong style={{ color: '#1e293b' }}>{receiptRequest.paymentTransferredAt}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontWeight: '600' }}>Allowance Program:</span>
                <strong style={{ color: '#1e293b' }}>{receiptRequest.program}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontWeight: '600' }}>Applicant Name:</span>
                <strong style={{ color: '#1e293b' }}>{receiptRequest.applicantName || receiptRequest.bankDetails?.accountHolderName}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #cbd5e1', paddingTop: '8px', marginTop: '2px' }}>
                <span style={{ color: '#64748b', fontWeight: '600' }}>Destination Bank:</span>
                <strong style={{ color: '#1e293b' }}>{receiptRequest.bankDetails?.bankName}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontWeight: '600' }}>Branch Office:</span>
                <strong style={{ color: '#1e293b' }}>{receiptRequest.bankDetails?.branch}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontWeight: '600' }}>Credit Account:</span>
                <strong style={{ color: '#1e293b' }}>{receiptRequest.bankDetails?.accountNumber}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #cbd5e1', paddingTop: '12px', marginTop: '4px' }}>
                <span style={{ color: '#1a2e56', fontWeight: '800', fontSize: '14px' }}>Settled Amount:</span>
                <strong style={{ color: '#10b981', fontSize: '17px', fontWeight: '900' }}>
                  Rs. {receiptRequest.paymentAmount?.toLocaleString()}.00
                </strong>
              </div>
            </div>

            {/* Official seal mark */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', opacity: 0.85 }}>
              <div style={{ fontSize: '10px', color: '#64748b', textAlign: 'left' }}>
                <span style={{ display: 'block', fontWeight: '800', color: '#475569' }}>DIVISIONAL CLEARANCE GATEWAY</span>
                 Colombo Divisional Secretariat, Sri Lanka
              </div>
              <div style={{ border: '2.5px solid #10b981', borderRadius: '8px', color: '#10b981', fontSize: '10px', fontWeight: '900', padding: '3px 8px', textTransform: 'uppercase', transform: 'rotate(-4deg)', letterSpacing: '1px' }}>
                ★ SmartGN APPROVED ★
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => alert("Downloading secured CBSL digital signed payment receipt PDF...")}
                style={{
                  flex: 1,
                  background: '#ffffff',
                  color: '#1a2e56',
                  border: '1.5px solid #1a2e56',
                  padding: '10px',
                  borderRadius: '50px',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                📥 Download PDF
              </button>

              <button
                onClick={() => {
                  setShowReceiptId(null)
                  setReceiptRequest(null)
                }}
                style={{
                  flex: 1,
                  background: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '50px',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                }}
              >
                Close Receipt
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default OfficerAllowances



