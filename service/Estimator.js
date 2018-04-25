const categoryNum	= require('../meta').agreement.categories

module.exports.calculateAlpha = (reliMatrix, raterCnt, unitCnt) => {
	var coinMatrix = new Array(categoryNum)
	
	for (let c = 0; c < categoryNum; c++) {
		coinMatrix[c] = new Array(categoryNum)
	}

	for (let i = 0; i < categoryNum; i++) {
		for (let j = 0; j < categoryNum; j++) {
			coinMatrix[i][j] = 0
		}
	}

	for (let c = 0; c < categoryNum; c++) {
		for (let k = 0; k < categoryNum; k++) {
			for (let u = 0; u < unitCnt; u++) {
				var obs;
				var c_cnt = reliMatrix[u].filter(i => i === c).length
				if (c == k) {
					obs = c_cnt * (c_cnt - 1)
				} else {
					var k_cnt = reliMatrix[u].filter(i => i === k).length
					obs = c_cnt * k_cnt
				}
				coinMatrix[c][k] += obs / (raterCnt - 1)
			}
		}
	}

	var coinTotal = new Array(categoryNum)
	for (let i = 0; i < categoryNum; i++) {
		coinTotal[i] = coinMatrix[i].reduce((x, y) => x + y)
	}
	var nTotal = coinTotal.reduce((x, y) => x + y)

	let tempO = 0
	let tempN = 0
	for (let i = 0; i < categoryNum; i++) {
		tempO += coinMatrix[i][i]
		tempN += coinTotal[i] * (coinTotal[i] - 1)
	}

	var firstArg = tempO * (nTotal - 1) - tempN
	var secondArg = nTotal * (nTotal - 1) - tempN

	return firstArg / secondArg

}