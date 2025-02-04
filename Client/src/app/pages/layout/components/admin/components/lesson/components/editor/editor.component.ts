import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import Quill from 'quill';
import 'quill-emoji/dist/quill-emoji.js';
import ImageResize from 'quill-image-resize-module';
import { ImageDrop } from 'quill-image-drop-module';
import { ImageHandler, Options } from 'ngx-quill-upload';
import { ContentChange, EditorChangeSelection } from 'ngx-quill';
import { CloudStorageService } from 'src/app/services/cloud-storage/cloud-storage.service';
Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/imageDrop', ImageDrop);
Quill.register('modules/imageHandler', ImageHandler);

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.less'],
})
export class EditorComponent implements OnInit {
  content: any;
  @Output('save') saveEvent: EventEmitter<string> = new EventEmitter();
  @Input('content')
  set contentInput(contentVal: string | undefined) {
    if (contentVal == undefined) return;
    console.log('raw', JSON.parse(contentVal));
    this.content = JSON.parse(contentVal);
  }
  @Input('isPreview') isPreview!: boolean;
  @Input('isSave')
  set isSaveInput(isSave: boolean) {
    if (isSave) {
      this.saveEvent.emit(JSON.stringify(this.content));
    }
  }
  @Input('lessonId') lessonId: string | undefined;
  ngOnInit(): void {}

  editor_modules = {};
  constructor(private cloudService: CloudStorageService) {
    this.editor_modules = {
      'emoji-shortname': true,
      'emoji-textarea': false,
      'emoji-toolbar': true,
      toolbar: [
        ['emoji'],
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['blockquote', 'code-block'],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ direction: 'rtl' }], // text direction
        [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ font: [] }],
        [{ align: [] }],
        ['clean'], // remove formatting button
        ['link', 'image', 'video'],
      ],
      imageHandler: {
        upload: (file) => {
          return new Promise(async (resolve, reject) => {
            if (
              file.type === 'image/jpeg' ||
              file.type === 'image/png' ||
              file.type === 'image/jpg'
            ) {
              // File types supported for image
              if (file.size < 1000000) {
                // Customize file size as per requirement

                // Sample API Call
                const uploadData = new FormData();
                uploadData.append('file', file, file.name);

                let result = await this.cloudService.upLoadLessonImage(
                  file,
                  this.lessonId != undefined ? this.lessonId : ''
                );
                if (typeof result === 'object') {
                  reject('upload failed');
                } else {
                  console.log('File available at', result);
                  resolve(result);
                }
              } else {
                reject('Size too large');
                // Handle Image size large logic
              }
            } else {
              reject('Unsupported type');
              // Handle Unsupported type logic
            }
          });
        },
        accepts: ['png', 'jpg', 'jpeg', 'jfif'], // Extensions to allow for images (Optional) | Default - ['jpg', 'jpeg', 'png']
      } as Options,
      imageResize: true,
      imageDrop: true,
    };
  }

  blured = false;
  focused = false;

  created(event: any) {
    // tslint:disable-next-line:no-console
    console.log('editor-created', event);
  }

  changedContent(event: ContentChange | EditorChangeSelection) {
    // tslint:disable-next-line:no-console
    console.log('editor-change', event);
  }

  focus($event: any) {
    // tslint:disable-next-line:no-console
    // console.log('focus', $event);
    this.focused = true;
    this.blured = false;
  }

  blur($event: any) {
    // tslint:disable-next-line:no-console
    // console.log('blur', $event);
    this.focused = false;
    this.blured = true;
  }
}
