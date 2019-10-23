const router = require('express').Router();
const db = require('./service-model')
// const request = require('request');

const bcrypt = require('bcryptjs')
const {serviceToken} = require('../../token/token')
const blocked = require('./service-middleware')


router.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
  });


// app.get('/jokes/random', (req, res) => {
//   request(
//     { url: 'https://tipsease-msm.herokuapp.com' },
//     (error, response, body) => {
//       if (error || response.statusCode !== 200) {
//         return res.status(500).json({ type: 'error', message: err.message });
//       }

//       res.json(JSON.parse(body));
//     }
//   )
// });




router.get('/', blocked, (req, res) => {

    // request(
    //     { url: 'https://tipsease-msm.herokuapp.com/api/serviceworker' },
    //     (error, response, body) => {
    //       if (error || response.statusCode !== 200) {
    //         return res.status(500).json({message: error });
    //       } 
          
    //     }
    //     )
        db.find()
            .then(response => {
                res.status(200).json(response)
            })
            .catch(err => {console.log(err)})

})


router.get('/:id', blocked, (req, res) => {

    // request(
    //     { url: 'https://tipsease-msm.herokuapp.com/api/serviceworker/' },
    //     (error, response, body) => {
    //       if (error || response.statusCode !== 200) {
    //         return res.status(500).json({ type: 'error', message: err.message });
    //       } else {} })



    const {id} = req.params

    db.findById(id)
        .then(response => {
            res.status(200).json(response)
        })
        .catch(err => res.status(500).json({err: 'Missing id'}))
})


router.post('/signup', (req, res) => {


    // request(
    //     { url: 'https://tipsease-msm.herokuapp.com/api/serviceworker' },
    //     (error, response, body) => {
    //       if (error || response.statusCode !== 200) {
    //         return res.status(500).json({ type: 'error', message: err.message });
    //       } else {} })


    const service = req.body
    const hash = bcrypt.hashSync(service.password, 12)
    service.password = hash

    db.add(service)
        .then(response => {
            res.status(201).json(response)
        })
        .catch(err => res.status(500).json({err: 'Missing creds'}))
})


router.post('/login', (req, res) => {

    // request(
    //     { url: 'https://tipsease-msm.herokuapp.com/api/serviceworker' },
    //     (error, response, body) => {
    //       if (error || response.statusCode !== 200) {
    //         return res.status(500).json({ type: 'error', message: err.message });
    //       } else {} })



    const { username, password } = req.body

    db.findBy({username})
        .first()
        .then(user => {
            if(user && bcrypt.compareSync(password, user.password)){
                const token = serviceToken(user)
                res.status(200).json({note: `user ${user.username} has a token` , token})
            } else {
                res.status(401).json({ message: 'Invalid creds my dude' });
            }
        })
        .catch(err => res.status(500).json({err: 'Missing creds'}))
})


router.delete('/:id', blocked, (req, res) => {

    // request(
    //     { url: 'https://tipsease-msm.herokuapp.com/api/serviceworker' },
    //     (error, response, body) => {
    //       if (error || response.statusCode !== 200) {
    //         return res.status(500).json({ type: 'error', message: err.message });
    //       } else {} })



    db.remove(req.params.id)
        .then(res.status(200).json({message: 'user has been deleted'}))
        .catch(err => res.status(500).json({ message: 'user not able to be deleted' }))
});


module.exports = router