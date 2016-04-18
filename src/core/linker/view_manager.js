'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var di_1 = require('angular2/src/core/di');
var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
var api_1 = require('angular2/src/core/render/api');
var profile_1 = require('../profile/profile');
var application_tokens_1 = require('angular2/src/core/application_tokens');
var view_type_1 = require('./view_type');
/**
 * Service exposing low level API for creating, moving and destroying Views.
 *
 * Most applications should use higher-level abstractions like {@link DynamicComponentLoader} and
 * {@link ViewContainerRef} instead.
 */
var AppViewManager = (function () {
    function AppViewManager() {
    }
    return AppViewManager;
}());
exports.AppViewManager = AppViewManager;
var AppViewManager_ = (function (_super) {
    __extends(AppViewManager_, _super);
    function AppViewManager_(_renderer, _appId) {
        _super.call(this);
        this._renderer = _renderer;
        this._appId = _appId;
        this._nextCompTypeId = 0;
        /** @internal */
        this._createRootHostViewScope = profile_1.wtfCreateScope('AppViewManager#createRootHostView()');
        /** @internal */
        this._destroyRootHostViewScope = profile_1.wtfCreateScope('AppViewManager#destroyRootHostView()');
    }
    AppViewManager_.prototype.getViewContainer = function (location) {
        return location.internalElement.vcRef;
    };
    AppViewManager_.prototype.getHostElement = function (hostViewRef) {
        var hostView = hostViewRef.internalView;
        if (hostView.type !== view_type_1.ViewType.HOST) {
            throw new exceptions_1.BaseException('This operation is only allowed on host views');
        }
        return hostView.getHostViewElement().ref;
    };
    AppViewManager_.prototype.getNamedElementInComponentView = function (hostLocation, variableName) {
        var appEl = hostLocation.internalElement;
        var componentView = appEl.componentView;
        if (lang_1.isBlank(componentView)) {
            throw new exceptions_1.BaseException("There is no component directive at element " + hostLocation);
        }
        var el = componentView.namedAppElements[variableName];
        if (lang_1.isPresent(el)) {
            return el.ref;
        }
        throw new exceptions_1.BaseException("Could not find variable " + variableName);
    };
    AppViewManager_.prototype.getComponent = function (hostLocation) {
        return hostLocation.internalElement.component;
    };
    AppViewManager_.prototype.createRootHostView = function (hostViewFactoryRef, overrideSelector, injector, projectableNodes) {
        if (projectableNodes === void 0) { projectableNodes = null; }
        var s = this._createRootHostViewScope();
        var hostViewFactory = hostViewFactoryRef.internalHostViewFactory;
        var selector = lang_1.isPresent(overrideSelector) ? overrideSelector : hostViewFactory.selector;
        var view = hostViewFactory.viewFactory(this, injector, null);
        view.create(projectableNodes, selector);
        return profile_1.wtfLeave(s, view.ref);
    };
    AppViewManager_.prototype.destroyRootHostView = function (hostViewRef) {
        var s = this._destroyRootHostViewScope();
        var hostView = hostViewRef.internalView;
        hostView.renderer.detachView(hostView.flatRootNodes);
        hostView.destroy();
        profile_1.wtfLeave(s);
    };
    /**
     * Used by the generated code
     */
    AppViewManager_.prototype.createRenderComponentType = function (templateUrl, slotCount, encapsulation, styles) {
        return new api_1.RenderComponentType(this._appId + "-" + this._nextCompTypeId++, templateUrl, slotCount, encapsulation, styles);
    };
    /** @internal */
    AppViewManager_.prototype.renderComponent = function (renderComponentType) {
        return this._renderer.renderComponent(renderComponentType);
    };
    AppViewManager_ = __decorate([
        di_1.Injectable(),
        __param(1, di_1.Inject(application_tokens_1.APP_ID)), 
        __metadata('design:paramtypes', [api_1.RootRenderer, String])
    ], AppViewManager_);
    return AppViewManager_;
}(AppViewManager));
exports.AppViewManager_ = AppViewManager_;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld19tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1xUWVOdnM5dS50bXAvYW5ndWxhcjIvc3JjL2NvcmUvbGlua2VyL3ZpZXdfbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxtQkFPTyxzQkFBc0IsQ0FBQyxDQUFBO0FBQzlCLHFCQUFnRCwwQkFBMEIsQ0FBQyxDQUFBO0FBQzNFLDJCQUE0QixnQ0FBZ0MsQ0FBQyxDQUFBO0FBVzdELG9CQUEwRCw4QkFBOEIsQ0FBQyxDQUFBO0FBQ3pGLHdCQUFtRCxvQkFBb0IsQ0FBQyxDQUFBO0FBQ3hFLG1DQUFxQixzQ0FBc0MsQ0FBQyxDQUFBO0FBRTVELDBCQUF1QixhQUFhLENBQUMsQ0FBQTtBQUVyQzs7Ozs7R0FLRztBQUNIO0lBQUE7SUF5RkEsQ0FBQztJQUFELHFCQUFDO0FBQUQsQ0FBQyxBQXpGRCxJQXlGQztBQXpGcUIsc0JBQWMsaUJBeUZuQyxDQUFBO0FBR0Q7SUFBcUMsbUNBQWM7SUFHakQseUJBQW9CLFNBQXVCLEVBQTBCLE1BQWM7UUFBSSxpQkFBTyxDQUFDO1FBQTNFLGNBQVMsR0FBVCxTQUFTLENBQWM7UUFBMEIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUYzRSxvQkFBZSxHQUFXLENBQUMsQ0FBQztRQWlDcEMsZ0JBQWdCO1FBQ2hCLDZCQUF3QixHQUFlLHdCQUFjLENBQUMscUNBQXFDLENBQUMsQ0FBQztRQVk3RixnQkFBZ0I7UUFDaEIsOEJBQXlCLEdBQWUsd0JBQWMsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO0lBN0NDLENBQUM7SUFFakcsMENBQWdCLEdBQWhCLFVBQWlCLFFBQW9CO1FBQ25DLE1BQU0sQ0FBZSxRQUFTLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQztJQUN2RCxDQUFDO0lBRUQsd0NBQWMsR0FBZCxVQUFlLFdBQW9CO1FBQ2pDLElBQUksUUFB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SUFDN0QsQ0FBQztJQXhFSDtRQUFDLGVBQVUsRUFBRTttQkFJbUMsV0FBTSxDQUFDLDJCQUFNLENBQUM7O3VCQUpqRDtJQXlFYixzQkFBQztBQUFELENBQUMsQUF4RUQsQ0FBcUMsY0FBYyxHQXdFbEQ7QUF4RVksdUJBQWUsa0JBd0UzQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgSW5qZWN0b3IsXG4gIEluamVjdCxcbiAgUHJvdmlkZXIsXG4gIEluamVjdGFibGUsXG4gIFJlc29sdmVkUHJvdmlkZXIsXG4gIGZvcndhcmRSZWZcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGknO1xuaW1wb3J0IHtpc1ByZXNlbnQsIGlzQmxhbmssIGlzQXJyYXksIFR5cGV9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0Jhc2VFeGNlcHRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5pbXBvcnQge0VsZW1lbnRSZWYsIEVsZW1lbnRSZWZffSBmcm9tICcuL2VsZW1lbnRfcmVmJztcbmltcG9ydCB7XG4gIEhvc3RWaWV3RmFjdG9yeVJlZixcbiAgSG9zdFZpZXdGYWN0b3J5UmVmXyxcbiAgRW1iZWRkZWRWaWV3UmVmLFxuICBIb3N0Vmlld1JlZixcbiAgVmlld1JlZixcbiAgVmlld1JlZl9cbn0gZnJvbSAnLi92aWV3X3JlZic7XG5pbXBvcnQge1ZpZXdDb250YWluZXJSZWYsIFZpZXdDb250YWluZXJSZWZffSBmcm9tICcuL3ZpZXdfY29udGFpbmVyX3JlZic7XG5pbXBvcnQge1Jvb3RSZW5kZXJlciwgUmVuZGVyQ29tcG9uZW50VHlwZSwgUmVuZGVyZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL3JlbmRlci9hcGknO1xuaW1wb3J0IHt3dGZDcmVhdGVTY29wZSwgd3RmTGVhdmUsIFd0ZlNjb3BlRm59IGZyb20gJy4uL3Byb2ZpbGUvcHJvZmlsZSc7XG5pbXBvcnQge0FQUF9JRH0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvYXBwbGljYXRpb25fdG9rZW5zJztcbmltcG9ydCB7Vmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL21ldGFkYXRhL3ZpZXcnO1xuaW1wb3J0IHtWaWV3VHlwZX0gZnJvbSAnLi92aWV3X3R5cGUnO1xuXG4vKipcbiAqIFNlcnZpY2UgZXhwb3NpbmcgbG93IGxldmVsIEFQSSBmb3IgY3JlYXRpbmcsIG1vdmluZyBhbmQgZGVzdHJveWluZyBWaWV3cy5cbiAqXG4gKiBNb3N0IGFwcGxpY2F0aW9ucyBzaG91bGQgdXNlIGhpZ2hlci1sZXZlbCBhYnN0cmFjdGlvbnMgbGlrZSB7QGxpbmsgRHluYW1pY0NvbXBvbmVudExvYWRlcn0gYW5kXG4gKiB7QGxpbmsgVmlld0NvbnRhaW5lclJlZn0gaW5zdGVhZC5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFwcFZpZXdNYW5hZ2VyIHtcbiAgLyoqXG4gICAqIFJldHVybnMgYSB7QGxpbmsgVmlld0NvbnRhaW5lclJlZn0gb2YgdGhlIFZpZXcgQ29udGFpbmVyIGF0IHRoZSBzcGVjaWZpZWQgbG9jYXRpb24uXG4gICAqL1xuICBhYnN0cmFjdCBnZXRWaWV3Q29udGFpbmVyKGxvY2F0aW9uOiBFbGVtZW50UmVmKTogVmlld0NvbnRhaW5lclJlZjtcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUge0BsaW5rIEVsZW1lbnRSZWZ9IHRoYXQgbWFrZXMgdXAgdGhlIHNwZWNpZmllZCBIb3N0IFZpZXcuXG4gICAqL1xuICBhYnN0cmFjdCBnZXRIb3N0RWxlbWVudChob3N0Vmlld1JlZjogSG9zdFZpZXdSZWYpOiBFbGVtZW50UmVmO1xuXG4gIC8qKlxuICAgKiBTZWFyY2hlcyB0aGUgQ29tcG9uZW50IFZpZXcgb2YgdGhlIENvbXBvbmVudCBzcGVjaWZpZWQgdmlhIGBob3N0TG9jYXRpb25gIGFuZCByZXR1cm5zIHRoZVxuICAgKiB7QGxpbmsgRWxlbWVudFJlZn0gZm9yIHRoZSBFbGVtZW50IGlkZW50aWZpZWQgdmlhIGEgVmFyaWFibGUgTmFtZSBgdmFyaWFibGVOYW1lYC5cbiAgICpcbiAgICogVGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiB0aGUgc3BlY2lmaWVkIGBob3N0TG9jYXRpb25gIGlzIG5vdCBhIEhvc3QgRWxlbWVudCBvZiBhIENvbXBvbmVudCwgb3IgaWZcbiAgICogdmFyaWFibGUgYHZhcmlhYmxlTmFtZWAgY291bGRuJ3QgYmUgZm91bmQgaW4gdGhlIENvbXBvbmVudCBWaWV3IG9mIHRoaXMgQ29tcG9uZW50LlxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0TmFtZWRFbGVtZW50SW5Db21wb25lbnRWaWV3KGhvc3RMb2NhdGlvbjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhYmxlTmFtZTogc3RyaW5nKTogRWxlbWVudFJlZjtcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY29tcG9uZW50IGluc3RhbmNlIGZvciB0aGUgcHJvdmlkZWQgSG9zdCBFbGVtZW50LlxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0Q29tcG9uZW50KGhvc3RMb2NhdGlvbjogRWxlbWVudFJlZik6IGFueTtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBhIENvbXBvbmVudCBhbmQgYXR0YWNoZXMgaXQgdG8gdGhlIGZpcnN0IGVsZW1lbnQgaW4gdGhlIGdsb2JhbCBWaWV3XG4gICAqICh1c3VhbGx5IERPTSBEb2N1bWVudCkgdGhhdCBtYXRjaGVzIHRoZSBjb21wb25lbnQncyBzZWxlY3RvciBvciBgb3ZlcnJpZGVTZWxlY3RvcmAuXG4gICAqXG4gICAqIFRoaXMgYXMgYSBsb3ctbGV2ZWwgd2F5IHRvIGJvb3RzdHJhcCBhbiBhcHBsaWNhdGlvbiBhbmQgdXBncmFkZSBhbiBleGlzdGluZyBFbGVtZW50IHRvIGFcbiAgICogSG9zdCBFbGVtZW50LiBNb3N0IGFwcGxpY2F0aW9ucyBzaG91bGQgdXNlIHtAbGluayBEeW5hbWljQ29tcG9uZW50TG9hZGVyI2xvYWRBc1Jvb3R9IGluc3RlYWQuXG4gICAqXG4gICAqIFRoZSBDb21wb25lbnQgYW5kIGl0cyBWaWV3IGFyZSBjcmVhdGVkIGJhc2VkIG9uIHRoZSBgaG9zdFByb3RvQ29tcG9uZW50UmVmYCB3aGljaCBjYW4gYmVcbiAgICogb2J0YWluZWRcbiAgICogYnkgY29tcGlsaW5nIHRoZSBjb21wb25lbnQgd2l0aCB7QGxpbmsgQ29tcGlsZXIjY29tcGlsZUluSG9zdH0uXG4gICAqXG4gICAqIFVzZSB7QGxpbmsgQXBwVmlld01hbmFnZXIjZGVzdHJveVJvb3RIb3N0Vmlld30gdG8gZGVzdHJveSB0aGUgY3JlYXRlZCBDb21wb25lbnQgYW5kIGl0J3MgSG9zdFxuICAgKiBWaWV3LlxuICAgKlxuICAgKiAjIyMgRXhhbXBsZVxuICAgKlxuICAgKiBgYGBcbiAgICogQG5nLkNvbXBvbmVudCh7XG4gICAqICAgc2VsZWN0b3I6ICdjaGlsZC1jb21wb25lbnQnXG4gICAqIH0pXG4gICAqIEBuZy5WaWV3KHtcbiAgICogICB0ZW1wbGF0ZTogJ0NoaWxkJ1xuICAgKiB9KVxuICAgKiBjbGFzcyBDaGlsZENvbXBvbmVudCB7XG4gICAqXG4gICAqIH1cbiAgICpcbiAgICogQG5nLkNvbXBvbmVudCh7XG4gICAqICAgc2VsZWN0b3I6ICdteS1hcHAnXG4gICAqIH0pXG4gICAqIEBuZy5WaWV3KHtcbiAgICogICB0ZW1wbGF0ZTogYFxuICAgKiAgICAgUGFyZW50ICg8c29tZS1jb21wb25lbnQ+PC9zb21lLWNvbXBvbmVudD4pXG4gICAqICAgYFxuICAgKiB9KVxuICAgKiBjbGFzcyBNeUFwcCBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gICAqICAgdmlld1JlZjogbmcuVmlld1JlZjtcbiAgICpcbiAgICogICBjb25zdHJ1Y3RvcihwdWJsaWMgYXBwVmlld01hbmFnZXI6IG5nLkFwcFZpZXdNYW5hZ2VyLCBjb21waWxlcjogbmcuQ29tcGlsZXIpIHtcbiAgICogICAgIGNvbXBpbGVyLmNvbXBpbGVJbkhvc3QoQ2hpbGRDb21wb25lbnQpLnRoZW4oKHByb3RvVmlldzogbmcuUHJvdG9Db21wb25lbnRSZWYpID0+IHtcbiAgICogICAgICAgdGhpcy52aWV3UmVmID0gYXBwVmlld01hbmFnZXIuY3JlYXRlUm9vdEhvc3RWaWV3KHByb3RvVmlldywgJ3NvbWUtY29tcG9uZW50JywgbnVsbCk7XG4gICAqICAgICB9KVxuICAgKiAgIH1cbiAgICpcbiAgICogICBuZ09uRGVzdHJveSgpIHtcbiAgICogICAgIHRoaXMuYXBwVmlld01hbmFnZXIuZGVzdHJveVJvb3RIb3N0Vmlldyh0aGlzLnZpZXdSZWYpO1xuICAgKiAgICAgdGhpcy52aWV3UmVmID0gbnVsbDtcbiAgICogICB9XG4gICAqIH1cbiAgICpcbiAgICogbmcuYm9vdHN0cmFwKE15QXBwKTtcbiAgICogYGBgXG4gICAqL1xuICBhYnN0cmFjdCBjcmVhdGVSb290SG9zdFZpZXcoaG9zdFZpZXdGYWN0b3J5UmVmOiBIb3N0Vmlld0ZhY3RvcnlSZWYsIG92ZXJyaWRlU2VsZWN0b3I6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluamVjdG9yOiBJbmplY3RvciwgcHJvamVjdGFibGVOb2Rlcz86IGFueVtdW10pOiBIb3N0Vmlld1JlZjtcblxuICAvKipcbiAgICogRGVzdHJveXMgdGhlIEhvc3QgVmlldyBjcmVhdGVkIHZpYSB7QGxpbmsgQXBwVmlld01hbmFnZXIjY3JlYXRlUm9vdEhvc3RWaWV3fS5cbiAgICpcbiAgICogQWxvbmcgd2l0aCB0aGUgSG9zdCBWaWV3LCB0aGUgQ29tcG9uZW50IEluc3RhbmNlIGFzIHdlbGwgYXMgYWxsIG5lc3RlZCBWaWV3IGFuZCBDb21wb25lbnRzIGFyZVxuICAgKiBkZXN0cm95ZWQgYXMgd2VsbC5cbiAgICovXG4gIGFic3RyYWN0IGRlc3Ryb3lSb290SG9zdFZpZXcoaG9zdFZpZXdSZWY6IEhvc3RWaWV3UmVmKTtcbn1cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEFwcFZpZXdNYW5hZ2VyXyBleHRlbmRzIEFwcFZpZXdNYW5hZ2VyIHtcbiAgcHJpdmF0ZSBfbmV4dENvbXBUeXBlSWQ6IG51bWJlciA9IDA7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcmVuZGVyZXI6IFJvb3RSZW5kZXJlciwgQEluamVjdChBUFBfSUQpIHByaXZhdGUgX2FwcElkOiBzdHJpbmcpIHsgc3VwZXIoKTsgfVxuXG4gIGdldFZpZXdDb250YWluZXIobG9jYXRpb246IEVsZW1lbnRSZWYpOiBWaWV3Q29udGFpbmVyUmVmIHtcbiAgICByZXR1cm4gKDxFbGVtZW50UmVmXz5sb2NhdGlvbikuaW50ZXJuYWxFbGVtZW50LnZjUmVmO1xuICB9XG5cbiAgZ2V0SG9zdEVsZW1lbnQoaG9zdFZpZXdSZWY6IFZpZXdSZWYpOiBFbGVtZW50UmVmIHtcbiAgICB2YXIgaG9zdFZpZXcgPSAoPFZpZXdSZWZfPmhvc3RWaWV3UmVmKS5pbnRlcm5hbFZpZXc7XG4gICAgaWYgKGhvc3RWaWV3LnR5cGUgIT09IFZpZXdUeXBlLkhPU1QpIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKCdUaGlzIG9wZXJhdGlvbiBpcyBvbmx5IGFsbG93ZWQgb24gaG9zdCB2aWV3cycpO1xuICAgIH1cbiAgICByZXR1cm4gaG9zdFZpZXcuZ2V0SG9zdFZpZXdFbGVtZW50KCkucmVmO1xuICB9XG5cbiAgZ2V0TmFtZWRFbGVtZW50SW5Db21wb25lbnRWaWV3KGhvc3RMb2NhdGlvbjogRWxlbWVudFJlZiwgdmFyaWFibGVOYW1lOiBzdHJpbmcpOiBFbGVtZW50UmVmIHtcbiAgICB2YXIgYXBwRWwgPSAoPEVsZW1lbnRSZWZfPmhvc3RMb2NhdGlvbikuaW50ZXJuYWxFbGVtZW50O1xuICAgIHZhciBjb21wb25lbnRWaWV3ID0gYXBwRWwuY29tcG9uZW50VmlldztcbiAgICBpZiAoaXNCbGFuayhjb21wb25lbnRWaWV3KSkge1xuICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oYFRoZXJlIGlzIG5vIGNvbXBvbmVudCBkaXJlY3RpdmUgYXQgZWxlbWVudCAke2hvc3RMb2NhdGlvbn1gKTtcbiAgICB9XG4gICAgdmFyIGVsID0gY29tcG9uZW50Vmlldy5uYW1lZEFwcEVsZW1lbnRzW3ZhcmlhYmxlTmFtZV07XG4gICAgaWYgKGlzUHJlc2VudChlbCkpIHtcbiAgICAgIHJldHVybiBlbC5yZWY7XG4gICAgfVxuICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKGBDb3VsZCBub3QgZmluZCB2YXJpYWJsZSAke3ZhcmlhYmxlTmFtZX1gKTtcbiAgfVxuXG4gIGdldENvbXBvbmVudChob3N0TG9jYXRpb246IEVsZW1lbnRSZWYpOiBhbnkge1xuICAgIHJldHVybiAoPEVsZW1lbnRSZWZfPmhvc3RMb2NhdGlvbikuaW50ZXJuYWxFbGVtZW50LmNvbXBvbmVudDtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2NyZWF0ZVJvb3RIb3N0Vmlld1Njb3BlOiBXdGZTY29wZUZuID0gd3RmQ3JlYXRlU2NvcGUoJ0FwcFZpZXdNYW5hZ2VyI2NyZWF0ZVJvb3RIb3N0VmlldygpJyk7XG5cbiAgY3JlYXRlUm9vdEhvc3RWaWV3KGhvc3RWaWV3RmFjdG9yeVJlZjogSG9zdFZpZXdGYWN0b3J5UmVmLCBvdmVycmlkZVNlbGVjdG9yOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICBpbmplY3RvcjogSW5qZWN0b3IsIHByb2plY3RhYmxlTm9kZXM6IGFueVtdW10gPSBudWxsKTogSG9zdFZpZXdSZWYge1xuICAgIHZhciBzID0gdGhpcy5fY3JlYXRlUm9vdEhvc3RWaWV3U2NvcGUoKTtcbiAgICB2YXIgaG9zdFZpZXdGYWN0b3J5ID0gKDxIb3N0Vmlld0ZhY3RvcnlSZWZfPmhvc3RWaWV3RmFjdG9yeVJlZikuaW50ZXJuYWxIb3N0Vmlld0ZhY3Rvcnk7XG4gICAgdmFyIHNlbGVjdG9yID0gaXNQcmVzZW50KG92ZXJyaWRlU2VsZWN0b3IpID8gb3ZlcnJpZGVTZWxlY3RvciA6IGhvc3RWaWV3RmFjdG9yeS5zZWxlY3RvcjtcbiAgICB2YXIgdmlldyA9IGhvc3RWaWV3RmFjdG9yeS52aWV3RmFjdG9yeSh0aGlzLCBpbmplY3RvciwgbnVsbCk7XG4gICAgdmlldy5jcmVhdGUocHJvamVjdGFibGVOb2Rlcywgc2VsZWN0b3IpO1xuICAgIHJldHVybiB3dGZMZWF2ZShzLCB2aWV3LnJlZik7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9kZXN0cm95Um9vdEhvc3RWaWV3U2NvcGU6IFd0ZlNjb3BlRm4gPSB3dGZDcmVhdGVTY29wZSgnQXBwVmlld01hbmFnZXIjZGVzdHJveVJvb3RIb3N0VmlldygpJyk7XG5cbiAgZGVzdHJveVJvb3RIb3N0Vmlldyhob3N0Vmlld1JlZjogVmlld1JlZikge1xuICAgIHZhciBzID0gdGhpcy5fZGVzdHJveVJvb3RIb3N0Vmlld1Njb3BlKCk7XG4gICAgdmFyIGhvc3RWaWV3ID0gKDxWaWV3UmVmXz5ob3N0Vmlld1JlZikuaW50ZXJuYWxWaWV3O1xuICAgIGhvc3RWaWV3LnJlbmRlcmVyLmRldGFjaFZpZXcoaG9zdFZpZXcuZmxhdFJvb3ROb2Rlcyk7XG4gICAgaG9zdFZpZXcuZGVzdHJveSgpO1xuICAgIHd0ZkxlYXZlKHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZWQgYnkgdGhlIGdlbmVyYXRlZCBjb2RlXG4gICAqL1xuICBjcmVhdGVSZW5kZXJDb21wb25lbnRUeXBlKHRlbXBsYXRlVXJsOiBzdHJpbmcsIHNsb3RDb3VudDogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlczogQXJyYXk8c3RyaW5nIHwgYW55W10+KTogUmVuZGVyQ29tcG9uZW50VHlwZSB7XG4gICAgcmV0dXJuIG5ldyBSZW5kZXJDb21wb25lbnRUeXBlKGAke3RoaXMuX2FwcElkfS0ke3RoaXMuX25leHRDb21wVHlwZUlkKyt9YCwgdGVtcGxhdGVVcmwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNsb3RDb3VudCwgZW5jYXBzdWxhdGlvbiwgc3R5bGVzKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcmVuZGVyQ29tcG9uZW50KHJlbmRlckNvbXBvbmVudFR5cGU6IFJlbmRlckNvbXBvbmVudFR5cGUpOiBSZW5kZXJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3JlbmRlcmVyLnJlbmRlckNvbXBvbmVudChyZW5kZXJDb21wb25lbnRUeXBlKTtcbiAgfVxufVxuIl19