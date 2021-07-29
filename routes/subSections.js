const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const SubSection = require("../models/SubSection");
const Memo = require("../models/Memo");
// @route   GET api/subSections
// @Desc    get subSections of specific Section
// @access  public till front-end made
router.get("/", auth, async (req, res) => {
  try {
    const subSection = await SubSection.find({ section: req.query.id }).sort({
      date: -1,
    });
    res.json(subSection);
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

    const { name, section } = req.body;
    console.log(req.body);
    try {
      const newSubSection = new SubSection({
        name,
        user: req.user.id,
        section: section,
      });
      const subSection = await newSubSection.save();
      res.json(subSection);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);
router.delete("/:id", auth, async (req, res) => {
  try {
    let subSection = await SubSection.findById(req.params.id);
    if (!subSection) res.status(404).json({ msg: "SubSection not found" });
    if (subSection.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }
    let memos = await Memo.find({ subsection: subSection._id });
    if (memos) {
      memos.forEach(async (memo) => {
        await Memo.findByIdAndRemove(memo._id);
      });
    }
    await SubSection.findByIdAndRemove(req.params.id);
    res.json("success");
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
