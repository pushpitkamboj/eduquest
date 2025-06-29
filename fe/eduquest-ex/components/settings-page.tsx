"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SettingsPage() {
  const router = useRouter()

  const [avatar, setAvatar] = useState("/images/avatars/male.png")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [loading, setLoading] = useState(false)

  // ✅ Fetch user data from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:3001/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()

        if (data?.user) {
          setName(data.user.name || "")
          setEmail(data.user.email || "")
          setAvatar(data.user.picture || "/images/avatars/male.png")
        }
      } catch (err) {
        alert("Failed to load profile.")
      }
    }
    fetchProfile()
  }, [])

  // ✅ Save profile data
  const saveProfile = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:3001/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          picture: avatar,
        }),
      })
      const data = await res.json()
      if (data.success) {
        alert("Profile updated successfully!")
        setIsEditingName(false)
        setIsEditingEmail(false)
      } else {
        alert(data.message || "Failed to update profile.")
      }
    } catch {
      alert("Error updating profile.")
    }
    setLoading(false)
  }

  // ✅ Save new password
  const savePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.")
      return
    }
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:3001/api/user/profile/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      })
      const data = await res.json()
      if (data.success) {
        alert("Password changed successfully!")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        alert(data.message || "Failed to change password.")
      }
    } catch {
      alert("Error changing password.")
    }
    setLoading(false)
  }

  const logoutAllDevices = () => {
    localStorage.clear()
    alert("Logged out from all devices.")
    router.push("/")
  }

  const deleteAccount = () => {
    const confirmDelete = confirm("Are you sure you want to delete your account? This cannot be undone.")
    if (confirmDelete) {
      localStorage.clear()
      alert("Account deleted successfully.")
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="text-[#1a2c48]">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-[#1a2c48] ml-4">Settings</h1>
        </div>

        {/* Avatar */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-[#1a2c48] mb-4">Profile Avatar</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setAvatar("/images/avatars/male.png")}
              className={`p-2 rounded-full ${avatar === "/images/avatars/male.png" ? "ring-2 ring-[#7BA5B9]" : ""}`}
            >
              <Image src="/images/avatars/male.png" alt="Male Avatar" width={64} height={64} className="rounded-full" />
            </button>
            <button
              onClick={() => setAvatar("/images/avatars/female.png")}
              className={`p-2 rounded-full ${avatar === "/images/avatars/female.png" ? "ring-2 ring-[#7BA5B9]" : ""}`}
            >
              <Image src="/images/avatars/female.png" alt="Female Avatar" width={64} height={64} className="rounded-full" />
            </button>
          </div>
        </div>

        {/* Name Field */}
        <div className="bg-white rounded-lg p-4 shadow-sm mb-4 flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600">Name</p>
            {isEditingName ? (
              <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
            ) : (
              <p className="font-medium text-[#1a2c48] mt-1">{name}</p>
            )}
          </div>
          <Button variant="ghost" onClick={() => setIsEditingName(!isEditingName)}>
            <Pencil size={18} />
          </Button>
        </div>

        {/* Email Field */}
        <div className="bg-white rounded-lg p-4 shadow-sm mb-4 flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600">Email</p>
            {isEditingEmail ? (
              <Input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
            ) : (
              <p className="font-medium text-[#1a2c48] mt-1">{email}</p>
            )}
          </div>
          <Button variant="ghost" onClick={() => setIsEditingEmail(!isEditingEmail)}>
            <Pencil size={18} />
          </Button>
        </div>

        {/* Save Profile */}
        <Button onClick={saveProfile} className="w-full mb-6 bg-[#7BA5B9] hover:bg-[#6B95A9] text-white" disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </Button>

        {/* Password Update */}
        <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <p className="text-sm text-gray-600">New Password</p>
          <Input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 mb-3"
          />
          <p className="text-sm text-gray-600">Confirm New Password</p>
          <Input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1"
          />
          <Button className="mt-2" onClick={savePassword} disabled={loading}>
            {loading ? "Saving..." : "Change Password"}
          </Button>
        </div>

        {/* Logout All Devices */}
        <Button
          variant="outline"
          className="w-full mb-3 text-red-500 border-red-500 hover:bg-red-50"
          onClick={logoutAllDevices}
        >
          Logout from All Devices
        </Button>

        {/* Delete Account */}
        <Button
          variant="destructive"
          className="w-full mb-6"
          onClick={deleteAccount}
        >
          Delete Account
        </Button>
      </div>
    </div>
  )
}
