import { Type } from 'angular2/src/facade/lang';
import { CanActivate } from './lifecycle_annotations_impl';
import { reflector } from 'angular2/src/core/reflection/reflection';
export function hasLifecycleHook(e, type) {
    if (!(type instanceof Type))
        return false;
    return e.name in type.prototype;
}
export function getCanActivateHook(type) {
    var annotations = reflector.annotations(type);
    for (let i = 0; i < annotations.length; i += 1) {
        let annotation = annotations[i];
        if (annotation instanceof CanActivate) {
            return annotation.fn;
        }
    }
    return null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVfbGlmZWN5Y2xlX3JlZmxlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtVXNIVVFhWDkudG1wL2FuZ3VsYXIyL3NyYy9yb3V0ZXIvbGlmZWN5Y2xlL3JvdXRlX2xpZmVjeWNsZV9yZWZsZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sRUFBQyxJQUFJLEVBQVksTUFBTSwwQkFBMEI7T0FDakQsRUFBcUIsV0FBVyxFQUFDLE1BQU0sOEJBQThCO09BQ3JFLEVBQUMsU0FBUyxFQUFDLE1BQU0seUNBQXlDO0FBRWpFLGlDQUFpQyxDQUFxQixFQUFFLElBQUk7SUFDMUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksWUFBWSxJQUFJLENBQUMsQ0FBQztRQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDMUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQVMsSUFBSyxDQUFDLFNBQVMsQ0FBQztBQUN4QyxDQUFDO0FBRUQsbUNBQW1DLElBQUk7SUFDckMsSUFBSSxXQUFXLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5QyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQy9DLElBQUksVUFBVSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQyxFQUFFLENBQUMsQ0FBQyxVQUFVLFlBQVksV0FBVyxDQUFDLENBQUMsQ0FBQztZQUN0QyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztRQUN2QixDQUFDO0lBQ0gsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDZCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtUeXBlLCBpc1ByZXNlbnR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge1JvdXRlTGlmZWN5Y2xlSG9vaywgQ2FuQWN0aXZhdGV9IGZyb20gJy4vbGlmZWN5Y2xlX2Fubm90YXRpb25zX2ltcGwnO1xuaW1wb3J0IHtyZWZsZWN0b3J9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL3JlZmxlY3Rpb24vcmVmbGVjdGlvbic7XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNMaWZlY3ljbGVIb29rKGU6IFJvdXRlTGlmZWN5Y2xlSG9vaywgdHlwZSk6IGJvb2xlYW4ge1xuICBpZiAoISh0eXBlIGluc3RhbmNlb2YgVHlwZSkpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuIGUubmFtZSBpbig8YW55PnR5cGUpLnByb3RvdHlwZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENhbkFjdGl2YXRlSG9vayh0eXBlKTogRnVuY3Rpb24ge1xuICB2YXIgYW5ub3RhdGlvbnMgPSByZWZsZWN0b3IuYW5ub3RhdGlvbnModHlwZSk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYW5ub3RhdGlvbnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICBsZXQgYW5ub3RhdGlvbiA9IGFubm90YXRpb25zW2ldO1xuICAgIGlmIChhbm5vdGF0aW9uIGluc3RhbmNlb2YgQ2FuQWN0aXZhdGUpIHtcbiAgICAgIHJldHVybiBhbm5vdGF0aW9uLmZuO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuIl19