import { Component, OnInit } from "@angular/core";
import { UtilsService } from "src/app/services/utils.service";
import { ApiService } from "src/app/services/api.service";
import { AppDataService } from "src/app/services/app-data.service";
import { api_urls, environment } from "src/environments/environment";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";
import { File, FileEntry } from "@ionic-native/file/ngx";
import { ImagePicker } from "@ionic-native/image-picker/ngx";
import {
  MediaCapture,
  MediaFile,
  CaptureError,
  CaptureImageOptions,
} from "@ionic-native/media-capture/ngx";
import { ActionSheetController, NavController, Platform } from "@ionic/angular";
import { CameraResultType, CameraSource, Plugins } from "@capacitor/core";

const { Camera } = Plugins;

@Component({
  selector: "app-contact-seller",
  templateUrl: "./contact-seller.page.html",
  styleUrls: ["./contact-seller.page.scss"],
})
export class ContactSellerPage implements OnInit {
  product: any;
  conversation: any;
  product_id: any;
  message = "";
  timerId: any;


  fileBlob: any;
  fileName: any;

  constructor(
    private platform: Platform,
    private nav: NavController,
    private utils: UtilsService,
    private api: ApiService,
    private data: AppDataService,
    private transfer: FileTransfer,
    private file: File,
    private actionSheetController: ActionSheetController,
    private imagePicker: ImagePicker,
    private mediaCapture: MediaCapture
  ) {
    this.product = {};
    // this.platform.backButton.subscribe(() => {
    //   this.goBack()  
    // });
  //   this.platform.backButton.subscribe(() => {
  //     utils.backButtonPress(window.location.pathname);
  //  });
  }

  ngOnInit() {
    this.product = this.data.product;
    this.product_id = this.product["id"];
    console.log(this.product);

    this.loadData();
  }

  ionViewWillLeave() {
    console.log("finishing inerval");
    clearInterval(this.timerId);
  }

  async loadData() {
    this.utils.presentLoading("Please wait...");

    try {
      this.conversation = (
        await this.api
          .get(api_urls.shop + this.product["shop"].id + "/contact")
          .toPromise()
      )["data"];
      console.log(this.conversation);

      this.utils.dismissLoading();

      // repeat with the interval of 2 seconds
      this.timerId = setInterval(() => this.refreshMessages(), 2000);
    } catch (error) {
      this.utils.dismissLoading();
      console.log(error);
      this.utils.presentToast(error.error.message);
    }
  }

  async refreshMessages() {
    try {
      console.log("loading new messages");

      this.conversation = (
        await this.api
          .get(api_urls.shop + this.product["shop"].id + "/contact")
          .toPromise()
      )["data"];
    } catch (error) {
      console.log(error);
    }
  }

  async sendMessage() {
    this.utils.presentLoading("Sending...");

    try {
      let res = await this.api
        .post(api_urls.shop + this.product["shop"].id + "/contact", {
          listing_id: this.product_id,
          message: this.message,
        })
        .toPromise();
      console.log(res);
      console.log(this.conversation);
      
      // this.conversation = res.data;

      this.utils.dismissLoading();
      this.message = "";
    } catch (error) {
      this.utils.dismissLoading();
      console.log(error);
      this.utils.presentToast(error.error.message);
      this.message = "";
    }
  }

  async downloadfile(id) {
    try {
      this.utils.presentLoading("");
      let res = await this.api.get(`attachment/${id}/download`).toPromise();
      console.log(res);

      this.utils.dismissLoading();
    } catch (error) {
      console.log();

      this.utils.dismissLoading();
    }

    // window.open(environment.BASE_URL + `api/attachment/${id}/download`,'_system', 'location=yes');
  }

  download(file) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    const url = environment.BASE_URL + `attachment/${file.id}/download`;

    fileTransfer.download(url, this.file.dataDirectory + file.name).then(
      (entry) => {
        console.log("download complete: " + entry.toURL());
      },
      (error) => {
        // handle error
      }
    );
  }

  //manages images

  async selectMedia() {
    const actionSheet = await this.actionSheetController.create({
      header: "Options",
      buttons: [
        {
          text: "Camera",
          handler: () => {
            this.addImage(CameraSource.Camera);
          },
        },
        {
          text: "Library",
          handler: () => {
            this.addImage(CameraSource.Photos);
          },
        },
        {
          text: "Cancel",
          role: "cancel",
        },
      ],
    });
    await actionSheet.present();
  }

  pickImages(source: CameraSource) {
    this.imagePicker
      .getPictures({ maximumImagesCount: 1, quality: 80 })
      .then((results) => {
        if (results.length > 0) {
          //this.copyFileToLocalDir(results[0]);
          // this.saveAsBlob(results[0]);
          console.log(results);
        }
      });

    // If you get problems on Android, try to ask for Permission first
    // this.imagePicker.requestReadPermission().then(result => {
    //   console.log('requestReadPermission: ', result);
    //   this.selectMultiple();
    // });
  }

  async addImage(source: CameraSource) {
    const imageFile = await Camera.getPhoto({
      quality: 60,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source
    });

    console.log("image: ", imageFile.base64String);   
    this.saveAsBlob(imageFile.base64String); 
  
  }

  b64ToBlob(b64Data, contentType = '', sliceSize = 512) {
    let byteCharacters = atob(b64Data); //decode base64
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    let blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  async saveAsBlob(path) {
    
    console.log('sending file...');
    
    try {
      let res = await this.api
        .post(api_urls.shop + this.product["shop"].id + "/contact", {
          listing_id: this.product_id,
          message: this.message,
          photo: path
        })
        .toPromise();

        console.log(res);
        console.log('file send...');

        // this.removeFile();

    } catch (error) {
      this.utils.dismissLoading();
      console.log(error);
      this.utils.presentToast(error.error.message);
      this.message = "";
      console.log('file not send...');
    }

    // this.fileName = name;
    // console.log('file send...');/

  }


  goBack() {
    this.nav.back();
  }



  removeFile() {
    this.fileName = null;
    this.fileBlob = null;
  }
}
