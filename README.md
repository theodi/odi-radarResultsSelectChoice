# odi-radarResultsSelectChoice

**Radar Results (select choice)** is a *presentation component*.

It is used to display a single assessment's results in the form of a radar chart. It is designed to be used with a select choice component where many blocks have scenarios that contain similar choices. It can be used only in conjunction with [adapt-contrib-assessment](https://github.com/adaptlearning/adapt-contrib-assessment) and the select choice component. It is best used to do a sort of personality test.

## How to use

Set up an assessment with many select choice components.

Each select choice component asks a series of questions, each with a title and text where there are multiple choices that are all the same, e.g. an ordinal scale.

So the question could be "Let's consider a social scenario in which a close friend or family member has just revealed that they are undergoing a major life change: they are transitioning from one gender to another. On a scale of very unlikely, to very likely rate the following in terms of how you might react?

Title: Empathy
Text: Your friend or family member discloses their gender transition, and you respond with empathy. You express your support, understanding, and willingness to listen. You ask about their experiences and feelings, and you offer your assistance in any way you can.

Title: Anger
Text: You feel betrayed or upset, thinking it's a decision they've made to hurt you or others. You express your anger through raised voices, harsh words, or even by distancing yourself from them, refusing to acknowledge their identity.

etc etc

You can then offer another scenario with the same titles (Empathy, Anger etc) but different text and the same scale of very unlikely to likely. 

The assessment results component will then look at the titles and show a radar diagram of personality traits. You would set the scoring bands to be something like:

* very likely = 3
* likely = 2
* unlikely = 1
* very unlikely 0

When the radar daigram is drawn, your strongest traits will be the biggest areas.

As you can see this component is less of a assessment results component for right and wrong, but is more suited for personality tests.

## Settings Overview

**Important note: do not put the Assessment Results component in the same article as the assessment itself**.

The attributes listed below are used in *components.json* to configure **Assessment Results (Select choice)**, and are properly formatted as JSON in [*example.json*].

### Attributes

[**core model attributes**](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes): These are inherited by every Adapt component. [Read more](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes).

**\_component** (string): This value must be: `assessmentResults`. (One word with uppercase "R".)

**\_classes** (string): CSS class name(s) to be applied to **Assessment Results**’ containing `div`. The class(es) must be predefined in one of the Less files. Separate multiple classes with a space.

**\_layout** (string): This defines the horizontal position of the component in the block. Values can be `full`, `left` or `right`.

**instruction** (string): This optional text appears above the component. It is frequently used to
guide the learner’s interaction with the component.

