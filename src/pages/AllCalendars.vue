<template>
  <main>
    <div class="space">
      <h1>📔 Your Calendars</h1>

      <div
        id="create-calendar-container"
        class="shadow"
      >
        <!-- fix to stop page from refreshing when hitting enter:
           https://stackoverflow.com/questions/2215462/html-form-when-i-hit-enter-it-refreshes-page -->
        <form
          id="create-new-calendar"
          onkeypress="return event.keyCode != 13"
        >
          <input
            v-model="calendar.title"
            required
            type="text"
            placeholder="Name of new calendar"
            @keyup.enter="submit()"
          />
          <input
            name="create calendar"
            value="Create Calendar"
            type="button"
            @click="submit()"
          />
        </form>
      </div>
    </div>
    <div id="calendars-container">
      <CalendarCard
        v-for="(item, index) in allCalendars"
        :key="index"
        :calendar="{ item, index }"
        @delete-calendar="deleteCalendar"
        @update-calendar="updateCalendarTitle"
      />
    </div>
  </main>
</template>

<script>
import {
  createCalendar,
  getCalendars,
  deleteCalendar,
  updateCalendarTitle
} from '../models/CalendarsModel';
import CalendarCard from '../components/CalendarCard.vue';

export default {
  components: {
    CalendarCard
  },

  data: function () {
    return {
      calendar: {
        title: ''
      },
      allCalendars: []
    };
  },
  beforeMount () {
    getCalendars()
      .then(resp => {
        console.log('Got calendars from DB', resp.data);
        this.allCalendars = resp.data;
      })
      .catch(err => console.error('problem getting calendars', err));
  },
  methods: {
    /**
     * Sumbit a new post to db
     */
    submit () {
      createCalendar(this.calendar)
        .then(resp => {
          alert('New calendar created');
          console.log('calendar obj', resp);
          this.allCalendars.push(resp);
          if (resp.msg) {
            alert(resp.message);
          }
        })
        .catch(err => {
          alert('There was a problem creating your calendar');
          console.error(err);
        });
    },
    /**
     * delete calendar
     *  @param {object} calendar - object containing index calendar and fauna db calendar object
     */
    deleteCalendar (calendar) {
      deleteCalendar(calendar)
        .then(resp => {
          console.log('Calendar deleted!', resp);
        })
        .catch(err => {
          console.error('problem deleting', err);
        });
    },
    /**
     * update a calendar
     * @param {object} calendar - object containing new journla title and fauna db calendar object
     */
    updateCalendarTitle ({ calendarRefID, newCalendarTitle, index }) {
      console.log(
        'Updating new calendar title to ',
        newCalendarTitle,
        calendarRefID
      );
      updateCalendarTitle(calendarRefID, newCalendarTitle)
        .then(() => {
          this.allCalendars[index].data.title = newCalendarTitle;
        })
        .catch(err => {
          console.error('problem updating calendar', err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
#calendars-background {
  max-width: 28rem;
  padding: 1rem;
  margin: 1rem;
}

#create-calendar-container {
  background: var(--app-secondary-background-color);
  flex-direction: column;
  justify-content: center;
  text-align: center;
  padding: 10px;
  border-radius: 15px;
  #create-new-calendar {
    display: flex;
    flex-direction: column;
  }

  input[type='text'] {
    background: var(--app-secondary-background-color);
  }
}

#calendars-container {
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
