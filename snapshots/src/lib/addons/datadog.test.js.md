# Snapshot report for `src/lib/addons/datadog.test.js`

The actual snapshot is saved in `datadog.test.js.snap`.

Generated by [AVA](https://avajs.dev).

## Should call datadog webhook

> Snapshot 1

    '{"text":"%%% \\n some@user.com created feature toggle [some-toggle](http://some-url.com/#/features/strategies/some-toggle)\\n**Enabled**: no | **Type**: undefined | **Project**: undefined\\n**Activation strategies**: ```- name: default\\n``` \\n %%% ","title":"Unleash notification update"}'

## Should call datadog webhook for archived toggle

> Snapshot 1

    '{"text":"%%% \\n The feature toggle *[some-toggle](http://some-url.com/#/archive/strategies/some-toggle)* was *archived* by some@user.com. \\n %%% ","title":"Unleash notification update"}'