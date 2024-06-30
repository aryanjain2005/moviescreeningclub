const memData = [
  {
    name: 'base',
    price: 100,
    validity: 10 * 24 * 3600,
    availQR: 1
  },
  {
    name: 'silver',
    price: 200,
    validity: 30 * 24 * 3600,
    availQR: 2
  },
  {
    name: 'gold',
    price: 300,
    validity: 90 * 24 * 3600,
    availQR: 3
  },
  {
    name: 'diamond',
    price: 400,
    validity: 365 * 24 * 3600,
    availQR: 4
  }
]
module.exports = { memData }
