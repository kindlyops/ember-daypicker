import { click, find, findAll, render, settled, triggerEvent } from '@ember/test-helpers';
import Ember from 'ember';
import moment from 'moment';

import { module, test } from 'qunit';

import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Constants from 'ember-daypicker/utils/constants'

import daypicker from '../../pages/en-daypicker'

const { run } = Ember

module('Integration | Component | en daypicker', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  hooks.beforeEach(function() {
    daypicker.setContext(this);
  });

  hooks.afterEach(function() {
    daypicker.removeContext();
  });

  test('it renders with the initial date value', async function(assert) {
    let today = moment()
    let nextMonth = today.clone().add(1, 'month')

    this.set('nextMonth', nextMonth)

    await daypicker
      .render(hbs`{{en-daypicker
                date=nextMonth}}`);

    assert.equal(daypicker.month, nextMonth.format("MMMM"))
    assert.equal(daypicker.year, nextMonth.format("YYYY"))
  });

  test('it renders the right dates', async function(assert) {
    assert.expect(3)

    let today = moment()
    this.set('today', today)

    await daypicker.render(hbs`{{en-daypicker
                date=today}}`);

    const daysCount    = today.daysInMonth()
    const startOfMonth = today.startOf('month').day()
    const endOfMonth   = today.endOf('month').day()

    assert.equal(daypicker.days().count, daysCount, "has the right number of days enabled")
    assert.equal(daypicker.days(0).daypickerDay, startOfMonth, "has the right start")
    assert.equal(daypicker.days(daysCount - 1).daypickerDay, endOfMonth, "has the right end")
  });

  test('it has the right today', async function(assert) {
    assert.expect(2)

    let today = moment()
    this.set('today', today)

    await daypicker.render(hbs`{{en-daypicker
                date=today}}`);

    assert.ok(daypicker.hasToday)
    assert.equal(daypicker.today, today.format("D"))
  });

  test('when the date updates later, it updates the rest', async function(assert) {
    let today = moment()
    let nextMonth = today.clone().add(1, 'month')

    this.set('nextMonth', nextMonth)

    await daypicker.render(hbs`{{en-daypicker
                date=nextMonth}}`);

    assert.equal(daypicker.month, nextMonth.format("MMMM"))
    assert.equal(daypicker.year, nextMonth.format("YYYY"))

    let nextMonthAgain = today.clone().add(3, 'month')
    this.set('nextMonth', nextMonthAgain)

    assert.equal(daypicker.month, nextMonthAgain.format("MMMM"))
    assert.equal(daypicker.year, nextMonthAgain.format("YYYY"))
  });

  test('when a date is clicked upon, it sends the on-select action', async function(assert) {
    let today = moment()

    this.set('nextMonth', today)

    this.actions['on-select'] = function (day) {
      assert.ok(day, 'is present')
      assert.ok(moment.isMoment(day), 'is a moment object')
    }

    await daypicker.render(hbs`{{en-daypicker
                date=nextMonth
                on-select=(action "on-select")}}`);

    await daypicker.days(0).click()
  });

  const m = (d) => moment(d, Constants.defaultFormat)

  test('when user hits next, it goes to the next date', async function(assert) {
    assert.expect(1)

    let today = m("Sep 15, 2016")

    this.set('today', today)
    this.actions['on-select'] = () => null

    this.actions['on-focus'] = (day) => {
      assert.ok(moment(day).isSame(m("Sep 16, 2016")), "got the next day to focus")
    }

    await daypicker.render(hbs`{{en-daypicker
                date=today
                on-select=(action "on-select")
                on-focus=(action "on-focus")}}`);

    await daypicker.days(0).next()
  });

  test('when user hits prev, it goes to the previous date', async function(assert) {
    assert.expect(1)

    let today = m("Sep 15, 2016")

    this.set('today', today)
    this.actions['on-select'] = () => null

    this.actions['on-focus'] = (day) => {
      assert.ok(moment(day).isSame(m("Sep 14, 2016")), "got the pevious day to focus")
    }

    await daypicker.render(hbs`{{en-daypicker
                date=today
                on-select=(action "on-select")
                on-focus=(action "on-focus")}}`);

    await daypicker.days(0).prev()
  });

  test('when user hits up, it goes to the previous week', async function(assert) {
    assert.expect(1)

    let today = m("Sep 15, 2016")

    this.set('today', today)
    this.actions['on-select'] = () => null

    this.actions['on-focus'] = (day) => {
      assert.ok(moment(day).isSame(m("Sep 8, 2016"), "got the pevious week to focus"))
    }

    await daypicker.render(hbs`{{en-daypicker
                date=today
                on-select=(action "on-select")
                on-focus=(action "on-focus")}}`);

    await daypicker.days(0).up()
  });

  test('when user hits down, it goes to the next week', async function(assert) {
    assert.expect(1)

    let today = m("Sep 15, 2016")

    this.set('today', today)
    this.actions['on-select'] = () => null

    this.actions['on-focus'] = (day) => {
      assert.ok(moment(day).isSame(m("Sep 22, 2016"), "got the next week to focus"))
    }

    await daypicker.render(hbs`{{en-daypicker
                date=today
                on-select=(action "on-select")
                on-focus=(action "on-focus")}}`);

    await daypicker.days(0).down()
  });

  /*
   * Disabling days works
   */

  test("it can disable dates after a given maxDate", async function(assert) {
    let today = m("Sep 1, 2016")
    let nextWeek = today.clone().add(6, 'days')

    this.set('today', today)
    this.set('nextWeek', nextWeek)

    await render(hbs`{{en-daypicker
                maxDate=nextWeek
                date=today}}`);

    let active = findAll('.en-daypicker-day:not(.is-disabled)')
    assert.equal(active.length, 7, "has 7 active days")

    let firstDayAfterMax = this.$('.en-daypicker-day[aria-label="Sep 08, 2016"]')
    assert.ok(firstDayAfterMax.hasClass('is-disabled'), "first day after max has disabled class")

    await click('.en-daypicker-action-next')

    active = findAll('.en-daypicker-day:not(.is-disabled)')
    assert.equal(active.length, 0, "has no active days in the next month")
  })

  test("it can disable dates before a given minDate", async function(assert) {
    let today = m("Sep 7, 2016")
    let nextWeek = today.clone().add(6, 'days')

    this.set('today', today)
    this.set('nextWeek', nextWeek)

    await render(hbs`{{en-daypicker
                minDate=nextWeek
                date=today}}`);

    let active = findAll('.en-daypicker-day:not(.is-disabled)')
    assert.equal(active.length, 18, "has 18 active days")

    let lastDay = find('.en-daypicker-day[aria-label="Sep 12, 2016"]')
    assert.ok(lastDay.classList.contains('is-disabled'), "last minDate has the disabled class")

    let firstDayAfterMin= find('.en-daypicker-day[aria-label="Sep 13, 2016"]')
    assert.notOk(firstDayAfterMin.classList.contains('is-disabled'), "first day after max does not have disabled class")
  })

  test("it does not allow selecting disabled dates after max", async function(assert) {
    assert.expect(1)

    let today = m("Sep 1, 2016")
    let nextWeek = today.clone().add(6, 'days')

    this.set('today', today)
    this.set('nextWeek', nextWeek)

    this.actions['on-select'] = (date) => {
      assert.ok(moment(date).isSame(m("Sep 07, 2016"), 'day'), 'got the right day')
    }

    await render(hbs`{{en-daypicker
                maxDate=nextWeek
                date=today
                on-select=(action "on-select")}}`);

    run(() => {
      click('.en-daypicker-day[aria-label="Sep 07, 2016"]')
      click('.en-daypicker-day[aria-label="Sep 08, 2016"]')
      click('.en-daypicker-day[aria-label="Sep 10, 2016"]')
      click('.en-daypicker-day[aria-label="Sep 12, 2016"]')
      click('.en-daypicker-day[aria-label="Sep 15, 2016"]')
      click('.en-daypicker-day[aria-label="Sep 21, 2016"]')
    })
  })

  test("it does not allow selecting disabled dates before min", async function(assert) {
    assert.expect(1)

    let today = m("Sep 1, 2016")
    let nextWeek = today.clone().add(6, 'days')

    this.set('today', today)
    this.set('nextWeek', nextWeek)

    this.actions['on-select'] = (date) => {
      assert.ok(moment(date).isSame(m("Sep 07, 2016"), 'day'), 'got the right day')
    }

    await render(hbs`{{en-daypicker
                minDate=nextWeek
                date=today
                on-select=(action "on-select")}}`);

    run(() => {
      click('.en-daypicker-day[aria-label="Sep 01, 2016"]')
      click('.en-daypicker-day[aria-label="Sep 02, 2016"]')
      click('.en-daypicker-day[aria-label="Sep 03, 2016"]')
      click('.en-daypicker-day[aria-label="Sep 04, 2016"]')
      click('.en-daypicker-day[aria-label="Sep 05, 2016"]')
      click('.en-daypicker-day[aria-label="Sep 06, 2016"]')
      click('.en-daypicker-day[aria-label="Sep 07, 2016"]')
    })
  })

  test("it allows disabling any day", async function (assert) {
    assert.expect(4)

    let today = m("Sep 1, 2016")
    let nextWeek = today.clone().add(6, 'days')

    this.set('today', today)
    this.set('nextWeek', nextWeek)

    this.set('disableFn', (date) => {
      return date.day() === 6 // Disable Saturdays
    })

    this.actions['on-select'] = () => null

    await render(hbs`{{en-daypicker
                disableFn=disableFn
                date=today
                on-select=(action "on-select")}}`);

    assert.ok(find('.en-daypicker-day[aria-label="Sep 03, 2016"]').classList.contains("is-disabled"))
    assert.ok(find('.en-daypicker-day[aria-label="Sep 10, 2016"]').classList.contains("is-disabled"))
    assert.ok(find('.en-daypicker-day[aria-label="Sep 17, 2016"]').classList.contains("is-disabled"))
    assert.ok(find('.en-daypicker-day[aria-label="Sep 24, 2016"]').classList.contains("is-disabled"))
  })

  test("it allows changing year", async function (assert) {
    assert.expect(1)

    let today = m("Sep 1, 2016")

    this.set('today', today)

    this.actions['on-select'] = (date) => {
      assert.equal(date.year(), 1960, 'gets the right year')
    }

    await render(hbs`{{en-daypicker
                date=today
                on-select=(action "on-select")}}`);

    find('.en-daypicker-meta-year').value = 1960
    await triggerEvent('.en-daypicker-meta-year', 'change')
    await click('.en-daypicker-day:nth-child(3)')
  })
});
