export abstract class Attachment {
  id: string;
  type: string;
  addedAt: Date;

  constructor(id: string, type: string) {
    this.id = id;
    this.type = type;
    this.addedAt = new Date();
  }

  abstract toJson(): object;
}
export class FileAttachment extends Attachment {
  fileName: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: Date;

  constructor(
    id: string,
    fileName: string,
    fileUrl: string,
    uploadedBy: string,
    uploadedAt: Date,
    addedAt: Date
  ) {
    super(id, AttachmentType.link.toString());
    this.fileName = fileName;
    this.fileUrl = fileUrl;
    this.uploadedBy = uploadedBy;
    this.uploadedAt = uploadedAt;
  }

  toJson(): object {
    return {
      type: this.type,
      fileName: this.fileName,
      fileUrl: this.fileUrl,
      uploadedBy: this.uploadedBy,
      uploadedAt: this.uploadedAt,
      addedAt: this.addedAt,
    };
  }
}
export class LinkAttachment extends Attachment {
  title: string;
  url: string;

  constructor(id: string, title: string, url: string, addedAt: Date) {
    super(id, AttachmentType.link.toString());
    this.title = title;
    this.url = url;
  }

  toJson(): object {
    return {
      id: this.id,
      type: this.type,
      title: this.title,
      url: this.url,
      addedAt: this.addedAt,
    };
  }
}
export class CardAttachment extends Attachment {
  cardTitle: string;
  boardName: string;
  cardLink: string;

  constructor(
    id: string,
    cardTitle: string,
    boardName: string,
    cardLink: string,
    addedAt: Date
  ) {
    super(id, AttachmentType.card.toString());
    this.cardTitle = cardTitle;
    this.boardName = boardName;
    this.cardLink = cardLink;
  }

  toJson(): object {
    return {
      id: this.id,
      type: this.type,
      cardTitle: this.cardTitle,
      boardName: this.boardName,
      cardLink: this.cardLink,
      addedAt: this.addedAt,
    };
  }
}
export enum AttachmentType {
  link,
  card,
  file,
}
