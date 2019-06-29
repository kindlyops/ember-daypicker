import Mixin from '@ember/object/mixin'
import { run } from '@ember/runloop'
import Constants from 'ember-daypicker/utils/constants'
import moment from 'moment'

export default Mixin.create({
  focusSelected() {
    const selected = this.element.querySelector('.is-selected')

    if (selected) {
      run.next(() => selected.focus())
    }
  },

  keyDown(ev) {
    this._super(...arguments)
    this.handleKeyDown(ev)
  },

  handleKeyDown(ev) {
    const focused = this.element.querySelector('.en-daypicker-day')
    const selected = this.element.querySelector('.en-daypicker-day.is-selected')

    let el = focused

    if (document.activeElement !== focused || !document.hasFocus()) {
      el = selected
    }

    const key = ev.which || ev.keyCode
    const label = el.getAttribute('aria-label')
    const day = moment(label, Constants.defaultFormat)

    switch (key) {
      case 37:
        this.focusPreviousDay(day)
        break

      case 38:
        this.focusPreviousWeek(day)
        break

      case 39:
        this.focusNextDay(day)
        break

      case 40:
        this.focusNextWeek(day)
        break

      case 13:
        this.selectFocused(focused)
        break

      default:
        return
    }
  },

  focusPreviousDay(day) {
    const prev = day.subtract(1, 'day')
    this.focusOn(prev)
  },

  focusNextDay(day) {
    const next = day.add(1, 'day')
    this.focusOn(next)
  },

  focusPreviousWeek(day) {
    const prev = day.subtract(7, 'days')
    this.focusOn(prev)
  },

  focusNextWeek(day) {
    const next = day.add(7, 'days')
    this.focusOn(next)
  },

  focusOn(day) {
    const formatted = day.format(Constants.defaultFormat)
    const dayDiv = Array
      .from(this.element.querySelectorAll('.en-daypicker-day'))
      .find(node => node.getAttribute('aria-label') === formatted)

    if (dayDiv && !dayDiv.classList.contains('is-disabled')) {
      dayDiv.focus()

      if (this['on-focus']) {
        this['on-focus'](formatted)
      }
    }
  },

  selectFocused(focused) {
    focused.click()
  }
})
