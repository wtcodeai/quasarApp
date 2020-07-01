<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <q-btn flat label="Add Post" color="primary" @click="editPost()" />
      <q-table
        title="All Posts"
        :data="postsList"
        :columns="tableColumns"
        row-key="title"
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn dense round flat color="grey" @click="viewPost(props)" icon="visibility"></q-btn>
            <q-btn dense round flat color="grey" @click="editPost(props)" icon="edit"></q-btn>
            <q-btn dense round flat color="grey" @click="removePost(props)" icon="delete"></q-btn>
          </q-td>
        </template>
      </q-table>
      <q-dialog v-model="view">

        <q-card>
          <q-card-section>
            <div class="text-h6">{{ post.title }}</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            {{ post.body }}
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-table
              title="Comments"
              :data="postComments"
              :columns="commentColumns"
              row-key="name"
            >

              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th auto-width />
                  <q-th
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                  >
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>

              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td auto-width>
                    <q-btn size="sm" color="accent" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />
                  </q-td>
                  <q-td
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                  >
                    {{ col.value }}
                  </q-td>
                </q-tr>
                <q-tr v-show="props.expand" :props="props">
                  <q-td colspan="100%">
                    <div class="text-left">{{ props.row.body }}.</div>
                  </q-td>
                </q-tr>
              </template>

            </q-table>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="edit">
        <q-card>
          <q-card-section>
            <q-input v-model="post.title" label="Post title" />
          </q-card-section>

          <q-card-section class="q-pt-none">
                <q-input
                  v-model="post.body"
                  label="Post text"
                  filled
                  type="textarea"
                />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Close" color="secondary" v-close-popup />
            <q-btn flat label="Save" color="primary" @click="savePost()" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import { requestPostsMixin } from '../mixins/requestMixin'
import { userFakeMixin } from '../mixins/userFakeMixin'

export default {
  name: 'PageIndex',
  mixins: [requestPostsMixin, userFakeMixin],
  data () {
    return {
      view: false,
      edit: false,
      postsList: [],
      post: {},
      postComments: [],
      tableColumns: [
        {
          name: 'title',
          required: true,
          label: 'Post title',
          align: 'left',
          field: row => row.title,
          sortable: true
        },
        {
          name: 'actions',
          required: true,
          label: 'Actions',
          align: 'center',
          field: ''
        }
      ],
      commentColumns: [
        {
          name: 'email',
          required: true,
          label: 'Author email',
          align: 'left',
          field: row => row.email
        },
        {
          name: 'title',
          required: true,
          label: 'Author name',
          align: 'center',
          field: row => row.name
        }
      ]
    }
  },
  async created () {
    this.postsList = (await this.allPosts()).data
  },
  methods: {
    viewPost (data) {
      Promise.all([
        this.singlePost({ id: data.row.id }),
        this.commentsToPost({ id: data.row.id })
      ]).then((resp) => {
        this.post = resp[0].data
        this.postComments = resp[1].data
        this.view = true
      })
    },
    editPost (data) {
      if (data) {
        this.singlePost({ id: data.row.id }).then((resp) => {
          this.post = resp.data
          this.edit = true
        })
      } else {
        this.post = {
          title: '',
          body: '',
          userId: this.fakeUserId
        }
        this.edit = true
      }
    },
    savePost () {
      if (this.post.id) {
        this.updatePost({ id: this.post.id }, JSON.stringify({ title: this.post.title, body: this.post.body })).then((resp) => {
          this.allPosts().then((resp) => {
            this.postsList = resp.data
            this.edit = false
          })
        })
      } else {
        this.createPost({}, JSON.stringify({ title: this.post.title, body: this.post.body, userId: this.post.userId })).then((resp) => {
          this.allPosts().then((resp) => {
            this.postsList = resp.data
            this.edit = false
          })
        })
      }
    },
    removePost (data) {
      this.deletePost({ id: data.row.id }).then(() => {
        this.allPosts().then((resp) => {
          this.postsList = resp.data
        })
      })
    }
  }
}
</script>
