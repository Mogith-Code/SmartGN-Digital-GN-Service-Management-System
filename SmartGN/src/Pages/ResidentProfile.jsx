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

  // Load from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('smartgn_resident_profile')
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    } else {
      // Seed default profile data
      const defaultProfile = {
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
      }
      localStorage.setItem('smartgn_resident_profile', JSON.stringify(defaultProfile))
      setProfile(defaultProfile)
    }

    // Load family members to show dynamic count
    const savedFamily = localStorage.getItem('smartgn_family_members')
    if (savedFamily) {
      const familyList = JSON.parse(savedFamily)
      setFamilyCount(familyList.length)
    }
  }, [])

  // Populate form fields when entering Edit Mode
  const handleEnterEdit = () => {
    setEditFirstName(profile.firstName)
    setEditLastName(profile.lastName)
    setEditFullName(profile.fullName)
    setEditOccupation(profile.occupation)
    setEditEmail(profile.email)
    setEditMobile(profile.mobile)
    setEditAddress(profile.address)
    setEditDob(profile.dob)
    setEditGender(profile.gender)
    setEditHouseholdNumber(profile.householdNumber)
    setEditProfilePhoto(profile.profilePhoto)
    setEditNicFront(profile.nicFront)
    setEditNicBack(profile.nicBack)
    setViewMode('EDIT')
  }
// Handle Photo File Upload Convert to Base64
  const handlePhotoUpload = (e, target) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (target === 'profilePhoto') {
          setEditProfilePhoto(reader.result)
        } else if (target === 'nicFront') {
          setEditNicFront(reader.result)
        } else if (target === 'nicBack') {
          setEditNicBack(reader.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Save changes
  const handleSaveProfile = (e) => {
    e.preventDefault()

    const updatedProfile = {
      ...profile,
      firstName: editFirstName,
      lastName: editLastName,
      fullName: editFullName,
      occupation: editOccupation,
      email: editEmail,
      mobile: editMobile,
      address: editAddress,
      dob: editDob,
      gender: editGender,
      householdNumber: editHouseholdNumber,
      profilePhoto: editProfilePhoto,
      nicFront: editNicFront,
      nicBack: editNicBack
    }

    localStorage.setItem('smartgn_resident_profile', JSON.stringify(updatedProfile))
    setProfile(updatedProfile)
    setViewMode('VIEW')
    alert('Profile updated successfully.')
  }
  

export default ResidentProfile;
