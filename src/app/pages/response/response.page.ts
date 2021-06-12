import { Component, OnInit } from "@angular/core";
import { UtilsService } from "src/app/services/utils.service";
import { ApiService } from "src/app/services/api.service";
import { ActivatedRoute } from "@angular/router";
import { NavController, ActionSheetController } from "@ionic/angular";
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

@Component({
  selector: "app-response",
  templateUrl: "./response.page.html",
  styleUrls: ["./response.page.scss"],
})
export class ResponsePage implements OnInit {
  order = {};
  conversation: any;
  order_id: any;
  message = "";
  timerId: any;
  status: any;
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
    private actionSheetController: ActionSheetController,
    private imagePicker: ImagePicker,
    private mediaCapture: MediaCapture
  ) {}

  ngOnInit() {
    this.order = this.data.order;
    this.order_id = this.order["id"];
    console.log(this.order_id);

    this.loadData();
  }

  goBack() {
    this.nav.back();
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
          .get(api_urls.disputeAct + this.order_id + "response")
          .toPromise()
      )["data"];
      console.log(this.conversation);

      this.utils.dismissLoading();
      // repeat with the interval of 2 seconds
      this.timerId = setInterval(() => this.refreshMessages(), 5000);
    } catch (error) {
      this.utils.dismissLoading();
      console.log(error);
    }
  }

  async refreshMessages() {
    try {
      console.log("loading new messages");
      let res = await this.api
        .get(api_urls.disputeAct + this.order_id + "response")
        .toPromise();
      console.log(res);

      this.conversation = res.data;
    } catch (error) {
      console.log(error);
    }
  }

  async sendMessage() {
    let responseStatus = 2;
    console.log(this.status);

    if (this.status) {
      responseStatus = 5;
    }

    this.utils.presentLoading("Sending...");

    try {
      const formData = new FormData();

      formData.append("reply", this.message);
      formData.append("status", `${responseStatus}`);
      if (this.fileBlob) {
        formData.append("photo", this.fileBlob, this.fileName);
      }

      let res = await this.api
        .post(api_urls.disputeAct + this.order_id + "/response ", formData)
        .toPromise();
      console.log(res);
      this.conversation = res.data;

      this.utils.dismissLoading();
      this.message = "";
      this.fileBlob = null;
      this.fileName = null;

      if (res.data.closed && responseStatus == 5) {
        this.nav.pop();
      }
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
        this.utils.presentToast("Something went wrong. Try again");
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
            this.captureImage();
          },
        },
        {
          text: "Library",
          handler: () => {
            this.pickImages();
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
    this.imagePicker.getPictures({}).then((results) => {
      if (results.length > 0) {
        this.saveAsBlob(results[0]);
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
          this.saveAsBlob(data[0].fullPath);
        }
      },
      (err: CaptureError) => console.error(err)
    );
  }

  async saveAsBlob(path) {
    const name = path.substr(path.lastIndexOf("/") + 1);
    const filePath = path.substr(0, path.lastIndexOf("/") + 1);

    console.log({ name, filePath });

    const buffer = await this.file.readAsArrayBuffer(filePath, name);
    this.fileBlob = new Blob([buffer], { type: "image/jpg" });
    this.fileName = name;

    console.log(this.fileBlob);
  }

  removeFile() {
    this.fileName = null;
    this.fileBlob = null;
  }
}
