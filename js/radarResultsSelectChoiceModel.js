import Adapt from 'core/js/adapt';
import ComponentModel from 'core/js/models/componentModel';

export default class RadarResultsSelectChoiceModel extends ComponentModel {

  init(...args) {
    // save the original body text so we can restore it when the assessment is reset
    this.set('originalBody', this.get('body'));

    this.listenTo(Adapt, {
      'assessments:complete': this.onAssessmentComplete,
      'assessments:reset': this.onAssessmentReset
    });

    super.init(...args);
  }

  /**
   * Checks to see if the assessment was completed in a previous session or not
   */
  checkIfAssessmentComplete() {
    if (!Adapt.assessment || this.get('_assessmentId') === undefined) {
      return;
    }

    const assessmentModel = Adapt.assessment.get(this.get('_assessmentId'));
    if (!assessmentModel || assessmentModel.length === 0) return;

    const state = assessmentModel.getState();
    const isResetOnRevisit = assessmentModel.get('_assessment')._isResetOnRevisit;
    if (state.isComplete && (!state.allowResetIfPassed || !isResetOnRevisit)) {
      this.onAssessmentComplete(state);
      return;
    }

    this.setVisibility();
  }

  onAssessmentComplete(state) {
    if (this.get('_assessmentId') === undefined ||
        this.get('_assessmentId') !== state.id) return;

    // Define the keys array
    const keys = this.get('_scoring');

    const maxPossibleValue = Math.max(...keys.map(item => item.value));
    let maxValue = 0;
    // Create an empty chartData array
    let chartData = {};

    // Iterate through your assessment items
    const assessmentModel = Adapt.assessment.get(this.get('_assessmentId'));
    const articleId = assessmentModel.get('_id');
    $('.' + articleId + ' .selectchoice__item-title').css('display', 'block');
    assessmentModel._getAllQuestionComponents().forEach(component => {
      maxValue += maxPossibleValue;
      component.get('_items').forEach(item => {
        const axisLabel = item.title;
        const selectedText = item._selected.text;

        // Find the corresponding value in the keys array
        const matchingKey = keys.find(keyItem => keyItem.key === selectedText);
        const value = matchingKey ? matchingKey.value : 0; // Default to 0 if not found

        // Push the axis label and value as an object into componentData
        // componentData.push({ axis: axisLabel, value });
        if (chartData[axisLabel]) {
          chartData[axisLabel] += value;
        } else {
          chartData[axisLabel] = value;
        }
      });

      // Push the componentData into chartData after iterating through all items in the component
      // chartData.push(...componentData);
    });

    const chartDataArray = Object.keys(chartData).map(axisLabel => ({
      axis: axisLabel,
      value: chartData[axisLabel]
    }));

    chartData = chartDataArray;

    chartData.forEach(item => {
      item.value = (item.value / maxValue) * 100; // Convert to percentage
    });

    // After all iterations are complete, log the chartData
    this.set('chartData', chartData);
    console.log('chartData', chartData);

    /*
    make shortcuts to some of the key properties in the state object so that
    content developers can just use {{attemptsLeft}} in json instead of {{state.attemptsLeft}}
    */
    this._state = state;
    this.set({
      attempts: state.attempts,
      attemptsSpent: state.attemptsSpent,
      attemptsLeft: state.attemptsLeft,
      score: state.score,
      scoreAsPercent: state.scoreAsPercent,
      maxScore: state.maxScore,
      isPass: state.isPass
    });

    this.setFeedbackBand(state);

    this.checkRetryEnabled(state);

    this.setFeedbackText();

    this.toggleVisibility(true);
  }

  setFeedbackBand(state) {
    const scoreProp = state.isPercentageBased ? 'scoreAsPercent' : 'score';
    const bands = _.sortBy(this.get('_bands'), '_score');

    for (let i = (bands.length - 1); i >= 0; i--) {
      const isScoreInBandRange = (state[scoreProp] >= bands[i]._score);
      if (!isScoreInBandRange) continue;

      this.set('_feedbackBand', bands[i]);
      break;
    }
  }

  checkRetryEnabled(state) {
    const assessmentModel = Adapt.assessment.get(state.id);
    if (!assessmentModel.canResetInPage()) return false;

    const feedbackBand = this.get('_feedbackBand');
    const isRetryEnabled = (feedbackBand && feedbackBand._allowRetry) !== false;
    const isAttemptsLeft = (state.attemptsLeft > 0 || state.attemptsLeft === 'infinite');
    const showRetry = isRetryEnabled && isAttemptsLeft && (!state.isPass || state.allowResetIfPassed);

    this.set({
      _isRetryEnabled: showRetry,
      retryFeedback: showRetry ? this.get('_retry').feedback : ''
    });
  }

  setFeedbackText() {
    const feedbackBand = this.get('_feedbackBand');

    // ensure any handlebars expressions in the .feedback are handled...
    const feedback = feedbackBand ? Handlebars.compile(feedbackBand.feedback)(this.toJSON()) : '';

    this.set({
      feedback,
      body: this.get('_completionBody')
    });
  }

  setVisibility() {
    if (!Adapt.assessment) return;

    const assessmentModel = Adapt.assessment.get(this.get('_assessmentId'));
    if (!assessmentModel || assessmentModel.length === 0) return;

    const state = assessmentModel.getState();
    const isAttemptInProgress = state.attemptInProgress;
    const isComplete = !isAttemptInProgress && state.isComplete;
    const isVisibleBeforeCompletion = this.get('_isVisibleBeforeCompletion') || false;
    const isVisible = isVisibleBeforeCompletion || isComplete;

    this.toggleVisibility(isVisible);
  }

  toggleVisibility(isVisible) {
    if (isVisible === undefined) {
      isVisible = !this.get('_isVisible');
    }

    this.set('_isVisible', isVisible, { pluginName: 'assessmentResults' });
  }

  checkCompletion() {
    if (this.get('_setCompletionOn') === 'pass' && !this.get('isPass')) {
      return;
    }

    this.setCompletionStatus();
  }

  /**
   * Handles resetting the component whenever its corresponding assessment is reset
   * The component can either inherit the assessment's reset type or define its own
   */
  onAssessmentReset(state) {
    if (this.get('_assessmentId') === undefined ||
        this.get('_assessmentId') !== state.id) return;

    let resetType = this.get('_resetType');
    if (!resetType || resetType === 'inherit') {
      // backwards compatibility - state.resetType was only added in assessment v2.3.0
      resetType = state.resetType || 'hard';
    }
    this.reset(resetType, true);
  }

  reset(...args) {
    this.set({
      body: this.get('originalBody'),
      state: null,
      feedback: '',
      _feedbackBand: null,
      retryFeedback: '',
      _isRetryEnabled: false
    });

    super.reset(...args);
  }
}
