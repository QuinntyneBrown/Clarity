import { ControlValueAccessor } from "@angular/forms";
import { Destroyable } from "./destroyable";

export class BaseControl extends Destroyable implements ControlValueAccessor {
    writeValue(obj: any): void {

    }
    
    registerOnChange(fn: any): void {

    }
    
    registerOnTouched(fn: any): void {

    }

    setDisabledState?(isDisabled: boolean): void {

    }
}