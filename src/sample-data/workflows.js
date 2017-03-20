var riskAssessmentForm = 'asdasdas<form> </form>';
var form = '<form>' +
           'Test Field 1: <br>' +
           '<input type="text" name="field1"> </form>' +
           '<div class="workflow-actions md-padding md-whiteframe-z4">' +
  '<md-button class="md-primary md-hue-1" ng-click="ctrl.back($event)">Back</md-button>' +
  '<md-button class="md-primary" ng-click="ctrl.done($event)">Continue</md-button>' +
  '</div><!-- workflow-actions-->';

//   <form action="/action_page.php">
//   First name:<br>
// <input type="text" name="firstname" value="Mickey">
//   <br>
//   Last name:<br>
// <input type="text" name="lastname" value="Mouse">
//   <br><br>
//   <input type="submit" value="Submit">
// </form>

module.exports = function getSampleWorkflows() {

  var workflows = [
    { id: "HJ8QkzOSH", title: 'Sample Form', steps: [
      {code: 'step-1', name: 'Step 1', templates: {
        form: form,
        view: form
      }},
      {code: 'vehicle-inspection', name: 'Vehicle Inspection', templates: {
        form: '<vehicle-inspection-form></vehicle-inspection-form>',
        view: '<vehicle-inspection value="result.submission"></vehicle-inspection>'
      }}
    ]},

    { id: "B1r71fOBr", title: 'App forms', steps: [
      {code: 'identification', name: 'Identification', formId: '56c1fce7c0a909d74e823317'},
      {code: 'signoff', name: 'Signoff', formId: '56bdf252206b0cba6f35837b'}
    ]},

    { id: "SyVXyMuSr", title: 'Mixed forms', steps: [
      {code: 'signoff', name: 'Sign-off Workorder', formId: '56bdf252206b0cba6f35837b'},
      {code: 'risk-assessment', name: 'Risk Assessment', templates: {
        form: '<risk-assessment-form></risk-assessment-form>',
        view: '<risk-assessment value="result.submission"></risk-assessment>'
      }},
      {code: 'vehicle-inspection', name: 'Vehicle Inspection', templates: {
        form: '<vehicle-inspection-form></vehicle-inspection-form>',
        view: '<vehicle-inspection value="result.submission"></vehicle-inspection>'
      }}
    ]}
  ];

  return workflows;
};