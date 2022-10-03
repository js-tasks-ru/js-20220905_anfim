class Tooltip {
  static prevTooltip
  element

  constructor() {
    if (Tooltip.prevTooltip) {
      return Tooltip.prevTooltip
    }
    // this.render()
    Tooltip.prevTooltip = this;
  }

  initialize () {
    this.addListeners()
  }
  
  addListeners() {
    document.addEventListener('pointerover', this.tooltipOver)
    document.addEventListener('pointerout', this.tooltipOut)
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

  tooltipOver = event => {
    if (!event.target.dataset.tooltip) return
    this.render()
    document.body.append(this.element);
    this.element.innerHTML = event.target.dataset.tooltip
    event.target.addEventListener('pointermove', this.tooltipMove)
  }

  tooltipMove = event => {
    const paddingX = 10
    const paddingY = 5
    this.element.style.left = event.pageX + paddingX + 'px';
    this.element.style.top = event.pageY + paddingY + 'px'
  }

  tooltipOut = event => {
    this.element?.remove()
    event.target.removeEventListener('pointermove', this.tooltipMove)
  }


  remove() {
    this.element?.remove()
  }

  destroy() {
    this.remove()
    document.removeEventListener("pointerover", this.tooltipOver)
    document.removeEventListener("pointerout", this.tooltipOut)
    document.removeEventListener("pointermove", this.tooltipMove)
  }
}

export default Tooltip;
