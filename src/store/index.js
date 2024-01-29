import {createStore} from "vuex";
import user from "./modules/user.js";
import question from "@/store/modules/question.js";

export default createStore({
    modules:{
        user,
        question
    }
});
