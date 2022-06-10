const express = require('express')
const router = express.Router()
const user = require('../controller/user')

router.post('/create', user.register)
router.post('/login', user.login)
router.get('/decodeToken', user.decodeToken)


module.exports = router
