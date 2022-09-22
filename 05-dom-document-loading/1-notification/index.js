export default class NotificationMessage {
  static activeMessage;
  element

  constructor (message = '', {duration = 2000, type = 'success'} = {}) {
    this.message = message
    this.duration = duration
    this.type = type

    this.render();
  }

  render () {
    if (this.message.length !== 0) {
      const element = document.createElement("div");
      element.innerHTML = this.template;
      this.element = element.firstElementChild;
    }
  }


  get template() {
    return `
    <div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
      <div class="timer"></div>
      <div class="inner-wrapper">
        <div class="notification-header">${this.type}</div>
        <div class="notification-body">
          ${this.message}
        </div>
      </div>
    </div>
    `;
  }

  show (parent = document.body) {
    if (NotificationMessage.activeMessage) {
      NotificationMessage.activeMessage.remove()
    } 
    parent.append(this.element);
    
    setTimeout(() => {
      this.remove()
    }, this.duration);

    NotificationMessage.activeMessage = this;
  }

  remove () {
    this.element?.remove()
  }

  destroy () {
    this.remove()
    this.element = null
    NotificationMessage.activeMessage = null;
  }
}
