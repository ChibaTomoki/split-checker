import axios from 'axios'
import { Person, Item } from '../model'

interface State {
  persons: Person[]
  items: Item[]
}

export const state = (): State => ({
  persons: [
    {
      index: 0,
      name: 'foo',
    },
    {
      index: 1,
      name: 'bar',
    },
  ],
  items: [],
})

export const getters = {
  getPersons: (state: State) => state.persons,
  getItems: (state: State) => state.items,
}

export const mutations = {
  setAllItems(state: State, items: Item[]): void {
    state.items = [...items]
  },
}

export const actions = {
  // https://vuex.vuejs.org/ja/api/#commit
  async fetchAllItems({ commit }: { commit: (type: string, payload?: any, options?: Object) => void }): Promise<void> {
    await axios
      .get('/api')
      .then((response) => {
        console.log(response)
        commit('setAllItems', response.data)
      })
      .catch((response) => console.log(response))
  },
}
