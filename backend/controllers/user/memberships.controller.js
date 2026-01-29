const Membership = require('@/models/membership.model')
const User = require('@/models/user/user.model')
const MemPrice = require('@/models/membershipprice.model')
const crypto = require('crypto')
const { membershipMail } = require('@/utils/mail')
const { getAmount } = require('@/utils/membership')
const { getAtomFromGateway } = require('@/utils/payment')
require('dotenv').config()

const { decrypt, generateSignature } = require('@/utils/payment')

const getMembershipPrices = async (req, res) => {
  try {
    const membershipPrices = await MemPrice.find()
    return res.status(200).json(membershipPrices)
  } catch (error) {
    console.error('Error fetching membership prices:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const setMembershipPrice = async (req, res) => {
  try {
    const { name, price, validity, availQR, passType, movieCount } = req.body

    const updateData = { price, validity, availQR }

    // Add Film Fest Pass specific fields
    if (passType) {
      updateData.passType = passType
    }
    if (movieCount) {
      updateData.movieCount = movieCount
    }

    const updatedMembership = await MemPrice.findOneAndUpdate(
      { name },
      updateData,
      { new: true, upsert: true }
    )

    return res.status(200).json(updatedMembership)
  } catch (error) {
    console.error('Error updating membership price:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const saveMembership = async (req, res) => {
  try {
    const decrypted_data = decrypt(req.body.encData)
    const jsonData = JSON.parse(decrypted_data)
    const signature = generateSignature(jsonData.payInstrument)
    if (signature !== jsonData.payInstrument.payDetails.signature) {
      console.log('signature mismatched!!')
      return res.redirect(
        `${process.env.FRONTEND_URL}/home?err=signature_mismatched`
      )
    }
    if (jsonData.payInstrument.responseDetails.statusCode !== 'OTS0000') {
      return res.redirect(
        `${process.env.FRONTEND_URL}/home?err=transaction_failed`
      )
    }

    const memtype = jsonData.payInstrument.extras.udf1
    const userId = jsonData.payInstrument.extras.udf2
    const email = jsonData.payInstrument.custDetails.custEmail.toLowerCase()
    const txnId = jsonData.payInstrument.merchDetails.merchTxnId
    const anyMems = await Membership.find({
      user: userId,
      isValid: true
    })
    for (anyMem of anyMems) {
      let shouldInvalidate = false

      // Check if membership should be invalidated based on type
      if (anyMem.validitydate < Date.now()) {
        shouldInvalidate = true
      } else if (anyMem.memtype === 'filmFest') {
        const moviesUsed = anyMem.moviesUsed || []
        const movieCount = anyMem.movieCount || 0
        shouldInvalidate = moviesUsed.length >= movieCount
      } else {
        shouldInvalidate = anyMem.availQR <= 0
      }

      if (shouldInvalidate) {
        anyMem.isValid = false
        if (anyMem.memtype !== 'filmFest') {
          anyMem.availQR = 0
        }
        await anyMem.save()
      } else {
        return res.redirect(`${process.env.FRONTEND_URL}/home`)
      }
    }
    const memData = await MemPrice.find()
    const memDetails = memData.find((m) => m.name === memtype)
    const { validity, availQR, passType, movieCount } = memDetails

    const membershipData = {
      user: userId,
      memtype,
      txnId,
      validity,
      availQR,
      amount: getAmount(memtype, email),
      validitydate: new Date(Date.now() + validity * 1000)
    }

    // Add Film Fest Pass specific fields
    if (passType === 'filmFest') {
      membershipData.movieCount = movieCount
      membershipData.moviesUsed = []
    }

    const newusermem = new Membership(membershipData)
    const savedusermem = await newusermem.save()
    console.log('Usermem details saved:', savedusermem)
    await membershipMail(memtype, email.toLowerCase())
    return res.redirect(`${process.env.FRONTEND_URL}/home?success_payment=true`)
  } catch (error) {
    console.error('Error saving Usermem:', error)
    return res.redirect(
      `${process.env.FRONTEND_URL}/home?err=internal_server_error`
    )
  }
}

const manualAdd = async (req, res) => {
  try {
    const { userEmail, txnId, membershipType, amount } = req.body

    const user = await User.findOne({ email: userEmail.toLowerCase() })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    const memData = await MemPrice.find()
    const memDetails = memData.find((m) => m.name === membershipType)
    if (!memDetails) {
      return res.status(400).json({ error: 'Invalid membership type' })
    }

    const { validity, availQR, passType, movieCount } = memDetails

    // Map membership name to enum value
    const memtypeMapping = {
      base: 'base',
      silver: 'silver',
      gold: 'gold',
      diamond: 'diamond',
      'Film Fest': 'filmFest',
      'Foodie Film Fest': 'filmFest'
    }

    const membershipData = {
      user: user._id,
      memtype: memtypeMapping[membershipType] || membershipType.toLowerCase(),
      txnId,
      validity,
      availQR,
      amount,
      validitydate: new Date(Date.now() + validity * 1000)
    }

    // Add Film Fest Pass specific fields
    if (passType === 'filmFest') {
      membershipData.movieCount = movieCount
      membershipData.moviesUsed = []
    }

    const newMembership = new Membership(membershipData)

    await newMembership.save()
    await membershipMail(membershipType, userEmail.toLowerCase())

    res
      .status(201)
      .json({ success: true, message: 'Membership added successfully' })
  } catch (error) {
    console.error('Error in manualAdd:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const assignBaseMembership = async (req, res) => {
  try {
    const memData = await MemPrice.find()
    const coreTeamUsers = await User.find({ usertype: 'ticketvolunteer' })
    const baseMembership = memData.find((m) => m.name === 'base')

    if (!baseMembership) {
      return res.status(400).json({ message: 'Base membership not found' })
    }

    const { validity, availQR } = baseMembership

    const newMemberships = coreTeamUsers.map((user) => ({
      user: user._id,
      memtype: 'base',
      txnId: 'coreteam',
      validity,
      availQR,
      amount: getAmount('base', user.email),
      validitydate: new Date(Date.now() + validity * 1000)
    }))

    await Membership.insertMany(newMemberships)

    return res.status(200).json({
      message: 'Base membership assigned successfully to all core team users'
    })
  } catch (error) {
    console.error('Error assigning base membership:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const requestMembership = async (req, res) => {
  try {
    const { userId } = req.user
    const { memtype } = req.body
    const memData = await MemPrice.find()
    if (!memtype || memData.map((m) => m.name).indexOf(memtype) === -1) {
      return res.status(400).json({ message: 'Membership type is required' })
    }
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const userMemberships = await Membership.find({
      user: user._id,
      isValid: true
    })
    for (mem of userMemberships) {
      let hasValidPasses = false

      // Check if membership still has valid passes based on type
      if (mem.memtype === 'filmFest') {
        const moviesUsed = mem.moviesUsed || []
        const movieCount = mem.movieCount || 0
        hasValidPasses =
          mem.validitydate > Date.now() && moviesUsed.length < movieCount
      } else {
        hasValidPasses = mem.validitydate > Date.now() && mem.availQR > 0
      }

      if (hasValidPasses) {
        return res
          .status(400)
          .json({ message: 'User already has a valid membership' })
      }
      mem.isValid = false
      if (mem.memtype !== 'filmFest') {
        mem.availQR = 0
      }
      await mem.save()
    }

    const txnId = crypto.randomBytes(16).toString('hex')
    const txnDate = new Date()
      .toISOString()
      .replace(/T/, ' ')
      .replace(/\..+/, '')
    const amount = await getAmount(memtype, user.email)
    const userEmailId = user.email
    const userContactNo = user.phone

    const { error, atomTokenId, merchId } = await getAtomFromGateway(
      txnId,
      txnDate,
      amount,
      userEmailId,
      userContactNo,
      user._id.toString(),
      {
        udf1: memtype,
        udf2: user._id.toString(),
        udf3: '',
        udf4: '',
        udf5: ''
      }
    )
    if (error) {
      return res.status(500).json({ error })
    }
    return res.status(200).json({
      atomTokenId: atomTokenId,
      txnId: txnId,
      merchId: merchId
    })
  } catch (error) {
    console.error('Error requesting membership:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const checkMembership = async (req, res) => {
  try {
    const { userId } = req.user
    const allMemberships = await Membership.find({ user: userId })

    // Invalidate memberships based on their type
    const invalidMemberships = allMemberships.filter((m) => {
      // Check validity date for all memberships
      if (m.validitydate < Date.now()) return true

      // For Film Fest Pass, check if all movies are used
      if (m.memtype === 'filmFest') {
        const moviesUsed = m.moviesUsed || []
        const movieCount = m.movieCount || 0
        return moviesUsed.length >= movieCount
      }

      // For standard passes, check availQR
      return m.availQR <= 0
    })

    for (m of invalidMemberships) {
      m.isValid = false
      if (m.memtype !== 'filmFest') {
        m.availQR = 0
      }
      await m.save()
    }

    return res.json({
      hasMembership: allMemberships.some((m) => m.isValid),
      memberships: allMemberships.map((m) => ({
        _id: m._id,
        memtype: m.memtype,
        validitydate: m.validitydate,
        availQR: m.availQR,
        isValid: m.isValid,
        purchasedate: m.purchasedate,
        movieCount: m.movieCount,
        moviesUsed: m.moviesUsed
      }))
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const suspendMembership = async (req, res) => {
  const { userId } = req.user
  const { id: membershipId } = req.params
  try {
    const userMemberships = await Membership.find({ user: userId })
    let membershipSuspended = false

    for (membership of userMemberships) {
      let shouldSuspend = false

      // Check if membership should be suspended
      if (
        membership.validitydate < Date.now() ||
        membership._id.toString() === membershipId
      ) {
        shouldSuspend = true
      } else if (membership.memtype === 'filmFest') {
        const moviesUsed = membership.moviesUsed || []
        const movieCount = membership.movieCount || 0
        shouldSuspend = moviesUsed.length >= movieCount
      } else {
        shouldSuspend = membership.availQR <= 0
      }

      if (shouldSuspend) {
        membership.isValid = false
        if (membership.memtype !== 'filmFest') {
          membership.availQR = 0
        }
        await membership.save()
        membershipSuspended = true
      }
    }

    if (membershipSuspended) {
      res.status(200).send('Memberships suspended successfully')
    } else {
      res.status(404).send('No current memberships found for the user')
    }
  } catch (error) {
    console.error('Error suspending memberships:', error)
    res.status(500).send('Internal server error')
  }
}

const createMembership = async (req, res) => {
  try {
    const { name, price, validity, availQR, passType, movieCount } = req.body

    // Check if membership with this name already exists
    const existingMembership = await MemPrice.findOne({ name })
    if (existingMembership) {
      return res
        .status(400)
        .json({ message: 'Membership with this name already exists' })
    }

    const membershipData = {
      name,
      price,
      validity,
      availQR
    }

    // Add Film Fest Pass specific fields
    if (passType) {
      membershipData.passType = passType
    }
    if (movieCount) {
      membershipData.movieCount = movieCount
    }

    const newMembership = new MemPrice(membershipData)

    const savedMembership = await newMembership.save()
    return res.status(201).json(savedMembership)
  } catch (error) {
    console.error('Error creating membership:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = {
  saveMembership,
  checkMembership,
  suspendMembership,
  requestMembership,
  assignBaseMembership,
  getMembershipPrices,
  setMembershipPrice,

  manualAdd,
  createMembership
}
