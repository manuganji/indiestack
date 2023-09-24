import loginValidator from "./loginValidator";
import signUpValidator from "./signUpValidator";
import type { DataValidateFunction } from "ajv/dist/types";
loginValidator as DataValidateFunction;
signUpValidator as DataValidateFunction;


export {
	loginValidator,
	signUpValidator,
};