<template>
	<div class="line" :style="{'width': (theStyle.fontSize + 10)+'px', 'line-height': (theStyle.fontSize + 10)+'px',}">
		<div class="the-line" :style="{'width': theStyle.lineWidth+'px','borderRadius': theStyle.borderRadius + 'px'}"></div>


		<div class="relation" :style="{'borderRadius': theStyle.borderRadius + 'px','width': (theStyle.fontSize + 10) + 'px', 'height': (theStyle.fontSize + 10) + 'px',}">
			<span class="show-text" @click="changeRealtion" :style="{'fontSize': theStyle.fontSize + 'px'}">
				{{ relationEnum[relation] }}
			</span>
		</div>
	</div>
</template>

<script>
export default {
	model: {
		prop: 'relation',
		event: 'changeRealtion'
	},
	props: {
		// 关系 
		relation: {
			required: true,
			type: String,
		},
		// 等级
		rank: {
			type: Number,
			default: 0
		},
		// 且的时候的值
		andValue: {
			type: String,
			default: "and"
		},
		// 或的值
		orValue: {
			type: String,
			default: "or"
		}
	},
	data() {
		return {
			// 等级样式设置
			rankStyle: [
				{fontSize: 20, lineWidth: 6, borderRadius: 3},
				{fontSize: 14, lineWidth: 4, borderRadius: 2},
				{fontSize: 10, lineWidth: 2, borderRadius: 1}
			]
		}
	},
	computed: {
		theStyle: function() {
			let theRank = this.rank;
			if (theRank < 0) {
				theRank = 0;
			}
			if (theRank > 2) {
				theRank = 2;
			}
			return this.rankStyle[theRank];
		},
		relationEnum() {
			let relationEnum = {};
			relationEnum[this.andValue] = '且';
			relationEnum[this.orValue] = "或";
			return relationEnum;
		}
	},
	methods: {
		// 切换关系
		changeRealtion() {
			if (this.relation === this.orValue) {
				this.$emit('changeRealtion', this.andValue);
			}else {
				this.$emit('changeRealtion', this.orValue);
			}
		}
	}
}
</script>

<style lang="scss" scoped>
$backgroundColor: #04CB94;
$fontColor: #FFFFFF;

.line {
	display: flex;
	justify-content: center;
	height: 100%;
	position: relative;
	
	.the-line {
		background: $backgroundColor;
		height: 100%;
	}

	.relation {
		background: $backgroundColor;
		position: absolute;
		top: calc((100% - 30px) / 2);
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;

		.show-text {
			color: $fontColor;
			font-weight: bolder;
		}
	}
}
</style>
