const Membership = require('@/models/membership.model')
const User = require('@/models/user/user.model')
const memData = require('@constants/memberships.json')
const crypto = require('crypto')
const { membershipMail } = require('@/utils/mail')
const { getAmount } = require('@/utils/membership')
const { getAtomFromGateway } = require('@/utils/payment')
require('dotenv').config()

const { decrypt, generateSignature } = require('@/utils/payment')

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
      if (anyMem.availQR <= 0 || anyMem.validitydate < Date.now()) {
        anyMem.isValid = false
        anyMem.availQR = 0
        await anyMem.save()
      } else {
        return res.redirect(`${process.env.FRONTEND_URL}/home`)
      }
    }
    const memDetails = memData.find((m) => m.name === memtype)
    const { validity, availQR } = memDetails
    const newusermem = new Membership({
      user: userId,
      memtype,
      txnId,
      validity,
      availQR,
      amount: getAmount(memtype, email),
      validitydate: new Date(Date.now() + validity * 1000)
    })
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
const assignBaseMembership = async (req, res) => {
  try {
    const coreTeamUsers = await User.find({ usertype: 'ticketvolunteer' })
    const baseMembership = memData.find((m) => m.name === 'base')

    if (!baseMembership) {
      return res.status(400).json({ message: 'Base membership not found' })
    }

    const { validity, availQR } = baseMembership

    const newMemberships = coreTeamUsers.map(user => ({
      user: user._id,
      memtype: 'base',
      txnId: 'coreteam',
      validity,
      availQR,
      amount: getAmount('base', user.email),
      validitydate: new Date(Date.now() + validity * 1000),
    }))

    await Membership.insertMany(newMemberships)

    return res.status(200).json({ message: 'Base membership assigned successfully to all core team users' })
  } catch (error) {
    console.error('Error assigning base membership:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}


const requestMembership = async (req, res) => {
  try {
    const { userId } = req.user
    const { memtype } = req.body
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
      if (mem.validitydate > Date.now() && mem.availQR > 0) {
        return res
          .status(400)
          .json({ message: 'User already has a valid membership' })
      }
      mem.isValid = false
      mem.availQR = 0
      await mem.save()
    }

    const txnId = crypto.randomBytes(16).toString('hex')
    const txnDate = new Date()
      .toISOString()
      .replace(/T/, ' ')
      .replace(/\..+/, '')
    const amount = getAmount(memtype, user.email)
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
    res.status(500).json({ error: 'Internal server error' })
  }
}

const checkMembership = async (req, res) => {
  try {
    const { userId } = req.user
    const allMemberships = await Membership.find({ user: userId })

    const invalidMemberships = allMemberships.filter(
      (m) => m.validitydate < Date.now() || m.availQR <= 0
    )
    for (m of invalidMemberships) {
      m.isValid = false
      m.availQR = 0
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
        purchasedate: m.purchasedate
      }))
    })
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const suspendMembership = async (req, res) => {
  const { userId } = req.user
  const { id: membershipId } = req.params
  try {
    const userMemberships = await Membership.find({ user: userId })
    const membershipSuspended = false

    for (membership of userMemberships) {
      if (
        membership.validitydate < Date.now() ||
        membership.availQR <= 0 ||
        membership._id === membershipId
      ) {
        membership.isValid = false
        membership.availQR = 0
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

module.exports = {
  saveMembership,
  checkMembership,
  suspendMembership,
  requestMembership,
  assignBaseMembership,
}
