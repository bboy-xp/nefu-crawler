module.exports = (app) => {
  const { mongoose } = app;
  const courseSchema = new mongoose.Schema({
    schoolId: { type: String, required: true },
    stuId: { type: String, required: true },
    semesterId: { type: String, required: true },
    teacher: { type: String, required: true },
    name: { type: String, required: true },
    injectByUser: Boolean,
    courseUnits: [{
      weeks: String,
      dayOfWeek: String,
      timeStart: String, // 节次
      count: String, // 节数
      building: String,
      room: String,
      smartWeeks: Array,
    }],
    checked: { type: Boolean, required: true }, //是否被审核
    isPassCheck: { type: Boolean, required: true },
    checkMsg: { type: String }
  }, { timestamps: true });

  return mongoose.model('Course', courseSchema);
};
