import { verifyNoBrowserErrors, browser } from 'angular2/src/testing/e2e_util';
import { expect } from 'angular2/testing';
function waitForElement(selector) {
    var EC = protractor.ExpectedConditions;
    // Waits for the element with id 'abc' to be present on the dom.
    browser.wait(EC.presenceOf($(selector)), 20000);
}
describe('reuse example app', function () {
    afterEach(verifyNoBrowserErrors);
    var URL = 'angular2/examples/router/ts/reuse/';
    it('should build a link which points to the detail page', function () {
        browser.get(URL);
        waitForElement('my-cmp');
        element(by.css('#naomi-link')).click();
        waitForElement('my-cmp');
        expect(browser.getCurrentUrl()).toMatch(/\/naomi$/);
        // type something into input
        element(by.css('#message')).sendKeys('long time no see!');
        // navigate to Brad
        element(by.css('#brad-link')).click();
        waitForElement('my-cmp');
        expect(browser.getCurrentUrl()).toMatch(/\/brad$/);
        // check that typed input is the same
        expect(element(by.css('#message')).getAttribute('value')).toEqual('long time no see!');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmV1c2Vfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtd2VUTUh2TU4udG1wL2FuZ3VsYXIyL2V4YW1wbGVzL3JvdXRlci90cy9yZXVzZS9yZXVzZV9zcGVjLnRzIl0sIm5hbWVzIjpbIndhaXRGb3JFbGVtZW50Il0sIm1hcHBpbmdzIjoiT0FBTyxFQUFDLHFCQUFxQixFQUFFLE9BQU8sRUFBQyxNQUFNLCtCQUErQjtPQUNyRSxFQUFDLE1BQU0sRUFBQyxNQUFNLGtCQUFrQjtBQUV2Qyx3QkFBd0IsUUFBZ0I7SUFDdENBLElBQUlBLEVBQUVBLEdBQVNBLFVBQVdBLENBQUNBLGtCQUFrQkEsQ0FBQ0E7SUFDOUNBLGdFQUFnRUE7SUFDaEVBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBO0FBQ2xEQSxDQUFDQTtBQUVELFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtJQUU1QixTQUFTLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUVqQyxJQUFJLEdBQUcsR0FBRyxvQ0FBb0MsQ0FBQztJQUUvQyxFQUFFLENBQUMscURBQXFELEVBQUU7UUFDeEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQixjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFekIsT0FBTyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN2QyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDekIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUVwRCw0QkFBNEI7UUFDNUIsT0FBTyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUUxRCxtQkFBbUI7UUFDbkIsT0FBTyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN0QyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDekIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUVuRCxxQ0FBcUM7UUFDckMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDekYsQ0FBQyxDQUFDLENBQUM7QUFFTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7dmVyaWZ5Tm9Ccm93c2VyRXJyb3JzLCBicm93c2VyfSBmcm9tICdhbmd1bGFyMi9zcmMvdGVzdGluZy9lMmVfdXRpbCc7XG5pbXBvcnQge2V4cGVjdH0gZnJvbSAnYW5ndWxhcjIvdGVzdGluZyc7XG5cbmZ1bmN0aW9uIHdhaXRGb3JFbGVtZW50KHNlbGVjdG9yOiBzdHJpbmcpIHtcbiAgdmFyIEVDID0gKDxhbnk+cHJvdHJhY3RvcikuRXhwZWN0ZWRDb25kaXRpb25zO1xuICAvLyBXYWl0cyBmb3IgdGhlIGVsZW1lbnQgd2l0aCBpZCAnYWJjJyB0byBiZSBwcmVzZW50IG9uIHRoZSBkb20uXG4gIGJyb3dzZXIud2FpdChFQy5wcmVzZW5jZU9mKCQoc2VsZWN0b3IpKSwgMjAwMDApO1xufVxuXG5kZXNjcmliZSgncmV1c2UgZXhhbXBsZSBhcHAnLCBmdW5jdGlvbigpIHtcblxuICBhZnRlckVhY2godmVyaWZ5Tm9Ccm93c2VyRXJyb3JzKTtcblxuICB2YXIgVVJMID0gJ2FuZ3VsYXIyL2V4YW1wbGVzL3JvdXRlci90cy9yZXVzZS8nO1xuXG4gIGl0KCdzaG91bGQgYnVpbGQgYSBsaW5rIHdoaWNoIHBvaW50cyB0byB0aGUgZGV0YWlsIHBhZ2UnLCBmdW5jdGlvbigpIHtcbiAgICBicm93c2VyLmdldChVUkwpO1xuICAgIHdhaXRGb3JFbGVtZW50KCdteS1jbXAnKTtcblxuICAgIGVsZW1lbnQoYnkuY3NzKCcjbmFvbWktbGluaycpKS5jbGljaygpO1xuICAgIHdhaXRGb3JFbGVtZW50KCdteS1jbXAnKTtcbiAgICBleHBlY3QoYnJvd3Nlci5nZXRDdXJyZW50VXJsKCkpLnRvTWF0Y2goL1xcL25hb21pJC8pO1xuXG4gICAgLy8gdHlwZSBzb21ldGhpbmcgaW50byBpbnB1dFxuICAgIGVsZW1lbnQoYnkuY3NzKCcjbWVzc2FnZScpKS5zZW5kS2V5cygnbG9uZyB0aW1lIG5vIHNlZSEnKTtcblxuICAgIC8vIG5hdmlnYXRlIHRvIEJyYWRcbiAgICBlbGVtZW50KGJ5LmNzcygnI2JyYWQtbGluaycpKS5jbGljaygpO1xuICAgIHdhaXRGb3JFbGVtZW50KCdteS1jbXAnKTtcbiAgICBleHBlY3QoYnJvd3Nlci5nZXRDdXJyZW50VXJsKCkpLnRvTWF0Y2goL1xcL2JyYWQkLyk7XG5cbiAgICAvLyBjaGVjayB0aGF0IHR5cGVkIGlucHV0IGlzIHRoZSBzYW1lXG4gICAgZXhwZWN0KGVsZW1lbnQoYnkuY3NzKCcjbWVzc2FnZScpKS5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJykpLnRvRXF1YWwoJ2xvbmcgdGltZSBubyBzZWUhJyk7XG4gIH0pO1xuXG59KTtcbiJdfQ==