const SeatMap = require('@/models/seatmap.model')
const QR = require('@/models/qr.model')
const Movie = require('@/models/movie.model')
const Membership = require('@/models/membership.model')
const { mailQRs } = require('@/utils/mail')
const crypto = require('crypto')
const seatOccupancy = async (req, res) => {
  try {
    const { showtimeId } = req.params

    let seatMap = await SeatMap.findOne({ showtimeId: showtimeId })

    if (!seatMap) {
      seatMap = new SeatMap({ showtimeId: showtimeId })
    }
    return res.json(seatMap.seats)
  } catch (error) {
    console.error('Error fetching seat occupancy:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const seatAssign = async (req, res) => {
  try {
    const { showtimeId } = req.params
    const { seats } = req.body
    if (!seats || !seats.length) {
      return res.status(400).json({ error: 'No seats provided' })
    }
    const seatMap = await SeatMap.findOne({ showtimeId: showtimeId })
    if (!seatMap) {
      return res.status(400).json({ error: 'Invalid showtime' })
    }
    const currentMembership = await Membership.findOne({
      user: req.user.userId,
      isValid: true
    })
    if (!currentMembership) {
      return res.status(400).json({ error: 'no active membership' })
    }
    if (currentMembership.validitydate < new Date()) {
      currentMembership.isValid = false
      await currentMembership.save()
      return res.status(400).json({ error: 'no active membership' })
    }
    if (currentMembership.availQR < seats.length) {
      return res
        .status(400)
        .json({ error: 'No valid membership or not enough passes left' })
    }
    const movie = await Movie.findOne({ 'showtimes._id': showtimeId })
    if (!movie) {
      return res.status(400).json({ error: 'Invalid showtime' })
    }
    const showtime = movie.showtimes.id(showtimeId)

    if (showtime.date < new Date()) {
      movie.showtimes = movie.showtimes.filter(
        (showtime) => showtime.date >= new Date()
      )
      const showToRemove = movie.showtimes.filter(
        (showtime) => showtime.date < new Date()
      )
      const seatmaps = await SeatMap.find({
        showtimeId: { $in: showToRemove.map((showtime) => showtime._id) }
      })
      await Promise.all(
        seatmaps.map(async (seatmap) => {
          await seatmap.remove()
        })
      )
      await movie.save()
      return res.status(400).json({ error: 'Invalid showtime' })
    }

    for (seat of seats) {
      if (!seatMap.seats.has(seat)) {
        return res.status(400).json({ error: 'Invalid seat(s)' })
      }
    }

    let seatRes = []
    for (let seat of seats) {
      if (seatMap.seats.get(seat)) {
        seatRes.push({
          seat: seat,
          message: 'Seat already assigned'
        })
        continue
      }
      const qr = new QR({
        user: req.user._id,
        membership: currentMembership._id,
        txnId: currentMembership.txnId,
        seat: seat,
        showtime: showtimeId,
        code: crypto.randomBytes(16).toString('hex'),
        expirationDate: new Date(
          new Date(showtime.date).getTime() + 3 * 60 * 60 * 1000
        )
      })
      seatMap.seats.set(seat, qr._id)
      try {
        await seatMap.save()
        await qr.save()
        currentMembership.availQR -= 1
        seatRes.push({
          seat: seat,
          qrId: qr._id,
          hash: qr.code,
          message: 'Seat assigned'
        })
      } catch (error) {
        seatRes.push({
          seat: seat,
          message: 'Error assigning seat'
        })
      }
    }
    if (currentMembership.availQR === 0) {
      currentMembership.isValid = false
    }
    await currentMembership.save()

    if (seatRes.length === 0) {
      return res.status(400).json({ error: 'Error assigning seats' })
    }
    if (seatRes.some((s) => s.message === 'Seat assigned')) {
      try {
        mailQRs(
          seatRes.filter((s) => s.message === 'Seat assigned'),
          req.user,
          movie,
          showtime
        )
      } catch (error) {
        console.log('Error sending mail:', error)
      }
    }
    return res.json(seatRes.map((s) => ({ seat: s.seat, message: s.message })))
  } catch (error) {
    console.error('Error assigning seats:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { seatOccupancy, seatAssign }
