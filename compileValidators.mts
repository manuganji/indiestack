import standaloneCode from "ajv/dist/standalone/index.js";
import { AnyValidateFunction } from "ajv/dist/types/index.js";
import { writeFileSync } from "fs";
import { getAjv } from "./ajvSetup.js";
import * as schemas from "./schemas/index.js";

const ajv = getAjv();
function saveStandaloneCode(func: AnyValidateFunction, outputFile: string) {
	try {
		const moduleCode = standaloneCode(ajv, func);
		try {
			if (!outputFile) console.log(moduleCode);
			else writeFileSync(outputFile, moduleCode);
			return true;
		} catch (e) {
			console.error("error saving file:", e);
			return false;
		}
	} catch (e) {
		console.error("error preparing module:", e);
		return false;
	}
}

function generateCommonImporter(validatorFiles: string[]) {
	const importStatement = validatorFiles
		.map((x) => `import ${x} from "./${x}";`)
		.join("\n");

	const importTypes = `import type { DataValidateFunction } from "ajv/dist/types";`;
	const typeCast = validatorFiles.map((x) => `${x} as DataValidateFunction;`);
	const exportStatement = `export {\n\t${validatorFiles
		.map((x) => `${x},`)
		.join("\n\t")}\n};`;

	const totalCode = [
		importStatement,
		importTypes,
		`${typeCast.join("\n")}`,
		`\n`,
		exportStatement,
	].join("\n");

	writeFileSync("schemas/validators.ts", totalCode);
}

const execute = () => {
	let outputsMap = new Map<string, string>();

	for (const key of Object.keys(schemas)) {
		const validate = ajv.getSchema(key);
		if (!validate) throw new Error(`schema ${key} is invalid`);
		console.log(`schema ${key} is valid`);
		const outputKey = key.replace("Schema", "Validator");
		outputsMap.set(key, outputKey);
		saveStandaloneCode(validate, `schemas/${outputKey}.js`);
	}

	generateCommonImporter(Array.from(outputsMap.values()));
};

execute();
