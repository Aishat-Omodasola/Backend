// const express=require("express")
// const questionRouter=express.Router()
import  * as authController from "../controller/authController.js";
import {Router} from "express";
const questionRouter=Router();
// const {getAllQuestions,getOneQuestion,deleteQuestion,postQuestion,updateQuestion} = require("../controller/questionsController")
import * as questionsController from "../controller/questionsController.js"
// questionRouter.route("/examination")
// .get(getAllQuestions).post(postQuestion)
// questionRouter.route("/examination/:schoolid")
// .get(getOneQuestion).delete(deleteQuestion).patch(updateQuestion)
questionRouter.route("/examination")
.get(authController.protect, questionsController.getAllQuestions)
.post(questionsController.createQuestion)

questionRouter.route("/examination/:schoolid")
.get(questionsController.getOneQuestion).delete(questionsController.deleteQuestion).patch
(questionsController.updateQuestion)



questionRouter.route("/examination/:schoolid/add-subject")
.patch(questionsController.addSubjectToSchool);


questionRouter.route("/examination/:schoolid/add-topic")
.patch(questionsController.addTopicToSubject)

questionRouter.route("/examination/:schoolid/add-question")
.patch(questionsController.addQuestionToTopic)

export default questionRouter;