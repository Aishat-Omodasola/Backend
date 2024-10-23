import mongoose from 'mongoose';
// Define the schema
const examSchema = new mongoose.Schema({
 name: {
   type: String,
   required: [true, "It must have a name"]
 },
 category:{
  type: String,
  required: [true, "It must have a category"]
 },
 subjects: [
   {
     subjectName: String,
     actualName: String,
     arraysOfQuestions: [
      {
        month: String,
        topicName: String,
        actualQuestions: [
          {
            id: {
              type: Number,
              required: true
            },
            easy: {
              type: String,
              required: true
            },
            type: {
              type: String,
              required: true
            },
            year: {
              type: String,
              required: true
            },
            exambody: {
              type: String,
              required: true
            },
            subtopic: {
              type: String,
              required: true
            },
            text: {
              type: String,
              required: true
            },
            options: [
              {
                id: {
                  type: Number,
                  required: true
                },
                text: {
                  type: String,
                  required: true
                },
                isCorrect: {
                  type: Boolean,
                  required: true
                }
              }
        ]
      }

     ] //You can define the quetion schema as per your need
   }
 ]
}
]  //close the subject array
});

//create the model
// const Exam = mongoose.model("Exam", examSchema);
const Exam = mongoose.model('Exam', examSchema);

export default Exam;


