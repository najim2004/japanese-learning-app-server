const mongoose = require("mongoose");

const vocabularySchema = new mongoose.Schema(
  {
    word: { type: String, required: true },
    pronunciation: { type: String, required: true },
    meaning: { type: String, required: true },
    whenToSay: { type: String, required: true },
    lessonNo: { type: Number, required: true },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    slug: { type: String, unique: true },
    adminEmail: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Generate unique slug before saving
vocabularySchema.pre("save", async function (next) {
  if (!this.isModified("word")) return next();

  let slug = this.word.toLowerCase().replace(/[^a-z0-9]/g, "-");
  let counter = 0;

  // Check for existing slug and make it unique
  while (true) {
    const slugToTry = counter === 0 ? slug : `${slug}-${counter}`;
    const existingDoc = await this.constructor.findOne({ slug: slugToTry });

    if (!existingDoc) {
      this.slug = slugToTry;
      break;
    }
    counter++;
  }
  next();
});

module.exports = mongoose.model("Vocabulary", vocabularySchema);
