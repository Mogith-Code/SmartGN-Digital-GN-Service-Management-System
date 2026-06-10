import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { translations, useLanguage } from '../utils/translate'
import LanguageSelector from '../Components/Common/LanguageSelector'

function ResidentProfile({ onOpenHelp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLanguage()
  const t = translations[lang]

  // Retrieve default username and division from navigation state if available
  const successUser = location.state?.successUser || 'Nimal Perera'
  const userDivision = location.state?.division || 'Colombo'
  const firstNameFromSession = successUser.split(' ')[0]

  // State to manage dismissing the alert banner
  const [showAlert, setShowAlert] = useState(true)

  // View modes: 'VIEW' | 'EDIT'
  const [viewMode, setViewMode] = useState('VIEW')

  // Profile data state
  const [profile, setProfile] = useState({
    firstName: 'Nimal',
    lastName: 'Perera',
    fullName: 'Dissanayake Mudiyanselage Nimal Perera',
    nic: '200324511540',
    occupation: 'Farmer',
    email: 'Nimal.Perera@example.com',
    mobile: '0703564478',
    address: '123 Main Street, Colombo',
    division: 'Colombo, Borella',
    dob: '28/05/2000',
    gender: 'Male',
    householdNumber: '123456',
    profilePhoto: null,
    nicFront: null,
    nicBack: null
  })
  // Form Field States (Edit Mode)
  const [editFirstName, setEditFirstName] = useState('')
  const [editLastName, setEditLastName] = useState('')
  const [editFullName, setEditFullName] = useState('')
  const [editOccupation, setEditOccupation] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editMobile, setEditMobile] = useState('')
  const [editAddress, setEditAddress] = useState('')
  const [editDob, setEditDob] = useState('')
  const [editGender, setEditGender] = useState('')
  const [editHouseholdNumber, setEditHouseholdNumber] = useState('')
  const [editProfilePhoto, setEditProfilePhoto] = useState(null)
  const [editNicFront, setEditNicFront] = useState(null)
  const [editNicBack, setEditNicBack] = useState(null)

  const [familyCount, setFamilyCount] = useState(5) // default count

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{t?.myProfile || 'My Profile'}</h2>
      <div className="bg-white p-6 rounded-xl shadow">
        <p><strong>First Name:</strong> {profile.firstName}</p>
        <p><strong>Last Name:</strong> {profile.lastName}</p>
        <p><strong>NIC:</strong> {profile.nic}</p>
        <p><strong>Division:</strong> {profile.division}</p>
      </div>
    </div>
  )
}

export default ResidentProfile;
