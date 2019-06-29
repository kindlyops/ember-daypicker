import moment from 'moment'
import { find, focus } from 'ember-native-dom-helpers'
import { moduleForComponent, test } from 'ember-qunit'
import wait from 'ember-test-helpers/wait'
import hbs from 'htmlbars-inline-precompile'
import { run } from '@ember/runloop'

moduleForComponent(
  'en-daypicker-input',
  'Integration | Component | en daypicker input',
  {
    integration: true
  }
)

test('it shows the datepicker when the input gets focus', function(assert) {
  let today = moment()
  this.set('today', today)
  this.on('on-select', () => null)

  this.render(hbs`{{en-daypicker-input
              date=today
              on-select=(action "on-select")}}`)

  assert.dom('.en-day-picker').doesNotExist("doesn't have datepicker by default")

  run(async () => {
    await focus('input')
  })

  return wait().then(() => {
    assert.dom('.en-day-picker').exists('has datepicker when input is focused')
  })
})

test('the date has MMM D format by default', function(assert) {
  let today = moment()
  this.set('today', today)
  this.on('on-select', () => null)

  this.render(hbs`{{en-daypicker-input
              date=today
              on-select=(action "on-select")}}`)

  assert.equal(find('input').value, today.format('MMM D'))
})

test('the date works with other formats', function(assert) {
  let today = moment()
  let format = 'MMM D, YYY'

  this.set('today', today)
  this.set('format', format)
  this.on('on-select', () => null)

  this.render(hbs`{{en-daypicker-input
              date=today
              format=format
              on-select=(action "on-select")}}`)

  assert.equal(find('input').value, today.format(format))

  format = 'X'
  this.set('format', format)

  assert.equal(find('input').value, today.format(format))

  format = 'MMM DD, YYYY hh:mm ss Z'
  this.set('format', format)

  assert.equal(find('input').value, today.format(format))
})

test('placeholder works', function(assert) {
  let today = moment()

  this.set('today', today)
  this.on('on-select', () => null)

  this.render(hbs`{{en-daypicker-input
              date=today
              placeholder="Choose a date..."
              on-select=(action "on-select")}}`)

  assert.equal(find('input').getAttribute('placeholder'), 'Choose a date...')
})

test('on selecting a date, it sends the on-select action', function(assert) {
  assert.expect(1)

  let today = moment()
  this.set('today', today)
  this.on('on-select', date => {
    assert.ok(moment.isMoment(date), 'got a moment object')
  })

  this.render(hbs`{{en-daypicker-input
              date=today
              isFocused=true
              on-select=(action "on-select")}}`)

  this.$('.en-daypicker-day').not('.is-disabled').last().click()
})
