<template>
	<div class="rule">
		<template  v-if="ruleLevel === 0">
			数据: 
			<json-viewer :value="theRuleList" ></json-viewer>
		</template>

		<div class="option-button">
			<el-button size="mini" type="primary" icon="el-icon-plus" @click="addRuleItem">增加规则</el-button>
			<el-button size="mini" type="primary" icon="el-icon-upload2" @click="upRuleItem" v-if="ruleLevel !== 0">规则置于上层</el-button>
			<el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteRuleTreeParent">删除规则树</el-button>
		</div>

		<div class="costomer-rules">
			<template v-if="theRuleList.childern.length > 0">
				<div class="relation-com">
					<Relation v-model="theRuleList.relation" :rank="this.ruleLevel"></Relation>
				</div>

				<div class="rule-com">
					<div
						class="rule-item"
						v-for="(item,index) in theRuleList.childern"
						:key="item.uuid"
					>
						<RuleItem
							ref="rule"
							:rule="item"
							:is-show-down="childernLevel < maxLevel"
							@addRuleItem="addRuleItem"
							@addLevel="addLevel(item, index)"
							@deleteRuleItem="deleteRuleItem(item, index)"
							v-if="!item.childern"
						></RuleItem>

						<customerRules
							ref="ruleTree"
							:rule-level="childernLevel" 
							:ruleList="item"
							:max-level="maxLevel"
							v-else-if="item.childern && item.childern.length > 0" 
							@clearnNullRule="clearnNullRule"
							@upRule="upRule(item, index)"
							@deleteRuleTreeChildern="deleteRuleTreeChildern(item, index)"
						></customerRules>
					</div>
				</div>
			</template>

			<template v-else>
				暂无规则
			</template>
		</div>
	</div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import Relation from './relation.vue';
import RuleItem from './ruleItem.vue';
import JsonViewer from 'vue-json-viewer';
import { createNewLevel, createNewRule, createNewRuleItem, deepClone } from "./js/ruleItem";

const RULE_TREE_LEVEL = 0;

export default {
	name: 'customerRules',
	components: {
		Relation,
		RuleItem,
		JsonViewer
	},
	props: {
		"ruleList": {
			type: Object,
			required: true
		},
		"ruleLevel": {
			type: Number || String,
			default: RULE_TREE_LEVEL
		},
		"maxLevel" : {
			type: Number || String,
			default: 9999
		}
	},
	data() {
		return {
			// 组件的规则列表
			theRuleList: {},
		}
	},
	computed: {
		childernLevel() {
			return Number(this.ruleLevel) + 1
		}
	},
	created() {
		this.initCompData();
	},
	methods: {
		initCompData() {
			this.theRuleList = this.ruleList;
			// 赋予uuid
			if(!this.theRuleList.uuid) {
				this.theRuleList.uuid = uuidv4();
			}
			this.theRuleList.childern && this.theRuleList.childern.forEach(item => {
				if (!item.uuid) {
					item.uuid = uuidv4();
				}
			})
		},
		addRuleItem() {
			this.theRuleList.childern.push(createNewRule(this.childernLevel));
		},
		addLevel(item, index) {
			this.theRuleList.childern.splice(index, 1, createNewLevel(item, this.childernLevel));
		},
		deleteRuleItem(item, index) {
			this.theRuleList.childern.splice(index, 1);
			if (this.theRuleList.childern.length === 0) {
				this.$emit('clearnNullRule');
			}
		},
		replaceRuleItem(replaceItem, index) {
			this.theRuleList.childern.splice(index, 1, ...replaceItem);
			if (this.theRuleList.childern.length === 0) {
				this.$emit('clearnNullRule');
			}
		},
		clearnNullRule() {
			this.theRuleList.childern = this.theRuleList.childern.filter(item => !item.childern || (item.childern && item.childern.length !== 0));
			// 向上递归
			if (this.ruleLevel !== 0 || this.ruleLevel !== '0') {
				this.$emit('clearnNullRule');
			}
		},
		upRule(item, index) {
			this.replaceRuleItem(item.childern, index);
		},
		upRuleItem() {
			this.$emit("upRule");
		},
		deleteRuleTreeParent() {
			this.$confirm('确定删除该规则树?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'error'
			}).then(() => {
				if (this.ruleLevel === 0) {
					this.theRuleList = createNewRuleItem(this.ruleLevel);
				}else {
					this.$emit("deleteRuleTreeChildern");
				}
			}).catch(() => {});
		},
		deleteRuleTreeChildern(item, index) {
			this.deleteRuleItem(item, index);
		},
		// 获取规则树并优化
		getRuleTree() {
			let rules = this.$refs.rule,
				ruleTrees = this.$refs.ruleTree,
				childern = [];
			if (rules && rules.length > 0) {
				rules.forEach(rule => {
					childern.push(rule.getRule());
				});
			}

			if (ruleTrees && ruleTrees.length > 0) {
				ruleTrees.forEach(ruleItem => {
					let ruleItemData = ruleItem.getRuleTree();
					if ( ruleItemData && Array.isArray(ruleItemData)) {
						childern.push(...ruleItemData);
					}else {
						childern.push(ruleItemData);
					}
				});
			}

			let theRuleListObj = deepClone(this.theRuleList);
			if ((!rules || rules.length === 0) && (this.ruleLevel !== 0 && this.ruleLevel !== '0')) {
				console.log("enter");
				// 只有一个规则进行优化
				return childern
			}else {
				console.log("this.theRuleList",this.theRuleList);
				theRuleListObj.childern = childern;
				if (this.ruleLevel === 0 || this.ruleLevel === '0') {
					this.setLevel(theRuleListObj);
				}
				return theRuleListObj;
			}
		},
		// 设置为正确的level
		setLevel(obj, level=0) {
			obj.level = level;
			if (obj.childern && obj.childern.length > 0) {
				obj.childern.forEach(item => {
					this.setLevel(item, level+1);
				});
			}
		},
	}
}
</script>

<style lang="scss" scoped>
	.rule {
		.option-button {
			display: flex;
			justify-content: flex-start;
			margin-bottom: 10px;
		}
		
		.costomer-rules{
		display: flex;

		.relation-com {
			margin-right: 10px;
		}

		.rule-com {
			border-radius: 4px;
			width: calc(100% - 50px);
			text-align: left;
			background: #FFFFFF;
			padding: 16px 20px;
			box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);

			.rule-item {
				margin-top: 10px;
			}

			.rule-item:first-child {
				margin-top: 0px;
			}
		}
	}
	
	}
</style>

