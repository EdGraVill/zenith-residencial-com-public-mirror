import CommonError from '@/CommonError';
import type { FileType, ImageType } from '@/db/commonSchemas';

export class DocumentNotFound extends CommonError {
  constructor(id: string) {
    super('Document not found');

    this.name = 'DocumentNotFound';

    this.log(`Document with id ${id} not found`, this);
  }
}

export class CommonDbError extends CommonError {
  constructor(originalError: Error) {
    super(originalError.message);

    this.name = `CommonDbError:${originalError.name}`;
    this.stack = originalError.stack;
    this.cause = originalError;

    this.log(`Common database error: ${originalError.message}`, this);
  }
}

export class FileNotFound extends CommonError {
  constructor(fileId: FileType['id']) {
    super('File not found');

    this.name = 'FileNotFound';

    this.log(`File with id ${fileId} not found`, this);
  }
}

export class ImageNotFound extends CommonError {
  constructor(imageId: ImageType['id']) {
    super('Image not found');

    this.name = 'ImageNotFound';

    this.log(`Image with id ${imageId} not found`, this);
  }
}
