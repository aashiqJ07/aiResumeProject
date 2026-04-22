const pdfParse = require("pdf-parse")
const mammoth = require("mammoth")
const { generateInterviewReport, generateResumePdf } = require("./../../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")




/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {

    let resumeContentText = "";

    if (req.file) {
        if (req.file.mimetype === "application/pdf") {
            try {
                const parsedPdf = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
                resumeContentText = parsedPdf.text;
            } catch (error) {
                return res.status(400).json({ message: "Invalid PDF file." });
            }
        } else if (req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || req.file.mimetype === "application/msword") {
            try {
                const result = await mammoth.extractRawText({ buffer: req.file.buffer });
                resumeContentText = result.value;
            } catch (error) {
                return res.status(400).json({ message: "Invalid DOCX file." });
            }
        } else {
            return res.status(400).json({ message: "Unsupported file type. Please upload a PDF or DOCX file." });
        }
    }

    const { selfDescription, jobDescription } = req.body

    try {
        const interViewReportByAi = await generateInterviewReport({
            resume: resumeContentText,
            selfDescription,
            jobDescription
        })

        const mappedTechnicalQuestions = (interViewReportByAi.technicalQuestions || []).map(q => ({
            question: q.question,
            intension: q.intention || q.intension || "General evaluation",
            answer: q.answer
        }));

        const mappedBehaviouralQuestions = (interViewReportByAi.behavioralQuestions || interViewReportByAi.behaviouralQuestions || []).map(q => ({
            question: q.question,
            intension: q.intention || q.intension || "Behavioral evaluation",
            answer: q.answer
        }));

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContentText,
            selfDescription,
            jobDescription,
            title: interViewReportByAi.title || "Untitled Position",
            matchScore: interViewReportByAi.matchScore || 0,
            technicalQuestions: mappedTechnicalQuestions,
            behaviouralQuestions: mappedBehaviouralQuestions,
            skillGap: interViewReportByAi.skillGaps || interViewReportByAi.skillGap || [],
            preparationPlan: interViewReportByAi.preparationPlan || []
        })

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (error) {
        console.error("AI Generation Error:", error);
        res.status(500).json({ message: "Failed to generate interview report. Please try again." });
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }