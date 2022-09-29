class Tooltip {
  static prevTooltip
  element

  constructor() {
    Tooltip.prevTooltip?.remove()
    this.render()
    Tooltip.prevTooltip = this;
  }

  initialize () {
    document.addEventListener('pointerover', (event) => this.tooltipOver(event), {bubbles: true})
    document.addEventListener('pointerout', (event) => this.tooltipOut(event), {bubbles: true})
  }

  render () {
    const element = document.createElement("div");
    element.innerHTML = this.template;
    this.element = element.firstElementChild;
  }

  get template () {
    return `
      <div class="tooltip"></div>
    `
  }

  tooltipOver (event) {
    if (!event.target.dataset.tooltip) return
    
    document.body.append(this.element);
    this.element.innerHTML = event.target.dataset.tooltip
    event.target.addEventListener('pointermove', event => this.tooltipMove(event))
  }

  tooltipOut (event) {
    this.element.remove()
    event.target.removeEventListener('pointermove', event => this.tooltipMove(event))
  }

  tooltipMove (event) {
    this.element.style.left = event.pageX + 10 + 'px';
    this.element.style.top = event.pageY + 5 + 'px'
  }

  remove() {
    this.element.remove()
  }

  destroy() {
    this.remove()
    document.removeEventListener("pointerover", (event) => this.tooltipOver(event))
    document.removeEventListener("pointerout", (event) => this.tooltipOut(event))
    document.removeEventListener("pointermove", (event) => this.tooltipMove(event))
  }
}

export default Tooltip;
