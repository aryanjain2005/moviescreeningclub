export const allowedLvl = (level) => {
  if (level === 'admin') {
    return ['admin']
  }
  if (level === 'volunteer') {
    return ['admin', 'volunteer']
  }
  if (level === 'movievolunteer') {
    return ['admin', 'volunteer', 'movievolunteer']
  }
  if (level === 'ticketvolunteer') {
    return ['admin', 'volunteer', 'movievolunteer', 'ticketvolunteer']
  }
  return ['admin', 'volunteer', 'movievolunteer', 'ticketvolunteer', 'standard']
}

export const isAllowedLvl = (minLevel, userType) =>
  allowedLvl(minLevel).includes(userType)
