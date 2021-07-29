const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const User = require("../models/User");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const Memo = require("../models/Memo");
// @route   Get api/sections
// @desc    Get Sections
// @access  Public to change later for debugging purposes only

router.get("/", auth, async (req, res) => {
  try {
    const sections = await Section.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(sections);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/sections
// @desc    Add Section
// @access  Private
router.post(
  "/",
  [auth, [check("name", "Name is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;
    try {
      let newSection = await Section.findOne({ name: name });
      if (newSection) {
        return res.status(400).json({ msg: "Section already exists" });
      }
      newSection = new Section({
        name,
        user: req.user.id,
        description: "",
      });
      const section = await newSection.save();
      const array = [{ msg: section.name + " Successfully added" }];
      array.push(section);
      res.json(array);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   Put api/sections
// @desc    Change section Name
// @access  private
router.put("/:id", (req, res) => {
  res.send("Section Changed");
});

// @route   Delete api/sections
// @desc    Delete a section and sub section of it
// i don't really know if it really gonna be effective to do that or not
// delete a sections may make proplems because it gonna delete all the subSections
// and if a subsections Deleted the Memos it had will be deleted too
// maybe i have to force the user first if he wanna delete a specific section he must first make sure the section don't have any subsection
// this is much bettter and easier actually to achieve
router.delete("/:id", auth, async (req, res) => {
  try {
    let section = await Section.findById(req.params.id);
    // console.log(section);
    if (!section) return res.status(404).json({ msg: "Section not found" });
    // here something to do Delete all subsection that belongs to this id
    if (section.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }
    let subsections = await SubSection.find({ section: req.params.id });
    if (subsections) {
      subsections.forEach(async (subSection) => {
        let memos = await Memo.find({ subsection: subSection._id });
        if (memos) {
          memos.forEach(async (memo) => {
            await Memo.findByIdAndRemove(memo._id);
          });
        }
        await SubSection.findByIdAndRemove(subSection._id);
      });
    }
    await Section.findByIdAndRemove(req.params.id);
    res.json("success");
  } catch (err) {}
});

module.exports = router;
