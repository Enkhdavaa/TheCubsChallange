import { SpriteFlipBook } from "./spriteFlipBook.ts";

export class SpriteAnimationSelector {
  private spriteFlipBooks: SpriteFlipBook[] = [];
  private currentSelected: SpriteFlipBook;

  constructor(
    spriteFlipBooks: SpriteFlipBook[],
    defaultFlipbookIndex: number = 0
  ) {
    this.spriteFlipBooks = spriteFlipBooks;
    this.currentSelected = spriteFlipBooks[defaultFlipbookIndex];
    this.selectSpriteIndex(defaultFlipbookIndex);
  }

  public selectSpriteIndex(spriteIndex: number) {
    this.spriteFlipBooks.forEach((spriteFlipBook, index) => {
      if (index === spriteIndex) {
        this.currentSelected = spriteFlipBook;
        spriteFlipBook.show();
      } else spriteFlipBook.hide();
    });
  }

  public update() {
    this.currentSelected.update();
  }
}
