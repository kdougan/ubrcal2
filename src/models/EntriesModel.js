import { q, client } from '../helpers/init-db';

/**
 *
 * @param {object} entryData - entries data object
 * @param {string} calendarID - the calendar id which corresponds to a FuanaDB ref number
 */
export function addEntry(entryData, calendarID) {
  const me = q.Identity();

  return client
    .query(
      q.Create(q.Collection('entries'), {
        data: {
          ...entryData,
          calendar: q.Ref(q.Collection('calendars'), calendarID),
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

/**
 *
 * @param {string} calendarID
 */
export function getEntries(calendarID) {
  // Get the Current Calendar reference object
  // TODO: Wonder if we could just store the current calendar ID object into a vuex,
  // this could save an additonal request to get the calendar ID

  return client
    .query(
      q.Let(
        {
          calendarRef: q.Ref(`collections/calendars/${calendarID}`),
        },
        q.Map(
          q.Paginate(
            q.Match(q.Index('entries_by_calendar'), q.Var('calendarRef'))
          ),
          (ref) => q.Get(ref) // fauna lambda function , what does "Get()" do?
        )
      )
    )
    .catch((err) => err);
}

/**
 *
 * @param {object} refID - fauna ref object
 */
export function deleteEntry(refID) {
  return client
    .query(q.Delete(refID))
    .then((resp) => resp)
    .catch((err) => err);
}

/**
 *
 * @param {object} entryRefID - faunaDb Entry collection reference ID
 * @param {string} newEntry - new entry for calendar
 */
export function updateEntry(entryRefID, newEntryData) {
  return client
    .query(
      q.Update(q.Ref(q.Collection('entries'), entryRefID), {
        data: newEntryData,
      })
    )
    .then((resp) => resp)
    .catch((err) => err);
}
