const { TabDetail } = window.GRender
// TAB容器字段
const TAB_DETAIL_CONTAINER = 'TAB_DETAIL_CONTAINER';
// 修改成tab的明细表下标
const TAB_DETAIL_INDEX = 1

// 明细表二：采购项目编号
const codeId = GForm.convertFieldNameToId('d1.d1_select')

const props = {
	detailId: TAB_DETAIL_INDEX,
	title: '卡片信息',
	// 关联主表主键字段名
	mainKey: 'd1.d1_select',
	// 关联子表主键字段名
	subKeys: ['d2.d2_select', 'd3.d3_select'],
	// 检查子明细表字段必填
	checkRequired: true,
	// 检查是否存在未读卡片
	checkUnRead: true,
	// 改变页事件
	changePage: rowIdx => {
		const val = GForm.getFieldValue('d1.d1_select', rowIdx)
		if (val === '') {
		}
		console.log('改变页：', rowIdx)
	},
	// 添加卡片前校验
	checkAdd: (rowIdx, subIndexMap, callback) => {
		console.log('添加卡片前校验：', rowIdx)
		subIndexMap.forEach((idxArr, detailId) => {
			console.log(detailId, idxArr)
		})
		callback()
	},
	// 删除卡片前校验
	checkRemove: (rowIdx, subIndexMap, callback) => {
		console.log('删除卡片前校验：', rowIdx)
		subIndexMap.forEach((idxArr, detailId) => {
			console.log(detailId, idxArr)
		})
		callback()
	}
}
TabDetail.render(
	TAB_DETAIL_CONTAINER,
	props
)