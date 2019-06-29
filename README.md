[![npm version](https://badge.fury.io/js/ember-daypicker.svg)](https://badge.fury.io/js/ember-daypicker)
[![CircleCI](https://circleci.com/gh/swastik/ember-daypicker.svg?style=svg)](https://circleci.com/gh/swastik/ember-daypicker)
[![Ember Observer Score](https://emberobserver.com/badges/ember-daypicker.svg)](https://emberobserver.com/addons/ember-daypicker)

# ember-daypicker

ember-daypicker is a simple datepicker component for ember.js. It's built using moment.js; there are no
external datepicker libraries. There's basic keyboard support, too.

[Here's an introduction to it (with examples)](http://swastik.github.io/ember-daypicker/).

* Ember.js v2.18 or above
* Ember CLI v2.13 or above

`ember install ember-daypicker`

## Usage

You get a component `en-daypicker-input` that be used as such:

```
  {{en-daypicker-input
    date=date
    on-select=(action 'didSelectDate')
  }}
```

It uses moment.js everywhere, so you should pass in a moment object as the `date` attr,
and when you handle the `on-select` action, you should also expect a moment object to
be sent back to you.

Optionally, you can also provide the `format` attribute that will control how the selected
date gets shown in the input field. By default, it is `MMM D` which would be something like
`Mar 10`.

You can disable dates before or after a certain date by passing in the `minDate` or
the `maxDate` attributes.

Last, you can provide the `placeholder` attribute to change the placeholder text that the datepicker
input displays. You can also use the `isFocused` attribute to decide whether the datepicker
is shown by default or not.

## Questions? Bugs?

Feel free to create an issue or send a PR if you find a bug.
