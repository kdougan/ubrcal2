import { q, client } from '../helpers/init-db';

/**
 *
 * @param {object} calendarData - object containing the title of calendar, could contain other data too in the future
 */
export function createCalendar(calendarData) {
  const me = q.Identity();

  return client
    .query(
      q.Create(q.Collection('calendars'), {
        data: {
          ...calendarData,
          owner: me,
        },
        permissions: {
          read: me,
          write: me,
        },
      })
    )
    .then((resp) => resp)
    .catch((error) => error);
}

export function getCalendars() {
  return client
    .query(
      q.Map(q.Paginate(q.Match(q.Ref('indexes/all_calendars'))), (ref) =>
        q.Get(ref)
      )
    )
    .then((resp) => resp);
}

/**
 *
 * @param {object} calendar - Fauna calendar object
 */
export function deleteCalendar(calendar) {
  return client
    .query(
      q.Map(
        q.Paginate(
          q.Match(
            // get all the entries within a given calendar ref
            q.Index('entries_by_calendar'),
            q.Ref(q.Collection('calendars'), calendar.ref.value.id)
          )
        ),
        // then delete all of the entries within that given calendar ref,
        // I used a FQL Lambda here because i couldn't get an inline arrow function to work
        q.Lambda('X', q.Delete(q.Select('ref', q.Get(q.Var('X')))))
      )
    )
    .then(() => {
      // Once all of the entries in that given calendars have been removed we delete the calendar itself
      return client.query(q.Delete(calendar.ref));
    })
    .catch((err) => err);
}

/**
 *
 * @param {object} calendarRefID - faunaDb calendar collection reference ID
 * @param {string} newTitle - new title for calendar
 */
export function updateCalendarTitle(calendarRefID, newTitle) {
  return client
    .query(
      q.Update(q.Ref(q.Collection('calendars'), calendarRefID), {
        //TODO - should think about spreading a calendar object into here. See createCalendar method.
        data: { title: newTitle },
      })
    )
    .then((resp) => resp)
    .catch((err) => err);
}
