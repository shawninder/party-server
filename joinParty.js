const log = require('./log')
const handleGuestDispatch = require('./handleGuestDispatch')
const handleGuestDisconnect = require('./handleGuestDisconnect')

module.exports = exports = function joinParty ({ req, resolve, reject, client, parties }) {
  const party = parties[req.name]
  const guestKeys = Object.keys(party.guests)
  if (party) {
    if (party.guests[req.socketKey]) {
      reject("Can't join party, you're already attending")
    } else {
      // TODO better management of requiring clients to have `socketKey`s, etc.
      client.on('dispatch', handleGuestDispatch({ client, req, parties }))
      client.on('disconnect', handleGuestDisconnect({ client, req, parties }))
      if (req.socketKey) {
        party.guests[req.socketKey] = client
        resolve({
          state: party.state
        })
        log(`${req.socketKey} joined ${req.name}`)
      } else {
        reject("Can't join party, missing `socketKey`")
      }
    }
  } else {
    reject("Can't join party, it doesn't exist!")
  }
}