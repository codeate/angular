import { IS_DART, isPresent, isBlank } from 'angular2/src/facade/lang';
import { codify, combineGeneratedStrings, rawString } from './codegen_facade';
import { RecordType } from './proto_record';
import { BaseException } from 'angular2/src/facade/exceptions';
/**
 * Class responsible for providing change detection logic for change detector classes.
 */
export class CodegenLogicUtil {
    constructor(_names, _utilName, _changeDetectorStateName) {
        this._names = _names;
        this._utilName = _utilName;
        this._changeDetectorStateName = _changeDetectorStateName;
    }
    /**
     * Generates a statement which updates the local variable representing `protoRec` with the current
     * value of the record. Used by property bindings.
     */
    genPropertyBindingEvalValue(protoRec) {
        return this._genEvalValue(protoRec, idx => this._names.getLocalName(idx), this._names.getLocalsAccessorName());
    }
    /**
     * Generates a statement which updates the local variable representing `protoRec` with the current
     * value of the record. Used by event bindings.
     */
    genEventBindingEvalValue(eventRecord, protoRec) {
        return this._genEvalValue(protoRec, idx => this._names.getEventLocalName(eventRecord, idx), "locals");
    }
    _genEvalValue(protoRec, getLocalName, localsAccessor) {
        var context = (protoRec.contextIndex == -1) ?
            this._names.getDirectiveName(protoRec.directiveIndex) :
            getLocalName(protoRec.contextIndex);
        var argString = protoRec.args.map(arg => getLocalName(arg)).join(", ");
        var rhs;
        switch (protoRec.mode) {
            case RecordType.Self:
                rhs = context;
                break;
            case RecordType.Const:
                rhs = codify(protoRec.funcOrValue);
                break;
            case RecordType.PropertyRead:
                rhs = `${context}.${protoRec.name}`;
                break;
            case RecordType.SafeProperty:
                var read = `${context}.${protoRec.name}`;
                rhs = `${this._utilName}.isValueBlank(${context}) ? null : ${read}`;
                break;
            case RecordType.PropertyWrite:
                rhs = `${context}.${protoRec.name} = ${getLocalName(protoRec.args[0])}`;
                break;
            case RecordType.Local:
                rhs = `${localsAccessor}.get(${rawString(protoRec.name)})`;
                break;
            case RecordType.InvokeMethod:
                rhs = `${context}.${protoRec.name}(${argString})`;
                break;
            case RecordType.SafeMethodInvoke:
                var invoke = `${context}.${protoRec.name}(${argString})`;
                rhs = `${this._utilName}.isValueBlank(${context}) ? null : ${invoke}`;
                break;
            case RecordType.InvokeClosure:
                rhs = `${context}(${argString})`;
                break;
            case RecordType.PrimitiveOp:
                rhs = `${this._utilName}.${protoRec.name}(${argString})`;
                break;
            case RecordType.CollectionLiteral:
                rhs = `${this._utilName}.${protoRec.name}(${argString})`;
                break;
            case RecordType.Interpolate:
                rhs = this._genInterpolation(protoRec);
                break;
            case RecordType.KeyedRead:
                rhs = `${context}[${getLocalName(protoRec.args[0])}]`;
                break;
            case RecordType.KeyedWrite:
                rhs = `${context}[${getLocalName(protoRec.args[0])}] = ${getLocalName(protoRec.args[1])}`;
                break;
            case RecordType.Chain:
                rhs = `${getLocalName(protoRec.args[protoRec.args.length - 1])}`;
                break;
            default:
                throw new BaseException(`Unknown operation ${protoRec.mode}`);
        }
        return `${getLocalName(protoRec.selfIndex)} = ${rhs};`;
    }
    genPropertyBindingTargets(propertyBindingTargets, genDebugInfo) {
        var bs = propertyBindingTargets.map(b => {
            if (isBlank(b))
                return "null";
            var debug = genDebugInfo ? codify(b.debug) : "null";
            return `${this._utilName}.bindingTarget(${codify(b.mode)}, ${b.elementIndex}, ${codify(b.name)}, ${codify(b.unit)}, ${debug})`;
        });
        return `[${bs.join(", ")}]`;
    }
    genDirectiveIndices(directiveRecords) {
        var bs = directiveRecords.map(b => `${this._utilName}.directiveIndex(${b.directiveIndex.elementIndex}, ${b.directiveIndex.directiveIndex})`);
        return `[${bs.join(", ")}]`;
    }
    /** @internal */
    _genInterpolation(protoRec) {
        var iVals = [];
        for (var i = 0; i < protoRec.args.length; ++i) {
            iVals.push(codify(protoRec.fixedArgs[i]));
            iVals.push(`${this._utilName}.s(${this._names.getLocalName(protoRec.args[i])})`);
        }
        iVals.push(codify(protoRec.fixedArgs[protoRec.args.length]));
        return combineGeneratedStrings(iVals);
    }
    genHydrateDirectives(directiveRecords) {
        var res = [];
        var outputCount = 0;
        for (var i = 0; i < directiveRecords.length; ++i) {
            var r = directiveRecords[i];
            var dirVarName = this._names.getDirectiveName(r.directiveIndex);
            res.push(`${dirVarName} = ${this._genReadDirective(i)};`);
            if (isPresent(r.outputs)) {
                r.outputs.forEach(output => {
                    var eventHandlerExpr = this._genEventHandler(r.directiveIndex.elementIndex, output[1]);
                    var statementStart = `this.outputSubscriptions[${outputCount++}] = ${dirVarName}.${output[0]}`;
                    if (IS_DART) {
                        res.push(`${statementStart}.listen(${eventHandlerExpr});`);
                    }
                    else {
                        res.push(`${statementStart}.subscribe({next: ${eventHandlerExpr}});`);
                    }
                });
            }
        }
        if (outputCount > 0) {
            var statementStart = 'this.outputSubscriptions';
            if (IS_DART) {
                res.unshift(`${statementStart} = new List(${outputCount});`);
            }
            else {
                res.unshift(`${statementStart} = new Array(${outputCount});`);
            }
        }
        return res.join("\n");
    }
    genDirectivesOnDestroy(directiveRecords) {
        var res = [];
        for (var i = 0; i < directiveRecords.length; ++i) {
            var r = directiveRecords[i];
            if (r.callOnDestroy) {
                var dirVarName = this._names.getDirectiveName(r.directiveIndex);
                res.push(`${dirVarName}.ngOnDestroy();`);
            }
        }
        return res.join("\n");
    }
    _genEventHandler(boundElementIndex, eventName) {
        if (IS_DART) {
            return `(event) => this.handleEvent('${eventName}', ${boundElementIndex}, event)`;
        }
        else {
            return `(function(event) { return this.handleEvent('${eventName}', ${boundElementIndex}, event); }).bind(this)`;
        }
    }
    _genReadDirective(index) { return `this.getDirectiveFor(directives, ${index})`; }
    genHydrateDetectors(directiveRecords) {
        var res = [];
        for (var i = 0; i < directiveRecords.length; ++i) {
            var r = directiveRecords[i];
            if (!r.isDefaultChangeDetection()) {
                res.push(`${this._names.getDetectorName(r.directiveIndex)} = this.getDetectorFor(directives, ${i});`);
            }
        }
        return res.join("\n");
    }
    genContentLifecycleCallbacks(directiveRecords) {
        var res = [];
        var eq = IS_DART ? '==' : '===';
        // NOTE(kegluneq): Order is important!
        for (var i = directiveRecords.length - 1; i >= 0; --i) {
            var dir = directiveRecords[i];
            if (dir.callAfterContentInit) {
                res.push(`if(${this._names.getStateName()} ${eq} ${this._changeDetectorStateName}.NeverChecked) ${this._names.getDirectiveName(dir.directiveIndex)}.ngAfterContentInit();`);
            }
            if (dir.callAfterContentChecked) {
                res.push(`${this._names.getDirectiveName(dir.directiveIndex)}.ngAfterContentChecked();`);
            }
        }
        return res;
    }
    genViewLifecycleCallbacks(directiveRecords) {
        var res = [];
        var eq = IS_DART ? '==' : '===';
        // NOTE(kegluneq): Order is important!
        for (var i = directiveRecords.length - 1; i >= 0; --i) {
            var dir = directiveRecords[i];
            if (dir.callAfterViewInit) {
                res.push(`if(${this._names.getStateName()} ${eq} ${this._changeDetectorStateName}.NeverChecked) ${this._names.getDirectiveName(dir.directiveIndex)}.ngAfterViewInit();`);
            }
            if (dir.callAfterViewChecked) {
                res.push(`${this._names.getDirectiveName(dir.directiveIndex)}.ngAfterViewChecked();`);
            }
        }
        return res;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZWdlbl9sb2dpY191dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC13ZVRNSHZNTi50bXAvYW5ndWxhcjIvc3JjL2NvcmUvY2hhbmdlX2RldGVjdGlvbi9jb2RlZ2VuX2xvZ2ljX3V0aWwudHMiXSwibmFtZXMiOlsiQ29kZWdlbkxvZ2ljVXRpbCIsIkNvZGVnZW5Mb2dpY1V0aWwuY29uc3RydWN0b3IiLCJDb2RlZ2VuTG9naWNVdGlsLmdlblByb3BlcnR5QmluZGluZ0V2YWxWYWx1ZSIsIkNvZGVnZW5Mb2dpY1V0aWwuZ2VuRXZlbnRCaW5kaW5nRXZhbFZhbHVlIiwiQ29kZWdlbkxvZ2ljVXRpbC5fZ2VuRXZhbFZhbHVlIiwiQ29kZWdlbkxvZ2ljVXRpbC5nZW5Qcm9wZXJ0eUJpbmRpbmdUYXJnZXRzIiwiQ29kZWdlbkxvZ2ljVXRpbC5nZW5EaXJlY3RpdmVJbmRpY2VzIiwiQ29kZWdlbkxvZ2ljVXRpbC5fZ2VuSW50ZXJwb2xhdGlvbiIsIkNvZGVnZW5Mb2dpY1V0aWwuZ2VuSHlkcmF0ZURpcmVjdGl2ZXMiLCJDb2RlZ2VuTG9naWNVdGlsLmdlbkRpcmVjdGl2ZXNPbkRlc3Ryb3kiLCJDb2RlZ2VuTG9naWNVdGlsLl9nZW5FdmVudEhhbmRsZXIiLCJDb2RlZ2VuTG9naWNVdGlsLl9nZW5SZWFkRGlyZWN0aXZlIiwiQ29kZWdlbkxvZ2ljVXRpbC5nZW5IeWRyYXRlRGV0ZWN0b3JzIiwiQ29kZWdlbkxvZ2ljVXRpbC5nZW5Db250ZW50TGlmZWN5Y2xlQ2FsbGJhY2tzIiwiQ29kZWdlbkxvZ2ljVXRpbC5nZW5WaWV3TGlmZWN5Y2xlQ2FsbGJhY2tzIl0sIm1hcHBpbmdzIjoiT0FBTyxFQUFDLE9BQU8sRUFBdUIsU0FBUyxFQUFFLE9BQU8sRUFBQyxNQUFNLDBCQUEwQjtPQUVsRixFQUFDLE1BQU0sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQUMsTUFBTSxrQkFBa0I7T0FDcEUsRUFB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InNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SVNfREFSVCwgSnNvbiwgU3RyaW5nV3JhcHBlciwgaXNQcmVzZW50LCBpc0JsYW5rfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtDb2RlZ2VuTmFtZVV0aWx9IGZyb20gJy4vY29kZWdlbl9uYW1lX3V0aWwnO1xuaW1wb3J0IHtjb2RpZnksIGNvbWJpbmVHZW5lcmF0ZWRTdHJpbmdzLCByYXdTdHJpbmd9IGZyb20gJy4vY29kZWdlbl9mYWNhZGUnO1xuaW1wb3J0IHtQcm90b1JlY29yZCwgUmVjb3JkVHlwZX0gZnJvbSAnLi9wcm90b19yZWNvcmQnO1xuaW1wb3J0IHtCaW5kaW5nVGFyZ2V0fSBmcm9tICcuL2JpbmRpbmdfcmVjb3JkJztcbmltcG9ydCB7RGlyZWN0aXZlUmVjb3JkfSBmcm9tICcuL2RpcmVjdGl2ZV9yZWNvcmQnO1xuaW1wb3J0IHtCYXNlRXhjZXB0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuXG4vKipcbiAqIENsYXNzIHJlc3BvbnNpYmxlIGZvciBwcm92aWRpbmcgY2hhbmdlIGRldGVjdGlvbiBsb2dpYyBmb3IgY2hhbmdlIGRldGVjdG9yIGNsYXNzZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBDb2RlZ2VuTG9naWNVdGlsIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfbmFtZXM6IENvZGVnZW5OYW1lVXRpbCwgcHJpdmF0ZSBfdXRpbE5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JTdGF0ZU5hbWU6IHN0cmluZykge31cblxuICAvKipcbiAgICogR2VuZXJhdGVzIGEgc3RhdGVtZW50IHdoaWNoIHVwZGF0ZXMgdGhlIGxvY2FsIHZhcmlhYmxlIHJlcHJlc2VudGluZyBgcHJvdG9SZWNgIHdpdGggdGhlIGN1cnJlbnRcbiAgICogdmFsdWUgb2YgdGhlIHJlY29yZC4gVXNlZCBieSBwcm9wZXJ0eSBiaW5kaW5ncy5cbiAgICovXG4gIGdlblByb3BlcnR5QmluZGluZ0V2YWxWYWx1ZShwcm90b1JlYzogUHJvdG9SZWNvcmQpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9nZW5FdmFsVmFsdWUocHJvdG9SZWMsIGlkeCA9PiB0aGlzLl9uYW1lcy5nZXRMb2NhbE5hbWUoaWR4KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX25hbWVzLmdldExvY2Fsc0FjY2Vzc29yTmFtZSgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgYSBzdGF0ZW1lbnQgd2hpY2ggdXBkYXRlcyB0aGUgbG9jYWwgdmFyaWFibGUgcmVwcmVzZW50aW5nIGBwcm90b1JlY2Agd2l0aCB0aGUgY3VycmVudFxuICAgKiB2YWx1ZSBvZiB0aGUgcmVjb3JkLiBVc2VkIGJ5IGV2ZW50IGJpbmRpbmdzLlxuICAgKi9cbiAgZ2VuRXZlbnRCaW5kaW5nRXZhbFZhbHVlKGV2ZW50UmVjb3JkOiBhbnksIHByb3RvUmVjOiBQcm90b1JlY29yZCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2dlbkV2YWxWYWx1ZShwcm90b1JlYywgaWR4ID0+IHRoaXMuX25hbWVzLmdldEV2ZW50TG9jYWxOYW1lKGV2ZW50UmVjb3JkLCBpZHgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJsb2NhbHNcIik7XG4gIH1cblxuICBwcml2YXRlIF9nZW5FdmFsVmFsdWUocHJvdG9SZWM6IFByb3RvUmVjb3JkLCBnZXRMb2NhbE5hbWU6IEZ1bmN0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxzQWNjZXNzb3I6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgdmFyIGNvbnRleHQgPSAocHJvdG9SZWMuY29udGV4dEluZGV4ID09IC0xKSA/XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbmFtZXMuZ2V0RGlyZWN0aXZlTmFtZShwcm90b1JlYy5kaXJlY3RpdmVJbmRleCkgOlxuICAgICAgICAgICAgICAgICAgICAgIGdldExvY2FsTmFtZShwcm90b1JlYy5jb250ZXh0SW5kZXgpO1xuICAgIHZhciBhcmdTdHJpbmcgPSBwcm90b1JlYy5hcmdzLm1hcChhcmcgPT4gZ2V0TG9jYWxOYW1lKGFyZykpLmpvaW4oXCIsIFwiKTtcblxuICAgIHZhciByaHM6IHN0cmluZztcbiAgICBzd2l0Y2ggKHByb3RvUmVjLm1vZGUpIHtcbiAgICAgIGNhc2UgUmVjb3JkVHlwZS5TZWxmOlxuICAgICAgICByaHMgPSBjb250ZXh0O1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBSZWNvcmRUeXBlLkNvbnN0OlxuICAgICAgICByaHMgPSBjb2RpZnkocHJvdG9SZWMuZnVuY09yVmFsdWUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBSZWNvcmRUeXBlLlByb3BlcnR5UmVhZDpcbiAgICAgICAgcmhzID0gYCR7Y29udGV4dH0uJHtwcm90b1JlYy5uYW1lfWA7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIFJlY29yZFR5cGUuU2FmZVByb3BlcnR5OlxuICAgICAgICB2YXIgcmVhZCA9IGAke2NvbnRleHR9LiR7cHJvdG9SZWMubmFtZX1gO1xuICAgICAgICByaHMgPSBgJHt0aGlzLl91dGlsTmFtZX0uaXNWYWx1ZUJsYW5rKCR7Y29udGV4dH0pID8gbnVsbCA6ICR7cmVhZH1gO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBSZWNvcmRUeXBlLlByb3BlcnR5V3JpdGU6XG4gICAgICAgIHJocyA9IGAke2NvbnRleHR9LiR7cHJvdG9SZWMubmFtZX0gPSAke2dldExvY2FsTmFtZShwcm90b1JlYy5hcmdzWzBdKX1gO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBSZWNvcmRUeXBlLkxvY2FsOlxuICAgICAgICByaHMgPSBgJHtsb2NhbHNBY2Nlc3Nvcn0uZ2V0KCR7cmF3U3RyaW5nKHByb3RvUmVjLm5hbWUpfSlgO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBSZWNvcmRUeXBlLkludm9rZU1ldGhvZDpcbiAgICAgICAgcmhzID0gYCR7Y29udGV4dH0uJHtwcm90b1JlYy5uYW1lfSgke2FyZ1N0cmluZ30pYDtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgUmVjb3JkVHlwZS5TYWZlTWV0aG9kSW52b2tlOlxuICAgICAgICB2YXIgaW52b2tlID0gYCR7Y29udGV4dH0uJHtwcm90b1JlYy5uYW1lfSgke2FyZ1N0cmluZ30pYDtcbiAgICAgICAgcmhzID0gYCR7dGhpcy5fdXRpbE5hbWV9LmlzVmFsdWVCbGFuaygke2NvbnRleHR9KSA/IG51bGwgOiAke2ludm9rZX1gO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBSZWNvcmRUeXBlLkludm9rZUNsb3N1cmU6XG4gICAgICAgIHJocyA9IGAke2NvbnRleHR9KCR7YXJnU3RyaW5nfSlgO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBSZWNvcmRUeXBlLlByaW1pdGl2ZU9wOlxuICAgICAgICByaHMgPSBgJHt0aGlzLl91dGlsTmFtZX0uJHtwcm90b1JlYy5uYW1lfSgke2FyZ1N0cmluZ30pYDtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgUmVjb3JkVHlwZS5Db2xsZWN0aW9uTGl0ZXJhbDpcbiAgICAgICAgcmhzID0gYCR7dGhpcy5fdXRpbE5hbWV9LiR7cHJvdG9SZWMubmFtZX0oJHthcmdTdHJpbmd9KWA7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIFJlY29yZFR5cGUuSW50ZXJwb2xhdGU6XG4gICAgICAgIHJocyA9IHRoaXMuX2dlbkludGVycG9sYXRpb24ocHJvdG9SZWMpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBSZWNvcmRUeXBlLktleWVkUmVhZDpcbiAgICAgICAgcmhzID0gYCR7Y29udGV4dH1bJHtnZXRMb2NhbE5hbWUocHJvdG9SZWMuYXJnc1swXSl9XWA7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIFJlY29yZFR5cGUuS2V5ZWRXcml0ZTpcbiAgICAgICAgcmhzID0gYCR7Y29udGV4dH1bJHtnZXRMb2NhbE5hbWUocHJvdG9SZWMuYXJnc1swXSl9XSA9ICR7Z2V0TG9jYWxOYW1lKHByb3RvUmVjLmFyZ3NbMV0pfWA7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIFJlY29yZFR5cGUuQ2hhaW46XG4gICAgICAgIHJocyA9IGAke2dldExvY2FsTmFtZShwcm90b1JlYy5hcmdzW3Byb3RvUmVjLmFyZ3MubGVuZ3RoIC0gMV0pfWA7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihgVW5rbm93biBvcGVyYXRpb24gJHtwcm90b1JlYy5tb2RlfWApO1xuICAgIH1cbiAgICByZXR1cm4gYCR7Z2V0TG9jYWxOYW1lKHByb3RvUmVjLnNlbGZJbmRleCl9ID0gJHtyaHN9O2A7XG4gIH1cblxuICBnZW5Qcm9wZXJ0eUJpbmRpbmdUYXJnZXRzKHByb3BlcnR5QmluZGluZ1RhcmdldHM6IEJpbmRpbmdUYXJnZXRbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZW5EZWJ1Z0luZm86IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgIHZhciBicyA9IHByb3BlcnR5QmluZGluZ1RhcmdldHMubWFwKGIgPT4ge1xuICAgICAgaWYgKGlzQmxhbmsoYikpIHJldHVybiBcIm51bGxcIjtcblxuICAgICAgdmFyIGRlYnVnID0gZ2VuRGVidWdJbmZvID8gY29kaWZ5KGIuZGVidWcpIDogXCJudWxsXCI7XG4gICAgICByZXR1cm4gYCR7dGhpcy5fdXRpbE5hbWV9LmJpbmRpbmdUYXJnZXQoJHtjb2RpZnkoYi5tb2RlKX0sICR7Yi5lbGVtZW50SW5kZXh9LCAke2NvZGlmeShiLm5hbWUpfSwgJHtjb2RpZnkoYi51bml0KX0sICR7ZGVidWd9KWA7XG4gICAgfSk7XG4gICAgcmV0dXJuIGBbJHticy5qb2luKFwiLCBcIil9XWA7XG4gIH1cblxuICBnZW5EaXJlY3RpdmVJbmRpY2VzKGRpcmVjdGl2ZVJlY29yZHM6IERpcmVjdGl2ZVJlY29yZFtdKTogc3RyaW5nIHtcbiAgICB2YXIgYnMgPSBkaXJlY3RpdmVSZWNvcmRzLm1hcChcbiAgICAgICAgYiA9PlxuICAgICAgICAgICAgYCR7dGhpcy5fdXRpbE5hbWV9LmRpcmVjdGl2ZUluZGV4KCR7Yi5kaXJlY3RpdmVJbmRleC5lbGVtZW50SW5kZXh9LCAke2IuZGlyZWN0aXZlSW5kZXguZGlyZWN0aXZlSW5kZXh9KWApO1xuICAgIHJldHVybiBgWyR7YnMuam9pbihcIiwgXCIpfV1gO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfZ2VuSW50ZXJwb2xhdGlvbihwcm90b1JlYzogUHJvdG9SZWNvcmQpOiBzdHJpbmcge1xuICAgIHZhciBpVmFscyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvdG9SZWMuYXJncy5sZW5ndGg7ICsraSkge1xuICAgICAgaVZhbHMucHVzaChjb2RpZnkocHJvdG9SZWMuZml4ZWRBcmdzW2ldKSk7XG4gICAgICBpVmFscy5wdXNoKGAke3RoaXMuX3V0aWxOYW1lfS5zKCR7dGhpcy5fbmFtZXMuZ2V0TG9jYWxOYW1lKHByb3RvUmVjLmFyZ3NbaV0pfSlgKTtcbiAgICB9XG4gICAgaVZhbHMucHVzaChjb2RpZnkocHJvdG9SZWMuZml4ZWRBcmdzW3Byb3RvUmVjLmFyZ3MubGVuZ3RoXSkpO1xuICAgIHJldHVybiBjb21iaW5lR2VuZXJhdGVkU3RyaW5ncyhpVmFscyk7XG4gIH1cblxuICBnZW5IeWRyYXRlRGlyZWN0aXZlcyhkaXJlY3RpdmVSZWNvcmRzOiBEaXJlY3RpdmVSZWNvcmRbXSk6IHN0cmluZyB7XG4gICAgdmFyIHJlcyA9IFtdO1xuICAgIHZhciBvdXRwdXRDb3VudCA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkaXJlY3RpdmVSZWNvcmRzLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgciA9IGRpcmVjdGl2ZVJlY29yZHNbaV07XG4gICAgICB2YXIgZGlyVmFyTmFtZSA9IHRoaXMuX25hbWVzLmdldERpcmVjdGl2ZU5hbWUoci5kaXJlY3RpdmVJbmRleCk7XG4gICAgICByZXMucHVzaChgJHtkaXJWYXJOYW1lfSA9ICR7dGhpcy5fZ2VuUmVhZERpcmVjdGl2ZShpKX07YCk7XG4gICAgICBpZiAoaXNQcmVzZW50KHIub3V0cHV0cykpIHtcbiAgICAgICAgci5vdXRwdXRzLmZvckVhY2gob3V0cHV0ID0+IHtcbiAgICAgICAgICB2YXIgZXZlbnRIYW5kbGVyRXhwciA9IHRoaXMuX2dlbkV2ZW50SGFuZGxlcihyLmRpcmVjdGl2ZUluZGV4LmVsZW1lbnRJbmRleCwgb3V0cHV0WzFdKTtcbiAgICAgICAgICB2YXIgc3RhdGVtZW50U3RhcnQgPVxuICAgICAgICAgICAgICBgdGhpcy5vdXRwdXRTdWJzY3JpcHRpb25zWyR7b3V0cHV0Q291bnQrK31dID0gJHtkaXJWYXJOYW1lfS4ke291dHB1dFswXX1gO1xuICAgICAgICAgIGlmIChJU19EQVJUKSB7XG4gICAgICAgICAgICByZXMucHVzaChgJHtzdGF0ZW1lbnRTdGFydH0ubGlzdGVuKCR7ZXZlbnRIYW5kbGVyRXhwcn0pO2ApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXMucHVzaChgJHtzdGF0ZW1lbnRTdGFydH0uc3Vic2NyaWJlKHtuZXh0OiAke2V2ZW50SGFuZGxlckV4cHJ9fSk7YCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG91dHB1dENvdW50ID4gMCkge1xuICAgICAgdmFyIHN0YXRlbWVudFN0YXJ0ID0gJ3RoaXMub3V0cHV0U3Vic2NyaXB0aW9ucyc7XG4gICAgICBpZiAoSVNfREFSVCkge1xuICAgICAgICByZXMudW5zaGlmdChgJHtzdGF0ZW1lbnRTdGFydH0gPSBuZXcgTGlzdCgke291dHB1dENvdW50fSk7YCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXMudW5zaGlmdChgJHtzdGF0ZW1lbnRTdGFydH0gPSBuZXcgQXJyYXkoJHtvdXRwdXRDb3VudH0pO2ApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzLmpvaW4oXCJcXG5cIik7XG4gIH1cblxuICBnZW5EaXJlY3RpdmVzT25EZXN0cm95KGRpcmVjdGl2ZVJlY29yZHM6IERpcmVjdGl2ZVJlY29yZFtdKTogc3RyaW5nIHtcbiAgICB2YXIgcmVzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkaXJlY3RpdmVSZWNvcmRzLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgciA9IGRpcmVjdGl2ZVJlY29yZHNbaV07XG4gICAgICBpZiAoci5jYWxsT25EZXN0cm95KSB7XG4gICAgICAgIHZhciBkaXJWYXJOYW1lID0gdGhpcy5fbmFtZXMuZ2V0RGlyZWN0aXZlTmFtZShyLmRpcmVjdGl2ZUluZGV4KTtcbiAgICAgICAgcmVzLnB1c2goYCR7ZGlyVmFyTmFtZX0ubmdPbkRlc3Ryb3koKTtgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlcy5qb2luKFwiXFxuXCIpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2VuRXZlbnRIYW5kbGVyKGJvdW5kRWxlbWVudEluZGV4OiBudW1iZXIsIGV2ZW50TmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAoSVNfREFSVCkge1xuICAgICAgcmV0dXJuIGAoZXZlbnQpID0+IHRoaXMuaGFuZGxlRXZlbnQoJyR7ZXZlbnROYW1lfScsICR7Ym91bmRFbGVtZW50SW5kZXh9LCBldmVudClgO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYChmdW5jdGlvbihldmVudCkgeyByZXR1cm4gdGhpcy5oYW5kbGVFdmVudCgnJHtldmVudE5hbWV9JywgJHtib3VuZEVsZW1lbnRJbmRleH0sIGV2ZW50KTsgfSkuYmluZCh0aGlzKWA7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZ2VuUmVhZERpcmVjdGl2ZShpbmRleDogbnVtYmVyKSB7IHJldHVybiBgdGhpcy5nZXREaXJlY3RpdmVGb3IoZGlyZWN0aXZlcywgJHtpbmRleH0pYDsgfVxuXG4gIGdlbkh5ZHJhdGVEZXRlY3RvcnMoZGlyZWN0aXZlUmVjb3JkczogRGlyZWN0aXZlUmVjb3JkW10pOiBzdHJpbmcge1xuICAgIHZhciByZXMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRpcmVjdGl2ZVJlY29yZHMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciByID0gZGlyZWN0aXZlUmVjb3Jkc1tpXTtcbiAgICAgIGlmICghci5pc0RlZmF1bHRDaGFuZ2VEZXRlY3Rpb24oKSkge1xuICAgICAgICByZXMucHVzaChcbiAgICAgICAgICAgIGAke3RoaXMuX25hbWVzLmdldERldGVjdG9yTmFtZShyLmRpcmVjdGl2ZUluZGV4KX0gPSB0aGlzLmdldERldGVjdG9yRm9yKGRpcmVjdGl2ZXMsICR7aX0pO2ApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzLmpvaW4oXCJcXG5cIik7XG4gIH1cblxuICBnZW5Db250ZW50TGlmZWN5Y2xlQ2FsbGJhY2tzKGRpcmVjdGl2ZVJlY29yZHM6IERpcmVjdGl2ZVJlY29yZFtdKTogc3RyaW5nW10ge1xuICAgIHZhciByZXMgPSBbXTtcbiAgICB2YXIgZXEgPSBJU19EQVJUID8gJz09JyA6ICc9PT0nO1xuICAgIC8vIE5PVEUoa2VnbHVuZXEpOiBPcmRlciBpcyBpbXBvcnRhbnQhXG4gICAgZm9yICh2YXIgaSA9IGRpcmVjdGl2ZVJlY29yZHMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIHZhciBkaXIgPSBkaXJlY3RpdmVSZWNvcmRzW2ldO1xuICAgICAgaWYgKGRpci5jYWxsQWZ0ZXJDb250ZW50SW5pdCkge1xuICAgICAgICByZXMucHVzaChcbiAgICAgICAgICAgIGBpZigke3RoaXMuX25hbWVzLmdldFN0YXRlTmFtZSgpfSAke2VxfSAke3RoaXMuX2NoYW5nZURldGVjdG9yU3RhdGVOYW1lfS5OZXZlckNoZWNrZWQpICR7dGhpcy5fbmFtZXMuZ2V0RGlyZWN0aXZlTmFtZShkaXIuZGlyZWN0aXZlSW5kZXgpfS5uZ0FmdGVyQ29udGVudEluaXQoKTtgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGRpci5jYWxsQWZ0ZXJDb250ZW50Q2hlY2tlZCkge1xuICAgICAgICByZXMucHVzaChgJHt0aGlzLl9uYW1lcy5nZXREaXJlY3RpdmVOYW1lKGRpci5kaXJlY3RpdmVJbmRleCl9Lm5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpO2ApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgZ2VuVmlld0xpZmVjeWNsZUNhbGxiYWNrcyhkaXJlY3RpdmVSZWNvcmRzOiBEaXJlY3RpdmVSZWNvcmRbXSk6IHN0cmluZ1tdIHtcbiAgICB2YXIgcmVzID0gW107XG4gICAgdmFyIGVxID0gSVNfREFSVCA/ICc9PScgOiAnPT09JztcbiAgICAvLyBOT1RFKGtlZ2x1bmVxKTogT3JkZXIgaXMgaW1wb3J0YW50IVxuICAgIGZvciAodmFyIGkgPSBkaXJlY3RpdmVSZWNvcmRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICB2YXIgZGlyID0gZGlyZWN0aXZlUmVjb3Jkc1tpXTtcbiAgICAgIGlmIChkaXIuY2FsbEFmdGVyVmlld0luaXQpIHtcbiAgICAgICAgcmVzLnB1c2goXG4gICAgICAgICAgICBgaWYoJHt0aGlzLl9uYW1lcy5nZXRTdGF0ZU5hbWUoKX0gJHtlcX0gJHt0aGlzLl9jaGFuZ2VEZXRlY3RvclN0YXRlTmFtZX0uTmV2ZXJDaGVja2VkKSAke3RoaXMuX25hbWVzLmdldERpcmVjdGl2ZU5hbWUoZGlyLmRpcmVjdGl2ZUluZGV4KX0ubmdBZnRlclZpZXdJbml0KCk7YCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChkaXIuY2FsbEFmdGVyVmlld0NoZWNrZWQpIHtcbiAgICAgICAgcmVzLnB1c2goYCR7dGhpcy5fbmFtZXMuZ2V0RGlyZWN0aXZlTmFtZShkaXIuZGlyZWN0aXZlSW5kZXgpfS5uZ0FmdGVyVmlld0NoZWNrZWQoKTtgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxufVxuIl19