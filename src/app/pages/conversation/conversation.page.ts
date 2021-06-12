import { Component, OnInit } from "@angular/core";
import { UtilsService } from "src/app/services/utils.service";
import { ApiService } from "src/app/services/api.service";
import { ActivatedRoute } from "@angular/router";
import { NavController, ActionSheetController, Platform } from "@ionic/angular";
import { AppDataService } from "src/app/services/app-data.service";
import { api_urls } from "src/environments/environment";
import { environment } from "src/environments/environment";
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
} from "@ionic-native/media-capture/ngx";
import { CameraResultType, CameraSource, Plugins } from "@capacitor/core";

const { Camera } = Plugins;

@Component({
  selector: "app-conversation",
  templateUrl: "./conversation.page.html",
  styleUrls: ["./conversation.page.scss"],
})
export class ConversationPage implements OnInit {
  order = {};
  conversation: any;
  order_id: any;
  message = "";
  timerId: any;
  fileBlob: any;
  fileName: any;

  constructor(
    private utils: UtilsService,
    private api: ApiService,
    private route: ActivatedRoute,
    private nav: NavController,
    private data: AppDataService,
    private transfer: FileTransfer,
    private file: File,
    private platform: Platform,
    private actionSheetController: ActionSheetController,
    private imagePicker: ImagePicker,
    private mediaCapture: MediaCapture
  ) {
  //   this.platform.backButton.subscribe(() => {
  //     utils.backButtonPress(window.location.pathname);
  //  });
  }

  ngOnInit() {
    this.order = this.data.order;
    this.order_id = this.order["id"];
    console.log(this.order_id);

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
          .get(api_urls.order + this.order_id + api_urls.orderConv)
          .toPromise()
      )["data"];
      console.log(this.conversation);

      this.utils.dismissLoading();
      // repeat with the interval of 2 seconds
      this.timerId = setInterval(() => this.refreshMessages(), 2000);
    } catch (error) {
      this.utils.dismissLoading();
      console.log(error);
    }
  }

  async refreshMessages() {
    try {
      console.log("loading new messages");

      this.conversation = (
        await this.api
          .get(api_urls.order + this.order_id + api_urls.orderConv)
          .toPromise()
      )["data"];
    } catch (error) {
      console.log(error);
    }
  }

  async sendMessage() {
    this.utils.presentLoading("Sending...");

    try {
      console.log("form data working dude");

      // const formData = new FormData();
      // formData.append("message", this.message);
      // if (this.fileBlob) {
      //   formData.append("photo", this.fileBlob, this.fileName);
      // }

      // console.log(formData);

      let res = await this.api
        .post(api_urls.order + this.order_id + api_urls.orderConv, {
          message: this.message
        })
        .toPromise();
      console.log(res);
      // this.conversation = res.data;

      this.utils.dismissLoading();
      this.message = "";
      this.fileBlob = null;
      this.fileName = null;
    } catch (error) {
      this.utils.dismissLoading();
      console.log(error);
      this.message = "";
      this.fileBlob = null;
      this.fileName = null;
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
        this.utils.presentToast("download complete: " + entry.toURL());
      },
      (error) => {
        // handle error
        this.utils.presentToast("something went wrong. Try again.");
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

  pickImages() {
    this.imagePicker
      .getPictures({ maximumImagesCount: 1, quality: 80 })
      .then((results) => {
        if (results.length > 0) {
          //this.copyFileToLocalDir(results[0]);
          this.saveAsBlob(results[0]);
          console.log(results);
        }
      });

    // If you get problems on Android, try to ask for Permission first
    // this.imagePicker.requestReadPermission().then(result => {
    //   console.log('requestReadPermission: ', result);
    //   this.selectMultiple();
    // });
  }

  captureImage() {
    this.mediaCapture.captureImage().then(
      (data: MediaFile[]) => {
        if (data.length > 0) {
          // this.copyFileToLocalDir(data[0].fullPath);
          this.saveAsBlob(data[0].fullPath);

          console.log(data);
        }
      },
      (err: CaptureError) => console.error(err)
    );
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
    // const blobData = this.b64ToBlob(imageFile.base64String, 'image/')

    // console.log('bloob Data: ' ,blobData);
    

  }

  async saveAsBlob(path) {
   


    try {
      let res = await this.api.post(api_urls.order + this.order_id + api_urls.orderConv, {
        message: this.message,
        photo: path
      }).toPromise();

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
  }

  removeFile() {
    this.fileName = null;
    this.fileBlob = null;
  }

  goBack() {
    this.nav.back();
  }
}
