<template>
	<div>
		规则树
		<customer-rules ref="ruleTree" :ruleList="ruleList"/>
		<el-button style="margin:20px 0px;" size="mini" type="primary" plain @click="getRuleTree">获取规则</el-button>
		<div v-if="result">
			<span>获取结果</span>
			<json-viewer :value="result"></json-viewer>
		</div>
	</div>
</template>

<script>
import CustomerRules from './components/customerRules.vue';
import JsonViewer from 'vue-json-viewer';
export default {
	components: {
		CustomerRules,
		JsonViewer
	},
	data() {
		return {
			ruleList: {
				"relation": "or",
				"childern": [],
			},
			result: {}
		}
	},
	methods: {
		getRuleTree() {
			this.result = this.$refs.ruleTree.getRuleTree();
		}
	},
}
</script>

<style lang="scss" scoped>

</style>