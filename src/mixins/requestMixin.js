import axios from 'axios'

const APIURL = 'https://jsonplaceholder.typicode.com'

export const requestPostsMixin = {
  methods: {
    allPosts () {
      return axios.get(`${APIURL}/posts`)
    },
    singlePost (req = {}, data = {}) {
      return axios.get(`${APIURL}/posts/${req.id}`)
    },
    commentsToPost (req = {}, data = {}) {
      return axios.get(`${APIURL}/posts/${req.id}/comments`)
    },
    createPost (req = {}, data = {}) {
      return axios.post(`${APIURL}/posts/`, data)
    },
    updatePost (req = {}, data = {}) {
      return axios.put(`${APIURL}/posts/${req.id}`, data)
    },
    deletePost (req = {}, data = {}) {
      return axios.delete(`${APIURL}/posts/${req.id}`)
    },
    allComments (req = {}, data = {}) {
      return axios.get(`${APIURL}/comments?postId=${req.postId}`)
    }
  }
}
