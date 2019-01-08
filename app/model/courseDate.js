module.exports = (app) => {
  const { mongoose } = app;
  const courseDateSchema = new mongoose.Schema({
    stuId: { type: String },
    courseUnits: [{
      dayOfWeek: String,
      timeStart: String, // 节次
      smartWeeks: Array,
      dateArr: Array,
      checked: Boolean,
      isPassCheck: Boolean,
      errorMessage: String,
    }],
    checked: { type: Boolean, required: true }, //是否被审核
    isPassCheck: { type: Boolean, required: true },
  }, { timestamps: true });

  return mongoose.model('CourseDate', courseDateSchema);
};
