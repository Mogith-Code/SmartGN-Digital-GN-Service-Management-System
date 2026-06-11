import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()
  
  // Registration Form States
  const [nic, setNic] = useState('')
  const [household, setHousehold] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('')
  const [mobile, setMobile] = useState('')
  const [division, setDivision] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [divisions, setDivisions] = useState([])
  const [errorMessage, setErrorMessage] = useState('')

  // Fetch divisions on mount
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await fetch('/api/auth/divisions')
        if (response.ok) {
          const data = await response.json()
          setDivisions(data.map(d => d.name))
        } else {
          setDivisions(['Colombo 03', 'Colombo 07', 'Kandy Town', 'Galle Fort', 'Negombo South', 'Colombo, Borella'])
        }
      } catch (err) {
        console.error('Error fetching divisions:', err)
        setDivisions(['Colombo 03', 'Colombo 07', 'Kandy Town', 'Galle Fort', 'Negombo South', 'Colombo, Borella'])
      }
    }
    fetchDivisions()
  }, [])

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    
    if (!nic || !household || !firstName || !lastName || !email || !dob || !gender || !mobile || !division || !password || !confirmPassword) {
      setErrorMessage('Please fill in all fields.')
      return
    }
    
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    try {
      const bodyPayload = {
        nic,
        name: `${firstName} ${lastName}`,
        dob,
        password,
        gender,
        mobile,
        email,
        householdNumber: household,
        division
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      })

      const data = await response.json()
      if (!response.ok) {
        setErrorMessage(data.error || 'Registration failed. Please verify your details.')
        return
      }

      setErrorMessage('')
      navigate('/success', { 
        state: { 
          successUser: `${firstName} ${lastName} (NIC: ${nic})`,
          isRegister: true
        } 
      })
    } catch (err) {
      setErrorMessage('Network connection error. Please make sure the MySQL backend server is active.')
    }
  }

  return (
    <div className="screen-fade-active register-page">
      <h2 className="register-title" style={{ marginBottom: '16px' }}>Create Resident Account</h2>
      
      <form onSubmit={handleRegisterSubmit}>
        <div className="register-grid">
          
          {/* Row 1 */}
          <div className="form-group">
            <label htmlFor="nic">NIC Number</label>
            <input 
              type="text" 
              id="nic" 
              className="register-control" 
              placeholder="Enter NIC Number"
              value={nic}
              onChange={(e) => setNic(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="household">Household Number</label>
            <input 
              type="text" 
              id="household" 
              className="register-control" 
              placeholder="Enter Household Number"
              value={household}
              onChange={(e) => setHousehold(e.target.value)}
              required
            />
          </div>

          {/* Row 2 */}
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input 
              type="text" 
              id="firstName" 
              className="register-control" 
              placeholder="Enter First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input 
              type="text" 
              id="lastName" 
              className="register-control" 
              placeholder="Enter Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          {/* Row 3 - Full Width */}
          <div className="form-group col-span-2">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              className="register-control" 
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Row 4 */}
          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input 
              type="date" 
              id="dob" 
              className="register-control" 
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <div className="select-wrapper">
              <select 
                id="gender" 
                className="register-control register-select" 
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="" disabled hidden>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <span className="select-arrow">▼</span>
            </div>
          </div>

          {/* Row 5 */}
          <div className="form-group">
            <label htmlFor="mobile">Mobile Number</label>
            <input 
              type="tel" 
              id="mobile" 
              className="register-control" 
              placeholder="Enter Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="division">Select GN Division</label>
            <div className="select-wrapper">
              <select 
                id="division" 
                className="register-control register-select" 
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                required
              >
                <option value="" disabled hidden>Select division</option>
                {divisions.map((divName, index) => (
                  <option key={index} value={divName}>{divName}</option>
                ))}
              </select>
              <span className="select-arrow">▼</span>
            </div>
          </div>

          {/* Row 6 */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              className="register-control" 
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              className="register-control" 
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

        </div>

        {errorMessage && (
          <p style={{ color: '#ef4444', fontSize: '13px', margin: '12px 0 0 0', textAlign: 'left' }}>
            {errorMessage}
          </p>
        )}

        <button type="submit" className="btn-register-submit">
          Create Account
        </button>
      </form>

      <div className="register-help">
        Already have an account?{' '}
        <span 
          className="link-orange" 
          onClick={() => navigate('/login')}
          style={{ cursor: 'pointer' }}
        >
          Login here
        </span>
      </div>
    </div>
  )
}

export default Register
