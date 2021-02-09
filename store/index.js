// const axios = require("axios")

export const state = () => {
	return {
		lists_loading:false,
		lists:[],
		selected_lists:[],
		tabIndex:0,
		search_term:''
	}
}

export const actions = {

	async search_lists({commit, state, dispatch, getters}){
		if (!state.search_term){
			return;
		}
		commit("UPDATE_STORE", {lists_loading:true})
		const l = await this.$axios.$get(`/api/lists/${state.search_term.toLowerCase()}`)
		commit("UPDATE_STORE", {lists:l || [], lists_loading:false})
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