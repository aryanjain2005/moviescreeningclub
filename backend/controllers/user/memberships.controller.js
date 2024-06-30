const Membership = require('@/models/membership.model')
const User = require('@/models/user/user.model')
const { memData } = require('@/constants/memberships')
const crypto = require('crypto')
const { membershipMail } = require('@/utils/mail')
const axios = require('axios')
const qs = require('qs')
require('dotenv').config()

const { encrypt, decrypt, generateSignature } = require('@/utils/payment')

const merchId = `${process.env.MERCH_ID}`
const merchPass = `${process.env.MERCH_PASS}`
const authUrl = `${process.env.PAY_AUTH_URL}`

const fetchMembership = async (req, res) => {
  const { email } = req.user
  try {
    const memberships = await Membership.find({ email })
    res.status(200).json({ memberships })
  } catch (error) {
    console.error('Error fetching memberships:', error)
    res.status(500).json({ error: 'Error fetching memberships' })
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
    const email = jsonData.payInstrument.custDetails.custEmail
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
      validitydate: new Date(Date.now() + validity * 1000)
    })
    const savedusermem = await newusermem.save()
    console.log('Usermem details saved:', savedusermem)
    await membershipMail(memtype, email)
    return res.redirect(`${process.env.FRONTEND_URL}/home`)
  } catch (error) {
    console.error('Error saving Usermem:', error)
    return res.redirect(
      `${process.env.FRONTEND_URL}/home?err=internal_server_error`
    )
  }
}

const requestMembership = async (req, res) => {
  try {
    const { userId } = req.user
    const { memtype } = req.body
    if (!memtype || memData.map((m) => m.name).indexOf(memtype) === -1) {
      return res.status(400).json({ message: 'Membership type is required' })
    }
    const membership = await Membership.findOne({ user: userId, isValid: true })
    const userMemberships = await Membership.find({
      user: userId,
      isValid: true
    })
    for (membership of userMemberships) {
      if (membership.validitydate > Date.now() && membership.availQR > 0) {
        return res
          .status(400)
          .json({ message: 'User already has a valid membership' })
      }
      membership.isValid = false
      membership.availQR = 0
      await membership.save()
    }
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const txnId = crypto.randomBytes(16).toString('hex')
    const txnDate = new Date()
      .toISOString()
      .replace(/T/, ' ')
      .replace(/\..+/, '')
    const amount = memData.find((m) => m.name === memtype).price
    const userEmailId = user.email
    const userContactNo = user.phone

    const reqAtomId = {
      payInstrument: {
        headDetails: {
          version: 'OTSv1.1',
          api: 'AUTH',
          platform: 'FLASH'
        },
        merchDetails: {
          merchId: merchId,
          userId: user._id.toString(),
          password: merchPass,
          merchTxnId: txnId,
          merchTxnDate: txnDate
        },
        payDetails: {
          amount: amount.toString(),
          product: 'NSE',
          txnCurrency: 'INR'
        },
        custDetails: {
          custEmail: userEmailId,
          custMobile: userContactNo.toString()
        },
        extras: {
          udf1: memtype,
          udf2: user._id.toString(),
          udf3: '',
          udf4: '',
          udf5: ''
        }
      }
    }
    const reqAtomIdStr = JSON.stringify(reqAtomId)
    const encReqAtomIdStr = encrypt(reqAtomIdStr)

    const resFromGateway = await axios.post(
      authUrl,
      qs.stringify({
        encData: encReqAtomIdStr,
        merchId: merchId
      }),
      {
        headers: {
          'cache-control': 'no-cache',
          'content-type': 'application/x-www-form-urlencoded'
        }
      }
    )
    if (resFromGateway.status !== 200) {
      return res.status(500).json({ error: 'Internal server error' })
    }
    const parsedRespFromGateway = qs.parse(resFromGateway.data)
    if (!parsedRespFromGateway.encData) {
      return res.status(400).json({ error: 'Transaction failed' })
    }
    const decryptedResFromGateway = decrypt(parsedRespFromGateway.encData)
    const jsonDecryptedResFromGateway = JSON.parse(decryptedResFromGateway)

    if (
      jsonDecryptedResFromGateway.responseDetails.txnStatusCode !== 'OTS0000'
    ) {
      return res.status(400).json({ error: 'Transaction failed' })
    }
    console.log(jsonDecryptedResFromGateway.atomTokenId)
    return res.status(200).json({
      atomTokenId: jsonDecryptedResFromGateway.atomTokenId,
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
      hasMembership: allMemberships.some((m) => m.isValid)
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
  fetchMembership,
  saveMembership,
  checkMembership,
  suspendMembership,
  requestMembership
}
