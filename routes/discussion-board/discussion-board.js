var express = require('express');
var router = express.Router();

var discussionController = require('../../controllers/discussion-controller.js');

router.get('/', discussionController.getAllDiscussion);
router.post('/reply', discussionController.reply);
router.post('/like', discussionController.like);
router.post('/delete', discussionController.deleteDiscussion);
router.post('/delReply', discussionController.delreply);

module.exports = router;