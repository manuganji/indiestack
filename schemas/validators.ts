import loginValidator from "./loginValidator";
import propertyValidator from "./propertyValidator";
import propertySettingsValidator from "./propertySettingsValidator";
import signUpValidator from "./signUpValidator";
import type { DataValidateFunction } from "ajv/dist/types";
loginValidator as DataValidateFunction;
propertyValidator as DataValidateFunction;
propertySettingsValidator as DataValidateFunction;
signUpValidator as DataValidateFunction;


export {
	loginValidator,
	propertyValidator,
	propertySettingsValidator,
	signUpValidator,
};