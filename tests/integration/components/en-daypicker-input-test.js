import { find, focus, render } from '@ember/test-helpers';
import moment from 'moment'
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile'

module('Integration | Component | en daypicker input', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  test('it shows the datepicker when the input gets focus', async function(assert) {
    let today = moment()
    this.set('today', today)
    this.actions['on-select'] = () => null

    await render(hbs`{{en-daypicker-input
                date=today
                on-select=(action "on-select")}}`)

    assert.dom('.en-day-picker').doesNotExist("doesn't have datepicker by default")

    await focus('input')
    assert.dom('.en-day-picker').exists('has datepicker when input is focused')
  })

  test('the date has MMM D format by default', async function(assert) {
    let today = moment()
    this.set('today', today)
    this.actions['on-select'] = () => null

    await render(hbs`{{en-daypicker-input
                date=today
                on-select=(action "on-select")}}`)

    assert.equal(find('input').value, today.format('MMM D'))
  })

  test('the date works with other formats', async function(assert) {
    let today = moment()
    let format = 'MMM D, YYY'

    this.set('today', today)
    this.set('format', format)
    this.actions['on-select'] = () => null

    await render(hbs`{{en-daypicker-input
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

  test('placeholder works', async function(assert) {
    let today = moment()

    this.set('today', today)
    this.actions['on-select'] = () => null

    await render(hbs`{{en-daypicker-input
                date=today
                placeholder="Choose a date..."
                on-select=(action "on-select")}}`)

    assert.equal(find('input').getAttribute('placeholder'), 'Choose a date...')
  })

  test('on selecting a date, it sends the on-select action', async function(assert) {
    assert.expect(1)

    let today = moment()
    this.set('today', today)
    this.actions['on-select'] = date => {
      assert.ok(moment.isMoment(date), 'got a moment object')
    }

    await render(hbs`{{en-daypicker-input
                date=today
                isFocused=true
                on-select=(action "on-select")}}`)

    this.$('.en-daypicker-day').not('.is-disabled').last().click()
  })
});