**_assessmentId** (string): This value must match the [`_id` of the assessment](https://github.com/adaptlearning/adapt-contrib-assessment#attributes) for which results should be displayed.

**\_isVisibleBeforeCompletion** (boolean): Determines whether this component will be visible as the learner enters the assessment article or if it will be displayed only after the learner completes all question components. Acceptable values are `true` or `false`. The default is `false`.

**\_setCompletionOn** (string): Can be set to `"inview"` or `"pass"`. A a setting of `"inview"` will cause the component to be marked as completed when it has been viewed regardless of whether or not the assessment was passed, whereas a setting of `"pass"` will cause the component to be set to completed when this component has been viewed **and** the assessment has been passed. This setting can be very useful if you have further content on the page that's hidden by trickle which you don't want the user to be able to access until they have passed the assessment. Default is `"inview"`.

**\_resetType** (string): Valid values are: `"hard"`, `"soft"` and `"inherit"`. Controls whether this component does a 'soft' or 'hard' reset when the corresponding assessment is reset. A 'soft' reset will reset everything except component completion; a 'hard' reset will reset component completion as well, requiring the user to complete this component again. If you want this component to have the same reset behaviour as the corresponding assessment you can leave this property out - or set it to 'inherit'.

**\_retry** (object): Contains values for **button**, **feedback** and **\_routeToAssessment**.

>**button** (string): Text that appears on the retry button.

>**feedback** (string): This text is displayed only when both **\_allowRetry** is `true` and more attempts remain ([configured in adapt-contrib-assessment](https://github.com/adaptlearning/adapt-contrib-assessment#attributes)). It may make use of the following variables: `{{attemptsSpent}}`, `{{attempts}}`, `{{attemptsLeft}}`, `{{score}}`, `{{scoreAsPercent}}` and `{{maxScore}}`. These values are populated with data supplied by [adapt-contrib-assessment](https://github.com/adaptlearning/adapt-contrib-assessment#attributes). `{{{feedback}}}`, representing the feedback assigned to the appropriate band within this component, is also allowed.

>**\_routeToAssessment** (boolean): Determines whether the user should be redirected back (or scrolled up) to the assessment for another attempt when the retry button is clicked.

**\_completionBody** (string): This text overwrites the standard **body** attribute upon completion of the assessment. It may make use of the following variables: `{{attemptsSpent}}`, `{{attempts}}`, `{{attemptsLeft}}`, `{{score}}`, `{{scoreAsPercent}}` and `{{maxScore}}`. The variable `{{{feedback}}}`, representing the feedback assigned to the appropriate band, is also allowed.

**\_choices** (Object array): Multiple items may be created. Each MUST map to the choices in the select choice components being used in the assessment. **\_choices** contains values for **key** and **value**.

**key** (string): The choice that exists in the select choice component. 

**value** (number): The score each key is worth on a radar diagram.

**\_bands** (object array): Multiple items may be created. Each item represents the feedback and opportunity to retry for the appropriate range of scores. **\_bands** contains values for **\_score**, **feedback**, **\_allowRetry** and **\_classes**.

>**\_score** (number):  This numeric value represents the raw score or percentile (as determined by the configuration of [adapt-contrib-assessment](https://github.com/adaptlearning/adapt-contrib-assessment)) that indicates the low end or start of the range. The range continues to the next highest **\_score** of another band.

>**feedback** (string): This text will be displayed to the learner when the learner's score falls within this band's range. It replaces the `{{{feedback}}}` variable when the variable is used within **\_completionBody**.

>**\_allowRetry** (boolean): Determines whether the learner will be allowed to reattempt the assessment. If the value is `false`, the learner will not be allowed to retry the assessment regardless of any remaining attempts.

>**\_classes** (string): Classes that will be applied to the containing article if the user's score falls into this band. Allows for custom styling based on the feedback band.

<div float align=right><a href="#top">Back to Top</a></div>

<img src="https://github.com/adaptlearning/documentation/blob/master/04_wiki_assets/plug-ins/images/assessmentResults02.png" alt="sample assessment results component" align="right">

In the image to the right, numbers are paired with the text's source attributes as follows:
1. _displayTitle
2. _bands.feedback
3. {{scoreAsPercent}}
4. \_retry.button

[Visit the **Usage and Tips** page of the wiki](https://github.com/adaptlearning/adapt-contrib-assessmentResults/wiki/Usage-and-Tips) for more information about configuring **Assessment Results**.

For a guide on the difference between using two curly braces and three curly braces when working with the variables that are available in this component, see [the HTML escaping section of the the Handlebars website](http://handlebarsjs.com/#html-escaping)

## Limitations

No known limitations.

----------------------------
<a href="https://community.adaptlearning.org/" target="_blank"><img src="https://github.com/adaptlearning/documentation/blob/master/04_wiki_assets/plug-ins/images/adapt-logo-mrgn-lft.jpg" alt="adapt learning logo" align="right"></a>
**Author / maintainer:** Adapt Core Team with [contributors](https://github.com/adaptlearning/adapt-contrib-assessmentResults/graphs/contributors)
**Accessibility support:** WAI AA
**RTL support:** Yes
**Cross-platform coverage:** Chrome, Chrome for Android, Firefox (ESR + latest version), Edge, IE11, Safari 12+13 for macOS/iOS/iPadOS, Opera
