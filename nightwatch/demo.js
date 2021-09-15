
describe('Demo test pe-charts', function() {
  test('Test for appended chart container', function(browser) {
    browser
      .url('http://localhost:8000')
      .waitForElementVisible('body')
      .assert.titleContains('JSON Dashboardify - GOV.UK')
      .assert.visible('#chart-container-chart-wrapper-example-example-example-example-1-2-1-3')
      .end();
  })
});
