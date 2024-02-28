import {Languages} from "@/common/language/languageConstants.js";

const QuestionTemplate = Languages.map((language) => {
    return {
        language: language,
        code: "",
        questionId: 0,
    }
} )

export default QuestionTemplate;

