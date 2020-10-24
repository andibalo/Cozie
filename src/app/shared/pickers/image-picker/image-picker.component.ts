import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import {
  Plugins,
  Capacitor,
  CameraSource,
  CameraResultType,
} from "@capacitor/core";
import { Platform } from "@ionic/angular";

@Component({
  selector: "app-image-picker",
  templateUrl: "./image-picker.component.html",
  styleUrls: ["./image-picker.component.scss"],
})
export class ImagePickerComponent implements OnInit {
  @ViewChild("filePicker") filePickerRef: ElementRef<HTMLInputElement>;
  //OUTPUT is used to emit custom event that a html component can listen to and recieve the emitted data
  @Output() imagePick = new EventEmitter<string | File>(); //the event emit a string which is the base64 string of the img
  @Input() showPreview = false;
  selectedImage: string;
  usePicker = false;
  constructor(private platform: Platform) {}

  ngOnInit() {
    if (this.platform.is("mobile") && !this.platform.is("hybrid")) {
      this.usePicker = true;
    }
  }

  onFilePick(event: Event) {
    //If event target is not ocnverted to htmlInputElement then typescript doesn know if the event.target obj
    //has files property and mark it as error
    const pickedImage = (event.target as HTMLInputElement).files[0];

    //In order to preview an images from local computer we need to convert it to b64 string with filereader class
    const fr = new FileReader();

    //With fr.onload it will run whenever fr finsihes an async operation in this case readataasurl below
    fr.onload = () => {
      //FILEPICKER IN COMPUTER GETS IMAGE AS FILE
      //Convert image to b64 string to preview
      const data = fr.result.toString();

      this.selectedImage = data;

      //But we need to convert the b64 string to file in order to uplaod it to database.
      //WE NEED to convert the b64 string from camera plugin to file bfr uploading to database
      this.imagePick.emit(pickedImage);
    };

    //readDataasURL is an async operation hence to get the data we need to define fr.onload
    fr.readAsDataURL(pickedImage);
  }

  async onPickImage() {
    if (!Capacitor.isPluginAvailable("camera")) {
      this.filePickerRef.nativeElement.click();
      return;
    }

    try {
      const image = await Plugins.Camera.getPhoto({
        quality: 50, //quality of image ( value is 1-100 )
        source: CameraSource.Prompt, //ask if user can use gallery/camera or both
        correctOrientation: true,
        width: 600,
        resultType: CameraResultType.Base64, //base64 is converted to string that is able to be converted to image again
      });

      //CAMERA PLUGIN FROM CAPACITOR GETS IMAGE AS B64 String
      this.selectedImage = image.base64String;
      this.imagePick.emit(image.base64String);
    } catch (error) {
      this.filePickerRef.nativeElement.click();
      return false;
    }
  }
}
