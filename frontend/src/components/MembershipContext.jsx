import React, { createContext, useContext, useState } from 'react'
import { SERVERIP } from '../config'

const MembershipContext = createContext()

export const useMembershipContext = () => useContext(MembershipContext)

export const MembershipProvider = ({ children }) => {
  const [hasMembership, setHasMembership] = useState(false)

  const updateMembershipStatus = (status) => {
    setHasMembership(status)
  }

  return (
    <MembershipContext.Provider
      value={{ hasMembership, updateMembershipStatus }}
    >
      {children}
    </MembershipContext.Provider>
  )
}
