type AnimationCallback = (animationName: string) => void;

export class SpriteAnimationEvent {
  private static instance: SpriteAnimationEvent;
  private subscribers: AnimationCallback[] = [];

  private constructor() {}

  static getInstance() {
    if (!SpriteAnimationEvent.instance) {
      SpriteAnimationEvent.instance = new SpriteAnimationEvent();
    }
    return SpriteAnimationEvent.instance;
  }

  public subscribe(callback: AnimationCallback) {
    this.subscribers.push(callback);
  }

  public unsubscribe(callback: AnimationCallback) {
    this.subscribers = this.subscribers.filter(
      (subscriber) => subscriber !== callback
    );
  }

  public publish(animationName: string) {
    this.subscribers.forEach((subscriber) => subscriber(animationName));
  }
}
