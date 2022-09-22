export default class NotificationMessage {
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

  show (div = {}) {
    document.querySelector('.notification')?.remove()

    if (div instanceof HTMLElement) {
      div.append(this.element);
    } else {
      document.body.append(this.element);
    }

    setTimeout(() => {
      this.remove()
    }, this.duration);
  }

  remove () {
    this.element?.remove()
  }

  destroy () {
    this.remove()
    this.element = null
  }
}
