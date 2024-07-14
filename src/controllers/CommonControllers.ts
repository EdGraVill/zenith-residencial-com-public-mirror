import type { CommonDocumentType, CommonIdType, FileType, ImageType } from '@/db/commonSchemas';
import { CommonDbError, FileNotFound, ImageNotFound } from './commonErrors';
import { produce } from 'immer';
import { connectDB } from '@/db/util';
import assert from '@/utils/assert';
import type { NestedKeyOf, NestedOmit, ValueOfNestedKey } from '@/utils/utilTypes';
import { objectFromDotPath } from '@/utils/objectUtils';

export class CommonController<T extends { id: CommonIdType }> {
  protected static async dbManipulation<T>(tryFn: () => Promise<T>): Promise<T> {
    await connectDB();

    try {
      return tryFn();
    } catch (error) {
      throw new CommonDbError(error as Error);
    }
  }

  public readonly id = this.document.id as T['id'];

  constructor(protected readonly document: CommonDocumentType<T>) {}

  protected async dbManipulation<T>(tryFn: () => Promise<T>): Promise<T> {
    await connectDB();

    try {
      return tryFn();
    } catch (error) {
      throw new CommonDbError(error as Error);
    }
  }

  protected update(newValues: NestedOmit<Partial<T>, 'id' | '_id' | 'timestamps'>) {
    const entries = Object.entries(newValues);

    for (const [key, value] of entries) {
      this.setValue(key as NestedKeyOf<NestedOmit<T, 'id' | '_id' | 'timestamps'>>, value);
    }

    return this.save();
  }

  public getValue<K extends keyof T>(key: K): T[K] {
    return this.document.get(key);
  }

  public setValue<
    K extends NestedKeyOf<NestedOmit<T, 'id' | '_id' | 'timestamps'>>,
    // @ts-expect-error Type 'ValueOfNestedKey<NestedOmit<T, "id" | "_id" | "timestamps">, K>' is not assignable to type 'T[K]'.
    V extends ValueOfNestedKey<NestedOmit<T, 'id' | '_id'>, K>,
  >(key: K, value: V) {
    if (key.includes('.')) {
      const parentKey = key.split('.')[0];
      const object = objectFromDotPath({ [key]: value });

      this.document.set(parentKey, object);
    }

    this.document.set(key as string, value);
  }

  public save() {
    return this.dbManipulation(() => this.document.save());
  }

  public delete() {
    return this.dbManipulation(() => this.document.deleteOne());
  }

  public toJSON() {
    return this.document.toJSON();
  }
}

export class CommonControllerWithFilesAndImages<
  T extends { files: FileType[]; id: CommonIdType; images: ImageType[] },
> extends CommonController<T> {
  protected addFile(file: FileType) {
    const files = this.document.get('files');

    const newFiles = produce(files, (draft: FileType[]) => {
      draft.push(file);

      return draft;
    });

    this.document.set('files', newFiles);

    return this.dbManipulation(() => this.document.save());
  }

  protected getFile(fileId: FileType['id']) {
    const files = this.document.get('files');

    const file = files.find((file) => file.id === fileId);

    assert(file, () => new FileNotFound(fileId));

    return file;
  }

  protected deleteFile(fileId: FileType['id']) {
    const files = this.document.get('files');

    const newFiles = files.filter((file) => file.id !== fileId);

    this.document.set('files', newFiles);

    return this.dbManipulation(() => this.document.save());
  }

  protected addImage(image: ImageType) {
    const images = this.document.get('images');

    const newImages = produce(images, (draft: ImageType[]) => {
      draft.push(image);

      return draft;
    });

    this.document.set('images', newImages);

    return this.dbManipulation(() => this.document.save());
  }

  protected getImage(imageId: ImageType['id']) {
    const images = this.document.get('images');

    const image = images.find((image) => image.id === imageId);

    assert(image, () => new ImageNotFound(imageId));

    return image;
  }

  protected deleteImage(imageId: ImageType['id']) {
    const images = this.document.get('images');

    const newImages = images.filter((image) => image.id !== imageId);

    this.document.set('images', newImages);

    return this.dbManipulation(() => this.document.save());
  }
}
