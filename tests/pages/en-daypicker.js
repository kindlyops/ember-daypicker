import {
  isVisible,
  attribute,
  collection,
  create,
  clickable,
  triggerable,
  text
} from 'ember-cli-page-object';

export default create({
  month: text('.en-daypicker-meta-month'),
  year:  text('.en-daypicker-meta-year option:selected'),

  hasToday: isVisible('.is-today'),
  today:    text('.is-today'),

  selectedDay: text('.en-daypicker-day.is-selected'),

  days: collection({
    itemScope: '.en-daypicker-day:not(.is-disabled)',

    item: {
      daypickerDay: attribute('data-daypicker-day'),
      click: clickable(),
      down:  triggerable('keydown', '', { eventProperties: { keyCode: 40 } }),
      up:    triggerable('keydown', '', { eventProperties: { keyCode: 38 } }),
      prev:  triggerable('keydown', '', { eventProperties: { keyCode: 37 } }),
      next:  triggerable('keydown', '', { eventProperties: { keyCode: 39 } }),
      enter: triggerable('keydown', '', { eventProperties: { keyCode: 13 } }),
      esc:   triggerable('keydown', '', { eventProperties: { keyCode: 27 } }),
    }
  })
});
