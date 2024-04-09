const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const cartsSchema = require('../schemas/cartsSchema');
const Carts = new mongoose.model('CartsData', cartsSchema);


router.get('/', async (req, res) => {
    const { email } = req.query;
    const query = {email: email};
    try {
        const data = await Carts.find(query);
        res.json(data);
    } catch (err) {
        res.status(500).json({
            message: "error",
        });
    }
})
router.get('/:title', async (req, res) => {
    try {
        const { title } = req.params;
        const query = { title: title }
        const data = await Carts.find(query);
        res.json(data);
    } catch (err) {
        res.status(500).json({
            message: "error",
        });
    }
})


router.post('/', async (req, res) => {
    try {
        const data = req.body;
        const CartsData = new Carts(data);
        await CartsData.save().then(() => {
            res.status(200).json({
                message: 'success'
            })
        })
    } catch (err) {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: 'error'
            })
        }
    }

})

router.delete('/items', async (req, res) => {
    try {
        const { title } = req.query;
        console.log(title);
        const query = { title: title };
        await Carts.deleteMany(query).then(() => {
            res.status(200).json({
                message: 'success'
            })
        })
    } catch (error) {
        if (error) {
            console.log(error);
            res.status(500).json({
                message: 'error'
            })
        }
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const query = { _id: new Object(id) }
    await Carts.deleteOne(query).then(() => {
        res.status(200).json({
            message: 'item deleted'
        })
    }).catch((err) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: 'error'
            })
        }
    })
})


module.exports = router;