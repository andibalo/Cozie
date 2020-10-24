import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { ImagePickerComponent } from "./pickers/image-picker/image-picker.component";

@NgModule({
  declarations: [ImagePickerComponent],
  imports: [CommonModule, IonicModule],
  //What we put in exports array is comopnents that can be used in any compo or module that imports this shared module.ts
  exports: [ImagePickerComponent],
  entryComponents: [],
})
export class SharedModule {}
