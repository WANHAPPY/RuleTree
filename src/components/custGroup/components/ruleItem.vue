<template>
	<div class="rule">
		<div class="rule-info">
			这个是规则
		</div>

		<div class="option-button-group">
			<el-button size="mini" type="primary" plain icon="el-icon-plus" @click="$emit('addRuleItem')"></el-button>
			<el-button size="mini" plain icon="el-icon-download" @click="$emit('addLevel')" v-if="isShowDown"></el-button>
			<el-button size="mini" type="danger" plain icon="el-icon-delete" @click="$emit('deleteRuleItem');"></el-button>	
		</div>
	</div>
</template>

<script>
import { deepClone } from './js/ruleItem';

export default {
	name: "ruleItem",
	props: {
		rule: {
			type: Object,
			default: () => ({})
		},
		// 是否展示下钻按钮
		isShowDown: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			theRule: {}
		}
	},	
	created() {
		this.theRule = deepClone(this.rule);
	},
	methods: {
		getRule() {
			let rule = deepClone(this.theRule);
			rule.type = "data";
			return rule;
		}
	}
}
</script>

<style lang="scss" scoped>
.rule {
	display: flex;
	justify-content: space-between;
	.rule-info{

	}

	.option-button-group {

	}
}
</style>
