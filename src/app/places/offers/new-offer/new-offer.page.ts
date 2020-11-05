import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LoadingController } from "@ionic/angular";
import { switchMap } from "rxjs/operators";
import { PlacesService } from "../../places.service";

function base64toBlob(base64Data, contentType) {
  contentType = contentType || "";
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

@Component({
  selector: "app-new-offer",
  templateUrl: "./new-offer.page.html",
  styleUrls: ["./new-offer.page.scss"],
})
export class NewOfferPage implements OnInit {
  form: FormGroup;
  constructor(
    private placeService: PlacesService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      }),
      description: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required, Validators.maxLength(180)],
      }),
      price: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required, Validators.min(1)],
      }),
      dateFrom: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      }),
      dateTo: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      }),
      image: new FormControl(null),
    });
  }

  onImagePicked(imageData: string | File) {
    let imageFile;
    if (typeof imageData === "string") {
      //IF THE IMAGE DATA IS IN B64 we need to convert it to file before storing in database
      //THE BASE B64 string comes from the CAMERA capacitor plugin

      try {
        imageFile = base64toBlob(
          //THE B64 string image data that comes from the camera plugin comes with this prefix so we need to delete it
          //in order for the function to work
          imageData.replace("data:image/jpeg;base64,", ""),
          "image/jpeg"
        );
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = imageData;
    }

    this.form.patchValue({ image: imageFile });
  }

  async onCreateOffer() {
    if (!this.form.valid || !this.form.get("image").value) {
      return;
    }
    //console.log(this.form);

    const loadingEle = await this.loadingCtrl.create({
      message: "Creating place",
    });

    loadingEle.present();
    this.placeService
      .uploadImage(this.form.get("image").value)
      .pipe(
        switchMap((uploadRes) => {
          return this.placeService.addPlace(
            this.form.value.title,
            this.form.value.description,
            this.form.value.price,
            new Date(this.form.value.dateFrom),
            new Date(this.form.value.dateTo),
            uploadRes.imageUrl
          );
        })
      )
      .subscribe((places) => {
        //by subsribing we know that the code that adds the data finsihes and then we can dismiss
        //the loading element
        loadingEle.dismiss();
        this.form.reset();
        this.router.navigateByUrl("/places/offers");
      });
  }
}
