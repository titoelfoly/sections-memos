const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const Memo = require("../models/Memo");

// @route   GET api/memos
// @Desc    get memos of specific subSection
// @access  public till front-end made
router.get("/", auth, async (req, res) => {
  try {
    const memo = await Memo.find({ subsection: req.query.id }).sort({
      date: -1,
    });
    res.json(memo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   Post api/subSections
// @Desc    add new subSection
// @access  public till authentications made

router.post(
  "/",
  [auth, [check("name", "Name is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, id, content } = req.body;
    try {
      const newMemo = new Memo({
        name,
        user: req.user.id,
        subsection: id,
        content,
      });
      const memo = await newMemo.save();
      res.json(memo);
    } catch (err) {
      console.error(err.message);
    }
  }
);
router.delete("/:id", auth, async (req, res) => {
  try {
    let memo = await Memo.findById(req.params.id);
    if (!memo) return res.status(404).json({ msg: "Memo not found" });
    if (memo.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }
    await Memo.findByIdAndRemove(req.params.id);
    res.json("success");
  } catch (err) {
    console.error(err.message, "here");
  }
});

module.exports = router;
