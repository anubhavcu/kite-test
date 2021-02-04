export const state = () => {
	return {
		lists:[],
		tabIndex:0
	}
}

export const mutations = {
	UPDATE_STORE(state, values){
		const clone = JSON.parse(JSON.stringify(values))
		Object.keys(clone).forEach(n => {
			if (state.hasOwnProperty(n)) {
				state[n] = clone[n]
			}
		})
	},
}