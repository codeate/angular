import { Observable } from 'rxjs/Rx';
import { map } from 'rxjs/operator/map';
var obs = new Observable((sub) => {
    var i = 0;
    setInterval(() => sub.next(++i), 1000);
});
map.call(obs, (i) => `${i} seconds elapsed`).subscribe((msg) => console.log(msg));
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JzZXJ2YWJsZV9wdXJlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1Vc0hVUWFYOS50bXAvYW5ndWxhcjIvZXhhbXBsZXMvZmFjYWRlL3RzL2FzeW5jL29ic2VydmFibGVfcHVyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FDTyxFQUFDLFVBQVUsRUFBYSxNQUFNLFNBQVM7T0FDdkMsRUFBQyxHQUFHLEVBQUMsTUFBTSxtQkFBbUI7QUFFckMsSUFBSSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQVMsQ0FBQyxHQUF1QjtJQUN2RCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDVixXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDekMsQ0FBQyxDQUFDLENBQUM7QUFDSCxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQVMsS0FBSyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFXLEtBQUssT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2xHLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbIi8vICNkb2NyZWdpb24gT2JzZXJ2YWJsZVxuaW1wb3J0IHtPYnNlcnZhYmxlLCBTdWJzY3JpYmVyfSBmcm9tICdyeGpzL1J4JztcbmltcG9ydCB7bWFwfSBmcm9tICdyeGpzL29wZXJhdG9yL21hcCc7XG5cbnZhciBvYnMgPSBuZXcgT2JzZXJ2YWJsZTxudW1iZXI+KChzdWI6IFN1YnNjcmliZXI8bnVtYmVyPikgPT4ge1xuICB2YXIgaSA9IDA7XG4gIHNldEludGVydmFsKCgpID0+IHN1Yi5uZXh0KCsraSksIDEwMDApO1xufSk7XG5tYXAuY2FsbChvYnMsIChpOiBudW1iZXIpID0+IGAke2l9IHNlY29uZHMgZWxhcHNlZGApLnN1YnNjcmliZSgobXNnOiBzdHJpbmcpID0+IGNvbnNvbGUubG9nKG1zZykpO1xuLy8gI2VuZGRvY3JlZ2lvblxuIl19