<template>
  <main>
    <div class="space">
      <h1>📝 Your Entries</h1>
      <div
        id="create-entry-container"
        class="shadow"
      >
        <form class="new-entry">
          <input
            v-model="entry.title"
            type="text"
            placeholder="Title"
          />
          <textarea
            v-model="entry.contents"
            type="text"
            placeholder="What's on your mind?"
          />
          <input
            type="button"
            name="add entry"
            value="Add Entry"
            @click="submit()"
          />
        </form>
      </div>
    </div>

    <div id="entries-container">
      <EntryCard
        v-for="(item, index) in allEntries"
        :key="index"
        :entry="{ item, index }"
        @delete-entry="deleteEntry"
        @update-entry="updateEntry"
      />
    </div>
  </main>
</template>

<script>
import {
  addEntry,
  getEntries,
  deleteEntry,
  updateEntry
} from '../models/EntriesModel';
import EntryCard from '../components/EntryCard.vue';

export default {
  components: {
    EntryCard
  },

  data: function () {
    return {
      entry: {
        title: '',
        contents: ''
      },
      allEntries: []
    };
  },
  beforeMount () {
    getEntries(this.$route.params.id).then(resp => {
      console.log('Got entries from DB', resp.data);
      this.allEntries = resp.data;
    });
  },
  methods: {
    /**
     * Sumbit a new entry to db
     */
    submit () {
      addEntry(this.entry, this.$route.params.id)
        .then(resp => {
          console.log('entry obj', resp);
          alert('Created a new entry');
          this.allEntries.push(resp);
          if (resp.msg) {
            alert(resp.message);
          }
        })
        .catch(err => {
          alert('there was a problem adding entry');
          console.error(err);
        });
    },
    /**
     * @param {object} entry - fauna entry object
     */
    deleteEntry (entry) {
      deleteEntry(entry.item.ref).then(resp => {
        console.log('Deleted entry', resp);
      });
    },
    /**
     * @param {object} updatedEntry - fauna entry object with modified data
     */
    updateEntry ({ entryRefID, updatedEntry }) {
      updateEntry(entryRefID, updatedEntry)
        .then(resp => {
          console.log('Entry Updated', resp);
        })
        .catch(err => {
          console.error('problem updating entry', err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
#create-entry-container {
  background: var(--app-secondary-background-color);
  flex-direction: column;
  justify-content: center;
  text-align: center;
  padding: 10px;
  border-radius: 15px;

  input[type='text'] {
    background: var(--app-secondary-background-color);
  }
  textarea {
    background: var(--app-secondary-background-color);
    resize: vertical;
  }
}

.new-entry {
  display: flex;
  flex-direction: column;
}

.entry-card {
  margin: 20px;
}

#entries-container {
  display: flex;
  flex-wrap: wrap-reverse;
  justify-content: center;
}

input[type='button'] {
  border: none;
  padding: 15px;
  cursor: pointer;
  border-radius: 0 0px 15px 15px;
  background: #a7a7a7;
}
input[type='button']:hover {
  background: rgb(158, 158, 158);
}

input[type='button']:active {
  background: rgb(112, 112, 112);
  box-shadow: 0px 0px 0px -4px rgba(0, 0, 0, 0.75);
}
</style>
