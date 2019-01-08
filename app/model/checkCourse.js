module.exports = (app) => {
  const { mongoose } = app;
  const checkCourseSchema = new mongoose.Schema({
    stuId: { type: String, required: true },
    courseHTML: { type: String, required: true },
    courseUnitsArr: { type: Array, required: true },
    // [{
    //   schoolId: String,
    //   stuId: String,
    //   semesterId: String,
    //   teacher: String,
    //   name: String,
    //   courseUnits: Array,
    //   checked: Boolean, //课程是否被审核
    //   isPassCheck: Boolean,
    //   checkMsg: String
    // }],
    checked: { type: Boolean, required: true }, //是否被审核
    isPassCheck: { type: Boolean, required: true },
  }, { timestamps: true });

  return mongoose.model('CheckCourse', checkCourseSchema);
};
