const QRCode = require('qrcode')
const jwt = require('jsonwebtoken')
const QR = require('@/models/qr.model')
const Movie = require('@/models/movie.model')

const getQRs = async (req, res) => {
  const { userId } = req.user
  try {
    const allQRs = await QR.find({ user: userId }).sort({
      registrationDate: -1
    })

    const resQr = {
      used: [],
      unused: [],
      expired: [],
      cancelled: []
    }
    for (qr of allQRs) {
      if (qr.expirationDate > new Date()) {
        if (qr.used) {
          resQr.used.push({
            expirationDate: qr.expirationDate,
            isValid: qr.isValid,
            registrationDate: qr.registrationDate,
            seat: qr.seat,
            used: qr.used
          })
        } else if (qr.deleted) {
          resQr.cancelled.push({
            expirationDate: qr.expirationDate,
            isValid: qr.isValid,
            registrationDate: qr.registrationDate,
            seat: qr.seat,
            used: qr.used
          })
        } else {
          const movie = await Movie.findOne({ 'showtimes._id': qr.showtime })

          resQr.unused.push({
            id: qr._id,
            qrData: await QRCode.toDataURL(qr.code),
            expirationDate: qr.expirationDate,
            isValid: qr.isValid,
            registrationDate: qr.registrationDate,
            seat: qr.seat,
            used: qr.used,
            movie: !!movie && {
              title: movie.title,
              genre: movie.genre,
              showtime: movie.showtimes.id(qr.showtime)
            },
            free: qr.free || false
          })
        }
      } else {
        qr.isValid = false
        resQr.expired.push({
          expirationDate: qr.expirationDate,
          isValid: qr.isValid,
          registrationDate: qr.registrationDate,
          seat: qr.seat,
          used: qr.used
        })
        qr.save()
      }
    }

    res.status(200).json({ qrCodes: resQr })
  } catch (error) {
    console.error('Error fetching valid QR codes:', error)
    res.status(500).json({ error: 'Error fetching valid QR codes' })
  }
}

const cancelQr = async (req, res) => {
  try {
    const qrId = req.params.id
    const qr = await QR.findOneAndUpdate(
      {
        _id: qrId,
        user: req.user.userId,
        used: false,
        deleted: false
      },
      { deleted: true },
      {
        new: true
      }
    )
    if (!qr) {
      return res.status(404).json({ error: 'QR not found' })
    }
    res.status(200).json({ message: 'QR cancelled' })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Internal server error  ' })
  }
}
const check = async (req, res) => {
  try {
    const qrData = req.body.qrData
    if (!qrData) {
      return res.status(400).json({ error: 'No QR data provided' })
    }
    let userId, qrId, seat, hash
    try {
      ;({ userId, qrId, seat, hash } = jwt.verify(
        qrData,
        process.env.JWT_SECRET_QR ?? 'lolbhai'
      ))
    } catch (err) {
      return res.status(400).json({ error: 'Invalid QR data' })
    }
    const qr = await QR.findOne({ _id: qrId, user: userId, seat, code: qrData })
      .populate('user')
      .populate('membership')

    if (!qr) {
      return res.json({ exists: false })
    }
    if (qr.deleted) {
      return res.json({
        exists: true,
        cancelled: true
      })
    }
    if (qr.used) {
      return res.json({
        exists: true,
        validityPassed: false,
        used: true
      })
    }
    if (qr.expirationDate < new Date()) {
      qr.isValid = false
      qr.save()
      return res.json({
        exists: true,
        validityPassed: true,
        used: false
      })
    }

    const updateed = await QR.findOneAndUpdate(
      { _id: qrId, used: false },
      { used: true }
    )
    if (!updateed) {
      return res.json({
        exists: true,
        validityPassed: false,
        used: true
      })
    }
    const movie = await Movie.findOne({ 'showtimes._id': qr.showtime })
    return res.json({
      exists: true,
      validityPassed: false,
      used: false,
      cancelled: false,
      email: qr.user.email,
      seat: qr.seat,
      name: qr.user.name,
      show: movie.showtimes.id(qr.showtime).date,
      movie: movie.title
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
module.exports = {
  getQRs,
  check,
  cancelQr
}
