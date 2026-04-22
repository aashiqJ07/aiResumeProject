const mongoose = require('mongoose')

const technicalQuestionsSchema = new mongoose.Schema({
    question:{
        type: String,
        required: [true,"Technical questions required"]
    },
    intension:{
        type:String,
        required: [true,"Intension required"]
    },
    answer:{
        type:String,
        required: [true,"Answer required"]
    }
},{
    _id:false

})

const behaviouralQuestionsSchema = new mongoose.Schema({
    question:{
        type: String,
        required: [true,"Technical questions required"]
    },
    intension:{
        type:String,
        required: [true,"Intension required"]
    },
    answer:{
        type:String,
        required: [true,"Answer required"]
    }
},{
    _id:false
})

const skillGapSchema = new mongoose.Schema({
    skill:{
        type: String,
        required: [true,"Skill required"]
    },
    severity:{
        type:String,
        enum: ["low","medium","high"],
        required: [true,"Severity required"]
    
    }
})

const preparationPlanSchema = new mongoose.Schema({
    day:{
        type: String,
        required: [true,"Day required"]
    },
    focus:{
        type:String,
        required: [true,"Focus required"]
    },
    tasks:[{
        type: String,
        required: [true,"Task required"]
    }]
})


const interviewReportSchema = new mongoose.Schema({
    jobDescription:{
        type: String,
        required: true
    },
    resume:{
        type: String,
    },
    selfDesription:{
        type: String,
    
    },
    matchScore:{
        type:Number,
        min:0,
        max:100
    },
    technicalQuestions: [technicalQuestionsSchema],
    behaviouralQuestions: [behaviouralQuestionsSchema],
    skillGap: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    title:{
        type:String,
        required:[true,"Job Title required"]
    }

},{
    timestamps:true
})

const interviewReportModel = mongoose.model("interviewReport",interviewReportSchema)

module.exports = interviewReportModel;

