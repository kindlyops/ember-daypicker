import Ember from 'ember';

const { run } = Em

const isFirstDayofMonth = (day) => day.index() === 0
const isLastDayOfMonth = (day) => day.index() === 6

export default Ember.Mixin.create({
  didInsertElement () {
    this.focusSelected()
  },

  focusSelected () {
    const selected = this.$('.is-selected')

    if (selected) {
      run(() => {
        selected.focus()
      })
    }
  },

  keyDown (ev) {
    run(() => {
      this.handleKeyDown(ev)
    })
  },

  handleKeyDown (ev) {
    const focused = this.$('.en-daypicker-day:focus')

    if (!focused || !focused.length) {
      console.warn('[en-daypicker] Could not find the focused day')
      return
    }

    const key   = ev.which || ev.keyCode
    const label = focused.attr('aria-label')
    const day   = moment(label, "MMM DD, YYYY")

    switch (key) {
      case 37:
        this.focusPreviousDay(day)
        break;

      case 38:
        this.focusPreviousWeek(day)
        break;

      case 39:
        this.focusNextDay(day)
        break;

      case 40:
        this.focusNextWeek(day)
        break;

      case 13:
        this.selectFocused(focused)
        break;

      default:
        return
    }
  },

  focusPreviousDay (day) {
    const prev = day.subtract(1, 'day')
    this.focusOn(prev)
  },

  focusNextDay (day) {
    const next = day.add(1, 'day')
    this.focusOn(next)
  },

  focusPreviousWeek (day) {
    const prev = day.subtract(7, 'days')
    this.focusOn(prev)
  },

  focusNextWeek (day) {
    const next = day.add(7, 'days')
    this.focusOn(next)
  },

  focusOn (day) {
    const formatted = day.format("MMM DD, YYYY")
    const dayDiv = this.$(`.en-daypicker-day[aria-label="${formatted}"]`)

    if (dayDiv && dayDiv.hasClass('is-active')) {
      dayDiv.focus()
      this.sendAction('on-focus', formatted)
    }
  },

  selectFocused (focused) {
    focused.click()
  }
});
