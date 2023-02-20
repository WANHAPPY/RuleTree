import { v4 as uuidv4 } from 'uuid';

let ruleItem = {
	relation: 'or',
	level: 0,
	childern:[]
}

export function deepClone(pre) {
	let target = {}
	for(let key in pre) {
		if(typeof pre[key] === 'object' && Array.isArray(pre[key])) {
			target[key] = pre[key].concat();
		}else if(typeof pre[key] === 'object') {
			target[key] = deepClone(pre[key]);
		}else {
			target[key] = pre[key];
		}
	}
	return target;
}

export const createNewRuleItem = (level) => {
	let newRuleItem = deepClone(ruleItem);
	newRuleItem.level = level;
	newRuleItem.uuid = uuidv4();
	return newRuleItem;
}

export const createNewRule = (level) => {
	let newRule = {};
	newRule.uuid = uuidv4();
	newRule.level = level;
	return newRule;
}

export const createNewLevel = (rule, level) => {
	let newItem = createNewRuleItem(level);
	newItem.childern.push(rule);
	return newItem;
}