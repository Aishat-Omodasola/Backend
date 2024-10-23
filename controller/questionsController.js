// const fs=require("fs")
// const express = require("express");
import fs from "fs"
import express from "express"
import Exam from "../model/questionModel.js"


// exports.getAllQuestions = async(req,res) =>{
//     try {
//         const myExam = await exam;
//     res.status(200).json({
//         status:"success",
//         numResult:exam.length,
//         data:{
//             exam
//         }
//     })
//     } catch (error) {
//        res.status(500).json({error}); 
//     }
// }

export const getAllQuestions = async (req,res) =>{
    try {
        const allExams = await Exam.find()
    res.status(200).json({
        status:"success",
        message:"All question get successfully",
        numResults:allExams.length,
        data:{
            allExams
        }
    })
    } catch (error) {
       res.status(500).json({error}); 
    }
}
// exports.getOneQuestion = async (req, res)=>{
//     try {
//         const myResult = await exam.find(oneSchool.id === req.params.schoolid);
//         res.status(200).json({
//             status:"success",
//             data:{
//                 myResult
//             }
//         })
//     } catch(error) {
//         res.status(500).json({error});
//     }
// }
export const getOneQuestion = async (req, res)=>{
    try {
        const oneExam = await Exam.findById(req.params.schoolid)        
        res.status(200).json({
            status:"success",
            message: "A question get successfully",
            data:{
                oneExam
            }
        })
    } catch (error) {
        res.status(500).json({error});
    }
}
// 
export const createQuestion = async (req, res)=>{
    try {
        const createExam = await Exam.create(req.body)
        res.status(200).json({
            status:"success",
            message:"questions successfully created",
            data:{
                createExam
            }
        })
    } catch (error) {
        res.status(500).json({error});
    }
}
export const deleteQuestion = async (req, res)=>{
    try {
        await Exam.findByIdAndDelete(req.params.schoolid)
        res.status(200).json({
            status:"success",
            message:"questions successfully deleted"
        })
    } catch (error) {
        res.status(500).json({error});
    }
}
// 
export const updateQuestion = async (req, res)=>{
    try {
        const updateExam = await Exam.findByIdAndUpdate(req.params.schoolid,req.body,{
            new:true,
            runValidators:true,
        })
        res.status(200).json({
            status:"success",
            message:"questions successfully updated"
        })
    } catch (error) {
        res.status(500).json({error});
    }
}
export const addSubjectToSchool = async (req, res) => {
    try {
        const { subjectName, actualName } = req.body;

        //Find the school by its ID
        const school = await Exam.findById(req.params.schoolid);

        if(!school) {
            return res.status(404).json({
                status: "fail",
                message: "No school found with that ID"
            });
        }

        //create the new subject object
        const newSubject = {
            subjectName: subjectName,
            actualName: actualName,
            arraysOfQuestions: [] //em
        };

        //Push the new subject to subject array
        school.subjects.push(newSubject)

        //save the update school documents
        await school.save();
        //Return updated school documents as the the response
        res.status(200).json({
             status: "success",
             message: "Subject successfully added to the school",
             data: {
                 school
             }
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: "Error adding subject to the school",
            error: error.message
        });
    }
}



//

// const addTopicToSubject = async (req, res) => {
// try {
//     const { month, topicName, subjectName } = req.body;
//     const school = await Exam.findById(req.params.schoolid)
//     if (!school){
//         return res.status(404).json({
//             status:"fail",
//             message: "No School Found with that ID"
//         });
//        const subject = school.subjects.find(sub => sub.subjectName === subjectName);
//        if (!subject){
//            return res.status(404).json({
//                status:"fail",
//                message: "No Subject Found with that Name"
//            });
//         }
//            const newTopic = {
//                month: month,
//                topicName: topicName,
//                actualQuestion: []

//            };
//            subject.arraysOfQuestions.push(newTopic);
//            await school.save();
//            res.status(200).json({
//                status: "success",
//                message: "Topic Successfully Added Subject Array of Questions",
//                data: {
//                    school
//                }
//            })
//    catch (error) {
//     res.status(500).json({
//         status: "fail",
//         message: "Error adding subject to the school",
//         error: error.message
//     });
// }

// }
export const addTopicToSubject = async (req, res) => {
    try {
        const { month, topicName, subjectName } = req.body;
        const school = await Exam.findById(req.params.schoolid);

        if (!school) {
            return res.status(404).json({
                status: "fail",
                message: "No School Found with that ID"
            });
        }

        const subject = school.subjects.find(sub => sub.subjectName === subjectName);
        if (!subject) {
            return res.status(404).json({
                status: "fail",
                message: "No Subject Found with that Name"
            });
        }

        const newTopic = {
            month: month,
            topicName: topicName,
            actualQuestion: []
        };

        subject.arraysOfQuestions.push(newTopic);
        await school.save();

        res.status(200).json({
            status: "success",
            message: "Topic Successfully Added to Subject's Array of Questions",
            data: {
                school
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: "Error adding topic to subject",
            error: error.message
        });
    }
};

export const addQuestionToTopic = async (req, res) => {
    try {
      const { subjectName, topicName } = req.body;
      const { schoolid } = req.params;
  
      // Find the school by its ID
      const school = await Exam.findById(schoolid);
  
      if (!school) {
        return res.status(404).json({
          status: "fail",
          message: "No school found with that ID"
        });
      }
  
      // Find the subject by its subjectName
      const subject = school.subjects.find(sub => sub.subjectName === subjectName);
  
      if (!subject) {
        return res.status(404).json({
          status: "fail",
          message: "No subject found with that name"
        });
      }
  
      // Find the topic by its topicName within the subject
      const topic = subject.arraysOfQuestions.find(t => t.topicName === topicName);
  
      if (!topic) {
        return res.status(404).json({
          status: "fail",
          message: "No topic found with that name in the subject"
        });
      }
  
      // Create the new question object
      const newQuestion = {
        id: req.body.id,
        easy: req.body.easy,
        type: req.body.type,
        year: req.body.year,
        exambody: req.body.exambody,
        subtopic: req.body.subtopic,
        text: req.body.text,
        options: req.body.options // Array of options
      };
  
      // Push the new question to the actualQuestion array in the topic
      topic.actualQuestions.push(newQuestion);
  
      // Save the updated school document
      await school.save();
  
      // Return the updated school document as the response
      res.status(200).json({
        status: "success",
        message: "Question successfully added to the topic",
        data: {
          school
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'fail',
        message: 'Error adding question to the topic',
        error: error.message
      });
    }
  };