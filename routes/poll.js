const express = require("express")
const mongoose = require("mongoose")
const Vote = require("../models/Vote")
const router = express.Router()

const Pusher = require("pusher")

var channels_client = new Pusher({
  appId: '843622',
  key: '46ee32ae292a6885d35a',
  secret: 'defa117fe6d0fa353205',
  cluster: 'us2',
  encrypted: true
})

router.get("/", async(req, res) => {
    Vote.find()
    .then(votes => {
        res.status(200).json({success: true,votes: votes})
    })
    .catch(err => {
        console.log("Error getting it")
    })
})

router.post("/", async(req, res) => {
    const newVote = {
        os: req.body.os,
        points: 1
    }

    new Vote(newVote).save()
    .then(vote => {
        channels_client.trigger('os-poll', 'os-vote', {
            points: parseInt(vote.points),
            os: vote.os
        });

        return res.json({success: true, message: 'Thank you for voting',os: vote.os, points: parseInt(vote.points)});
    })
    .catch(err => {
        console.log("Error Saving to DB")
    })
})

module.exports = router
