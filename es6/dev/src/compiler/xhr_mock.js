import { XHR } from 'angular2/src/compiler/xhr';
import { ListWrapper, Map } from 'angular2/src/facade/collection';
import { isBlank, normalizeBlank } from 'angular2/src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
import { PromiseWrapper } from 'angular2/src/facade/async';
/**
 * A mock implementation of {@link XHR} that allows outgoing requests to be mocked
 * and responded to within a single test, without going to the network.
 */
export class MockXHR extends XHR {
    constructor(...args) {
        super(...args);
        this._expectations = [];
        this._definitions = new Map();
        this._requests = [];
    }
    get(url) {
        var request = new _PendingRequest(url);
        this._requests.push(request);
        return request.getPromise();
    }
    /**
     * Add an expectation for the given URL. Incoming requests will be checked against
     * the next expectation (in FIFO order). The `verifyNoOutstandingExpectations` method
     * can be used to check if any expectations have not yet been met.
     *
     * The response given will be returned if the expectation matches.
     */
    expect(url, response) {
        var expectation = new _Expectation(url, response);
        this._expectations.push(expectation);
    }
    /**
     * Add a definition for the given URL to return the given response. Unlike expectations,
     * definitions have no order and will satisfy any matching request at any time. Also
     * unlike expectations, unused definitions do not cause `verifyNoOutstandingExpectations`
     * to return an error.
     */
    when(url, response) { this._definitions.set(url, response); }
    /**
     * Process pending requests and verify there are no outstanding expectations. Also fails
     * if no requests are pending.
     */
    flush() {
        if (this._requests.length === 0) {
            throw new BaseException('No pending requests to flush');
        }
        do {
            this._processRequest(this._requests.shift());
        } while (this._requests.length > 0);
        this.verifyNoOutstandingExpectations();
    }
    /**
     * Throw an exception if any expectations have not been satisfied.
     */
    verifyNoOutstandingExpectations() {
        if (this._expectations.length === 0)
            return;
        var urls = [];
        for (var i = 0; i < this._expectations.length; i++) {
            var expectation = this._expectations[i];
            urls.push(expectation.url);
        }
        throw new BaseException(`Unsatisfied requests: ${urls.join(', ')}`);
    }
    _processRequest(request) {
        var url = request.url;
        if (this._expectations.length > 0) {
            var expectation = this._expectations[0];
            if (expectation.url == url) {
                ListWrapper.remove(this._expectations, expectation);
                request.complete(expectation.response);
                return;
            }
        }
        if (this._definitions.has(url)) {
            var response = this._definitions.get(url);
            request.complete(normalizeBlank(response));
            return;
        }
        throw new BaseException(`Unexpected request ${url}`);
    }
}
class _PendingRequest {
    constructor(url) {
        this.url = url;
        this.completer = PromiseWrapper.completer();
    }
    complete(response) {
        if (isBlank(response)) {
            this.completer.reject(`Failed to load ${this.url}`, null);
        }
        else {
            this.completer.resolve(response);
        }
    }
    getPromise() { return this.completer.promise; }
}
class _Expectation {
    constructor(url, response) {
        this.url = url;
        this.response = response;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGhyX21vY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLVBNb3QxQ0RILnRtcC9hbmd1bGFyMi9zcmMvY29tcGlsZXIveGhyX21vY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSwyQkFBMkI7T0FDdEMsRUFBQyxXQUFXLEVBQUUsR0FBRyxFQUFhLE1BQU0sZ0NBQWdDO09BQ3BFLEVBQUMsT0FBTyxFQUFhLGNBQWMsRUFBQyxNQUFNLDBCQUEwQjtPQUNwRSxFQUFDLGFBQWEsRUFBbUIsTUFBTSxnQ0FBZ0M7T0FDdkUsRUFBbUIsY0FBYyxFQUFDLE1BQU0sMkJBQTJCO0FBRTFFOzs7R0FHRztBQUNILDZCQUE2QixHQUFHO0lBQWhDO1FBQTZCLGVBQUc7UUFDdEIsa0JBQWEsR0FBbUIsRUFBRSxDQUFDO1FBQ25DLGlCQUFZLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7UUFDekMsY0FBUyxHQUFzQixFQUFFLENBQUM7SUErRTVDLENBQUM7SUE3RUMsR0FBRyxDQUFDLEdBQVc7UUFDYixJQUFJLE9BQU8sR0FBRyxJQUFJLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QixNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxNQUFNLENBQUMsR0FBVyxFQUFFLFFBQWdCO1FBQ2xDLElBQUksV0FBVyxHQUFHLElBQUksWUFBWSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxJQUFJLENBQUMsR0FBVyxFQUFFLFFBQWdCLElBQUks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LENBQUM7UUFDNUQsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbkMsQ0FBQztJQUNILENBQUM7SUFFRCxVQUFVLEtBQXNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDbEUsQ0FBQztBQUVEO0lBR0UsWUFBWSxHQUFXLEVBQUUsUUFBZ0I7UUFDdkMsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUMzQixDQUFDO0FBQ0gsQ0FBQztBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtYSFJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb21waWxlci94aHInO1xuaW1wb3J0IHtMaXN0V3JhcHBlciwgTWFwLCBNYXBXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuaW1wb3J0IHtpc0JsYW5rLCBpc1ByZXNlbnQsIG5vcm1hbGl6ZUJsYW5rfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtCYXNlRXhjZXB0aW9uLCBXcmFwcGVkRXhjZXB0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuaW1wb3J0IHtQcm9taXNlQ29tcGxldGVyLCBQcm9taXNlV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9hc3luYyc7XG5cbi8qKlxuICogQSBtb2NrIGltcGxlbWVudGF0aW9uIG9mIHtAbGluayBYSFJ9IHRoYXQgYWxsb3dzIG91dGdvaW5nIHJlcXVlc3RzIHRvIGJlIG1vY2tlZFxuICogYW5kIHJlc3BvbmRlZCB0byB3aXRoaW4gYSBzaW5nbGUgdGVzdCwgd2l0aG91dCBnb2luZyB0byB0aGUgbmV0d29yay5cbiAqL1xuZXhwb3J0IGNsYXNzIE1vY2tYSFIgZXh0ZW5kcyBYSFIge1xuICBwcml2YXRlIF9leHBlY3RhdGlvbnM6IF9FeHBlY3RhdGlvbltdID0gW107XG4gIHByaXZhdGUgX2RlZmluaXRpb25zID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgcHJpdmF0ZSBfcmVxdWVzdHM6IF9QZW5kaW5nUmVxdWVzdFtdID0gW107XG5cbiAgZ2V0KHVybDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICB2YXIgcmVxdWVzdCA9IG5ldyBfUGVuZGluZ1JlcXVlc3QodXJsKTtcbiAgICB0aGlzLl9yZXF1ZXN0cy5wdXNoKHJlcXVlc3QpO1xuICAgIHJldHVybiByZXF1ZXN0LmdldFByb21pc2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYW4gZXhwZWN0YXRpb24gZm9yIHRoZSBnaXZlbiBVUkwuIEluY29taW5nIHJlcXVlc3RzIHdpbGwgYmUgY2hlY2tlZCBhZ2FpbnN0XG4gICAqIHRoZSBuZXh0IGV4cGVjdGF0aW9uIChpbiBGSUZPIG9yZGVyKS4gVGhlIGB2ZXJpZnlOb091dHN0YW5kaW5nRXhwZWN0YXRpb25zYCBtZXRob2RcbiAgICogY2FuIGJlIHVzZWQgdG8gY2hlY2sgaWYgYW55IGV4cGVjdGF0aW9ucyBoYXZlIG5vdCB5ZXQgYmVlbiBtZXQuXG4gICAqXG4gICAqIFRoZSByZXNwb25zZSBnaXZlbiB3aWxsIGJlIHJldHVybmVkIGlmIHRoZSBleHBlY3RhdGlvbiBtYXRjaGVzLlxuICAgKi9cbiAgZXhwZWN0KHVybDogc3RyaW5nLCByZXNwb25zZTogc3RyaW5nKSB7XG4gICAgdmFyIGV4cGVjdGF0aW9uID0gbmV3IF9FeHBlY3RhdGlvbih1cmwsIHJlc3BvbnNlKTtcbiAgICB0aGlzLl9leHBlY3RhdGlvbnMucHVzaChleHBlY3RhdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgZGVmaW5pdGlvbiBmb3IgdGhlIGdpdmVuIFVSTCB0byByZXR1cm4gdGhlIGdpdmVuIHJlc3BvbnNlLiBVbmxpa2UgZXhwZWN0YXRpb25zLFxuICAgKiBkZWZpbml0aW9ucyBoYXZlIG5vIG9yZGVyIGFuZCB3aWxsIHNhdGlzZnkgYW55IG1hdGNoaW5nIHJlcXVlc3QgYXQgYW55IHRpbWUuIEFsc29cbiAgICogdW5saWtlIGV4cGVjdGF0aW9ucywgdW51c2VkIGRlZmluaXRpb25zIGRvIG5vdCBjYXVzZSBgdmVyaWZ5Tm9PdXRzdGFuZGluZ0V4cGVjdGF0aW9uc2BcbiAgICogdG8gcmV0dXJuIGFuIGVycm9yLlxuICAgKi9cbiAgd2hlbih1cmw6IHN0cmluZywgcmVzcG9uc2U6IHN0cmluZykgeyB0aGlzLl9kZWZpbml0aW9ucy5zZXQodXJsLCByZXNwb25zZSk7IH1cblxuICAvKipcbiAgICogUHJvY2VzcyBwZW5kaW5nIHJlcXVlc3RzIGFuZCB2ZXJpZnkgdGhlcmUgYXJlIG5vIG91dHN0YW5kaW5nIGV4cGVjdGF0aW9ucy4gQWxzbyBmYWlsc1xuICAgKiBpZiBubyByZXF1ZXN0cyBhcmUgcGVuZGluZy5cbiAgICovXG4gIGZsdXNoKCkge1xuICAgIGlmICh0aGlzLl9yZXF1ZXN0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKCdObyBwZW5kaW5nIHJlcXVlc3RzIHRvIGZsdXNoJyk7XG4gICAgfVxuXG4gICAgZG8ge1xuICAgICAgdGhpcy5fcHJvY2Vzc1JlcXVlc3QodGhpcy5fcmVxdWVzdHMuc2hpZnQoKSk7XG4gICAgfSB3aGlsZSAodGhpcy5fcmVxdWVzdHMubGVuZ3RoID4gMCk7XG5cbiAgICB0aGlzLnZlcmlmeU5vT3V0c3RhbmRpbmdFeHBlY3RhdGlvbnMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaHJvdyBhbiBleGNlcHRpb24gaWYgYW55IGV4cGVjdGF0aW9ucyBoYXZlIG5vdCBiZWVuIHNhdGlzZmllZC5cbiAgICovXG4gIHZlcmlmeU5vT3V0c3RhbmRpbmdFeHBlY3RhdGlvbnMoKSB7XG4gICAgaWYgKHRoaXMuX2V4cGVjdGF0aW9ucy5sZW5ndGggPT09IDApIHJldHVybjtcblxuICAgIHZhciB1cmxzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9leHBlY3RhdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBleHBlY3RhdGlvbiA9IHRoaXMuX2V4cGVjdGF0aW9uc1tpXTtcbiAgICAgIHVybHMucHVzaChleHBlY3RhdGlvbi51cmwpO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKGBVbnNhdGlzZmllZCByZXF1ZXN0czogJHt1cmxzLmpvaW4oJywgJyl9YCk7XG4gIH1cblxuICBwcml2YXRlIF9wcm9jZXNzUmVxdWVzdChyZXF1ZXN0OiBfUGVuZGluZ1JlcXVlc3QpIHtcbiAgICB2YXIgdXJsID0gcmVxdWVzdC51cmw7XG5cbiAgICBpZiAodGhpcy5fZXhwZWN0YXRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciBleHBlY3RhdGlvbiA9IHRoaXMuX2V4cGVjdGF0aW9uc1swXTtcbiAgICAgIGlmIChleHBlY3RhdGlvbi51cmwgPT0gdXJsKSB7XG4gICAgICAgIExpc3RXcmFwcGVyLnJlbW92ZSh0aGlzLl9leHBlY3RhdGlvbnMsIGV4cGVjdGF0aW9uKTtcbiAgICAgICAgcmVxdWVzdC5jb21wbGV0ZShleHBlY3RhdGlvbi5yZXNwb25zZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZGVmaW5pdGlvbnMuaGFzKHVybCkpIHtcbiAgICAgIHZhciByZXNwb25zZSA9IHRoaXMuX2RlZmluaXRpb25zLmdldCh1cmwpO1xuICAgICAgcmVxdWVzdC5jb21wbGV0ZShub3JtYWxpemVCbGFuayhyZXNwb25zZSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKGBVbmV4cGVjdGVkIHJlcXVlc3QgJHt1cmx9YCk7XG4gIH1cbn1cblxuY2xhc3MgX1BlbmRpbmdSZXF1ZXN0IHtcbiAgdXJsOiBzdHJpbmc7XG4gIGNvbXBsZXRlcjogUHJvbWlzZUNvbXBsZXRlcjxzdHJpbmc+O1xuXG4gIGNvbnN0cnVjdG9yKHVybCkge1xuICAgIHRoaXMudXJsID0gdXJsO1xuICAgIHRoaXMuY29tcGxldGVyID0gUHJvbWlzZVdyYXBwZXIuY29tcGxldGVyKCk7XG4gIH1cblxuICBjb21wbGV0ZShyZXNwb25zZTogc3RyaW5nKSB7XG4gICAgaWYgKGlzQmxhbmsocmVzcG9uc2UpKSB7XG4gICAgICB0aGlzLmNvbXBsZXRlci5yZWplY3QoYEZhaWxlZCB0byBsb2FkICR7dGhpcy51cmx9YCwgbnVsbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29tcGxldGVyLnJlc29sdmUocmVzcG9uc2UpO1xuICAgIH1cbiAgfVxuXG4gIGdldFByb21pc2UoKTogUHJvbWlzZTxzdHJpbmc+IHsgcmV0dXJuIHRoaXMuY29tcGxldGVyLnByb21pc2U7IH1cbn1cblxuY2xhc3MgX0V4cGVjdGF0aW9uIHtcbiAgdXJsOiBzdHJpbmc7XG4gIHJlc3BvbnNlOiBzdHJpbmc7XG4gIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nLCByZXNwb25zZTogc3RyaW5nKSB7XG4gICAgdGhpcy51cmwgPSB1cmw7XG4gICAgdGhpcy5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICB9XG59XG4iXX0=